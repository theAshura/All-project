import {
  ReactNode,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import cx from 'classnames';
import Input, { TextAreaProps } from 'antd/lib/input';
import styles from './text-area.module.scss';
import './textarea.scss';

export type CProps = TextAreaProps & {
  extraButton?: ReactNode;
  minRows?: number;
  maxRows?: number;
  message?: string;
};

const { TextArea } = Input;

const TextAreaUI = forwardRef<TextAreaProps, CProps>((props, ref) => {
  const {
    name,
    value,
    maxLength,
    placeholder,
    minRows,
    maxRows,
    className,
    extraButton,
    onChange,
    message,
    autoFocus,
    ...other
  } = props;
  const inputRef = useRef<any>();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  const valueCounting = () => {
    if (!maxLength) {
      return null;
    }
    return (
      <div className="value-couting">
        {String(value || '')?.length || 0} of {maxLength || 2000} characters
      </div>
    );
  };

  useImperativeHandle(ref, () => inputRef.current);

  return (
    <div>
      <div className={cx(styles.TextAreaWrapper)}>
        <TextArea
          value={value}
          onChange={onChange}
          ref={inputRef}
          maxLength={maxLength}
          className={cx(styles.textAreaForm, className)}
          autoSize={minRows && maxRows ? { minRows, maxRows } : undefined}
          style={{ overflowY: 'hidden' }}
          {...other}
          placeholder={placeholder || ''}
        />
        {extraButton}
        {valueCounting()}
      </div>
      {message ? <div className={cx(styles.message)}>{message}</div> : null}
    </div>
  );
});
export default TextAreaUI;
