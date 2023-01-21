import { useCallback, useEffect } from 'react';

import { createCDIActions, clearCDIErrorsReducer } from 'store/cdi/cdi.action';
import { useDispatch } from 'react-redux';
import { CreateCDIParams } from 'models/api/cdi/cdi.model';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import styles from './create.module.scss';
import CDIForm from '../forms/CDIForm';

export default function NewCDIManagement() {
  const { t } = useTranslation(I18nNamespace.CDI);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateCDIParams) => {
      dispatch(createCDIActions.request(formData));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearCDIErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.CDIManagement}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.CDI_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <CDIForm isEdit data={null} onSubmit={handleSubmit} isCreate />
      </Container>
    </div>
  );
}
