import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  GetIssueNotesResponse,
  CreateIssueNoteParams,
  IssueNoteDetailResponse,
  UpdateIssueNoteParams,
  CheckExitCodeParams,
} from 'models/api/issue-note/issue-note.model';
import queryString from 'query-string';
import {
  ASSETS_API_ISSUE_NOTE,
  ASSETS_API_COMPANY_SUPPORT,
} from './endpoints/config.endpoint';

export const getListIssueNotesActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetIssueNotesResponse>(
    `${ASSETS_API_ISSUE_NOTE}?${params}`,
  );
};

export const deleteIssueNoteActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_ISSUE_NOTE}/${dataParams}`);

export const createIssueNoteActionsApi = (dataParams: CreateIssueNoteParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_ISSUE_NOTE, dataParams)
    .catch((error) => Promise.reject(error));

export const getIssueNoteDetailActionsApi = (id: string) =>
  requestAuthorized.get<IssueNoteDetailResponse>(
    `${ASSETS_API_ISSUE_NOTE}/${id}`,
  );

export const updateIssueNotePermissionDetailActionsApi = (
  dataParams: UpdateIssueNoteParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_ISSUE_NOTE}/${dataParams.id}`,
    dataParams.data,
  );

export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
