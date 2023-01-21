import { requestAuthorized } from 'helpers/request';
import {
  GetReportTemplatesParams,
  GetReportTemplatesResponse,
  ReportTemplateDetailResponse,
  UpdateReportTemplateParams,
  GetVersionReportTemplateParam,
  GetVersionReportTemplateResponse,
  ReportTemplate,
  updateReportHeaderParam,
} from 'models/api/report-template/report-template.model';
import queryString from 'query-string';
import {
  ASSETS_API_REPORT_HEADER,
  ASSETS_API_REPORT_TEMPLATE,
} from './endpoints/config.endpoint';

export const getListReportTemplatesActionsApi = (
  dataParams: GetReportTemplatesParams,
) => {
  const params = queryString.stringify(dataParams);

  return requestAuthorized.get<GetReportTemplatesResponse>(
    `${ASSETS_API_REPORT_TEMPLATE}?${params}`,
  );
};

export const deleteReportTemplateActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_REPORT_TEMPLATE}/${dataParams}`);

export const createReportTemplateActionsApi = (dataParams: ReportTemplate) =>
  requestAuthorized
    .post<void>(ASSETS_API_REPORT_TEMPLATE, dataParams)
    .catch((error) => Promise.reject(error));

export const getVersionNumberActionApi = (
  dataParams: GetVersionReportTemplateParam,
) =>
  requestAuthorized
    .post<GetVersionReportTemplateResponse>(
      `${ASSETS_API_REPORT_TEMPLATE}/new-version`,
      dataParams,
    )
    .catch((error) => Promise.reject(error));

export const updateReportHeaderActionApi = (
  dataParams: updateReportHeaderParam,
) =>
  requestAuthorized
    .put<updateReportHeaderParam>(
      `${ASSETS_API_REPORT_HEADER}/${dataParams.id}`,
      dataParams,
    )
    .catch((error) => Promise.reject(error));

export const getReportTemplateDetailActionsApi = (id: string) =>
  requestAuthorized.get<ReportTemplateDetailResponse>(
    `${ASSETS_API_REPORT_TEMPLATE}/${id}`,
  );

export const updateReportTemplateDetailActionsApi = (
  dataParams: UpdateReportTemplateParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_REPORT_TEMPLATE}/${dataParams.id}`,
    dataParams.data,
  );
