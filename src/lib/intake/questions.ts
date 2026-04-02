import { MatterType } from "@prisma/client";

export type QuestionDef = {
  id: string;
  label: string;
  sublabel?: string;
  type: "text" | "date" | "select" | "textarea" | "boolean" | "phone";
  required: boolean;
  options?: string[];
  sensitiveFlag?: boolean; // triggers trauma-informed styling + confidentiality note
  placeholder?: string;
};

// ─── Shared across all case types ────────────────────────────────────────────

export const IDENTITY_QUESTIONS: QuestionDef[] = [
  {
    id: "firstName",
    label: "First name",
    type: "text",
    required: true,
    placeholder: "As it appears on your ID",
  },
  {
    id: "lastName",
    label: "Last name",
    type: "text",
    required: true,
  },
  {
    id: "dateOfBirth",
    label: "Date of birth",
    type: "date",
    required: true,
  },
  {
    id: "countryOfOrigin",
    label: "Country you are from",
    type: "select",
    required: true,
    options: [
      "Afghanistan", "Albania", "Algeria", "Angola", "Bangladesh",
      "Bolivia", "Brazil", "Cameroon", "Colombia", "Cuba",
      "Democratic Republic of the Congo", "Ecuador", "El Salvador",
      "Eritrea", "Ethiopia", "Guatemala", "Guinea", "Haiti",
      "Honduras", "India", "Iran", "Iraq", "Ivory Coast",
      "Jamaica", "Kenya", "Libya", "Mali", "Mexico",
      "Myanmar", "Nicaragua", "Nigeria", "Pakistan", "Peru",
      "Philippines", "Russia", "Senegal", "Somalia", "Sudan",
      "Syria", "Ukraine", "Venezuela", "Yemen", "Zimbabwe",
      "Other",
    ],
  },
  {
    id: "phone",
    label: "Best phone number to reach you",
    sublabel: "WhatsApp preferred — we'll send document requests here",
    type: "phone",
    required: true,
  },
  {
    id: "email",
    label: "Email address (optional)",
    type: "text",
    required: false,
    placeholder: "If you have one",
  },
  {
    id: "preferredLanguage",
    label: "Preferred language",
    type: "select",
    required: true,
    options: ["English", "Spanish", "Haitian Creole", "Portuguese", "French", "Arabic", "Other"],
  },
];

export const DETENTION_QUESTIONS: QuestionDef[] = [
  {
    id: "isDetained",
    label: "Are you currently detained by immigration?",
    type: "boolean",
    required: true,
  },
  {
    id: "detentionFacility",
    label: "Name of detention facility",
    type: "text",
    required: false,
    placeholder: "e.g. Krome Detention Center",
  },
  {
    id: "alienRegistrationNumber",
    label: "A-Number (Alien Registration Number)",
    sublabel: "9 digits, starts with A — found on your court documents",
    type: "text",
    required: false,
    placeholder: "A000000000",
  },
  {
    id: "nextHearingDate",
    label: "Next court hearing date (if you know it)",
    type: "date",
    required: false,
  },
];

// ─── Asylum-specific questions ────────────────────────────────────────────────

