import { useCallback, useEffect } from 'react';

import {
  createCategoryMappingActions,
  clearCategoryMappingErrorsReducer,
} from 'store/category-mapping/category-mapping.action';
import { useDispatch } from 'react-redux';
import { CreateCategoryMappingParams } from 'models/api/category-mapping/category-mapping.model';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import styles from './create.module.scss';
import CategoryMappingForm from '../forms/CategoryMappingForm';

export default function NewCategoryMappingManagement() {
  const { t } = useTranslation(I18nNamespace.CATEGORY_MAPPING);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateCategoryMappingParams) => {
      dispatch(createCategoryMappingActions.request(formData));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearCategoryMappingErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.CategoryMapping}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.CATEGORY_MAPPING_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('categoryMappingTitle')}
          </div>
        </div>
        <CategoryMappingForm
          isEdit
          data={null}
          onSubmit={handleSubmit}
          isCreate
        />
      </Container>
    </div>
  );
}
