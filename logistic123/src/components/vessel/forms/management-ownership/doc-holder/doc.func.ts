import moment from 'moment';
import { formatDateNoTime } from 'helpers/date.helper';

export const TIME_LINE = {
  CURRENT: 'current',
  HISTORY: 'history',
  FUTURE: 'future',
};

export const checkTimeLine = (fromDate?: string, toDate?: string) => {
  const fromDateSelected = moment(fromDate)?.startOf('day').unix() || 0;
  const toDateSelected = toDate ? moment(toDate)?.endOf('day')?.unix() : 0;
  const currentDate = moment()?.startOf('day').unix() || 0;
  if (
    (toDateSelected > currentDate || !toDateSelected) &&
    fromDateSelected <= currentDate
  ) {
    return TIME_LINE.CURRENT;
  }
  if (fromDateSelected > currentDate) {
    return TIME_LINE.FUTURE;
  }
  if (toDateSelected < currentDate) {
    return TIME_LINE.HISTORY;
  }
  return TIME_LINE.CURRENT;
};
// for example item 1234, item 3 is current item 4 is future we can insert data >3 and < 1
const checkIsItemOldestOrFuture = (listData, fromDate) => {
  const isFuture = checkTimeLine(fromDate) === TIME_LINE.FUTURE;
  if (isFuture) {
    return true;
  }
  const itemOldest = listData?.[listData?.length - 1]?.fromDate || 0;
  const itemOldestUnix = itemOldest
    ? moment(itemOldest)?.startOf('day').unix()
    : 0;
  const itemSelectUnix = fromDate ? moment(fromDate)?.startOf('day').unix() : 0;

  if (itemOldestUnix && itemSelectUnix && itemSelectUnix < itemOldestUnix) {
    return true;
  }
  return false;
};

export const checkFromDate = (
  fromDate,
  listCompany,
  selectedIndex = -1,
  isCreate,
): string => {
  if (listCompany?.length === 0) {
    return null;
  }
  const editCase = selectedIndex >= 0;
  const isFutureOrOldest = checkIsItemOldestOrFuture(listCompany, fromDate);

  // create case or create item in future

  if ((isCreate || isFutureOrOldest) && !editCase) {
    const dulicateFromDate = listCompany?.some(
      (item) => formatDateNoTime(item.fromDate) === formatDateNoTime(fromDate),
    );
    if (dulicateFromDate) {
      return 'It should not be same as From date of existing records';
    }
    return null;
  }

  const prevDate = listCompany?.[selectedIndex + 1]
    ? moment(listCompany?.[selectedIndex + 1]?.fromDate)
        ?.startOf('day')
        .unix()
    : null;
  const nextDate = listCompany?.[selectedIndex - 1]
    ? moment(listCompany?.[selectedIndex - 1]?.fromDate)
        ?.startOf('day')
        .unix()
    : null;
  const currentDateSelected = moment(fromDate)?.startOf('day').unix() || 0;

  if (prevDate && currentDateSelected <= prevDate) {
    return 'It should be greater than From date of the previous record';
  }
  if (nextDate && currentDateSelected >= nextDate) {
    return 'It should be smaller than From date of the next record';
  }
  return null;
};

export const handleSortByDate = (data) => {
  if (data?.length > 0) {
    return data.sort((a, b) => {
      if (moment(a?.fromDate)?.unix() > moment(b?.fromDate)?.unix()) {
        return -1;
      }
      if (moment(a?.fromDate)?.unix() < moment(b?.fromDate)?.unix()) {
        return 1;
      }
      return 0;
    });
  }
  return [];
};

