import type { TimelineEventDTO } from "@/lib/dto/timeline";

function mapLedgerToTimeline(e: any): TimelineEventDTO {
  const base: Omit<TimelineEventDTO, "channel" | "summary"> = {
    id: e.id,
    matterId: e.matterId,
    ts: e.createdAt.toISOString(),
    participants: [],
    extractedFacts: [],
    extractedActions: [],
    confidentialityLevel: "matter-only",
    tags: [],
    source: {
      type: "system",
      label: e.type,
      deepLinkMock: `matter://events/${e.id}`,
    },
  };

   if (e.type === "POLICY_CHANGED" ) {
    return {
      ...base,
      channel: "doc",
      summary: e.payload?.summary ?? "Policy updated",
      tags: ["policy"],
      source: {
        type: "policy",
        label: "Policy Update",
        deepLinkMock: e.payload?.sourceUrl ?? `matter://events/${e.id}`,
        content: e.payload?.details ?? undefined,
      },
    };
  }


  switch (e.type) {
    case "NOTE_ADDED":
      return { ...base, channel: "note", summary: e.payload?.text ?? "Note added" };
    case "STAGE_CHANGED":
      return { ...base, channel: "task", summary: `Stage changed: ${e.payload?.fromStage} → ${e.payload?.toStage}` };
    case "POLICY_SNAPSHOT_CREATED":
      return { ...base, channel: "doc", summary: "Policy snapshot attached" };
    case "RISK_FLAGGED":
      return { ...base, channel: "task", summary: `Risk flagged: ${e.payload?.reason ?? "Rule triggered"}`, tags: ["risk"] };
      case "CALL_LOGGED":
  return {
    ...base,
    channel: "call",
    summary: e.payload?.summary ?? "Phone call logged",
    participants: Array.isArray(e.payload?.participants)
      ? e.payload.participants
      : [],
    extractedFacts: Array.isArray(e.payload?.extractedFacts)
      ? e.payload.extractedFacts
      : [],
    extractedActions: Array.isArray(e.payload?.extractedActions)
      ? e.payload.extractedActions.map((a: any) => ({
          id: a.id,
          text: a.text,
          status: a.status === "done" ? "done" : "pending",
          assigneeId: a.assigneeId ?? undefined,
        }))
      : [],
    source: e.payload?.source ?? base.source,
    tags: Array.isArray(e.payload?.tags) ? e.payload.tags : [],
  };
    default:
      return { ...base, channel: "note", summary: String(e.type ?? "Event") };
  }
}