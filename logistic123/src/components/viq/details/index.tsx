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
  getVIQDetailActions,
  updateVIQActions,
  deleteVIQActions,
} from 'store/viq/viq.action';
import { CreateViqParams } from 'models/api/viq/viq.model';
import { CommonQuery } from 'constants/common.const';
import HeaderPage from 'components/common/header-page/HeaderPage';

import history from 'helpers/history.helper';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import {
  getCurrentModulePageByStatus,
  renderDynamicModuleLabel,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './detail.module.scss';
import VIQForm from '../forms/VIQForm';

export default function VIQManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, VIQDetail } = useSelector((state) => state.viq);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
    modulePage: getCurrentModulePageByStatus(isEdit, false),
  });

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: CreateViqParams) => {
      dispatch(
        updateVIQActions.request({
          data: formData,
          id,
          isCreate: false,
          afterUpdate: () => {},
        }),
      );
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getVIQDetailActions.request(id));
    return () => {
      dispatch(getVIQDetailActions.success(undefined));
    };
  }, [dispatch, id]);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.VIQ,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.VIQDetailWrapper}>
            <HeaderPage
              breadCrumb={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.VIQ_EDIT
                  : BREAD_CRUMB.VIQ_DETAIL
              }
              titlePage={renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
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
                  {userInfo?.mainCompanyId === VIQDetail?.companyId && (
                    <>
                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.VIQ,
                          action: ActionTypeEnum.UPDATE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('me-1', styles.buttonFilter)}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.getVIQById(id)}${
                                    CommonQuery.EDIT
                                  }`,
                                );
                              }}
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
                          subFeature: SubFeatures.VIQ,
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
              <ModalConfirm
                title={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Delete?'],
                )}
                content={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS[
                    'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                  ],
                )}
                isDelete
                disable={loading}
                toggle={() => setModal(!modal)}
                modal={modal}
                handleSubmit={() => {
                  dispatch(
                    deleteVIQActions.request({
                      id,
                      isDetail: true,
                      afterDelete: () => {
                        history.push(AppRouteConst.VIQ);
                      },
                    }),
                  );
                }}
                dynamicLabels={dynamicLabels}
              />
            </HeaderPage>
            <VIQForm isEdit={isEdit} data={VIQDetail} onSubmit={handleSubmit} />
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
