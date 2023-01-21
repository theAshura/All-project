import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  deleteUserActionsApi,
  exportListUserActionsApi,
  getListUserActionsApi,
  getCountryActionsApi,
  getProvinceActionsApi,
  createNewUserManagementApi,
  uploadFileApi,
  getUrlImageApi,
  getUserManagementDetailApi,
  getUserProfileDetailApi,
  resetPasswordAdminApi,
  resetPasswordUserApi,
  updateUserManagementApi,
  validateUserManagementDetailApi,
  getListUserRecordActionsApi,
  getListUserExperienceActionsApi,
  createUserExperienceApi,
  updateUserExperienceApi,
  getUserExperienceDetailApi,
  deleteUserExperienceActionsApi,
  getListUserLicensesCertificationActionsApi,
  createUserLicensesCertificationApi,
  updateUserLicensesCertificationApi,
  getUserLicensesCertificationDetailApi,
  deleteUserLicensesCertificationActionsApi,
  getTravelDocumentApi,
  getListProvidedInspection,
  updateUserProfileApi,
} from 'api/user.api';
import { RoleScope } from 'constants/roleAndPermission.const';
import { getListDepartmentMasterActionsApi } from 'api/department-master.api';
import { getListChildCompanyApi } from 'api/company.api';
import {
  UserManagementDetailStore,
  AvatarType,
  AvailableAreaItem,
  MessageErrorResponse,
} from 'models/store/user/user.model';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { getRoleForUserApi } from 'api/role.api';
import {
  deleteUserActions,
  exportListUserActions,
  getListUserActions,
  getUserManagementDetailActions,
  getCountryActions,
  getProvinceActions,
  createNewUserManagementActions,
  uploadFileActions,
  resetPasswordAdminActions,
  updateUserManagementActions,
  validateUserManagementActions,
  getListRoleActions,
  getListDepartmentActions,
  getListUserRecordActions,
  getListExperienceActions,
  getExperienceDetailActions,
  updateUserExperienceActions,
  deleteUserExperienceActions,
  createUserExperienceActions,
  getListLicensesCertificationActions,
  getLicensesCertificationDetailActions,
  updateUserLicensesCertificationActions,
  deleteUserLicensesCertificationActions,
  createUserLicensesCertificationActions,
  getListTravelDocumentActions,
  getListProvidedInspectionActions,
  updateUserProfileActions,
  getChildrenCompanyActions,
} from './user.action';
import { RootState } from '../reducer';

function* getListUserSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListUserActionsApi, other);

    const { data } = response;
    yield put(getListUserActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListUserActions.failure());
  }
}

function* getListUserRecordSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListUserRecordActionsApi, other);

    const { data } = response;
    yield put(getListUserRecordActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListUserRecordActions.failure());
  }
}

function* getListRoleSaga() {
  try {
    const response = yield call(getRoleForUserApi, {
      pageSize: -1,
    });
    const { data } = response;
    yield put(getListRoleActions.success(data?.data || []));
  } catch (e) {
    toastError(e);
    yield put(getListRoleActions.failure());
  }
}

function* deleteUserSaga(action) {
  try {
    yield call(deleteUserActionsApi, action.payload?.id);
    toastSuccess('You have deleted successfully');
    yield put(deleteUserActions.success());
    action.payload?.getListUser();
  } catch (e) {
    toastError(e);
    yield put(deleteUserActions.failure());
  }
}
function* exportUserSaga(action) {
  try {
    const response = yield call(exportListUserActionsApi, action.payload);
    const link = document.createElement('a');
    const blob = new Blob([response.data], { type: 'text/csv' });
    const csvUrl = window.webkitURL.createObjectURL(blob);
    link.download = 'Users.csv';
    link.href = csvUrl;
    link.click();
    yield put(exportListUserActions.success());
  } catch (error) {
    toastError(error);
    yield put(exportListUserActions.failure());
  }
}

