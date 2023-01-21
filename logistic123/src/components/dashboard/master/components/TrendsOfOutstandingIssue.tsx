import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { useMemo, useState, memo, useCallback, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import {
  arrThreeMonthCurrent,
  arrDateInWeek,
  arrDateInMonth,
  arrMonthInYear,
  arrMomentFullDateInMonth,
  arrMomentThreeMonth,
  arrMomentMonthInYear,
  arrMomentDateInWeek,
  formatMonthChart,
  formatDateChart,
} from 'helpers/utils.helper';
import Button, { ButtonType } from 'components/ui/button/Button';
import { LineChart } from 'components/common/chart/line-chart/LineChart';
import { getCompanyTrendIssueActions } from 'store/dashboard/dashboard.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from '../dashboard-master.module.scss';

const TrendsOfOutstandingIssue = () => {
  const dispatch = useDispatch();
  const [timeTrendOfOutstanding, setTimeTrendOfOutstanding] =
    useState<TrendOfTime>(TrendOfTime.M);

  const { companyTrendIssues } = useSelector((state) => state.dashboard);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const dataChartAxis = useCallback(
    (value: TrendOfTime, isGetMoment?: boolean) => {
      switch (value) {
        case TrendOfTime.M:
          return isGetMoment ? arrMomentFullDateInMonth() : arrDateInMonth();
        case TrendOfTime.M3:
          return isGetMoment ? arrMomentThreeMonth() : arrThreeMonthCurrent();
        case TrendOfTime.Y:
          return isGetMoment ? arrMomentMonthInYear() : arrMonthInYear();
        default:
          return isGetMoment ? arrMomentDateInWeek() : arrDateInWeek();
      }
    },
    [],
  );

  const formatMoment = useCallback((value: Moment, trendType: TrendOfTime) => {
    switch (trendType) {
      case TrendOfTime.Y:
        return value.format(formatMonthChart);
      default:
        return value.format(formatDateChart);
    }
  }, []);

  const dataChartAxisMoment = useCallback(
    (trendType: TrendOfTime) => {
      const result = dataChartAxis(trendType, true);
      return result;
    },
    [dataChartAxis],
  );

  const fillTrendData = useCallback(
    (
      dataMoment: string[],
      dataFill: { timeRange: string; value: string | number }[],
    ) =>
      dataMoment?.map((item) => {
        const findItem = dataFill?.find(
          (itemTrend) => itemTrend?.timeRange === item,
        );
        if (findItem) {
          return {
            timeRange: item,
            value: Number(findItem?.value),
          };
        }
        return {
          timeRange: item,
          value: 0,
        };
      }),
    [],
  );

  const detailDataIssue = useMemo(() => {
    const getFillArr = dataChartAxisMoment(timeTrendOfOutstanding)?.map(
      (item) => formatMoment(moment(new Date(item)), timeTrendOfOutstanding),
    );

    const numberOpenFindingsEachTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberOpenFindingsEachTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.total,
      })),
    );

    const numberAuditTimetableNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.attNotClosedOut,
      })),
    );

    const numberROFNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.rffNotClosedOut,
      })),
    );

    const numberIARNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.iarNotClosedOut,
      })),
    );

    return {
      numberOpenFindingsEachTimeRange,
      numberAuditTimetableNotCloseoutTimeRange,
      numberROFNotCloseoutTimeRange,
      numberIARNotCloseoutTimeRange,
    };
  }, [
    dataChartAxisMoment,
    formatMoment,
    fillTrendData,
    timeTrendOfOutstanding,
    companyTrendIssues,
  ]);

  const dataChartTrendIssues = useMemo(
    () => [
      {
        label: 'Number of non-conformity /observations',
        data:
          detailDataIssue?.numberOpenFindingsEachTimeRange?.map((item) =>
            parseInt(String(item.value), 10),
          ) || [],
      },
      {
        label: 'Number of inspection time tables not closed out',
        data:
          detailDataIssue?.numberAuditTimetableNotCloseoutTimeRange?.map(
            (item) => parseInt(String(item.value), 10),
          ) || [],
      },
      {
        label: 'Number of report of findings not closed out',
        data:
          detailDataIssue?.numberROFNotCloseoutTimeRange?.map((item) =>
            parseInt(String(item.value), 10),
          ) || [],
      },
      {
        label: 'Number of inspection reports not closed out',
        data:
          detailDataIssue?.numberIARNotCloseoutTimeRange?.map((item) =>
            parseInt(String(item.value), 10),
          ) || [],
      },
    ],
    [detailDataIssue],
  );

  useEffect(() => {
    let subtractDate = 0;
    switch (timeTrendOfOutstanding) {
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

    dispatch(
      getCompanyTrendIssueActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeTrendOfOutstanding]);

  return (
    <div>
      <div className={styles.titleContainer}>
        <div>
          <strong className={styles.textTitle}>
            {renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS['Trends of outstanding issues'],
            )}
          </strong>
        </div>
        <div className={styles.buttons}>
          <Button
            buttonType={
              timeTrendOfOutstanding === TrendOfTime.W
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendOfOutstanding(TrendOfTime.W)}
          >
            1W
          </Button>
          <Button
            buttonType={
              timeTrendOfOutstanding === TrendOfTime.M
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendOfOutstanding(TrendOfTime.M)}
          >
            1M
          </Button>
          <Button
            buttonType={
              timeTrendOfOutstanding === TrendOfTime.M3
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendOfOutstanding(TrendOfTime.M3)}
          >
            3M
          </Button>
          <Button
            buttonType={
              timeTrendOfOutstanding === TrendOfTime.Y
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendOfOutstanding(TrendOfTime.Y)}
          >
            1Y
          </Button>
        </div>
      </div>

      <div className={styles.trendOfOutStandingContainer}>
        <LineChart
          data={dataChartTrendIssues}
          labels={dataChartAxis(timeTrendOfOutstanding)}
          height="19rem"
        />
      </div>
    </div>
  );
};

export default memo(TrendsOfOutstandingIssue);
