import { useCallback, useEffect } from 'react';

import {
  createAuditTypeActions,
  clearAuditTypeErrorsReducer,
} from 'store/audit-type/audit-type.action';
import { useDispatch } from 'react-redux';
import { CreateAuditTypeParams } from 'models/api/audit-type/audit-type.model';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import styles from './create.module.scss';
import AuditTypeForm from '../forms/AuditTypeForm';

export default function NewAuditTypeManagement() {
  const { t } = useTranslation(I18nNamespace.AUDIT_TYPE);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateAuditTypeParams) => {
      dispatch(createAuditTypeActions.request(formData));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearAuditTypeErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.auditType}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.AUDIT_TYPE_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('auditTypeManagementTitle')}
          </div>
        </div>
        <AuditTypeForm isEdit data={null} onSubmit={handleSubmit} isCreate />
      </Container>
    </div>
  );
}
