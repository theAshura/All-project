import { BryntumScheduler } from '@bryntum/scheduler-react';
// import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';

import moment, { Moment } from 'moment';
import { FC, useCallback, useMemo, useRef } from 'react';
import './gantt-chart.scss';

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

const GanttTreeView: FC<Props> = ({
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

  const onClickToRow = useCallback(
    (selected: any) => {
      if (onSelectEvent && selected) {
        onSelectEvent(selected?.eventRecord?.data?.idSelect);
      }
      // setSelectedEvent(selected.length ? selected[0] : null);
    },
    [onSelectEvent],
  );

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
      scheduleMenuFeature: false,
      features: {
        cellMenu: false,
        eventMenu: false,
        tree: true,
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
      collapseIconCls: 'b-icon b-fa-users',
      expandIconCls: 'b-icon b-fa-users',
      rowHeight: 34,
      showTooltip: false,
      listeners: {
        eventclick: onClickToRow,
      },

      columns: customColumns,
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
          treeFeature
          timeRanges={
            customTimeRanges?.length > 0 ? customTimeRanges : blurDayOff
          }
          barMargin={BAR_MARGIN}
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

export default GanttTreeView;
