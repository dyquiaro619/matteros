"use client";

import { useState, useCallback, useRef } from "react";
import { MatterType } from "@prisma/client";
import ProgressBar from "./components/ProgressBar";
import { IDENTITY_QUESTIONS, DETENTION_QUESTIONS, CASE_QUESTIONS, CASE_TYPE_LABELS, HUMANITARIAN_TYPES, type QuestionDef } from "@/lib/intake/questions";

const T = { navy900: "#0f1923", navy800: "#141e2a", navy700: "#1a2332", teal: "#2dd4a0", gray400: "#9ca3af", gray500: "#6b7280" };

type Answers = Record<string, unknown>;

interface Props {
  token: string;
  hintType?: MatterType | null;
  hintName?: string | null;
  existingAnswers?: Answers;
  existingSubmissionId?: string | null;
}

// ─── Field renderer ───────────────────────────────────────────────────────────

function Field({ q, value, onChange }: { q: QuestionDef; value: unknown; onChange: (v: unknown) => void }) {
  const inputBase = {
    background: T.navy700,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#fff",
    width: "100%",
    fontSize: "14px",
    outline: "none",
    padding: "12px 16px",
  };

  const labelColor = q.sensitiveFlag ? T.gray500 : T.gray400;

  return (
    <div>
      <label className="block font-medium mb-1" style={{ color: labelColor, fontSize: "14px" }}>
        {q.label}
        {q.required && <span style={{ color: T.teal }}> *</span>}
      </label>
      {q.sublabel && (
        <p className="text-xs mb-2" style={{ color: T.gray500 }}>
          {q.sublabel}
          {q.sensitiveFlag && (
            <span className="ml-2 font-semibold" style={{ color: "rgba(45,212,160,0.7)" }}>
              🔒 Confidential
            </span>
          )}
        </p>
      )}

      {q.type === "boolean" && (
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => {
            const boolVal = opt === "Yes";
            const selected = value === boolVal;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(boolVal)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: selected ? "rgba(45,212,160,0.15)" : T.navy700,
                  border: `1.5px solid ${selected ? T.teal : "rgba(255,255,255,0.1)"}`,
                  color: selected ? T.teal : T.gray400,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "select" && (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputBase, cursor: "pointer" }}
        >
          <option value="">Select one…</option>
          {q.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {q.type === "textarea" && (
        <div className="relative">
          <textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder={q.placeholder}
            style={{ ...inputBase, resize: "vertical", lineHeight: "1.6" }}
          />
        </div>
      )}

      {(q.type === "text" || q.type === "phone" || q.type === "date") && (
        <input
          type={q.type === "date" ? "date" : q.type === "phone" ? "tel" : "text"}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          style={inputBase}
        />
      )}
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepIdentity({ answers, onChange }: { answers: Answers; onChange: (id: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Tell us about yourself</h2>
        <p className="text-sm" style={{ color: T.gray400 }}>All information is kept confidential.</p>
      </div>
      {IDENTITY_QUESTIONS.map((q) => (
        <Field key={q.id} q={q} value={answers[q.id]} onChange={(v) => onChange(q.id, v)} />
      ))}
    </div>
  );
}

function StepCaseType({ answers, onChange }: { answers: Answers; onChange: (id: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">What type of case do you have?</h2>
        <p className="text-sm" style={{ color: T.gray400 }}>Choose the option that best describes your situation.</p>
      </div>
      <div className="space-y-3">
        {(Object.entries(CASE_TYPE_LABELS) as [MatterType, string][]).map(([type, label]) => {
          const selected = answers.matterType === type;
          const isHumanitarian = HUMANITARIAN_TYPES.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange("matterType", type)}
              className="w-full text-left px-5 py-4 rounded-xl transition-all"
              style={{
                background: selected ? "rgba(45,212,160,0.1)" : T.navy700,
                border: `1.5px solid ${selected ? T.teal : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm" style={{ color: selected ? T.teal : "#fff" }}>
                  {label}
                </span>
                {isHumanitarian && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(45,212,160,0.1)", color: T.teal }}>
                    Humanitarian
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {/* Detention question */}
      <div className="pt-2">
        {DETENTION_QUESTIONS.filter((q) => q.id === "isDetained").map((q) => (
          <Field key={q.id} q={q} value={answers[q.id]} onChange={(v) => onChange(q.id, v)} />
        ))}
      </div>
      {Boolean(answers.isDetained) && (
        <div className="space-y-4">
          {DETENTION_QUESTIONS.filter(q => q.id !== "isDetained").map((q) => (
            <Field key={q.id} q={q} value={answers[q.id]} onChange={(v) => onChange(q.id, v)} />
          ))}
        </div>
      )}
    </div>
  );
}

function StepQuestions({ answers, onChange }: { answers: Answers; onChange: (id: string, v: unknown) => void }) {
  const matterType = answers.matterType as MatterType | undefined;
  const questions = matterType ? CASE_QUESTIONS[matterType] : [];
  const isRecording = useRef(false);
  const recognition = useRef<{ stop: () => void } | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null);

  const startRecording = useCallback((questionId: string, currentValue: string) => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recording is not supported in this browser. Please type your answer.");
      return;
    }
    type SR = new () => { continuous: boolean; interimResults: boolean; lang: string; onresult: ((e: Event) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; };
    const SpeechRecognitionAPI: SR | undefined = (window as unknown as Record<string, SR>)["SpeechRecognition"] || (window as unknown as Record<string, SR>)["webkitSpeechRecognition"];
    if (!SpeechRecognitionAPI) return;

    if (isRecording.current) {
      recognition.current?.stop();
      isRecording.current = false;
      setRecordingId(null);
      return;
    }

    const rec = new SpeechRecognitionAPI!();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    let finalTranscript = currentValue ?? "";

    rec.onresult = (event: Event) => {
      const e = event as unknown as { resultIndex: number; results: { isFinal: boolean; 0: { transcript: string } }[] };
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript + " ";
        } else {
          interim = e.results[i][0].transcript;
        }
      }
      onChange(questionId, finalTranscript + interim);
    };

    rec.onend = () => {
      isRecording.current = false;
      setRecordingId(null);
    };

    recognition.current = rec;
    rec.start();
    isRecording.current = true;
    setRecordingId(questionId);
  }, [onChange]);

  if (!matterType) {
    return (
      <div className="text-center py-10">
        <p style={{ color: T.gray400 }}>Please go back and select a case type first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Tell us about your case</h2>
        <p className="text-sm" style={{ color: T.gray400 }}>
          Answer as many questions as you can. It&apos;s okay if you don&apos;t know everything.
        </p>
      </div>
      {questions.map((q) => (
        <div key={q.id}>
          <Field q={q} value={answers[q.id]} onChange={(v) => onChange(q.id, v)} />
          {q.type === "textarea" && q.sensitiveFlag && (
            <button
              type="button"
              onClick={() => startRecording(q.id, (answers[q.id] as string) ?? "")}
              className="mt-2 flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              style={{
                background: recordingId === q.id ? "rgba(239,68,68,0.15)" : "rgba(45,212,160,0.1)",
                border: `1px solid ${recordingId === q.id ? "rgba(239,68,68,0.3)" : "rgba(45,212,160,0.2)"}`,
                color: recordingId === q.id ? "#f87171" : T.teal,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="4" y="1" width="6" height="8" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 7c0 2.76 2.24 5 5 5s5-2.24 5-5M7 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {recordingId === q.id ? "Stop recording" : "🎙 Record my story"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function StepDocuments({ answers, onChange }: { answers: Answers; onChange: (id: string, v: unknown) => void }) {
  const matterType = answers.matterType as MatterType;
  const docList: { id: string; label: string; required: boolean }[] = [
    { id: "doc_passport", label: "Passport (photo page)", required: false },
    { id: "doc_i94", label: "I-94 Arrival Record", required: false },
    ...(matterType === MatterType.REMOVAL_DEFENSE
      ? [{ id: "doc_nta", label: "Notice to Appear (NTA)", required: false }]
      : []),
    ...(matterType === MatterType.ASYLUM
      ? [{ id: "doc_country_id", label: "National ID from your country", required: false }]
      : []),
    ...(matterType === MatterType.TPS
      ? [{ id: "doc_proof_entry", label: "Proof of continuous residence (any document showing you were in the US)", required: false }]
      : []),
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Upload your documents</h2>
        <p className="text-sm" style={{ color: T.gray400 }}>
          Take a photo with your phone. It&apos;s okay if you don&apos;t have everything — just upload what you have.
        </p>
      </div>
      <div className="space-y-3">
        {docList.map((doc) => {
          const uploaded = answers[doc.id] as string | undefined;
          const skipped = answers[`${doc.id}_skip`] as boolean | undefined;
          return (
            <div
              key={doc.id}
              className="rounded-xl p-4"
              style={{
                background: uploaded ? "rgba(45,212,160,0.06)" : T.navy700,
                border: `1px solid ${uploaded ? "rgba(45,212,160,0.2)" : skipped ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">{doc.label}</span>
                {uploaded && <span className="text-xs font-semibold" style={{ color: T.teal }}>✓ Uploaded</span>}
                {skipped && !uploaded && <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>Skipped</span>}
              </div>
              {!uploaded && !skipped && (
                <div className="flex gap-2">
                  <label
                    className="flex-1 text-center text-xs font-semibold py-2 rounded-lg cursor-pointer transition-all"
                    style={{ background: "rgba(45,212,160,0.12)", color: T.teal, border: "1px solid rgba(45,212,160,0.2)" }}
                  >
                    📷 Choose photo
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(doc.id, file.name);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onChange(`${doc.id}_skip`, true)}
                    className="text-xs font-medium px-3 py-2 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.04)", color: T.gray500, border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    I don&apos;t have this
                  </button>
                </div>
              )}
              {(uploaded || skipped) && (
                <button
                  type="button"
                  onClick={() => { onChange(doc.id, undefined); onChange(`${doc.id}_skip`, undefined); }}
                  className="text-xs" style={{ color: T.gray500 }}
                >
                  Undo
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepConfirm({ answers }: { answers: Answers }) {
  const rows = [
    { label: "Name", value: `${answers.firstName ?? ""} ${answers.lastName ?? ""}`.trim() },
    { label: "Country of origin", value: answers.countryOfOrigin as string },
    { label: "Case type", value: answers.matterType ? CASE_TYPE_LABELS[answers.matterType as MatterType] : "—" },
    { label: "Detained", value: answers.isDetained ? "Yes" : "No" },
    { label: "Phone", value: answers.phone as string },
    { label: "Email", value: (answers.email as string) || "Not provided" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Review your information</h2>
        <p className="text-sm" style={{ color: T.gray400 }}>
          Please confirm everything is correct before submitting.
        </p>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        {rows.map((r, i) => (
          <div key={r.label} className="flex gap-4 px-4 py-3"
            style={{ background: i % 2 === 0 ? T.navy700 : "rgba(255,255,255,0.02)", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <span className="text-xs font-semibold w-28 flex-shrink-0 pt-0.5" style={{ color: T.gray500 }}>{r.label}</span>
            <span className="text-sm text-white">{r.value || "—"}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-4" style={{ background: "rgba(45,212,160,0.06)", border: "1px solid rgba(45,212,160,0.15)" }}>
        <p className="text-xs leading-relaxed" style={{ color: T.gray400 }}>
          By submitting, you confirm that the information above is accurate to the best of your knowledge.
          Your attorney team will review your intake and contact you within 2 business days.
        </p>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function IntakeFormClient({ token, hintType, hintName, existingAnswers, existingSubmissionId }: Props) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    ...(hintType && { matterType: hintType }),
    ...(existingAnswers ?? {}),
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  void existingSubmissionId;
  void hintName;

  function handleChange(id: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function saveProgress(nextStep: number) {
    setSaving(true);
    try {
      await fetch("/api/intake/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers }),
      });
    } finally {
      setSaving(false);
    }
    setStep(nextStep);
    window.scrollTo(0, 0);
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(45,212,160,0.12)" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke="#2dd4a0" strokeWidth="2" />
            <path d="M8 14l4 4 8-8" stroke="#2dd4a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Intake submitted</h2>
        <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: T.gray400 }}>
          Your attorney team will review your information and contact you within 2 business days at the number you provided.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <ProgressBar step={step} />
      </div>

      <div className="min-h-[400px]">
        {step === 1 && <StepIdentity answers={answers} onChange={handleChange} />}
        {step === 2 && <StepCaseType answers={answers} onChange={handleChange} />}
        {step === 3 && <StepQuestions answers={answers} onChange={handleChange} />}
        {step === 4 && <StepDocuments answers={answers} onChange={handleChange} />}
        {step === 5 && <StepConfirm answers={answers} />}
      </div>

      {error && (
        <p className="text-sm rounded-lg px-4 py-3 mt-4"
          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}
            className="px-5 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: T.gray400, border: "1px solid rgba(255,255,255,0.08)" }}>
            Back
          </button>
        )}
        {step < 5 && (
          <button type="button" onClick={() => saveProgress(step + 1)} disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: T.teal, color: T.navy900 }}>
            {saving ? "Saving…" : "Continue →"}
          </button>
        )}
        {step === 5 && (
          <button type="button" onClick={handleSubmit} disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: T.teal, color: T.navy900 }}>
            {saving ? "Submitting…" : "Submit intake →"}
          </button>
        )}
      </div>
    </div>
  );
}
