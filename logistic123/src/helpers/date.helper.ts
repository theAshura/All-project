import moment, { Moment } from 'moment';

export const formatDateWithTime = (date: string | Date | moment.Moment) => {
  if (!date) {
    return '';
  }
  return moment(date).format('L, h:mm:ss a');
};

export const formatDateWithTimeUTC = (
  date: string | Date,
  formatDate?: string,
) => {
  if (!date) {
    return null;
  }
  if (!moment(date).isValid()) {
    return null;
  }
  return moment.utc(date).format(formatDate || 'DD/MM/YYYY HH:mm:ss');
};

export const formatDateNoTime = (date: string | Date | Moment) => {
  if (!date) {
    return '';
  }
  if (!moment(date).isValid()) {
    return null;
  }
  return moment(date).format('DD/MM/YYYY');
};

export function getDates(startDate: Moment, toDate: Moment) {
  const dateArray: string[] = [];
  let currentDate = startDate;
  while (currentDate <= toDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}

export const formatDateIso = (
  date: string | Date | Moment,
  options?: {
    startDay?: boolean;
    endDay?: boolean;
  },
) => {
  if (!date) {
    return null;
  }
  if (!moment(date).isValid()) {
    return null;
  }
  if (options?.startDay) {
    return moment(date).startOf('day')?.toISOString();
  }
  if (options?.endDay) {
    return moment(date).endOf('day')?.toISOString();
  }
  return moment(date)?.toISOString();
};

export const formatDateLocalNoTime = (date: string | Date) => {
  if (!date) {
    return null;
  }
  if (!moment(date).isValid()) {
    return null;
  }
  return moment(date).local().format('DD/MM/YYYY');
};

export const formatDateYearToDay = (date: string | Date) => {
  if (!date) {
    return null;
  }
  if (!moment(date).isValid()) {
    return null;
  }
  return moment(date).local().format('YYYY-MM-DD');
};

export const formatDateLocalWithTime = (
  date: string | Date,
  formatDate?: string,
) => {
  if (!date) {
    return null;
  }
  if (!moment(date).isValid()) {
    return null;
  }
  return moment(date)
    .local()
    .format(formatDate || 'DD/MM/YYYY HH:mm');
};

export const getTimeZone = () => {
  const dateString = new Date().toString().split('GMT');
  return `${dateString[1].slice(0, 3)}:${dateString[1].slice(3, 5)}`;
};

export const checkTimeIsValid = (
  time?: string | Date | moment.Moment,
  disableFromDate?: string | Date | moment.Moment,
  disableToDate?: string | Date | moment.Moment,
) => {
  const timeUnix = moment(time)?.unix();
  const fromUnix = moment(disableFromDate)?.unix();
  const toUnix = moment(disableToDate)?.unix();
  if (
    disableFromDate &&
    formatDateNoTime(time) === formatDateNoTime(disableFromDate)
  ) {
    if (timeUnix < fromUnix) {
      return disableFromDate;
    }
  }
  if (
    disableToDate &&
    formatDateNoTime(time) === formatDateNoTime(disableToDate)
  ) {
    if (timeUnix > toUnix) {
      return disableToDate;
    }
  }
  return time;
};

export const disableDateTime = (params?: {
  date: string | Date | moment.Moment;
  fromDate: string | Date | moment.Moment;
  toDate: string | Date | moment.Moment;
  ignoreTime?: boolean;
}) => {
  const { date, fromDate, toDate, ignoreTime } = params;
  const dateSelectedUnix = moment(date)?.unix();
  const from = ignoreTime
    ? moment(fromDate).startOf('day')?.unix()
    : moment(fromDate)?.unix();
  const to = ignoreTime
    ? moment(toDate).endOf('day')?.unix()
    : moment(toDate)?.unix();

  if (fromDate && toDate) {
    if (from <= dateSelectedUnix && to >= dateSelectedUnix) {
      return false;
    }
    return true;
  }

  if (fromDate) {
    if (from <= dateSelectedUnix) {
      return false;
    }
    return true;
  }

  if (toDate) {
    if (to >= dateSelectedUnix) {
      return false;
    }
    return true;
  }

  return false;
};

export const disableHours = (params: {
  date: string | Date | moment.Moment;
  fromDate: string | Date | moment.Moment;
  toDate: string | Date | moment.Moment;
}): number[] => {
  const { date, fromDate, toDate } = params;
  const fromDateEqualDate =
    date && fromDate && formatDateNoTime(fromDate) === formatDateNoTime(date);

  const toDateEqualDate =
    date && toDate && formatDateNoTime(toDate) === formatDateNoTime(date);

  if (fromDateEqualDate && toDateEqualDate) {
    const disableHours = [];
    const fromHours = moment(fromDate).hour();
    const toHours = moment(toDate).hour();
    for (let index = 0; index <= 24; index += 1) {
      if (Number(fromHours) > index || index > Number(toHours)) {
        disableHours.push(index);
      }
    }
    return disableHours;
  }

  if (fromDateEqualDate) {
    const disableHours = [];
    const hours = moment(fromDate).hour();
    for (let index = 0; index <= 24; index += 1) {
      if (Number(hours) > index) {
        disableHours.push(index);
      }
    }
    return disableHours;
  }
  if (toDateEqualDate) {
    const disableHours = [];
    const hours = moment(toDate).hour();
    for (let index = 0; index <= 24; index += 1) {
      if (Number(hours) < index) {
        disableHours.push(index);
      }
    }
    return disableHours;
  }
  return [];
};

export const disableMinutes = (params: {
  date: string | Date | moment.Moment;
  hour: number;
  fromDate: string | Date | moment.Moment;
  toDate: string | Date | moment.Moment;
}): number[] => {
  const { date, hour, fromDate, toDate } = params;

  const fromDateEqualDate =
    date && fromDate && formatDateNoTime(fromDate) === formatDateNoTime(date);
  const toDateEqualDate =
    date && toDate && formatDateNoTime(toDate) === formatDateNoTime(date);

  if (fromDateEqualDate && toDateEqualDate) {
    const hourFromDate = moment(fromDate).hour();
    const hourToDate = moment(toDate).hour();
    if (hourFromDate === hour && hourToDate === hour) {
      const disableMinutes = [];
      const fromMinutes = moment(fromDate).minutes();
      const toMinutes = moment(toDate).minutes();
      for (let index = 0; index <= 60; index += 1) {
        if (Number(fromMinutes) > index || Number(toMinutes) < index) {
          disableMinutes.push(index);
        }
      }
      return disableMinutes;
    }
  }

  if (fromDateEqualDate) {
    const hourFromDate = moment(fromDate).hour();
    if (hourFromDate === hour) {
      const disableMinutes = [];
      const minutes = moment(fromDate).minutes();
      for (let index = 0; index <= 60; index += 1) {
        if (Number(minutes) > index) {
          disableMinutes.push(index);
        }
      }
      return disableMinutes;
    }
    return [];
  }
  if (toDateEqualDate) {
    const hourToDate = moment(toDate).hour();
    if (hourToDate === hour) {
      const disableMinutes = [];
      const minutes = moment(toDate).minutes();
      for (let index = 0; index <= 60; index += 1) {
        if (Number(minutes) < index) {
          disableMinutes.push(index);
        }
      }
      return disableMinutes;
    }
    return [];
  }
  return [];
};
