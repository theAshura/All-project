import { BryntumScheduler } from '@bryntum/scheduler-react';
// import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import { PLANNING_STATUES } from 'constants/planning-and-request.const';
import moment, { Moment } from 'moment';
import { FC, useCallback, useMemo, useRef } from 'react';
import './gantt-chart.scss';

export const LIST_STATUSES_DEFAULT = [
  {
    id: PLANNING_STATUES.Draft,
    name: 'Draft',
    color: '#A2845E',
  },
  {
    id: PLANNING_STATUES.Cancelled,
    name: 'Cancelled',
    color: '#E9453A',
  },
  {
    id: PLANNING_STATUES.Reassigned,
    name: 'Unassigned',
    color: '#FF9F0A',
  },
  {
    id: PLANNING_STATUES.Submitted,
    name: 'Submitted',
    color: '#30D158',
  },
  {
    id: PLANNING_STATUES.Approved,
    name: 'Approved',
    color: '#66D4CF',
  },
  {
    id: PLANNING_STATUES.Accepted,
    name: 'Accepted',
    color: '#40C8E0',
  },
  {
    id: PLANNING_STATUES.PlannedSuccessfully,
    name: 'Planned',
    color: '#0A84FF',
  },
  {
    id: PLANNING_STATUES.InProgress,
    name: 'In progress',
    color: '#5E5CE6',
  },
  {
    id: PLANNING_STATUES.Completed,
    name: 'Completed',
    color: '#E101E6',
  },
];

/**
 * Application configuration
 */

