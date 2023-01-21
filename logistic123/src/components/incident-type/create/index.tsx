import { useCallback } from 'react';

import { createFleetActions } from 'store/fleet/fleet.action';
import { useDispatch } from 'react-redux';
import { CreateFleetParams } from 'models/api/fleet/fleet.model';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import styles from './create.module.scss';
import FleetForm from '../forms/IncidenTypeForm';

export default function NewFleetManagement() {
  const { t } = useTranslation(I18nNamespace.INCIDENT_TYPE);

  const dispatch = useDispatch();
  const handleSubmit = useCallback(
    (formData: CreateFleetParams) => {
      dispatch(createFleetActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.auditType}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.INCIDENT_TYPE_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('incidentTypeInformation')}
          </div>
        </div>
        <FleetForm isEdit data={null} onSubmit={handleSubmit} isCreate />
      </Container>
    </div>
  );
}
