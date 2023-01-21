import { I18nNamespace } from 'constants/i18n.const';
import { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SelectUI from 'components/ui/select/Select';
import { DoughnutChartNoSort } from 'components/common/chart/doughnut-chart/DoughnutChartNoSort';

import {
  RISK_SCORE_VALUE,
  RISK_VALUE,
} from 'pages/vessel-screening/utils/constant';
import styles from '../detail.module.scss';
import { getRiskDetailsActions } from '../../store/action';

const RiskDetails = () => {
  const { t } = useTranslation(I18nNamespace.INCIDENTS);
  const dispatch = useDispatch();

  const { riskDetails } = useSelector((state) => state.incidents);
  const [totalRisk, setTotalRisk] = useState<string>('potential');

  const convertName = useCallback((value: number) => {
    switch (value) {
      case RISK_VALUE.NEGLIGIBLE:
      case RISK_SCORE_VALUE.NEGLIGIBLE:
        return 'Negligible risk';
      case RISK_VALUE.LOW:
      case RISK_SCORE_VALUE.LOW:
        return 'Low risk';
      case RISK_VALUE.MEDIUM:
      case RISK_SCORE_VALUE.MEDIUM:
        return 'Medium risk';
      case RISK_VALUE.HIGH:
      case RISK_SCORE_VALUE.HIGH:
        return 'High risk';
      default:
        return '';
    }
  }, []);

  const convertColor = useCallback((value: number) => {
    switch (value) {
      case RISK_VALUE.NEGLIGIBLE:
      case RISK_SCORE_VALUE.NEGLIGIBLE:
        return '#3b9ff3';
      case RISK_VALUE.LOW:
      case RISK_SCORE_VALUE.LOW:
        return '#35EBBD';
      case RISK_VALUE.MEDIUM:
      case RISK_SCORE_VALUE.MEDIUM:
        return '#FFE165';
      case RISK_VALUE.HIGH:
      case RISK_SCORE_VALUE.HIGH:
        return '#FF7D1A';
      default:
        return '';
    }
  }, []);

  const dataChart = useMemo(() => {
    const data = riskDetails?.map((i) => ({
      name: convertName(i?.risk),
      color: convertColor(i?.risk),
      value: i?.count,
    }));
    return data;
  }, [convertColor, convertName, riskDetails]);

  useEffect(() => {
    const priorDate = moment().add(-30, 'days');

    dispatch(
      getRiskDetailsActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
        filterRisk: 'potential',
      }),
    );
  }, [dispatch]);

  return (
    <div className={cx(styles.containerWrapper, styles.secondRow)}>
      <div className="d-flex justify-content-between align-items-center">
        <div className={cx(styles.title)}>{t('title.riskDetails')}</div>
        <div className="d-flex ">
          <SelectUI
            data={[
              {
                value: 'potential',
                label: 'Potential Risk',
              },
              {
                value: 'observed',
                label: 'Observed risk',
              },
            ]}
            className={cx('input-select', styles.selectInput)}
            onChange={(e: string) => {
              const priorDate = moment().add(-30, 'days');
              setTotalRisk(e);
              dispatch(
                getRiskDetailsActions.request({
                  fromDate: priorDate.toISOString(),
                  toDate: moment().toISOString(),
                  filterRisk: e || 'potential',
                }),
              );
            }}
            value={totalRisk}
          />
        </div>
      </div>
      <div className={cx(styles.chartDoughnutSecond, '')}>
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

export default RiskDetails;
