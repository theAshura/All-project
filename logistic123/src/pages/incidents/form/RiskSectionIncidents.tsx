import { FC, useCallback } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import LabelUI from 'components/ui/label/LabelUI';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import {
  RISK_LEVEL,
  RISK_LEVEL_TO_SCORE,
} from 'pages/vessel-screening/utils/constant';
import styles from './form.module.scss';

interface RiskSectionIncidentsProps {
  isEdit: boolean;
  className?: string;
  potentialRiskDisabled?: boolean;
}

const RiskSectionIncidents: FC<RiskSectionIncidentsProps> = ({
  isEdit,
  className,
  potentialRiskDisabled,
}) => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const watchObservedRisk = watch('observedRisk');
  const watchPotentialRisk = watch('potentialRisk');

  const renderRisk = useCallback(
    (riskName: string, disabled?: boolean) => (
      <Controller
        control={control}
        name={riskName}
        render={({ field: { value, onChange }, fieldState }) => (
          <>
            <span
              onClick={() =>
                isEdit && !disabled ? onChange(RISK_LEVEL.NEGLIGIBLE) : null
              }
              className={cx(styles.labelRisk, {
                [styles.negligible]: value === RISK_LEVEL.NEGLIGIBLE,
              })}
            >
              {RISK_LEVEL.NEGLIGIBLE}
            </span>
            <span
              onClick={() =>
                isEdit && !disabled ? onChange(RISK_LEVEL.LOW) : null
              }
              className={cx(styles.labelRisk, {
                [styles.low]: value === RISK_LEVEL.LOW,
              })}
            >
              {RISK_LEVEL.LOW}
            </span>
            <span
              onClick={() =>
                isEdit && !disabled ? onChange(RISK_LEVEL.MEDIUM) : null
              }
              className={cx(styles.labelRisk, {
                [styles.medium]: value === RISK_LEVEL.MEDIUM,
              })}
            >
              {RISK_LEVEL.MEDIUM}
            </span>
            <span
              onClick={() =>
                isEdit && !disabled ? onChange(RISK_LEVEL.HIGH) : null
              }
              className={cx(styles.labelRisk, {
                [styles.high]: value === RISK_LEVEL.HIGH,
              })}
            >
              {RISK_LEVEL.HIGH}
            </span>
            {fieldState?.error?.message ? (
              <div className={cx('message-required mt-2')}>
                {fieldState?.error?.message}
              </div>
            ) : null}
          </>
        )}
      />
    ),
    [control, isEdit],
  );

  return (
    <div className={cx(className)}>
      <Row>
        <Col xl={7} xs={12}>
          <LabelUI
            className={cx(styles.labelForm)}
            label={t('labels.reviewStatus')}
          />
          <RadioForm
            disabled={!isEdit}
            className={cx(styles.radio)}
            name="reviewStatus"
            control={control}
            radioOptions={[
              {
                label: 'Pending',
                value: 'Pending',
              },
              {
                label: 'In progress',
                value: 'In progress',
              },
              {
                label: 'Cleared',
                value: 'Cleared',
              },
            ]}
          />
        </Col>
        <Col xl={7} xs={12} className="">
          <LabelUI
            className={cx(styles.labelForm, 'pb-2')}
            label={`${t('labels.potentialRisk')} (${
              RISK_LEVEL_TO_SCORE[watchPotentialRisk] ?? ''
            })`}
          />
          {renderRisk('potentialRisk', potentialRiskDisabled)}
        </Col>
        <Col xl={7} xs={12} className="">
          <LabelUI
            label={`${t('labels.observedRisk')} (${
              RISK_LEVEL_TO_SCORE[watchObservedRisk] ?? ''
            })`}
            className={cx(styles.labelForm, 'pb-2')}
          />
          {renderRisk('observedRisk')}
        </Col>

        <Col xl={3} xs={12} className="">
          <LabelUI
            className={cx(styles.labelForm)}
            label={t('labels.timeLoss')}
          />
          <RadioForm
            disabled={!isEdit}
            className={cx(styles.radio)}
            name="timeLoss"
            control={control}
            radioOptions={[
              {
                value: true,
                label: 'Yes',
              },
              {
                value: false,
                label: 'No',
              },
            ]}
          />
          {errors?.timeLoss?.message && (
            <div className={cx('message-required')}>
              {errors?.timeLoss?.message}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RiskSectionIncidents;
