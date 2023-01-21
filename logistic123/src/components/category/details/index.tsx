import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import useEffectOnce from 'hoc/useEffectOnce';
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
  getCategoryDetailActions,
  updateCategoryActions,
  deleteCategoryActions,
} from 'store/category/category.action';
import { CreateCategoryParams } from 'models/api/category/category.model';
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
import CategoryForm from '../forms/CategoryForm';

export default function CategoryManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, categoryDetail } = useSelector((state) => state.category);

  const { t } = useTranslation(I18nNamespace.CATEGORY);
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
    (formData: CreateCategoryParams) => {
      dispatch(updateCategoryActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  useEffectOnce(() => {
    dispatch(getCategoryDetailActions.request(id));
    return () => {
      dispatch(
        getCategoryDetailActions.success({
          id: '',
          code: '',
          name: '',
          scope: 'internal',
          status: 'active',
          deleted: false,
        }),
      );
    };
  });

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.MAIN_CATEGORY,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.getCategoryById}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.CATEGORY_EDIT
                        : BREAD_CRUMB.CATEGORY_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {t('headPageTitle')}
                  </div>
                </div>
                {!isEdit && (
                  <div>
                    <PermissionCheck
                      options={{
                        feature: Features.CONFIGURATION,
                        subFeature: SubFeatures.MAIN_CATEGORY,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={(e) => {
                              history.push(
                                `${AppRouteConst.getCategoryById(id)}${
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

                    <PermissionCheck
                      options={{
                        feature: Features.CONFIGURATION,
                        subFeature: SubFeatures.MAIN_CATEGORY,
                        action: ActionTypeEnum.DELETE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('ms-1', styles.buttonFilter)}
                            buttonType={ButtonType.Orange}
                            onClick={(e) => setModal(true)}
                          >
                            <span className="pe-2">Delete</span>
                            <img
                              src={images.icons.icRemove}
                              alt="remove"
                              className={styles.icRemove}
                            />
                          </Button>
                        )
                      }
                    </PermissionCheck>
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
                    deleteCategoryActions.request({
                      id,
                      isDetail: true,
                      getListCategory: () => {
                        history.push(AppRouteConst.CATEGORY);
                      },
                    }),
                  );
                }}
              />
              <CategoryForm
                isEdit={isEdit}
                data={categoryDetail}
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
