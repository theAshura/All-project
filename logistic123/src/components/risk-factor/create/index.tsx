import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { CreateRiskFactorParams } from 'models/api/risk-factor/risk-factor.model';
import { createRiskFactorActions } from 'store/risk-factor/risk-factor.action';
import styles from './create.module.scss';
import ChartOwnerForm from '../forms/RiskFactorForm';

export default function ChartOwnerCreate() {
  const { t } = useTranslation(I18nNamespace.RISK_FACTOR);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateRiskFactorParams) => {
      dispatch(createRiskFactorActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.chartOwnerCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.RISK_FACTOR_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <ChartOwnerForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
