import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import SelectUI from 'components/ui/select/Select';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';
import LabelUI from 'components/ui/label/LabelUI';
import {
  RISK_FIELD,
  RISK_LEVEL,
  RISK_VALUE_TO_LEVEL,
} from 'pages/vessel-screening/utils/constant';
import styles from './object-review.module.scss';

export const REVIEW_STATUSES = {
  OPEN: 'Open',
  COMPLETED: 'Completed',
  INPROGRESS: 'In progress',
  PENDING_INFO: 'Pending Info',
  DISAPPROVED: 'Disapproved',
};

export interface IOnChangeParams {
  table: string;
  field: string;
  value: string | number;
  tab: string;
}

interface IProps {
  table?: string;
  tab?: string;
  onChange?: (params: IOnChangeParams) => void;
  showOnly?: boolean;
  className?: string;
  cellClassName?: string;
}

const ObjectReview = memo(
  ({ table, onChange, showOnly, tab, className, cellClassName }: IProps) => {
    const { t } = useTranslation([
      I18nNamespace.VESSEL_SCREENING,
      I18nNamespace.COMMON,
    ]);
    const { summary } = useSelector(
      (store) => store.vesselSummary,
      shallowEqual,
    );

    const reviewStatusOptions = useMemo(
      () => [
        {
          label: t('open'),
          value: REVIEW_STATUSES.OPEN,
        },
        {
          label: t('inprogress'),
          value: REVIEW_STATUSES.INPROGRESS,
        },
        {
          label: t('completed'),
          value: REVIEW_STATUSES.COMPLETED,
        },
        {
          label: t('pendingInfo'),
          value: REVIEW_STATUSES.PENDING_INFO,
        },
        {
          label: t('disapproved'),
          value: REVIEW_STATUSES.DISAPPROVED,
        },
      ],
      [t],
    );

    const risksOptions = useMemo(
      () => [
        {
          label: <span className={styles.negligible}>{t('negligibleTx')}</span>,
          value: RISK_LEVEL.NEGLIGIBLE,
        },
        {
          label: <span className={styles.low}>{t('lowTx')}</span>,
          value: RISK_LEVEL.LOW,
        },
        {
          label: <span className={styles.medium}>{t('mediumTx')}</span>,
          value: RISK_LEVEL.MEDIUM,
        },
        {
          label: <span className={styles.high}>{t('highTx')}</span>,
          value: RISK_LEVEL.HIGH,
        },
      ],
      [t],
    );

    const timelossOptions = useMemo(
      () => [
        {
          label: <span className={styles.yesValue}>{t('Yes')}</span>,
          value: 1,
        },
        {
          label: <span className={styles.noValue}>{t('No')}</span>,
          value: 0,
        },
      ],
      [t],
    );

    const handleChangeReviewStatus = useCallback(
      (value) => {
        onChange?.({
          tab,
          table,
          field: RISK_FIELD.STATUS,
          value,
        });
      },
      [onChange, tab, table],
    );

    const handleChangePotentialRisk = useCallback(
      (value) => {
        onChange?.({
          tab,
          table,
          field: RISK_FIELD.POTENTIAL_RISK,
          value,
        });
      },
      [onChange, tab, table],
    );

    const handleChangeObservedRisk = useCallback(
      (value) => {
        onChange?.({
          tab,
          table,
          field: RISK_FIELD.OBSERVED_RISK,
          value,
        });
      },
      [onChange, tab, table],
    );

    const handleChangeTimeloss = useCallback(
      (value) => {
        onChange?.({
          tab,
          table,
          field: RISK_FIELD.TIMELOSS,
          value,
        });
      },
      [onChange, tab, table],
    );

    const renderPotentialRisk = useMemo(() => {
      const originValue = RISK_VALUE_TO_LEVEL[summary?.[table]?.potentialRisk];
      if (showOnly) {
        return (
          <>
            <LabelUI
              label={t('labels.potentialRisk')}
              className={styles.label}
            />
            <div
              className={cx(styles.valueShowOnly, {
                [styles.negligible]: originValue === RISK_LEVEL.NEGLIGIBLE,
                [styles.low]: originValue === RISK_LEVEL.LOW,
                [styles.medium]: originValue === RISK_LEVEL.MEDIUM,
                [styles.high]: originValue === RISK_LEVEL.HIGH,
              })}
            >
              {originValue?.toLowerCase() ?? '-'}
            </div>
          </>
        );
      }
      return (
        <SelectUI
          labelSelect={t('labels.potentialRisk')}
          styleLabel={styles.label}
          data={risksOptions}
          id="potentialRisk"
          name="potentialRisk"
          className="w-100"
          value={originValue ?? null}
          onChange={handleChangePotentialRisk}
          dropdownClassName={styles.showOnly}
        />
      );
    }, [handleChangePotentialRisk, risksOptions, showOnly, summary, t, table]);

    const renderObservedRisk = useMemo(() => {
      const originValue = RISK_VALUE_TO_LEVEL[summary?.[table]?.observedRisk];
      if (showOnly) {
        return (
          <>
            <LabelUI
              label={t('labels.observedRisk')}
              className={styles.label}
            />
            <div
              className={cx(styles.valueShowOnly, {
                [styles.negligible]: originValue === RISK_LEVEL.NEGLIGIBLE,
                [styles.low]: originValue === RISK_LEVEL.LOW,
                [styles.medium]: originValue === RISK_LEVEL.MEDIUM,
                [styles.high]: originValue === RISK_LEVEL.HIGH,
              })}
            >
              {originValue?.toLowerCase() ?? '-'}
            </div>
          </>
        );
      }
      return (
        <SelectUI
          labelSelect={t('labels.observedRisk')}
          styleLabel={styles.label}
          data={risksOptions}
          id="observedRisk"
          name="observedRisk"
          className="w-100"
          value={originValue ?? null}
          onChange={handleChangeObservedRisk}
        />
      );
    }, [handleChangeObservedRisk, risksOptions, showOnly, summary, t, table]);

    const renderTimeLoss = useMemo(() => {
      if (showOnly) {
        let value = '-';
        if (!isNil(summary?.[table]?.timeLoss)) {
          value = summary?.[table]?.timeLoss ? t('yes') : t('no');
        }

        return (
          <>
            <LabelUI label={t('labels.timeLoss')} className={styles.label} />
            <div
              className={cx(styles.valueShowOnly, {
                [styles.yesValue]: value === 'Yes',
                [styles.noValue]: value === 'No',
              })}
            >
              {value ?? '-'}
            </div>
          </>
        );
      }

      let dropdownValue = null;
      if (!isNil(summary?.[table]?.timeLoss)) {
        dropdownValue = summary?.[table]?.timeLoss ? 1 : 0;
      }
      return (
        <SelectUI
          labelSelect={t('labels.timeLoss')}
          styleLabel={styles.label}
          data={timelossOptions}
          id="timeLoss"
          name="timeLoss"
          className="w-100"
          value={dropdownValue}
          onChange={handleChangeTimeloss}
        />
      );
    }, [handleChangeTimeloss, showOnly, summary, t, table, timelossOptions]);

    return (
      <div className={cx(styles.container, className)}>
        <div className={cx(styles.cell, cellClassName)}>
          <SelectUI
            labelSelect={t('basicInfo.reviewStatus')}
            styleLabel={styles.label}
            data={reviewStatusOptions}
            id="reviewStatus"
            name="reviewStatus"
            className="w-100"
            value={summary?.[table]?.status || null}
            onChange={handleChangeReviewStatus}
            notAllowSortData
          />
        </div>
        <div className={cx(styles.cell, cellClassName)}>
          {renderPotentialRisk}
        </div>
        <div className={cx(styles.cell, cellClassName)}>
          {renderObservedRisk}
        </div>
        <div className={cx(styles.cell, cellClassName)}>{renderTimeLoss}</div>
      </div>
    );
  },
);

export default ObjectReview;
