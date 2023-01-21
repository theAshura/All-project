import { FC } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import styles from './form.module.scss';

interface CauseSectionProps {
  isEdit: boolean;
  loading?: boolean;
}

const CauseSection: FC<CauseSectionProps> = ({ isEdit, loading }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);

  const { control } = useFormContext();

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>
            {t('causeSection')}
          </div>
        </div>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.contentForm)}>{t('typeOfLoss')}</div>
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={2}
              placeholder={t('placeholderIncident.typeOfLoss')}
              name="typeOfLoss"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.contentForm)}>
              {t('immediateDirectCause')}
            </div>
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={2}
              placeholder={t('placeholderIncident.immediateDirectCause')}
              name="immediateDirectCause"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.contentForm)}>
              {t('basicUnderlyingCauses')}
            </div>
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={2}
              placeholder={t('placeholderIncident.basicUnderlyingCauses')}
              name="basicUnderlyingCauses"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.contentForm)}>{t('rootCause')}</div>
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={2}
              placeholder={t('placeholderIncident.rootCause')}
              name="rootCause"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.contentForm)}>
              {t('contributionFactor')}
            </div>
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={2}
              placeholder={t('placeholderIncident.contributionFactor')}
              name="contributionFactor"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.contentForm)}>
              {t('nonContributionFactor')}
            </div>
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={2}
              placeholder={t('placeholderIncident.nonContributionFactor')}
              name="nonContributionFactor"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.contentForm)}>
              {t('actionControlNeeds')}
            </div>
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={2}
              placeholder={t('placeholderIncident.actionControlNeeds')}
              name="actionControlNeeds"
              maxLength={128}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CauseSection;
