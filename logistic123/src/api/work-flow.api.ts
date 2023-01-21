import { requestAuthorized } from 'helpers/request';
import {
  ListWorkFlowResponse,
  ParamsListWorkFlow,
  WorkflowRoleDetail,
  CreateWorkflowParams,
} from 'models/api/work-flow/work-flow.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_WORK_FLOW } from './endpoints/config.endpoint';

export const getListWorkFlowActionsApi = (dataParams: ParamsListWorkFlow) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListWorkFlowResponse>(
    `${ASSETS_API_WORK_FLOW}?${params}`,
  );
};

export const getDetailWorkFlowActionApi = (id: string) =>
  requestAuthorized.get<WorkflowRoleDetail>(`${ASSETS_API_WORK_FLOW}/${id}`);

export const createWorkFlowActionsApi = (dataParams: CreateWorkflowParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_WORK_FLOW, dataParams)
    .catch((error) => Promise.reject(error));

export const updateWorkFlowActionApi = (data: CreateWorkflowParams) => {
  const { id, ...dataBody } = data;
  return requestAuthorized
    .put<void>(`${ASSETS_API_WORK_FLOW}/${id}`, dataBody)
    .catch((error) => Promise.reject(error));
};

export const deleteWorkFlowActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_WORK_FLOW}/${dataParams}`);

export const getWorkFlowActiveUserPermissionApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get(
    `${ASSETS_API_WORK_FLOW}/active-user-permission?${params}`,
  );
};

export const getListAuditorsApi = (params: CommonApiParam) =>
  requestAuthorized.post(
    `${ASSETS_API_WORK_FLOW}/planning-request/auditors?`,
    params,
  );

export const getWorkFlowTypePermissionApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get(
    `${ASSETS_API_WORK_FLOW}/user/workflow-type-permission?${params}`,
  );
};

export const getWorkFlowPermissionStepApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get(
    `${ASSETS_API_WORK_FLOW}/user/workflow-type-permission-step?${params}`,
  );
};
