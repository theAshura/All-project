import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import {
  ASSETS_API_SELF_ASSESSMENT_HEADER,
  ASSETS_API_SELF_ASSESSMENT,
  ASSETS_API_STANDARD_MASTER,
} from 'api/endpoints/config.endpoint';
import {
  GetSelfAssessmentParams,
  GetSelfAssessmentResponse,
  SelfAssessmentDetailResponse,
  UpdateSelfAssessmentParams,
  GetVersionSelfAssessmentParam,
  GetVersionSelfAssessmentResponse,
  updateSelfAssessmentHeaderParam,
  GetSelfDeclarationResponse,
  SelfDeclarationDetailResponse,
  ReOpenDeclarationParams,
  ApproveSelfDeclarationParams,
  GetLookBackCommentResponse,
  StandardMaster,
  SelfAssessmentMatrixResponse,
  ReassignDeclarationParams,
  GetListSelfDeclarationParams,
  ComplianceAndTargetDateSelfAssessment,
} from './model';

export const getListSelfAssessmentActionsApi = (
  dataParams: GetSelfAssessmentParams,
) => {
  const params = queryString.stringify(dataParams);

  return requestAuthorized.get<GetSelfAssessmentResponse>(
    `${ASSETS_API_SELF_ASSESSMENT}?${params}`,
  );
};

export const deleteSelfAssessmentActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_SELF_ASSESSMENT}/${dataParams}`);

export const createSelfAssessmentActionsApi = (
  dataParams: SelfAssessmentDetailResponse,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_SELF_ASSESSMENT, dataParams)
    .catch((error) => Promise.reject(error));

export const getVersionNumberActionApi = (
  dataParams: GetVersionSelfAssessmentParam,
) =>
  requestAuthorized
    .post<GetVersionSelfAssessmentResponse>(
      `${ASSETS_API_SELF_ASSESSMENT}/new-version`,
      dataParams,
    )
    .catch((error) => Promise.reject(error));

export const updateSelfAssessmentHeaderActionApi = (
  dataParams: updateSelfAssessmentHeaderParam,
) =>
  requestAuthorized
    .put<updateSelfAssessmentHeaderParam>(
      `${ASSETS_API_SELF_ASSESSMENT_HEADER}/${dataParams.id}`,
      dataParams,
    )
    .catch((error) => Promise.reject(error));

export const getSelfAssessmentDetailActionsApi = (id: string) =>
  requestAuthorized.get<SelfAssessmentDetailResponse>(
    `${ASSETS_API_SELF_ASSESSMENT}/${id}`,
  );

export const updateSelfAssessmentDetailActionsApi = (
  dataParams: UpdateSelfAssessmentParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_SELF_ASSESSMENT}/${dataParams.id}`,
    dataParams.data,
  );

export const getListSelfDeclarationActionsApi = ({
  selfAssessmentId,
  params,
}: GetListSelfDeclarationParams) => {
  const p = queryString.stringify(params);
  return requestAuthorized.get<GetSelfDeclarationResponse>(
    `${ASSETS_API_SELF_ASSESSMENT}/${selfAssessmentId}/self-declaration?${p}`,
  );
};

export const getSelfDeclarationDetailActionsApi = ({ id, selfAssessmentId }) =>
  requestAuthorized.get<SelfDeclarationDetailResponse>(
    `${ASSETS_API_SELF_ASSESSMENT}/${selfAssessmentId}/self-declaration/${id}`,
  );

export const approveSelfDeclarationActionsApi = (
  dataParams: ApproveSelfDeclarationParams,
) =>
  requestAuthorized.put<SelfDeclarationDetailResponse>(
    `${ASSETS_API_SELF_ASSESSMENT}/${dataParams.selfAssessmentId}/self-declaration/${dataParams.id}`,
    dataParams.data,
  );

export const reOpenSelfDeclarationApprovedActionsApi = (
  dataParams: ReOpenDeclarationParams,
) =>
  requestAuthorized.patch<void>(
    `${ASSETS_API_SELF_ASSESSMENT}/${dataParams.selfAssessmentId}/self-declaration/re-open-self-declaration`,
    dataParams,
  );

export const reAssignSelfDeclarationApprovedActionsApi = (
  dataParams: ReassignDeclarationParams,
) =>
  requestAuthorized.patch<void>(
    `${ASSETS_API_SELF_ASSESSMENT}/${dataParams.selfAssessmentId}/self-declaration/re-assign`,
    dataParams,
  );

export const publishOfficialSelfAssessmentActionsApi = (
  selfAssessmentId: string,
) =>
  requestAuthorized.patch<void>(
    `${ASSETS_API_SELF_ASSESSMENT}/${selfAssessmentId}/publish-official`,
  );

export const unpublishSelfAssessmentActionsApi = (selfAssessmentId: string) =>
  requestAuthorized.patch<void>(
    `${ASSETS_API_SELF_ASSESSMENT}/${selfAssessmentId}/un-publish-official`,
  );

export const getListLookBackCommentActionsApi = (dataParams: any) => {
  const { id, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<GetLookBackCommentResponse>(
    `${ASSETS_API_SELF_ASSESSMENT}/${dataParams.selfAssessmentId}/self-declaration/${id}/loop-back-comment?${params}`,
  );
};

export const getStandardMasterDetailActionsApi = (id: string) =>
  requestAuthorized.get<StandardMaster>(`${ASSETS_API_STANDARD_MASTER}/${id}`);

export const getSelfAssessmentMatrixActionsApi = ({ selfAssessmentId }) =>
  requestAuthorized.get<SelfAssessmentMatrixResponse>(
    `${ASSETS_API_SELF_ASSESSMENT}/${selfAssessmentId}/self-declaration/matrix`,
  );

export const updateComplianceAndTargetDateApi = (
  params: ComplianceAndTargetDateSelfAssessment,
) => {
  const {
    selfAssessmentId,
    selfDeclaration,
    complianceId,
    targetCompletionDate,
  } = params;
  return requestAuthorized.patch<void>(
    `${ASSETS_API_SELF_ASSESSMENT}/${selfAssessmentId}/self-declaration/${selfDeclaration}`,
    {
      complianceId,
      targetCompletionDate,
    },
  );
};
