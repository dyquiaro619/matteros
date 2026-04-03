"use client";

import { useState } from "react";
import { IntakeStatus, MatterType } from "@prisma/client";
import { useRouter } from "next/navigation";
import ConvertModal from "../components/ConvertModal";

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
  reviewedById: string | null; reviewNotes: string | null;
  matterId: string | null; answers: Record<string, unknown>;
  matter: { id: string; title: string; stage: string } | null;
  documents: { id: string; label: string; storagePath: string; status: string }[];
  token: { hintName: string | null; createdAt: string };
};

export default function SubmissionDetailClient({ submission }: { submission: Submission }) {
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(submission.reviewNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const router = useRouter();

  async function updateStatus(status: IntakeStatus) {
    setSaving(true);
    await fetch(`/api/app/intake/${submission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewNotes }),
    });
    setSaving(false);
    setSavedMsg("Saved");
    setTimeout(() => setSavedMsg(""), 2000);
    router.refresh();
  }

  async function saveNotes() {
    setSaving(true);
    await fetch(`/api/app/intake/${submission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewNotes }),
    });
    setSaving(false);
    setSavedMsg("Notes saved");
    setTimeout(() => setSavedMsg(""), 2000);
  }

  const answers = submission.answers as Record<string, unknown>;
  const answerEntries = Object.entries(answers).filter(([k, v]) =>
    v !== undefined && v !== null && v !== "" && !k.startsWith("doc_")
  );

  const convertibleStatuses: IntakeStatus[] = [IntakeStatus.SUBMITTED, IntakeStatus.REVIEWED, IntakeStatus.IN_PROGRESS];
  const canConvert = convertibleStatuses.includes(submission.status) && !submission.matterId;

  return (
    <div className="p-6 max-w-5xl">
      {/* Back */}
      <a href="/app/intake" className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
        style={{ color: T.gray500 }}>
        ← Intake Queue
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="rounded-2xl p-6" style={{ background: T.navy800, border: "1px solid var(--border-subtle)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {submission.isDetained && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}>DETAINED</span>
                  )}
                  <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {submission.clientName ?? "Unknown Client"}
                  </h1>
                </div>
                <p className="text-sm" style={{ color: T.gray400 }}>{submission.caseTypeLabel ?? "—"}</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "var(--teal-bg)", color: T.teal }}>
                {submission.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Phone", value: submission.clientPhone },
                { label: "Email", value: submission.clientEmail },
                { label: "Country", value: submission.countryOfOrigin },
                { label: "Submitted", value: submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "Not submitted" },
              ].map((r) => r.value ? (
                <div key={r.label}>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: T.gray500 }}>{r.label}</p>
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>{r.value}</p>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Answers */}
          <div className="rounded-2xl overflow-hidden" style={{ background: T.navy800, border: "1px solid var(--border-subtle)" }}>
            <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Client Answers</h2>
            </div>
            <div className="divide-y divide-white/5">
              {answerEntries.length === 0 ? (
                <p className="px-5 py-4 text-sm" style={{ color: T.gray500 }}>No answers recorded yet.</p>
              ) : (
                answerEntries.map(([key, value]) => (
                  <div key={key} className="px-5 py-3 flex gap-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <span className="text-xs font-semibold w-40 flex-shrink-0 pt-0.5 capitalize"
                      style={{ color: T.gray500 }}>
                      {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").toLowerCase()}
                    </span>
                    <span className="text-sm flex-1 whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Documents */}
          {submission.documents.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: T.navy800, border: "1px solid var(--border-subtle)" }}>
              <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  Documents ({submission.documents.length})
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {submission.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: T.navy700, border: "1px solid var(--border-subtle)" }}>
                    <span className="text-lg">📄</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{doc.label}</p>
                      <p className="text-xs" style={{ color: T.gray500 }}>{doc.storagePath}</p>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: T.teal }}>{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Review panel */}
        <div className="space-y-5">
          {/* Linked matter */}
          {submission.matter && (
            <div className="rounded-2xl p-5" style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: T.teal }}>✓ Matter Created</p>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{submission.matter.title}</p>
              <p className="text-xs mt-1" style={{ color: T.gray500 }}>{submission.matter.stage}</p>
            </div>
          )}

          {/* Review notes */}
          <div className="rounded-2xl p-5" style={{ background: T.navy800, border: "1px solid var(--border-subtle)" }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Review Notes</h3>
            <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)}
              rows={4} placeholder="Add notes for the attorney…"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
              style={{
                background: T.navy700,
                border: "1px solid var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
            <div className="flex items-center justify-between mt-2">
              {savedMsg && <span className="text-xs" style={{ color: T.teal }}>{savedMsg}</span>}
              <button onClick={saveNotes} disabled={saving}
                className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
                style={{ background: "var(--teal-bg)", color: T.teal }}>
                {saving ? "Saving…" : "Save notes"}
              </button>
            </div>
          </div>

          {/* Status actions */}
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: T.navy800, border: "1px solid var(--border-subtle)" }}>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Actions</h3>

            {canConvert && (
              <button onClick={() => setShowConvertModal(true)}
                className="w-full py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: T.teal, color: T.tealFg }}>
                Create Matter →
              </button>
            )}

            {submission.status === IntakeStatus.SUBMITTED && (
              <button onClick={() => updateStatus(IntakeStatus.REVIEWED)} disabled={saving}
                className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)" }}>
                Mark Reviewed
              </button>
            )}

            {(submission.status !== IntakeStatus.REJECTED && submission.status !== IntakeStatus.CONVERTED) && (
              <button onClick={() => updateStatus(IntakeStatus.REJECTED)} disabled={saving}
                className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                Reject
              </button>
            )}
          </div>
        </div>
      </div>

      {showConvertModal && (
        <ConvertModal
          submissionId={submission.id}
          defaultName={submission.clientName ?? undefined}
          defaultType={submission.matterType ?? undefined}
          onConverted={(matterId) => {
            setShowConvertModal(false);
            console.log("Matter created:", matterId);
            router.refresh();
          }}
          onClose={() => setShowConvertModal(false)}
        />
      )}
    </div>
  );
}
