import { deleteFilesApi } from 'api/dms.api';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import { DMS } from 'models/api/dms/dms.model';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createDMSActions } from 'store/dms/dms.action';
import DMSForm from '../forms/DMSForm';
import styles from './create.module.scss';

export default function DMSCreate() {
  const { t } = useTranslation(I18nNamespace.DMS);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: DMS, ids) => {
      dispatch(createDMSActions.request(formData));
      deleteFilesApi({ ids });
    },
    [dispatch],
  );

  return (
    <div className={styles.DMSCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.DMS_CREATE} />
          <div className={cx('fw-bold', styles.title)}>{t('txDMS')}</div>
        </div>
        <DMSForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