function* getUserManagementDetailSaga(action) {
  try {
    const responseRoleAndPermissions = yield call(getRoleForUserApi, {
      pageSize: -1,
    });
    let responseUserDetail;
    const countryDefault = yield call(getCountryActionsApi, { content: '' });

    let provinceDefault;
    let countryDetail;
    let nationalityDetail;
    let provinceDetail;
    let avatar: AvatarType;
    let responseImage;
    let strong: AvailableAreaItem[] = [];
    let no: AvailableAreaItem[] = [];
    let neutral: AvailableAreaItem[] = [];
    let totalAvailableArea: AvailableAreaItem[] = [];
    let switchableCompanies;
    let listChildrenCompany = [];

    if (action?.payload?.id) {
      if (action?.payload?.isUserProfile) {
        responseUserDetail = yield call(getUserProfileDetailApi);
      } else {
        responseUserDetail = yield call(
          getUserManagementDetailApi,
          action?.payload?.id,
        );
      }
      provinceDefault = yield call(getProvinceActionsApi, {
        countryId: responseUserDetail?.data?.country,
        data: { content: '' },
      });

      countryDetail = countryDefault?.data?.filter(
        (country) => country?.name === responseUserDetail?.data?.country,
      );

      nationalityDetail = countryDefault?.data?.filter(
        (country) =>
          country?.nationality === responseUserDetail?.data?.nationality,
      );

      provinceDetail = provinceDefault?.data?.filter(
        (province) =>
          province?.name === responseUserDetail?.data?.stateOrProvince,
      );
      if (responseUserDetail?.data?.avatar) {
        responseImage = yield call(
          getUrlImageApi,
          responseUserDetail?.data?.avatar,
        );

        avatar = {
          id: responseUserDetail?.data?.avatar,
          url: responseImage?.data?.link,
        };
      }
      totalAvailableArea = responseUserDetail?.data?.availableAreas?.map(
        (item) => {
          const countryFilter = countryDefault?.data?.filter(
            (itemCountry) =>
              itemCountry?.id?.toString() === item?.country?.toString(),
          );
          return {
            country: {
              value: countryFilter && countryFilter[0]?.id,
              label: countryFilter && countryFilter[0]?.name,
              image: countryFilter && countryFilter[0]?.flagImg,
            },
            ports: item?.ports?.length
              ? item?.ports?.map((i) => ({
                  value: i.id,
                  portCode: i?.code,
                  portName: i?.name,
                  content: `${i.code} - ${i.name}`,
                }))
              : [],
            preference: item?.preference,
          };
        },
      );
      strong = totalAvailableArea?.filter((i) => i?.preference === 'strong');
      neutral = totalAvailableArea?.filter((i) => i?.preference === 'neutral');
      no = totalAvailableArea?.filter((i) => i?.preference === 'no');
      if (responseUserDetail?.data?.companyId) {
        listChildrenCompany = yield call(getListChildCompanyApi, {
          companyId: responseUserDetail?.data?.companyId,
          status: 'active',
        });

        switchableCompanies =
          responseUserDetail?.data?.switchableCompanies?.map((item) => ({
            label:
              listChildrenCompany?.data?.find((i) => i?.id === item)?.name ||
              [],
            value: item,
          }));
      }
    }

    // const ranksResponse =
    //   (userInfo?.roleScope !== 'SuperAdmin' &&
    //     (yield call(getListRankMasterActionsApi, {
    //       page: 1,
    //       pageSize: -1,
    //       status: 'active',
    //     }))) ||
    //   null;

    // const paramDepartment = responseUserDetail?.data?.rankId
    //   ? {
    //       page: 1,
    //       pageSize: -1,
    //       status: 'active',
    //       rankId: responseUserDetail?.data?.rankId,
    //     }
    //   : {
    //       page: 1,
    //       pageSize: -1,
    //       status: 'active',
    //     };
    // const departmentsResponse =
    //   (userInfo?.roleScope !== 'SuperAdmin' &&
    //     (yield call(getListDepartmentMasterActionsApi, paramDepartment))) ||
    //   null;

    const dataDetail: UserManagementDetailStore = {
      ...responseUserDetail?.data,
      switchableCompanies,
      availableAreas: {
        no,
        strong,
        neutral,
      },

      nationality: {
        value: nationalityDetail && nationalityDetail[0]?.nationality,
        label: nationalityDetail && nationalityDetail[0]?.nationality,
      },
      country: {
        value: countryDetail && countryDetail[0]?.name,
        label: countryDetail && countryDetail[0]?.name,
        image: countryDetail && countryDetail[0]?.flagImg,
      },
      stateOrProvince: {
        value: provinceDetail && provinceDetail[0]?.name,
        label: provinceDetail && provinceDetail[0]?.name,
      },
    };

    const { data } = responseRoleAndPermissions;

    if (listChildrenCompany?.data) {
      yield put(getChildrenCompanyActions.success(listChildrenCompany?.data));
    }
    yield put(
      getUserManagementDetailActions.success({
        listRolePermission: data?.data || [],
        userDetail: dataDetail,
        avatar,
        listDepartment: [],
        listRank: [],
        // listDepartment: departmentsResponse?.data?.data || [],
        // listRank: ranksResponse?.data?.data || [],
      }),
    );
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.USER);
    }

    yield put(getUserManagementDetailActions.failure());
  }
}

function* getCountrySaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;
    const response = yield call(getCountryActionsApi, other);
    const { data } = response;
    yield put(getCountryActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCountryActions.failure());
  }
}

function* getProvinceSaga(action) {
  try {
    const response = yield call(getProvinceActionsApi, action.payload);
    const { data } = response;
    yield put(getProvinceActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getProvinceActions.failure());
  }
}

function* createNewUserManagementSaga(action) {
  try {
    const { avatar } = yield select((state: RootState) => state.user);
    const { handleSuccess, ...params } = action.payload;

    const response = yield call(createNewUserManagementApi, {
      ...params,
      avatar: avatar?.id,
    });
    const { data } = response;
    toastSuccess('You have created successfully');
    if (handleSuccess) {
      handleSuccess?.(data?.id);
    }
    yield put(getUserManagementDetailActions.request({ id: data.id }));

    yield put(createNewUserManagementActions.success());
  } catch (e) {
    toastError(e);
    yield put(createNewUserManagementActions.failure(e));
  }
}

function* updateUserManagementSaga(action) {
  try {
    const { avatar } = yield select((state: RootState) => state.user);
    const { handleSuccess, data } = action.payload;
    yield call(updateUserManagementApi, {
      ...action.payload,
      data: { ...data, avatar: avatar?.id },
    });
    toastSuccess('You have updated successfully');
    if (handleSuccess) {
      handleSuccess?.();
    }
    yield put(updateUserManagementActions.success());
  } catch (e) {
    toastError(e);
    if (e?.statusCode !== 400) {
      yield put(updateUserManagementActions.failure(e));
    } else if (e?.statusCode === 400) {
      yield put(updateUserManagementActions.failure([]));
    } else {
      yield put(updateUserManagementActions.failure(e));
    }
  }
}

function* updateUserProfileSaga(action) {
  try {
    const { avatar } = yield select((state: RootState) => state.user);
    const { handleSuccess, data } = action.payload;
    yield call(updateUserProfileApi, {
      ...action.payload,
      data: { ...data, avatar: avatar?.id },
    });
    toastSuccess('You have updated successfully');
    if (handleSuccess) {
      handleSuccess?.();
    }
    yield put(updateUserProfileActions.success());
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    } else if (e?.statusCode === 400) {
      toastError(e);
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(updateUserProfileActions.failure(messageTotal || []));
    } else {
      toastError(e);
      yield put(updateUserProfileActions.failure(e));
    }
  }
}

