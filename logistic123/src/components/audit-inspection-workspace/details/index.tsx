import { useEffect, useState, useMemo } from 'react';
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
  getAuditInspectionWorkspaceDetailActions,
  getAuditWorkspaceChecklistActions,
  getAuditWorkspaceSummaryActions,
  getInspectionWorkspaceSummaryAction,
  getAnalyticalReportPerformanceAction,
} from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import { getListPlanningRequestAuditLogAction } from 'store/planning-and-request/planning-and-request.action';
import { AuditWorkspaceStatus, CommonQuery } from 'constants/common.const';
import images from 'assets/images/images';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import Button, { ButtonType } from 'components/ui/button/Button';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import styles from './detail.module.scss';
import AuditInspectionWorkspaceForm from '../forms/AuditInspectionWorkspaceForm';

export default function AuditInspectionWorkspaceManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { auditInspectionWorkspaceDetail, listChecklist } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { userInfo } = useSelector((state) => state.authenticate);

  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionWorkspace,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });

  useEffect(() => {
    if (search === CommonQuery.EDIT) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [search]);

  useEffect(() => {
    dispatch(getAuditInspectionWorkspaceDetailActions.request(id));
    dispatch(getInspectionWorkspaceSummaryAction.request(id));
    dispatch(
      getAuditWorkspaceChecklistActions.request({
        id,
      }),
    );
    dispatch(getAuditWorkspaceSummaryActions.request({ id }));
    dispatch(getAnalyticalReportPerformanceAction.request(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (auditInspectionWorkspaceDetail) {
      dispatch(
        getListPlanningRequestAuditLogAction.request({
          id: auditInspectionWorkspaceDetail?.planningRequestId,
        }),
      );
    }
  }, [auditInspectionWorkspaceDetail, dispatch]);

  const renderActions = useMemo(() => {
    const isCurrentDoc = checkDocHolderChartererVesselOwner(
      {
        vesselDocHolders:
          auditInspectionWorkspaceDetail?.vessel?.vesselDocHolders,
        vesselCharterers:
          auditInspectionWorkspaceDetail?.vessel?.vesselCharterers,
        vesselOwners: auditInspectionWorkspaceDetail?.vessel?.vesselOwners,
        createdAt: auditInspectionWorkspaceDetail?.createdAt,
        entityType: auditInspectionWorkspaceDetail?.entityType,
      },
      userInfo,
    );

    const allowEdit =
      !isEdit &&
      auditInspectionWorkspaceDetail?.auditors?.includes(userInfo?.id) &&
      userInfo?.mainCompanyId === auditInspectionWorkspaceDetail?.companyId &&
      auditInspectionWorkspaceDetail?.status !== AuditWorkspaceStatus.FINAL &&
      isCurrentDoc;
    return (
      <div className={cx(styles.headers, styles.flex)}>
        <WatchListManagement
          dynamicLabels={dynamicLabels}
          referenceModuleName={WatchlistModuleEnum.INSPECTION_WORKSPACE}
          referenceId={id}
          referenceRefId={auditInspectionWorkspaceDetail?.serialNo}
        />
        {!isEdit && (
          <Button
            className={cx('me-2', styles.buttonFilter)}
            buttonType={ButtonType.CancelOutline}
            onClick={(e) => {
              history.goBack();
            }}
          >
            <span className="">
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Back,
              )}
            </span>
          </Button>
        )}
        {allowEdit && (
          <PermissionCheck
            options={{
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
              action: ActionTypeEnum.UPDATE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <Button
                  className={cx('me-1', styles.buttonFilter)}
                  onClick={(e) => {
                    history.push(
                      `${AppRouteConst.getAuditInspectionWorkspaceById(id)}${
                        CommonQuery.EDIT
                      }`,
                    );
                  }}
                >
                  <span className="pe-2">
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Edit,
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
        )}
      </div>
    );
  }, [
    auditInspectionWorkspaceDetail?.auditors,
    auditInspectionWorkspaceDetail?.companyId,
    auditInspectionWorkspaceDetail?.createdAt,
    auditInspectionWorkspaceDetail?.entityType,
    auditInspectionWorkspaceDetail?.serialNo,
    auditInspectionWorkspaceDetail?.status,
    auditInspectionWorkspaceDetail?.vessel?.vesselCharterers,
    auditInspectionWorkspaceDetail?.vessel?.vesselDocHolders,
    auditInspectionWorkspaceDetail?.vessel?.vesselOwners,
    dynamicLabels,
    id,
    isEdit,
    userInfo,
  ]);

  return (
    <PermissionCheck
      options={{
        feature: Features.AUDIT_INSPECTION,
        subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.wrapper}>
            <div className="d-flex justify-content-between">
              <div className={styles.headers}>
                <BreadCrumb
                  current={
                    isEdit &&
                    auditInspectionWorkspaceDetail?.auditors?.includes(
                      userInfo?.id,
                    )
                      ? BREAD_CRUMB.AUDIT_INSPECTION_WORKSPACE_EDIT
                      : BREAD_CRUMB.AUDIT_INSPECTION_WORKSPACE_DETAIL
                  }
                />
                <div className={cx('fw-bold', styles.title)}>
                  {renderDynamicModuleLabel(
                    listModuleDynamicLabels,
                    DynamicLabelModuleName.AuditInspectionInspectionWorkspace,
                  )}
                </div>
              </div>
              {renderActions}
            </div>
            <AuditInspectionWorkspaceForm
              data={auditInspectionWorkspaceDetail}
              checklists={listChecklist}
              isEdit={
                isEdit &&
                auditInspectionWorkspaceDetail?.status !==
                  AuditWorkspaceStatus.FINAL
              }
              isEditRemark={isEdit}
              id={id}
              isAuditor={auditInspectionWorkspaceDetail?.auditors?.includes(
                userInfo?.id,
              )}
              dynamicLabels={dynamicLabels}
            />
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
