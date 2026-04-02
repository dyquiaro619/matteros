import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MatterOS — Internal",
};

const T = { navy900: "#0f1923", navy800: "#141e2a", teal: "#2dd4a0", gray500: "#6b7280", gray400: "#9ca3af" };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: T.navy900 }}>
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: T.navy800, borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: T.teal, color: T.navy900 }}>
            AL
          </div>
          <span className="font-bold text-white text-sm">MatterOS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: "Intake Queue", href: "/app/intake", icon: "📋" },
            { label: "Matters", href: "/app/matters", icon: "⚖️" },
            { label: "Clients", href: "/app/clients", icon: "👤" },
            { label: "Policy Monitor", href: "/app/policy", icon: "📡" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: T.gray400 }}
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a
            href="/login"
            className="flex items-center gap-2 text-xs transition-colors hover:text-white"
            style={{ color: T.gray500 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
