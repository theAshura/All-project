import cx from 'classnames';
import { Fragment } from 'react';
import { formatDateTime, populateStatus } from 'helpers/utils.helper';
import lowerCase from 'lodash/lowerCase';
import moment from 'moment';
import { PLANNING_STATUES } from 'constants/planning-and-request.const';
import { Row, Col } from 'reactstrap';

import style from './line-step.module.scss';

export enum StepStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

export interface Info {
  datetime: Date;
  name: string;
  description: string;
  id?: string;
  isMulti?: boolean;
  label?: string;
}

export interface Item {
  id: string;
  name: string;
  status: string;
  toolTip?: string;
  info?: Info[];
  isMultiInfoStatus?: boolean;
}

export const statusColor = {
  yellow_2: ['pending'],
  red_3: ['cancelled'],
  blue_3: [
    'reviewed',
    'submitted',
    PLANNING_STATUES.Accepted,
    PLANNING_STATUES.Auditor_accepted,
    'planned successfully',
    'in progress',
    'completed',
  ],
  green_1: ['approved', 'close out', 'closeout'],
};

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
  lineStepStyle?: string;
  status?: string;
}

export default function LineStepInfoCP(props: Props) {
  const { items, lineStepStyle, status } = props;

  const getCurrent = (info: Info[]) => {
    if (info && info?.length > 0) {
      let indexMax = 0;
      const now = moment();
      info?.forEach((item, index) => {
        const itemDate = moment(item?.datetime);
        if (now.diff(info[indexMax]?.datetime) < now.diff(itemDate)) {
          indexMax = index;
        }
      });
      return info[indexMax];
    }
    return null;
  };

  const renderStatusLabel = (item: Item) => (
    <>
      <div className={cx(style.progress, 'd-flex align-items-center mb-3')}>
        <div
          className={cx(style.timeLineIcon, {
            [style.active]: item.status === StepStatus.ACTIVE,
            [style.error]: item.status === StepStatus.ERROR,
            // [style.current]:
            //   item.status === StepStatus.ACTIVE && status?.includes(item.name),
          })}
        />
        <div
          className={cx(style.timeLineStick, {
            [style.active]:
              item.status === StepStatus.ACTIVE && !status?.includes(item.name),
          })}
        />
      </div>

      <div
        className={cx(
          style.timeLineContent,
          {
            [style.yellow_2]:
              item.status !== StepStatus.INACTIVE &&
              statusColor.yellow_2.includes(lowerCase(item.name)),
            [style.red_3]:
              item.status !== StepStatus.INACTIVE &&
              statusColor.red_3.includes(lowerCase(item.name)),
            [style.blue_3]:
              item.status !== StepStatus.INACTIVE &&
              statusColor.blue_3.includes(lowerCase(item.name)),
            [style.green_1]:
              item.status !== StepStatus.INACTIVE &&
              statusColor.green_1.includes(lowerCase(item.name)),
          },
          'pb-2',
        )}
      >
        {populateStatus(item.name)}
        <span className={style.contentTooltip}>{item?.toolTip}</span>
      </div>
    </>
  );

  const renderInfo = (info: Info, item: Item) => (
    <div className={cx(style.infoWrapper)}>
      <div className={cx(style.dateTime, 'pb-1 d-flex align-items-center ')}>
        <span className={cx('me-1', style.circleBlue)} />{' '}
        <div>{formatDateTime(info?.datetime)}</div>
      </div>

      {info.isMulti && (
        <>
          <div
            className={cx('fw-bold', {
              [style.yellow_2]:
                item.status !== StepStatus.INACTIVE &&
                statusColor.yellow_2.includes(lowerCase(item.name)),
              [style.red_3]:
                item.status !== StepStatus.INACTIVE &&
                statusColor.red_3.includes(lowerCase(item.name)),
              [style.blue_3]:
                item.status !== StepStatus.INACTIVE &&
                statusColor.blue_3.includes(lowerCase(item.name)),
              [style.green_1]:
                item.status !== StepStatus.INACTIVE &&
                statusColor.green_1.includes(lowerCase(item.name)),
            })}
          >
            {info.label}
          </div>
        </>
      )}

      <div className={cx('pb-1 ')}>
        <span className={cx(style.name, 'limit-line-text')}>{info?.name}</span>
      </div>
      <div className={cx('pb-1')}>
        <span className={cx(style.description, 'limit-line-text')}>
          {info?.description}
        </span>
      </div>
    </div>
  );

  const renderSingleInfoStatus = (infos: Info[], item: Item) => {
    const info = getCurrent(infos);
    return (
      <Col className={cx(style.timeLineItem, 'p-0 m-0')} key={item.name}>
        {renderStatusLabel(item)}
        {info && renderInfo(info, item)}
      </Col>
    );
  };

  const renderMultipleInfoStatus = (infos: Info[], item: Item) => (
    <Col className={cx(style.timeLineItem, 'p-0 m-0')} key={item.name}>
      {renderStatusLabel(item)}
      <div className="d-flex flex-column">
        {infos?.map((i, index) => {
          if (!i.id) {
            // eslint-disable-next-line no-console
            console.error('Item is missing unique "id" attribute');
            return null;
          }
          return <Fragment key={i.id}>{renderInfo(i, item)}</Fragment>;
        })}
      </div>
    </Col>
  );

  return (
    <div className={cx(style.info, style.wrapLineProgress, lineStepStyle)}>
      <div className={style.timeLineProgress} />
      <Row className={style.timeLineItems}>
        {items?.map((item, i) => (
          <Fragment key={item.name}>
            {item?.isMultiInfoStatus
              ? renderMultipleInfoStatus(item?.info, item)
              : renderSingleInfoStatus(item?.info, item)}
          </Fragment>
        ))}
      </Row>
    </div>
  );
}
