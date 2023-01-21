import images from 'assets/images/images';
import cx from 'classnames';
import {
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ICInformation } from '../../common/icon';

export enum InputType {
  WARNING = 'warning',
  INFO = 'info',
  ERROR = 'error',
  NORMAL = 'normal',
  LINE = 'line',
}

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  renderPrefix?: (() => ReactElement) | ReactElement;
  renderSuffix?: (() => ReactElement) | ReactElement;
  label?: (() => ReactElement) | ReactElement | string;
  isError?: boolean;
  message?: string;
  messageRequired?: string;
  inputType?: typeof InputType[keyof typeof InputType];
  inputClassName?: string;
  classSuffix?: string;
  classPrefix?: string;
  isRequired?: boolean;
  disabledCss?: boolean;
  name?: string;
  styleLabel?: string;
  type?: string;
  id?: string;
  inputSearchCustom?: string;
  wrapperInput?: string;
  hideCountCharacters?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    isError = false,
    label,
    inputType = InputType.NORMAL,
    className,
    renderPrefix,
    renderSuffix,
    classSuffix,
    classPrefix,
    isRequired,
    message,
    inputClassName,
    messageRequired,
    type,
    style,
    autoFocus,
    styleLabel,
    disabled,
    id,
    placeholder,
    inputSearchCustom,
    wrapperInput,
    disabledCss,
    readOnly,
    maxLength,
    value,
    onChange,
    hideCountCharacters,
    ...other
  } = props;
  const inputRef = useRef<HTMLInputElement>();

  const [focusInput, setFocusInput] = useState(false);
  const [internalValue, setInternalValue] = useState(null);

  const onMouseUp = useCallback(() => {
    if (inputRef.current) {
      setFocusInput(true);
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setFocusInput(true);
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  const placeholderDisplay = useMemo(() => {
    if (disabled || readOnly) {
      return ' ';
    }
    return placeholder || '';
  }, [disabled, placeholder, readOnly]);

  const valueCounting = () => {
    if (hideCountCharacters || !maxLength) {
      return null;
    }
    return (
      <div className={cx('value-couting')}>
        {String(internalValue || '')?.length ||
          String(inputRef?.current?.value || '')?.length ||
          String(value || '')?.length ||
          0}{' '}
        of {maxLength} characters
      </div>
    );
  };

  useImperativeHandle(ref, () => inputRef.current);

  return (
    <div className={cx('wrap-input', wrapperInput)} id={id}>
      {label && (
        <div className="d-flex align-items-start mg__b-1">
          <div className={cx('label', styleLabel)}>{label}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}

      <div
        className={cx(
          'input',
          {
            normal: inputType === InputType.NORMAL,
            warning: inputType === InputType.WARNING,
            info: inputType === InputType.INFO,
            line: inputType === InputType.LINE,
            'd-none': props.type === 'hidden',
            focusInput:
              !disabled &&
              !disabledCss &&
              focusInput &&
              inputType !== InputType.LINE,
            focusInputLine:
              !disabled &&
              !disabledCss &&
              focusInput &&
              inputType === InputType.LINE,
            error: isError,
            disabled: disabled || disabledCss,
          },
          className,
          inputSearchCustom,
        )}
        style={style}
        onMouseUp={onMouseUp}
        onBlur={() => setFocusInput(false)}
      >
        {renderPrefix && (
          <span className={cx('renderPrefix', classPrefix)}>
            {renderPrefix}
          </span>
        )}
        <input
          className={inputClassName}
          {...other}
          ref={inputRef}
          disabled={disabled}
          type={type || 'text'}
          placeholder={placeholderDisplay}
          maxLength={maxLength}
          value={value}
          onChange={(e) => {
            setInternalValue(e?.target?.value);
            if (onChange) {
              onChange(e);
            }
          }}
        />
        {valueCounting()}
        {renderSuffix && (
          <span className={cx('renderSuffix', classSuffix)}>
            {renderSuffix}
          </span>
        )}
      </div>
      {message && (
        <div
          className={cx('message mt-2', {
            normal: inputType === InputType.NORMAL,
            warning: inputType === InputType.WARNING,
            info: inputType === InputType.INFO,
            'd-none': props.type === 'hidden',
            error: isError,
            disabled,
          })}
        >
          <ICInformation />
          <span>{message}</span>
        </div>
      )}
      {messageRequired && (
        <div className="message-required mt-2">{messageRequired} </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
