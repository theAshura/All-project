import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { CreateCharterOwnerParams } from 'models/api/charter-owner/charter-owner.model';
import { createCharterOwnerActions } from 'store/charter-owner/charter-owner.action';
import styles from './create.module.scss';
import ChartOwnerForm from '../forms/CharterOwnerForm';

export default function ChartOwnerCreate() {
  const { t } = useTranslation(I18nNamespace.CHARTER_OWNER);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateCharterOwnerParams) => {
      dispatch(createCharterOwnerActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.chartOwnerCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.CHARTER_OWNER_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <ChartOwnerForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
