import type { Metadata } from "next";
import FAQ from "./components/FAQ";
import ROICalculator from "./components/ROICalculator";
import IntakeDashboardMockup from "./components/IntakeDashboardMockup";

export const metadata: Metadata = {
  title: "MatterOS Intake — Trauma-Informed Intake for Immigration Firms | Automation Legal",
  description:
    "AI-powered intake automation for asylum, TPS, and removal defense firms. Voice-to-text persecution narratives, WhatsApp delivery, Habeas Clock, and policy risk flags on every new case.",
  openGraph: {
    title: "MatterOS Intake — Trauma-Informed Intake for Immigration Firms",
    description:
      "AI-powered intake automation for asylum, TPS, and removal defense firms. Voice-to-text persecution narratives, WhatsApp delivery, Habeas Clock, and policy risk flags on every new case.",
    type: "website",
  },
};

/* ─── tiny design tokens ─────────────────────────────────────────────────── */
const T = {
  navy900: "#0f1923",
  navy800: "#141e2a",
  navy700: "#1a2332",
  navy600: "#1e293b",
  teal: "#2dd4a0",
  white: "#ffffff",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  cardBorder: "rgba(255,255,255,0.06)",
};

/* ─── shared section helpers ─────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-widest mb-3"
      style={{ color: T.teal }}
    >
      {children}
    </p>
  );
}

function TealCheck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="9" cy="9" r="9" fill="rgba(45,212,160,0.15)" />
      <path
        d="M5.5 9l2.5 2.5 4.5-5"
        stroke="#2dd4a0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RedX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="9" cy="9" r="9" fill="rgba(239,68,68,0.15)" />
      <path
        d="M6 6l6 6M12 6l-6 6"
        stroke="#f87171"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <path
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.344 0-2.189-1.458-1.515-2.625L8.485 2.495z"
        fill="rgba(251,191,36,0.15)"
        stroke="#fbbf24"
        strokeWidth="1.5"
      />
      <path d="M10 7v4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="0.75" fill="#fbbf24" />
    </svg>
  );
}

/* ─── Navigation ─────────────────────────────────────────────────────────── */
function Nav() {
  const links = ["MatterOS", "Intake System", "Interactive Tools", "Why Us", "Resources"];
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(15,25,35,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.cardBorder}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: T.teal, color: T.navy900 }}
          >
            AL
          </div>
          <span className="font-bold text-white text-sm hidden sm:block">
            Automation Legal
          </span>
          <span className="hidden sm:block text-xs" style={{ color: T.gray500 }}>
            ×
          </span>
          <span
            className="hidden sm:block font-semibold text-sm"
            style={{ color: T.teal }}
          >
            MatterOS
          </span>
        </a>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm transition-colors hover:text-white"
              style={{ color: T.gray400 }}
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#founding-partner"
          className="text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
          style={{ background: T.teal, color: T.navy900 }}
        >
          Apply for Pilot Program
        </a>
      </div>
    </nav>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      style={{
        background: T.navy900,
        borderTop: `1px solid ${T.cardBorder}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ background: T.teal, color: T.navy900 }}
              >
                AL
              </div>
              <span className="font-bold text-white text-sm">Automation Legal</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: T.gray500 }}>
              Building practice management tools for the next generation of immigration law.
            </p>
            <p className="text-xs mt-4 font-semibold" style={{ color: T.teal }}>
              Automation Legal × MatterOS
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "MatterOS", "Intake System", "Why Us", "Resources"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: T.gray500 }}
                    >
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              {["Meet Liz", "Apply for Pilot", "Partner With Us", "Press"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: T.gray500 }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Data Processing", "Security"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: T.gray500 }}
                    >
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${T.cardBorder}` }}
        >
          <p className="text-xs" style={{ color: T.gray500 }}>
            © 2025 Automation Legal. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: T.gray500 }}>
            100+ law firms automated since 2018 • Built for humanitarian immigration
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────────────────── */
export default function IntakeLandingPage() {
  return (
    <>
      <Nav />

      {/* ── SECTION 1: Hero ──────────────────────────────────────────────── */}
      <section
        className="pt-32 pb-20 px-5 sm:px-8 relative overflow-hidden"
        style={{ background: T.navy900 }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,212,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,160,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(45,212,160,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
              style={{
                background: "rgba(45,212,160,0.1)",
                border: "1px solid rgba(45,212,160,0.25)",
                color: T.teal,
              }}
            >
              <span>✦</span>
              Now Accepting Founding Partners — Asylum, TPS & Removal Defense Practices
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-center font-bold leading-tight mb-6 text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", maxWidth: "820px", margin: "0 auto 24px" }}>
            Your Paralegals Shouldn&apos;t Spend 5 Hours on Intake When a Client Is{" "}
            <span style={{ color: T.teal }}>in Crisis</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-center text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ color: T.gray400 }}
          >
            MatterOS Intake is trauma-informed, mobile-first intake automation built
            specifically for humanitarian immigration firms. AI extracts documents. Guided
            narratives replace blank text fields. And the moment a case enters the system,
            it&apos;s matched against the policy environment.
          </p>

          {/* Value props */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 sm:gap-8 mb-10 max-w-3xl mx-auto">
            {[
              "60% faster intake — from hours to minutes",
              "Trauma-informed asylum narrative with voice-to-text",
              "Policy risk flags on every new case, automatically",
            ].map((prop) => (
              <div key={prop} className="flex items-start gap-2">
                <TealCheck />
                <span className="text-sm font-medium text-white leading-snug">
                  {prop}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <a
              href="#founding-partner"
              className="font-semibold px-7 py-3.5 rounded-lg text-sm transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ background: T.teal, color: T.navy900 }}
            >
              Get Your Free Policy Impact Scan →
            </a>
            <a
              href="#how-it-works"
              className="font-semibold px-7 py-3.5 rounded-lg text-sm transition-all hover:bg-white/5 whitespace-nowrap"
              style={{
                border: `1.5px solid ${T.teal}`,
                color: T.teal,
              }}
            >
              See How It Works
            </a>
          </div>
          <p className="text-center text-xs mb-14" style={{ color: T.gray500 }}>
            Built by Automation Legal • Designed for firms handling 50+ asylum/TPS cases
          </p>

          {/* Dashboard Mockup */}
          <IntakeDashboardMockup />
        </div>
      </section>

      {/* ── SECTION 2: Problem Statement ─────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: T.white }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-14"
            style={{ color: T.navy900 }}
          >
            Why Intake Is the Bottleneck That&apos;s Costing You Cases
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Problems */}
            <div className="space-y-7">
              {[
                {
                  title: "Document chasing consumes more time than case prep",
                  desc: "Clients email documents one at a time. Paralegals chase missing items for weeks. By the time a file is complete, deadlines are already tight.",
                },
                {
                  title: "Persecution narratives get stuck in blank text fields",
                  desc: "Asylum clients freeze when they see an empty box asking them to describe trauma. The narrative — the single most important element of the case — stalls.",
                },
                {
                  title: "Detained clients have hours, not weeks",
                  desc: "When a client is in ICE custody, every hour of intake delay is an hour closer to a missed hearing or a habeas deadline.",
                },
                {
                  title: "No tool connects intake to policy changes",
                  desc: "You finish an intake on Monday. A policy memo drops on Tuesday. You have no idea it affects the case you just opened.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(251,191,36,0.1)" }}
                  >
                    <WarningIcon />
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-base mb-1"
                      style={{ color: T.navy900 }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Day in the Life timeline */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "#f8f9fa",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3
                className="font-bold text-base mb-6"
                style={{ color: T.navy900 }}
              >
                A Day in the Life
              </h3>
              <div className="relative">
                <div
                  className="absolute left-11 top-0 bottom-0 w-px"
                  style={{ background: "#e5e7eb" }}
                />
                <div className="space-y-5">
                  {[
                    {
                      time: "8:00 AM",
                      text: "Client calls from detention center. Can't access email. Needs to complete intake by phone.",
                    },
                    {
                      time: "9:15 AM",
                      text: "Paralegal re-entering the same client data into three different forms.",
                    },
                    {
                      time: "10:30 AM",
                      text: "Asylum client sends passport photo via text message. Paralegal manually types every field.",
                    },
                    {
                      time: "11:45 AM",
                      text: 'Attorney asks: "Is the persecution narrative done yet?" It\'s a blank text field the client hasn\'t touched in 2 weeks.',
                    },
                    {
                      time: "1:00 PM",
                      text: "New TPS memo drops. No way to know which of your 80 active TPS cases are affected.",
                    },
                    {
                      time: "2:30 PM",
                      text: "Chasing a client for their I-94. They don't know what an I-94 is.",
                    },
                    {
                      time: "4:00 PM",
                      text: "Realize a detained client's habeas window closes in 3 days. Nobody flagged it.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div
                        className="text-xs font-bold w-16 text-right flex-shrink-0 pt-0.5"
                        style={{ color: T.teal }}
                      >
                        {item.time}
                      </div>
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1 z-10"
                        style={{ background: T.teal }}
                      />
                      <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary line */}
          <div className="text-center mt-14">
            <p
              className="text-xl font-bold"
              style={{ color: T.navy900 }}
            >
              Your paralegals are drowning. Your clients are in crisis. And policy changes
              keep coming.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: What You've Already Tried ─────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: T.navy800 }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>What You&apos;ve Already Tried</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Why It Didn&apos;t Work
          </h2>
          <p className="mb-12 text-base" style={{ color: T.gray400 }}>
            Every workaround has a ceiling. Here&apos;s where each one breaks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              {
                name: "Email & Phone Intake",
                get: "Flexibility",
                reality: "Documents scattered across inboxes.",
                problem:
                  "You lose 3–5 hours per case just organizing what the client sent.",
              },
              {
                name: "Generic Form Tools (Typeform, JotForm)",
                get: "Digital forms",
                reality: "Not built for persecution narratives or missing documents.",
                problem:
                  "Asylum clients abandon forms. Detained clients can't access them.",
              },
              {
                name: "Case Management Intake (Docketwise, INSZoom)",
                get: "Integrated intake",
                reality: "Designed for business immigration, adapted as afterthought.",
                problem:
                  "No voice-to-text. No trauma-informed design. No policy awareness.",
              },
              {
                name: "Manual Paralegal Process",
                get: "Human judgment",
                reality: "Doesn't scale.",
                problem:
                  "Your best paralegal can only intake so many cases per day. Burnout is constant.",
              },
            ].map((card) => (
              <div
                key={card.name}
                className="rounded-2xl p-6"
                style={{
                  background: T.navy700,
                  border: `1px solid ${T.cardBorder}`,
                }}
              >
                <h3 className="font-bold text-white text-sm mb-4 leading-snug">
                  {card.name}
                </h3>
                <div className="space-y-3">
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: T.gray500 }}
                    >
                      You get
                    </span>
                    <p className="text-sm text-white mt-0.5">{card.get}</p>
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: T.gray500 }}
                    >
                      Reality
                    </span>
                    <p className="text-sm text-white mt-0.5">{card.reality}</p>
                  </div>
                  <div
                    className="pt-3 border-t"
                    style={{ borderColor: T.cardBorder }}
                  >
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#f87171" }}
                    >
                      Problem
                    </span>
                    <p className="text-sm mt-0.5" style={{ color: T.gray400 }}>
                      {card.problem}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div
            className="rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto text-center relative"
            style={{
              background: T.navy700,
              border: `1px solid rgba(45,212,160,0.15)`,
            }}
          >
            <div
              className="absolute -top-4 left-8 text-6xl leading-none font-serif"
              style={{ color: "rgba(45,212,160,0.3)" }}
            >
              "
            </div>
            <p className="text-lg sm:text-xl font-medium text-white leading-relaxed relative z-10">
              Immigration attorneys don&apos;t need another form builder. They need intake that
              understands their clients are in crisis and their caseload is exposed to policy
              changes.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: How It Works ───────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 px-5 sm:px-8"
        style={{ background: T.white }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>
            <span style={{ color: T.teal }}>HOW IT WORKS</span>
          </SectionLabel>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-14"
            style={{ color: T.navy900 }}
          >
            From Crisis to Case-Ready in Three Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Client completes intake on their phone",
                body: "Trauma-informed forms with guided persecution narrative, voice-to-text 'Record My Story' button, and magic links via WhatsApp or SMS. Missing a document? That's fine — the intake keeps going. Multilingual: English and Spanish at launch.",
                tag: "WhatsApp + SMS ready",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 12h8M12 8v8"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "AI extracts documents and flags vulnerabilities",
                body: "Client photographs their passport, I-94, or NTA. Claude Vision extracts structured data instantly. The persecution narrative is analyzed for vulnerability keywords that help attorneys identify legal arguments. Confidence scoring on every extracted field.",
                tag: "AI-powered",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="3"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 12l3 3 7-7"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Case enters MatterOS with policy risk flags",
                body: "The moment an intake completes, it becomes a Matter record. The policy matching engine scans it against current conditions. Detained clients trigger a Habeas Clock. TPS cases check designation status. Asylum intakes flag one-year filing deadlines. Your dashboard shows what needs attention and why.",
                tag: "Policy-aware from day one",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L3 7l9 5 9-5-9-5z"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 12l9 5 9-5M3 17l9 5 9-5"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-2xl p-7 relative"
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #e5e7eb",
                }}
              >
                {/* Number */}
                <div
                  className="text-5xl font-black absolute top-5 right-6 select-none"
                  style={{ color: "rgba(45,212,160,0.08)", lineHeight: 1 }}
                >
                  {step.num}
                </div>
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(45,212,160,0.1)" }}
                >
                  {step.icon}
                </div>
                <h3
                  className="font-bold text-lg mb-3 leading-snug"
                  style={{ color: T.navy900 }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#4b5563" }}>
                  {step.body}
                </p>
                <span
                  className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(45,212,160,0.1)",
                    color: T.teal,
                    border: "1px solid rgba(45,212,160,0.2)",
                  }}
                >
                  {step.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Feature Deep Dive ──────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: T.navy900 }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>BUILT FOR HUMANITARIAN CASELOADS</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Every Feature Exists Because a Paralegal Asked For It
          </h2>
          <p className="mb-12 text-base max-w-2xl" style={{ color: T.gray400 }}>
            No enterprise bloat. No business immigration afterthoughts. Built from real
            conversations with asylum and TPS paralegals.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Habeas Clock",
                body: "When an intake is marked 'detained,' a 10-day habeas review clock starts automatically. Detained intakes pin to the top of your queue with a countdown to next hearing date and total days in custody.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="9" stroke="#2dd4a0" strokeWidth="1.5" />
                    <path
                      d="M11 6v5l3 3"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                title: "Voice-to-Text Narrative",
                body: "A large 'Record My Story' button lets asylum clients speak their persecution narrative instead of typing. Removes the biggest barrier to completing the most critical section of the case.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="8" y="2" width="6" height="12" rx="3" stroke="#2dd4a0" strokeWidth="1.5" />
                    <path
                      d="M4 11c0 3.866 3.134 7 7 7s7-3.134 7-7M11 18v3"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                title: "WhatsApp & SMS Gateway",
                body: "Magic links delivered via WhatsApp or SMS — not just email. Clients photograph and upload documents directly from the chat link. No app download. No account creation.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 3V6a2 2 0 012-2z"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                title: "AI Vulnerability Flagging",
                body: "The AI highlights mentions of specific harm in the narrative: domestic violence, political threats, gender-based persecution. These flags surface on the attorney's dashboard for legal argument development.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M11 2l2.09 6.26L19 9.27l-5 4.14L15.18 20 11 16.77 6.82 20 8 13.41 3 9.27l5.91-1.01L11 2z"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                title: "Missing Document Tolerance",
                body: "Clients select 'I don't have this' or 'Confiscated' for any document. The intake continues. The paralegal is notified of the document gap immediately. Intake never blocks.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-4-6z"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path d="M9 13h4M9 17h4M14 2v6h4" stroke="#2dd4a0" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                title: "Policy Risk at Intake",
                body: "The moment an intake completes, MatterOS cross-references the case against current policy snapshots. New TPS designation changes, credible fear standard shifts, enforcement priority updates — flagged before the case is even fully filed.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M11 2a9 9 0 100 18A9 9 0 0011 2z"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11 7v4l3 2"
                      stroke="#2dd4a0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl p-6"
                style={{
                  background: T.navy700,
                  border: `1px solid ${T.cardBorder}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(45,212,160,0.1)" }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: T.gray400 }}>
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Comparison Table ───────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8 overflow-x-auto"
        style={{ background: T.white }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>
            <span style={{ color: T.teal }}>COMPARISON</span>
          </SectionLabel>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-12"
            style={{ color: T.navy900 }}
          >
            MatterOS Intake vs. Everything Else
          </h2>

          <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #e5e7eb" }}>
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr>
                  <th
                    className="text-left px-6 py-4 font-semibold text-sm"
                    style={{ color: T.navy900, background: "#f8f9fa", width: "30%" }}
                  >
                    Capability
                  </th>
                  {[
                    { label: "Email / Phone", highlight: false },
                    { label: "Generic Forms", highlight: false },
                    { label: "Case Mgmt Intake", highlight: false },
                    { label: "MatterOS Intake", highlight: true },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className="px-6 py-4 font-bold text-center text-sm"
                      style={{
                        background: col.highlight ? T.teal : "#f8f9fa",
                        color: col.highlight ? T.navy900 : T.navy900,
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="comparison-table">
                {[
                  {
                    cap: "Trauma-informed design",
                    vals: ["✗", "✗", "✗", "✓"],
                  },
                  {
                    cap: "Voice-to-text narrative",
                    vals: ["✗", "✗", "✗", "✓"],
                  },
                  {
                    cap: "WhatsApp/SMS delivery",
                    vals: ["✗", "✗", "✗", "✓"],
                  },
                  {
                    cap: "AI document extraction",
                    vals: ["✗", "✗", "Partial", "✓ with confidence scoring"],
                  },
                  {
                    cap: "Missing document tolerance",
                    vals: ["✗", "✗", "✗", "✓"],
                  },
                  {
                    cap: "Habeas Clock for detained",
                    vals: ["✗", "✗", "✗", "✓"],
                  },
                  {
                    cap: "Policy risk flags at intake",
                    vals: ["✗", "✗", "✗", "✓"],
                  },
                  {
                    cap: "Immutable audit trail",
                    vals: ["✗", "✗", "Partial", "✓ cryptographic ledger"],
                  },
                  {
                    cap: "Built for asylum/TPS/removal",
                    vals: ["✗", "✗", "Adapted", "✓ built first"],
                  },
                ].map((row, ri) => (
                  <tr key={row.cap} style={{ background: ri % 2 === 0 ? "#ffffff" : "#f8f9fa" }}>
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: T.navy900, borderBottom: "1px solid #e5e7eb" }}
                    >
                      {row.cap}
                    </td>
                    {row.vals.map((v, vi) => (
                      <td
                        key={vi}
                        className="px-6 py-4 text-center font-medium"
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          background:
                            vi === 3
                              ? "rgba(45,212,160,0.05)"
                              : undefined,
                          color:
                            v === "✓" || v.startsWith("✓")
                              ? T.teal
                              : v === "✗"
                              ? "#d1d5db"
                              : "#fbbf24",
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: ROI Calculator ─────────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: T.navy800 }}
      >
        <div className="max-w-5xl mx-auto">
          <SectionLabel>ROI CALCULATOR</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Calculate Your Intake Time Savings
          </h2>
          <p className="mb-12 text-base" style={{ color: T.gray400 }}>
            Adjust the inputs to see what MatterOS Intake would save your practice per year.
          </p>
          <ROICalculator />
        </div>
      </section>

      {/* ── SECTION 8: Case Types ─────────────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: T.white }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>
            <span style={{ color: T.teal }}>CASE TYPES</span>
          </SectionLabel>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-12"
            style={{ color: T.navy900 }}
          >
            Built for the Cases Other Tools Treat as an Afterthought
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                type: "Asylum (I-589)",
                body: "Guided persecution narrative with structured prompts. Voice-to-text. AI vulnerability flagging. One-year filing deadline tracking. Country condition auto-sourcing. The most complex intake, made manageable.",
                color: "#7c3aed",
                bg: "rgba(124,58,237,0.08)",
              },
              {
                type: "Temporary Protected Status (I-821)",
                body: "Continuous residence evidence collection across months or years. TPS designation status checking. Re-registration tracking. WhatsApp delivery for clients without consistent email.",
                color: "#2563eb",
                bg: "rgba(37,99,235,0.08)",
              },
              {
                type: "Removal Defense (NTA Response)",
                body: "Habeas Clock for detained clients. NTA charge extraction via AI. Relief eligibility screening. Bond documentation tracking. The most urgent intake, made fastest.",
                color: "#dc2626",
                bg: "rgba(220,38,38,0.08)",
              },
            ].map((card) => (
              <div
                key={card.type}
                className="rounded-2xl p-7"
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.type}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          {/* Coming Soon pills */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: T.gray500 }}>
              Coming soon:
            </span>
            {["Humanitarian Parole", "VAWA", "U-Visa", "T-Visa"].map((item) => (
              <span
                key={item}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(45,212,160,0.08)",
                  border: "1px solid rgba(45,212,160,0.2)",
                  color: T.teal,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: Founding Partner Program ──────────────────────────── */}
      <section
        id="founding-partner"
        className="py-20 px-5 sm:px-8"
        style={{ background: T.navy900 }}
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>FOUNDING PARTNER PROGRAM</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Join as a Founding Partner
          </h2>
          <p className="mb-6 text-base" style={{ color: T.gray400 }}>
            Now accepting applications from immigration organizations managing 50+ asylum,
            TPS, or removal defense cases.
          </p>

          {/* Banner */}
          <div
            className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full mb-12"
            style={{ background: "rgba(45,212,160,0.12)", color: T.teal, border: "1px solid rgba(45,212,160,0.25)" }}
          >
            <span>✦</span> You&apos;re Not a Customer — You&apos;re a Founding Partner
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* What You Get */}
            <div
              className="rounded-2xl p-7"
              style={{ background: T.navy700, border: `1px solid ${T.cardBorder}` }}
            >
              <h3 className="font-bold text-lg text-white mb-6">What You Get</h3>
              <ul className="space-y-3">
                {[
                  "Founding Partner Pricing: $500/month ($6,000/year) — GA standard: $1,000+/month",
                  "5-hour guarantee: save 5 hrs/week in 30 days or pay nothing for year one",
                  "Done-for-you implementation in 2 weeks",
                  "Full intake tool: asylum, TPS, removal defense",
                  "AI document extraction + vulnerability flagging",
                  "WhatsApp/SMS gateway",
                  "Habeas Clock + detained client tracking",
                  "Policy risk flags on every new intake",
                  "Direct access to founder for 30 days",
                  "Grant ROI one-pager for your next funding application",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <TealCheck />
                    <span className="text-sm leading-snug" style={{ color: T.gray400 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Need */}
            <div
              className="rounded-2xl p-7"
              style={{ background: T.navy700, border: `1px solid ${T.cardBorder}` }}
            >
              <h3 className="font-bold text-lg text-white mb-6">What We Need From You</h3>
              <ul className="space-y-3">
                {[
                  "30-min onboarding call (week 1)",
                  "15-min monthly feedback session",
                  "Willingness to run real intakes through the system",
                  "Share your actual workflows (not idealized ones)",
                  "Optional: video testimonial after 30 days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <TealCheck />
                    <span className="text-sm leading-snug" style={{ color: T.gray400 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA in card */}
              <div className="mt-8">
                <a
                  href="#"
                  className="block text-center font-bold py-4 px-6 rounded-xl text-sm transition-opacity hover:opacity-90"
                  style={{ background: T.teal, color: T.navy900 }}
                >
                  Get Your Free Policy Impact Scan →
                </a>
                <p className="text-xs text-center mt-3" style={{ color: T.gray500 }}>
                  30-min call • No commitment • Immediate value
                </p>
              </div>
            </div>
          </div>

          {/* Pricing callout */}
          <div
            className="rounded-2xl p-8 text-center max-w-2xl mx-auto"
            style={{
              background: "rgba(45,212,160,0.06)",
              border: "1px solid rgba(45,212,160,0.2)",
            }}
          >
            <p className="font-bold text-white text-xl mb-2">
              Founding partner investment: $500/month — with a guarantee.
            </p>
            <p className="text-base mb-4" style={{ color: T.gray400 }}>
              If your team doesn&apos;t save 5 hours/week in 30 days, you pay nothing for the
              first year.
            </p>
            <p className="text-sm" style={{ color: T.gray500 }}>
              Standard pricing at GA: $1,000+/month. No guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: Who Should Apply ─────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: "#f8f9fa" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{ color: T.navy900 }}
          >
            Is This for You?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Who Should Apply */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: T.white,
                border: "1px solid #e5e7eb",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(45,212,160,0.12)" }}
                >
                  <TealCheck />
                </div>
                <h3 className="font-bold text-lg" style={{ color: T.navy900 }}>
                  Who Should Apply
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Immigration organizations with 5+ staff",
                  "Handling asylum, TPS, or removal defense cases",
                  "Processing 20+ new intakes per month",
                  "Paralegals spending 3+ hours per intake",
                  "Managing attorney or ops lead willing to champion adoption",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <TealCheck />
                    <span className="text-sm leading-snug" style={{ color: "#374151" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* This Is NOT For */}
            <div
              className="rounded-2xl p-8"
              style={{ background: T.white, border: "1px solid #e5e7eb" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)" }}
                >
                  <RedX />
                </div>
                <h3 className="font-bold text-lg" style={{ color: T.navy900 }}>
                  This Is NOT For
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Business immigration firms (H-1B, L-1 focused)",
                  "Solo practitioners with fewer than 10 cases/month",
                  "Firms expecting a finished product (this is early access)",
                  "Teams unwilling to provide feedback during the first month",
                  "Organizations without leadership buy-in",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <RedX />
                    <span className="text-sm leading-snug" style={{ color: "#374151" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 11: FAQ ───────────────────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: T.navy800 }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Questions We Always Get
          </h2>
          <FAQ />
        </div>
      </section>

      {/* ── SECTION 12: Final CTA ─────────────────────────────────────────── */}
      <section
        className="py-24 px-5 sm:px-8 relative overflow-hidden"
        style={{ background: T.navy900 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(45,212,160,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-bold text-white mb-6" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.2 }}>
            Your Clients Are in Crisis. Your Intake Should Work as Fast as They Need You To.
          </h2>
          <p className="text-lg mb-10 font-medium" style={{ color: T.teal }}>
            Join the founding partners building intake that actually understands humanitarian
            immigration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#"
              className="font-bold px-8 py-4 rounded-xl text-base transition-opacity hover:opacity-90"
              style={{ background: T.teal, color: T.navy900 }}
            >
              Get Your Free Policy Impact Scan →
            </a>
          </div>

          <p className="text-sm mb-10" style={{ color: T.gray500 }}>
            Now accepting applications from organizations managing 50+ asylum/TPS cases.
          </p>

          {/* Trust badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 pt-8"
            style={{ borderTop: `1px solid ${T.cardBorder}` }}
          >
            {[
              "Built by Automation Legal",
              "100+ law firms automated since 2018",
              "60-day working together guarantee",
            ].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: T.gray500 }}
              >
                <span style={{ color: T.teal }}>✦</span>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
