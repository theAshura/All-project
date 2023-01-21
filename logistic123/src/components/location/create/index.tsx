import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import styles from './create.module.scss';

export default function ChartOwnerCreate() {
  const { t } = useTranslation(I18nNamespace.LOCATION);

  return (
    <div className={styles.chartOwnerCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.LOCATION_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        {/* <ChartOwnerForm isEdit data={null} isCreate onSubmit={handleSubmit} /> */}
      </Container>
    </div>
  );
}
