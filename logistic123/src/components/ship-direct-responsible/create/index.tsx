import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { CreateShipDirectResponsibleParams } from 'models/api/ship-direct-responsible/ship-direct-responsible.model';
import { createShipDirectResponsibleActions } from 'store/ship-direct-responsible/ship-direct-responsible.action';
import styles from './create.module.scss';
import ShipDirectResponsibleForm from '../forms/ShipDirectResponsibleForm';

export default function ShipDirectResponsibleCreate() {
  const { t } = useTranslation(I18nNamespace.SHIP_DIRECT_RESPONSIBLE);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateShipDirectResponsibleParams) => {
      dispatch(createShipDirectResponsibleActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.shipDirectResponsibleCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.SHIP_DIRECT_RESPONSIBLE_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <ShipDirectResponsibleForm
          isEdit
          data={null}
          isCreate
          onSubmit={handleSubmit}
        />
      </Container>
    </div>
  );
}
