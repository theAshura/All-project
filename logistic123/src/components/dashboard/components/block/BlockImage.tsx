import cx from 'classnames';
import SelectUI, { OptionProp } from 'components/ui/select/Select';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { convertLargeNumber } from 'helpers/utils.helper';
import { toLower } from 'lodash';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, ReactElement, useMemo, useState } from 'react';

import styles from './block.module.scss';

export enum DisplayBlock {
  VERTICAL = 'VERTICAL',
  HORIZON = 'HORIZON',
}
interface Props {
  image: (() => ReactElement) | ReactElement;
  title: string | number;
  content: string;
  color: string;
  display?: DisplayBlock;
  dynamicLabels?: IDynamicLabel;
  bgImageColor: string;
  className?: string;
}

type BlockSelectProps = Omit<Props, 'display' | 'control' | 'content'> & {
  option: OptionProp[];
  defaultLabel: string;
  value: number;
  content: (value: string | number) => string;
  setStatus?: (value: string | number) => void;
};

export enum Position {
  LEFT = 'left',
  RIGHT = 'right',
}

interface ViewMoreProps {
  bgImage: (() => ReactElement) | ReactElement;
  title: string | number;
  content: string;
  className?: string;
  color: string;
  position: Position | null;
  onViewMore?: () => void;
  dynamicLabels: IDynamicLabel;
  bgClassName?: string;
  contentClassName?: string;
}

export const BlockImage: FC<Props> = ({
  image,
  title,
  content,
  color,
  bgImageColor,
  display,
  className,
}) => (
  <div
    className={cx(
      styles.block,
      'h-100 ',
      {
        'd-flex': display === DisplayBlock.HORIZON,
        [styles.minHeight105]: display === DisplayBlock.HORIZON,
      },
      className,
    )}
  >
    <div
      style={{ backgroundColor: bgImageColor }}
      className={cx(styles.imgWrapper, {
        'me-4': display === DisplayBlock.HORIZON,
      })}
    >
      {image}
    </div>
    <div className="">
      <div className={styles.number} style={{ color }}>
        {title}
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  </div>
);

export const BlockImageSelect: FC<BlockSelectProps> = ({
  image,
  title,
  content,
  color,
  bgImageColor,
  className,
  option,
  defaultLabel,
  setStatus,
  value,
  dynamicLabels,
}) => {
  const [selected, setSelected] = useState<string | number>(defaultLabel);

  const displayContent = useMemo(() => {
    const findingItem = option?.find((i) => i.value === selected);

    if (findingItem) {
      return toLower(String(findingItem?.label));
    }
    return ' ';
  }, [option, selected]);

  return (
    <div className={cx(styles.block, 'h-100 ', styles.minHeight105, className)}>
      <div className="d-flex justify-content-between align-items-center">
        <div className={styles.title}>{title}</div>
        <SelectUI
          data={option}
          value={selected}
          className={cx(styles.input)}
          onChange={(value) => {
            setSelected(value);
            setStatus(value);
          }}
          notAllowSortData
        />
      </div>
      <div className="d-flex align-items-center">
        <div
          style={{ backgroundColor: bgImageColor }}
          className={cx(styles.imgWrapper, 'me-4')}
        >
          {image}
        </div>
        <div>
          <div className={styles.number} style={{ color }}>
            {convertLargeNumber(value || 0) || ' '}
          </div>
          <div className={styles.content}>{content(displayContent)}</div>
        </div>
      </div>
    </div>
  );
};

export const BlockImageViewMore: FC<ViewMoreProps> = ({
  bgImage,
  position = Position.LEFT,
  title,
  content,
  className,
  color,
  onViewMore,
  dynamicLabels,
  bgClassName,
  contentClassName,
}) => (
  <div className={cx(styles.block, className, 'position-relative')}>
    <div className="position-relative">
      <div
        className={cx(bgClassName, styles.bgWrapper, {
          [styles.floatLeft]: position === Position.RIGHT,
          [styles.floatRight]: position === Position.LEFT,
        })}
      >
        {bgImage}
      </div>
    </div>
    <div
      className={cx(contentClassName, styles.contentWrapper, {
        [styles.contentLeft]: position === Position.LEFT,
        [styles.contentRight]: position === Position.RIGHT,
      })}
    >
      <div className={styles.number} style={{ color }}>
        {title}
      </div>
      <div className={styles.content}>{content}</div>
      {Number(title) > 0 && (
        <div className={styles.viewMore} onClick={onViewMore}>
          {renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['View more'],
          )}
        </div>
      )}
    </div>
  </div>
);
