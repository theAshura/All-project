import { I18nNamespace } from 'constants/i18n.const';
import { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DoughnutChartNoSort } from 'components/common/chart/doughnut-chart/DoughnutChartNoSort';

import styles from '../detail.module.scss';
import { getIncidentPlaceActions } from '../../store/action';

const IncidentPlace = () => {
  const { t } = useTranslation(I18nNamespace.INCIDENTS);
  const dispatch = useDispatch();

  const { incidentPlace } = useSelector((state) => state.incidents);

  const [trendSelected, setTimeTrendSelected] = useState<TrendOfTime>(
    TrendOfTime.M,
  );

  const dataChart = useMemo(() => {
    const data = incidentPlace?.[0];
    return [
      {
        name: 'At port',
        color: '#FFCE5B',
        value: Number(data?.atPort),
      },
      {
        name: 'At sea',
        color: '#31CDDB',
        value: Number(data?.atSea),
      },
    ];
  }, [incidentPlace]);

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

    dispatch(
      getIncidentPlaceActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
      }),
    );
  }, [dispatch, trendSelected]);

  return (
    <div className={cx(styles.containerWrapper, styles.firstRow)}>
      <TrendOfTimeFilter
        title={t('title.incidentPlace')}
        dateSelected={trendSelected}
        onChangeFilter={(date) => setTimeTrendSelected(date)}
      />

      <div className={cx(styles.chartDoughnut, '')}>
        <DoughnutChartNoSort
          isHorizon
          isChartCenter
          data={dataChart}
          styleChartDoughnut={styles.styleChartDoughnut}
          styleChartInfo={styles.styleChartInfo}
          marginOnChart={false}
        />
      </div>
    </div>
  );
};

export default IncidentPlace;
