import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { PSCDeficiency } from 'models/api/psc-deficiency/psc-deficiency.model';
import { createPSCDeficiencyActions } from 'store/psc-deficiency/psc-deficiency.action';
import styles from './create.module.scss';
import ChartOwnerForm from '../forms/PSCDeficiencyForm';

export default function ChartOwnerCreate() {
  const { t } = useTranslation(I18nNamespace.PSC_DEFICIENCY);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: PSCDeficiency) => {
      dispatch(createPSCDeficiencyActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.pcs}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.PSC_DEFICIENCY_CREATE} />
          <div className={cx('fw-bold', styles.title)}>{t('txPSC')}</div>
        </div>
        <ChartOwnerForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
