import Table, { ColumnsType } from 'antd/lib/table';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVesselSummaryRiskAnalysisApi } from 'pages/vessel-screening/utils/api/summary.api';
import { useSelector } from 'react-redux';
import { TAB_REFERENCE } from 'pages/vessel-screening/utils/constant';
import { toastError } from 'helpers/notification.helper';
import { VesselSummaryRiskAnalysisResponse } from 'pages/vessel-screening/utils/models/summary.model';
import isNil from 'lodash/isNil';
import BadgeRisk from '../../../components/risk-badge/RiskBadge';
import styles from './detail-risk-analysis.module.scss';

export const DetailRiskAnalysis = () => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );
  const [riskAnalysisData, setRiskAnalysisData] =
    useState<VesselSummaryRiskAnalysisResponse[]>(null);

  const checkLongestRiskNumber = useMemo(() => {
    let totalPotential = 0;
    let totalObservedScore = 0;
    riskAnalysisData?.forEach((item, index) => {
      const totalPotentialScore = Number(
        item?.data?.reduce((a, b) => a + b.potentialScore, 0) /
          item?.data?.length,
      )?.toFixed(2);
      const totalObservedScoreScore = Number(
        item?.data?.reduce((a, b) => a + b.observedScore, 0) /
          item?.data?.length,
      )?.toFixed(2);
      if (
        String(totalPotentialScore)?.length > String(totalPotential)?.length
      ) {
        totalPotential = Number(totalPotentialScore);
      }
      if (
        String(totalObservedScoreScore)?.length >
        String(totalObservedScore)?.length
      ) {
        totalObservedScore = Number(totalObservedScoreScore);
      }
    });
    return { totalPotential, totalObservedScore };
  }, [riskAnalysisData]);

  const columnsModal: ColumnsType = useMemo(
    () => [
      {
        title: t('summary.sno'),
        dataIndex: 'sno',
        key: 'sno',
        width: 50,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      {
        title: t('summary.module'),
        dataIndex: 'module',
        key: 'module',
        width: 100,
        render: (text) => (
          <div className="d-flex justify-content-between align-items-center">
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
            {/* <img src={images.icons.icWarning} alt="warning" /> */}
          </div>
        ),
      },
      {
        title: t('labels.reviewStatus'),
        dataIndex: 'status',
        key: 'status',
        width: 90,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      {
        title: t('labels.potentialRisk'),
        dataIndex: 'potentialScore',
        key: 'potentialRisk',
        width: 110,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            <div className={styles.wrapBadge}>
              <BadgeRisk
                range={
                  text === '-' ? '-' : Number(Number(text || 0)?.toFixed(2))
                }
                largestNumber={Number(
                  checkLongestRiskNumber?.totalPotential || 0,
                )}
              />
            </div>
          </span>
        ),
      },
      {
        title: t('labels.observedRisk'),
        dataIndex: 'observedScore',
        key: 'observedRisk',
        width: 115,
        render: (text, record: any) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            <div className={styles.wrapBadge}>
              <BadgeRisk
                range={
                  text === '-' ? '-' : Number(Number(text || 0)?.toFixed(2))
                }
                largestNumber={Number(
                  checkLongestRiskNumber?.totalObservedScore || 0,
                )}
              />
            </div>
          </span>
        ),
      },
      {
        title: t('labels.timeLoss'),
        dataIndex: 'timeLoss',
        key: 'timeLoss',
        width: 70,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
    ],
    [checkLongestRiskNumber, t],
  );

  const dataSource = useMemo(
    () =>
      riskAnalysisData?.map((item, index) => {
        let timeLoss = '-';
        let potentialScore = 0;
        let observedScore = 0;
        const isEmptyPotentialScore = item?.data?.every((item) =>
          isNil(item?.potentialScore),
        );
        const isEmptyObservedScore = item?.data?.every((item) =>
          isNil(item?.observedScore),
        );

        item?.data?.forEach((element) => {
          if (!isNil(element?.timeLoss)) {
            timeLoss = element?.timeLoss ? 'Yes' : 'No';
          }
          potentialScore += element?.potentialScore;
          observedScore += element?.observedScore;
        });

        potentialScore /= item?.data?.length;
        observedScore /= item?.data?.length;

        return {
          sno: index + 1,
          module: item?.tabName,
          status: item?.data?.[0]?.reviewStatus ?? '-',
          potentialScore: isEmptyPotentialScore ? '-' : potentialScore,
          observedScore: isEmptyObservedScore ? '-' : observedScore,
          timeLoss,
        };
      }),
    [riskAnalysisData],
  );

  const getRiskAnalysisData = useCallback(async () => {
    if (vesselScreeningDetail?.id) {
      try {
        const { data } = await getVesselSummaryRiskAnalysisApi({
          vesselScreeningId: vesselScreeningDetail?.id,
        });
        setRiskAnalysisData(
          data
            ?.map((item) =>
              item?.tabName === TAB_REFERENCE.PILOT_TERMINAL_FEEDBACK
                ? { ...item, tabName: TAB_REFERENCE.PILOT_FEEDBACK }
                : item,
            )
            ?.filter(
              (item) => item?.tabName !== TAB_REFERENCE.SAFETY_ENGAGEMENT,
            ),
        );
      } catch (error) {
        toastError(error);
      }
    }
  }, [vesselScreeningDetail?.id]);

  useEffect(() => {
    getRiskAnalysisData();
  }, [getRiskAnalysisData]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('summary.detailedRiskAnalysis')}</div>
      <Table
        columns={columnsModal}
        className={styles.tableWrapper}
        dataSource={dataSource}
        scroll={{ x: 300 }}
        pagination={false}
        rowClassName={styles.rowWrapper}
        locale={{ emptyText: 'No data' }}
      />
    </div>
  );
};
