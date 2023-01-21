import {
  ReactElement,
  InputHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import cx from 'classnames';

export interface Props {
  title?: string;
  label?: string | ReactElement;
  labelClassName?: string;
  checkMarkClassName?: string;
  hasError?: boolean;
}

const CheckBox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement & HTMLLabelElement> & Props
>((props, ref) => {
  const {
    className,
    name,
    checked,
    label,
    style,
    disabled,
    labelClassName,
    checkMarkClassName,
    hasError,
    ...other
  } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  return (
    <label
      className={cx('checkbox', className, {
        checked,
        disabled,
      })}
      style={style}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        ref={inputRef}
        disabled={disabled}
        {...other}
      />
      <span
        className={cx('checkmark', checkMarkClassName, {
          'error-message': hasError,
        })}
      />
      <span className={cx('label', labelClassName)}>{label}</span>
    </label>
  );
});

export default CheckBox;
