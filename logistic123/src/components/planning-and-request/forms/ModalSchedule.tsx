import Badge from 'antd/lib/badge';
import Calendar from 'antd/lib/calendar';
import cx from 'classnames';
import ModalComponent, { ModalType } from 'components/ui/modal/Modal';
import { PlanningAndRequest } from 'models/api/planning-and-request/planning-and-request.model';
import moment, { Moment } from 'moment';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { getDates } from 'helpers/date.helper';
import { FC, useState, useMemo } from 'react';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './form.module.scss';
import './form.scss';
import { ModalPRAuditor } from './ModalPRAuditor';

interface CalenderTableProps {
  data?: PlanningAndRequest[];
  loading?: boolean;
  isEdit?: boolean;
  isShow?: boolean;
  setShow?: () => void;
  plannedFrom: Moment;
  plannedTo?: Moment;
  dynamicLabels?: IDynamicLabel;
}

const colors = [
  'red',
  'yellow',
  'orange',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

export const ModalSchedule: FC<CalenderTableProps> = (props) => {
  const { data, isShow, setShow, plannedFrom, plannedTo, dynamicLabels } =
    props;
  const [selected, setSelected] = useState<PlanningAndRequest>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMore, setModalMore] = useState(false);
  const [dataMore, setDataMore] = useState<any[]>();
  const [dateCurrent, setDateCurrent] = useState<Moment>();

  const getListData = (value) => {
    const dataNew = [];
    data?.forEach((element, index) => {
      const fromDate = moment(element?.plannedFromDate).format('YYYY-MM-DD');
      const toDate = moment(element?.plannedToDate).format('YYYY-MM-DD');

      if (
        fromDate <= value.format('YYYY-MM-DD') &&
        value.format('YYYY-MM-DD') <= toDate
      ) {
        dataNew.push({
          ...element,
          status: colors[colors.length % (index + 1)],
        });
      }
    });
    return dataNew;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);

    return (
      <ul className={cx('events', listData?.length > 0 && 'have-data')}>
        {listData?.map(
          (item, index) =>
            index < 3 && (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                className={styles.calendarItem}
                key={String(item.id + index)}
                onClick={async () => {
                  setDateCurrent(value);
                  if (index === 2) {
                    setModalMore(true);
                    setDataMore(listData);
                  } else {
                    await setSelected(item);
                    await setIsOpenModal(true);
                  }
                }}
              >
                <Badge
                  text={
                    index === 2
                      ? `${listData?.length - 2} more+`
                      : item?.leadAuditor?.username
                  }
                  status={item?.status}
                />
              </li>
            ),
        )}
      </ul>
    );
  };

  const renderFormSeeMore = () => (
    <div className={cx('events')}>
      {dataMore?.map((item, index) => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <li
          className={styles.itemSeeMore}
          key={String(index + item.id)}
          onClick={async () => {
            await setSelected(item);
            await setModalMore(false);
            await setIsOpenModal(true);
          }}
        >
          <Badge text={item?.leadAuditor?.username} status={item?.status} />
        </li>
      ))}
    </div>
  );

  const styleHighLight = useMemo(() => {
    const fromDate = moment(plannedFrom);
    const toDate = moment(plannedTo);
    const range = getDates(fromDate, toDate);
    return range.map((item, index) => (
      <style
        key={String(item + index)}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          .modal-schedule td[title="${item}"] {
            background: #e6f7ff !important;
          }
        `,
        }}
      />
    ));
  }, [plannedFrom, plannedTo]);

  const renderForm = () => (
    <div className={cx('modal-schedule')}>
      {styleHighLight}
      <Calendar
        className="p-0"
        dateCellRender={dateCellRender}
        mode="month"
        defaultValue={plannedFrom || moment().endOf('day')}
      />
      <ModalPRAuditor
        isShow={isOpenModal}
        setShow={() => {
          setIsOpenModal((e) => !e);
        }}
        data={selected}
        dynamicLabels={dynamicLabels}
      />
      <ModalComponent
        isOpen={modalMore}
        toggle={() => {
          setModalMore((e) => !e);
        }}
        bodyClassName={cx(styles.modalShowMore, 'overflow-auto ')}
        modalType={ModalType.SMALL}
        title={`${dateCurrent?.format('MMMM DD, yyyy')}`}
        content={renderFormSeeMore()}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );

  return (
    <ModalComponent
      isOpen={isShow}
      toggle={() => {
        setShow();
      }}
      bodyClassName={cx(styles.modalSchedule, 'overflow-auto')}
      modalType={ModalType.X_LARGE}
      title={renderDynamicLabel(
        dynamicLabels,
        DETAIL_PLANNING_DYNAMIC_FIELDS['Inspectors schedule'],
      )}
      dynamicLabels={dynamicLabels}
      content={renderForm()}
    />
  );
};
