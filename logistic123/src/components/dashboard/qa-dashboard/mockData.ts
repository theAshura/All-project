import { ColumnTableType } from 'components/common/table-antd/TableAntd';

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
    width: '20%',
    isHightLight: true,
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
