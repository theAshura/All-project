import { FC } from 'react';
import Radio from 'antd/lib/radio';
import cx from 'classnames';
import images from 'assets/images/images';
import './radio.scss';

interface Option {
  value: string | boolean;
  label: string | boolean;
  disabled?: boolean;
}
export interface RadioCustomerProps {
  disabled?: boolean;
  value?: string | boolean;
  onChange?: (value) => void;
  radioOptions: Option[];
  label?: string;
  messageRequired?: string;
  isRequired?: boolean;
  className?: string;
  radioStyle?: string;
  labelClassName?: string;
}

const RadioCustomer: FC<RadioCustomerProps> = (props) => {
  const {
    disabled,
    value,
    onChange,
    radioOptions,
    label,
    messageRequired,
    isRequired,
    className,
    radioStyle,
    labelClassName,
  } = props;
  return (
    <div className={cx('input-radio-wrapper')}>
      {label && (
        <div className={cx('d-flex align-items-start pb-2', labelClassName)}>
          <div className={cx('label')}>{label}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}
      <div className={cx('radio d-flex align-items-center', className)}>
        <Radio.Group
          disabled={disabled}
          onChange={(value) => onChange(value.target.value)}
          value={value}
        >
          {radioOptions?.map((e, index) => (
            <Radio
              key={String(String(e.value) + index)}
              value={e.value}
              disabled={e?.disabled || false}
              className={cx('input-radio-label radio-button', radioStyle)}
            >
              {e.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {messageRequired && (
        <div className="message-required mt-2">{messageRequired}</div>
      )}
    </div>
  );
};

export default RadioCustomer;