export const handleDataCompanyUpdate = (
  listData,
  newData,
  indexSelected,
  resetAllToDate,
) => {
  const selectedFromDate = newData?.fromDate;
  const newItemCase =
    !indexSelected && indexSelected !== 0 && listData?.length > 0;
  // case insert data between data in future
  const isFutureOrOldest = checkIsItemOldestOrFuture(
    listData,
    selectedFromDate,
  );

  if (resetAllToDate || isFutureOrOldest) {
    const listNewData =
      !indexSelected && indexSelected !== 0
        ? handleSortByDate([newData, ...listData])
        : handleSortByDate(listData);

    const updatedData = listNewData?.map((item, index) => {
      if (indexSelected === index) {
        return {
          ...newData,
          toDate:
            index === 0
              ? null
              : moment(listNewData[index - 1]?.fromDate)
                  .subtract(1, 'days')
                  .endOf('day'),
        };
      }
      if (index !== 0) {
        return {
          ...item,
          toDate: moment(listNewData[index - 1]?.fromDate)
            .subtract(1, 'days')
            .endOf('day'),
        };
      }
      return item;
    });

    return updatedData;
  }
  const updatedData = listData?.map((item, index) => {
    // case add new item update toDate of first item = fromDate of new item -1
    if (indexSelected === index) {
      return newData;
    }
    if (newItemCase && index === 0) {
      return {
        ...item,
        toDate: moment(selectedFromDate).subtract(1, 'days').endOf('day'),
      };
    }
    // case update prev to date item = fromDate of new item - 1
    if (indexSelected && index === indexSelected + 1) {
      return {
        ...item,
        toDate: moment(selectedFromDate).subtract(1, 'days').endOf('day'),
      };
    }
    return item;
  });
  if (!indexSelected && indexSelected !== 0) {
    return [newData, ...updatedData];
  }

  return updatedData;
};

const checkPositionUpdateCompany = (listCompany, updateCompany): string => {
  const listData = handleSortByDate([...listCompany, updateCompany]);
  let positionUpdate = -1;
  listData?.forEach((element, index) => {
    if (
      formatDateNoTime(element?.fromDate) ===
      formatDateNoTime(updateCompany?.fromDate)
    ) {
      positionUpdate = index;
    }
  });
  const prevCompany = listData?.[positionUpdate + 1]?.companyId;
  const nextCompany = listData?.[positionUpdate - 1]?.companyId;

  if (
    (nextCompany && updateCompany?.companyId === nextCompany) ||
    (prevCompany && updateCompany?.companyId === prevCompany)
  ) {
    return 'Kindly select other DOC Holder company as there can not choose the same company with the previous one';
  }
  return null;
};

const checkCompanyConsecutive = (
  listCompany,
  updateCompany,
  selectedIndex = -1,
  isCreate,
): string => {
  const editCase = selectedIndex >= 0;
  const isFutureOrOldest = checkIsItemOldestOrFuture(
    listCompany,
    updateCompany?.fromDate,
  );
  if ((isCreate || isFutureOrOldest) && !editCase) {
    const positionUpdateIsValid = checkPositionUpdateCompany(
      listCompany,
      updateCompany,
    );
    return positionUpdateIsValid;
  }
  if (listCompany?.length === 0) {
    return null;
  }
  if (!selectedIndex) {
    return null;
  }

  const prevCompany = listCompany?.[selectedIndex + 1]?.companyId;
  const nextCompany = listCompany?.[selectedIndex - 1]?.companyId;

  if (
    (nextCompany && updateCompany?.companyId === nextCompany) ||
    (prevCompany && updateCompany?.companyId === prevCompany)
  ) {
    return 'Kindly select other DOC Holder company as there can not choose the same company with the previous one';
  }
  return null;
};

export const handleValidateDocChattererVesselOwner = (
  listCompany,
  updateCompany,
  selectedIndex,
  isCreate,
  messageName = null,
): {
  dateInvalid: string;
  companyInvalid: string;
} => {
  const dateInvalid: string = checkFromDate(
    updateCompany?.fromDate,
    listCompany,
    selectedIndex,
    isCreate,
  );
  const companyInvalid: string = checkCompanyConsecutive(
    listCompany,
    updateCompany,
    selectedIndex,
    isCreate,
  );
  if (dateInvalid || companyInvalid) {
    return {
      dateInvalid: messageName
        ? dateInvalid?.replaceAll('DOC Holder', messageName)
        : dateInvalid,
      companyInvalid: messageName
        ? companyInvalid?.replaceAll('DOC Holder', messageName)
        : companyInvalid,
    };
  }
  return null;
};

export const disableDateTimeInPast = (date, initialListCompany) => {
  if (!initialListCompany?.length) {
    return false;
  }

  const oldestDate =
    initialListCompany?.[initialListCompany?.length - 1]?.fromDate || 0;

  const oldestDateUnix = oldestDate
    ? moment(oldestDate)?.startOf('day')?.unix()
    : 0;
  const newDateUnixChecking = moment()?.unix();
  const dateSelectedUnix = moment(date)?.unix();

  if (
    oldestDateUnix >= dateSelectedUnix ||
    newDateUnixChecking < dateSelectedUnix
  ) {
    return false;
  }
  return true;
};
