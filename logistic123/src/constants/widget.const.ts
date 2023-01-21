import { AppRouteConst } from 'constants/route.const';
import { ColumnTableType } from 'components/common/table-antd/TableAntd';
import history from 'helpers/history.helper';

export enum OutstandingCarCapIssueModalType {
  OPEN_CAR = 'OPEN_CAR',
  HOLD_CAR = 'HOLD_CAR',
  PENDING_CAR = 'PENDING_CAR',
  DENIED_CAR = 'DENIED_CAR',
  NULL = 'NULL',
}

export const columnCarCapNeedReviewing: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: '20%',
    isHightLight: true,
  },
  {
    title: 'CAP',
    dataIndex: 'cap',
    width: '20%',
  },
  {
    title: 'Estimated closure date',
    dataIndex: 'estimatedClosureDate',
    width: '20%',
    isDateTime: true,
  },
  {
    title: 'Number of findings',
    dataIndex: 'numberOfFindings',
    width: '20%',
  },
  {
    title: 'Entity',
    dataIndex: 'entity',
    width: '20%',
  },
];

export const outstandingCarCapIssue = [
  {
    modalType: OutstandingCarCapIssueModalType.OPEN_CAR,
    name: 'Number of open CAR',
    number: 1,
  },
  {
    modalType: OutstandingCarCapIssueModalType.HOLD_CAR,
    name: 'Number of hold CAR',
    number: 2,
  },
  {
    modalType: OutstandingCarCapIssueModalType.PENDING_CAR,
    name: 'Number of pending CAR',
    number: 3,
  },
  {
    modalType: OutstandingCarCapIssueModalType.DENIED_CAR,
    name: 'Number of denied CAR',
    number: 4,
  },
];

export const mockData = [
  {
    refId: 'Lorem ipsum',
    entity: 'Vessel',
    car: 'Solomon Park ',
    cap: 'Solomon Park ',
    numberOfFindings: '365',
    actualClosureDate: new Date(),
    pic: 'Lorem ipsum',
  },
  {
    refId: 'Lorem ipsum',
    entity: 'Vessel',
    car: 'Solomon Park ',
    cap: 'Solomon Park ',
    numberOfFindings: '365',
    actualClosureDate: new Date(),
    pic: 'Lorem ipsum',
  },
  {
    refId: 'Lorem ipsum',
    entity: 'Vessel',
    car: 'Solomon Park ',
    cap: 'Solomon Park ',
    numberOfFindings: '365',
    actualClosureDate: new Date(),
    pic: 'Lorem ipsum',
  },
];

export const outStandingCarCapIssueColumns: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    isHightLight: true,
    width: 160,
    onClickHightLight: (data) => {
      if (data?.id) {
        history.push(AppRouteConst.getInspectionFollowUpById(data.id));
      }
    },
  },
  {
    title: 'CAR',
    dataIndex: 'car',
    width: 160,
  },
  {
    title: 'CAP',
    dataIndex: 'cap',
    width: 160,
  },
  {
    title: 'Number of findings ',
    dataIndex: 'numberOfFindings',
    width: 160,
  },
  {
    title: 'Actual closure date',
    dataIndex: 'actualClosureDate',
    isDateTime: true,
    width: 160,
  },
  {
    title: 'PIC',
    dataIndex: 'pic',
    width: 160,
  },
];

export enum DashBoard {
  COMPANY = 'company',
  AUDITOR = 'auditor',
}

export const outstandingCarCapIssueAuditor = [
  {
    modalType: OutstandingCarCapIssueModalType.OPEN_CAR,
    name: 'Number of open CAR',
    number: 1,
  },
  {
    modalType: OutstandingCarCapIssueModalType.HOLD_CAR,
    name: 'Number of hold CAR',
    number: 2,
  },
  {
    modalType: OutstandingCarCapIssueModalType.PENDING_CAR,
    name: 'Number of pending CAR',
    number: 3,
  },
];

export const TrendOfOutstandingLabels = (dashBoard: DashBoard) => {
  const defaultData = [
    {
      label: 'Number of pending CAP',
      color: '#F16C20',
    },
    {
      label: 'Number of open CAR',
      color: '#0F5B78',
    },
    {
      label: 'Number of hold CAP',
      color: '#1C886B',
    },
  ];

  return dashBoard === DashBoard.COMPANY
    ? [
        {
          label: 'Number of denied CAP',
          color: '#EBC844',
        },
        ...defaultData,
      ]
    : defaultData;
};
