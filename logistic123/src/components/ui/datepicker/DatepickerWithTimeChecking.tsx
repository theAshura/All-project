import { useState, FC } from 'react';
import { DatePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
import { UseFormSetValue } from 'react-hook-form';
import {
  checkTimeIsValid,
  disableDateTime,
  disableHours,
  disableMinutes,
  formatDateNoTime,
} from 'helpers/date.helper';
import { DateTimePicker, DateTimePickerProps } from './Datepicker';

type Props = DateTimePickerProps &
  DatePickerProps & {
    fromDateDisable?: string | Date | moment.Moment;
    toDateDisable?: string | Date | moment.Moment;
    currentValue?: string | Date | moment.Moment;
    setValue?: UseFormSetValue<any>;
  };

const DatepickerWithTimeChecking: FC<Props> = ({
  onSelect,
  fromDateDisable,
  toDateDisable,
  onClick,
  currentValue,
  name,
  setValue,
  ...props
}) => {
  const [internalDate, setInternalDate] = useState<
    string | Date | moment.Moment
  >(moment());

  return (
    <DateTimePicker
      onClick={() => {
        if (currentValue) {
          if (
            formatDateNoTime(currentValue) === formatDateNoTime(fromDateDisable)
          ) {
            setInternalDate(fromDateDisable);
          } else if (
            formatDateNoTime(currentValue) === formatDateNoTime(toDateDisable)
          ) {
            setInternalDate(toDateDisable);
          } else {
            setInternalDate(currentValue);
          }
        }
      }}
      onSelect={(e) => {
        setInternalDate(e);
        if (onSelect) {
          onSelect(e);
        }
      }}
      onOk={(e) => {
        if (setValue) {
          const dateValid = checkTimeIsValid(e, fromDateDisable, toDateDisable);
          if (dateValid) {
            setValue(name, dateValid);
          }
        }
      }}
      disabledDate={(date) =>
        disableDateTime({
          date,
          fromDate: fromDateDisable,
          toDate: toDateDisable,
          ignoreTime: true,
        })
      }
      disabledHours={() =>
        disableHours({
          date: internalDate,
          fromDate: fromDateDisable,
          toDate: toDateDisable,
        })
      }
      disabledMinutes={(hour) =>
        disableMinutes({
          date: internalDate,
          hour,
          fromDate: fromDateDisable,
          toDate: toDateDisable,
        })
      }
      name={name}
      {...props}
    />
  );
};

export default DatepickerWithTimeChecking;
