import Col from 'antd/lib/col';
import DatePicker, { DatePickerProps } from 'antd/lib/date-picker';
import Row from 'antd/lib/row';
import Space from 'antd/lib/space';
import moment, { Moment } from 'moment';
import cx from 'classnames';
import images from 'assets/images/images';
import { DATE_TIME_RANGES_OPTIONS } from 'constants/filter.const';
import './datepicker.scss';
import {
  useState,
  useCallback,
  useRef,
  ReactNode,
  useEffect,
  Component,
  ReactElement,
  useMemo,
} from 'react';
import { PickerProps } from 'antd/lib/calendar/generateCalendar';
import { Controller, Control } from 'react-hook-form';
import Button, { ButtonSize, ButtonType } from '../button/Button';

const { RangePicker } = DatePicker;
export interface DateTimePickerProps {
  onChangeDate?: (value: Moment, dateString: string) => void;
  className?: string;
  minDate?: Moment;
  maxDate?: Moment;
  label?: string | ReactElement;
  isRequired?: boolean;
  suffixIcon?: ReactNode;
  superNextIcon?: ReactNode;
  nextIcon?: ReactNode;
  wrapperClassName?: string;
  control?: Control;
  name?: string;
  messageRequired?: string;
  value?: Moment;
  disabled?: boolean;
  defaultValue?: Moment;
  inputReadOnly?: boolean;
  placeholder?: string;
  id?: string;
  focus?: boolean;
  picker?: string | 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
  formatDate?: string;
  disabledHours?: () => number[];
  disabledMinutes?: (hour) => number[];
}

export type RangePickerProps = Omit<
  DateTimePickerProps,
  'className' | 'onChangeDate' | 'value' | 'defaultValue'
> & {
  hideFooter?: boolean;
  wrapperClassName?: string;
  valueDateRange?: Moment[];
  rangePickerClassName?: string;
  separator?: ReactNode;
  onChangeRange?: (dates: Moment[]) => void;
  defaultRangeValue?: [Moment, Moment];
  id?: string;
  focus?: boolean;
  typeRange?: string;
  setTypeRange?: (typeRange: string) => void;
} & DatePickerProps;

interface RefExtend extends Component<PickerProps<moment.Moment>, any, any> {
  focus?: () => void;
}

const customRange = 'Custom range';

export function DateTimePicker(props: DateTimePickerProps & DatePickerProps) {
  const {
    onChangeDate,
    className,
    minDate,
    maxDate,
    label,
    isRequired,
    control,
    name,
    messageRequired,
    wrapperClassName,
    value,
    disabled,
    id,
    inputReadOnly,
    focus,
    picker,
    formatDate,
    disabledDate,
    // suffixIcon = undefined,
    // superNextIcon = undefined,
    // nextIcon = undefined,

    placeholder,
    ...other
  } = props;
  const datePickerRef = useRef<RefExtend>();

  const disabledDateValue = useCallback(
    // eslint-disable-next-line consistent-return
    (current?) => {
      if (current) {
        if (minDate && !maxDate) {
          return current < minDate.startOf('day');
        }
        if (maxDate) {
          if (minDate) {
            return (
              current < minDate.startOf('day') || current > maxDate.endOf('day')
            );
          }
          return current > maxDate.endOf('day');
        }
      }
    },
    [minDate, maxDate],
  );

  useEffect(() => {
    if (focus && datePickerRef.current) {
      datePickerRef.current.focus();
    }
  }, [focus, datePickerRef]);

  const placeholderDisplay = useMemo(() => {
    if (disabled) {
      return ' ';
    }
    return placeholder || 'Please select';
  }, [disabled, placeholder]);

  const renderDatePicker = useCallback(
    (value, onChangeFn) => (
      <DatePicker
        disabled={disabled}
        size="small"
        // @ts-ignore
        ref={datePickerRef}
        autoFocus={focus}
        className={cx('date__picker single_picker', className)}
        showToday={false}
        placeholder={placeholderDisplay}
        value={value}
        format={formatDate || 'DD/MM/YYYY'}
        allowClear={false}
        // {...(suffixIcon && { suffixIcon })}
        // {...(superNextIcon && { superNextIcon })}
        // {...(nextIcon && { nextIcon })}
        inputReadOnly={inputReadOnly}
        onChange={(e, dateString) => {
          onChangeFn?.(e, dateString);
          if (control && name && onChangeDate) {
            onChangeDate(e, dateString);
          }
        }}
        picker={picker}
        getPopupContainer={(trigger) => trigger.parentElement}
        disabledDate={disabledDate || disabledDateValue}
        {...other}
      />
    ),
    [
      disabled,
      focus,
      className,
      placeholderDisplay,
      formatDate,
      inputReadOnly,
      picker,
      disabledDate,
      disabledDateValue,
      other,
      control,
      name,
      onChangeDate,
    ],
  );

  return (
    <div id={id} className={cx('container__date-picker ', wrapperClassName)}>
      {label && (
        <div className="d-flex align-items-start pb-1">
          <div className="label">{label}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}
      {control && name ? (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) =>
            renderDatePicker(value, onChange)
          }
        />
      ) : (
        renderDatePicker(value, onChangeDate)
      )}
      {messageRequired && (
        <div className="message-required mt-2">{messageRequired} </div>
      )}
    </div>
  );
}

