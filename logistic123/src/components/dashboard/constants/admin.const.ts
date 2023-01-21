import { ColumnTableType } from 'components/common/table-antd/TableAntd';

export const columnTotalSubscription: ColumnTableType[] = [
  {
    title: ' S.No',
    dataIndex: 'sno',
    width: 200,
  },
  {
    title: `Types`,
    dataIndex: 'type',
    width: 200,
  },
  {
    title: 'Register Date',
    dataIndex: 'registerDate',
    width: 200,
  },
];

export const mockTotalSubscription = [
  { sno: '1', type: 'Basic', registerDate: '22/07/2021' },
  { sno: '2', type: 'Coming soon', registerDate: '22/07/2021' },
  { sno: '3', type: 'Basic', registerDate: '22/07/2021' },
  { sno: '4', type: 'Basic', registerDate: '22/07/2021' },
  { sno: '5', type: 'Basic', registerDate: '22/07/2021' },
  { sno: '6', type: 'Basic', registerDate: '22/07/2021' },
  { sno: '7', type: 'Basic', registerDate: '22/07/2021' },
  { sno: '8', type: 'Basic', registerDate: '22/07/2021' },
];

export const columnNumberOfTotalAccount: ColumnTableType[] = [
  {
    title: ' S.No',
    dataIndex: 'sno',
    width: 120,
  },
  {
    title: `User Name`,
    dataIndex: 'username',
    sortField: 'username',
    width: 200,
    isSort: true,
  },
  {
    title: 'Company',
    dataIndex: 'company',
    sortField: 'company.name',
    width: 200,
    isSort: true,
  },
];

export const dataLineChart = [
  {
    label: 'My First dataset',
    data: [
      15000, 18000, 20000, 21000, 20000, 19000, 18000, 20000, 24000, 30000,
      35000, 40000, 48000, 57000, 55000, 44000, 34000, 32000, 29000, 28000,
      26000, 25000, 27000, 30000, 33000, 37000, 42000, 48000, 54000, 60000,
      60000,
    ],
  },
];

export enum ModalDashboardType {
  TOTAL_OF_DESCRIPTION = 'TOTAL_OF_DESCRIPTION',
  NUMBER_OF_TOTAL_ACCOUNT = 'NUMBER_OF_TOTAL_ACCOUNT',

  HIDDEN = 'HIDDEN',
}
