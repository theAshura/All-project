import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { DepartmentMaster } from 'models/api/department-master/department-master.model';
import { createDepartmentMasterActions } from 'store/department-master/department-master.action';
import styles from './create.module.scss';
import ChartOwnerForm from '../forms/DepartmentMasterForm';

export default function ChartOwnerCreate() {
  const { t } = useTranslation(I18nNamespace.DEPARTMENT_MASTER);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: DepartmentMaster) => {
      dispatch(createDepartmentMasterActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.pcs}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.DEPARTMENT_MASTER_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('txDepartmentMaster')}
          </div>
        </div>
        <ChartOwnerForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
