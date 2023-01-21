import Button, { ButtonType } from 'components/ui/button/Button';
import { I18nNamespace } from 'constants/i18n.const';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import SelectUI from 'components/ui/select/Select';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DoughnutChartNoSort } from 'components/common/chart/doughnut-chart/DoughnutChartNoSort';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import {
  getInspectionPerPortActions,
  getInspectionPerTypeActions,
  getNumberIncidentsPerPortActions,
  getNumberOfIncidentsByPotentialRiskActions,
  getNumberOfIncidentsByTypeActions,
} from 'store/dashboard/dashboard.action';
import { getPilotFeedbackStatusActions } from 'pages/pilot-terminal-feedback/store/action';
import { randomColor } from 'helpers/utils.helper';
import {
  IncidentsChartType,
  VesselScreeningPotentialRiskEnum,
} from 'components/dashboard/master/components/incidents-overview/incidents-overview.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../detail.module.scss';
import { getReviewStatusActions } from '../../store/action';
import { ChartDataType } from '../number-incidents';

interface ReviewStatusProps {
  dropdown?: boolean;
  isVertical?: boolean;
  height?: number | string;
  width?: number;
  legendTop?: number;
  title?: string;
  fullHeight?: boolean;
  containerClassName?: string;
  type?: string;
  scrollableClass?: string;
  alignItemBetween?: boolean;
  displayChartMargin?: boolean;
  customClassTitle?: string;
  dynamicLabels?: IDynamicLabel;
}

const colorChart = ['#BBBABF', '#FFE165', '#0091E2', '#35EBBD'];

