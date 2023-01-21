import { FC, ReactElement } from 'react';
import cx from 'classnames';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import InvisibleBackdrop from '../backdrop/InvisibleBackdrop';
import classes from './custom-select.module.scss';
import images from '../../../assets/images/images';

interface Props {
  customSelect: ReactElement;
  isOpen?: boolean;
  value: any;
  placeholder?: string;
  toggle?: (isOpen?: boolean) => void;
  messageRequired: string;
  isView?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const CustomSelect: FC<Props> = ({
  customSelect,
  messageRequired,
  isOpen,
  value,
  placeholder,
  toggle,
  isView,
  dynamicLabels,
}) => (
  <div className={cx('position-relative', classes.wrap)}>
    <div
      className={cx(classes.value, { [classes.disableSelect]: isView })}
      onClick={() => {
        if (!isOpen && !isView) {
          toggle(true);
        }
      }}
    >
      {value || (
        <div className={classes.placeholder}>
          {placeholder ||
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Select icon'],
            )}
        </div>
      )}
      <img
        src={images.icons.icArrowDown}
        className={classes.arrowBtn}
        alt="icArrowDown"
      />
    </div>
    {isOpen && (
      <InvisibleBackdrop onClick={() => toggle(false)}>
        <div className={classes.wrapSelect}>{customSelect}</div>
      </InvisibleBackdrop>
    )}
    <div className={classes.requireMessage}>{messageRequired}</div>
  </div>
);

export default CustomSelect;
