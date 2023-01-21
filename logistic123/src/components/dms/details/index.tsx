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

import { CommonQuery } from 'constants/common.const';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { DMS } from 'models/api/dms/dms.model';
import {
  deleteDMSActions,
  getDMSDetailActions,
  updateDMSActions,
} from 'store/dms/dms.action';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { deleteFilesApi } from 'api/dms.api';
import styles from './detail.module.scss';
import DMSForm from '../forms/DMSForm';

export default function DMSDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { DMSDetail } = useSelector((state) => state.dms);
  const { userInfo } = useSelector((state) => state.authenticate);

  const { t } = useTranslation(I18nNamespace.DMS);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  // function
  const onDeleteDMS = () => {
    dispatch(
      deleteDMSActions.request({
        id,
        isDetail: true,
        getListDMS: () => {
          history.push(AppRouteConst.DMS);
        },
      }),
    );
  };
  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: onDeleteDMS,
    });
  };

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: DMS, ids) => {
      dispatch(updateDMSActions.request({ id, data: formData }));
      deleteFilesApi({ ids });
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getDMSDetailActions.request(id));
    return () => {
      dispatch(
        getDMSDetailActions.success({
          id: '',
          code: '',
          name: '',
          scope: 'internal',
          status: 'active',
          deleted: false,
        }),
      );
    };
  }, [dispatch, id]);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.DMS,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.getDMSById}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.DMS_EDIT
                        : BREAD_CRUMB.DMS_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {t('txDMS')}
                  </div>
                </div>
                {!isEdit && userInfo?.mainCompanyId === DMSDetail?.companyId && (
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
                        subFeature: SubFeatures.DMS,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={(e) => {
                              history.push(
                                `${AppRouteConst.getDMSById(id)}${
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
                        subFeature: SubFeatures.DMS,
                        action: ActionTypeEnum.DELETE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('ms-1', styles.buttonFilter)}
                            buttonType={ButtonType.Orange}
                            onClick={handleDelete}
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
              <DMSForm
                isEdit={isEdit}
                data={DMSDetail}
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
