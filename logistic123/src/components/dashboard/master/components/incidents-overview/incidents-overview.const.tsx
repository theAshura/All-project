export enum IncidentsChartType {
  NUMBER_OF_INCIDENTS_PER_PORT = 'Number of Incidents per Port',
  INCIDENT_BASIC_POTENTIAL_RISK = 'Incident Basis Potential Risk',
  TYPE_OF_INCIDENTS = 'Type of incidents',
}

export enum VesselScreeningPotentialRiskEnum {
  UNASSIGNED = 'Unassigned',
  NEGLIGIBLE = 'Negligible', // 0
  LOW = 'Low', // 10
  MEDIUM = 'Medium', // 20
  HIGH = 'High', // 30
}

export interface ChartInfo {
  label: string;
  data: number[];
}

export const IncidentStatus = {
  Unassigned: 'Unassigned',
  Pending: 'Pending',
  InProgress: 'In Progress',
  Cleared: 'Cleared',
};

export const IncidentsPerPortPerStatus = [
  {
    color: '#BBBABF',
    title: IncidentStatus.Unassigned,
  },
  {
    color: '#EBC844',
    title: IncidentStatus.Pending,
  },
  {
    color: '#F16C20',
    title: IncidentStatus.InProgress,
  },
  {
    color: '#0F5B78',
    title: IncidentStatus.Cleared,
  },
];
