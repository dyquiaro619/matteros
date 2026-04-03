export const dynamic = "force-dynamic";

export default function MattersPage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Matters</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Active cases and matter management</p>
      </div>

      <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
        <div className="text-4xl mb-4">⚖️</div>
        <h2 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>Matter Management</h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
          Full matter tracking, deadlines, document management, and case timelines are coming soon.
          Matters created from intake are already being stored and will appear here.
        </p>
        <a href="/app/intake"
          className="mt-6 text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }}>
          ← Back to Intake Queue
        </a>
      </div>
    </div>
  );
}
