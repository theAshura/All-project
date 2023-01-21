import { ColumnTableType } from 'components/common/table-antd/TableAntd';
import { AppRouteConst } from 'constants/route.const';
import { openNewPage } from 'helpers/utils.helper';

export enum ColType {
  BELOW_13 = '<= 13',
  BELOW_20 = '<= 20',
  BELOW_50 = '<= 50',
  BELOW_100 = '<= 100',
  NULL = 'NULL',
}

export const VESSEL_BAR_AGE_COLUMNS: ColumnTableType[] = [
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
    onClickHightLight(dataItem) {
      if (dataItem?.id) {
        openNewPage(AppRouteConst.getVesselById(dataItem?.id));
      }
    },
  },
  {
    title: 'Vessel type',
    dataIndex: 'vesselType',
    width: '20%',
  },
  {
    title: 'Vessel Age',
    dataIndex: 'vesselAge',
    width: '20%',
  },
  {
    title: 'Business division',
    dataIndex: 'businessDivision',
    width: '20%',
  },
];

export const VESSEL_BAR_AGE_DATA = [
  {
    vesselName: 'Titanic',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '1.50',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Wingadium Leviosa',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '3.01',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Expecto Patronum',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '8.81',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Alohamura',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '13.11',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Titanic',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '1.50',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Wingadium Leviosa',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '3.01',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Expecto Patronum',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '8.81',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Alohamura',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '13.11',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Titanic',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '1.50',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Wingadium Leviosa',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '3.01',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Expecto Patronum',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '8.81',
    businessDivision: 'Business Division 1',
  },
  {
    vesselName: 'Alohamura',
    imo: '9564891',
    vesselType: 'Passenger',
    vesselAge: '13.11',
    businessDivision: 'Business Division 1',
  },
];
