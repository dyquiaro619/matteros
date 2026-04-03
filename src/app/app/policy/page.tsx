export const dynamic = "force-dynamic";

export default function PolicyPage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Policy Monitor</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Immigration policy changes and regulatory updates</p>
      </div>

      <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
        <div className="text-4xl mb-4">📡</div>
        <h2 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>Policy Monitor</h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
          Real-time tracking of USCIS policy memos, BIA decisions, circuit court rulings, and TPS designations.
          Automated alerts for changes that affect your active matters are coming soon.
        </p>
        <div className="mt-6 flex gap-3 flex-wrap justify-center">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(59,130,246,0.1)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}>
            USCIS Policy Memos
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
            BIA Decisions
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(45,212,160,0.1)", color: "var(--teal)", border: "1px solid var(--teal-border)" }}>
            TPS Updates
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
            Circuit Court Rulings
          </span>
        </div>
        <a href="/app/intake"
          className="mt-6 text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }}>
          ← Back to Intake Queue
        </a>
      </div>
    </div>
  );
}