const ReviewStatus: FC<ReviewStatusProps> = ({
  dropdown,
  isVertical,
  height,
  width,
  legendTop,
  title,
  fullHeight,
  containerClassName,
  type = ChartDataType.INCIDENTS,
  scrollableClass,
  alignItemBetween = false,
  displayChartMargin = true,
  customClassTitle,
  dynamicLabels,
}) => {
  const { t } = useTranslation(I18nNamespace.INCIDENTS);
  const dispatch = useDispatch();

  const { reviewStatus } = useSelector((state) => state.incidents);
  const { listPilotFeedbackStatus } = useSelector(
    (state) => state.pilotTerminalFeedback,
  );

  const {
    inspectionPerType,
    inspectionPerPort,
    numberIncidentsPerPort,
    incidentsPotentialRisk,
    incidentsByType,
  } = useSelector((store) => store.dashboard);

  const [trendSelected, setTimeTrendSelected] = useState<TrendOfTime>(
    TrendOfTime.M,
  );

  const sortedIncidentsPotentialRisk = useCallback(
    () =>
      incidentsPotentialRisk?.numberOfIncidentsByPotentialRisk?.sort(
        (a, b) => Number(a.potentialRisk) - Number(b.potentialRisk),
      ),
    [incidentsPotentialRisk?.numberOfIncidentsByPotentialRisk],
  );

  const convertedReviewStatus = useMemo(() => {
    const status = [reviewStatus?.[reviewStatus?.length - 1]];
    return status?.concat(reviewStatus?.slice(0, reviewStatus?.length - 1));
  }, [reviewStatus]);

  const convertPotentialRisk = useCallback((potentialRisk: number) => {
    switch (potentialRisk) {
      case 0:
        return {
          label: VesselScreeningPotentialRiskEnum.NEGLIGIBLE,
          color: '#3B9FF3',
        };
      case 10:
        return {
          label: VesselScreeningPotentialRiskEnum.LOW,
          color: '#18BA92',
        };
      case 20:
        return {
          label: VesselScreeningPotentialRiskEnum.MEDIUM,
          color: '#FFB800',
        };
      case 30:
        return {
          label: VesselScreeningPotentialRiskEnum.HIGH,
          color: '#F53E3E',
        };
      default:
        return {
          label: VesselScreeningPotentialRiskEnum.UNASSIGNED,
          color: '#BBBABF',
        };
    }
  }, []);

  const dataChart = useMemo(() => {
    switch (type) {
      case ChartDataType.INCIDENTS:
        return convertedReviewStatus?.map((i, index) => ({
          name: i?.reviewStatus || 'Unassigned',
          color: colorChart?.[index],
          value: Number(i?.total),
        }));
      case ChartDataType.PILOT_FEEDBACK:
        return listPilotFeedbackStatus?.map((item) => ({
          name: item?.status || '',
          color: item?.status === 'Draft' ? colorChart[1] : colorChart[2],
          value: Number(item?.total) || 0,
        }));
      case ChartDataType.INSPECTION_CASES_PER_TYPE:
        return inspectionPerType?.map((item) => ({
          name: item?.name || '',
          color: randomColor(),
          value: item?.count || 0,
        }));
      case ChartDataType.INSPECTION_CASES_PER_PORT:
        return inspectionPerPort?.map((item) => ({
          name: item?.name || '',
          color: randomColor(),
          value: item?.count || 0,
        }));
      case IncidentsChartType.NUMBER_OF_INCIDENTS_PER_PORT:
        return numberIncidentsPerPort?.numberOfIncidentsPerPort?.map(
          (item) => ({
            name: item?.portName || '',
            color: randomColor(),
            value: item?.total || '',
          }),
        );
      case IncidentsChartType.INCIDENT_BASIC_POTENTIAL_RISK:
        return sortedIncidentsPotentialRisk()?.map((item) => ({
          name: convertPotentialRisk(item?.potentialRisk).label,
          color: convertPotentialRisk(item?.potentialRisk).color,
          value: item?.total || '',
        }));
      case IncidentsChartType.TYPE_OF_INCIDENTS:
        return incidentsByType?.numberOfIncidentsByType?.map((item) => ({
          name: item?.incidentTypeName || '',
          color: randomColor(),
          value: item?.total || '',
        }));
      default:
        return [];
    }
  }, [
    type,
    convertedReviewStatus,
    listPilotFeedbackStatus,
    inspectionPerType,
    inspectionPerPort,
    numberIncidentsPerPort?.numberOfIncidentsPerPort,
    sortedIncidentsPotentialRisk,
    incidentsByType?.numberOfIncidentsByType,
    convertPotentialRisk,
  ]);

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

    const dateObj = {
      fromDate: priorDate.toISOString(),
      toDate: moment().toISOString(),
    };

    switch (type) {
      case ChartDataType.INCIDENTS:
        dispatch(getReviewStatusActions.request(dateObj));
        break;
      case ChartDataType.PILOT_FEEDBACK:
        dispatch(getPilotFeedbackStatusActions.request(dateObj));
        break;
      case ChartDataType.INSPECTION_CASES_PER_TYPE:
        dispatch(getInspectionPerTypeActions.request(dateObj));
        break;
      case ChartDataType.INSPECTION_CASES_PER_PORT:
        dispatch(getInspectionPerPortActions.request(dateObj));
        break;
      case IncidentsChartType.NUMBER_OF_INCIDENTS_PER_PORT:
        dispatch(getNumberIncidentsPerPortActions.request(dateObj));
        break;
      case IncidentsChartType.INCIDENT_BASIC_POTENTIAL_RISK:
        dispatch(getNumberOfIncidentsByPotentialRiskActions.request(dateObj));
        break;
      case IncidentsChartType.TYPE_OF_INCIDENTS:
        dispatch(getNumberOfIncidentsByTypeActions.request(dateObj));
        break;
      default:
        break;
    }
  }, [dispatch, trendSelected, type]);

  return (
    <div
      className={cx(
        styles.containerWrapper,
        styles.secondRow,
        fullHeight && styles.fullHeight,
      )}
    >
      <div className={cx('d-flex justify-content-between align-items-center')}>
        <div className={cx(styles.title, customClassTitle)}>
          {title || t('title.reviewStatus')}
        </div>
        {dropdown ? (
          <SelectUI
            data={[
              {
                label: `1 ${renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.week,
                )}`,
                value: TrendOfTime.W,
              },
              {
                label: `1 ${renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.month,
                )}`,
                value: TrendOfTime.M,
              },
              {
                label: `3 ${renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.months,
                )}`,
                value: TrendOfTime.M3,
              },
              {
                label: `1 ${renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.year,
                )}`,
                value: TrendOfTime.Y,
              },
            ]}
            value={trendSelected}
            onChange={(value: TrendOfTime) => setTimeTrendSelected(value)}
            notAllowSortData
          />
        ) : (
          <div className="d-flex ">
            <Button
              className={styles.btnChart}
              buttonType={
                trendSelected === TrendOfTime.W
                  ? ButtonType.BlueChart
                  : ButtonType.CancelOutline
              }
              onClick={() => setTimeTrendSelected(TrendOfTime.W)}
            >
              1W
            </Button>
            <Button
              className={styles.btnChart}
              buttonType={
                trendSelected === TrendOfTime.M
                  ? ButtonType.BlueChart
                  : ButtonType.CancelOutline
              }
              onClick={() => setTimeTrendSelected(TrendOfTime.M)}
            >
              1M
            </Button>
            <Button
              className={styles.btnChart}
              buttonType={
                trendSelected === TrendOfTime.M3
                  ? ButtonType.BlueChart
                  : ButtonType.CancelOutline
              }
              onClick={() => setTimeTrendSelected(TrendOfTime.M3)}
            >
              3M
            </Button>
            <Button
              className={styles.btnChart}
              buttonType={
                trendSelected === TrendOfTime.Y
                  ? ButtonType.BlueChart
                  : ButtonType.CancelOutline
              }
              onClick={() => setTimeTrendSelected(TrendOfTime.Y)}
            >
              1Y
            </Button>
          </div>
        )}
      </div>
      <div className={cx('pt-2', fullHeight && styles.height100percent)}>
        <DoughnutChartNoSort
          isHorizon={!isVertical}
          isChartCenter
          data={dataChart}
          styleChartDoughnut={styles.styleChartDoughnut}
          styleChartInfo={cx(styles.styleChartInfo, scrollableClass)}
          width={width}
          height={height}
          legendTop={legendTop}
          className={containerClassName}
          alignItemBetween={alignItemBetween}
          marginOnChart={displayChartMargin}
        />
      </div>
    </div>
  );
};

export default ReviewStatus;
