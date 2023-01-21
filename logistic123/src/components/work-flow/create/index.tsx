import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import {
  CreateWorkflowParams,
  WorkflowRoles,
} from 'models/api/work-flow/work-flow.model';
import HeaderPage from 'components/common/header-page/HeaderPage';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { createWorkFlowActions } from 'store/work-flow/work-flow.action';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import styles from './create.module.scss';
import WorkFlowForm, { DataForm } from '../forms/WorkFlowForm';

export default function WorkFlowCreate() {
  const dispatch = useDispatch();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
    modulePage: ModulePage.Create,
  });
  const handleSubmit = useCallback(
    (formData: DataForm) => {
      const workflowRoles: WorkflowRoles[] = [];
      let newData: CreateWorkflowParams = {
        workflowType: formData.workflowType,
      };
      if (formData?.description?.trim()) {
        newData = { ...newData, description: formData.description };
      }
      formData?.creator?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'creator',
        });
      });
      formData?.approver?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'approver',
        });
      });
      formData?.ownerManager?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'owner/manager',
        });
      });
      formData?.reviewer?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer',
        });
      });
      formData?.publisher?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'publisher',
        });
      });

      formData?.reviewer1?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer1',
        });
      });
      formData?.reviewer2?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer2',
        });
      });
      formData?.reviewer3?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer3',
        });
      });
      formData?.reviewer4?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer4',
        });
      });
      formData?.reviewer5?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer5',
        });
      });

      formData?.close_out?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'close_out',
        });
      });

      formData?.auditor?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'auditor',
        });
      });
      formData?.verification?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'verification',
        });
      });
      if (workflowRoles?.length > 0) {
        newData = { ...newData, workflowRoles };
      }

      // if (formData?.isNew) {
      //   newData = { ...newData, resetForm: formData.resetForm };
      // } else {
      newData = {
        ...newData,
        resetForm: () =>
          history.push(
            `${AppRouteConst.WORK_FLOW}?${formData?.workflowType?.replaceAll(
              ' ',
              '-',
            )}`,
          ),
      };
      // }

      dispatch(createWorkFlowActions.request(newData));
    },
    [dispatch],
  );

  return (
    <div className={styles.vesselTypeCreate}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.WORK_FLOW_CREATE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
        )}
      />
      <WorkFlowForm
        dynamicLabels={dynamicLabels}
        isEdit
        data={null}
        isCreate
        onSubmit={handleSubmit}
      />
    </div>
  );
}
