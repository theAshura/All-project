import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { CreatePscActionParams } from 'models/api/psc-action/psc-action.model';
import { createPscActions } from 'store/psc-action/psc-action.action';
import styles from './create.module.scss';
import PscActionForm from '../forms/PscActionForm';

export default function PscActionCreate() {
  const { t } = useTranslation(I18nNamespace.PSC_ACTION);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreatePscActionParams) => {
      dispatch(createPscActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.pscActionCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.PSC_ACTION_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <PscActionForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