// const data = {
//   success: true,
//   resources: {
//     rows: [
//       { id: 'a', index: 0, name: 'Arcady', role: 'Developer' },
//       { id: 'b', index: 1, name: 'Dave', role: 'Sales' },
//       { id: 'c', index: 2, name: 'Henrik', role: 'Sales' },
//       { id: 'f', index: 3, name: 'Celia', role: 'CEO' },
//       { id: 'g', index: 4, name: 'Lee', role: 'CTO' },
//       { id: 'd', index: 5, name: 'Madison', role: 'Developer' },
//       { id: 'e', index: 6, name: 'Maxim', role: 'Developer' },
//       { id: 'h', index: 7, name: 'Amit', role: 'Sales' },
//       { id: 'i', index: 8, name: 'Kate', role: 'Developer' },
//       { id: 'j', index: 9, name: 'Mark', role: 'Developer' },
//       { id: 'k', index: 10, name: 'Emilia', role: 'Developer' },
//     ],
//   },
//   events: {
//     rows: [
//       {
//         id: 1,
//         resourceId: 'a',
//         name: 'Meeting #1',
//         desc: 'Discuss new features',
//         startDate: '2018-02-07 11:00',
//         endDate: '2018-02-010 14:00',
//         eventType: 'Meeting',
//         eventColor: 'blue',
//         iconCls: 'b-fa b-fa-calendar',
//       },
//       {
//         id: 11,
//         resourceId: 'a',
//         name: 'Meeting #1',
//         desc: 'Discuss new features',
//         startDate: '2018-02-12 11:00',
//         endDate: '2018-02-15 14:00',
//         eventType: 'Meeting',
//         eventColor: '#ccc',
//         iconCls: 'b-fa b-fa-calendar',
//       },
//       {
//         id: 2,
//         resourceId: 'b',
//         name: 'Meeting #2',
//         desc: 'Strategy meeting',
//         startDate: '2018-02-08 12:00',
//         endDate: '2018-02-10 15:00',
//         eventType: 'Meeting',
//         eventColor: 'blue',
//         iconCls: 'b-fa b-fa-calendar',
//       },
//       {
//         id: 3,
//         resourceId: 'c',
//         name: 'Meeting #3',
//         desc: 'Emerging markets',
//         startDate: '2018-02-09 13:00',
//         endDate: '2018-02-13 16:00',
//         eventType: 'Meeting',
//         eventColor: 'blue',
//         iconCls: 'b-fa b-fa-calendar',
//       },
//       {
//         id: 4,
//         resourceId: 'd',
//         name: 'Meeting #4',
//         desc: 'Code review',
//         startDate: '2018-02-10 09:00',
//         endDate: '2018-02-15 11:00',
//         eventType: 'Meeting',
//         eventColor: 'blue',
//         iconCls: 'b-fa b-fa-calendar',
//       },
//       {
//         id: 5,
//         resourceId: 'e',
//         name: 'Appointment #1',
//         desc: 'Dental',
//         startDate: '2018-02-11 10:00',
//         endDate: '2018-02-19 12:00',
//         eventType: 'Appointment',
//         iconCls: 'b-fa b-fa-clock',
//       },
//       {
//         id: 6,
//         resourceId: 'f',
//         name: 'Appointment #2',
//         desc: 'Golf preparations',
//         startDate: '2018-02-7 11:00',
//         endDate: '2018-02-12 13:00',
//         eventType: 'Appointment',
//         iconCls: 'b-fa b-fa-golf-ball',
//       },
//       {
//         id: 7,
//         resourceId: 'g',
//         name: 'Appointment #3',
//         desc: 'Important',
//         startDate: '2018-02-7 14:00',
//         endDate: '2018-02-13 17:00',
//         location: 'Home office',
//         eventColor: 'red',
//         eventType: 'Appointment',
//         iconCls: 'b-fa b-fa-exclamation-circle',
//       },
//       {
//         id: 8,
//         resourceId: 'h',
//         name: 'Meeting #5',
//         desc: 'Planning',
//         startDate: '2018-02-7 13:00',
//         endDate: '2018-02-14 15:00',
//         eventType: 'Meeting',
//         eventColor: 'blue',
//         iconCls: 'b-fa b-fa-calendar',
//       },
//       {
//         id: 9,
//         resourceId: 'i',
//         name: 'Important activity',
//         desc: 'Hanging at the bar',
//         startDate: '2018-02-7 16:00',
//         endDate: '2018-02-15 19:00',
//         eventType: 'Appointment',
//         iconCls: 'b-fa b-fa-beer',
//         eventColor: 'orange',
//       },
//       {
//         id: 10,
//         resourceId: 'j',
//         name: 'Overtime',
//         desc: 'Deadline approaching',
//         startDate: '2018-02-7 17:00',
//         endDate: '2018-02-16 20:00',
//         eventType: 'Meeting',
//         iconCls: 'b-fa b-fa-calendar',
//         eventColor: 'blue',
//       },
//       {
//         id: 11,
//         resourceId: 'k',
//         name: 'Scrum',
//         desc: 'Team A',
//         startDate: '2018-02-7 9:00',
//         endDate: '2018-02-17 11:00',
//         eventType: 'Appointment',
//         iconCls: 'b-fa b-fa-calendar',
//         eventColor: 'blue',
//       },
//     ],
//   },
//   timeRanges: {
//     rows: [
//       {
//         name: 'Lunch',
//         startDate: '2018-02-07 12:00',
//         endDate: '2018-02-07 13:00',
//         cls: 'striped',
//       },
//     ],
//   },
// };

interface Props {
  currentTime?: string | Date | Moment;
  customEvents?: any;
  customResources?: any;
  customTimeRanges?: any;
  customColumns?: any;
  customConfig?: any;
  onSelectEvent?: (id: string) => void;
  loading?: boolean;
  loadingEvent?: boolean;
}

const BAR_MARGIN = 5;

