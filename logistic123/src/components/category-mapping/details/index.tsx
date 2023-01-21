import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import {
  getCategoryMappingDetailActions,
  updateCategoryMappingActions,
  deleteCategoryMappingActions,
} from 'store/category-mapping/category-mapping.action';
import { CreateCategoryMappingParams } from 'models/api/category-mapping/category-mapping.model';
import { CommonQuery } from 'constants/common.const';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import styles from './detail.module.scss';
import CategoryMappingForm from '../forms/CategoryMappingForm';

export default function CategoryMappingManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.authenticate);
  const { loading, categoryMappingDetail } = useSelector(
    (state) => state.categoryMapping,
  );

  const { t } = useTranslation(I18nNamespace.CATEGORY_MAPPING);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: CreateCategoryMappingParams) => {
      dispatch(updateCategoryMappingActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getCategoryMappingDetailActions.request(id));
    return () => {
      dispatch(getCategoryMappingDetailActions.success(undefined));
    };
  }, [dispatch, id]);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.CATEGORY_MAPPING,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.categoryMappingDetail}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.CATEGORY_MAPPING_EDIT
                        : BREAD_CRUMB.CATEGORY_MAPPING_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {t('categoryMappingTitle')}
                  </div>
                </div>
                {!isEdit && (
                  <div>
                    <Button
                      className={cx('me-2', styles.buttonFilter)}
                      buttonType={ButtonType.CancelOutline}
                      onClick={(e) => {
                        history.goBack();
                      }}
                    >
                      <span className="pe-2">Back</span>
                    </Button>
                    {userInfo?.mainCompanyId ===
                      categoryMappingDetail?.companyId && (
                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.CATEGORY_MAPPING,
                          action: ActionTypeEnum.UPDATE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('me-1', styles.buttonFilter)}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.getCategoryMappingById(id)}${
                                    CommonQuery.EDIT
                                  }`,
                                );
                              }}
                            >
                              <span className="pe-2">Edit</span>
                              <img
                                src={images.icons.icEdit}
                                alt="edit"
                                className={styles.icEdit}
                              />
                            </Button>
                          )
                        }
                      </PermissionCheck>
                    )}
                  </div>
                )}
              </div>
              <ModalConfirm
                title={t('deleteTitle')}
                content={t('deleteMessage')}
                isDelete
                disable={loading}
                toggle={() => setModal(!modal)}
                modal={modal}
                handleSubmit={() => {
                  dispatch(
                    deleteCategoryMappingActions.request({
                      id,
                      isDetail: true,
                      getListCategoryMapping: () => {
                        history.push(AppRouteConst.CATEGORY_MAPPING);
                      },
                    }),
                  );
                }}
              />
              <CategoryMappingForm
                isEdit={isEdit}
                data={categoryMappingDetail}
                onSubmit={handleSubmit}
              />
            </Container>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
