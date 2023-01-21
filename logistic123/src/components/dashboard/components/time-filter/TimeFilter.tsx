import { Col } from 'antd/lib';
import { IFilter } from 'components/dashboard/auditors/DashBoardAuditorsContainer';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import Button, { ButtonType } from 'components/ui/button/Button';
import moment from 'moment';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { formatDateIso } from 'helpers/date.helper';
import { getUpcomingInspectionPlansActions } from 'store/dashboard/dashboard.action';
import styles from '../upcoming-inspection-plans/upcoming-inspection-plan.module.scss';

interface TimeFilterProps {
  calendarMode?: boolean;
  setTimeUpcomingInspectionPlan?: any;
  timeUpcomingInspectionPlan?: TrendOfTime;
  globalFilter?: IFilter;
  setTimeFilter?: (params: { fromDate?: string; toDate?: string }) => void;
  dynamicLabels?: IDynamicLabel;
}

const TimeFilter: FC<TimeFilterProps> = ({
  calendarMode,
  setTimeUpcomingInspectionPlan,
  timeUpcomingInspectionPlan,
  globalFilter,
  setTimeFilter,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let subtractDate = 0;
    if (!calendarMode) {
      switch (timeUpcomingInspectionPlan) {
        case TrendOfTime.M3:
          subtractDate = 90;
          break;
        case TrendOfTime.Y:
          subtractDate = 365;
          break;

        case TrendOfTime.M:
          subtractDate = 30;
          break;
        default:
          subtractDate = 7;
          break;
      }
      const priorDate = moment().add(subtractDate, 'days');

      dispatch(
        getUpcomingInspectionPlansActions.request({
          fromDate: formatDateIso(moment(), { startDay: true }),
          toDate: formatDateIso(priorDate, { endDay: true }),
          entityType: globalFilter?.entity,
        }),
      );
      if (setTimeFilter) {
        setTimeFilter({
          fromDate: formatDateIso(moment(), { startDay: true }),
          toDate: formatDateIso(priorDate, { endDay: true }),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, globalFilter?.entity, timeUpcomingInspectionPlan]);
  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <Col span={24}>
        <div className="d-flex justify-content-end mb-3">
          <Button
            className={styles.btnChart}
            buttonType={
              timeUpcomingInspectionPlan === TrendOfTime.W
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeUpcomingInspectionPlan(TrendOfTime.W)}
          >
            1W
          </Button>
          <Button
            className={styles.btnChart}
            buttonType={
              timeUpcomingInspectionPlan === TrendOfTime.M
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeUpcomingInspectionPlan(TrendOfTime.M)}
          >
            1M
          </Button>
          <Button
            className={styles.btnChart}
            buttonType={
              timeUpcomingInspectionPlan === TrendOfTime.M3
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeUpcomingInspectionPlan(TrendOfTime.M3)}
          >
            3M
          </Button>
          <Button
            className={styles.btnChart}
            buttonType={
              timeUpcomingInspectionPlan === TrendOfTime.Y
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeUpcomingInspectionPlan(TrendOfTime.Y)}
          >
            1Y
          </Button>
        </div>
      </Col>
    </div>
  );
};
export default TimeFilter;
