import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import {
  CreateGeneralInfoBody,
  UpdateParams,
  GetAuditCheckListResponse,
  GetListAuditCheckListParams,
  GetAuditCheckListCode,
  GetAuditCheckListDetailResponse,
  GetGeneralInfoDetailResponse,
  ReorderBody,
  TimeZoneBody,
  GetROFFromIARResponsive,
  MasterData,
  ReferencesQuestion,
} from 'models/api/audit-checklist/audit-checklist.model';
import { CommonActionRequest, CommonApiParam } from 'models/common.model';
import {
  ASSETS_API_AUDIT_CHECKLIST_GENERAL_INFO,
  ASSETS_API_AUDIT_CHECKLIST,
  ASSETS_API_MASTER_TABLE,
  ASSETS_API_REPORT_OF_FINDING_IAR,
} from './endpoints/config.endpoint';

export const createGeneralInfoApi = (body: CreateGeneralInfoBody) =>
  requestAuthorized.post(`${ASSETS_API_AUDIT_CHECKLIST_GENERAL_INFO}`, body);

export const updateGeneralInfoApi = (data: UpdateParams) =>
  requestAuthorized.put(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.id}/general-info`,
    data.body,
  );

export const createQuestionApi = (data: any) =>
  requestAuthorized.post(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data?.id}/question`,
    data?.body,
  );

export const acceptAuditCheckListApi = (data: CommonActionRequest) =>
  requestAuthorized.put(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.id}/review`,
    data.body,
  );

export const reorderQuestionListApi = (data: ReorderBody) =>
  requestAuthorized.put(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.id}/question-reorder`,
    {
      questions: data.questions,
    },
  );

export const cancelAuditCheckListApi = (data: CommonActionRequest) =>
  requestAuthorized.put(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.id}/cancel`,
    data.body,
  );

export const undoSubmitAuditCheckListApi = (data: CommonActionRequest) =>
  requestAuthorized.put(`${ASSETS_API_AUDIT_CHECKLIST}/${data.id}/undo-submit`);

export const approveAuditCheckListApi = (data: CommonActionRequest) =>
  requestAuthorized.put(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.id}/approve`,
    data.body,
  );

export const deleteQuestionApi = (data: {
  idAuditChecklist: string;
  idQuestion: string;
}) =>
  requestAuthorized.delete(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.idAuditChecklist}/question/${data.idQuestion}`,
  );

export const updateQuestionApi = (data: any) =>
  requestAuthorized.put(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.idAuditChecklist}/question/${data.idQuestion}`,
    data.body,
  );

export const exportTemPlateApi = (id: string) =>
  requestAuthorized.get(
    `${ASSETS_API_AUDIT_CHECKLIST}/${id}/chk-question/export-template`,
    {
      responseType: 'blob',
    },
  );

export const uploadFileExcelApi = (id: string, dataParams: FormData) =>
  requestAuthorized.post(
    `${ASSETS_API_AUDIT_CHECKLIST}/${id}/chk-question/import`,
    dataParams,
  );

export const exportExportQuestionApi = (id: string) =>
  requestAuthorized.get(
    `${ASSETS_API_AUDIT_CHECKLIST}/${id}/chk-question/export`,
    {
      responseType: 'blob',
    },
  );

export const getQuestionDetailApi = (data: {
  idAuditChecklist: string;
  idQuestion: string;
}) =>
  requestAuthorized.get(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.idAuditChecklist}/question/${data.idQuestion}`,
  );

export const getListQuestionApi = (data: any) => {
  const params = queryString.stringify(data?.body);
  return requestAuthorized.get<GetAuditCheckListResponse>(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data?.id}/question?${params}`,
  );
};

export const deleteAuditCheckListApi = (id: string) =>
  requestAuthorized.delete(`${ASSETS_API_AUDIT_CHECKLIST}/${id}`);

export const getAuditCheckListDetailApi = (id: string) =>
  requestAuthorized.get<GetAuditCheckListDetailResponse>(
    `${ASSETS_API_AUDIT_CHECKLIST}/${id}`,
  );

export const getGeneralInfoDetailApi = (id: string) =>
  requestAuthorized.get<GetGeneralInfoDetailResponse>(
    `${ASSETS_API_AUDIT_CHECKLIST}/${id}/general-info`,
  );
export const getReferencesCategoryApi = (data?: any) => {
  const params = queryString.stringify(data);
  return requestAuthorized.get<MasterData[]>(
    `${ASSETS_API_MASTER_TABLE}?${params}`,
  );
};

export const getAuditCheckListCodeApi = (body: TimeZoneBody) =>
  requestAuthorized.post<GetAuditCheckListCode>(
    `${ASSETS_API_AUDIT_CHECKLIST}/new-code/`,
    body,
  );

export const submitAuditCheckListApi = (data: any) => {
  const { id, ...other } = data;
  return requestAuthorized.put(
    `${ASSETS_API_AUDIT_CHECKLIST}/${id}/submit`,
    other,
  );
};

export const getListAuditCheckListApi = (
  dataParams: GetListAuditCheckListParams,
) => {
  let finalParams = dataParams;
  if (finalParams.status === 'All') {
    finalParams = { ...dataParams, status: undefined };
  }
  const params = queryString.stringify(finalParams);
  return requestAuthorized.get<GetAuditCheckListResponse>(
    `${ASSETS_API_AUDIT_CHECKLIST}?${params}`,
  );
};

export const getQuestionReferencesDetailApi = (data: {
  idAuditChecklist: string;
  idQuestion: string;
}) =>
  requestAuthorized.get<ReferencesQuestion>(
    `${ASSETS_API_AUDIT_CHECKLIST}/${data.idAuditChecklist}/question/${data.idQuestion}/ref-category`,
  );

export const getROFFromIARApi = (paramsList: CommonApiParam) => {
  const params = queryString.stringify(paramsList);

  return requestAuthorized.get<GetROFFromIARResponsive>(
    `${ASSETS_API_REPORT_OF_FINDING_IAR}?${params}`,
  );
};
