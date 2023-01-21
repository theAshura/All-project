import { FC, useEffect, useRef } from 'react';
import cx from 'classnames';
import TextAreaUI from 'components/ui/text-area/TextArea';
import { TextAreaProps } from 'antd/lib/input';
import styles from './text-area.module.scss';
import './textarea.scss';

export type CProps = TextAreaProps & {
  minRows?: number;
  maxRows?: number;
  autoFocus?: boolean;
  ref?: any;
};

const TextAreaQuestion: FC<CProps> = (props) => {
  const { placeholder, autoFocus, minRows, maxRows, className, ...other } =
    props;
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);
  return (
    <TextAreaUI
      className={cx(styles.textAreaQuestion, className)}
      style={{ overflowY: 'hidden' }}
      ref={inputRef}
      placeholder={!other.disabled && placeholder ? placeholder : ''}
      autoSize={
        other?.autoSize || { minRows: minRows || 3, maxRows: maxRows || 5 }
      }
      {...other}
    />
  );
};
export default TextAreaQuestion;
