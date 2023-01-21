import { requestAuthorized } from 'helpers/request';
import {
  GetListUserParams,
  GetCountryParams,
  GetProvinceParams,
  CreateUserParams,
  ResetPasswordParams,
  UpdateUserManagementDetailsParams,
  ValidateUserManagementDetailsParams,
  ListUserRecordResponse,
  GetListExperienceUserParams,
  UpdateExperienceUserParams,
  GetListExperiencesUserResponse,
  ExperienceDetailResponse,
  CreateExperienceUserParams,
  GetListLicensesCertificationUserParams,
  GetListLicensesCertificationsUserResponse,
  CreateLicensesCertificationUserParams,
  UpdateLicensesCertificationUserParams,
  LicensesCertificationDetailResponse,
  TravelDocumentResponse,
  TravelDocument,
} from 'models/api/user/user.model';
import {
  TravelDocumentCreation,
  UserDetailResponsive,
  UpdateProvidedInspection,
} from 'models/store/user/user.model';
import { Image } from 'models/api/support.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  AUTH_API_USER,
  SUPPORT_API_COUNTRY,
  SUPPORT_API_UPLOAD,
  ASSETS_USER_EXPERIENCE,
  ASSETS_USER_LICENSE_CERTIFICATION,
  ASSETS_API,
} from './endpoints/config.endpoint';

export const getListUserActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<CommonApiParam>(`${AUTH_API_USER}?${params}`);
};

export const getListUserRecordActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListUserRecordResponse>(
    `${AUTH_API_USER}/support-other-module?${params}`,
  );
};

