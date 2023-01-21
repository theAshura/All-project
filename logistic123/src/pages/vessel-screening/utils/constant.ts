export const OBJECT_REFERENCE = {
  CONDITION_OF_CLASS_DISPENSATIONS: 'Condition of Class/Dispensations',
  SURVEY_CLASS_INFO: 'Survey/Class Info',
  MAINTENANCE_PERFORMANCE: 'Maintenance Performance',
  OTHER_TECHNICAL_RECORDS: 'Other Technical Records',
  DRY_DOCKING: 'Dry Docking',
  INCIDENTS: 'Incidents',
  INJURIES: 'Injuries',
  OTHER_SMS_RECORDS: 'Other SMS Records',
  PORT_STATE_CONTROL: 'Port State Control',
  EXTERNAL_INSPECTIONS: 'External Inspections',
  INTERNAL_INSPECTIONS_AUDITS: 'Internal Inspections/Audits',
  PLANS_AND_DRAWINGS: 'Plans and Drawings',
  SAFETY_ENGAGEMENT: 'Safety Engagement',
  PILOT_TERMINAL_FEEDBACK: 'Pilot/Terminal Feedback',
};

export const TAB_REFERENCE = {
  TECHNICAL: 'Technical',
  SAFETY_MANAGEMENT: 'Safety Management',
  INSPECTIONS: 'Inspections',
  SAFETY_ENGAGEMENT: 'Safety Engagement',
  SHIP_PARTICULARS: 'Ship Particulars',
  PILOT_TERMINAL_FEEDBACK: 'Pilot/Terminal Feedback',
  PILOT_FEEDBACK: 'Pilot Feedback',
};

export enum RISK_LEVEL {
  NEGLIGIBLE = 'NEGLIGIBLE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RISK_FIELD {
  STATUS = 'status',
  TIMELOSS = 'timeLoss',
  OBSERVED_RISK = 'observedRisk',
  POTENTIAL_RISK = 'potentialRisk',
}

export enum TIMELOSS {
  YES = 'Yes',
  NO = 'No',
}

export enum RISK_VALUE {
  NEGLIGIBLE = 0,
  LOW = 10,
  MEDIUM = 20,
  HIGH = 30,
}

export enum REVERTED_RISK_VALUE {
  HIGH = 0,
  MEDIUM = 10,
  LOW = 20,
  NEGLIGIBLE = 30,
}

export enum RISK_SCORE_VALUE {
  NEGLIGIBLE = 0,
  LOW = 2,
  MEDIUM = 5,
  HIGH = 10,
}

export enum REVERTED_RISK_SCORE_VALUE {
  HIGH = 0,
  MEDIUM = 2,
  LOW = 5,
  NEGLIGIBLE = 10,
}

export const RISK_CELL_IDS = [
  RISK_FIELD.TIMELOSS,
  RISK_FIELD.POTENTIAL_RISK,
  RISK_FIELD.OBSERVED_RISK,
];

export const RISK_LEVEL_OPTIONS = [
  RISK_LEVEL.NEGLIGIBLE,
  RISK_LEVEL.LOW,
  RISK_LEVEL.MEDIUM,
  RISK_LEVEL.HIGH,
];

export const RISK_VALUE_TO_LEVEL = {
  [RISK_VALUE.NEGLIGIBLE]: RISK_LEVEL.NEGLIGIBLE,
  [RISK_VALUE.LOW]: RISK_LEVEL.LOW,
  [RISK_VALUE.MEDIUM]: RISK_LEVEL.MEDIUM,
  [RISK_VALUE.HIGH]: RISK_LEVEL.HIGH,
};

export const REVERTED_RISK_VALUE_TO_LEVEL = {
  [REVERTED_RISK_VALUE.NEGLIGIBLE]: RISK_LEVEL.NEGLIGIBLE,
  [REVERTED_RISK_VALUE.LOW]: RISK_LEVEL.LOW,
  [REVERTED_RISK_VALUE.MEDIUM]: RISK_LEVEL.MEDIUM,
  [REVERTED_RISK_VALUE.HIGH]: RISK_LEVEL.HIGH,
};

export const RISK_LEVEL_TO_VALUE = {
  [RISK_LEVEL.NEGLIGIBLE]: RISK_VALUE.NEGLIGIBLE,
  [RISK_LEVEL.LOW]: RISK_VALUE.LOW,
  [RISK_LEVEL.MEDIUM]: RISK_VALUE.MEDIUM,
  [RISK_LEVEL.HIGH]: RISK_VALUE.HIGH,
};

export const REVERTED_RISK_LEVEL_TO_VALUE = {
  [RISK_LEVEL.NEGLIGIBLE]: REVERTED_RISK_VALUE.NEGLIGIBLE,
  [RISK_LEVEL.LOW]: REVERTED_RISK_VALUE.LOW,
  [RISK_LEVEL.MEDIUM]: REVERTED_RISK_VALUE.MEDIUM,
  [RISK_LEVEL.HIGH]: REVERTED_RISK_VALUE.HIGH,
};

export const RISK_LEVEL_TO_SCORE = {
  [RISK_LEVEL.NEGLIGIBLE]: RISK_SCORE_VALUE.NEGLIGIBLE,
  [RISK_LEVEL.LOW]: RISK_SCORE_VALUE.LOW,
  [RISK_LEVEL.MEDIUM]: RISK_SCORE_VALUE.MEDIUM,
  [RISK_LEVEL.HIGH]: RISK_SCORE_VALUE.HIGH,
};

export const REVERTED_RISK_LEVEL_TO_SCORE = {
  [RISK_LEVEL.NEGLIGIBLE]: REVERTED_RISK_SCORE_VALUE.NEGLIGIBLE,
  [RISK_LEVEL.LOW]: REVERTED_RISK_SCORE_VALUE.LOW,
  [RISK_LEVEL.MEDIUM]: REVERTED_RISK_SCORE_VALUE.MEDIUM,
  [RISK_LEVEL.HIGH]: REVERTED_RISK_SCORE_VALUE.HIGH,
};

export const TIMELOSS_OPTIONS = [TIMELOSS.YES, TIMELOSS.NO];

export const TIMELOSS_VALUE_TO_LABEL = {
  true: TIMELOSS.YES,
  false: TIMELOSS.NO,
};

export const TIMELOSS_LABEL_TO_VALUE = {
  [TIMELOSS.YES]: true,
  [TIMELOSS.NO]: false,
};