import cx from 'classnames';
import { TextareaHTMLAttributes, ReactElement, FC } from 'react';
import images from 'assets/images/images';
import { ICInformation } from '../../common/icon';

export enum TextareaType {
  WARNING = 'warning',
  INFO = 'info',
  ERROR = 'error',
  NORMAL = 'normal',
}

export interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: (() => ReactElement) | ReactElement | string;
  isError?: boolean;
  message?: string;
  textareaType?: typeof TextareaType[keyof typeof TextareaType];
  textareaClassName?: string;
  messageRequired?: string;
  name?: string;
  styleLabel?: any;
  isRequired?: boolean;
}

const TextareaUI: FC<Props> = (props) => {
  const {
    isError = false,
    label,
    textareaType = TextareaType.NORMAL,
    className,
    message,
    textareaClassName,
    messageRequired,
    style,
    styleLabel,
    isRequired,
    disabled,
    ...other
  } = props;
  return (
    <div className={cx('wrap-textarea', className)}>
      {label && (
        <div className="d-flex align-items-start mg__b-1">
          <div className={cx('label', styleLabel)}>{label}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}
      <textarea
        className={cx(
          {
            normal:
              textareaType === TextareaType.NORMAL ||
              textareaType === TextareaType.INFO,
            warning: textareaType === TextareaType.WARNING,
            // info: textareaType === TextareaType.INFO,
            error: isError || !!messageRequired,
            disabled,
          },
          textareaClassName,
        )}
        style={style}
        {...other}
        disabled={disabled}
      />
      {message && (
        <div
          className={cx('message mt-2', {
            normal: textareaType === TextareaType.NORMAL,
            warning: textareaType === TextareaType.WARNING,
            info: textareaType === TextareaType.INFO,
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
};

export default TextareaUI;
