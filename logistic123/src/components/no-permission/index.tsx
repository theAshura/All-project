import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import styles from './no-permission.module.scss';

const NoPermission = () => {
  const { t } = useTranslation(I18nNamespace.COMMON);

  return (
    <div className={styles.container}>
      <div className={styles.message}>{t('errors.noPermission')}</div>
    </div>
  );
};

export default NoPermission;
