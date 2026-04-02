"use client";

import { useState, useEffect } from "react";

const REDUCTION = 0.6;

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function ROICalculator() {
  const [intakes, setIntakes] = useState<string>("30");
  const [hoursPerIntake, setHoursPerIntake] = useState<string>("3");
  const [hourlyRate, setHourlyRate] = useState<string>("35");
  const [caseType, setCaseType] = useState<string>("Asylum");

  const [results, setResults] = useState({
    timeSaved: 0,
    costSavings: 0,
    annualSavings: 0,
    additionalClients: 0,
    netSavings: 0,
    breakEvenWeeks: 0,
  });

  const MATTEROS_ANNUAL = 6000;

  useEffect(() => {
    const n = parseFloat(intakes) || 0;
    const h = parseFloat(hoursPerIntake) || 0;
    const r = parseFloat(hourlyRate) || 0;

    const timeSaved = n * h * REDUCTION;
    const costSavings = timeSaved * r;
    const annualSavings = costSavings * 12;
    const additionalClients = Math.floor(timeSaved / h) * 12;
    const netSavings = annualSavings - MATTEROS_ANNUAL;
    const breakEvenWeeks =
      costSavings > 0 ? Math.ceil(MATTEROS_ANNUAL / (costSavings * 12 / 52)) : 0;

    setResults({
      timeSaved,
      costSavings,
      annualSavings,
      additionalClients,
      netSavings,
      breakEvenWeeks,
    });
  }, [intakes, hoursPerIntake, hourlyRate, caseType]);

  const inputClass =
    "w-full rounded-lg px-4 py-3 text-white font-medium text-sm outline-none focus:ring-2 transition-all";
  const inputStyle = {
    background: "#1a2332",
    border: "1px solid rgba(255,255,255,0.1)",
    "--tw-ring-color": "#2dd4a0",
  } as React.CSSProperties;

  const labelClass = "block text-sm font-medium mb-2";
  const labelStyle = { color: "#9ca3af" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label className={labelClass} style={labelStyle}>
            New intakes per month
          </label>
          <input
            type="number"
            min="1"
            value={intakes}
            onChange={(e) => setIntakes(e.target.value)}
            placeholder="e.g., 30"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>
            Average hours per intake currently
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={hoursPerIntake}
            onChange={(e) => setHoursPerIntake(e.target.value)}
            placeholder="e.g., 3"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>
            Paralegal hourly cost ($)
          </label>
          <input
            type="number"
            min="15"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="$35"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>
            Primary case type
          </label>
          <select
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
            className={inputClass}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="Asylum">Asylum</option>
            <option value="TPS">TPS</option>
            <option value="Removal Defense">Removal Defense</option>
            <option value="Mixed">Mixed Humanitarian</option>
          </select>
        </div>
      </div>

      {/* Output */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: "linear-gradient(135deg, #0f2a1e 0%, #0f1923 100%)",
          border: "1px solid rgba(45,212,160,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#2dd4a0" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#2dd4a0" }}
          >
            Your Monthly Intake Savings
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(45,212,160,0.06)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "#2dd4a0" }}
            >
              {fmt(results.timeSaved)} hrs
            </div>
            <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>
              Time saved / month
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(45,212,160,0.06)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "#2dd4a0" }}
            >
              ${fmt(results.costSavings)}
            </div>
            <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>
              Cost savings / month
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(45,212,160,0.06)" }}
        >
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-white">
                ${fmt(results.annualSavings)}
              </div>
              <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                Annual savings
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-lg font-bold"
                style={{ color: "#2dd4a0" }}
              >
                +{fmt(results.additionalClients)} clients
              </div>
              <div className="text-xs" style={{ color: "#9ca3af" }}>
                Additional served / year
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex justify-between text-sm">
            <span style={{ color: "#9ca3af" }}>MatterOS Investment</span>
            <span className="text-white font-medium">
              ${fmt(MATTEROS_ANNUAL)}/yr
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#9ca3af" }}>Net Savings</span>
            <span
              className="font-bold"
              style={{
                color: results.netSavings >= 0 ? "#2dd4a0" : "#f87171",
              }}
            >
              {results.netSavings >= 0 ? "+" : ""}${fmt(results.netSavings)}/yr
            </span>
          </div>
          <div
            className="pt-2 border-t flex justify-between text-sm"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span style={{ color: "#9ca3af" }}>Break-even</span>
            <span className="font-bold text-white">
              {results.breakEvenWeeks > 0
                ? `${results.breakEvenWeeks} weeks`
                : "—"}
            </span>
          </div>
        </div>

        <p className="text-xs text-center" style={{ color: "#6b7280" }}>
          Based on 60% intake time reduction — our founding partner guarantee threshold
        </p>
      </div>
    </div>
  );
}
