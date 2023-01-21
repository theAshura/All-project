import { FC } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaUI from 'components/ui/text-area/TextArea';
import styles from './cause-section.module.scss';

interface CauseSectionProps {
  isEdit: boolean;
  loading?: boolean;
  data: IncidentInvestigationDetailResponse;
}

const CauseSection: FC<CauseSectionProps> = ({ isEdit, data, loading }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);

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
            <div className={cx(styles.labelForm)}>{t('typeOfLoss')}</div>
            <TextAreaUI
              value={data?.typeOfLoss}
              disabled
              minRows={2}
              name="typeOfLoss"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('immediateDirectCause')}
            </div>
            <TextAreaUI
              value={data?.immediateDirectCause}
              disabled
              minRows={2}
              name="immediateDirectCause"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('basicUnderlyingCauses')}
            </div>
            <TextAreaUI
              value={data?.basicUnderlyingCauses}
              disabled
              minRows={2}
              name="basicUnderlyingCauses"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('rootCause')}</div>
            <TextAreaUI
              value={data?.rootCause}
              disabled
              minRows={2}
              name="rootCause"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('contributionFactor')}
            </div>
            <TextAreaUI
              value={data?.contributionFactor}
              disabled
              minRows={2}
              name="contributionFactor"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('nonContributionFactor')}
            </div>
            <TextAreaUI
              value={data?.nonContributionFactor}
              disabled
              minRows={2}
              name="nonContributionFactor"
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('actionControlNeeds')}
            </div>
            <TextAreaUI
              value={data?.actionControlNeeds}
              disabled
              minRows={2}
              name="actionControlNeeds"
              maxLength={2000}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CauseSection;
