import cx from 'classnames';
import images from 'assets/images/images';
import Tooltip from 'antd/lib/tooltip';

import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { ReactElement } from 'react';
import style from './itemSelect.module.scss';

interface Props {
  value: string | number;
  label: string | ReactElement;
  required?: boolean;
  removeItem: (value: string | number) => void;
  maxlengthTitle?: number;
  disabled?: boolean;
}

export default function ItemSelect(props: Props) {
  const {
    label,
    removeItem,
    value,
    disabled,
    maxlengthTitle = 30,
    required = false,
  } = props;

  return value && label ? (
    <div className={cx(style.refItemSelect)}>
      <div
        className={style.itemContent}
        style={{
          paddingBottom: 1,
          paddingLeft: 8,
          paddingTop: 0,
          ...((required || disabled) && { paddingRight: 8 }),
        }}
      >
        <Tooltip placement="topLeft" title={label} color="#3B9FF3">
          {typeof label !== 'string' ||
          (typeof label === 'string' && label?.length <= maxlengthTitle)
            ? label
            : `${label.slice(0, maxlengthTitle - 3)}...`}
        </Tooltip>
      </div>
      {!required && !disabled ? (
        <Button
          onClick={() => {
            removeItem(value);
          }}
          buttonType={ButtonType.UnderLineDangerous}
          buttonSize={ButtonSize.Small}
          className={cx(style.btnSmall, { [style.disable]: disabled })}
          disabled={disabled}
        >
          <img src={images.icons.icGrayX} alt="result" />
        </Button>
      ) : null}
    </div>
  ) : null;
}