export function DateTimeRangePicker(props: RangePickerProps) {
  const {
    onChangeRange,
    wrapperClassName,
    rangePickerClassName,
    minDate,
    hideFooter,
    maxDate,
    label,
    isRequired,
    control,
    name,
    valueDateRange,
    messageRequired,
    separator = undefined,
    id,
    focus,
    typeRange,
    setTypeRange,
    // suffixIcon = undefined,
    // superNextIcon = undefined,
    // nextIcon = undefined,
    disabled,
  } = props;
  const [dates, setDates] = useState([]);
  const rangePickerRef = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRefOption = useRef(null);
  const onChangeRanges = (e, s) => setDates(s);

  useEffect(() => {
    if (focus && rangePickerRef.current) {
      rangePickerRef.current.focus();
    }
  }, [focus, rangePickerRef]);

  useEffect(() => {
    if (!open) {
      rangePickerRef.current.blur();
    }
  }, [open]);

  const disabledDate = useCallback(
    // eslint-disable-next-line consistent-return
    (current) => {
      if (current) {
        if (minDate && !maxDate) {
          return current < minDate.startOf('day');
        }
        if (maxDate) {
          if (minDate) {
            return (
              current < minDate.startOf('day') || current > maxDate.endOf('day')
            );
          }
          return current > maxDate.endOf('day');
        }
      }
    },
    [minDate, maxDate],
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        open &&
        wrapperRefOption.current &&
        !wrapperRefOption.current.contains(event.target)
      ) {
        setTimeout(() => {
          setOpen(false);
        }, 10);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefOption, open]);

  const Ranges = useMemo(
    () => [
      {
        name: customRange,
        range: valueDateRange || [],
      },
      ...DATE_TIME_RANGES_OPTIONS,
    ],
    [valueDateRange],
  );

  const renderRanges = useCallback(
    (value, onChange) => (
      <div ref={wrapperRefOption}>
        {!hideFooter && open && (
          <div className={cx('ranges_select')}>
            <div className="range_list">
              {Ranges.map((item, index) => (
                <div
                  key={index.toString() + item.name}
                  className={cx(
                    { active: item.name === typeRange },
                    'range_item ',
                  )}
                  onClick={() => {
                    if (!disabled) {
                      if (
                        item.name !== typeRange &&
                        item.name !== customRange
                      ) {
                        setTypeRange(item.name);
                        if (item.range?.length === 2) {
                          onChange([
                            moment(item.range[0], 'DD/MM/YYYY'),
                            moment(item.range[1], 'DD/MM/YYYY'),
                          ]);
                        } else {
                          onChange(item.range);
                        }
                        setOpen(false);
                      } else {
                        setTypeRange(customRange);
                        onChange([
                          moment(item.range[0], 'DD/MM/YYYY'),
                          moment(item.range[1], 'DD/MM/YYYY'),
                        ]);
                      }
                    }
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
            {open && typeRange === customRange && (
              <div className="footer_range" />
            )}
          </div>
        )}
        <RangePicker
          disabled={disabled}
          ref={rangePickerRef}
          // {...(suffixIcon && { suffixIcon })}
          // {...(superNextIcon && { superNextIcon })}
          // {...(nextIcon && { nextIcon })}
          {...(separator && { separator })}
          allowClear={false}
          getPopupContainer={(trigger) => trigger.parentElement}
          open={!hideFooter ? open && typeRange === customRange : undefined}
          className={cx('date__picker', rangePickerClassName)}
          onOpenChange={!hideFooter ? () => setOpen(true) : undefined}
          format="DD/MM/YYYY"
          onChange={(e, s) => {
            onChangeRanges(e, s);
            if (hideFooter) {
              onChange([
                moment(s[0], 'DD/MM/YYYY'),
                moment(s[1], 'DD/MM/YYYY'),
              ]);
            }
          }}
          disabledDate={disabledDate}
          value={value}
          inputReadOnly
          size="small"
          renderExtraFooter={
            !hideFooter
              ? () => (
                  <Row className={cx('rowFooter')}>
                    <Col className={cx('buttonFooter')}>
                      <Button
                        buttonSize={ButtonSize.Small}
                        buttonType={ButtonType.Select}
                        onClick={() => {
                          onChange(valueDateRange);
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col className={cx('buttonFooter')}>
                      <Button
                        buttonSize={ButtonSize.Small}
                        onClick={() => {
                          if (dates[0] && dates[1]) {
                            onChange([
                              moment(dates[0], 'DD/MM/YYYY').startOf('day'),
                              moment(dates[1], 'DD/MM/YYYY').endOf('day'),
                            ]);
                            setOpen(false);
                          }
                        }}
                      >
                        Set Date
                      </Button>
                    </Col>
                  </Row>
                )
              : undefined
          }
        />
      </div>
    ),
    [
      hideFooter,
      open,
      Ranges,
      typeRange,
      disabled,
      separator,
      rangePickerClassName,
      disabledDate,
      setTypeRange,
      valueDateRange,
      dates,
    ],
  );

  return (
    <div
      id={id}
      className={cx({ show_footer: !hideFooter }, 'container__date-picker')}
    >
      {label && (
        <div className="d-flex align-items-start pb-1">
          <div className="label">{label}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}
      <Space direction="vertical" size={12} className={wrapperClassName}>
        {control && name ? (
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) =>
              renderRanges(value, onChange)
            }
          />
        ) : (
          renderRanges(valueDateRange, onChangeRange)
        )}
      </Space>
      {messageRequired && (
        <div className="message-required mt-2">{messageRequired} </div>
      )}
    </div>
  );
}
