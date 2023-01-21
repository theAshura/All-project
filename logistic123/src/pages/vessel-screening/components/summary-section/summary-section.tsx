import { I18nNamespace } from 'constants/i18n.const';
import { FeedbackAndRemarks } from 'pages/vessel-screening/forms/summary/components/FeedbackAndRemarks';
import { useTranslation } from 'react-i18next';
// import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import cx from 'classnames';
// import images from 'assets/images/images';
import { DoughnutChartNoSort } from 'components/common/chart/doughnut-chart/DoughnutChartNoSort';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  clearAttachmentAndRemarksReducer,
  getSummaryByTabActions,
  getVesselSummaryActions,
} from 'pages/vessel-screening/store/vessel-summary.action';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { RiskAndReview } from 'pages/vessel-screening/utils/models/summary.model';
import { RISK_LEVEL } from 'pages/vessel-screening/utils/constant';
import { getRisk } from 'pages/vessel-screening/utils/functions';
import { financial } from 'helpers/utils.helper';
import { WebServices } from 'pages/vessel-screening/forms/summary/components/WebServices';
import isNil from 'lodash/isNil';
import { updateVesselScreeningReviewStatusApi } from 'pages/vessel-screening/utils/api/summary.api';
import styles from './summary-section.module.scss';
import { TableAttachment } from '../table-attachment/Attachment';
import { REVIEW_STATUSES } from '../object-review/object-review';

interface IProps {
  tabName?: string;
  tables: string[];
  isReverted?: boolean;
}

const REVIEW_STATUS_DICTIONARY = [
  {
    name: REVIEW_STATUSES.OPEN,
    color: '#BBBABF',
  },
  {
    name: REVIEW_STATUSES.INPROGRESS,
    color: '#3B9FF3',
    value: 6,
  },
  {
    name: REVIEW_STATUSES.COMPLETED,
    color: '#35EBBD',
  },
  {
    name: REVIEW_STATUSES.PENDING_INFO,
    color: '#FF9F0A',
  },
  {
    name: REVIEW_STATUSES.DISAPPROVED,
    color: '#E9453A',
  },
];

const ABOVE_REVIEW_STATUSES = {
  ACCEPT: 'Accept',
  IN_PROGRESS: 'In progress',
  REJECT: 'Reject',
};

const reviewStatusOptions = [
  {
    value: ABOVE_REVIEW_STATUSES.ACCEPT,
    label: ABOVE_REVIEW_STATUSES.ACCEPT,
  },
  {
    value: ABOVE_REVIEW_STATUSES.IN_PROGRESS,
    label: ABOVE_REVIEW_STATUSES.IN_PROGRESS,
  },
  { value: ABOVE_REVIEW_STATUSES.REJECT, label: ABOVE_REVIEW_STATUSES.REJECT },
];