function* uploadFileSaga(action) {
  try {
    const response = yield call(uploadFileApi, action.payload);
    const { data } = response;
    yield put(
      uploadFileActions.success({
        id: data && data[0]?.id,
        url: data && data[0]?.link,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(uploadFileActions.failure());
  }
}

function* resetPasswordAdminSaga(action) {
  try {
    const { handleSuccess, isProfile } = action.payload;
    let response = null;
    const { userInfo } = yield select((state: RootState) => state.authenticate);

    if (
      (userInfo?.roleScope === RoleScope.User ||
        userInfo?.roleScope === RoleScope.SuperAdmin) &&
      isProfile
    ) {
      response = yield call(resetPasswordUserApi, action.payload);
    } else {
      response = yield call(resetPasswordAdminApi, action.payload);
    }

    const { data } = response;

    if (handleSuccess) {
      handleSuccess?.();
    }
    yield put(resetPasswordAdminActions.success(data));
    toastSuccess('You have reset password successfully');
  } catch (e) {
    toastError(e);
    yield put(resetPasswordAdminActions.failure());
  }
}

function* validateUserManagementSaga(action) {
  const { messageError } = yield select((state: RootState) => state.user);
  const checkError: string[] = [];
  Object.keys(action.payload?.data).forEach((key) => {
    checkError.push(key);
  });
  const messageSuccess: MessageErrorResponse[] = messageError?.filter(
    (i) => !checkError?.includes(i?.fieldName),
  );
  try {
    yield call(validateUserManagementDetailApi, action.payload?.data);
    yield put(validateUserManagementActions.success(messageSuccess));
    action.payload?.handleValidate(messageSuccess);
  } catch (e) {
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(
        validateUserManagementActions.failure(
          [...messageSuccess, ...messageTotal] || [],
        ),
      );
      action.payload?.handleValidate(
        [...messageSuccess, ...messageTotal] || [],
      );
    } else {
      yield put(validateUserManagementActions.failure(messageSuccess));
      action.payload?.handleValidate(messageSuccess || []);
    }
  }
}

function* getListDepartmentSaga(action) {
  try {
    const response = yield call(
      getListDepartmentMasterActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getListDepartmentActions.success(data?.data || []));
  } catch (e) {
    toastError(e);
    yield put(getListDepartmentActions.failure());
  }
}

// Experience

function* getListUserExperienceSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;

    const response = yield call(getListUserExperienceActionsApi, other);

    const { data } = response;
    yield put(getListExperienceActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListExperienceActions.failure());
  }
}

function* createUserExperienceSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;

    const response = yield call(createUserExperienceApi, params);
    const { data } = response;

    if (handleSuccess) {
      handleSuccess?.();
    }
    toastSuccess('You have created successfully');
    yield put(createUserExperienceActions.success(data));
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];
      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(createUserExperienceActions.failure(messageTotal || []));
    } else {
      yield put(createUserExperienceActions.failure(e));
    }
  }
}

function* updateUserExperienceSaga(action) {
  try {
    const { handleSuccess, data, id } = action.payload;
    yield call(updateUserExperienceApi, {
      data,
      id,
    });
    toastSuccess('You have updated successfully');
    if (handleSuccess) {
      handleSuccess?.();
    }
    yield put(updateUserExperienceActions.success());
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    } else if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(updateUserExperienceActions.failure(messageTotal || []));
    } else {
      yield put(updateUserExperienceActions.failure(e));
    }
  }
}

function* getUserExperienceDetailSaga(action) {
  try {
    const response = yield call(getUserExperienceDetailApi, action.payload);
    const { data } = response;

    yield put(getExperienceDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    } else if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(getExperienceDetailActions.failure(messageTotal || []));
    } else {
      yield put(getExperienceDetailActions.failure(e));
    }
  }
}

function* deleteUserExperienceSaga(action) {
  try {
    const { handleSuccess, id } = action.payload;

    yield call(deleteUserExperienceActionsApi, id);
    if (handleSuccess) {
      handleSuccess?.();
    }
    yield put(deleteUserExperienceActions.success());

    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteUserExperienceActions.failure());
  }
}

// LicensesCertification

function* getListUserLicensesCertificationSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;

    const response = yield call(
      getListUserLicensesCertificationActionsApi,
      other,
    );

    const { data } = response;
    yield put(getListLicensesCertificationActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListLicensesCertificationActions.failure());
  }
}

function* createUserLicensesCertificationSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;

    const response = yield call(createUserLicensesCertificationApi, params);
    const { data } = response;

    if (handleSuccess) {
      handleSuccess?.();
    }
    toastSuccess('You have created successfully');
    yield put(createUserLicensesCertificationActions.success(data));
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];
      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(
        createUserLicensesCertificationActions.failure(messageTotal || []),
      );
    } else {
      yield put(createUserLicensesCertificationActions.failure(e));
    }
  }
}

function* updateUserLicensesCertificationSaga(action) {
  try {
    const { handleSuccess, data, id } = action.payload;
    yield call(updateUserLicensesCertificationApi, {
      data,
      id,
    });
    toastSuccess('You have updated successfully');
    if (handleSuccess) {
      handleSuccess?.();
    }
    yield put(updateUserLicensesCertificationActions.success());
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    } else if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(
        updateUserLicensesCertificationActions.failure(messageTotal || []),
      );
    } else {
      yield put(updateUserLicensesCertificationActions.failure(e));
    }
  }
}

