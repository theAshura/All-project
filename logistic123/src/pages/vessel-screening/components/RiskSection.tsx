import { FC, useCallback } from 'react';
import cx from 'classnames';
import LabelUI from 'components/ui/label/LabelUI';

import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { Row, Col } from 'antd/lib/grid';
import styles from './risk-section.module.scss';
import { RISK_LEVEL, RISK_LEVEL_TO_SCORE } from '../utils/constant';

interface RiskSectionProps {
  isEdit: boolean;
  potentialRiskName: string;
  observedRiskName: string;
  timeLossName: string;
  className?: string;
}

const RiskSection: FC<RiskSectionProps> = ({
  isEdit,
  potentialRiskName,
  observedRiskName,
  timeLossName,
  className,
}) => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);

  const { control, watch } = useFormContext();

  const watchPotentialRisk = watch(potentialRiskName);
  const watchObservedRisk = watch(observedRiskName);

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
              <div className={cx(styles.requiredMessage)}>
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
    <div className={cx(styles.wrapperContainer, className)}>
      <Row className={cx('fw-bold ', styles.labelHeader)}>
        {t('labels.riskManagement')}
      </Row>
      <Row gutter={[30, 0]}>
        <Col className={cx(styles.container)}>
          <div className={cx(styles.title)}>
            <span className="d-flex align-items-center">
              <LabelUI
                label={t('labels.potentialRisk')}
                isRequired
                className={cx(styles.labelRiskItem)}
              />
              <span>
                {RISK_LEVEL_TO_SCORE[watchPotentialRisk]
                  ? `(${RISK_LEVEL_TO_SCORE[watchPotentialRisk]})`
                  : ''}
              </span>
            </span>
          </div>
          <div className="pb-3">{renderRisk(potentialRiskName, true)}</div>
        </Col>
        <Col className={cx(styles.container)}>
          <div className={cx(styles.title)}>
            <span className="d-flex align-items-center">
              <LabelUI
                label={t('labels.observedRisk')}
                isRequired
                className={cx(styles.labelRiskItem)}
              />
              <span>
                {RISK_LEVEL_TO_SCORE[watchObservedRisk]
                  ? `(${RISK_LEVEL_TO_SCORE[watchObservedRisk]})`
                  : ''}
              </span>
            </span>
          </div>
          <div className="pb-3">{renderRisk(observedRiskName)}</div>
        </Col>
        <Col className={cx(styles.container)}>
          <div className={cx(styles.title)}>
            <LabelUI label={t('labels.timeLoss')} />
          </div>
          <RadioForm
            disabled={!isEdit}
            className={cx(styles.timeLoss)}
            name={timeLossName}
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
        </Col>
      </Row>
    </div>
  );
};

export default RiskSection;
