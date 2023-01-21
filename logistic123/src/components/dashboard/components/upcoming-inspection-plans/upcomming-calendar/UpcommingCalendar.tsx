import { useMemo, useEffect } from 'react';
import Calendar from 'components/common/calendar/Calendar';
import { useDispatch, useSelector } from 'react-redux';
import { EventInput } from '@fullcalendar/react';
import moment from 'moment';
import { getUpcomingInspectionPlansActions } from 'store/dashboard/dashboard.action';
import { formatDateNoTime, formatDateIso } from 'helpers/date.helper';
import { IFilterType } from '../UpcomingInspectionPlan';

const UpcommingCalendar = ({
  handleOpenModalUpcomingPlans,
  setCalendarSelected,
  setSelectedDate,
  renderModalTable,
  globalFilter,
  dynamicLabels,
}) => {
  const { upcomingInspectionPlans } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getUpcomingInspectionPlansActions.request({
        entityType: globalFilter?.entity,
      }),
    );
  }, [dispatch, globalFilter?.entity]);

  const dataCalendar: EventInput[] = useMemo(() => {
    let dataGroupByDay = [];
    upcomingInspectionPlans?.forEach((upCommingItem) => {
      const existDuplicateTime = dataGroupByDay?.some(
        (item) =>
          formatDateNoTime(upCommingItem?.plannedFromDate) ===
          formatDateNoTime(item?.plannedFromDate),
      );
      if (!existDuplicateTime) {
        dataGroupByDay.push({
          ...upCommingItem,
          numberOfPlanning: upCommingItem?.otherItems?.length + 1 || 1,
        });
      } else {
        dataGroupByDay = dataGroupByDay.map((item) => {
          if (
            formatDateNoTime(upCommingItem?.plannedFromDate) ===
            formatDateNoTime(item?.plannedFromDate)
          ) {
            return {
              ...item,
              otherItems: item?.otherItems?.length
                ? [...item?.otherItems, upCommingItem]
                : [
                    {
                      ...upCommingItem,
                      numberOfPlanning: item?.otherItems?.length + 1 || 1,
                    },
                  ],
              numberOfPlanning: item?.otherItems?.length + 1 || 1,
            };
          }
          return {
            ...item,
            numberOfPlanning: item?.otherItems?.length + 1 || 1,
          };
        });
      }
    });
    return (
      dataGroupByDay?.map((item: any) => {
        if (item?.otherItems?.length) {
          const items = [item, ...item?.otherItems];

          const officeItems = items?.filter(
            (i) => i.entityType === IFilterType.OFFICE,
          );

          const vesselItems = items?.filter(
            (i) => i.entityType === IFilterType.VESSEL,
          );

          if (
            officeItems?.length > 1 ||
            vesselItems?.length > 1 ||
            (officeItems?.length && vesselItems?.length)
          ) {
            return [
              officeItems?.length && {
                title:
                  officeItems?.length > 1
                    ? `${officeItems?.length} offices`
                    : officeItems?.[0]?.auditCompanyName ||
                      officeItems?.[0]?.otherItems[0]?.auditCompanyName,
                start: item?.plannedFromDate,
                classNames: 'event',
                data: officeItems,
              },
              vesselItems.length && {
                title:
                  vesselItems?.length > 1
                    ? `${vesselItems?.length} vessels`
                    : item?.vesselName || item?.otherItems[0]?.vesselName,
                start: formatDateIso(item?.plannedFromDate, { startDay: true }),
                classNames: 'event',
                data: vesselItems,
              },
            ]?.filter((item) => item);
          }
        }
        return {
          title: item?.vesselName ? item?.vesselName : item?.auditCompanyName,
          start: item?.plannedFromDate,
          classNames: 'event',
          data: [item],
        };
      }) || []
    );
  }, [upcomingInspectionPlans]);

  return (
    <div>
      <Calendar
        data={dataCalendar?.flat(1) || []}
        handleOpenModalUpcomingPlans={handleOpenModalUpcomingPlans}
        setDataList={setCalendarSelected}
        dynamicLabels={dynamicLabels}
        handleDate={(date: string) => {
          setSelectedDate(moment(date));
        }}
      />
      {renderModalTable()}
    </div>
  );
};
export default UpcommingCalendar;
