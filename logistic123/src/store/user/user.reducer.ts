import { createReducer } from 'typesafe-actions';
import { UserManagementState } from 'models/store/user/user.model';

import {
  clearUserManagementReducer,
  clearUserManagementDetailReducer,
  deleteUserActions,
  exportListUserActions,
  getListUserActions,
  getUserManagementDetailActions,
  getCountryActions,
  getChildrenCompanyActions,
  getProvinceActions,
  createNewUserManagementActions,
  uploadFileActions,
  resetPasswordAdminActions,
  updateParamsActions,
  updateUserManagementActions,
  updateUserProfileActions,
  validateUserManagementActions,
  getListRoleActions,
  clearErrorUserMessage,
  sendEmailAndPhoneToStore,
  handleMessageError,
  getListDepartmentActions,
  getListUserRecordActions,
  clearAvatar,
  deleteUserExperienceActions,
  getExperienceDetailActions,
  createUserExperienceActions,
  updateUserExperienceActions,
  getListExperienceActions,
  clearUserExperienceErrorReducer,
  deleteUserLicensesCertificationActions,
  getLicensesCertificationDetailActions,
  createUserLicensesCertificationActions,
  updateUserLicensesCertificationActions,
  getListLicensesCertificationActions,
  clearUserLicensesCertificationErrorReducer,
  getListTravelDocumentActions,
  getListProvidedInspectionActions,
} from './user.action';

const INITIAL_STATE: UserManagementState = {
  loading: true,
  disable: false,
  listUser: undefined,
  listUserRecord: undefined,
  listRolePermissionDetail: [],
  userDetailResponse: undefined,
  listCountry: [],
  listProvince: [],
  listChildrenCompany: [],
  avatar: undefined,
  messageError: [],
  params: { isLeftMenu: false },
  userUpdated: undefined,
  listDepartment: [],
  listRank: [],
  experience: null,
  licensesCertification: null,
  listTravelDocument: [],
  listProvidedInspection: [],
};

