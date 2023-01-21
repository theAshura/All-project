import { getListFileApi } from 'api/dms.api';
import moment, { Moment } from 'moment';
import { LoginSuccessResponse } from 'models/api/authentication.model';
import { IARReportHeaders } from 'models/api/internal-audit-report/internal-audit-report.model';
import capitalize from 'lodash/capitalize';
import camelCase from 'lodash/camelCase';
import queryString from 'query-string';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { CONFIG } from 'config';
import { toastError } from 'helpers/notification.helper';
import { REGEXP_VALIDATE_EMAIL } from 'constants/regExpValidate.const';
import {
  FileType,
  FilePrefix,
  STATUS_COORDINATES,
} from 'constants/common.const';
import { DEFAULT_LINE_HEIGHT } from 'constants/components/ag-grid.const';
import { uploadFileApi } from '../api/support.api';
import { COLORS } from '../pages/self-assessment/utils/constant';

export const mergePhoneNumber = (phoneNumber: string, code: string) =>
  [(`(${code})` ?? '').trim(), phoneNumber ?? ''].filter((x) => x).join(' ');

export const randomColor = () => {
  const color = Math.floor(Math.random() * 16777216).toString(16);

  return '#000000'.slice(0, -color.length) + color;
};

export function financial(x) {
  return Number.parseFloat(x || 0).toFixed(2);
}

export function convertLargeNumber(x: string | number) {
  const number = x ? Number(x) : 0;
  return number.toLocaleString(undefined);
}

export const formatToNumberPercent = (value: number, total: number) => {
  if (value) {
    return Number(financial((Number(value) / total) * 100));
  }
  return 0;
};

export const formatDateTime = (date: Date | string) => {
  if (!date) return '';
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  let hours = `${d.getHours()}`;
  let minuter = `${d.getMinutes()}`;

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  if (hours.length < 2) hours = `0${hours}`;
  if (minuter.length < 2) minuter = `0${minuter}`;
  return `${[day, month, year].join('/')} ${[hours, minuter].join(':')}`;
};

export const formatDateTimeDay = (date: Date | string) => {
  if (!date) return '';
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  return `${[day, month, year].join('/')}`;
};

export const dateStringComparator = (dataDate1: string, dataDate2: string) => {
  const date1 = dataDate1?.trim();
  const date2 = dataDate2?.trim();

  if (date1?.length < 5) {
    return 1;
  }
  if (date2?.length < 5) {
    return -1;
  }
  const dateParts1 = date1?.split('/') || [];

  const year1 = dateParts1[2] ? Number(dateParts1[2]?.slice(0, 4)) : 0;
  const month1 = Number(dateParts1[1]) - 1;
  const day1 = Number(dateParts1[0]);
  const time1 =
    dateParts1[2]?.length > 0 ? dateParts1[2]?.split(' ')[1] : '00:00';

  const dateParts2 = date2?.split('/') || [];
  const year2 = dateParts2[2] ? Number(dateParts2[2]?.slice(0, 4)) : 0;
  const month2 = Number(dateParts2[1]) - 1;
  const day2 = Number(dateParts2[0]);
  const time2 =
    dateParts1[2]?.length > 0 ? dateParts2[2]?.split(' ')[1] : '00:00';
  const cellDate1 = new Date(year1, month1, day1);
  const cellDate2 = new Date(year2, month2, day2);
  if (cellDate1 < cellDate2) {
    return -1;
  }
  if (cellDate1 > cellDate2) {
    return 1;
  }
  if (time1 < time2) {
    return -1;
  }
  if (time1 > time2) {
    return 1;
  }
  return 0;
};

export const handleCheckPassword = (password: string) => {
  const regExpPassword: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
  return regExpPassword.test(password);
};

export const handleCheckRole = (
  rolesUser: string[] = [],
  rolesPage: string[] = [],
) => rolesPage.find((rolePage) => rolesUser.includes(rolePage));

