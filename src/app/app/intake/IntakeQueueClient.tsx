"use client";

import { useState } from "react";
import { IntakeStatus, MatterType } from "@prisma/client";
import { useRouter } from "next/navigation";
import GenerateLinkModal from "./components/GenerateLinkModal";

const T = {
  navy900: "var(--bg-app)", navy800: "var(--bg-card)", navy700: "var(--bg-input)",
  teal: "var(--teal)", tealFg: "var(--teal-fg)",
  gray400: "var(--text-secondary)", gray500: "var(--text-muted)",
};

type Submission = {
  id: string; status: IntakeStatus; clientName: string | null;
  clientEmail: string | null; clientPhone: string | null;
  matterType: MatterType | null; caseTypeLabel: string | null;
  countryOfOrigin: string | null; isDetained: boolean;
  submittedAt: string | null; createdAt: string; reviewedAt: string | null;
  matterId: string | null; _count: { documents: number };
};

const STATUS_COLORS: Record<IntakeStatus, { bg: string; text: string; label: string }> = {
  PENDING:     { bg: "rgba(107,114,128,0.15)", text: "#9ca3af", label: "Pending" },
  IN_PROGRESS: { bg: "rgba(59,130,246,0.15)",  text: "#93c5fd", label: "In Progress" },
  SUBMITTED:   { bg: "rgba(45,212,160,0.15)",  text: "#2dd4a0", label: "Submitted" },
  REVIEWED:    { bg: "rgba(139,92,246,0.15)",  text: "#a78bfa", label: "Reviewed" },
  CONVERTED:   { bg: "rgba(34,197,94,0.15)",   text: "#4ade80", label: "Matter Created" },
  REJECTED:    { bg: "rgba(239,68,68,0.15)",   text: "#f87171", label: "Rejected" },
};

const TABS: { label: string; status: IntakeStatus | "ALL" }[] = [
  { label: "Needs Review", status: IntakeStatus.SUBMITTED },
  { label: "In Progress",  status: IntakeStatus.IN_PROGRESS },
  { label: "Reviewed",     status: IntakeStatus.REVIEWED },
  { label: "All",          status: "ALL" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function IntakeQueueClient({
  submissions, counts,
}: { submissions: Submission[]; counts: Record<IntakeStatus, number> }) {
  const [activeTab, setActiveTab] = useState<IntakeStatus | "ALL">(IntakeStatus.SUBMITTED);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const router = useRouter();

  const filtered = activeTab === "ALL"
    ? submissions
    : submissions.filter((s) => s.status === activeTab);

  const detained = submissions.filter((s) => s.isDetained && s.status !== IntakeStatus.CONVERTED);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Intake Queue</h1>
          <p className="text-sm mt-0.5" style={{ color: T.gray500 }}>
            {counts[IntakeStatus.SUBMITTED] ?? 0} awaiting review
          </p>
        </div>
        <button
          onClick={() => setShowLinkModal(true)}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: T.teal, color: T.tealFg }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Intake Link
        </button>
      </div>

      {/* Detained alert */}
      {detained.length > 0 && (
        <div className="rounded-xl p-4 mb-5 flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#f87171" }} />
          <p className="text-sm font-semibold" style={{ color: "#f87171" }}>
            {detained.length} detained client{detained.length > 1 ? "s" : ""} — review immediately
          </p>
        </div>
      )}

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {TABS.map((tab) => {
          const count = tab.status === "ALL" ? submissions.length : (counts[tab.status] ?? 0);
          const active = activeTab === tab.status;
          return (
            <button key={tab.status} onClick={() => setActiveTab(tab.status)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: active ? T.teal : "var(--hover-bg)",
                color: active ? T.tealFg : T.gray400,
                border: active ? "none" : "1px solid var(--border-subtle)",
              }}>
              {tab.label}
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: active ? "rgba(0,0,0,0.12)" : "var(--hover-bg)" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Queue table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center" style={{ color: T.gray500 }}>
            <p className="text-sm">No intakes in this category</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: T.navy800, borderBottom: "1px solid var(--border-subtle)" }}>
                {["Client", "Case Type", "Status", "Submitted", "Docs", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                    style={{ color: T.gray500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const sc = STATUS_COLORS[s.status];
                return (
                  <tr key={s.id}
                    style={{
                      background: i % 2 === 0 ? T.navy900 : "var(--row-alt)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => router.push(`/app/intake/${s.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {s.isDetained && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}>
                            DETAINED
                          </span>
                        )}
                        <div>
                          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{s.clientName ?? "Unknown"}</p>
                          {s.countryOfOrigin && (
                            <p className="text-xs" style={{ color: T.gray500 }}>{s.countryOfOrigin}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium" style={{ color: T.gray400 }}>
                        {s.caseTypeLabel ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: T.gray500 }}>
                      {s.submittedAt ? timeAgo(s.submittedAt) : "Not submitted"}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: T.gray400 }}>
                      {s._count.documents > 0 ? `${s._count.documents} file${s._count.documents > 1 ? "s" : ""}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold" style={{ color: T.teal }}>Review →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showLinkModal && <GenerateLinkModal onClose={() => { setShowLinkModal(false); router.refresh(); }} />}
    </div>
  );
}
