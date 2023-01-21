import { ColumnTableType } from 'components/common/table-antd/TableAntd';
import { ProgressCardData } from '../components/chart/dashboardCard/DashBoardMasterCard';

export const vesselSafetyScoreData: ProgressCardData[] = [
  {
    color: '#964FFF',
    title: 'Score = N / A',
    value: 10,
    index: 0,
  },
  {
    color: '#E9453A',
    title: 'Score = 0',
    value: 10,
    index: 1,
  },
  {
    color: '#FF9F0A',
    title: 'Score = 1',
    value: 20,
    index: 2,
  },
  {
    color: '#ACB7C9',
    title: 'Score = 2',
    value: 30,
    index: 3,
  },
  {
    color: '#A2845E',
    title: 'Score = 3',
    value: 40,
    index: 4,
  },
  {
    color: '#3B9FF3',
    title: 'Score = 4',
    value: 90,
    index: 5,
  },
  {
    color: '#18BA92',
    title: 'Score = 5',
    value: 200,
    index: 6,
  },
];

// Vessel's GHG Rating
export const vesselGHGScoreDate: ProgressCardData[] = [
  {
    color: '#964FFF',
    title: 'Rating = A',
    value: 90,
  },
  {
    color: '#0842FF',
    title: 'Rating = B',
    value: 10,
  },
  {
    color: '#0091E2',
    title: 'Rating = C',
    value: 67,
  },
  {
    color: '#31CDDB',
    title: 'Rating = D',
    value: 25,
  },
  {
    color: '#ACB7C9',
    title: 'Rating = E',
    value: 13,
  },
  {
    color: '#FF9F0A',
    title: 'Rating = F',
    value: 21,
  },
  {
    color: '#A2845E',
    title: 'Rating = G',
    value: 174,
  },
  {
    color: '#FFDE54',
    title: 'Rating = Unknown',
    value: 10,
  },
];

// Inspection Plan
export const inspectionPlanData: ProgressCardData[] = [
  {
    color: '#8E8C94',
    title: 'Draft',
    value: 12,
    index: 0,
  },
  {
    color: '#E101E6',
    title: 'Accepted',
    value: 10,
    index: 3,
  },
  {
    color: '#E9453A',
    title: 'Cancelled',
    value: 18,
    index: 8,
  },
  {
    color: '#0842FF',
    title: 'Planned',
    value: 15,
    index: 4,
  },
  {
    color: '#0091E2',
    title: 'Reassigned',
    value: 10,
    index: 7,
  },
  {
    color: '#5E5CE6',
    title: 'In progress',
    value: 15,
    index: 5,
  },
  {
    color: '#091DA9',
    title: 'Submitted',
    value: 5,
  },
  {
    color: '#1EE9B6',
    title: 'Completed',
    value: 10,
    index: 6,
  },
  {
    color: '#30D158',
    title: 'Approved',
    value: 5,
    index: 2,
  },
];

// Incident Review status
export const fakeIncidentReviewData: ProgressCardData[] = [
  {
    color: '#FFDE54',
    title: 'Pending',
    value: 16,
  },
  {
    color: '#3B9FF3',
    title: 'In Progress',
    value: 8,
  },
  {
    color: '#1EE9B6',
    title: 'Cleared',
    value: 16,
  },
];

// Vessel's Last inspection status from RightShip

export const rightShipData: ProgressCardData[] = [
  {
    color: '#3B9FF3',
    title: 'Acceptable',
    value: 250,
  },
  {
    color: '#FFDE54',
    title: 'Unacceptable',
    value: 50,
  },
  {
    color: '#F42829',
    title: 'N/A',
    value: 100,
  },
];

// Outstanding issue
export const fakeOutStanding: { title: string; numOfIssue: number }[] = [
  {
    title: 'Number of open non-conformity by vessel (last 30 days)',
    numOfIssue: 19,
  },
  {
    title: 'Number of open non-conformity by vessel (last 30 days)',
    numOfIssue: 14,
  },
  {
    title: 'Number of open non-conformity by vessel (last 30 days)',
    numOfIssue: 17,
  },
  {
    title: 'Number of open non-conformity by vessel (last 30 days)',
    numOfIssue: 18,
  },
  {
    title: 'Number of open non-conformity by vessel (last 30 days)',
    numOfIssue: 7,
  },
];

// Trends of outstanding issues
export const fakeTrendIssues = [
  {
    label: 'Number of non- conformity /observations',
    data: [1, 2, 3, 4, 5],
  },
  {
    label: 'Number of inspection time tables not closed out',
    data: [6, 7, 8, 9, 10],
  },
  {
    label: 'Number of report of findings not closed out',
    data: [11, 12, 13, 14, 15],
  },
  {
    label: 'Number of inspection reports not closed out',
    data: [16, 17, 8, 19, 20],
  },
];

// Number of incidents
export const fakeNumberIncidents = [
  {
    label: 'Dataset 1',
    data: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    backgroundColor: '#3B9FF3',
    barPercentage: 0.5,
  },
];

// Vessel Age
export const fakeVesselAge = [
  {
    data: [4, 5, 6, 7],
    backgroundColor: '#3B9FF3',
    // barPercentage: 0.5,
    barThickness: 20,
  },
];

// column safety score
export const safetyScoreColumn: ColumnTableType[] = [
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    width: '20%',
  },
  {
    title: `IMO`,
    dataIndex: 'imo',
    width: '20%',
    isHightLight: true,
  },
  {
    title: 'Vessel type',
    dataIndex: 'vesselType',
    width: '20%',
  },
  {
    title: 'Safety score',
    dataIndex: 'safetyScore',
    width: '20%',
  },
  {
    title: 'Business division',
    dataIndex: 'businessDivision',
    width: '20%',
  },
];

