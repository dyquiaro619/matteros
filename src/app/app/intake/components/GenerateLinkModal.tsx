"use client";

import { useState } from "react";
import { MatterType } from "@prisma/client";
import { CASE_TYPE_LABELS } from "@/lib/intake/questions";

const T = { navy900: "#0f1923", navy800: "#141e2a", navy700: "#1a2332", teal: "#2dd4a0", gray400: "#9ca3af", gray500: "#6b7280" };

export default function GenerateLinkModal({ onClose }: { onClose: () => void }) {
  const [hintType, setHintType] = useState<MatterType | "">(MatterType.ASYLUM);
  const [hintName, setHintName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ intakeUrl: string; expiresAt: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const inputStyle = {
    background: T.navy700,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#fff",
    width: "100%",
    fontSize: "14px",
    padding: "11px 14px",
    outline: "none",
  };

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/app/intake/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hintType: hintType || undefined, hintName: hintName || undefined, expiresInDays }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function copyLink() {
    if (!result) return;
    await navigator.clipboard.writeText(result.intakeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ background: T.navy800, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-white text-lg">Generate Intake Link</h2>
          <button onClick={onClose} style={{ color: T.gray500 }}>✕</button>
        </div>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: T.gray400 }}>Case type hint (optional)</label>
              <select value={hintType} onChange={(e) => setHintType(e.target.value as MatterType)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">No hint</option>
                {(Object.entries(CASE_TYPE_LABELS) as [MatterType, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: T.gray400 }}>Client name hint (optional)</label>
              <input type="text" value={hintName} onChange={(e) => setHintName(e.target.value)}
                placeholder="e.g. Maria Rodriguez" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: T.gray400 }}>Link expires in</label>
              <select value={expiresInDays} onChange={(e) => setExpiresInDays(Number(e.target.value))}
                style={{ ...inputStyle, cursor: "pointer" }}>
                {[7, 14, 30, 60].map((d) => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            <button onClick={generate} disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold mt-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: T.teal, color: T.navy900 }}>
              {loading ? "Generating…" : "Generate link →"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: T.navy700, border: "1px solid rgba(45,212,160,0.2)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: T.gray500 }}>Intake link</p>
              <p className="text-sm font-mono break-all" style={{ color: T.teal }}>{result.intakeUrl}</p>
            </div>
            <p className="text-xs" style={{ color: T.gray500 }}>
              Expires: {new Date(result.expiresAt).toLocaleDateString()}
            </p>
            <div className="flex gap-3">
              <button onClick={copyLink}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: T.teal, color: T.navy900 }}>
                {copied ? "✓ Copied!" : "Copy link"}
              </button>
              <button onClick={onClose}
                className="px-5 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", color: T.gray400, border: "1px solid rgba(255,255,255,0.08)" }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
