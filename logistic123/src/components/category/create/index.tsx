import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import useEffectOnce from 'hoc/useEffectOnce';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { CreateCategoryParams } from 'models/api/category/category.model';
import {
  createCategoryActions,
  getListCategoryActions,
} from 'store/category/category.action';
import styles from './create.module.scss';
import CategoryForm from '../forms/CategoryForm';

export default function CategoryCreate() {
  const { t } = useTranslation(I18nNamespace.CATEGORY);

  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(
      getListCategoryActions.request({ page: 1, pageSize: -1, levels: '1,2' }),
    );
  });

  const handleSubmit = useCallback(
    (formData: CreateCategoryParams) => {
      dispatch(createCategoryActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.categoryCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.CATEGORY_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <CategoryForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
