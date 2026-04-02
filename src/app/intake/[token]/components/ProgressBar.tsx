const STEP_LABELS = ["Your Info", "Case Type", "Your Story", "Documents", "Review"];

export default function ProgressBar({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>
          Step {step} of {total}
        </span>
        <span className="text-xs font-medium" style={{ color: "#2dd4a0" }}>
          {STEP_LABELS[step - 1]}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%`, background: "#2dd4a0" }}
        />
      </div>
    </div>
  );
}
