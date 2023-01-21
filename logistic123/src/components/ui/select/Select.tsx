import {
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import cx from 'classnames';
import Select, { SelectProps as AntdSelectProps } from 'antd/lib/select';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Controller, Control } from 'react-hook-form';
import images from 'assets/images/images';
import './select.scss';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

const { Option } = Select;

export interface OptionProp {
  value: string | number;
  label: string | ReactNode;
}
interface SelectProps extends AntdSelectProps<any> {
  data: OptionProp[];
  className?: string;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  value?: string | number | boolean;
  defaultValue?: string | number;
  sizes?: SizeType;
  control?: Control;
  name?: string;
  isRequired?: boolean;
  labelSelect?: string;
  messageRequired?: string;
  styleLabel?: string;
  placeholder?: string;
  id?: string;
  notAllowSortData?: boolean;
  dynamicLabels?: IDynamicLabel;
  selectRowClassName?: string;
  transparentSelect?: boolean;
}

const SelectUI: FC<SelectProps> = (props) => {
  const {
    data,
    disabled = false,
    className,
    onChange,
    placeholder,
    labelSelect,
    defaultValue,
    value,
    sizes,
    name,
    control,
    isRequired,
    messageRequired,
    styleLabel,
    id,
    notAllowSortData,
    dynamicLabels,
    selectRowClassName,
    transparentSelect,
    ...others
  } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const selectRef = useRef(null);

  const handleIsFocus = () => {
    setIsFocused(true);
  };

  const sortData = useMemo(() => {
    const cloneData = data?.length ? [...data] : [];
    const result = cloneData
      .filter((e) => e?.label === 'All')
      .concat(
        cloneData
          .filter((e) => e?.label !== 'All')
          .sort((a, b) =>
            a?.label?.toString().localeCompare(b?.label?.toString(), 'en', {
              ignorePunctuation: true,
              numeric: true,
              sensitivity: 'base',
            }),
          ),
      );
    return result;
  }, [data]);

  const optionProps = useMemo(
    () => (notAllowSortData ? data : sortData),
    [notAllowSortData, data, sortData],
  );

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isFocused && selectRef.current) {
        setIsFocused(false);
      }
    };
    if (isFocused) {
      document.addEventListener('mousedown', checkIfClickedOutside);
    } else {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    }
  }, [isFocused, selectRef]);

  const placeholderDisplay = useMemo(() => {
    if (disabled) {
      return ' ';
    }
    return (
      placeholder ||
      renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS['Please select'])
    );
  }, [disabled, dynamicLabels, placeholder]);

  const renderSelect = useCallback(
    (value, onChangeFn) => (
      <Select
        ref={selectRef}
        className={cx('select-ui', className, {
          focused: isFocused,
          'disable-select': disabled,
          'transparent-select': transparentSelect,
        })}
        dropdownClassName={cx('dropdown')}
        placeholder={placeholderDisplay}
        defaultValue={defaultValue}
        value={value !== undefined && value !== null ? value : null}
        disabled={disabled}
        onChange={(value) => {
          onChangeFn(value);
          if (control && name && onChange) {
            onChange?.(value);
          }
        }}
        {...others}
        onClick={disabled ? handleIsFocus : undefined}
        size={sizes}
        suffixIcon={<img src={images.icons.icArrowDown} alt="arrowDown" />}
        // getPopupContainer={(trigger) => trigger.parentElement}
      >
        {optionProps?.map((item, index) => (
          <Option
            key={index.toString() + String(item?.value)}
            value={item?.value}
          >
            {item?.label}
          </Option>
        ))}
      </Select>
    ),
    [
      className,
      isFocused,
      disabled,
      transparentSelect,
      placeholderDisplay,
      defaultValue,
      others,
      sizes,
      optionProps,
      control,
      name,
      onChange,
    ],
  );

  return (
    <div id={id} className={cx('wrap-select-custom', selectRowClassName)}>
      {labelSelect && (
        <div className="d-flex align-items-start mg__b-1">
          <div className={cx('label-select ', styleLabel)}>{labelSelect}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}

      {control && name ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => renderSelect(field.value, field.onChange)}
        />
      ) : (
        renderSelect(value, onChange)
      )}
      {messageRequired && (
        <div className="message-required mt-2">{messageRequired} </div>
      )}
    </div>
  );
};
export default SelectUI;
