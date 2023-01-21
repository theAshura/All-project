import { useState, useCallback, useMemo, useEffect } from 'react';
import { LineChart } from 'components/common/chart/line-chart/LineChart';
import { v4 } from 'uuid';
import { uniqBy } from 'lodash';
import moment from 'moment';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { useDispatch, useSelector } from 'react-redux';

import {
  dataChartAxisMoment,
  fillTrendData,
  formatMoment,
  getlineDataChartAxisLineTime,
  randomColor,
} from 'helpers/utils.helper';
import NoDataImg from 'components/common/no-data/NoData';
import { getNumberIncidentsPerPortPerDateActions } from 'store/dashboard/dashboard.action';

import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from './incident-cases-line-chart.module.scss';

export interface ChartInfo {
  label: string;
  data: number[];
}

const IncidentCasesLineChart = () => {
  const [dateSelected, setDateSelected] = useState<TrendOfTime>(TrendOfTime.M);
  const { incidentsPerPortPerDate } = useSelector((state) => state.dashboard);
  const [dateTitle, setDateTitle] = useState<string>('Month');
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const uniqueID = useMemo(() => v4(), []);
  const dispatch = useDispatch();

  useEffect(() => {
    switch (dateSelected) {
      case TrendOfTime.M:
        setDateTitle('month');
        break;
      case TrendOfTime.M3:
        setDateTitle('quarter');
        break;
      case TrendOfTime.Y:
        setDateTitle('year');
        break;
      default:
        setDateTitle('week');
    }
  }, [dateSelected]);

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

  useEffect(() => {
    dispatch(
      getNumberIncidentsPerPortPerDateActions.request(
        convertTimeSelectToDateObj(dateSelected),
      ),
    );
  }, [convertTimeSelectToDateObj, dateSelected, dispatch]);

  const inspectionPerTypePerMonthDataChart: ChartInfo[] = useMemo(() => {
    const getFillArr = dataChartAxisMoment(dateSelected)?.map((item) =>
      formatMoment(item, dateSelected),
    );
    const uniqueRecordByName = uniqBy(
      incidentsPerPortPerDate,
      (inspection) => inspection.portName,
    );

    if (!uniqueRecordByName.length) {
      return [];
    }

    const datasets = uniqueRecordByName?.map((label) =>
      incidentsPerPortPerDate.filter(
        (incident) => incident?.portName === label?.portName,
      ),
    );

    const dataSortByDate = datasets?.map((each) =>
      fillTrendData(
        getFillArr,
        each.map((item) => ({
          timeRange: formatMoment(
            moment(new Date(item?.timeRange)),
            dateSelected,
          ),
          value: item.totalIncident,
          label: item.portName,
        })),
      ),
    );

    return uniqueRecordByName.map((item, index) => ({
      label: item.portName,
      color: randomColor(),
      data: dataSortByDate[index].map((each) => each.value),
    }));
  }, [dateSelected, incidentsPerPortPerDate]);

  return (
    <div className={styles.wrap}>
      <TrendOfTimeFilter
        title={
          <div>
            {renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS[
                'Number of incidents cases per port per'
              ],
            )}
            {` `}
            {renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS[`${dateTitle}`],
            )}
          </div>
        }
        dateSelected={dateSelected}
        onChangeFilter={(date) => setDateSelected(date)}
      />
      <div className={styles.lineChartContainer}>
        {incidentsPerPortPerDate?.length ? (
          <LineChart
            labels={getlineDataChartAxisLineTime(dateSelected)}
            data={inspectionPerTypePerMonthDataChart}
            height={335}
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
    </div>
  );
};
export default IncidentCasesLineChart;
