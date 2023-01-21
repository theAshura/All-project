import {
  InputHTMLAttributes,
  ReactElement,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import cx from 'classnames';
import Tooltip from 'antd/lib/tooltip';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactElement;
  labelClassName?: string;
  tooltip?: boolean;
}
const TOOLTIP_COLOR = '#3B9FF3';

const Radio = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, tooltip, checked, labelClassName, ...other } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  return (
    <label className="d-flex align-items-center non-antd-radio">
      <input type="radio" checked={checked} {...other} ref={inputRef} />
      {tooltip ? (
        <Tooltip placement="top" title={label} color={TOOLTIP_COLOR}>
          <span className={cx('label', labelClassName)}>{label}</span>
        </Tooltip>
      ) : (
        <span className={cx('label', labelClassName)}>{label}</span>
      )}
    </label>
  );
});

export default Radio;