const ASYLUM_QUESTIONS: QuestionDef[] = [
  {
    id: "entryDate",
    label: "When did you arrive in the United States?",
    sublabel: "Approximate date is fine if you don't know exactly",
    type: "date",
    required: true,
  },
  {
    id: "entryMethod",
    label: "How did you enter the United States?",
    type: "select",
    required: true,
    options: [
      "Crossed at a port of entry (official border crossing)",
      "Entered between ports of entry",
      "Arrived by airplane with a visa",
      "Arrived by airplane without a visa",
      "Other",
    ],
  },
  {
    id: "hasFiledBefore",
    label: "Have you ever applied for asylum before?",
    type: "boolean",
    required: true,
  },
  {
    id: "previousFilingCountry",
    label: "Where did you previously apply?",
    type: "text",
    required: false,
    placeholder: "Country or U.S. immigration court",
  },
  {
    id: "persecutionBasis",
    label: "Why are you afraid to return to your country?",
    sublabel: "Select the main reason — you can explain more in the next step",
    type: "select",
    required: true,
    options: [
      "My race or ethnicity",
      "My religion",
      "My political opinion or activism",
      "My membership in a particular group (e.g. LGBTQ+, gender, family)",
      "Violence from gangs, cartels, or criminal groups",
      "Domestic violence",
      "Threats or harm from the government or police",
      "Multiple reasons",
      "I'm not sure",
    ],
  },
  {
    id: "persecutionNarrative",
    label: "Tell us what happened to you",
    sublabel:
      "Describe what you experienced or fear will happen if you return. Take your time. You can use the voice button to speak instead of type. Your answer is confidential.",
    type: "textarea",
    required: true,
    sensitiveFlag: true,
    placeholder:
      "Describe the harm you experienced or fear, who was responsible, and why you believe it happened...",
  },
  {
    id: "familyMembersInUS",
    label: "Do you have immediate family members in the United States?",
    type: "boolean",
    required: false,
  },
  {
    id: "familyDetails",
    label: "Family members in the US",
    sublabel: "Names and relationship (e.g. Maria Gonzalez — spouse)",
    type: "textarea",
    required: false,
  },
  {
    id: "hasAttorneyElsewhere",
    label: "Are you currently working with another attorney on this case?",
    type: "boolean",
    required: true,
  },
];

// ─── TPS-specific questions ───────────────────────────────────────────────────

const TPS_QUESTIONS: QuestionDef[] = [
  {
    id: "tpsCountry",
    label: "Which country's TPS are you applying for?",
    type: "select",
    required: true,
    options: [
      "El Salvador",
      "Haiti",
      "Honduras",
      "Nepal",
      "Nicaragua",
      "Somalia",
      "South Sudan",
      "Sudan",
      "Syria",
      "Ukraine",
      "Venezuela",
      "Yemen",
    ],
  },
  {
    id: "continuousResidenceSince",
    label: "When did you first arrive in the United States?",
    sublabel: "Your continuous residence start date matters for TPS eligibility",
    type: "date",
    required: true,
  },
  {
    id: "hasEverLeftUS",
    label: "Have you ever left the United States since arriving?",
    type: "boolean",
    required: true,
  },
  {
    id: "absenceDetails",
    label: "Dates and reasons for any trips outside the US",
    sublabel: "Brief absences for emergencies may be permitted",
    type: "textarea",
    required: false,
    placeholder: "e.g. June 2019 — returned to Haiti for 2 weeks for family emergency",
  },
  {
    id: "hasPriorTPS",
    label: "Have you ever had TPS before?",
    type: "boolean",
    required: true,
  },
  {
    id: "priorTPSReceiptNumber",
    label: "Prior TPS receipt or registration number (if known)",
    type: "text",
    required: false,
    placeholder: "EAC-XX-XXXXXXXXX",
  },
  {
    id: "hasCriminalHistory",
    label: "Have you ever been arrested, cited, or convicted of any crime?",
    sublabel: "Including in any country. This does not automatically disqualify you.",
    type: "boolean",
    required: true,
    sensitiveFlag: true,
  },
  {
    id: "criminalHistoryDetails",
    label: "Please describe",
    type: "textarea",
    required: false,
    sensitiveFlag: true,
    placeholder: "Date, location, charges, outcome...",
  },
];

// ─── Removal Defense-specific questions ───────────────────────────────────────

