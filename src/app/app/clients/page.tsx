export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Clients</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Client profiles and contact management</p>
      </div>

      <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
        <div className="text-4xl mb-4">👤</div>
        <h2 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>Client Profiles</h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
          Centralized client records, contact history, matter associations, and document storage are coming soon.
          Client data captured during intake is already being saved.
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
