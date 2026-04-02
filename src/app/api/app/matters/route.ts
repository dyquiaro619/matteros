import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { convertSubmissionToMatter } from "@/lib/intake/convert";
import { MatterType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { submissionId, title, type, jurisdictionOffice, organizationId } =
    body as {
      submissionId: string;
      title: string;
      type: MatterType;
      jurisdictionOffice?: string;
      organizationId?: string;
    };

  if (!submissionId || !title || !type) {
    return NextResponse.json({ error: "submissionId, title, and type are required" }, { status: 400 });
  }

  try {
    const { matter } = await convertSubmissionToMatter({
      submissionId,
      title,
      type,
      jurisdictionOffice,
      organizationId,
      convertedById: user.id,
    });
    return NextResponse.json({ matterId: matter.id, matter });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
