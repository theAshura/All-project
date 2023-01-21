import { FC, useCallback, useRef } from 'react';
import Switch, { ReactSwitchProps } from 'react-switch';
import { Controller, Control } from 'react-hook-form';
import images from 'assets/images/images';
import cx from 'classnames';

interface Props extends Partial<ReactSwitchProps> {
  control?: Control;
  name?: string;
  label?: string;
  labelTop?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  onChange?: (checked: boolean) => void;
  isRequired?: boolean;
  toggleIconClassName?: string;
  isMultipleValues?: boolean;
}

const ToggleSwitch: FC<Props> = (props) => {
  const switchRef = useRef(null);
  const {
    control,
    name,
    label,
    labelTop,
    height = 16,
    width = 32,
    handleDiameter = 12,
    disabled,
    wrapperClassName,
    isRequired,
    labelClassName,
    toggleIconClassName,
    isMultipleValues,
    ...others
  } = props;

  const renderSwitch = useCallback(
    (value, onChangeFn) => (
      <Switch
        className={cx(disabled ? 'disabled' : '')}
        ref={switchRef}
        disabled={disabled}
        {...others}
        height={height}
        handleDiameter={handleDiameter}
        width={width}
        checked={value || false}
        checkedIcon={
          <img
            src={images.icons.icSwitchCheck}
            className={cx('toggle-switch-icon', toggleIconClassName)}
            alt="checked"
          />
        }
        uncheckedIcon={
          <img
            src={images.icons.icSwitchCross}
            className={cx('toggle-switch-icon', toggleIconClassName)}
            alt="unchecked"
          />
        }
        onChange={(checked) => {
          onChangeFn(checked);
          if (control && name && others.onChange) {
            others.onChange?.(checked);
          }
        }}
      />
    ),
    [
      disabled,
      others,
      height,
      handleDiameter,
      width,
      toggleIconClassName,
      control,
      name,
    ],
  );

  return (
    <div
      className={cx(
        'toggle-switch-wrapper d-flex flex-direct-column align-items-center',
        wrapperClassName,
      )}
    >
      <div>
        {labelTop && (
          <div className="d-flex align-items-start mb-3">
            <div className={cx('toggle-switch-label', labelClassName)}>
              {labelTop}
            </div>
            {isRequired && (
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            )}
          </div>
        )}
        {control && name ? (
          <Controller
            control={control}
            name={name}
            render={({ field }) =>
              renderSwitch(
                isMultipleValues ? others.checked : field.value,
                field.onChange,
              )
            }
          />
        ) : (
          renderSwitch(others.checked, others.onChange)
        )}
      </div>

      {label && (
        <div className="d-flex align-items-start">
          <div className={cx('toggle-switch-label', labelClassName)}>
            {label}
          </div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;