export const handleCheckRoleEdit = (useInfo: LoginSuccessResponse) => {
  switch (useInfo.roleScope) {
    case 'SuperAdmin':
      return {
        create: true,
        edit: true,
        view: true,
        delete: true,
      };
    case 'Admin':
      return {
        create: true,
        edit: true,
        view: true,
        delete: true,
      };
    default:
      return {
        create: false,
        edit: false,
        view: false,
        delete: false,
      };
  }
};

// 30°16'23.88''N
const LATITUDE_REGEX =
  /^(?<degree>\d+)°(?<minute>\d{1,2})'(?<second>\d{1,2}\.\d*)''(?<direct>[NS])$/;
// 130°16'23.88''E
const LONGITUDE_REGEX =
  /^(?<degree>\d+)°(?<minute>\d{1,2})'(?<second>\d{1,2}\.\d*)''(?<direct>[EW])$/;

export function convertLatDMS(input: string) {
  try {
    if (!input) return null;
    const {
      groups: { degree, minute, second, direct },
    } = LATITUDE_REGEX.exec(input);

    return {
      degree,
      minute,
      second,
      direct,
    };
  } catch (ex) {
    return null;
  }
}

export function convertLongDMS(input: string) {
  try {
    if (!input) return null;

    const {
      groups: { degree, minute, second, direct },
    } = LONGITUDE_REGEX.exec(input);

    return {
      degree,
      minute,
      second,
      direct,
    };
  } catch (ex) {
    return null;
  }
}

export function checkLatitudeDMS(input: string) {
  try {
    if (!input) return false;
    const {
      groups: { degree, minute, second },
    } = LATITUDE_REGEX.exec(String(input).replace('-', ''));

    const degreeInt = Number(degree);
    const minuteInt = Number(minute);
    const secondInt = Number(second);

    if (degreeInt > 90) return false;

    if (degreeInt === 90) {
      if (minuteInt === 0 && secondInt === 0) {
        return true;
      }
      return false;
    }
    if (minuteInt >= 60) return false;
    if (secondInt >= 60) return false;
    return true;
  } catch (ex) {
    return false;
  }
}

export function checkLongitudeDMS(input: string) {
  try {
    if (!input) return false;
    const {
      groups: { degree, minute, second },
    } = LONGITUDE_REGEX.exec(input);

    const degreeInt = Number(degree);
    const minuteInt = Number(minute);
    const secondInt = Number(second);

    if (degreeInt > 180) return false;

    if (degreeInt === 180) {
      if (minuteInt === 0 && secondInt === 0) {
        return true;
      }
      return false;
    }
    if (minuteInt >= 60) return false;
    if (secondInt >= 60) return false;

    return true;
  } catch (ex) {
    return false;
  }
}

export function checkLatitudeMessage(input: string) {
  try {
    if (!input) return STATUS_COORDINATES.WITHOUT_DIRECTION;
    const {
      groups: { degree, minute, second },
    } = LATITUDE_REGEX.exec(input);

    const degreeInt = Number(degree);
    const minuteInt = Number(minute);
    const secondInt = Number(second);

    if (degreeInt > 90) return STATUS_COORDINATES.OVER_DEGREE;

    if (degreeInt === 90) {
      if (minuteInt === 0 && secondInt === 0) {
        return STATUS_COORDINATES.TRUE;
      }
      return STATUS_COORDINATES.EQUAL_MAX_DEGREE;
    }
    if (minuteInt >= 60) return STATUS_COORDINATES.OVER_MINUTE;
    if (secondInt >= 60) return STATUS_COORDINATES.OVER_SECOND;
    return STATUS_COORDINATES.TRUE;
  } catch (ex) {
    return STATUS_COORDINATES.WITHOUT_DIRECTION;
  }
}

