import { useCallback, useEffect, useMemo, useState } from 'react';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { HorizontalBarChart } from 'components/common/chart/bar-chart/HorizontalBarChart';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSailReportingPendingActions } from 'store/summary-sail-reporting/summary-sail-reporting.action';
import moment from 'moment';
import styles from './pending-action-chart.module.scss';

const PendingActionChart = () => {
  const { t } = useTranslation([I18nNamespace.SAIL_GENERAL_REPORT]);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [timeTrendOfAudit, setTimeTrendOfAudit] = useState<TrendOfTime>(
    TrendOfTime.M,
  );
  const { pendingAction } = useSelector((state) => state.sailReportingSummary);

  useEffect(() => {
    let subtractDate = 0;
    switch (timeTrendOfAudit) {
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
      getSailReportingPendingActions.request({
        id,
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
      }),
    );
  }, [dispatch, id, timeTrendOfAudit]);

  const dataChart = useMemo(() => {
    const otherPendingTechnical = pendingAction?.otherPendingTechnical || 0;
    const otherPendingSMS = pendingAction?.otherPendingSMS || 0;

    return [
      {
        name: t('summary.otherTechnicalRecords'),
        value: Number(otherPendingTechnical),
        color: '#3B9FF3',
      },
      {
        name: t('summary.otherSMSRecords'),
        value: Number(otherPendingSMS),
        color: '#6DDFFD',
      },
    ];
  }, [t, pendingAction]);

  const dataHorizontalBarChart = useMemo(
    () =>
      dataChart?.map((item) => ({
        name: item.name,
        color: item?.color,
        value: Number(item.value),
      })),
    [dataChart],
  );

  const renderChart = useCallback(
    () => (
      <>
        <TrendOfTimeFilter
          title={t('summary.pendingAction')}
          dateSelected={timeTrendOfAudit}
          onChangeFilter={(date) => setTimeTrendOfAudit(date)}
        />

        <HorizontalBarChart
          data={dataHorizontalBarChart?.filter((item) => item?.value) || []}
        />
      </>
    ),
    [dataHorizontalBarChart, t, timeTrendOfAudit],
  );

  return <div className={styles.wrapperContainer}>{renderChart()}</div>;
};

export default PendingActionChart;
