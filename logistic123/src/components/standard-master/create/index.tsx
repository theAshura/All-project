import { useCallback, useEffect } from 'react';

import {
  createStandardMasterActions,
  clearStandardMasterErrorsReducer,
} from 'store/standard-master/standard-master.action';
import { useDispatch } from 'react-redux';
import { CreateStandardMasterParams } from 'models/api/standard-master/standard-master.model';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import styles from './create.module.scss';
import StandardMasterForm from '../forms';

export default function NewStandardMasterManagement() {
  const { t } = useTranslation(I18nNamespace.STANDARD_MASTER);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateStandardMasterParams) => {
      dispatch(createStandardMasterActions.request(formData));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearStandardMasterErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.createWrapper}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.STANDARD_MASTER_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('standardMaster')}
          </div>
        </div>
        <StandardMasterForm
          isEdit
          data={null}
          onSubmit={handleSubmit}
          isCreate
        />
      </Container>
    </div>
  );
}
