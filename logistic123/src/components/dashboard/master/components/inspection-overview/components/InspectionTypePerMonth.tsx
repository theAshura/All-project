import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { LineChart } from 'components/common/chart/line-chart/LineChart';
import {
  randomColor,
  formatMoment,
  dataChartAxisMoment,
  lineDataChartAxis,
  fillTrendData,
} from 'helpers/utils.helper';
import { uniqBy } from 'lodash';
import NoDataImg from 'components/common/no-data/NoData';
import { getInspectionPerTypePerMonthActions } from 'store/dashboard/dashboard.action';
import moment from 'moment';
import { renderTitleThroughStepDate } from 'helpers/string.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { ChartInfo } from '../InspectionOverview.constant';
import styles from '../style/inspectionOverview.module.scss';

const InspectionTypePerMonth: FC = () => {
  const uniqueID = useMemo(() => v4(), []);
  const dispatch = useDispatch();
  const [inspectionTypePerMonthDate, setInspectionTypePerMonthDate] = useState(
    TrendOfTime.M,
  );
  const { inspectionPerTypePerMonth } = useSelector(
    (globalState) => globalState.dashboard,
  );
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const detailDataInspectionTypePerMonth = useMemo(() => {
    const getFillArr = dataChartAxisMoment(inspectionTypePerMonthDate)?.map(
      (item) =>
        formatMoment(moment(new Date(item)), inspectionTypePerMonthDate),
    );

    const uniqueRecordByName = uniqBy(
      inspectionPerTypePerMonth,
      (inspection) => inspection.name,
    );

    if (!uniqueRecordByName.length) {
      return [];
    }

    const datasets = uniqueRecordByName.map((label) =>
      inspectionPerTypePerMonth.filter(
        (inspection) => inspection.name === label.name,
      ),
    );

    const dataSortedByDate = datasets.map((each) =>
      fillTrendData(
        getFillArr,
        each.map((item) => ({
          timeRange: formatMoment(
            moment(new Date(item?.timeRange)),
            inspectionTypePerMonthDate,
          ),
          value: item.count,
          label: item.name,
        })),
      ),
    );

    const finalInspectionTypePerMonthData: ChartInfo[] = uniqueRecordByName.map(
      (record, index) => ({
        data: dataSortedByDate[index].map((element) => element.value),
        label: record.name,
        color: randomColor(),
      }),
    );

    return finalInspectionTypePerMonthData;
  }, [inspectionPerTypePerMonth, inspectionTypePerMonthDate]);

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

  const handleOnclickChangeDateFilter = useCallback(
    (
      dateType: TrendOfTime,
      chart: 'port-per-status' | 'type-per-month' | 'port-per-month',
    ) => {
      switch (chart) {
        case 'type-per-month':
          setInspectionTypePerMonthDate(dateType);
          break;

        default:
          break;
      }
    },
    [],
  );

  useEffect(() => {
    const rangeInspectionTypePerMonthDate = convertTimeSelectToDateObj(
      inspectionTypePerMonthDate,
    );
    dispatch(
      getInspectionPerTypePerMonthActions.request(
        rangeInspectionTypePerMonthDate,
      ),
    );
  }, [inspectionTypePerMonthDate, convertTimeSelectToDateObj, dispatch]);

  return (
    <div className={cx(styles.contentContainer)}>
      <TrendOfTimeFilter
        title={
          <div>
            {renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS[
                'Number of inspection cases per inspection type per'
              ],
            )}
            {` `}
            {renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS[
                `${renderTitleThroughStepDate(inspectionTypePerMonthDate)}`
              ],
            )}
          </div>
        }
        dateSelected={inspectionTypePerMonthDate}
        onChangeFilter={(date) =>
          handleOnclickChangeDateFilter(date, 'type-per-month')
        }
      />

      {detailDataInspectionTypePerMonth.length ? (
        <LineChart
          labels={lineDataChartAxis(inspectionTypePerMonthDate)}
          data={detailDataInspectionTypePerMonth}
          height={240}
          key={`${uniqueID}+inspectionTypePerMonthDate`}
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

export default memo(InspectionTypePerMonth);