export function checkLongitudeMessage(input: string) {
  try {
    if (!input) return STATUS_COORDINATES.WITHOUT_DIRECTION;
    const {
      groups: { degree, minute, second },
    } = LONGITUDE_REGEX.exec(input);

    const degreeInt = Number(degree);
    const minuteInt = Number(minute);
    const secondInt = Number(second);

    if (degreeInt > 180) return STATUS_COORDINATES.OVER_DEGREE;

    if (degreeInt === 180) {
      if (minuteInt === 0 && secondInt === 0) {
        return STATUS_COORDINATES.TRUE;
      }
      return STATUS_COORDINATES.EQUAL_MAX_DEGREE;
    }
    if (minuteInt >= 60) return STATUS_COORDINATES.OVER_MINUTE;
    if (secondInt >= 60) return STATUS_COORDINATES.OVER_SECOND;

    return STATUS_COORDINATES.TRUE;
  } catch (ex) {
    return STATUS_COORDINATES.WITHOUT_DIRECTION;
  }
}

export const convertBToMB = (size) => {
  if (String(size)?.includes('MB')) {
    return size?.replace('MB', '');
  }
  return (Math.round((parseInt(size, 10) / (1024 * 1024)) * 100) / 100).toFixed(
    2,
  );
};

export const convertMBtoB = (size) => {
  if (String(size)?.includes('MB')) {
    return Number(size?.replace(' MB', '') || 0) * 1024 * 1024;
  }
  return size;
};

export const convertNumberInt = (number: number | string) => {
  const intNumber = Number(number).toFixed(0);
  return String(intNumber).replace(/(.)(?=(\d{3})+$)/g, '$1,');
};

export const daysInCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

export const formatDateChart = 'DD/MM';
export const formatMonthChart = 'MM/YYYY';

export const arrThreeMonthCurrent = () => [
  moment().subtract(90, 'days').format(formatDateChart),
  moment().subtract(75, 'days').format(formatDateChart),
  moment().subtract(60, 'days').format(formatDateChart),
  moment().subtract(45, 'days').format(formatDateChart),
  moment().subtract(30, 'days').format(formatDateChart),
  moment().subtract(15, 'days').format(formatDateChart),
  moment().format(formatDateChart),
];

export const arrDateInMonth = () => [
  moment().subtract(30, 'days').format(formatDateChart),
  moment().subtract(25, 'days').format(formatDateChart),
  moment().subtract(20, 'days').format(formatDateChart),
  moment().subtract(15, 'days').format(formatDateChart),
  moment().subtract(10, 'days').format(formatDateChart),
  moment().subtract(5, 'days').format(formatDateChart),
  moment().format(formatDateChart),
];

export const arrDateInWeek = () => [
  moment().subtract(6, 'days').format(formatDateChart),
  moment().subtract(5, 'days').format(formatDateChart),
  moment().subtract(4, 'days').format(formatDateChart),
  moment().subtract(3, 'days').format(formatDateChart),
  moment().subtract(2, 'days').format(formatDateChart),
  moment().subtract(1, 'days').format(formatDateChart),
  moment().format(formatDateChart),
];

export const arrMonthInYear = () => {
  const result = [];
  for (let index = 11; index > 0; index -= 1) {
    result.push(moment().subtract(index, 'months').format(formatMonthChart));
  }
  return [...result, moment().format(formatMonthChart)];
};

// Full moment

export const arrMomentThreeMonth = () => [
  moment().subtract(90, 'days'),
  moment().subtract(75, 'days'),
  moment().subtract(60, 'days'),
  moment().subtract(45, 'days'),
  moment().subtract(30, 'days'),
  moment().subtract(15, 'days'),
  moment(),
];

export const arrMomentDateInWeek = () => [
  moment().subtract(6, 'days'),
  moment().subtract(5, 'days'),
  moment().subtract(4, 'days'),
  moment().subtract(3, 'days'),
  moment().subtract(2, 'days'),
  moment().subtract(1, 'days'),
  moment(),
];

export const arrMomentMonthInYear = () => {
  const result = [];
  for (let index = 11; index > 0; index -= 1) {
    result.push(moment().subtract(index, 'months'));
  }
  return [...result, moment()];
};