export const safetyScoreData = [
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    safetyScore: 3,
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    safetyScore: 3,

    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    safetyScore: 3,

    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    safetyScore: 3,
    businessDivision: 'Business Division 1',
  },
];

// ghg rating column
export const ghgRatingColumn: ColumnTableType[] = [
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    width: '20%',
  },
  {
    title: `IMO`,
    dataIndex: 'imo',
    isHightLight: true,
    width: '20%',
  },
  {
    title: 'Vessel type',
    dataIndex: 'vesselType',
    width: '20%',
  },
  {
    title: 'GHG Rating',
    dataIndex: 'ghgRating',
    width: '20%',
  },
  {
    title: 'Business division',
    dataIndex: 'businessDivision',
    width: '20%',
  },
];

export const ghgRatingData = [
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    ghgRating: 'A',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    ghgRating: 'A',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    ghgRating: 'A',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    ghgRating: 'A',
    businessDivision: 'Business Division 1',
  },
];

// under spection column
export const underInspectionColumn: ColumnTableType[] = [
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    width: '20%',
  },
  {
    title: `IMO`,
    dataIndex: 'imo',
    width: '20%',
    isHightLight: true,
  },
  {
    title: 'Vessel type',
    dataIndex: 'vesselType',
    width: '20%',
  },
  {
    title: 'Business division',
    dataIndex: 'businessDivision',
    width: '20%',
  },
  {
    title: 'Plan Ref.ID',
    dataIndex: 'planRef',
    width: '20%',
    isHightLight: true,
  },
];

export const underInspection = [
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    planRef: 'Ref 1',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    planRef: 'Ref 2',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    planRef: 'Ref 3',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    planRef: 'Ref 4',
    businessDivision: 'Business Division 1',
  },
];

export const restrictedVesselColumn: ColumnTableType[] = [
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    width: '25%',
  },
  {
    title: `IMO`,
    dataIndex: 'imo',
    width: '25%',
    isHightLight: true,
  },
  {
    title: 'Vessel type',
    dataIndex: 'vesselType',
    width: '25%',
  },
  {
    title: 'Business division',
    dataIndex: 'businessDivision',
    width: '25%',
  },
];

export const restrictedVesselData = [
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    businessDivision: 'Ref 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    businessDivision: 'Ref 2',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    businessDivision: 'Ref 3',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    businessDivision: 'Ref 4',
  },
];

export const validityColumn: ColumnTableType[] = [
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    width: '20%',
  },
  {
    title: `IMO`,
    dataIndex: 'imo',
    width: '20%',
    isHightLight: true,
  },
  {
    title: 'Vessel type',
    dataIndex: 'vesselType',
    width: '20%',
  },
  {
    title: 'Business division',
    dataIndex: 'businessDivision',
    width: '20%',
  },
  {
    title: 'Validity remaining (days)',
    dataIndex: 'validity',
    width: '20%',
  },
];

export const validityData = [
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    validity: 'Validity 1',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    validity: 'Validity 2',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    validity: 'Validity 3',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Name 1',
    imo: 'IMO 1',
    vesselType: 'Vessel Type 1',
    validity: 'Validity 4',
    businessDivision: 'Business Division 1',
  },
];

export const auditChecklistColumn: ColumnTableType[] = [
  {
    title: 'Template code',
    dataIndex: 'templateCode',
    width: '25%',
    isHightLight: true,
  },
  {
    title: 'Template name',
    dataIndex: 'templateName',
    width: '25%',
  },
  {
    title: 'Revision date',
    dataIndex: 'revisionDate',
    width: '25%',
  },
  {
    title: 'status',
    dataIndex: 'status',
    width: '25%',
  },
];

export const findingFormColumn: ColumnTableType[] = [
  {
    title: 'S.No',
    dataIndex: 'sNo',
    width: '20%',
  },
  {
    title: 'Ref.ID',
    dataIndex: 'refID',
    width: '20%',
    isHightLight: true,
  },
  {
    title: 'Vessel Name',
    dataIndex: 'vesselName',
    width: '20%',
  },
  {
    title: 'Lead inspector',
    dataIndex: 'leadInspector',
    width: '20%',
  },
  {
    title: 'status',
    dataIndex: 'status',
    width: '20%',
  },
];

export const vesselRiskRatingData: ProgressCardData[] = [
  {
    color: '#BBBABF',
    title: 'Score = N / A',
    index: 0,
  },
  {
    color: '#3B9FF3',
    title: 'Score = 0 (Negligible)',
    index: 1,
  },
  {
    color: '#18BA92',
    title: '0 < Score =< 2 (Low)',
    index: 2,
  },
  {
    color: '#FFB800',
    title: '2< Score = <5 (Medium)',
    index: 3,
  },
  {
    color: '#F53E3E',
    title: '5< Score =< 10 (High)',
    index: 4,
  },
];

export const potentialObservedRiskRatingData: ProgressCardData[] = [
  {
    color: '#BBBABF',
    title: 'Unassigned',
    index: 0,
  },
  {
    color: '#3B9FF3',
    title: 'Negligible',
    index: 1,
  },
  {
    color: '#18BA92',
    title: 'Low',
    index: 2,
  },
  {
    color: '#FFB800',
    title: 'Medium',
    index: 3,
  },
  {
    color: '#F53E3E',
    title: 'High',
    index: 4,
  },
];
