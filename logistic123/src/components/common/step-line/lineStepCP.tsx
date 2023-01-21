import cx from 'classnames';
import style from './line-step.module.scss';

export enum StepStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}
export interface Item {
  id: string;
  name: string;
  status: string;
  toolTip?: string;
}

export enum ItemStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  REVIEWED = 'Reviewed',
  APPROVED = 'Approved',
  CANCELLED = 'Cancelled',
  CLOSED_OUT = 'Closed out',
  REJECTED = 'Rejected',
}

interface Props {
  items: Item[];
  maxLength?: number;
}

export default function LineStepCP(props: Props) {
  const { items, maxLength } = props;

  return (
    <div
      className={style.timeline}
      style={{
        width: maxLength,
      }}
    >
      <div className={style.timeLineProgress} />
      <div className={style.timeLineItems}>
        {items?.map((item, i) => (
          <div
            className={cx(style.timeLineItem, {
              [style.active]: item.status === StepStatus.ACTIVE,
              [style.error]: item.status === StepStatus.ERROR,
            })}
            key={item.name}
          >
            <div className={cx(style.timeLineContent)}>
              {item.name}
              <span className={style.contentTooltip}>{item?.toolTip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
