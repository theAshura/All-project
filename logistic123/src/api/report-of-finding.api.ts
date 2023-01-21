import { requestAuthorized } from 'helpers/request';
import { FillAuditCheckList } from 'models/api/audit-checklist/audit-checklist.model';
import {
  ListReportOfFindingResponse,
  ReportOfFinding,
  UpdateReportOfFindingParams,
  UpdateReportOfFindingStatusParams,
  FindingItemPrevious,
  CreateReportOfFindingParams,
  UpdateNCPreviousOpen,
  NCPreviousOpen,
} from 'models/api/report-of-finding/report-of-finding.model';
import moment from 'moment';
import { CommonApiParam } from 'models/common.model';

import queryString from 'query-string';
import {
  ASSETS_API_REPORT_OF_FINDING_ITEM,
  ASSETS_API_FILL_AUDIT_CHECKLIST,
  ASSETS_API_REPORT_OF_FINDING,
  ASSETS_API_NATURE_FINDING,
} from './endpoints/config.endpoint';

export const getListReportOfFindingsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListReportOfFindingResponse>(
    `${ASSETS_API_REPORT_OF_FINDING}?${params}`,
  );
};

export const deleteReportOfFindingActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_REPORT_OF_FINDING}/${dataParams}`,
  );

export const createReportOfFindingActionsApi = (
  dataParams: CreateReportOfFindingParams,
) => {
  const { ...params } = dataParams;
  return requestAuthorized
    .post<void>(`${ASSETS_API_REPORT_OF_FINDING}`, params)
    .catch((error) => Promise.reject(error));
};

export const getReportOfFindingDetailActionsApi = (id: string) =>
  requestAuthorized.get<ReportOfFinding>(
    `${ASSETS_API_REPORT_OF_FINDING}/${id}`,
  );

export const updateReportOfFindingDetailActionsApi = (
  dataParams: UpdateReportOfFindingParams,
) => {
  const { ...params } = dataParams.body;
  return requestAuthorized.put<void>(
    `${ASSETS_API_REPORT_OF_FINDING}/${dataParams.id}`,
    params,
  );
};
export const updateReportOfFindingStatusActionsApi = (
  dataParams: UpdateReportOfFindingStatusParams,
) => {
  const { ...params } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_REPORT_OF_FINDING}/${dataParams.id}/review`,
    params.body,
  );
};
export const updateReportOfFindingReassignActionsApi = (
  dataParams: UpdateReportOfFindingStatusParams,
) => {
  const { ...params } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_REPORT_OF_FINDING}/${dataParams.id}/reassign`,
    params.body,
  );
};
export const updateReportOfFindingCloseoutStatusActionsApi = (
  dataParams: UpdateReportOfFindingStatusParams,
) => {
  const { ...params } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_REPORT_OF_FINDING}/${dataParams.id}/close-out`,
    params.body,
  );
};
export const updateReportOfFindingRecallStatusActionsApi = (id: string) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_REPORT_OF_FINDING}/${id}/undo-submit`,
  );

export const getListNCPreviousAuditActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<FindingItemPrevious[]>(
    `${ASSETS_API_REPORT_OF_FINDING_ITEM}/previous-finding-item?${params}`,
  );
};

export const getListNCPreviousOpenActionsApi = (id: string) =>
  requestAuthorized.get<NCPreviousOpen[]>(
    `${ASSETS_API_REPORT_OF_FINDING_ITEM}/${id}/previous-open-non-conformity`,
  );

export const updateNCPreviousOpenActionsApi = (
  dataParams: UpdateNCPreviousOpen,
) =>
  requestAuthorized.post<void>(
    `${ASSETS_API_REPORT_OF_FINDING_ITEM}/update-previous-open-non-conformity`,
    dataParams,
  );

export const getListNatureFindingActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any[]>(
    `${ASSETS_API_NATURE_FINDING}/previous-nc?${params}`,
  );
};
export const getFillAuditCheckListByPlanningAndRequestActionsApi = (
  id: string,
) =>
  requestAuthorized.get<FillAuditCheckList[]>(
    `${ASSETS_API_FILL_AUDIT_CHECKLIST}/fill-checklist?planningRequestId=${id}`,
  );

export const pdfROFActionsApi = (id) =>
  requestAuthorized.post<Blob>(
    `${ASSETS_API_REPORT_OF_FINDING}/${id}/create-pdf`,
    { timezone: moment.tz.guess() },
    {
      responseType: 'blob',
    },
  );

export const getRofFindingWithNoCar = (id: string) =>
  requestAuthorized.get<any>(
    `${ASSETS_API_REPORT_OF_FINDING}/${id}/items?hasCar=false`,
  );

export const getListNcPreviousNcCar = ({ rofId, planingId }) =>
  requestAuthorized.get<any>(
    `${ASSETS_API_REPORT_OF_FINDING}/${rofId}/list-previous-nc-car?planningRequestId=${planingId}`,
  );

export const updateNcPreviousCarActionsApi = (idRof: string, dataParams: any) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_REPORT_OF_FINDING}/${idRof}/update-previous-nc-car`,
    dataParams,
  );
