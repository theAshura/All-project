import images from 'assets/images/images';
import cx from 'classnames';
import { validateEmail } from 'helpers/utils.helper';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './input-with-tags.module.scss';

interface Props {
  autoFocus?: boolean;
  isTag?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onDoubleClick?: (e: any) => void;
  onDeleteTag?: (e: any) => void;
  placeholder?: string;
  maxLength?: number;
  inputClassName?: string;
}

const InputAutoScaling: FC<Props> = ({
  autoFocus,
  onChange,
  onKeyDown,
  onDoubleClick,
  onDeleteTag,
  value,
  isTag,
  disabled,
  placeholder,
  maxLength,
  inputClassName,
}) => {
  const [width, setWidth] = useState(0);
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setWidth(spanRef?.current?.offsetWidth);
  }, [value]);

  const onChangeValue = (e) => {
    if (String(e.target.value)?.length < maxLength) {
      onChange(e);
    }
  };
  useEffect(() => {
    if (autoFocus) {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    }
  }, [autoFocus]);

  if (isTag) {
    return (
      <span
        className={cx(styles.customTag, {
          [styles.emailInvalid]: !validateEmail(value),
        })}
        onDoubleClick={onDoubleClick}
      >
        {value}{' '}
        <div onClick={onDeleteTag}>
          <img
            src={
              validateEmail(value)
                ? images.icons.icBlackSingleClose
                : images.icons.icWhiteSingleClose
            }
            alt="ic-close-modal"
            className={styles.deleteBtn}
          />
        </div>
      </span>
    );
  }

  return (
    <span className={styles.wrapAutoScalingInput}>
      <span id="hide" ref={spanRef}>
        {value}
      </span>
      <input
        type="text"
        style={{ width: width + 10, minWidth: placeholder ? 120 : 'none' }}
        value={value}
        ref={inputRef}
        onKeyDown={onKeyDown}
        onChange={onChangeValue}
        disabled={disabled}
        maxLength={250}
        placeholder={placeholder || ''}
        className={cx(inputClassName, { [styles.disable]: disabled })}
      />
    </span>
  );
};

export default InputAutoScaling;
