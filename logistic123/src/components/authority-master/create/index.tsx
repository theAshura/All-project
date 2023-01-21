import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import { createVesselTypeActions } from 'store/vessel-type/vessel-type.action';
import styles from './create.module.scss';
import VesselTypeForm from '../forms/AuthorityMasterForm';

export default function AuthorityMasterCreate() {
  const { t } = useTranslation(I18nNamespace.VESSEL_TYPE);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: VesselType) => {
      dispatch(createVesselTypeActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.vesselTypeCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.VESSEL_TYPE_CREATE} />
          <div className={cx('fw-bold', styles.title)}>{t('txVesselType')}</div>
        </div>
        <VesselTypeForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