const CustomGanttChart: FC<Props> = ({
  currentTime,
  customEvents,
  customResources,
  customTimeRanges,
  customColumns,
  customConfig,
  onSelectEvent,
  loading,
  loadingEvent,
}) => {
  const schedulerRef = useRef<typeof BryntumScheduler | null>(null);

  // const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);

  // event selection change handler
  // const onEventSelectionChange = useCallback(
  //   ({ selected }: { selected: any }) => {
  //     if (onSelectEvent && selected.length) {
  //       onSelectEvent(selected[0]?.data?.idSelect);
  //     }
  //     // setSelectedEvent(selected.length ? selected[0] : null);
  //   },
  //   [onSelectEvent],
  // );
  const onClickToRow = useCallback(
    (selected: any) => {
      if (onSelectEvent && selected) {
        onSelectEvent(selected?.eventRecord?.data?.idSelect);
      }
      // setSelectedEvent(selected.length ? selected[0] : null);
    },
    [onSelectEvent],
  );

  // add event handler
  // const addEvent = useCallback(() => {
  //   const scheduler = schedulerRef.current.instance;
  //   const startDate = new Date(scheduler.startDate.getTime());
  //   const endDate = new Date(startDate.getTime());
  //   const resource = scheduler.resourceStore.first;

  //   if (!resource) {
  //     Toast.show('There is no resource available');
  //     return;
  //   }

  //   endDate.setHours(endDate.getHours() + 2);

  //   scheduler.eventStore.add({
  //     resourceId: resource.id,
  //     startDate,
  //     endDate,
  //     name: 'New task',
  //     eventType: 'Meeting',
  //   });
  // }, []);

  // remove event handler
  // const removeEvent = useCallback(() => {
  //   selectedEvent?.remove();
  //   setSelectedEvent(null);
  // }, [selectedEvent]);

  const blurDayOff = useMemo(() => {
    const daysOfMonth = Number(
      moment(currentTime)?.endOf('month')?.format('DD'),
    );
    const month = moment(currentTime)?.month() + 1;
    const year = moment(currentTime)?.year();
    const listBlurDays = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= daysOfMonth; i++) {
      const day = moment(`${year}-${month}-${i}`);
      const dayNumber = Number(moment(`${year}-${month}-${i}`)?.day());
      if (dayNumber === 6) {
        listBlurDays.push({
          name: '',
          startDate: moment(day)?.startOf('day')?.format(),
          endDate: moment(day).add(1, 'day')?.endOf('day')?.format(),
          cls: 'hide-badge',
        });
      }
    }
    return listBlurDays?.length > 0 ? listBlurDays : [];
  }, [currentTime]);

  const schedulerConfig = useMemo(
    () => ({
      // resourceImagePath: 'users/',

      startDate: new Date(moment(currentTime)?.startOf('month')?.format()),
      endDate: new Date(moment(currentTime)?.endOf('month')?.format()),
      viewPreset: {
        timeResolution: {
          unit: 'day',
          increment: 1,
        },
        tickWidth: 75,
        tickHeight: 25,
        headers: [
          {
            unit: 'month',
            align: 'center',
            dateFormat: 'MM-YYYY',
          },
          {
            unit: 'day',
            align: 'center',
            dateFormat: 'DD (ddd)',
          },
        ],
      },

      timeRangesFeature: {
        narrowThreshold: 10,
      },

      columns: customColumns,
      scheduleMenuFeature: false,
      features: {
        cellMenu: false,
        eventMenu: false,
        eventTooltip: false,
        eventDrag: {
          disabled: true,
        },
        cellTooltip: false,
        scheduleTooltip: false,
        eventDragSelect: false,
        eventDragCreate: false,
        eventEdit: {
          disabled: true,
        },
      },
      createEventOnDblClick: false,
      autoHeight: true,
      rowHeight: 34,
      showTooltip: false,
      // allowOverlap: true,
      // syncDataOnLoad: true,
      listeners: {
        eventclick: onClickToRow,
      },
      // viewConfig: {
      //   dynamicRowHeight: true,
      // },
      ...customConfig,
    }),
    [currentTime, customColumns, customConfig, onClickToRow],
  );

  return (
    <div style={{ minHeight: 500 }}>
      {!loading ? (
        <BryntumScheduler
          {...schedulerConfig}
          ref={schedulerRef}
          events={loadingEvent ? [] : customEvents || []}
          resources={customResources || []}
          timeRanges={
            customTimeRanges?.length > 0 ? customTimeRanges : blurDayOff
          }
          barMargin={BAR_MARGIN}
          // onEventSelectionChange={onEventSelectionChange}
        />
      ) : (
        <div className="d-flex justify-content-center mt-5">
          <img
            src={images.common.loading}
            className="loading-icon"
            alt="loading"
          />
        </div>
      )}
    </div>
  );
};

export default CustomGanttChart;
