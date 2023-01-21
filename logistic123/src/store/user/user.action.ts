import { DepartmentMaster } from 'models/api/department-master/department-master.model';
import {
  GetListUserParams,
  ListUserResponse,
  GetCountryParams,
  GetProvinceParams,
  CreateUserParams,
  ResetPasswordParams,
  UpdateUserManagementDetailsParams,
  ValidateUserManagementDetailsParams,
  UserUpdated,
  CreateUserSuccessResponse,
  GetListExperienceUserParams,
  GetListExperiencesUserResponse,
  ExperienceDetailResponse,
  UpdateExperienceUserParams,
  DeleteExperienceUserParams,
  CreateExperienceUserParams,
  GetListLicensesCertificationUserParams,
  GetListLicensesCertificationsUserResponse,
  LicensesCertificationDetailResponse,
  UpdateLicensesCertificationUserParams,
  DeleteLicensesCertificationUserParams,
  CreateLicensesCertificationUserParams,
} from 'models/api/user/user.model';

import {
  UserManagementDetailResponse,
  Country,
  Province,
  AvatarType,
  MessageErrorResponse,
  RoleUsers,
} from 'models/store/user/user.model';

import {
  CommonApiParam,
  CommonMessageErrorResponse,
} from 'models/common.model';

import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteUser {
  id: string;
  getListUser: () => void;
}

export const getListUserActions = createAsyncAction(
  `@user/GET_LIST_USER_ACTIONS`,
  `@user/GET_LIST_USERS_ACTIONS_SUCCESS`,
  `@user/GET_LIST_USERS_ACTIONS_FAIL`,
)<CommonApiParam, ListUserResponse, void>();

export const getListUserRecordActions = createAsyncAction(
  `@user/GET_LIST_USER_RECORD_ACTIONS`,
  `@user/GET_LIST_USER_RECORD_ACTIONS_SUCCESS`,
  `@user/GET_LIST_USER_RECORD_ACTIONS_FAIL`,
)<CommonApiParam, ListUserResponse, void>();

export const getListDepartmentActions = createAsyncAction(
  `@user/GET_LIST_DEPARTMENT_ACTIONS`,
  `@user/GET_LIST_DEPARTMENT_ACTIONS_SUCCESS`,
  `@user/GET_LIST_DEPARTMENT_ACTIONS_FAIL`,
)<CommonApiParam, DepartmentMaster[], void>();

export const deleteUserActions = createAsyncAction(
  `@user/DELETE_USER_ACTIONS`,
  `@user/DELETE_USER_ACTIONS_SUCCESS`,
  `@user/DELETE_USER_ACTIONS_FAIL`,
)<ParamsDeleteUser, void, void>();

export const exportListUserActions = createAsyncAction(
  `@user/EXPORT_LIST_USER_ACTIONS`,
  `@user/EXPORT_LIST_USER_ACTIONS_SUCCESS`,
  `@user/EXPORT_LIST_USER_ACTIONS_FAIL`,
)<GetListUserParams, void, void>();

export const clearUserManagementReducer = createAction(
  `@user/CLEAR_USER_REDUCER`,
)<void>();

export const clearErrorUserMessage = createAction(
  `@user/CLEAR_ERROR_USER_MESSAGE_REDUCER`,
)<string>();
export const sendEmailAndPhoneToStore = createAction(
  `@user/SEND_EMAIL_AND_PHONE_TO_STORE_REDUCER`,
)<UserUpdated>();

export const handleMessageError = createAction(
  `@user/HANDLE_MESSAGE_ERROR_REDUCER`,
)<CommonMessageErrorResponse>();

export const clearUserManagementDetailReducer = createAction(
  `@user/CLEAR_USER_DETAIL_REDUCER`,
)<void>();

export const getUserManagementDetailActions = createAsyncAction(
  `@user/GET_USER_DETAIL_ACTIONS`,
  `@user/GET_USER_DETAIL_ACTIONS_SUCCESS`,
  `@user/GET_USER_DETAIL_ACTIONS_FAIL`,
)<any, UserManagementDetailResponse, void>();

export const getCountryActions = createAsyncAction(
  `@user/GET_COUNTRY_ACTIONS`,
  `@user/GET_COUNTRY_ACTIONS_SUCCESS`,
  `@user/GET_COUNTRY_ACTIONS_FAIL`,
)<GetCountryParams, Country[], void>();

