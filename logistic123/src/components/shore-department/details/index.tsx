import { getShoreDepartmentDetailApi } from 'api/shore-department.api';
import images from 'assets/images/images';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import ShoreDepartmentForm from 'components/shore-department/forms/ShoreDepartmentForm';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import NoPermission from 'containers/no-permission';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  CreateShoreBody,
  ShoreDepartment,
} from 'models/api/shore-department/shore-department.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  deleteShoreDepartmentActions,
  editShoreDepartmentAction,
} from 'store/shore-department/shore-department.action';
import styles from './detail.module.scss';

const ShoreDepartmentDetail = () => {
  const [shoreDetail, setShoreDetail] = useState<ShoreDepartment>();
  const [loadingDetail, setLoadingDetail] = useState<boolean>();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation([
    I18nNamespace.SHORE_DEPARTMENT,
    I18nNamespace.COMMON,
  ]);

  const handleSubmit = useCallback(
    (body: CreateShoreBody) => {
      dispatch(editShoreDepartmentAction.request({ id, body }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  const handleDeleteModal = () => {
    dispatch(
      deleteShoreDepartmentActions.request({
        id,
        isDetail: true,
        getList: () => {
          history.push(AppRouteConst.SHORE_DEPARTMENT);
        },
      }),
    );
  };

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: handleDeleteModal,
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setLoadingDetail(true);
      getShoreDepartmentDetailApi(id)
        .then((r) => {
          setShoreDetail(r.data);
          setLoadingDetail(false);
        })
        .catch((e) => toastError(e));
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.SHORE_DEPARTMENT,
          action:
            search === CommonQuery.EDIT
              ? ActionTypeEnum.UPDATE
              : ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <div className={styles.shoreDepartmentDetail}>
              <Container>
                <div className="d-flex justify-content-between">
                  <div className={styles.headers}>
                    <BreadCrumb
                      current={
                        search === CommonQuery.EDIT
                          ? BREAD_CRUMB.SHORE_DEPARTMENT_EDIT
                          : BREAD_CRUMB.SHORE_DEPARTMENT_DETAIL
                      }
                    />
                    <div className={cx('fw-bold', styles.title)}>
                      {t('shoreDepartment')}
                    </div>
                  </div>
                  {search !== CommonQuery.EDIT && (
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
                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.FLEET,
                          action: ActionTypeEnum.UPDATE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('me-1', styles.actionBtns)}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.shoreDepartmentDetail(id)}${
                                    CommonQuery.EDIT
                                  }`,
                                );
                              }}
                            >
                              <span className="pe-2">
                                {t('buttons.txEdit')}
                              </span>
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
                          subFeature: SubFeatures.FLEET,
                          action: ActionTypeEnum.DELETE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('ms-1', styles.actionBtns)}
                              buttonType={ButtonType.Orange}
                              onClick={handleDelete}
                            >
                              <span className="pe-2">
                                {t('buttons.txDelete')}
                              </span>
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

                <ShoreDepartmentForm
                  isDetail={!search}
                  data={shoreDetail}
                  onSubmit={handleSubmit}
                  loadingDetail={loadingDetail}
                />
              </Container>
            </div>
          ) : (
            <NoPermission />
          )
        }
      </PermissionCheck>
    </>
  );
};

export default ShoreDepartmentDetail;
