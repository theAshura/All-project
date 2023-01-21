import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { NatureOfFindingsMaster } from 'models/api/nature-of-findings-master/nature-of-findings-master.model';
import { createNatureOfFindingsMasterActions } from 'store/nature-of-findings-master/nature-of-findings-master.action';
import styles from './create.module.scss';
import NatureOfFindingsMasterForm from '../forms/NatureOfFindingsMasterForm';

export default function NatureOfFindingsMasterCreate() {
  const { t } = useTranslation(I18nNamespace.NATURE_OF_FINDINGS_MASTER);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: NatureOfFindingsMaster) => {
      dispatch(createNatureOfFindingsMasterActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.pcs}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.NATURE_OF_FINDINGS_MASTER_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('txNatureOfFindingsMasterTitle')}
          </div>
        </div>
        <NatureOfFindingsMasterForm
          isEdit
          data={null}
          isCreate
          onSubmit={handleSubmit}
        />
      </Container>
    </div>
  );
}
