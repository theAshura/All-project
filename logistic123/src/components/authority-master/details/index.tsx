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
import { CreateAuditTypeParams } from 'models/api/audit-type/audit-type.model';
import { CommonQuery } from 'constants/common.const';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  deleteVesselTypeActions,
  getVesselTypeDetailActions,
  updateVesselTypeActions,
} from 'store/vessel-type/vessel-type.action';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import styles from './detail.module.scss';
import VesselTypeForm from '../forms/AuthorityMasterForm';

export default function AuditTypeManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const vesselTypeDetail = useSelector(
    (state) => state.vesselType?.vesselTypeDetail,
  );

  const { t } = useTranslation([
    I18nNamespace.VESSEL_TYPE,
    I18nNamespace.COMMON,
  ]);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const onDeleteVesselType = () => {
    dispatch(
      deleteVesselTypeActions.request({
        id,
        isDetail: true,
        getListVesselType: () => {
          history.push(AppRouteConst.VESSEL_TYPE);
        },
      }),
    );
  };

  const handleSubmit = useCallback(
    (formData: CreateAuditTypeParams) => {
      dispatch(updateVesselTypeActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: onDeleteVesselType,
    });
  };

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    dispatch(getVesselTypeDetailActions.request(id));
    return () => {
      dispatch(
        getVesselTypeDetailActions.success({
          id: '',
          code: '',
          name: '',
          vettingRiskScore: '',
          status: 'active',
          description: '',
        }),
      );
    };
  }, [dispatch, id]);

  // render
  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.VESSEL_TYPE,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.vesselTypeDetail}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.VESSEL_TYPE_EDIT
                        : BREAD_CRUMB.VESSEL_TYPE_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {t('txVesselType')}
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
                    <PermissionCheck
                      options={{
                        feature: Features.CONFIGURATION,
                        subFeature: SubFeatures.VESSEL_TYPE,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={(e) => {
                              history.push(
                                `${AppRouteConst.getVesselTypeById(
                                  vesselTypeDetail?.id,
                                )}${CommonQuery.EDIT}`,
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
                        subFeature: SubFeatures.VESSEL_TYPE,
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

              <VesselTypeForm
                isEdit={isEdit}
                data={vesselTypeDetail}
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
