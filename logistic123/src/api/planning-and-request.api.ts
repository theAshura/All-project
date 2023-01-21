import { requestAuthorized } from 'helpers/request';
import { AuditCheckList } from 'models/api/audit-checklist/audit-checklist.model';
import {
  CancelPlanningAndRequestParams,
  ListPlanningAndRequestResponse,
  PlanningAndRequest,
  UpdatePlanningAndRequestParams,
  UpdatePlanningAndRequestStatusParams,
  GetMailTemplate,
  ListAuditLogResponse,
} from 'models/api/planning-and-request/planning-and-request.model';
import { CommonApiParam, HistoryResponse } from 'models/common.model';
import queryString from 'query-string';
import moment from 'moment';
import { ASSETS_API_PLANNING_AND_REQUEST } from './endpoints/config.endpoint';

export const getListPlanningAndRequestsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.post<ListPlanningAndRequestResponse>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/list?${params}`,
  );
};

export const deletePlanningAndRequestActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${dataParams}`,
  );

export const createPlanningAndRequestActionsApi = (
  dataParams: PlanningAndRequest,
) => {
  const { isSubmit, ...params } = dataParams;
  return requestAuthorized
    .post<void>(
      `${ASSETS_API_PLANNING_AND_REQUEST}${
        isSubmit ? '?isSubmitted=true' : ''
      }`,
      params,
    )
    .catch((error) => Promise.reject(error));
};

export const getPlanningAndRequestDetailActionsApi = (id: string) =>
  requestAuthorized.get<PlanningAndRequest>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${id}`,
  );

export const updatePlanningAndRequestDetailActionsApi = (
  dataParams: UpdatePlanningAndRequestParams,
) => {
  const { isSubmit, ...params } = dataParams.body;
  return requestAuthorized.put<void>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${dataParams.id}${
      isSubmit ? '?isSubmitted=true' : ''
    }`,
    params,
  );
};
export const updatePlanningAndRequestStatusActionsApi = (
  dataParams: UpdatePlanningAndRequestStatusParams,
) => {
  const params = queryString.stringify(dataParams?.params);
  return requestAuthorized.post<void>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${dataParams.id}${
      dataParams?.status ? `/${dataParams?.status}` : ''
    }${params?.length > 0 ? `?${params}` : ''}`,
    dataParams.body,
  );
};

export const pdfPlanningAndRequestActionsApi = (id) =>
  requestAuthorized.post<Blob>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${id}/create-pdf`,
    {
      timezone: moment.tz.guess(),
    },
    {
      responseType: 'blob',
    },
  );

export const cancelPlanningAndRequestStatusActionsApi = (
  dataParams: CancelPlanningAndRequestParams,
) =>
  requestAuthorized.post<void>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${dataParams.id}/cancel`,
    dataParams.body,
  );

export const getAuditCheckListByPlanningAndRequestActionsApi = (id: string) =>
  requestAuthorized.get<AuditCheckList[]>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${id}/audit-checklist`,
  );

export const checkAvailableAuditors = (params: any) =>
  requestAuthorized.post<AuditCheckList[]>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/check-available-auditors`,
    params,
  );

export const acceptPlanningAndRequestAuditorApi = (params: any) =>
  requestAuthorized.post<any>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${params.id}/auditor-accept`,
    params.body,
  );

export const acceptPlanningAndRequestAuditeeApi = (params: any) =>
  requestAuthorized.post<any>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${params.id}/auditee-accept`,
    params.body,
  );

export const getListPlanningAndRequestGroupByAuditorsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListPlanningAndRequestResponse>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/graphical-plan?${params}`,
  );
};

export const getDetailParGroupByAuditor = (id: string) =>
  requestAuthorized.get<PlanningAndRequest>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${id}/general`,
  );

export const getTotalUnplannedPlanningApi = () =>
  requestAuthorized.get<number>(
    `assets/api/v1/total-unplanned-planning-request`,
  );

export const sendEmailPlanningApiRequest = (dataParams: any) => {
  const { id, ...params } = dataParams;
  return requestAuthorized
    .post<void>(
      `assets/api/v1/mail-send/planning-request/${id}/mail-send`,
      params,
    )
    .catch((error) => Promise.reject(error));
};

export const getListDraftEmailApi = (id: string) =>
  requestAuthorized.get<number>(
    `assets/api/v1/mail-send/planning-request/${id}/mail-send`,
  );

export const updateEmailPlanningApiRequest = (dataParams: any) => {
  const { id, mailSendId, ...params } = dataParams;
  return requestAuthorized
    .put<void>(
      `assets/api/v1/mail-send/planning-request/${id}/mail-send/${mailSendId}`,
      params,
    )
    .catch((error) => Promise.reject(error));
};

export const getMailTemplateApi = (dataParams: GetMailTemplate) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(
    `/assets/api/v1/mail-template/module?${params}
    `,
  );
};

export const getPlanningRequestAuditLogApiRequest = (
  dataParams: CommonApiParam,
) => {
  const { id } = dataParams;
  return requestAuthorized.get<ListAuditLogResponse>(
    `${ASSETS_API_PLANNING_AND_REQUEST}/${id}/audit-log`,
  );
};

export const getHistoryApiRequest = (dataParams: any) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized
    .post<HistoryResponse>(`${ASSETS_API_PLANNING_AND_REQUEST}/list?${params}`)
    .catch((error) => Promise.reject(error));
};
