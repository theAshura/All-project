import { FC, useState, useContext, useMemo } from 'react';
import cx from 'classnames';
import { CalendarTimeTableContext } from 'contexts/audit-time-table/CalendarTimeTable';
import moment from 'moment';
import { EventInput } from '@fullcalendar/react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-time-table.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Calendar from 'components/common/calendar/Calendar';
import styles from './form.module.scss';
import { ModalChooseAuditor } from './ModalChooseAuditor';

interface ChecklistViewTableProps {
  data?: any;
  loading?: boolean;
  isEdit?: boolean;
  dynamicLabels?: IDynamicLabel;
}

export const CalenderTable: FC<ChecklistViewTableProps> = (props) => {
  const { isEdit, dynamicLabels } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { listEvent, setDateEvent, optionEditor } = useContext(
    CalendarTimeTableContext,
  );

  const dataCalendar: EventInput[] = useMemo(
    () =>
      listEvent
        ?.filter((t) => t?.operator !== 'delete')
        ?.map((item) => ({
          id: item?.id,
          title: `${
            optionEditor.find((i) => i.value === item?.auditorId)?.label
              ? optionEditor.find((i) => i.value === item?.auditorId)?.label
              : ''
          } / ${item.auditee}`,
          start: `${moment(item.date).format('YYYY-MM-DD')}T${moment(
            `${item.date}T${item.from}`,
          ).format('HH:mm:ss')}`,
          end: `${moment(item.date).format('YYYY-MM-DD')}T${moment(
            `${item.date}T${item.to}`,
          ).format('HH:mm:ss')}`,

          classNames: 'event',
        })) || [],

    [listEvent, optionEditor],
  );

  return (
    <div className={cx('mt-3', styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleForm)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                'Inspection time table'
              ],
            )}
          </div>
        </div>
        <div className={cx(styles.table)}>
          <Calendar
            data={dataCalendar || []}
            dynamicLabels={dynamicLabels}
            handleDate={(date: string) => {
              setDateEvent(date);
              const isShowEvent: boolean =
                isEdit || listEvent?.some((item) => item.date === date);
              setIsOpenModal(isShowEvent);
            }}
          />
        </div>
      </div>

      <ModalChooseAuditor
        isShow={isOpenModal}
        dynamicLabels={dynamicLabels}
        isEdit={isEdit}
        setShow={() => {
          setIsOpenModal((e) => !e);
        }}
      />
    </div>
  );
};