const userManagementReducer = createReducer<UserManagementState>(INITIAL_STATE)
  .handleAction(getListUserActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListUserActions.success, (state, { payload }) => ({
    ...state,
    listUser: payload,
    loading: false,
  }))
  .handleAction(getListUserActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListUserRecordActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListUserRecordActions.success, (state, { payload }) => ({
    ...state,
    listUserRecord: payload,
    loading: false,
  }))
  .handleAction(getListUserRecordActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListDepartmentActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getListDepartmentActions.success, (state, { payload }) => ({
    ...state,
    listDepartment: payload,
    loading: false,
  }))
  .handleAction(getListDepartmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteUserActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteUserActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteUserActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(exportListUserActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(exportListUserActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(exportListUserActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getUserManagementDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getUserManagementDetailActions.success,
    (state, { payload }) => ({
      ...state,
      listRolePermissionDetail: [
        ...payload?.listRolePermission?.filter(
          (item) => item?.status === 'active',
        ),
      ],
      avatar: payload?.avatar,
      listDepartment: payload.listDepartment,
      listRank: payload.listRank,
      userDetailResponse: payload?.userDetail,
      loading: false,
    }),
  )
  .handleAction(getUserManagementDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCountryActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(getCountryActions.success, (state, { payload }) => ({
    ...state,
    listCountry: payload || [],
    disable: false,
  }))
  .handleAction(getCountryActions.failure, (state) => ({
    ...state,
    disable: false,
  }))

  .handleAction(getProvinceActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(getProvinceActions.success, (state, { payload }) => ({
    ...state,
    listProvince: payload || [],
    disable: false,
  }))
  .handleAction(getProvinceActions.failure, (state) => ({
    ...state,
    disable: false,
  }))
  .handleAction(createNewUserManagementActions.request, (state) => ({
    ...state,
    disable: true,
    messageError: [],
  }))
  .handleAction(
    createNewUserManagementActions.success,
    (state, { payload }) => ({
      ...state,
      // userDetailResponse: payload,
      messageError: [],
      disable: false,
    }),
  )
  .handleAction(
    createNewUserManagementActions.failure,
    (state, { payload }) => ({
      ...state,
      messageError: payload,
      disable: false,
    }),
  )

  .handleAction(uploadFileActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(uploadFileActions.success, (state, { payload }) => ({
    ...state,
    avatar: payload,
    disable: false,
  }))
  .handleAction(uploadFileActions.failure, (state) => ({
    ...state,
    disable: false,
  }))

  .handleAction(updateUserManagementActions.request, (state) => ({
    ...state,
    disable: true,
    messageError: [],
  }))
  .handleAction(updateUserManagementActions.success, (state, { payload }) => ({
    ...state,
    messageError: [],
    loading: false,
    disable: false,
  }))
  .handleAction(updateUserManagementActions.failure, (state, { payload }) => ({
    ...state,
    messageError: payload || [],
    loading: false,
    disable: false,
  }))

  .handleAction(resetPasswordAdminActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(resetPasswordAdminActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(resetPasswordAdminActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListRoleActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getListRoleActions.success, (state, { payload }) => ({
    ...state,
    listRolePermissionDetail: payload,
    loading: false,
  }))
  .handleAction(getListRoleActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(validateUserManagementActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(
    validateUserManagementActions.success,
    (state, { payload }) => ({
      ...state,
      messageError: payload,
      disable: false,
    }),
  )
  .handleAction(
    validateUserManagementActions.failure,
    (state, { payload }) => ({
      ...state,
      messageError: payload,
      disable: false,
    }),
  )

  // Experience

  .handleAction(getListExperienceActions.request, (state, { payload }) => ({
    ...state,
    experience: { ...state.experience, loading: true },
  }))

  .handleAction(getListExperienceActions.success, (state, { payload }) => ({
    ...state,
    experience: { ...state.experience, loading: false, list: payload },
  }))

  .handleAction(getListExperienceActions.failure, (state) => ({
    ...state,
    experience: { ...state.experience, loading: false },
  }))

  .handleAction(deleteUserExperienceActions.request, (state) => ({
    ...state,
    experience: { ...state.experience, loading: true },
  }))
  .handleAction(deleteUserExperienceActions.success, (state, { payload }) => ({
    ...state,
    experience: { ...state.experience, loading: false },
  }))

  .handleAction(deleteUserExperienceActions.failure, (state) => ({
    ...state,
    experience: { ...state.experience, loading: false },
  }))

  .handleAction(createUserExperienceActions.request, (state) => ({
    ...state,
    experience: { ...state.experience, loading: true, errors: [] },
  }))
  .handleAction(createUserExperienceActions.success, (state) => ({
    ...state,
    experience: { ...state.experience, loading: false, errors: [] },
  }))
  .handleAction(createUserExperienceActions.failure, (state, { payload }) => ({
    ...state,
    experience: { ...state.experience, loading: false, errors: payload },
  }))

  .handleAction(getExperienceDetailActions.request, (state) => ({
    ...state,
    experience: { ...state.experience, loading: true, detail: null },
  }))
  .handleAction(getExperienceDetailActions.success, (state, { payload }) => ({
    ...state,
    experience: { ...state.experience, loading: false, detail: payload },
  }))
  .handleAction(getExperienceDetailActions.failure, (state) => ({
    ...state,
    experience: { ...state.experience, loading: false, detail: null },
  }))

  .handleAction(updateUserExperienceActions.request, (state) => ({
    ...state,
    experience: { ...state.experience, loading: true },
  }))
  .handleAction(updateUserExperienceActions.success, (state) => ({
    ...state,
    experience: { ...state.experience, loading: false },
  }))
  .handleAction(updateUserExperienceActions.failure, (state, { payload }) => ({
    ...state,
    experience: { ...state.experience, loading: false, errors: payload },
  }))

  .handleAction(clearUserExperienceErrorReducer, (state) => ({
    ...state,
    experience: { ...state.experience, errors: [] },
  }))

  // LicensesCertification

  .handleAction(
    getListLicensesCertificationActions.request,
    (state, { payload }) => ({
      ...state,
      licensesCertification: { ...state.licensesCertification, loading: true },
    }),
  )

  .handleAction(
    getListLicensesCertificationActions.success,
    (state, { payload }) => ({
      ...state,
      licensesCertification: {
        ...state.licensesCertification,
        loading: false,
        list: payload,
      },
    }),
  )

  .handleAction(getListLicensesCertificationActions.failure, (state) => ({
    ...state,
    licensesCertification: { ...state.licensesCertification, loading: false },
  }))

  .handleAction(deleteUserLicensesCertificationActions.request, (state) => ({
    ...state,
    licensesCertification: { ...state.licensesCertification, loading: true },
  }))
  .handleAction(
    deleteUserLicensesCertificationActions.success,
    (state, { payload }) => ({
      ...state,
      licensesCertification: { ...state.licensesCertification, loading: false },
    }),
  )

  .handleAction(deleteUserLicensesCertificationActions.failure, (state) => ({
    ...state,
    licensesCertification: { ...state.licensesCertification, loading: false },
  }))

  .handleAction(createUserLicensesCertificationActions.request, (state) => ({
    ...state,
    licensesCertification: {
      ...state.licensesCertification,
      loading: true,
      errors: [],
    },
  }))
  .handleAction(createUserLicensesCertificationActions.success, (state) => ({
    ...state,
    licensesCertification: {
      ...state.licensesCertification,
      loading: false,
      errors: [],
    },
  }))
  .handleAction(
    createUserLicensesCertificationActions.failure,
    (state, { payload }) => ({
      ...state,
      licensesCertification: {
        ...state.licensesCertification,
        loading: false,
        errors: payload,
      },
    }),
  )

  .handleAction(getLicensesCertificationDetailActions.request, (state) => ({
    ...state,
    licensesCertification: {
      ...state.licensesCertification,
      loading: true,
      detail: null,
    },
  }))
  .handleAction(
    getLicensesCertificationDetailActions.success,
    (state, { payload }) => ({
      ...state,
      licensesCertification: {
        ...state.licensesCertification,
        loading: false,
        detail: payload,
      },
    }),
  )
  .handleAction(getLicensesCertificationDetailActions.failure, (state) => ({
    ...state,
    licensesCertification: {
      ...state.licensesCertification,
      loading: false,
      detail: null,
    },
  }))

  .handleAction(updateUserLicensesCertificationActions.request, (state) => ({
    ...state,
    licensesCertification: { ...state.licensesCertification, loading: true },
  }))
  .handleAction(updateUserLicensesCertificationActions.success, (state) => ({
    ...state,
    licensesCertification: { ...state.licensesCertification, loading: false },
  }))
  .handleAction(
    updateUserLicensesCertificationActions.failure,
    (state, { payload }) => ({
      ...state,
      licensesCertification: {
        ...state.licensesCertification,
        loading: false,
        errors: payload,
      },
    }),
  )

  .handleAction(clearUserLicensesCertificationErrorReducer, (state) => ({
    ...state,
    licensesCertification: { ...state.licensesCertification, errors: [] },
  }))

  .handleAction(clearUserManagementReducer, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(clearErrorUserMessage, (state, { payload }) => ({
    ...state,
    messageError: state.messageError.filter((i) => i.fieldName !== payload),
  }))
  .handleAction(sendEmailAndPhoneToStore, (state, { payload }) => ({
    ...state,
    userUpdated: { ...state.userUpdated, ...payload },
  }))
  .handleAction(handleMessageError, (state, { payload }) => ({
    ...state,
    messageError: [
      ...state.messageError.filter((i) => i?.fieldName !== payload?.fieldName),
      payload,
    ],
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))
  .handleAction(clearAvatar, (state) => ({
    ...state,
    avatar: undefined,
  }))

  .handleAction(clearUserManagementDetailReducer, (state) => ({
    ...INITIAL_STATE,
    params: state.params,
  }))
  .handleAction(getListTravelDocumentActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
    params: payload,
  }))
  .handleAction(getListTravelDocumentActions.success, (state, { payload }) => ({
    ...state,
    listTravelDocument: payload,
    loading: false,
  }))
  .handleAction(getListTravelDocumentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    getListProvidedInspectionActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
      params: payload,
    }),
  )
  .handleAction(
    getListProvidedInspectionActions.success,
    (state, { payload }) => ({
      ...state,
      listProvidedInspection: payload,
      loading: false,
    }),
  )
  .handleAction(getListProvidedInspectionActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateUserProfileActions.request, (state) => ({
    ...state,
    disable: true,
    messageError: [],
  }))
  .handleAction(updateUserProfileActions.success, (state, { payload }) => ({
    ...state,
    messageError: [],
    disable: false,
  }))
  .handleAction(updateUserProfileActions.failure, (state, { payload }) => ({
    ...state,
    messageError: payload,
    disable: false,
  }))
  .handleAction(getChildrenCompanyActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(getChildrenCompanyActions.success, (state, { payload }) => ({
    ...state,
    listChildrenCompany: payload || [],
    disable: false,
  }))
  .handleAction(getChildrenCompanyActions.failure, (state) => ({
    ...state,
    disable: false,
  }));
export default userManagementReducer;
