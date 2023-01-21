import { FC } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import styles from './form.module.scss';

interface IncidentDescriptionProps {
  isEdit: boolean;
  loading?: boolean;
  data: IncidentInvestigationDetailResponse;
}

const IncidentDescription: FC<IncidentDescriptionProps> = ({
  isEdit,
  loading,
  data,
}) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);

  const { control } = useFormContext();

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>
            Incident description
          </div>
        </div>
        <Row className="pt-3">
          <Col span={24}>
            <div className={cx(styles.descriptionForm)}>
              {t('incidentDescription')}
              <span className={cx(styles.required)}>*</span>
            </div>
            <TextAreaForm
              name="description"
              placeholder={t('placeholderIncident.incidentDescription')}
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

export default IncidentDescription;