const REMOVAL_DEFENSE_QUESTIONS: QuestionDef[] = [
  {
    id: "ntaReceived",
    label: "Have you received a Notice to Appear (NTA)?",
    sublabel: "This is the official document that begins removal proceedings",
    type: "boolean",
    required: true,
  },
  {
    id: "chargesOnNTA",
    label: "What does the NTA say you did?",
    sublabel: "You can copy the charge from the document, or describe it in your own words",
    type: "textarea",
    required: false,
    placeholder: "e.g. 'Entered without inspection' or 'Overstayed visa'",
  },
  {
    id: "immigrationCourtCity",
    label: "Which immigration court is your case in?",
    type: "text",
    required: false,
    placeholder: "e.g. Miami, Chicago, New York",
  },
  {
    id: "hearingDate",
    label: "Next hearing date",
    sublabel: "Check your NTA or any court notices you received",
    type: "date",
    required: false,
  },
  {
    id: "hearingType",
    label: "What kind of hearing is it?",
    type: "select",
    required: false,
    options: [
      "Master calendar hearing",
      "Individual (merits) hearing",
      "Bond hearing",
      "I don't know",
    ],
  },
  {
    id: "reliefSought",
    label: "What type of protection are you seeking?",
    sublabel: "Select all that apply",
    type: "select",
    required: true,
    options: [
      "Asylum",
      "Withholding of removal",
      "Convention Against Torture (CAT)",
      "Cancellation of removal",
      "Adjustment of status",
      "Voluntary departure",
      "I'm not sure — I need guidance",
    ],
  },
  {
    id: "persecutionNarrative",
    label: "Describe the harm you fear if removed",
    sublabel:
      "What happened to you, or what do you fear will happen? Who is responsible? Your answer is confidential.",
    type: "textarea",
    required: false,
    sensitiveFlag: true,
    placeholder: "Take your time. Use the voice button if it's easier to speak.",
  },
  {
    id: "priorDeportation",
    label: "Have you ever been deported or removed from the US before?",
    type: "boolean",
    required: true,
    sensitiveFlag: true,
  },
  {
    id: "priorDeportationDate",
    label: "When were you previously removed?",
    type: "date",
    required: false,
  },
];

// ─── Generic questions for other case types ───────────────────────────────────

const GENERIC_QUESTIONS: QuestionDef[] = [
  {
    id: "caseDescription",
    label: "Describe your situation",
    sublabel: "Tell us what brought you here and what you need help with",
    type: "textarea",
    required: true,
    placeholder: "Describe your immigration situation...",
  },
  {
    id: "currentImmigrationStatus",
    label: "What is your current immigration status?",
    type: "select",
    required: true,
    options: [
      "Without current immigration status",
      "On a valid visa (student, work, visitor, etc.)",
      "Lawful permanent resident (green card holder)",
      "Asylum seeker / pending case",
      "TPS holder",
      "DACA recipient",
      "Parolee",
      "Other / I'm not sure",
    ],
  },
];

// ─── Question map ─────────────────────────────────────────────────────────────

export const CASE_QUESTIONS: Record<MatterType, QuestionDef[]> = {
  ASYLUM: ASYLUM_QUESTIONS,
  TPS: TPS_QUESTIONS,
  REMOVAL_DEFENSE: REMOVAL_DEFENSE_QUESTIONS,
  WORK_PERMIT_EXTENSION: GENERIC_QUESTIONS,
  PR: GENERIC_QUESTIONS,
  FAMILY_SPONSORSHIP: GENERIC_QUESTIONS,
  STUDY_PERMIT_EXTENSION: GENERIC_QUESTIONS,
};

export const CASE_TYPE_LABELS: Record<MatterType, string> = {
  ASYLUM: "Asylum (I-589)",
  TPS: "Temporary Protected Status (TPS)",
  REMOVAL_DEFENSE: "Removal Defense / Deportation",
  WORK_PERMIT_EXTENSION: "Work Permit Extension",
  PR: "Permanent Residence",
  FAMILY_SPONSORSHIP: "Family Sponsorship",
  STUDY_PERMIT_EXTENSION: "Study Permit Extension",
};

export const HUMANITARIAN_TYPES: MatterType[] = [
  MatterType.ASYLUM,
  MatterType.TPS,
  MatterType.REMOVAL_DEFENSE,
];
