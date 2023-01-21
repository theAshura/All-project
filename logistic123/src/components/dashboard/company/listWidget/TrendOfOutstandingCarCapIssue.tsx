import cx from 'classnames';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { memo, useMemo, FC, Dispatch, SetStateAction, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { DashBoard, TrendOfOutstandingLabels } from 'constants/widget.const';
import moment from 'moment';
import { getTrendOfOutstandingCarCapActions } from 'store/dashboard/dashboard.action';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style/trend-of-outstanding-car-cap.module.scss';

interface TrendOfOutstandingCarCapIssueProps {
  dashboard: DashBoard;
  timeTrendOfOutstandingCarCap: TrendOfTime;
  setTimeTrendOfOutstandingCarCap: Dispatch<SetStateAction<TrendOfTime>>;
  entity?: string;
  dynamicLabels: IDynamicLabel;
}

const TrendOfOutstandingCarCapIssue: FC<TrendOfOutstandingCarCapIssueProps> = ({
  timeTrendOfOutstandingCarCap,
  setTimeTrendOfOutstandingCarCap,
  entity,
  dashboard,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();
  const { trendOfOutstandingCarCap } = useSelector((state) => state.dashboard);
  const dataChartTrendCarCapIssues = useMemo(() => {
    const requiredField = [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of open CAR'],
        ),
        data:
          trendOfOutstandingCarCap?.data?.map((each) => each.numberOfOpenCar) ||
          [],
        backgroundColor: '#0F5B78',
        barThickness: 70,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of hold CAP'],
        ),
        data:
          trendOfOutstandingCarCap?.data?.map((each) => each.numberOfHoldCar) ||
          [],
        backgroundColor: '#EBC844',
        barThickness: 70,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of pending CAP'],
        ),
        data:
          trendOfOutstandingCarCap?.data?.map(
            (each) => each.numberOfPendingCar,
          ) || [],
        backgroundColor: '#F16C20',
        barThickness: 70,
      },
    ];

    return dashboard === DashBoard.COMPANY
      ? [
          ...requiredField,
          {
            label: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of denied CAP'],
            ),
            data:
              trendOfOutstandingCarCap?.data?.map(
                (each) => each.numberOfDeniedCar,
              ) || [],
            backgroundColor: '#1C886B',
            barThickness: 70,
          },
        ]
      : requiredField;
  }, [dashboard, dynamicLabels, trendOfOutstandingCarCap?.data]);

  const mappedCompanyName = useMemo(
    () => trendOfOutstandingCarCap?.data?.map((each) => each.companyName || ''),
    [trendOfOutstandingCarCap],
  );

  useEffect(() => {
    let subtractDate = 0;
    switch (timeTrendOfOutstandingCarCap) {
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
      createdAtFrom: priorDate.toISOString(),
      createdAtTo: moment().toISOString(),
      entityType: entity !== 'All' ? entity : undefined,
    };

    dispatch(getTrendOfOutstandingCarCapActions.request(dateObj));
  }, [dispatch, timeTrendOfOutstandingCarCap, entity]);

  return (
    <div className={cx(styles.TOAAndIA)} key={`${dashboard}uniqueConstraint`}>
      <TrendOfTimeFilter
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Trends of outstanding CAR/CAP issue'
          ],
        )}
        dateSelected={timeTrendOfOutstandingCarCap}
        onChangeFilter={(date) => setTimeTrendOfOutstandingCarCap(date)}
      />

      <div className={styles.CarCapIssueChart}>
        <div className={styles.CarCapLabels}>
          {TrendOfOutstandingLabels(dashboard).map(({ color, label }) => (
            <div className={styles.flex} key={`${color}${label}`}>
              <span
                className={styles.ColorBox}
                style={{ backgroundColor: color }}
              />
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_DASHBOARD_DYNAMIC_FIELDS[label],
              )}
            </div>
          ))}
        </div>
        <Bar
          data={{
            labels: mappedCompanyName,
            datasets: dataChartTrendCarCapIssues,
          }}
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
                weight: 1,
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
      </div>
    </div>
  );
};

export default memo(TrendOfOutstandingCarCapIssue);
