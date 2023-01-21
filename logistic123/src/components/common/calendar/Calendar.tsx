import FullCalendar, {
  EventInput,
  EventContentArg,
  EventClickArg,
} from '@fullcalendar/react';
import moment from 'moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { FC, useRef } from 'react';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

export interface CalendarProps {
  data: EventInput[];
  dayMaxEvents?: number;
  handleDate?: (date: string) => void;
  handleEvent?: (date: string, id: string) => void;
  handleOpenModalUpcomingPlans?: () => void;
  height?: number;
  setDataList?: any;
  dynamicLabels?: IDynamicLabel;
}

const Calendar: FC<CalendarProps> = (props: CalendarProps) => {
  const {
    data,
    dayMaxEvents,
    handleEvent,
    handleDate,
    handleOpenModalUpcomingPlans,
    height = 880,
    setDataList,
    dynamicLabels,
  } = props;
  const renderEvent = (e: EventContentArg) => (
    <>
      <p className="ms-2 mb-0 event-item limit-line-text">
        <span className="event-dot" />
        {e.event.title}
      </p>
    </>
  );

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (handleOpenModalUpcomingPlans) {
      const { extendedProps } = clickInfo?.event;
      setDataList(extendedProps);
      handleOpenModalUpcomingPlans();
    }
    if (handleEvent) {
      handleEvent(clickInfo.event?.startStr, clickInfo.event?.id);
    } else {
      handleDate(moment(clickInfo.event?.startStr).format('YYYY-MM-DD'));
    }
  };

  const handleDateClick = (clickDateInfo: DateClickArg) => {
    if (handleDate) {
      handleDate(moment(clickDateInfo.dateStr).format('YYYY-MM-DD'));
    }
  };

  const calendarRef = useRef(null);

  return (
    <div className="calendar-ui">
      <FullCalendar
        ref={calendarRef}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        buttonText={{
          today: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Current date'],
          ),
          month: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Month),
          week: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Week),
          day: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Day),
        }}
        dayMaxEvents={dayMaxEvents || 4}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={renderEvent}
        events={data.map((item) => ({
          ...item,
          classNames: ['event-line'],
        }))}
        height={height}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      />
    </div>
  );
};
export default Calendar;
