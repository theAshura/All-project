import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import { ShoreRank } from 'models/api/shore-rank/shore-rank.model';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createShoreRankActions } from 'store/shore-rank/shore-rank.action';
import ShoreRankForm from '../forms/ShoreRankForm';
import styles from './create.module.scss';

export default function ShoreRankCreate() {
  const { t } = useTranslation(I18nNamespace.SHORE_RANK);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: ShoreRank) => {
      dispatch(createShoreRankActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.shoreRankCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.SHORE_RANK_CREATE} />
          <div className={cx('fw-bold', styles.title)}>{t('txShoreRank')}</div>
        </div>
        <ShoreRankForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