const SummarySection = memo(({ tabName, tables, isReverted }: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const [attachments, setAttachments] = useState([]);
  const { vesselScreeningDetail } = useSelector(
    (store) => store.vesselScreening,
    shallowEqual,
  );
  const { summary, summaryByTab } = useSelector(
    (store) => store.vesselSummary,
    shallowEqual,
  );

  const scores = useMemo(() => {
    let potential = 0;
    let observed = 0;
    let timeLoss = 'No';
    let nullistTimeLoss = true;
    let nullistPotential = true;
    let nullistObserved = true;
    const numberOfRecords = summaryByTab?.riskAndReview?.length;

    summaryByTab?.riskAndReview?.forEach((item: RiskAndReview) => {
      potential += item?.potentialScore ?? 0;
      observed += item?.observedScore ?? 0;
      if (!isNil(item?.timeLoss)) {
        nullistTimeLoss = false;
      }
      if (!isNil(item?.potentialScore)) {
        nullistPotential = false;
      }
      if (!isNil(item?.observedScore)) {
        nullistObserved = false;
      }
      if (item?.timeLoss) {
        timeLoss = 'Yes';
      }
    });

    potential = numberOfRecords ? potential / numberOfRecords : 0;
    observed = numberOfRecords ? observed / numberOfRecords : 0;

    timeLoss = nullistTimeLoss ? '-' : timeLoss;
    potential = nullistPotential ? null : potential;
    observed = nullistObserved ? null : observed;

    return {
      potential,
      observed,
      timeLoss,
      potentialLabel: getRisk(potential),
      observedLabel: getRisk(observed),
    };
  }, [summaryByTab?.riskAndReview]);

  const handleChangeReviewStatus = useCallback(
    async (value) => {
      const data = {
        vesselScreeningId: vesselScreeningDetail?.id,
        tabName,
        reviewStatus: value,
      };

      try {
        await updateVesselScreeningReviewStatusApi(data);
        dispatch(
          getVesselSummaryActions.request({
            vesselId: vesselScreeningDetail?.id,
            reference: tables[0],
          }),
        );
        toastSuccess('You have updated successfully');
      } catch (e) {
        toastError(e?.message);
      }
    },
    [dispatch, tabName, tables, vesselScreeningDetail?.id],
  );

  const handleChangeAttachments = useCallback((value) => {
    setAttachments(value);
  }, []);

  const getSummarySectionByTab = useCallback(() => {
    if (tabName && vesselScreeningDetail?.id) {
      dispatch(
        getSummaryByTabActions.request({
          vesselScreeningId: vesselScreeningDetail?.id,
          tabName,
        }),
      );
    }
  }, [dispatch, tabName, vesselScreeningDetail?.id]);

  useEffect(() => {
    getSummarySectionByTab();
    return () => {
      dispatch(clearAttachmentAndRemarksReducer());
    };
  }, [getSummarySectionByTab, dispatch]);

  const reviewStatusChartData = useMemo(() => {
    const result = REVIEW_STATUS_DICTIONARY.map((item) => {
      let value = 0;
      tables?.forEach((tableName: string) => {
        if (item.name === summary?.[tableName]?.status) {
          value += 1;
        }
      });
      return {
        ...item,
        value,
      };
    });
    return result;
  }, [summary, tables]);

  return (
    <div className={styles.wrapper}>
      <div className="d-flex justify-content-between align-items-center">
        <div className={styles.title}>{t('summary.summarySection')}</div>
        {/* <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Outline}
          className="button_print"
          renderSuffix={
            <img
              src={images.icons.icPrint}
              alt="print"
              className={styles.icButton}
            />
          }
        >
          {t('buttons.printPDF')} &nbsp;&nbsp;
        </Button> */}
      </div>
      <div className={cx('mt-4 mb-2', styles.divider)} />

      <div className={styles.riskManagerWrap}>
        <div className={styles.title}>{t('summary.riskManagement')}</div>
        <div className="mt-3 mb-2 d-flex">
          <div className={styles.subTitle}>{t('labels.potentialRisk')}: </div>
          <div className="d-flex">
            {!isNil(scores?.potential) ? (
              <>
                <div
                  className={cx(styles.riskTitle, {
                    [styles.negligible]:
                      scores?.potentialLabel === RISK_LEVEL.NEGLIGIBLE,
                    [styles.low]: scores?.potentialLabel === RISK_LEVEL.LOW,
                    [styles.medium]:
                      scores?.potentialLabel === RISK_LEVEL.MEDIUM,
                    [styles.high]: scores?.potentialLabel === RISK_LEVEL.HIGH,
                  })}
                >
                  {scores?.potentialLabel}
                </div>
                <div
                  className={cx(styles.riskBox, {
                    [styles.negligibleColor]:
                      scores?.potentialLabel === RISK_LEVEL.NEGLIGIBLE,
                    [styles.lowColor]:
                      scores?.potentialLabel === RISK_LEVEL.LOW,
                    [styles.mediumColor]:
                      scores?.potentialLabel === RISK_LEVEL.MEDIUM,
                    [styles.highColor]:
                      scores?.potentialLabel === RISK_LEVEL.HIGH,
                  })}
                >
                  {financial(scores?.potential)}
                </div>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className="mb-2 d-flex">
          <div className={styles.subTitle}>{t('labels.observedRisk')}: </div>
          <div className="d-flex">
            {!isNil(scores?.observed) ? (
              <>
                <div
                  className={cx(styles.riskTitle, {
                    [styles.negligible]:
                      scores?.observedLabel === RISK_LEVEL.NEGLIGIBLE,
                    [styles.low]: scores?.observedLabel === RISK_LEVEL.LOW,
                    [styles.medium]:
                      scores?.observedLabel === RISK_LEVEL.MEDIUM,
                    [styles.high]: scores?.observedLabel === RISK_LEVEL.HIGH,
                  })}
                >
                  {scores?.observedLabel}
                </div>
                <div
                  className={cx(styles.riskBox, {
                    [styles.negligibleColor]:
                      scores?.observedLabel === RISK_LEVEL.NEGLIGIBLE,
                    [styles.lowColor]: scores?.observedLabel === RISK_LEVEL.LOW,
                    [styles.mediumColor]:
                      scores?.observedLabel === RISK_LEVEL.MEDIUM,
                    [styles.highColor]:
                      scores?.observedLabel === RISK_LEVEL.HIGH,
                  })}
                >
                  {financial(scores?.observed)}
                </div>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className="mb-2 d-flex">
          <div className={styles.subTitle}>{t('labels.timeLoss')}: </div>
          <div
            className={cx(styles.timeloss, {
              [styles.yes]: scores?.timeLoss === 'Yes',
              [styles.no]: scores?.timeLoss === 'No',
            })}
          >
            {scores?.timeLoss}
          </div>
        </div>
      </div>
      <div className={cx('mt-2 mb-3', styles.divider)} />

      <div>
        <div className={styles.title}>{t('summary.reviewStatus1')}</div>
        <RadioForm
          className={cx(styles.reviewStatus1)}
          radioOptions={reviewStatusOptions}
          onChange={handleChangeReviewStatus}
          value={summary?.[tables[0]]?.reviewStatus || null}
        />
      </div>
      <div className={cx('mt-3 mb-3', styles.divider)} />

      <div>
        <div className={styles.title}>{t('summary.reviewStatus2')}</div>
        <DoughnutChartNoSort
          isHorizon
          isChartCenter
          data={reviewStatusChartData}
          styleChartDoughnut={styles.styleChartDoughnut}
          styleChartInfo={styles.styleChartInfo}
          hasValue={false}
          hasProgress={false}
        />
      </div>
      <div className={cx('mt-3 mb-3', styles.divider)} />
      <WebServices tabName={tabName} />
      <div className={cx('mt-3 mb-3', styles.divider)} />

      <TableAttachment
        scrollVerticalAttachment
        value={attachments}
        buttonName="Attach"
        onchange={handleChangeAttachments}
        tabName={tabName}
        getSummarySection={getSummarySectionByTab}
        isEdit
        featurePage={Features.QUALITY_ASSURANCE}
        subFeaturePage={SubFeatures.VESSEL_SCREENING}
      />

      <FeedbackAndRemarks
        className={styles.feedbackAndRemarks}
        tabName={tabName}
        getSummarySection={getSummarySectionByTab}
      />
    </div>
  );
});

export default SummarySection;
