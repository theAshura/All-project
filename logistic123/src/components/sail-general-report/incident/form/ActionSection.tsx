import { FC } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import styles from './form.module.scss';

interface ActionSectionProps {
  isEdit: boolean;
  loading?: boolean;
}

const ActionSection: FC<ActionSectionProps> = ({ isEdit, loading }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);

  const { control } = useFormContext();

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
            <TextAreaForm
              name="immediateAction"
              placeholder={t('placeholderIncident.immediateAction')}
              control={control}
              minRows={3}
              disabled={!isEdit}
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('preventiveAction')}</div>
            <TextAreaForm
              name="preventiveAction"
              placeholder={t('placeholderIncident.preventiveAction')}
              control={control}
              minRows={3}
              disabled={!isEdit}
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('correctionAction')}</div>
            <TextAreaForm
              name="correctionAction"
              placeholder={t('placeholderIncident.correctionAction')}
              control={control}
              minRows={3}
              disabled={!isEdit}
              maxLength={2000}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ActionSection;
