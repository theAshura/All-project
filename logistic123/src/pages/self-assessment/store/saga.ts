import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import {
  getListSelfDeclarationActionsApi,
  getListSelfAssessmentActionsApi,
  getSelfAssessmentDetailActionsApi,
  deleteSelfAssessmentActionsApi,
  createSelfAssessmentActionsApi,
  getVersionNumberActionApi,
  updateSelfAssessmentDetailActionsApi,
  getSelfDeclarationDetailActionsApi,
  reOpenSelfDeclarationApprovedActionsApi,
  approveSelfDeclarationActionsApi,
  getListLookBackCommentActionsApi,
  getStandardMasterDetailActionsApi,
  reAssignSelfDeclarationApprovedActionsApi,
  publishOfficialSelfAssessmentActionsApi,
  getSelfAssessmentMatrixActionsApi,
  unpublishSelfAssessmentActionsApi,
  updateComplianceAndTargetDateApi,
} from '../utils/api';
import { SelfAssessmentDetailResponse } from '../utils/model';
import {
  getSelfAssessmentDetailActions,
  getListSelfAssessmentActions,
  updateSelfAssessmentActions,
  deleteSelfAssessmentActions,
  createSelfAssessmentActions,
  getVersionNumberActions,
  getListSelfDeclarationActions,
  getSelfDeclarationDetailActions,
  reOpenAllSelfDeclarationApprovedActions,
  approveSelfDeclarationActions,
  getLookUpCompanyCommentActions,
  getStandardMasterDetailActions,
  reAssignSelfDeclarationApprovedActions,
  publishOfficialSelfAssessmentActions,
  getSelfAssessmentMatrixActions,
  unpublishSelfAssessmentActions,
  updateComplianceAndTargetDateActions,
} from './action';

function* getListSelfAssessmentSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListSelfAssessmentActionsApi, other);
    handleSuccess?.();
    yield put(getListSelfAssessmentActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getListSelfAssessmentActions.failure());
  }
}

function* getVersionNumberSaga(action) {
  try {
    const response = yield call(getVersionNumberActionApi, action.payload);
    const { data } = response;
    yield put(getVersionNumberActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVersionNumberActions.failure());
  }
}

function* deleteSelfAssessmentSaga(action) {
  try {
    yield call(deleteSelfAssessmentActionsApi, action.payload?.id);

    yield put(deleteSelfAssessmentActions.success());
    toastSuccess('You have deleted successfully');

    action.payload?.getListSelfAssessment();
  } catch (e) {
    toastError(e);
    yield put(deleteSelfAssessmentActions.failure());
  }
}

function* createSelfAssessmentSaga(action) {
  try {
    const params: SelfAssessmentDetailResponse = {
      ...action.payload,
    };
    const response = yield call(createSelfAssessmentActionsApi, params);
    const { data } = response;
    const selfAssessmentId = data?.identifiers[0]?.id;
    yield put(createSelfAssessmentActions.success());
    toastSuccess('You have created successfully');
    if (selfAssessmentId) {
      history.push(
        `${AppRouteConst.getStandardAndMatrix(selfAssessmentId)}?edit`,
      );
    } else {
      history.push(AppRouteConst.SELF_ASSESSMENT);
    }
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createSelfAssessmentActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createSelfAssessmentActions.failure(undefined));
    }
  }
}

function* getSelfAssessmentDetailSaga(action) {
  try {
    const response = yield call(
      getSelfAssessmentDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSelfAssessmentDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SELF_ASSESSMENT);
    }
    toastError(e);
    yield put(getSelfAssessmentDetailActions.failure());
  }
}

function* updateSelfAssessmentSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(updateSelfAssessmentDetailActionsApi, params);
    toastSuccess('You have updated successfully');
    handleSuccess?.();
    history.push(AppRouteConst.getStandardAndMatrix(params.id));
    yield put(updateSelfAssessmentActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateSelfAssessmentActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateSelfAssessmentActions.failure(undefined));
    }
  }
}

function* getListSelfDeclarationSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...others
    } = action.payload;

    const response = yield call(getListSelfDeclarationActionsApi, others);

    handleSuccess?.();

    yield put(getListSelfDeclarationActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getListSelfDeclarationActions.failure());
  }
}

function* getSelfDeclarationDetailSaga(action) {
  try {
    const response = yield call(
      getSelfDeclarationDetailActionsApi,
      action.payload,
    );
    yield put(getSelfDeclarationDetailActions.success(response?.data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SELF_ASSESSMENT);
    }
    toastError(e);
    yield put(getSelfDeclarationDetailActions.failure());
  }
}

function* reOpenSelfDeclarationApprovedSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(reOpenSelfDeclarationApprovedActionsApi, other);
    toastSuccess('Reopened all approved Questions');
    handleSuccess?.();
    yield put(reOpenAllSelfDeclarationApprovedActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(reOpenAllSelfDeclarationApprovedActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(reOpenAllSelfDeclarationApprovedActions.failure(undefined));
    }
  }
}

function* approveSelfDeclarationSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(approveSelfDeclarationActionsApi, other);
    toastSuccess('You have updated successfully');
    handleSuccess?.();
    yield put(approveSelfDeclarationActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(approveSelfDeclarationActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(approveSelfDeclarationActions.failure(undefined));
    }
  }
}

function* reAssignSelfDeclarationSaga(action) {
  try {
    const { handleSuccess, id, comment, selfAssessmentId } = action.payload;
    yield call(reAssignSelfDeclarationApprovedActionsApi, {
      id,
      comment,
      selfAssessmentId,
    });
    toastSuccess('You have reassign successfully');
    handleSuccess?.();
    yield put(reAssignSelfDeclarationApprovedActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(reAssignSelfDeclarationApprovedActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(reAssignSelfDeclarationApprovedActions.failure(undefined));
    }
  }
}

function* publishOfficialSelfAssessmentSaga(action) {
  try {
    yield call(publishOfficialSelfAssessmentActionsApi, action.payload?.id);
    toastSuccess('You have published successfully');
    action.payload?.handleSuccess?.();
    yield put(publishOfficialSelfAssessmentActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      // Handle case: publish but record existed
      if (!e?.errorList) {
        toastError(e?.message);
      }
      yield put(publishOfficialSelfAssessmentActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(publishOfficialSelfAssessmentActions.failure(undefined));
    }
  }
}

function* unpublishSelfAssessmentSaga(action) {
  try {
    yield call(unpublishSelfAssessmentActionsApi, action.payload?.id);
    toastSuccess('You have un-published successfully');
    action.payload?.handleSuccess?.();
    yield put(unpublishSelfAssessmentActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(unpublishSelfAssessmentActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(unpublishSelfAssessmentActions.failure(undefined));
    }
  }
}

function* getListLookUpCompanyCommentSaga(action) {
  try {
    const response = yield call(
      getListLookBackCommentActionsApi,
      action.payload,
    );
    yield put(getLookUpCompanyCommentActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getLookUpCompanyCommentActions.failure());
  }
}

function* getStandardMasterDetailSaga(action) {
  try {
    const response = yield call(
      getStandardMasterDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getStandardMasterDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TYPE);
    }
    toastError(e);
    yield put(getStandardMasterDetailActions.failure());
  }
}

function* getSelfAssessmenMatrixSaga(action) {
  try {
    const response = yield call(
      getSelfAssessmentMatrixActionsApi,
      action.payload,
    );
    yield put(getSelfAssessmentMatrixActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getSelfAssessmentMatrixActions.failure());
  }
}

function* updateComplianceAndTargetDateSaga(action) {
  try {
    const response = yield call(
      updateComplianceAndTargetDateApi,
      action.payload,
    );
    yield put(updateComplianceAndTargetDateActions.success(response?.data));
    yield put(
      getListSelfDeclarationActions.request({
        selfAssessmentId: action.payload?.selfAssessmentId,
        params: { pageSize: -1 },
      }),
    );

    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e);
    yield put(updateComplianceAndTargetDateActions.failure());
  }
}

export default function* SelfAssessmentAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteSelfAssessmentActions.request,
      deleteSelfAssessmentSaga,
    ),
    yield takeLatest(
      getListSelfAssessmentActions.request,
      getListSelfAssessmentSaga,
    ),
    yield takeLatest(getVersionNumberActions.request, getVersionNumberSaga),
    yield takeLatest(
      createSelfAssessmentActions.request,
      createSelfAssessmentSaga,
    ),
    yield takeLatest(
      getSelfAssessmentDetailActions.request,
      getSelfAssessmentDetailSaga,
    ),
    yield takeLatest(
      updateSelfAssessmentActions.request,
      updateSelfAssessmentSaga,
    ),
    yield takeLatest(
      getListSelfDeclarationActions.request,
      getListSelfDeclarationSaga,
    ),
    yield takeLatest(
      getSelfDeclarationDetailActions.request,
      getSelfDeclarationDetailSaga,
    ),
    yield takeLatest(
      reOpenAllSelfDeclarationApprovedActions.request,
      reOpenSelfDeclarationApprovedSaga,
    ),
    yield takeLatest(
      approveSelfDeclarationActions.request,
      approveSelfDeclarationSaga,
    ),
    yield takeLatest(
      getLookUpCompanyCommentActions.request,
      getListLookUpCompanyCommentSaga,
    ),
    yield takeLatest(
      getStandardMasterDetailActions.request,
      getStandardMasterDetailSaga,
    ),
    yield takeLatest(
      reAssignSelfDeclarationApprovedActions.request,
      reAssignSelfDeclarationSaga,
    ),
    yield takeLatest(
      publishOfficialSelfAssessmentActions.request,
      publishOfficialSelfAssessmentSaga,
    ),
    yield takeLatest(
      getSelfAssessmentMatrixActions.request,
      getSelfAssessmenMatrixSaga,
    ),
    yield takeLatest(
      unpublishSelfAssessmentActions.request,
      unpublishSelfAssessmentSaga,
    ),
    yield takeLatest(
      updateComplianceAndTargetDateActions.request,
      updateComplianceAndTargetDateSaga,
    ),
  ]);
}
