"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { label: "Intake Queue", href: "/app/intake", icon: "📋" },
  { label: "Matters",      href: "/app/matters", icon: "⚖️" },
  { label: "Clients",      href: "/app/clients",  icon: "👤" },
  { label: "Policy Monitor", href: "/app/policy", icon: "📡" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-0 h-screen"
      style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-subtle)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
          style={{ background: "var(--teal)", color: "var(--teal-fg)" }}>
          AL
        </div>
        <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>MatterOS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--teal-bg)" : "transparent",
                color: active ? "var(--teal)" : "var(--text-secondary)",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 space-y-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <ThemeToggle />
        <a href="/login" className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9 10l3-3-3-3M12 7H5"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign out
        </a>
      </div>
    </aside>
  );
}