function* getUserLicensesCertificationDetailSaga(action) {
  try {
    const response = yield call(
      getUserLicensesCertificationDetailApi,
      action.payload,
    );
    const { data } = response;

    yield put(getLicensesCertificationDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    } else if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message?.[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(
        getLicensesCertificationDetailActions.failure(messageTotal || []),
      );
    } else {
      yield put(getLicensesCertificationDetailActions.failure(e));
    }
  }
}

function* deleteUserLicensesCertificationSaga(action) {
  try {
    const { handleSuccess, id } = action.payload;

    yield call(deleteUserLicensesCertificationActionsApi, id);
    if (handleSuccess) {
      handleSuccess?.();
    }
    yield put(deleteUserLicensesCertificationActions.success());

    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteUserLicensesCertificationActions.failure());
  }
}

function* getListTravelDocumentSaga(action) {
  try {
    const response = yield call(getTravelDocumentApi, action.payload);
    const { data } = response;
    yield put(getListTravelDocumentActions.success(data || []));
  } catch (e) {
    toastError(e);
    yield put(getListTravelDocumentActions.failure());
  }
}

function* getListProvidedInspectionSaga(action) {
  try {
    const response = yield call(getListProvidedInspection, action.payload);
    const { data } = response;
    yield put(getListProvidedInspectionActions.success(data || []));
  } catch (e) {
    toastError(e);
    yield put(getListProvidedInspectionActions.failure());
  }
}

export default function* userManagementSaga() {
  yield all([
    yield takeLatest(getListUserActions.request, getListUserSaga),
    yield takeLatest(getListUserRecordActions.request, getListUserRecordSaga),
    yield takeLatest(deleteUserActions.request, deleteUserSaga),
    yield takeLatest(exportListUserActions.request, exportUserSaga),
    yield takeLatest(
      getUserManagementDetailActions.request,
      getUserManagementDetailSaga,
    ),
    yield takeLatest(getCountryActions.request, getCountrySaga),
    yield takeLatest(getProvinceActions.request, getProvinceSaga),
    yield takeLatest(
      createNewUserManagementActions.request,
      createNewUserManagementSaga,
    ),
    yield takeLatest(
      updateUserManagementActions.request,
      updateUserManagementSaga,
    ),
    yield takeLatest(uploadFileActions.request, uploadFileSaga),
    yield takeLatest(resetPasswordAdminActions.request, resetPasswordAdminSaga),
    yield takeLatest(
      validateUserManagementActions.request,
      validateUserManagementSaga,
    ),
    yield takeLatest(getListRoleActions.request, getListRoleSaga),
    yield takeLatest(
      getListExperienceActions.request,
      getListUserExperienceSaga,
    ),
    yield takeLatest(
      createUserExperienceActions.request,
      createUserExperienceSaga,
    ),
    yield takeLatest(
      updateUserExperienceActions.request,
      updateUserExperienceSaga,
    ),
    yield takeLatest(
      getExperienceDetailActions.request,
      getUserExperienceDetailSaga,
    ),
    yield takeLatest(
      deleteUserExperienceActions.request,
      deleteUserExperienceSaga,
    ),

    yield takeLatest(getListDepartmentActions.request, getListDepartmentSaga),
    yield takeLatest(
      getListLicensesCertificationActions.request,
      getListUserLicensesCertificationSaga,
    ),
    yield takeLatest(
      createUserLicensesCertificationActions.request,
      createUserLicensesCertificationSaga,
    ),
    yield takeLatest(
      updateUserLicensesCertificationActions.request,
      updateUserLicensesCertificationSaga,
    ),
    yield takeLatest(
      getLicensesCertificationDetailActions.request,
      getUserLicensesCertificationDetailSaga,
    ),
    yield takeLatest(
      deleteUserLicensesCertificationActions.request,
      deleteUserLicensesCertificationSaga,
    ),
    yield takeLatest(
      getListTravelDocumentActions.request,
      getListTravelDocumentSaga,
    ),
    yield takeLatest(
      getListProvidedInspectionActions.request,
      getListProvidedInspectionSaga,
    ),
    yield takeLatest(updateUserProfileActions.request, updateUserProfileSaga),
  ]);
}
