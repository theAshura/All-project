import cx from 'classnames';
import history from 'helpers/history.helper';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import { useLocation, useParams } from 'react-router';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import NoPermission from 'containers/no-permission';
import {
  getVesselDetailActions,
  deleteVesselActions,
  updateVesselActions,
} from 'store/vessel/vessel.action';
import { CreateVesselParams } from 'models/api/vessel/vessel.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { CommonQuery } from 'constants/common.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import VesselManagementForm from '../forms/VesselForm';
import styles from './detail.module.scss';

export default function VesselManagementDetail() {
  const { search } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { vesselDetail } = useSelector((store) => store.vessel);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authenticate);
  const isEdit = useMemo(() => search?.includes(CommonQuery.EDIT), [search]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonVessel,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });

  useEffect(() => {
    dispatch(getVesselDetailActions.request(id));
  }, [dispatch, id]);

  const handleDeleteModal = () => {
    dispatch(
      deleteVesselActions.request({
        id,
        isDetail: true,
        getListVesselManagement: () => {
          history.push(AppRouteConst.VESSEL);
        },
      }),
    );
  };

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),
      onPressButtonRight: handleDeleteModal,
    });
  };

  const handleEdit = () => {
    history.push(
      `${AppRouteConst.getVesselById(vesselDetail?.id)}${CommonQuery.EDIT}`,
    );
  };

  const handleSubmit = useCallback(
    (formData: CreateVesselParams) => {
      const finalData = {
        ...formData,
        image: formData.image ? formData.image : undefined,
      };
      const submitBody = {
        id,
        body: finalData,
      };
      dispatch(updateVesselActions.request(submitBody));
    },
    [dispatch, id],
  );

  return (
    <>
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VESSEL,
          action:
            search === CommonQuery.EDIT
              ? ActionTypeEnum.UPDATE
              : ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <div className={styles.vesselTypeCreate}>
              <HeaderPage
                breadCrumb={
                  search === CommonQuery.EDIT
                    ? BREAD_CRUMB.VESSEL_EDIT
                    : BREAD_CRUMB.VESSEL_DETAIL
                }
                titlePage={renderDynamicModuleLabel(
                  listModuleDynamicLabels,
                  DynamicLabelModuleName.ConfigurationCommonVessel,
                )}
              >
                {!isEdit && (
                  <div>
                    <Button
                      className={cx('me-2', styles.buttonFilter)}
                      buttonType={ButtonType.CancelOutline}
                      onClick={(e) => {
                        history.goBack();
                      }}
                    >
                      <span className="pe-2">
                        {renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS.Back,
                        )}
                      </span>
                    </Button>
                    {userInfo?.mainCompanyId === vesselDetail?.companyId && (
                      <>
                        <PermissionCheck
                          options={{
                            feature: Features.CONFIGURATION,
                            subFeature: SubFeatures.VESSEL,
                            action: ActionTypeEnum.UPDATE,
                          }}
                        >
                          {({ hasPermission }) =>
                            hasPermission && (
                              <Button
                                buttonType={ButtonType.Primary}
                                className={cx('me-1', styles.buttonFilter)}
                                onClick={handleEdit}
                              >
                                <span className="pe-2">
                                  {renderDynamicLabel(
                                    dynamicLabels,
                                    COMMON_DYNAMIC_FIELDS.Edit,
                                  )}
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
                            subFeature: SubFeatures.VESSEL,
                            action: ActionTypeEnum.DELETE,
                          }}
                        >
                          {({ hasPermission }) =>
                            hasPermission &&
                            userInfo?.id === vesselDetail?.createdUserId && (
                              <Button
                                buttonType={ButtonType.Orange}
                                className={cx('ms-1', styles.buttonFilter)}
                                onClick={handleDelete}
                              >
                                <span className="pe-2">
                                  {renderDynamicLabel(
                                    dynamicLabels,
                                    COMMON_DYNAMIC_FIELDS.Delete,
                                  )}
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
                      </>
                    )}
                  </div>
                )}
              </HeaderPage>
              <VesselManagementForm
                screen={isEdit ? 'edit' : 'detail'}
                data={vesselDetail}
                dynamicLabels={dynamicLabels}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <NoPermission />
          )
        }
      </PermissionCheck>
    </>
  );
}
