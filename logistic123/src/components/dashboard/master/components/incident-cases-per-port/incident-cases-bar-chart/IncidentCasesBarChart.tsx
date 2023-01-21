import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';

import { getNumberIncidentsPerPortPerStatusActions } from 'store/dashboard/dashboard.action';

import NoDataImg from 'components/common/no-data/NoData';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from './incident-cases-bar-chart.module.scss';
import {
  IncidentsPerPortPerStatus,
  IncidentStatus,
} from '../../incidents-overview/incidents-overview.const';

const IncidentCasesBarChart = () => {
  const [dateSelected, setDateSelected] = useState<TrendOfTime>(TrendOfTime.M);
  const { incidentsPerPortPerStatus } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
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

  useEffect(() => {
    dispatch(
      getNumberIncidentsPerPortPerStatusActions.request(
        convertTimeSelectToDateObj(dateSelected),
      ),
    );
  }, [convertTimeSelectToDateObj, dateSelected, dispatch]);

  const groupStatusByPortName = useMemo(() => {
    let dataGroupedbyPortName = [];
    incidentsPerPortPerStatus?.forEach((incident) => {
      const existingPortName = dataGroupedbyPortName?.some(
        (item) => item?.portName === incident?.portName,
      );
      if (!existingPortName) {
        dataGroupedbyPortName.push({
          ...incident,
        });
      } else {
        dataGroupedbyPortName = dataGroupedbyPortName.map((item) => {
          if (incident?.portName === item?.portName) {
            return {
              ...item,
              otherItems: item?.otherItems?.length
                ? [...item?.otherItems, incident]
                : [
                    {
                      ...incident,
                    },
                  ],
            };
          }
          return {
            ...item,
          };
        });
      }
    });
    return dataGroupedbyPortName?.map((item: any) => {
      if (item?.otherItems?.length) {
        const items = [item, ...item?.otherItems];
        const dataStatus: any[] = items?.map((i) => ({
          portName: i?.portName,
          numberOfUnassigned: i?.reviewStatus === null ? i?.totalIncident : 0,
          numberOfPending:
            i?.reviewStatus === IncidentStatus.Pending ? i?.totalIncident : 0,
          numberOfInProgress:
            i?.reviewStatus === IncidentStatus.InProgress
              ? i?.totalIncident
              : 0,
          numberOfCleared:
            i?.reviewStatus === IncidentStatus?.Cleared ? i?.totalIncident : 0,
        }));

        return {
          portName: dataStatus?.[0]?.portName,
          numberOfUnassigned: dataStatus?.reduce(
            (a, b) => a + Number(b?.numberOfUnassigned),
            0,
          ),
          numberOfPending: dataStatus?.reduce(
            (a, b) => a + Number(b?.numberOfPending),
            0,
          ),
          numberOfInProgress: dataStatus?.reduce(
            (a, b) => a + Number(b?.numberOfInProgress),
            0,
          ),
          numberOfCleared: dataStatus?.reduce(
            (a, b) => a + Number(b?.numberOfCleared),
            0,
          ),
        };
      }
      return {
        portName: item?.portName,
        numberOfUnassigned:
          item?.reviewStatus === null ? Number(item?.totalIncident) : 0,
        numberOfPending:
          item?.reviewStatus === IncidentStatus.Pending
            ? Number(item?.totalIncident)
            : 0,
        numberOfInProgress:
          item?.reviewStatus === IncidentStatus.InProgress
            ? Number(item?.totalIncident)
            : 0,
        numberOfCleared:
          item?.reviewStatus === IncidentStatus?.Cleared
            ? Number(item?.totalIncident)
            : 0,
      };
    });
  }, [incidentsPerPortPerStatus]);

  const casesPerPortStatusBarChartData: any = useMemo(
    () => ({
      labels:
        groupStatusByPortName?.map((incidents: any) => incidents?.portName) ||
        [],
      datasets: [
        {
          backgroundColor: '#BBBABF',
          label: IncidentStatus.Unassigned,
          data:
            groupStatusByPortName?.map(
              (incidents: any) => incidents?.numberOfUnassigned,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#EBC844',
          label: IncidentStatus.Pending,
          data:
            groupStatusByPortName?.map(
              (incidents: any) => incidents?.numberOfPending,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#F16C20',
          label: IncidentStatus.InProgress,
          data:
            groupStatusByPortName?.map(
              (incidents) => incidents?.numberOfInProgress,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#0F5B78',
          label: IncidentStatus.Cleared,
          data:
            groupStatusByPortName?.map(
              (incidents) => incidents.numberOfCleared,
            ) || [],
          barThickness: 60,
        },
      ],
    }),
    [groupStatusByPortName],
  );

  return (
    <div className={styles.wrap}>
      <TrendOfTimeFilter
        title={
          <div>
            {renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS[
                'Number of incidents cases per port per status'
              ],
            )}
          </div>
        }
        dateSelected={dateSelected}
        onChangeFilter={(date) => setDateSelected(date)}
      />
      <div className={styles.barChartWrapper}>
        <div className={styles.labelSection}>
          {IncidentsPerPortPerStatus?.map((each) => (
            <div
              className={styles.contentWrapper}
              key={`${each?.color} ${each?.title}`}
            >
              <div
                className={styles.colorBox}
                style={{ backgroundColor: each?.color }}
              />
              {each?.title}
            </div>
          ))}
        </div>
        {incidentsPerPortPerStatus?.length ? (
          <Bar
            data={casesPerPortStatusBarChartData}
            height="300px"
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
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
export default IncidentCasesBarChart;
