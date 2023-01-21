export const CHECKLISTS_PILOT_TERMINAL_FEEDBACK = [
  'Ability of bridge team members to communicate with pilots in English',
  'Use of English as the designated spoken language on the bridge',
  'Use of English as the designated spoken language between bridge and mooring stations',
  `Vessel's preparation in relation to Terminal's Port Handbook requirements`,
  'Responses and feedback received from ship-staff during maneuvering operations',
  'Overall skill level of ship-staff',
  `Vessel's machinery performed as per information provided to pilots`,
  'Any concerns raised by crew on vessel operations ?',
];

export enum QUESTION_FEEDBACK {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  LOW = 'LOW',
  NOT_APPLICABLE = 'NOT APPLICABLE',
}

export enum QUESTION_CONVERT_FEEDBACK {
  EXCELLENT = 10,
  GOOD = 5,
  AVERAGE = 2,
  LOW = 0,
  NOT_APPLICABLE = null,
}

export enum FEEDBACK_TYPE {
  SHIP_MANAGEMENT = 'Ship Management (DOC Holder)',
  SHIP_OWNER = 'Ship Owner',
  CHARTERER = 'Charterer',
  TERMINAL = 'Terminal',
  PILOT_SERVICES = 'Pilot Services',
  INSPECTION_SERVICES = 'Inspection Services',
  SERVICES_PROVIDER = 'Service Provider',
  OTHERS = 'Others',
}