export const getProvinceActions = createAsyncAction(
  `@user/GET_PROVINCE_ACTIONS`,
  `@user/GET_PROVINCE_ACTIONS_SUCCESS`,
  `@user/GET_PROVINCE_ACTIONS_FAIL`,
)<GetProvinceParams, Province[], void>();

export const createNewUserManagementActions = createAsyncAction(
  `@user/CREATE_USER_CREATE_ACTIONS`,
  `@user/CREATE_USER_CREATE_ACTIONS_SUCCESS`,
  `@user/CREATE_USER_CREATE_ACTIONS_FAIL`,
)<CreateUserParams, CreateUserSuccessResponse, MessageErrorResponse[]>();

export const uploadFileActions = createAsyncAction(
  `@user/UPLOAD_FILE_ACTIONS`,
  `@user/UPLOAD_FILE_ACTIONS_SUCCESS`,
  `@user/UPLOAD_FILE_ACTIONS_FAIL`,
)<FormData, AvatarType, void>();

export const resetPasswordAdminActions = createAsyncAction(
  `@user/RESET_PASSWORD_ADMIN`,
  `@user/RESET_PASSWORD_ADMIN_SUCCESS`,
  `@user/RESET_PASSWORD_ADMIN_FAIL`,
)<ResetPasswordParams, void, void>();

export const updateUserManagementActions = createAsyncAction(
  `@user/UPDATE_USER_ACTIONS`,
  `@user/UPDATE_USER_ACTIONS_SUCCESS`,
  `@user/UPDATE_USER_ACTIONS_FAIL`,
)<
  UpdateUserManagementDetailsParams,
  MessageErrorResponse[],
  MessageErrorResponse[]
>();

export const validateUserManagementActions = createAsyncAction(
  `@user/VALIDATE_USER_ACTIONS`,
  `@user/VALIDATE_USER_ACTIONS_SUCCESS`,
  `@user/VALIDATE_USER_ACTIONS_FAIL`,
)<
  ValidateUserManagementDetailsParams,
  MessageErrorResponse[],
  MessageErrorResponse[]
>();

export const getListRoleActions = createAsyncAction(
  `@user/GET_LIST_ROLE_ACTIONS`,
  `@user/GET_LIST_ROLE_ACTIONS_SUCCESS`,
  `@user/GET_LIST_ROLE_ACTIONS_FAIL`,
)<void, RoleUsers[], void>();

// Experience

export const getListExperienceActions = createAsyncAction(
  `@user/GET_LIST_USER_EXPERIENCE_ACTIONS`,
  `@user/GET_LIST_USER_EXPERIENCE_ACTIONS_SUCCESS`,
  `@user/GET_LIST_USER_EXPERIENCE_ACTIONS_FAIL`,
)<GetListExperienceUserParams, GetListExperiencesUserResponse, void>();

export const getExperienceDetailActions = createAsyncAction(
  `@user/GET_USER_EXPERIENCE_DETAIL_ACTIONS`,
  `@user/GET_USER_EXPERIENCE_DETAIL_ACTIONS_SUCCESS`,
  `@user/GET_USER_EXPERIENCE_DETAIL_ACTIONS_FAIL`,
)<string, ExperienceDetailResponse, void>();

export const updateUserExperienceActions = createAsyncAction(
  `@user/UPDATE_USER_EXPERIENCE_ACTIONS`,
  `@user/UPDATE_USER_EXPERIENCE_ACTIONS_SUCCESS`,
  `@user/UPDATE_USER_EXPERIENCE_ACTIONS_FAIL`,
)<UpdateExperienceUserParams, void, MessageErrorResponse[]>();

export const deleteUserExperienceActions = createAsyncAction(
  `@user/DELETE_USER_EXPERIENCE_ACTIONS`,
  `@user/DELETE_USER_EXPERIENCE_ACTIONS_SUCCESS`,
  `@user/DELETE_USER_EXPERIENCE_ACTIONS_FAIL`,
)<DeleteExperienceUserParams, void, void>();

export const createUserExperienceActions = createAsyncAction(
  `@user/CREATE_USER_EXPERIENCE_ACTIONS`,
  `@user/CREATE_USER_EXPERIENCE_ACTIONS_SUCCESS`,
  `@user/CREATE_USER_EXPERIENCE_ACTIONS_FAIL`,
)<CreateExperienceUserParams, void, MessageErrorResponse[]>();

