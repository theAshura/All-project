import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { RankMaster } from 'models/api/rank-master/rank-master.model';
import { createRankMasterActions } from 'store/rank-master/rank-master.action';
import styles from './create.module.scss';
import RankMasterForm from '../forms/RankMasterForm';

export default function RankMasterCreate() {
  const { t } = useTranslation(I18nNamespace.RANK_MASTER);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: RankMaster) => {
      dispatch(createRankMasterActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.pcs}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.RANK_MASTER_CREATE} />
          <div className={cx('fw-bold', styles.title)}>{t('txRankMaster')}</div>
        </div>
        <RankMasterForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
