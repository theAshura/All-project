import { FC } from 'react';
import images from 'assets/images/images';
import cx from 'classnames';

export enum StepItemType {
  ACTIVE = 'icTickFull',
  ACTIVE_DISABLED = 'icTickDisabled',
  ERROR = 'icError',
  INACTIVE = 'icEllipseDisabled',
  NORMAL = 'icEllipse',
  ACTIVE_VIEW = 'activeView',
  INACTIVE_VIEW = 'inActiveView',
}

export interface StepItemProps {
  label?: string;
  status: typeof StepItemType[keyof typeof StepItemType];
  isInfo?: boolean;
  className?: string;
}

const StepItem: FC<StepItemProps> = (props) => {
  const { label, status = StepItemType.NORMAL, isInfo, className } = props;

  return (
    <div className={cx('step__item', className)}>
      {status !== StepItemType.ACTIVE_VIEW &&
        status !== StepItemType.INACTIVE_VIEW && (
          <img src={images.icons[status]} alt="icon" />
        )}
      {status === StepItemType.ACTIVE_VIEW && (
        <img
          src={images.icons.icDotBlue}
          alt="icon"
          className="icon-dot--blue"
        />
      )}

      <span
        className={cx('label', {
          active: status === StepItemType.ACTIVE,
          error: status === StepItemType.ERROR,
          'active-view': status === StepItemType.ACTIVE_VIEW,
          'inactive-view': status === StepItemType.INACTIVE_VIEW,
          'active--disabled':
            status === StepItemType.ACTIVE_DISABLED || StepItemType.NORMAL,
          disabled: status === StepItemType.INACTIVE,
          infoNormal: isInfo && status === StepItemType.NORMAL,
        })}
      >
        {label}
      </span>
    </div>
  );
};

export default StepItem;
