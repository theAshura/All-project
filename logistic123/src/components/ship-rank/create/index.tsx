import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { CreateShipRankParams } from 'models/api/ship-rank/ship-rank.model';
import { createShipRankActions } from 'store/ship-rank/ship-rank.action';
import styles from './create.module.scss';
import ShipRankForm from '../forms/ShipRankForm';

export default function ShipRankCreate() {
  const { t } = useTranslation(I18nNamespace.SHIP_RANK);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateShipRankParams) => {
      dispatch(createShipRankActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.ShipRankCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.SHIP_RANK_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <ShipRankForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
