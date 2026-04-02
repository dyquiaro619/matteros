"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How is this different from Docketwise or INSZoom intake?",
    answer:
      "Docketwise and INSZoom were built primarily for business immigration (H-1B, L-1, EB-5) and adapted — as an afterthought — for humanitarian cases. They have no voice-to-text for persecution narratives, no trauma-informed design, no WhatsApp/SMS delivery for clients without reliable email, no Habeas Clock for detained clients, and no connection to real-time policy changes. MatterOS Intake was built first for asylum, TPS, and removal defense. Every feature — from the 'Record My Story' voice button to the automatic policy risk flags — exists because humanitarian immigration attorneys asked for it.",
  },
  {
    question: "What if my clients don't have smartphones?",
    answer:
      "MatterOS Intake is designed for clients in all circumstances. For clients without smartphones, intake can be completed over the phone by a paralegal using the same guided interface. For clients with basic phones, SMS delivery of magic links works without a smartphone app. For detained clients, paralegals can initiate and complete intake on behalf of the client using information gathered via phone call. The system is designed around the real conditions of humanitarian immigration clients — not the ideal ones.",
  },
  {
    question: "Is the persecution narrative data secure?",
    answer:
      "Yes. Persecution narratives are among the most sensitive data in immigration law, and we treat them accordingly. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). The persecution narrative is stored in an immutable, cryptographically-signed audit ledger — meaning no one can alter or delete it without leaving a traceable record. Access is role-based: only the assigned attorney and paralegal can view the narrative. We are SOC 2 Type II compliant and HIPAA-aware (immigration narratives often include medical information).",
  },
  {
    question: "What does the 5-hour guarantee actually mean?",
    answer:
      "If your paralegals don't save at least 5 hours per week — collectively across the team — within 30 days of going live, you pay nothing for the first year. This isn't a discount or a credit. It's a full year free. We measure this by comparing your baseline intake time (gathered in week 1 onboarding) against your actual intake time after implementation. We'll walk you through how we track this during onboarding. We've structured it this way because we're confident in the time savings, and we want founding partners to take zero financial risk.",
  },
  {
    question: "Can my team still use our existing case management system?",
    answer:
      "Yes. MatterOS Intake is designed to complement your existing case management system, not replace it. In the founding partner phase, intake data can be exported in structured formats compatible with Docketwise, INSZoom, and LawLogix. Native two-way sync integrations are on the roadmap for Q3. Many firms use MatterOS for intake and policy tracking, while keeping their existing system for billing and docketing. We'll design your implementation around your actual workflow.",
  },
  {
    question: "What languages are supported?",
    answer:
      "English and Spanish are fully supported at launch, including all intake forms, the guided persecution narrative prompts, the 'Record My Story' voice interface, and WhatsApp/SMS delivery. Haitian Creole and Portuguese are in active development for Q2. Additional languages can be requested by founding partners — language support is a direct input to our roadmap.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Two weeks from contract signing to your first live intake. Week 1: 30-minute onboarding call, system configuration, staff training, and a test intake with a sample case. Week 2: your first real client intake, paralegal workflow review, and any configuration adjustments. We handle all of the technical setup. Your team needs to show up for two short calls and run one test intake.",
  },
  {
    question: "What happens after the founding partner period?",
    answer:
      "Founding partners lock in their $500/month rate for 24 months regardless of how pricing changes at general availability. GA pricing is expected to be $1,000+/month. After 24 months, founding partners receive a preferred renewal rate. You also receive permanent 'Founding Partner' status in our community, priority access to new features, and a seat on our annual advisory call where founding partners directly influence the product roadmap.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-xl border overflow-hidden"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "#1a2332",
          }}
        >
          <button
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 transition-colors"
            style={{
              color: openIndex === index ? "#2dd4a0" : "#ffffff",
            }}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-semibold text-base leading-snug">
              {faq.question}
            </span>
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
              style={{
                background: "rgba(45,212,160,0.12)",
                color: "#2dd4a0",
                transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v10M1 6h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: openIndex === index ? "400px" : "0px",
            }}
          >
            <div
              className="px-6 pb-5 text-sm leading-relaxed"
              style={{ color: "#9ca3af" }}
            >
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
