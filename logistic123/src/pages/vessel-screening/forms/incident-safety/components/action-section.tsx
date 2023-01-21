import { FC } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import { useTranslation } from 'react-i18next';
import TextAreaUI from 'components/ui/text-area/TextArea';
import { I18nNamespace } from 'constants/i18n.const';
import styles from './action-section.module.scss';

interface ActionSectionProps {
  isEdit: boolean;
  loading?: boolean;
  data: IncidentInvestigationDetailResponse;
}

const ActionSection: FC<ActionSectionProps> = ({ isEdit, data, loading }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>
            {t('actionSection')}
          </div>
        </div>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('immediateAction')}</div>
            <TextAreaUI
              name="immediateAction"
              value={data?.immediateAction}
              autoSize={{ minRows: 2 }}
              disabled
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('preventiveAction')}</div>
            <TextAreaUI
              name="preventiveAction"
              value={data?.preventiveAction}
              autoSize={{ minRows: 2 }}
              disabled
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('correctionAction')}</div>
            <TextAreaUI
              name="correctionAction"
              value={data?.correctionAction}
              autoSize={{ minRows: 2 }}
              disabled
              maxLength={2000}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ActionSection;
