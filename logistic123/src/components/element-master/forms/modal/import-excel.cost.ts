import cloneDeep from 'lodash/cloneDeep';

export const listKeysTemplate = {
  code: 'Element Code',
  name: 'Element Name',
  number: 'Element Number',
  stage: 'Stage',
  questionNumber: 'Question Number',
  keyPerformanceIndicator: 'Key Performance Indicator',
  bestPracticeGuidance: 'Best Practice Guidance',
};

export const dataSourceParse = [
  {
    key: 0,
    columnName: listKeysTemplate.code,
    excelIndex: 'A',
    excelValue: 'A',
  },
  {
    key: 1,
    columnName: listKeysTemplate.name,
    excelIndex: 'B',
    excelValue: 'B',
  },
  {
    key: 2,
    columnName: listKeysTemplate.number,
    excelIndex: 'C',
    excelValue: 'C',
  },
  {
    key: 3,
    columnName: listKeysTemplate.stage,
    excelIndex: 'D',
    excelValue: 'D',
  },
  {
    key: 4,
    columnName: listKeysTemplate.questionNumber,
    excelIndex: 'E',
    excelValue: 'E',
  },
  {
    key: 5,
    columnName: listKeysTemplate.keyPerformanceIndicator,
    excelIndex: 'F',
    excelValue: 'F',
  },
  {
    key: 6,
    columnName: listKeysTemplate.bestPracticeGuidance,
    excelIndex: 'G',
    excelValue: 'G',
  },
];

export const listKeysRequired = [
  listKeysTemplate.code,
  listKeysTemplate.name,
  listKeysTemplate.stage,
  listKeysTemplate.questionNumber,
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
