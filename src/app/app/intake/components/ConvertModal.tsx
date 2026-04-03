"use client";

import { useState } from "react";
import { MatterType } from "@prisma/client";
import { CASE_TYPE_LABELS } from "@/lib/intake/questions";

interface Props {
  submissionId: string;
  defaultName?: string;
  defaultType?: MatterType;
  onConverted: (matterId: string) => void;
  onClose: () => void;
}

const T = {
  navy900: "var(--bg-app)", navy800: "var(--bg-card)", navy700: "var(--bg-input)",
  teal: "var(--teal)", tealFg: "var(--teal-fg)",
  gray400: "var(--text-secondary)", gray500: "var(--text-muted)",
};

export default function ConvertModal({ submissionId, defaultName, defaultType, onConverted, onClose }: Props) {
  const [title, setTitle] = useState(defaultName ? `${defaultName} — ${defaultType ? CASE_TYPE_LABELS[defaultType] : "Matter"}` : "");
  const [type, setType] = useState<MatterType>(defaultType ?? MatterType.ASYLUM);
  const [jurisdictionOffice, setJurisdictionOffice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    background: T.navy700,
    border: "1px solid var(--border-medium)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    width: "100%",
    fontSize: "14px",
    padding: "11px 14px",
    outline: "none",
  };

  async function handleConvert() {
    if (!title.trim()) { setError("Matter title is required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/app/matters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, title: title.trim(), type, jurisdictionOffice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Conversion failed");
      onConverted(data.matterId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ background: T.navy800, border: "1px solid var(--border-soft)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Create Matter from Intake</h2>
          <button onClick={onClose} style={{ color: T.gray500 }}>✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: T.gray400 }}>Matter title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Diallo, Abdoulaye — Asylum" style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: T.gray400 }}>Case type</label>
            <select value={type} onChange={(e) => setType(e.target.value as MatterType)} style={{ ...inputStyle, cursor: "pointer" }}>
              {(Object.entries(CASE_TYPE_LABELS) as [MatterType, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: T.gray400 }}>
              Jurisdiction / Office <span style={{ color: T.gray500 }}>(optional)</span>
            </label>
            <input type="text" value={jurisdictionOffice}
              onChange={(e) => setJurisdictionOffice(e.target.value)}
              placeholder="e.g. USCIS Miami, Miami Immigration Court"
              style={inputStyle} />
          </div>

          {error && (
            <p className="text-sm rounded-lg px-4 py-3" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "var(--hover-bg)", color: T.gray400, border: "1px solid var(--border-soft)" }}>
            Cancel
          </button>
          <button onClick={handleConvert} disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: T.teal, color: T.tealFg }}>
            {loading ? "Creating…" : "Create Matter →"}
          </button>
        </div>
      </div>
    </div>
  );
}
