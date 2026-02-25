

export type ChannelType = "call" | "zoom" | "email" | "doc" | "task" | "note";

export type ExtractedActionStatus = "pending" | "done";

export type ConfidentialityLevel = "matter-only" | "team" | "public";

export type TimelineEventDTO = {
  id: string;
  matterId: string;
  ts: string; // ISO
  channel: ChannelType;

  participants: string[];
  summary: string;

  extractedFacts: string[];
  extractedActions: {
    id: string;
    text: string;
    status: ExtractedActionStatus;
    assigneeId?: string;
  }[];

  source: {
    type: string;
    label: string;
    deepLinkMock: string;
    content?: string;
  };

  confidentialityLevel: ConfidentialityLevel;
  tags: string[];
};