export const arrMomentFullDateInMonth = () => [
  moment().subtract(30, 'days'),
  moment().subtract(25, 'days'),
  moment().subtract(20, 'days'),
  moment().subtract(15, 'days'),
  moment().subtract(10, 'days'),
  moment().subtract(5, 'days'),
  moment(),
];

export const arrMomentAboutDateInMonth = () => [
  {
    startDate: moment().subtract(29, 'days').startOf('day'),
    endDate: moment().subtract(27, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(26, 'days').startOf('day'),
    endDate: moment().subtract(24, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(23, 'days').startOf('day'),
    endDate: moment().subtract(21, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(20, 'days').startOf('day'),
    endDate: moment().subtract(18, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(17, 'days').startOf('day'),
    endDate: moment().subtract(15, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(14, 'days').startOf('day'),
    endDate: moment().subtract(12, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(11, 'days').startOf('day'),
    endDate: moment().subtract(9, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(8, 'days').startOf('day'),
    endDate: moment().subtract(6, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(5, 'days').startOf('day'),
    endDate: moment().subtract(3, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(2, 'days').endOf('day'),
    endDate: moment().startOf('day'),
  },
];

export const arrMomentAboutDateInThreeMonth = () => [
  {
    startDate: moment().subtract(89, 'days').startOf('day'),
    endDate: moment().subtract(81, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(80, 'days').startOf('day'),
    endDate: moment().subtract(72, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(71, 'days').startOf('day'),
    endDate: moment().subtract(63, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(62, 'days').startOf('day'),
    endDate: moment().subtract(54, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(53, 'days').startOf('day'),
    endDate: moment().subtract(45, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(44, 'days').startOf('day'),
    endDate: moment().subtract(36, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(35, 'days').startOf('day'),
    endDate: moment().subtract(27, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(26, 'days').startOf('day'),
    endDate: moment().subtract(18, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(17, 'days').startOf('day'),
    endDate: moment().subtract(9, 'days').endOf('day'),
  },
  {
    startDate: moment().subtract(8, 'days').endOf('day'),
    endDate: moment().startOf('day'),
  },
];

// eslint-disable-next-line no-sparse-arrays
export const arrMomentAboutDateInMonthText = () => [
  `${moment().subtract(29, 'days').format(formatDateChart)}-${moment()
    .subtract(27, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(26, 'days').format(formatDateChart)}-${moment()
    .subtract(24, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(23, 'days').format(formatDateChart)}-${moment()
    .subtract(21, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(20, 'days').format(formatDateChart)}-${moment()
    .subtract(18, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(17, 'days').format(formatDateChart)}-${moment()
    .subtract(15, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(14, 'days').format(formatDateChart)}-${moment()
    .subtract(12, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(11, 'days').format(formatDateChart)}-${moment()
    .subtract(9, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(8, 'days').format(formatDateChart)}-${moment()
    .subtract(6, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(5, 'days').format(formatDateChart)}-${moment()
    .subtract(3, 'days')
    .format(formatDateChart)}`,
  ,
  `${moment().subtract(2, 'days').format(formatDateChart)}-${moment().format(
    formatDateChart,
  )}`,
];

// eslint-disable-next-line no-sparse-arrays
export const arrMomentAboutDateInThreeMonthText = () => [
  `${moment().subtract(89, 'days').format(formatDateChart)}-${moment()
    .subtract(81, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(80, 'days').format(formatDateChart)}-${moment()
    .subtract(72, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(71, 'days').format(formatDateChart)}-${moment()
    .subtract(63, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(62, 'days').format(formatDateChart)}-${moment()
    .subtract(54, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(53, 'days').format(formatDateChart)}-${moment()
    .subtract(45, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(44, 'days').format(formatDateChart)}-${moment()
    .subtract(36, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(35, 'days').format(formatDateChart)}-${moment()
    .subtract(27, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(26, 'days').format(formatDateChart)}-${moment()
    .subtract(18, 'days')
    .format(formatDateChart)}`,
  `${moment().subtract(17, 'days').format(formatDateChart)}-${moment()
    .subtract(9, 'days')
    .format(formatDateChart)}`,
  ,
  `${moment().subtract(8, 'days').format(formatDateChart)}-${moment().format(
    formatDateChart,
  )}`,
];

export const getlineDataChartAxisLineTime = (
  value: TrendOfTime,
  isGetMoment?: boolean,
) => {
  switch (value) {
    case TrendOfTime.M:
      return isGetMoment ? arrMomentFullDateInMonth() : arrDateInMonth();
    case TrendOfTime.M3:
      return isGetMoment ? arrMomentThreeMonth() : arrThreeMonthCurrent();
    case TrendOfTime.Y:
      return isGetMoment ? arrMomentMonthInYear() : arrMonthInYear();
    default:
      return isGetMoment ? arrMomentDateInWeek() : arrDateInWeek();
  }
};

export const checkTextSearch = (textSearch, key) => {
  const regex = /^[a-zA-Z\s]*$/;
  const check = regex.test(textSearch);
  if (!check) {
    return false;
  }
  const filteredName =
    textSearch && key.toLowerCase().match(textSearch?.toLowerCase());

  if (!textSearch || textSearch === '') {
    return true;
  }
  if (!Array.isArray(filteredName) && !filteredName) {
    return false;
  }
  if (Array.isArray(filteredName)) {
    return true;
  }
  return false;
};

export const openNewPage = (url: string) => {
  const win = window.open(url, '_blank');
  win.focus();
};

export const capitalizeFirstLetter = (text: string) => {
  const newText = text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
  return newText;
};

export const viewPDF = (ids: string[]) => {
  getListFileApi({
    isAttachment: false,
    ids,
  }).then((res) => {
    const { data } = res;
    data?.forEach((item) => {
      openNewPage(item?.link);
    });
  });
};

export const downloadPDF = (ids: string[]) => {
  getListFileApi({
    isAttachment: true,
    ids,
  }).then((res) => {
    const { data } = res;
    data?.forEach((item) => {
      openNewPage(item?.link);
    });
  });
};

export const handleAndDownloadFilePdf = (
  data: Blob,
  name: string,
  type?: string,
) => {
  const file = new Blob([data], { type: type || 'application/pdf' });
  const fileURL = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = fileURL;
  link.download = name;
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );
};

interface ExportXlSXProps {
  data: Blob;
  fileName: string;
  contentType: string;
}
export const handleAndDownloadFileXLSX = (props: ExportXlSXProps) => {
  const blob = new Blob([props?.data], {
    type: props?.contentType || 'application/json;charset=utf-8',
  });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a'); // Or maybe get it from the current document
  link.href = blobUrl;
  link.setAttribute(
    'download',
    props?.fileName || 'Export Excel Template.xlsx',
  ); // or any other extension
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

export const sortIarHeaders = (data: IARReportHeaders[]) => {
  const sortedData = data?.sort((a: IARReportHeaders, b: IARReportHeaders) => {
    const arrHeaderA = a?.serialNumber?.split('.');
    const arrHeaderB = b?.serialNumber?.split('.');
    const lengthA = arrHeaderA?.length || 0;
    const lengthB = arrHeaderB?.length || 0;

    const lengthCheck = lengthA > lengthB ? lengthB : lengthA;

    for (let i = 0; i < lengthCheck; i += 1) {
      if (Number(arrHeaderA[i]) > Number(arrHeaderB[i])) {
        return 1;
      }

      if (Number(arrHeaderA[i]) < Number(arrHeaderB[i])) {
        return -1;
      }
    }

    return lengthA > lengthB ? 1 : -1;
  });
  return sortedData;
};

export const compareStatus = (status: string, statusCompare: string) => {
  const status1 = camelCase(
    String(status).replaceAll('_', '')?.replaceAll(' ', ''),
  );
  const status2 = camelCase(
    String(statusCompare).replaceAll('_', '')?.replaceAll(' ', ''),
  );

  return status1 === status2;
};

export const populateStatus = (status: string) => {
  if (
    String(status).toLocaleLowerCase() === 'planned_successfully' ||
    String(status).toLocaleLowerCase() === 'planned successfully'
  ) {
    return 'Planned';
  }
  if (String(status)?.toLocaleLowerCase() === 'closeout') {
    return 'Close out';
  }
  if (String(status)?.toLocaleLowerCase() === 'rejected') {
    return 'Reassigned';
  }
  if (String(status)?.toLocaleLowerCase() === 'auditor_accepted') {
    return 'Accepted';
  }
  if (status === 'VerifiedAndClose') {
    return 'Verified and closed';
  }
  if (status === 'OverridingClosure') {
    return 'Overriding closure';
  }
  return capitalize(String(status).replaceAll('_', ' '));
};

export const websiteLinkByEnv = () =>
  CONFIG.NAME === 'local'
    ? 'https://admin.dev.i-nautix.com'
    : `https://admin.${CONFIG.NAME}.i-nautix.com`;

export const isWebsiteEnv = (webEnv: string) => CONFIG.NAME === webEnv;

export const populateTextWithLink = (text: string) => {
  if (!text) {
    return '';
  }
  const regx = new RegExp(
    '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
  );
  const textSeparate = text.split(' ');
  if (textSeparate?.length <= 0) {
    return '';
  }
  const listText = textSeparate?.map((i) => {
    if (regx.test(i)) {
      return `<a target="_blank" href="${i}">${i}</a>`;
    }
    return i;
  });

  return listText.join(' ');
};

export const handleLongTextTable = (text: string) => {
  const shortText =
    text && text.length > 19 ? `${text.substring(0, 17)}...` : text || '';
  return shortText;
};

export const validateEmail = (email) =>
  String(email).toLowerCase().match(REGEXP_VALIDATE_EMAIL);

export const handleUploadFile = async (files: any, name?: string) => {
  const limitSize = name?.includes('.zip') ? 8912896 : 5242880;
  const limitSizeString = name?.includes('.zip') ? 8.5 : 5;
  if (files[0]?.size > limitSize) {
    toastError(
      `This specified file ${name} could not be uploaded. The file is exceeding the maximum file size of ${limitSizeString} MB`,
    );
    return;
  }

  const formDataImages = new FormData();
  formDataImages.append('files', files[0], name || 'File upload');
  formDataImages.append('fileType', FileType.ATTACHMENT);
  formDataImages.append('prefix', FilePrefix.ATTACHMENT);

  try {
    const res = await uploadFileApi(formDataImages);
    const { data } = res;

    // eslint-disable-next-line consistent-return
    return data?.length
      ? {
          id: data[0].id,
          name: data[0]?.originName || 'File Upload',
          size: `${convertBToMB(files[0]?.size)} MB`,
          mimetype: files[0]?.type,
          lastModifiedDate: new Date(),
          link: data[0].link,
        }
      : null;
  } catch (error) {
    toastError('error', error);
  }
};

export const getColorByName = (
  status: string,
): { name?: string; color?: string; background?: string; border?: string } =>
  COLORS?.find((i) => compareStatus(i.name, status)) || {
    color: '#000000',
    background: '#fff',
    border: '#000000',
  };

export function setHeightTable(rowTable: number) {
  if (
    rowTable === DEFAULT_LINE_HEIGHT.totalRow ||
    rowTable > DEFAULT_LINE_HEIGHT.totalRow
  ) {
    return `${DEFAULT_LINE_HEIGHT.totalHeight}px`;
  }
  if (
    rowTable < DEFAULT_LINE_HEIGHT.totalRow &&
    rowTable !== 0 &&
    rowTable !== DEFAULT_LINE_HEIGHT.limitedRow
  ) {
    return `${
      DEFAULT_LINE_HEIGHT.totalHeight -
      (DEFAULT_LINE_HEIGHT.totalRow - rowTable) * DEFAULT_LINE_HEIGHT.lineHeight
    }px`;
  }
  if (rowTable === 0 || rowTable === DEFAULT_LINE_HEIGHT.limitedRow) {
    return `${
      DEFAULT_LINE_HEIGHT.totalHeight -
      DEFAULT_LINE_HEIGHT.defaultRow * DEFAULT_LINE_HEIGHT.lineHeight
    }px`;
  }
  return null;
}

export const scrollIntoErrors = (errors: Object, position: string = '') => {
  if (Object.keys(errors)?.length) {
    const firstError = Object.keys(errors)[0];
    const el = document.querySelector(`${position || ''}#${firstError}`);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

export const uppercaseFirstLetter = (str: string) =>
  startCase(toLower(str || ''));

export const convertToAge = (birthDay: Date | string) => {
  if (!birthDay) return '';
  const current = new Date().getFullYear();
  const birthday = new Date(birthDay).getFullYear();
  if (current > birthday) return current - birthday;
  return 0;
};

export const convertToAgeDecimal = (birthDay: Date | string) => {
  if (!birthDay) return '';
  const birthday = new Date(birthDay);
  const current = new Date();
  const difference = current.getTime() - birthday.getTime();
  const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
  if (totalDays > 0) return (totalDays / 365).toFixed(2);
  return 0;
};

export const parseQueries = (search: string): { [field: string]: string } => {
  const queries = queryString.parse(search);
  const result = {};
  Object.keys(queries).forEach((key) => {
    result[key] = queries[key]?.toString() as string;
  });
  return result;
};

export const convertToPercent = (
  numerator: number | string,
  denominator: number | string,
  fixed: number = 2,
) => {
  if (!numerator || !denominator) {
    return '';
  }
  if (Number(numerator) === 0 || Number(denominator) === 0) {
    return '0.00%';
  }
  return `${((Number(numerator) / Number(denominator)) * 100).toFixed(fixed)}%`;
};

export const parseJSON = (jsonString: string | null) => {
  try {
    return jsonString === 'undefined' ? null : JSON.parse(jsonString ?? '');
  } catch (error) {
    return null;
  }
};

export const getFromLocalStorage = (key: string) => {
  if (!localStorage?.getItem) {
    return null;
  }
  const value = localStorage?.getItem(key);

  if (value) {
    return parseJSON(value);
  }
  return null;
};

export const setToLocalStorage = (key: string, value: any) => {
  if (localStorage?.setItem) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const handleErrorsToFields = (e: any) => {
  if (e?.errorList) {
    return e?.errorList || [];
  }
  if (e?.message?.length && typeof e?.message === 'object') {
    return (
      e?.message?.map((i) => ({
        fieldName: i?.field || i?.fieldName,
        message: i?.message[0],
      })) || []
    );
  }

  return [];
};

export const formatMoment = (value: Moment, trendType: TrendOfTime) => {
  switch (trendType) {
    case TrendOfTime.Y:
      return value.format(formatMonthChart);
    default:
      return value.format(formatDateChart);
  }
};

export const lineDataChartAxis = (
  value: TrendOfTime,
  isGetMoment?: boolean,
) => {
  switch (value) {
    case TrendOfTime.M:
      return isGetMoment ? arrMomentFullDateInMonth() : arrDateInMonth();
    case TrendOfTime.M3:
      return isGetMoment ? arrMomentThreeMonth() : arrThreeMonthCurrent();
    case TrendOfTime.Y:
      return isGetMoment ? arrMomentMonthInYear() : arrMonthInYear();
    default:
      return isGetMoment ? arrMomentDateInWeek() : arrDateInWeek();
  }
};

export const dataChartAxisMoment = (trendType: TrendOfTime) => {
  const result = lineDataChartAxis(trendType, true);
  return result;
};

export const fillTrendData = (
  dataMoment: string[],
  dataFill: { timeRange: string; value: string | number; label?: string }[],
) =>
  dataMoment?.map((item) => {
    const findItem = dataFill?.find(
      (itemTrend) => itemTrend?.timeRange === item,
    );
    if (findItem) {
      return {
        timeRange: item,
        value: Number(findItem?.value),
      };
    }
    return {
      timeRange: item,
      value: 0,
    };
  });
