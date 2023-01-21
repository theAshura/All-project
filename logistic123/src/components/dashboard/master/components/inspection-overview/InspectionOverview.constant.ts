export interface ChartInfo {
  label: string;
  data: number[];
  color?: string;
}

export const InspectionCasesPerInspectionType = [
  {
    color: '#AE59C6',
    label: 'Safety Engagement (In Port)',
    value: 15,
  },
  {
    color: '#1E62DC',
    label: 'Safety Engagement (Pre-berthing)',
    value: 7,
  },
  {
    color: '#3B9FF3',
    label: 'Safety Engagement',
    value: 11,
  },
  {
    color: '#18BA92',
    label: 'Safety Module Checklist',
    value: 8,
  },
  {
    color: '#FFDE54',
    label: 'Feedback',
    value: 9,
  },
];

export const InspectionCasesPerPort = [
  {
    color: '#AE59C6',
    label: 'Houston',
    value: 15,
  },
  {
    color: '#1E62DC',
    label: 'Chiba',
    value: 7,
  },
  {
    color: '#3B9FF3',
    label: 'Dubai',
    value: 11,
  },
  {
    color: '#18BA92',
    label: 'Shin Kurushima dock',
    value: 8,
  },
  {
    color: '#FFDE54',
    label: 'Singapore',
    value: 9,
  },
  {
    color: '#FF6E01',
    label: 'VietNam',
    value: 10,
  },
];

export const InspectionCasesPerStatus = [
  {
    color: '#AE59C6',
    title: 'Opening schedule ',
    value: 15,
    index: 0,
  },
  {
    color: '#1E62DC',
    title: 'Disapproved report',
    value: 7,
    index: 1,
  },
  {
    color: '#3B9FF3',
    title: 'Submitted report/Under 1st approval ',
    value: 11,
    index: 2,
  },
  {
    color: '#5ACFF9',
    title: 'Approved report',
    value: 8,
    index: 3,
  },
  {
    color: '#18BA92',
    title: 'Sent CAR/Under CAP preparation',
    value: 9,
    index: 4,
  },
  {
    color: '#6EEA91',
    title: 'Submit CAP/Waiting CAP approval',
    value: 10,
    index: 5,
  },
  {
    color: '#FFDE54',
    title: 'Disapproved CAP/Waiting CAP approval 2',
    value: 10,
    index: 6,
  },
  {
    color: '#FF6E01',
    title: 'Approved CAP/No need further verification/Closed',
    value: 10,
    index: 7,
  },
  {
    color: '#F42829',
    title: 'Waiting Verification',
    value: 10,
    index: 8,
  },
  {
    color: '#FB1A8F',
    title: 'Approved verification/Closed',
    value: 10,
    index: 9,
  },
];

export const inspectionCasesPerPortStatus = [
  {
    color: '#AE59C6',
    title: 'Opening schedule ',
  },
  {
    color: '#1E62DC',
    title: 'Disapproved report',
  },
  {
    color: '#3B9FF3',
    title: 'Submitted report/Under 1st approval ',
  },
  {
    color: '#1E62DC',
    title: 'Under 2nd approval',
  },
  {
    color: '#3B9FF3',
    title: 'Under 3rd approval',
  },
  {
    color: '#5ACFF9',
    title: 'Under 4th approval',
  },
  {
    color: '#3BF3F3',
    title: 'Under 5th approval',
  },
  {
    color: '#3BF3F3',
    title: 'Under 6th approval',
  },
  {
    color: '#5ACFF9',
    title: 'Approved report',
  },
  {
    color: '#18BA92',
    title: 'Sent CAR/Under CAP preparation',
  },
  {
    color: '#6EEA91',
    title: 'Submit CAP/Waiting CAP approval',
  },
  {
    color: '#FFDE54',
    title: 'Disapproved CAP/Waiting CAP approval 2',
  },
  {
    color: '#FF6E01',
    title: 'Approved CAP/No need further verification/Closed',
  },
  {
    color: '#F42829',
    title: 'Waiting Verification',
  },
  {
    color: '#FB1A8F',
    title: 'Approved verification/Closed',
  },
];

export const InspectionCasesPerType: ChartInfo[] = [
  {
    label: 'Safety Engagement (In Port)',
    data: [1, 2, 3, 4, 5],
    color: '#0091E2',
  },
  {
    label: 'Safety Engagement (Pre-berthing) ',
    data: [2, 3, 5, 7, 9],
    color: '#964FFF',
  },
  {
    label: 'Safety Engagement',
    data: [1, 2, 3, 4, 5],
    color: '#3B9FF3',
  },
  {
    label: 'Safety Module Checklist',
    data: [1, 2, 3, 4, 5],
    color: '#31CDDB',
  },
  {
    label: 'Feedback',
    data: [1, 2, 3, 4, 5],
    color: '#31DB61',
  },
];

export const InspectionPerPortPerStatusLabel = {
  numOpeningSchedule: 'Opening schedule',
  numDisapprovedReport: 'Disapproved report',
  numSubmittedReport: 'Submitted report/Under 1st approval',
  numUnder2Approval: 'Under 2nd approval',
  numUnder3Approval: 'Under 3rd approval',
  numUnder4Approval: 'Under 4th approval',
  numUnder5Approval: 'Under 5th approval',
  numUnder6Approval: 'Under 6th approval',
  numApprovedReport: 'Approved report',
  numSentCarUnderCap: 'Sent CAR/Under CAP preparation',
  numDisapprovedCap: 'Disapproved CAP/Waiting CAP approval 2',
  numSubmitCap: 'Submit CAP/Waiting CAP approval',
  numApprovedCapNoVerification:
    'Approved CAP/No need further verification/Closed',
  numWaitingVerification: 'Waiting Verification',
  numApprovedVerification: 'Approved verification/Closed',
};
