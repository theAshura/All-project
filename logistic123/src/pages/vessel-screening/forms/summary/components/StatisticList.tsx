import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';
import { OverviewCard } from 'components/common/overview-card/OverviewCard';
import { useSelector } from 'react-redux';
import { getAverageScoreActionsApi } from 'pages/vessel-screening/utils/api/common.api';
import { useParams } from 'react-router';
import { toastError } from 'helpers/notification.helper';
import styles from './statistic-list.module.scss';
import { RiskRating } from './RiskRating';

interface Props {
  className?: string;
}

export const StatisticList: FC<Props> = ({ className }) => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const { id } = useParams<{ id: string }>();
  const [riskRating, setRiskRating] = useState();
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );
  const convertDataYesNo = useCallback((data: boolean) => {
    if (data === true) return 'Yes';

    return 'No';
  }, []);
  const convertStringRender = useCallback((currentPhrase) => {
    if (currentPhrase) {
      if (currentPhrase === 'None') {
        return 'N/A';
      }

      if (currentPhrase === 'True') {
        return 'Yes';
      }

      if (currentPhrase === 'No') {
        return 'No';
      }
      return currentPhrase;
    }

    return '';
  }, []);

  const colorByName = useCallback((name: string) => {
    if (name === 'Yes') {
      return '#F42829';
    }

    if (name === 'No') {
      return '#1BD2A4';
    }

    return '#34303E';
  }, []);

  const getListData = useCallback(async () => {
    try {
      const { data } = await getAverageScoreActionsApi(id);
      setRiskRating(data?.riskRating);
    } catch (error) {
      toastError(error);
    }
  }, [id]);
  useEffect(() => {
    getListData();
  }, [getListData]);

  return (
    <div className={cx(styles.container, className)}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className={styles.title}>{t('summary.overview')}</div>
        <div className="d-flex align-items-center mr-3">
          <span className={styles.vetting}>
            {t('summary.vettingTeamReviewer')}:
          </span>
          <div className={styles.statusVetting}>
            {vesselScreeningDetail?.reviewStatus || 'Open'}
          </div>
        </div>
      </div>
      <div className={styles.wrapInfo}>
        <div className={styles.wrapRisk}>
          <RiskRating
            title={t('summary.riskRating')}
            riskNumber={riskRating !== null ? Number(riskRating) : null}
            className={styles.riskRating}
          />
          <div className={styles.rowInfo}>
            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.safetyScore')}
                content={
                  convertStringRender(
                    vesselScreeningDetail?.rightShip?.safetyScore,
                  ) || 'N/A'
                }
                color="#F42829"
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.docScore')}
                content={
                  convertStringRender(
                    vesselScreeningDetail?.rightShip?.docSafetyScore,
                  ) || 'N/A'
                }
                color="#FFDE54"
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.hasOpenIncident')}
                content={
                  convertStringRender(vesselScreeningDetail?.hasOpenIncident) ||
                  'N/A'
                }
                color={colorByName(
                  convertStringRender(vesselScreeningDetail?.hasOpenIncident),
                )}
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.hasOpenInspection')}
                content={
                  convertStringRender(
                    vesselScreeningDetail?.hasOpenInspection,
                  ) || 'N/A'
                }
                color={colorByName(
                  convertStringRender(vesselScreeningDetail?.hasOpenInspection),
                )}
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.latestDateOfiIspection')}
                content={
                  vesselScreeningDetail?.rightShip?.lastInspectionValidity ||
                  'N/A'
                }
                color="#34303E"
                size={20}
                titleClassName={styles.card}
              />
            </div>
            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.sailSafetyInspection')}
                content="3/5(05/12/2021)"
                color="#F42829"
                size={20}
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.sailInspection')}
                content={riskRating !== null ? riskRating : '-'}
                color="#3B9FF3"
                size={20}
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.ghg')}
                content={
                  convertStringRender(
                    vesselScreeningDetail?.rightShip?.ghgRating,
                  ) || 'N/A'
                }
                color="#FFDE54"
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.accidentLast3Months')}
                content="No"
                color={colorByName('No')}
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.customerRestricted')}
                content={
                  convertDataYesNo(
                    vesselScreeningDetail?.vessel?.customerRestricted,
                  ) || 'N/A'
                }
                color={colorByName(
                  convertDataYesNo(
                    vesselScreeningDetail?.vessel?.customerRestricted,
                  ),
                )}
                titleClassName={styles.card}
              />
            </div>

            <div className={styles.colInfo}>
              <OverviewCard
                title={t('summary.blacklistOnWebsite')}
                content={
                  convertDataYesNo(
                    vesselScreeningDetail?.vessel?.blacklistOnMOUWebsite,
                  ) || '-'
                }
                color={colorByName(
                  convertDataYesNo(
                    vesselScreeningDetail?.vessel?.blacklistOnMOUWebsite,
                  ),
                )}
                titleClassName={styles.card}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