export const deleteUserActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${AUTH_API_USER}/${dataParams}`);

export const exportListUserActionsApi = (dataParams: GetListUserParams) => {
  const params = queryString.stringify(dataParams.data);
  const paramsPost = queryString.stringify({
    exportType: dataParams.exportType,
  });
  return requestAuthorized.post<GetListUserParams>(
    `${AUTH_API_USER}/export?${params}`,
    paramsPost,
  );
};

export const getCountryActionsApi = (dataParams: GetCountryParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCountryParams>(
    `${SUPPORT_API_COUNTRY}?${params}`,
  );
};

export const getProvinceActionsApi = (dataParams: GetProvinceParams) => {
  const params = queryString.stringify(dataParams?.data);
  return requestAuthorized.get<GetProvinceParams>(
    `${SUPPORT_API_COUNTRY}/${dataParams.countryId}/province?${params}`,
  );
};

export const createNewUserManagementApi = (dataParams: CreateUserParams) =>
  requestAuthorized.post<GetListUserParams>(AUTH_API_USER, dataParams);

export const uploadFileApi = (dataParams: FormData) =>
  requestAuthorized.post<Image[]>(SUPPORT_API_UPLOAD, dataParams);

export const getUrlImageApi = (id: string) =>
  requestAuthorized.get<Image>(`${SUPPORT_API_UPLOAD}/${id}/detail`);

export const getUserManagementDetailApi = (id: string) =>
  requestAuthorized
    .get<UserDetailResponsive>(`${AUTH_API_USER}/${id}/detail`)
    .catch((error) => Promise.reject(error));

export const getUserProfileDetailApi = () =>
  requestAuthorized
    .get<UserDetailResponsive>(`${AUTH_API_USER}/my-profile`)
    .catch((error) => Promise.reject(error));

export const resetPasswordAdminApi = (params: ResetPasswordParams) =>
  requestAuthorized.post<
    Pick<ResetPasswordParams, 'oldPassword' | 'newPassword' | 'confirmPassword'>
  >(`${AUTH_API_USER}/${params.id}/reset-password`, {
    oldPassword: params.oldPassword,
    newPassword: params.newPassword,
    confirmPassword: params.confirmPassword,
  });

export const resetPasswordUserApi = (params: ResetPasswordParams) =>
  requestAuthorized.put<
    Pick<ResetPasswordParams, 'oldPassword' | 'newPassword' | 'confirmPassword'>
  >(`${AUTH_API_USER}/me/change-password`, {
    oldPassword: params.oldPassword,
    newPassword: params.newPassword,
    confirmPassword: params.confirmPassword,
  });

export const updateUserManagementApi = (
  dataParams: UpdateUserManagementDetailsParams,
) =>
  requestAuthorized
    .put<void>(`${AUTH_API_USER}/${dataParams?.id}`, dataParams?.data)
    .catch((error) => Promise.reject(error));

export const validateUserManagementDetailApi = (
  dataParams: ValidateUserManagementDetailsParams,
) => {
  const { data } = dataParams;

  return requestAuthorized
    .post<void>(`${AUTH_API_USER}/check-existed`, data)
    .catch((error) => Promise.reject(error));
};

// Experience

export const getListUserExperienceActionsApi = (
  dataParams: GetListExperienceUserParams,
) => {
  const { params, id } = dataParams;

  const paramList = queryString.stringify(params);
  return requestAuthorized.get<GetListExperiencesUserResponse>(
    `${ASSETS_API}/${id}/experiences?${paramList}`,
  );
};

export const createUserExperienceApi = (
  dataParams: CreateExperienceUserParams,
) => requestAuthorized.post<void>(ASSETS_USER_EXPERIENCE, dataParams);

export const updateUserExperienceApi = (
  dataParams: UpdateExperienceUserParams,
) =>
  requestAuthorized
    .put<void>(`${ASSETS_USER_EXPERIENCE}/${dataParams?.id}`, dataParams?.data)
    .catch((error) => Promise.reject(error));

export const getUserExperienceDetailApi = (id: string) =>
  requestAuthorized
    .get<ExperienceDetailResponse>(`${ASSETS_USER_EXPERIENCE}/${id}`)
    .catch((error) => Promise.reject(error));

export const deleteUserExperienceActionsApi = (id: string) =>
  requestAuthorized.delete<void>(`${ASSETS_USER_EXPERIENCE}/${id}`);

// LicensesCertification

export const getListUserLicensesCertificationActionsApi = (
  dataParams: GetListLicensesCertificationUserParams,
) => {
  const { params, id } = dataParams;

  const paramList = queryString.stringify(params);
  return requestAuthorized.get<GetListLicensesCertificationsUserResponse>(
    `${ASSETS_API}/${id}/license-certification?${paramList}`,
  );
};

export const createUserLicensesCertificationApi = (
  dataParams: CreateLicensesCertificationUserParams,
) =>
  requestAuthorized.post<void>(ASSETS_USER_LICENSE_CERTIFICATION, dataParams);

export const updateUserLicensesCertificationApi = (
  dataParams: UpdateLicensesCertificationUserParams,
) =>
  requestAuthorized
    .put<void>(
      `${ASSETS_USER_LICENSE_CERTIFICATION}/${dataParams?.id}`,
      dataParams?.data,
    )
    .catch((error) => Promise.reject(error));

export const getUserLicensesCertificationDetailApi = (id: string) =>
  requestAuthorized
    .get<LicensesCertificationDetailResponse>(
      `${ASSETS_USER_LICENSE_CERTIFICATION}/${id}`,
    )
    .catch((error) => Promise.reject(error));

export const deleteUserLicensesCertificationActionsApi = (id: string) =>
  requestAuthorized.delete<void>(`${ASSETS_USER_LICENSE_CERTIFICATION}/${id}`);
export const getTravelDocumentApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<TravelDocumentResponse>(
    `/assets/api/v1/${dataParams?.id}/travel-document?${params}`,
  );
};

export const createTravelDocumentApi = (dataParams: TravelDocumentCreation) =>
  requestAuthorized.post<string>('/assets/api/v1/travel-document', dataParams);

export const updateTravelDocumentApi = (dataParams: TravelDocumentCreation) =>
  requestAuthorized.put<string>(
    `/assets/api/v1/travel-document/${dataParams.id}`,
    dataParams,
  );

export const deleteTravelDocumentApi = (id: string) =>
  requestAuthorized.delete<void>(`/assets/api/v1/travel-document/${id}`);

export const getDetailTravelDocumentApi = (id: string) =>
  requestAuthorized.get<TravelDocument>(`/assets/api/v1/travel-document/${id}`);

export const getListProvidedInspection = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(
    `${AUTH_API_USER}/${dataParams?.id}/provided-inspection?${params}`,
  );
};

export const getDetailProvidedInspectionApi = (id: string, userId: string) =>
  requestAuthorized.get<any>(
    `${AUTH_API_USER}/{userId}/provided-inspection/${id}`,
  );

export const updateProvidedInspectionApi = (
  dataParams: UpdateProvidedInspection,
  id: string,
) =>
  requestAuthorized.put<string>(
    `${AUTH_API_USER}/${id}/provided-inspection`,
    dataParams,
  );

export const updateUserProfileApi = (
  dataParams: UpdateUserManagementDetailsParams,
) =>
  requestAuthorized
    .put<void>(`/assets/api/v1/user/my-profile`, dataParams?.data)
    .catch((error) => Promise.reject(error));
