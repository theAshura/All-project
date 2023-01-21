import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import { CreateShoreBody } from 'models/api/shore-department/shore-department.model';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createShoreDepartmentAction } from 'store/shore-department/shore-department.action';

import ShoreDepartmentForm from '../forms/ShoreDepartmentForm';
import styles from './create.module.scss';

export default function ShoreRankManagementCreate() {
  const { t } = useTranslation(I18nNamespace.SHORE_DEPARTMENT);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (body: CreateShoreBody) => {
      dispatch(createShoreDepartmentAction.request(body));
    },
    [dispatch],
  );

  return (
    <div className={styles.shoreDepartmentCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.SHORE_DEPARTMENT_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('shoreDepartment')}
          </div>
        </div>
        <ShoreDepartmentForm onSubmit={handleSubmit} isCreate />
      </Container>
    </div>
  );
}