export const clearUserExperienceErrorReducer = createAction(
  `@user/CLEAR_USER_EXPERIENCE_ERROR_REDUCER`,
)<void>();

// LicensesCertification

export const getListLicensesCertificationActions = createAsyncAction(
  `@user/GET_LIST_USER_LICENSE_CERTIFICATION_ACTIONS`,
  `@user/GET_LIST_USER_LICENSE_CERTIFICATION_ACTIONS_SUCCESS`,
  `@user/GET_LIST_USER_LICENSE_CERTIFICATION_ACTIONS_FAIL`,
)<
  GetListLicensesCertificationUserParams,
  GetListLicensesCertificationsUserResponse,
  void
>();

export const getLicensesCertificationDetailActions = createAsyncAction(
  `@user/GET_USER_LICENSE_CERTIFICATION_DETAIL_ACTIONS`,
  `@user/GET_USER_LICENSE_CERTIFICATION_DETAIL_ACTIONS_SUCCESS`,
  `@user/GET_USER_LICENSE_CERTIFICATION_DETAIL_ACTIONS_FAIL`,
)<string, LicensesCertificationDetailResponse, MessageErrorResponse[]>();

export const updateUserLicensesCertificationActions = createAsyncAction(
  `@user/UPDATE_USER_LICENSE_CERTIFICATION_ACTIONS`,
  `@user/UPDATE_USER_LICENSE_CERTIFICATION_ACTIONS_SUCCESS`,
  `@user/UPDATE_USER_LICENSE_CERTIFICATION_ACTIONS_FAIL`,
)<UpdateLicensesCertificationUserParams, void, MessageErrorResponse[]>();

export const deleteUserLicensesCertificationActions = createAsyncAction(
  `@user/DELETE_USER_LICENSE_CERTIFICATION_ACTIONS`,
  `@user/DELETE_USER_LICENSE_CERTIFICATION_ACTIONS_SUCCESS`,
  `@user/DELETE_USER_LICENSE_CERTIFICATION_ACTIONS_FAIL`,
)<DeleteLicensesCertificationUserParams, void, void>();

export const createUserLicensesCertificationActions = createAsyncAction(
  `@user/CREATE_USER_LICENSE_CERTIFICATION_ACTIONS`,
  `@user/CREATE_USER_LICENSE_CERTIFICATION_ACTIONS_SUCCESS`,
  `@user/CREATE_USER_LICENSE_CERTIFICATION_ACTIONS_FAIL`,
)<CreateLicensesCertificationUserParams, void, MessageErrorResponse[]>();

export const clearUserLicensesCertificationErrorReducer = createAction(
  `@user/CLEAR_USER_LICENSE_CERTIFICATION_ERROR_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@user/UPDATE_PARAMS_LIST',
)<GetListUserParams>();
export const clearAvatar = createAction('@user/CLEAR_AVATAR')<void>();

export const getListTravelDocumentActions = createAsyncAction(
  `@user/GET_LIST_TRAVEL_DOCUMENT_ACTIONS`,
  `@user/GET_LIST_TRAVEL_DOCUMENT_ACTIONS_SUCCESS`,
  `@user/GET_LIST_TRAVEL_DOCUMENT_ACTIONS_FAIL`,
)<CommonApiParam, any, void>();

export const getListProvidedInspectionActions = createAsyncAction(
  `@user/GET_LIST_PROVIDED_INSPECTION_ACTIONS`,
  `@user/GET_LIST_PROVIDED_INSPECTION_ACTIONS_SUCCESS`,
  `@user/GET_LIST_PROVIDED_INSPECTION_ACTIONS_FAIL`,
)<CommonApiParam, any, void>();

export const updateUserProfileActions = createAsyncAction(
  `@user/UPDATE_USER_PROFILE_ACTIONS`,
  `@user/UPDATE_USER_PROFILE_ACTIONS_SUCCESS`,
  `@user/UPDATE_USER_PROFILE_ACTIONS_FAIL`,
)<
  UpdateUserManagementDetailsParams,
  MessageErrorResponse[],
  MessageErrorResponse[]
>();

export const getChildrenCompanyActions = createAsyncAction(
  `@user/GET_CHILDREN_COMPANY_ACTIONS`,
  `@user/GET_CHILDREN_COMPANY_ACTIONS_SUCCESS`,
  `@user/GET_CHILDREN_COMPANY_ACTIONS_FAIL`,
)<any, any[], void>();
