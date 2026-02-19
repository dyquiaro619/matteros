export type MatterStatus = "active" | "at-risk" | "stalled" | "closed";
export type MatterStage = 'intake' | 'records' | 'demand' | 'negotiation' | 'litigation' | 'settled';

export type RiskSeverity = "low" | "medium" | "high";
export type RiskFlag = {
  id: string;
  severity: RiskSeverity;
  label: string;
  source: "RULE" | "INTEGRATION" | "USER";
  createdAt: string;
};

export type MatterType = "WORK_PERMIT_EXTENSION" | "PR" | "FAMILY_SPONSORSHIP" | "STUDY_PERMIT_EXTENSION" | "ASYLUM";
        

export type NextStep = {
  id: string;
  title: string;
  dueDate: string; // ISO
  ownerUserId?: string | null;
};

export type MatterDTO = {
  id: string;
  title: string;

  // UI expects these
  clientId: string | null;
  type: "Immigration"; // fixed for now (matches mock UI)
  caseType?: MatterType | null; // later map from Matter.type or integration metadata
  stage: string;            // you can map enum -> UI stage later
  status: MatterStatus;

  ownerUserId: string | null;
  teamUserIds: string[];

  lastTouchAt: string;      // derived from latest event or updatedAt
  nextStep?: NextStep | null;
  riskFlags: RiskFlag[];

  createdAt: string;

  // optional UI fields
  caseValue?: number | null;
  opposingParty?: string | null;
  venue?: string | null;
  receiptNumber?: string | null;
  priorityDate?: string | null;

  // keep reference for integrations/debug
  externalRef?: string | null;
};
