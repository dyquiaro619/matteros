import type { Metadata } from "next";
import AppSidebar from "./AppSidebar";

export const metadata: Metadata = {
  title: "MatterOS — Internal",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-app)" }}>
      <AppSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
