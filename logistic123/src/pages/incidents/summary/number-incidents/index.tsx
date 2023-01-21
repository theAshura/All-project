import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import moment, { Moment } from 'moment';
import {
  arrDateInWeek,
  arrMonthInYear,
  arrMomentAboutDateInMonth,
  arrMomentMonthInYear,
  arrMomentDateInWeek,
  arrMomentAboutDateInMonthText,
  arrMomentAboutDateInThreeMonth,
  arrMomentAboutDateInThreeMonthText,
  formatDateChart,
  formatMonthChart,
} from 'helpers/utils.helper';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import NoDataImg from 'components/common/no-data/NoData';
import max from 'lodash/max';
import round from 'lodash/round';
import sumBy from 'lodash/sumBy';
import { FORMAT_DATE_YEAR } from 'constants/common.const';
import { getNumberOfPilotFeedbackActions } from 'pages/pilot-terminal-feedback/store/action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { getNumberIncidentsActions } from '../../store/action';

import styles from '../detail.module.scss';

export enum ChartDataType {
  INCIDENTS = 'incidents',
  PILOT_FEEDBACK = 'pilot-feedback',
  INSPECTION_CASES_PER_TYPE = 'i-c-p-t',
  INSPECTION_CASES_PER_PORT = 'i-c-p-p',
}

interface NumberIncidentsProps {
  barColor?: string;
  barThickness?: number;
  barHeight?: number;
  title?: string;
  type?: ChartDataType;
}

const NumberIncidents: FC<NumberIncidentsProps> = ({
  barColor,
  barThickness,
  barHeight,
  title,
  type = ChartDataType.INCIDENTS,
}) => {
  const dispatch = useDispatch();

  const { numberIncident } = useSelector((state) => state.incidents);
  const { numberOfPilotFeedbacks } = useSelector(
    (state) => state.pilotTerminalFeedback,
  );

  const [trendSelected, setTimeTrendSelected] = useState<TrendOfTime>(
    TrendOfTime.M,
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const dataChartAxis = useCallback(
    (value: TrendOfTime, isGetMoment?: boolean) => {
      switch (value) {
        case TrendOfTime.M:
          return isGetMoment
            ? arrMomentAboutDateInMonth()
            : arrMomentAboutDateInMonthText();
        case TrendOfTime.M3:
          return isGetMoment
            ? arrMomentAboutDateInThreeMonth()
            : arrMomentAboutDateInThreeMonthText();
        case TrendOfTime.Y:
          return isGetMoment ? arrMomentMonthInYear() : arrMonthInYear();
        default:
          return isGetMoment ? arrMomentDateInWeek() : arrDateInWeek();
      }
    },
    [],
  );

  const mappedValue = useMemo(
    () =>
      (type === ChartDataType.INCIDENTS
        ? numberIncident
        : numberOfPilotFeedbacks) || [],
    [numberIncident, numberOfPilotFeedbacks, type],
  );

  const dataChart = useMemo(() => {
    const labels = dataChartAxis(trendSelected);

    if (TrendOfTime.Y === trendSelected || TrendOfTime.W === trendSelected) {
      const values = mappedValue?.map((item) => {
        const itemDate: Moment = moment(item.timeRange);
        let itemDateLabel = '';

        if (TrendOfTime.Y === trendSelected) {
          itemDateLabel = itemDate.format(formatMonthChart);
        } else if (TrendOfTime.W === trendSelected) {
          itemDateLabel = itemDate.format(formatDateChart);
        }

        if (labels.includes(itemDateLabel)) {
          return { value: item.total, date: itemDateLabel };
        }
        return { value: 0, date: itemDateLabel };
      });

      return {
        labels,
        datasets: [
          {
            data: labels.map((date) => {
              const findingItem = values?.find((i) => i.date === date);
              return findingItem?.value || 0;
            }),
            backgroundColor: barColor || '#FF6E01',
            barThickness,
          },
        ],
      };
    }

    // TODO: For month and three month
    const dateArray: { startDate: Moment; endDate: Moment }[] = dataChartAxis(
      trendSelected,
      true,
    );
    const valuesForMonth = dateArray?.map((dateRange) => {
      const total = sumBy(mappedValue, (item) => {
        const startTime = moment(dateRange.startDate)
          .startOf('day')
          .format(FORMAT_DATE_YEAR);
        const endTime = moment(dateRange.endDate)
          .endOf('day')
          .format(FORMAT_DATE_YEAR);
        return moment(item?.timeRange)?.isBetween(startTime, endTime) ||
          moment(item?.timeRange)?.isSame(startTime) ||
          moment(item?.timeRange)?.isSame(endTime)
          ? Number(item?.total)
          : 0;
      });
      return total;
    });

    return {
      labels: dateArray?.map(
        (i) =>
          `${i.startDate.format(formatDateChart)}-${i.endDate.format(
            formatDateChart,
          )}`,
      ),
      datasets: [
        {
          data: valuesForMonth,
          backgroundColor: barColor || '#FF6E01',
          barThickness,
        },
      ],
    };
  }, [dataChartAxis, trendSelected, barColor, barThickness, mappedValue]);

  const options = useMemo(() => {
    const convertMaxOfColumn = (value: number, step: number) => {
      const roundNumber = round(value / step);
      return roundNumber * step;
    };

    const convertStepOfColumn = (value: number) => {
      const powValue: number = String(value)?.length;
      // eslint-disable-next-line no-restricted-properties
      return Math.pow(10, powValue - 1);
    };

    const values = dataChart?.datasets?.[0].data?.map((i) => Number(i)) || [];
    const maxValue = max(values) || 0;
    const stepSize: number = convertStepOfColumn(Number(maxValue)) || 1;

    let maxOfColumn = convertMaxOfColumn(Number(maxValue), stepSize) || 10;

    if (maxOfColumn < 10) {
      maxOfColumn = 10;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: 0,
          max: maxOfColumn,
          stepSize: max,
        },
      },
    };
  }, [dataChart?.datasets]);

  useEffect(() => {
    let subtractDate = 0;
    switch (trendSelected) {
      case TrendOfTime.M3:
        subtractDate = -90;
        break;
      case TrendOfTime.Y:
        subtractDate = -365;
        break;

      case TrendOfTime.M:
        subtractDate = -30;
        break;
      default:
        subtractDate = -7;
        break;
    }
    const priorDate = moment().add(subtractDate, 'days');

    const dateObj = {
      fromDate: priorDate.toISOString(),
      toDate: moment().toISOString(),
    };

    if (type === ChartDataType.INCIDENTS) {
      dispatch(getNumberIncidentsActions.request(dateObj));
    }

    if (type === ChartDataType.PILOT_FEEDBACK) {
      dispatch(getNumberOfPilotFeedbackActions.request(dateObj));
    }
  }, [dispatch, trendSelected, type]);
  return (
    <div className={cx(styles.containerWrapper, styles.firstRow)}>
      <TrendOfTimeFilter
        title={
          title ||
          renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Number of incidents'],
          )
        }
        dateSelected={trendSelected}
        onChangeFilter={(date) => setTimeTrendSelected(date)}
      />

      <div className={cx(styles.chart)}>
        {dataChart?.datasets?.[0]?.data?.every((i) => i === 0) ? (
          <NoDataImg className={styles.noData} />
        ) : (
          <Bar
            height={barHeight || '270px'}
            options={options}
            data={dataChart}
          />
        )}
      </div>
    </div>
  );
};

export default NumberIncidents;
