import {
  ReactNode,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react';
import cx from 'classnames';
import TextAreaUI from 'components/ui/text-area/TextArea';
import { UseControllerProps, Controller } from 'react-hook-form';
import { populateTextWithLink } from 'helpers/utils.helper';
import { TextAreaProps } from 'antd/lib/input';
import styles from './text-area.module.scss';
import './textarea.scss';

export type CProps = TextAreaProps &
  UseControllerProps & {
    extraButton?: ReactNode;
    minRows?: number;
    maxRows?: number;
    autoDetectLink?: boolean;
  };

const TextAreaForm = forwardRef<TextAreaProps, CProps>((props, ref) => {
  const {
    name,
    value,
    control,
    maxLength,
    placeholder,
    minRows,
    maxRows,
    className,
    extraButton,
    onChange,
    disabled,
    autoFocus,
    autoDetectLink,
    ...other
  } = props;
  const inputRef = useRef<any>();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  const placeholderDisplay = useMemo(() => {
    if (disabled) {
      return ' ';
    }
    return placeholder || '';
  }, [disabled, placeholder]);

  useImperativeHandle(ref, () => inputRef.current);

  const renderInput = (valueFn, onChangeFn, fieldState) => {
    if (autoDetectLink) {
      const value = populateTextWithLink(valueFn);
      return (
        <div
          className={styles.detectLink}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }

    const valueCounting = () => {
      if (!maxLength) {
        return null;
      }
      return (
        <div className="value-couting">
          {String(valueFn || '')?.length || 0} of {maxLength || 2000} characters
        </div>
      );
    };

    return (
      <>
        <div className={cx(styles.TextAreaWrapper)}>
          <TextAreaUI
            value={value ?? valueFn}
            onChange={(e) => {
              onChangeFn(e);
              if (control && name && onChange) {
                onChange(e);
              }
            }}
            ref={inputRef}
            maxLength={maxLength}
            className={cx(styles.textAreaForm, className)}
            autoSize={minRows && maxRows ? { minRows, maxRows } : undefined}
            // style={{ overflowY: 'hidden' }}
            {...other}
            disabled={disabled}
            placeholder={placeholderDisplay}
          />
          {extraButton}
          {valueCounting()}
        </div>
        {fieldState?.error?.message ? (
          <div className={cx(styles.message)}>{fieldState?.error?.message}</div>
        ) : null}
      </>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) =>
        renderInput(field.value, field.onChange, fieldState)
      }
    />
  );
});
export default TextAreaForm;
