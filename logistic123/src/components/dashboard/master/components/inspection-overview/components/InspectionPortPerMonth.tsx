import { LineChart } from 'components/common/chart/line-chart/LineChart';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import cx from 'classnames';
import {
  arrDateInMonth,
  arrDateInWeek,
  arrMomentDateInWeek,
  arrMomentFullDateInMonth,
  arrMomentMonthInYear,
  arrMomentThreeMonth,
  arrMonthInYear,
  arrThreeMonthCurrent,
  dataChartAxisMoment,
  fillTrendData,
  formatMoment,
  randomColor,
} from 'helpers/utils.helper';
import { useDispatch, useSelector } from 'react-redux';
import NoDataImg from 'components/common/no-data/NoData';
import { uniqBy } from 'lodash';
import { renderTitleThroughStepDate } from 'helpers/string.helper';

import { getInspectionPerPortPerMonthActions } from 'store/dashboard/dashboard.action';
import moment from 'moment';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from '../style/inspectionOverview.module.scss';
import { ChartInfo } from '../InspectionOverview.constant';

const InspectionPortPerMonth: FC = () => {
  const [inspectionPortPerMonthDate, setInspectionPortPerMonthDate] = useState(
    TrendOfTime.M,
  );
  const uniqueID = useMemo(() => v4(), []);
  const dispatch = useDispatch();
  const { inspectionPerPortPerMonth } = useSelector(
    (globalState) => globalState.dashboard,
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const convertTimeSelectToDateObj = useCallback((time: TrendOfTime) => {
    let subtractDate = 0;
    switch (time) {
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

    return {
      fromDate: priorDate.toISOString(),
      toDate: moment().toISOString(),
    };
  }, []);

  const lineDataChartAxis = useCallback(
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

  const handleOnclickChangeDateFilter = useCallback(
    (
      dateType: TrendOfTime,
      chart: 'port-per-status' | 'type-per-month' | 'port-per-month',
    ) => {
      switch (chart) {
        case 'port-per-month':
          setInspectionPortPerMonthDate(dateType);
          break;
        default:
          break;
      }
    },
    [],
  );

  const inspectionPerPortPerMonthDataChart: ChartInfo[] = useMemo(() => {
    const getFillArr = dataChartAxisMoment(inspectionPortPerMonthDate)?.map(
      (item) =>
        formatMoment(moment(new Date(item)), inspectionPortPerMonthDate),
    );

    if (inspectionPerPortPerMonth) {
      const uniqueRecordByName = uniqBy(
        inspectionPerPortPerMonth,
        (inspection) => inspection.name,
      );

      if (!uniqueRecordByName.length) {
        return [];
      }

      const datasets = uniqueRecordByName.map((label) =>
        inspectionPerPortPerMonth.filter(
          (inspection) => inspection.name === label.name,
        ),
      );

      const dataSortedByDate = datasets.map((each) =>
        fillTrendData(
          getFillArr,
          each.map((item) => ({
            timeRange: formatMoment(
              moment(new Date(item?.timeRange)),
              inspectionPortPerMonthDate,
            ),
            value: item.count,
            label: item.name,
          })),
        ),
      );

      const finalInspectionPortPerMonthData: ChartInfo[] =
        uniqueRecordByName.map((record, index) => ({
          data: dataSortedByDate[index].map((element) => element.value),
          label: record.name,
          color: randomColor(),
        }));

      return finalInspectionPortPerMonthData;
    }

    return [];
  }, [inspectionPerPortPerMonth, inspectionPortPerMonthDate]);

  useEffect(() => {
    const rangeInspectionPortPerMonthDate = convertTimeSelectToDateObj(
      inspectionPortPerMonthDate,
    );
    dispatch(
      getInspectionPerPortPerMonthActions.request(
        rangeInspectionPortPerMonthDate,
      ),
    );
  }, [inspectionPortPerMonthDate, convertTimeSelectToDateObj, dispatch]);

  const renderInspectionCasePerPortDynamicLabel = useMemo(() => {
    const title = `${renderDynamicLabel(
      dynamicLabels,
      MAIN_DASHBOARD_DYNAMIC_FIELDS['Number of inspection cases per port per'],
    )} ${renderDynamicLabel(
      dynamicLabels,
      MAIN_DASHBOARD_DYNAMIC_FIELDS[
        `${renderTitleThroughStepDate(inspectionPortPerMonthDate)}`
      ],
    )}`;
    return title;
  }, [dynamicLabels, inspectionPortPerMonthDate]);

  return (
    <div className={cx(styles.contentContainer)}>
      <TrendOfTimeFilter
        // title={t('inspectionCasesPerPortPerMonth', {
        //   type: renderTitleThroughStepDate(inspectionPortPerMonthDate),
        // })}
        title={renderInspectionCasePerPortDynamicLabel}
        dateSelected={inspectionPortPerMonthDate}
        onChangeFilter={(date) =>
          handleOnclickChangeDateFilter(date, 'port-per-month')
        }
      />

      {inspectionPerPortPerMonthDataChart.length ? (
        <LineChart
          labels={lineDataChartAxis(inspectionPortPerMonthDate)}
          data={inspectionPerPortPerMonthDataChart}
          height={240}
          key={`${uniqueID}+inspectionPortPerMonthDate`}
          stepInteger
          scrollLabelEnable
        />
      ) : (
        <div className={styles.noData}>
          <NoDataImg />
        </div>
      )}
    </div>
  );
};

export default memo(InspectionPortPerMonth);
