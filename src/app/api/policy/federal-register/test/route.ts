import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type FRDoc = {
  document_number: string;
  title?: string | null;
  abstract?: string | null;
  publication_date?: string | null;
  html_url?: string | null;
  pdf_url?: string | null;
};

type Factors = {
  countries: string[];
  programs: string[];
};

function normalizeToken(s: string) {
  return s.trim().toLowerCase();
}

function intersects(a: string[], b: string[]) {
  const setB = new Set(b.map(normalizeToken));
  return a.some((x) => setB.has(normalizeToken(x)));
}

function extractFactors(doc: FRDoc): Factors {
  const text = `${doc.title ?? ""} ${doc.abstract ?? ""}`.toLowerCase();

  const countries: string[] = [];
  const programs: string[] = [];

  // --- 1. TPS detection ---
  if (/\btemporary protected status\b/i.test(text) || /\btps\b/i.test(text)) {
    programs.push("TPS");
  }

  // --- 2. Extract country dynamically from TPS termination notices ---
  const tpsMatch = text.match(
    /designation of ([a-z\s\(\)]+?) for temporary protected status/i
  );

  if (tpsMatch) {
    const country = tpsMatch[1]
      .replace(/\(.*?\)/g, "") // убрать (Myanmar)
      .trim()
      .toLowerCase();

    countries.push(country);
  }

  // --- 3. Other program matchers ---
  if (text.includes("parole")) programs.push("PAROLE");
  if (text.includes("fee") || text.includes("fees")) programs.push("FEES");

  return { countries, programs };
}

function isPolicyRelevant(doc: FRDoc): boolean {
  const text = `${doc.title ?? ""} ${doc.abstract ?? ""}`.toLowerCase();
  return (
    text.includes("temporary protected status") ||
    text.includes("termination of the designation") ||
    text.includes("parole") ||
    text.includes("immigration fee") ||
    text.includes("immigration fees")
  );
}

export async function POST(req: Request) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) return NextResponse.json({ error: "X-Org-Id header required" }, { status: 400 });

  const url =
    "https://www.federalregister.gov/api/v1/documents.json" +
    "?conditions[agencies][]=u-s-citizenship-and-immigration-services&order=newest&per_page=1";

    const r = await fetch(url);
    const data = await r.json();
  

  const docs: FRDoc[] = data?.results ?? [];
  console.log(`Received ${docs.length} documents from Federal Register feed for org ${orgId}`);

  if (!Array.isArray(docs) || docs.length === 0) {
    return NextResponse.json({ ok: true, docsChecked: 0, docsRelevant: 0, totalImpacted: 0, created: [] });
  }

  // 1) Загружаем matters один раз (не в цикле)
  const matters = await prisma.matter.findMany({
    where: { organizationId: orgId },
    select: { id: true, title: true, caseProfile: true }, // caseProfile должен существовать
  });

  const report: Array<{
    documentNumber: string;
    title: string | null;
    factors: Factors;
    impactedCount: number;
    createdCount: number;
    skippedReason?: string;
  }> = [];

  const created: Array<{ matterId: string; policyEventId: string; riskEventId: string; documentNumber: string }> = [];

  let docsRelevant = 0;
  let totalImpacted = 0;

  // 2) Бежим по документам
  for (const doc of docs) {
    if (!doc?.document_number) continue;
    console.log(`Processing document ${doc.document_number} - ${doc.title}`);
    // фильтр “релевантности” — иначе будешь мусорить событиями про “Paperwork Reduction Act”
    if (!isPolicyRelevant(doc)) {
      report.push({
        documentNumber: doc.document_number,
        title: doc.title ?? null,
        factors: { countries: [], programs: [] },
        impactedCount: 0,
        createdCount: 0,
        skippedReason: "not-policy-relevant",
      });
      continue;
    }

    docsRelevant += 1;

    const factors = extractFactors(doc);

    // если вообще ничего не извлеклось — не создаём события
    if ((factors.countries.length === 0) && (factors.programs.length === 0)) {
      report.push({
        documentNumber: doc.document_number,
        title: doc.title ?? null,
        factors,
        impactedCount: 0,
        createdCount: 0,
        skippedReason: "no-factors-extracted",
      });
      continue;
    }

    const impacted = matters.filter((m) => {
      const p = (m.caseProfile ?? {}) as any;
      const mCountries = Array.isArray(p.countries) ? p.countries : [];
      const mPrograms = Array.isArray(p.programs) ? p.programs : [];

      const countryHit = factors.countries.length === 0 ? true : intersects(mCountries, factors.countries);
      const programHit = factors.programs.length === 0 ? true : intersects(mPrograms, factors.programs);

      // Логика:
      // - если у дока есть страны, сравниваем страны
      // - если у дока есть программы, сравниваем программы
      // - в итоге нужно, чтобы совпали оба измерения, которые вообще заданы в factors
      return countryHit && programHit;
    });

    totalImpacted += impacted.length;

    // 3) Создаём события (лучше транзакцией и с дедупом)
    // дедуп: не создавать POLICY_CHANGED для того же documentNumber в той же matter повторно
    // сделаем проверку одним запросом на matterId+documentNumber (через payload фильтр сложно, поэтому простой подход: ищем уже созданные события и не создаём повторно)
    // В v1 можно обойтись без дедупа, но в проде это обязательно.

    let createdForDoc = 0;

    for (const m of impacted) {
      // (опционально) дедуп: если уже есть POLICY_CHANGED с этим doc_number — skip
      const existing = await prisma.matterEvent.findFirst({
        where: {
          matterId: m.id,
          type: "POLICY_CHANGED",
          // если prisma позволяет json path filter — можно сюда
        },
        orderBy: { createdAt: "desc" },
      });

      // Если ты пока не можешь дедупать по payload — хотя бы дедупай “последним событием”
      // это грубо, но лучше чем ничего:
      if (existing?.payload && (existing.payload as any)?.documentNumber === doc.document_number) {
        continue;
      }

      const [policyEvent, riskEvent] = await prisma.$transaction([
        prisma.matterEvent.create({
          data: {
            matterId: m.id,
            type: "POLICY_CHANGED",
            payload: {
              source: "federalregister",
              documentNumber: doc.document_number,
              title: doc.title ?? null,
              publicationDate: doc.publication_date ?? null,
              urls: { html: doc.html_url ?? null, pdf: doc.pdf_url ?? null },
              factors,
            },
          },
        }),
        prisma.matterEvent.create({
          data: {
            matterId: m.id,
            type: "RISK_FLAGGED",
            payload: {
              severity: "high",
              reason: `Policy update may impact this matter: ${doc.title ?? doc.document_number}`,
              source: "RULE",
              policyDocumentNumber: doc.document_number,
            },
          },
        }),
      ]);

      created.push({ matterId: m.id, policyEventId: policyEvent.id, riskEventId: riskEvent.id, documentNumber: doc.document_number });
      createdForDoc += 1;
    }

    report.push({
      documentNumber: doc.document_number,
      title: doc.title ?? null,
      factors,
      impactedCount: impacted.length,
      createdCount: createdForDoc,
    });
  }

  return NextResponse.json({
    ok: true,
    docsChecked: docs.length,
    docsRelevant,
    totalImpacted,
    report,
    created,
  });
}