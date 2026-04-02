export default function IntakeDashboardMockup() {
  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: "#0d1117" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        </div>
        <div
          className="flex-1 rounded-md px-3 py-1 text-xs flex items-center gap-2"
          style={{
            background: "#1a2332",
            color: "#6b7280",
            maxWidth: "340px",
            margin: "0 auto",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <path
              d="M10 5a4 4 0 11-8 0 4 4 0 018 0z"
              stroke="#2dd4a0"
              strokeWidth="1.5"
            />
            <path d="M10.5 10.5l-2-2" stroke="#2dd4a0" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          app.matteros.com/intake-dashboard
        </div>
      </div>

      {/* App header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ background: "#141e2a", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div className="font-bold text-sm" style={{ color: "#2dd4a0" }}>
            MatterOS
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "rgba(45,212,160,0.1)", color: "#2dd4a0" }}
          >
            Intake Dashboard
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{ background: "#2dd4a0", color: "#0f1923" }}
          >
            + New Intake
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#1e293b", color: "#9ca3af" }}
          >
            JA
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div style={{ background: "#0f1923" }} className="p-4">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: "Active Intakes", value: "47", sub: "+8 this week" },
            { label: "Detained (Urgent)", value: "3", sub: "Habeas active", teal: true },
            { label: "Awaiting Docs", value: "12", sub: "Client action" },
            { label: "Policy Flags", value: "6", sub: "Review needed", warn: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3"
              style={{
                background: stat.teal
                  ? "rgba(45,212,160,0.08)"
                  : stat.warn
                  ? "rgba(251,191,36,0.06)"
                  : "#1a2332",
                border: `1px solid ${
                  stat.teal
                    ? "rgba(45,212,160,0.2)"
                    : stat.warn
                    ? "rgba(251,191,36,0.15)"
                    : "rgba(255,255,255,0.05)"
                }`,
              }}
            >
              <div
                className="text-xl font-bold"
                style={{
                  color: stat.teal ? "#2dd4a0" : stat.warn ? "#fbbf24" : "#ffffff",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium text-white mt-0.5">{stat.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Intake queue */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{
              background: "#141e2a",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-xs font-semibold text-white">Intake Queue — Sorted by Urgency</span>
            <span className="text-xs" style={{ color: "#6b7280" }}>
              47 cases
            </span>
          </div>

          {/* PINNED: Detained client */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{
              background: "rgba(239,68,68,0.06)",
              borderColor: "rgba(239,68,68,0.15)",
            }}
          >
            <div className="flex-shrink-0">
              <div
                className="text-xs font-bold px-1.5 py-0.5 rounded"
                style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}
              >
                DETAINED
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                M. Hernandez — Removal Defense
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                Detained: 14 days • Hearing: Apr 8 • NTA served
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div
                className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}
              >
                ⏱ HABEAS: 3 days
              </div>
              <div className="text-xs mt-1" style={{ color: "#6b7280" }}>
                74% complete
              </div>
            </div>
          </div>

          {/* Regular clients */}
          {[
            {
              name: "A. Diallo",
              type: "Asylum (I-589)",
              status: "Narrative in progress",
              complete: 62,
              flag: "Policy flag",
            },
            {
              name: "F. Ortega",
              type: "TPS — El Salvador",
              status: "Missing I-94",
              complete: 45,
              flag: null,
            },
            {
              name: "J. Baptiste",
              type: "Asylum (I-589)",
              status: "Voice narrative recorded",
              complete: 88,
              flag: "1-yr deadline: 23 days",
            },
            {
              name: "R. Vasquez",
              type: "TPS — Honduras",
              status: "Awaiting documents",
              complete: 30,
              flag: null,
            },
          ].map((client, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "#1e293b", color: "#9ca3af" }}
              >
                {client.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {client.name}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: client.type.includes("Asylum")
                        ? "rgba(139,92,246,0.15)"
                        : "rgba(59,130,246,0.15)",
                      color: client.type.includes("Asylum") ? "#a78bfa" : "#93c5fd",
                    }}
                  >
                    {client.type}
                  </span>
                  {client.flag && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(251,191,36,0.1)",
                        color: "#fbbf24",
                      }}
                    >
                      ⚑ {client.flag}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  {client.status}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div
                  className="w-16 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${client.complete}%`,
                      background: client.complete > 80 ? "#2dd4a0" : client.complete > 50 ? "#fbbf24" : "#6b7280",
                    }}
                  />
                </div>
                <span className="text-xs w-7 text-right" style={{ color: "#6b7280" }}>
                  {client.complete}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
