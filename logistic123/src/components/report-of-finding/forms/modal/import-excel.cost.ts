import cloneDeep from 'lodash/cloneDeep';

export const listKeysTemplate = {
  referenceNumber: 'Reference Number',
  auditType: 'Inspection Type',
  findingsType: 'Findings Type',
  isSignificant: 'Is Significant',
  department: 'Department',
  mainCategory: 'Main Category',
  stSubCategory: 'Second Category',
  viqCategory: 'VIQ Category',
  findingsComments: 'Findings Comments',
  findingRemarks: 'Finding Remarks',
};

export const dataSourceParse = [
  {
    key: 0,
    columnName: listKeysTemplate.referenceNumber,
    excelIndex: 'A',
  },
  {
    key: 1,
    columnName: listKeysTemplate.auditType,
    excelIndex: 'B',
  },
  {
    key: 2,
    columnName: listKeysTemplate.findingsType,
    excelIndex: 'C',
  },
  {
    key: 3,
    columnName: listKeysTemplate.isSignificant,
    excelIndex: 'D',
  },
  {
    key: 4,
    columnName: listKeysTemplate.department,
    excelIndex: 'E',
  },
  {
    key: 5,
    columnName: listKeysTemplate.mainCategory,
    excelIndex: 'F',
  },
  {
    key: 6,
    columnName: listKeysTemplate.stSubCategory,
    excelIndex: 'G',
  },
  {
    key: 7,
    columnName: listKeysTemplate.viqCategory,
    excelIndex: 'H',
  },
  {
    key: 8,
    columnName: listKeysTemplate.findingsComments,
    excelIndex: 'I',
  },
  {
    key: 9,
    columnName: listKeysTemplate.findingRemarks,
    excelIndex: 'J',
  },
];

export const listKeysRequired = [
  listKeysTemplate.referenceNumber,
  listKeysTemplate.auditType,
  listKeysTemplate.findingsType,
  listKeysTemplate.findingsComments,
  listKeysTemplate.isSignificant,
];
export const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map((x) => `.${x}`)
  .join(',');

export const reloadSheetByKeys = (data, listKeysData) => {
  const checkIsKeyExist = (key) =>
    listKeysData?.some((item) => item.excelIndex === key);
  const getDataByKey = (key) =>
    listKeysData?.find((item) => item.excelIndex === key).key;
  const dataResult: any = data?.map((item, index) => {
    const result: any = {
      key: index,
    };
    if (checkIsKeyExist('A')) {
      result.A = cloneDeep(item[getDataByKey('A')]);
    }
    if (checkIsKeyExist('B')) {
      result.B = cloneDeep(item[getDataByKey('B')]);
    }
    if (checkIsKeyExist('C')) {
      result.C = cloneDeep(item[getDataByKey('C')]);
    }
    if (checkIsKeyExist('D')) {
      result.D = cloneDeep(item[getDataByKey('D')]);
    }
    if (checkIsKeyExist('E')) {
      result.E = cloneDeep(item[getDataByKey('E')]);
    }
    if (checkIsKeyExist('F')) {
      result.F = cloneDeep(item[getDataByKey('F')]);
    }
    if (checkIsKeyExist('G')) {
      result.G = cloneDeep(item[getDataByKey('G')]);
    }
    if (checkIsKeyExist('H')) {
      result.H = cloneDeep(item[getDataByKey('H')]);
    }
    if (checkIsKeyExist('I')) {
      result.I = cloneDeep(item[getDataByKey('I')]);
    }
    if (checkIsKeyExist('J')) {
      result.J = cloneDeep(item[getDataByKey('J')]);
    }
    if (checkIsKeyExist('K')) {
      result.K = cloneDeep(item[getDataByKey('K')]);
    }
    if (checkIsKeyExist('L')) {
      result.L = cloneDeep(item[getDataByKey('L')]);
    }
    return result;
  });
  return dataResult;
};

export const listColByKeys = (listCol, listKey) => {
  const listColFiltered = listCol.filter((item) => {
    if (listKey.some((i) => i.excelIndex === item.key)) {
      return true;
    }
    return false;
  });
  return listColFiltered;
};

export const handleSort = (a, b) => {
  const nameA = a.excelIndex.toUpperCase();
  const nameB = b.excelIndex.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};
