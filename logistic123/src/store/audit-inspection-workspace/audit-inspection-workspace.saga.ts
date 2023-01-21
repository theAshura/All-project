import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import isNaN from 'lodash/isNaN';
import {
  getAuditInspectionWorkspaceDetailActions,
  getAuditWorkspaceChecklistActions,
  getAuditWorkspaceChecklistDetailActions,
  getListAuditInspectionWorkspaceActions,
  submitAuditWorkspaceChecklistDetailActions,
  updateAuditWorkspaceChecklistDetailActions,
  submitAuditWorkspaceActions,
  getAuditWorkspaceSummaryActions,
  updateAuditWorkspaceFindingSummaryActions,
  createRemarkActions,
  updateRemarkActions,
  deleteRemarkActions,
  getRemarksActions,
  getInspectionWorkspaceSummaryAction,
  getAnalyticalReportPerformanceAction,
  getAnalyticalReportDetailMainSubcategoryWiseAction,
  updateMasterChiefActions,
} from './audit-inspection-workspace.action';
import {
  getAuditInspectionWorkspaceDetailActionsApi,
  getListAuditInspectionWorkspacesActionsApi,
  getListChecklistActionsApi,
  submitAuditWorkspaceActionsApi,
  submitAuditWorkspaceChecklistDetailActionsApi,
  updateAuditWorkspaceChecklistDetailActionsApi,
  getAuditWorkspaceChecklistDetailActionsApi,
  getListAIWFindingSummaryApi,
  createRemarkApi,
  deleteRemarkApi,
  getListRemarkApi,
  updateRemarkApi,
  updateAuditWorkspaceFindingSummaryActionsApi,
  getInspectionWorkspaceSummaryApi,
  getAnalyticalReportPerformanceApi,
  getAnalyticalReportDetailSubcategoryApi,
  updateMasterChiefApi,
} from '../../api/audit-inspection-workspace.api';

function* getListAuditInspectionWorkspacesSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(
      getListAuditInspectionWorkspacesActionsApi,
      other,
    );
    const { data } = response;
    yield put(getListAuditInspectionWorkspaceActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListAuditInspectionWorkspaceActions.failure());
  }
}

function* getRemarksActionsSaga(action) {
  try {
    const { handleSuccess, ...others } = action.payload;
    const response = yield call(getListRemarkApi, others);
    const { data } = response;
    yield put(getRemarksActions.success(data));
    if (handleSuccess) handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(getRemarksActions.failure());
  }
}

function* getAuditInspectionWorkspaceDetailSaga(action) {
  try {
    const response = yield call(
      getAuditInspectionWorkspaceDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getAuditInspectionWorkspaceDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_INSPECTION_WORKSPACE);
    }
    toastError(e);
    yield put(getAuditInspectionWorkspaceDetailActions.failure());
  }
}

function* getAuditInspectionWorkspaceChecklistSaga(action) {
  try {
    const { id } = action.payload;

    const response = yield call(getListChecklistActionsApi, id);
    const { data } = response;
    yield put(getAuditWorkspaceChecklistActions.success(data));
    if (action?.payload?.afterGetDetail) {
      action?.payload?.afterGetDetail();
    }
  } catch (e) {
    toastError(e);
    yield put(getAuditWorkspaceChecklistActions.failure());
  }
}
function* getAuditInspectionWorkspaceSummarySage(action) {
  try {
    const { id } = action.payload;
    const response = yield call(getListAIWFindingSummaryApi, id);

    yield put(getAuditWorkspaceSummaryActions.success(response));
    if (action?.payload?.afterGetDetail) {
      action?.payload?.afterGetDetail();
    }
  } catch (e) {
    toastError(e);
    yield put(getAuditWorkspaceSummaryActions.failure());
  }
}

function* getAuditWorkspaceChecklistDetailSaga(action) {
  try {
    const response = yield call(
      getAuditWorkspaceChecklistDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getAuditWorkspaceChecklistDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getAuditWorkspaceChecklistDetailActions.failure());
  }
}

function* updateAuditWorkspaceChecklistDetailSaga(action) {
  try {
    const { afterSubmit, ...other } = action.payload;

    yield call(updateAuditWorkspaceChecklistDetailActionsApi, other);
    yield put(
      getAuditWorkspaceChecklistActions.request({
        id: action.payload?.workspaceId,
      }),
    );
    yield put(
      getAuditWorkspaceSummaryActions.request({
        id: action.payload?.workspaceId,
      }),
    );
    yield put(
      getAuditInspectionWorkspaceDetailActions.request(
        action.payload?.workspaceId,
      ),
    );
    action?.payload?.afterSubmit();
    toastSuccess('You have updated successfully');
    yield put(updateAuditWorkspaceChecklistDetailActions.success());
  } catch (e) {
    toastError(e);
    yield put(updateAuditWorkspaceChecklistDetailActions.failure());
  }
}

function* updateAuditWorkspaceFindingSummarySaga(action) {
  try {
    const { afterSubmit, ...other } = action.payload;

    yield call(updateAuditWorkspaceFindingSummaryActionsApi, other);

    action?.payload?.afterSubmit();
    toastSuccess('You have updated successfully');
    yield put(updateAuditWorkspaceFindingSummaryActions.success());
  } catch (e) {
    toastError(e);
    yield put(updateAuditWorkspaceFindingSummaryActions.failure());
  }
}
function* createRemarkSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;

    yield call(createRemarkApi, other?.data);
    if (handleSuccess) handleSuccess();
    toastSuccess('You have created successfully');
    yield put(createRemarkActions.success());
  } catch (e) {
    toastError(e);
    yield put(createRemarkActions.failure());
  }
}

function* updateRemarkSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;

    yield call(updateRemarkApi, other?.data);
    if (handleSuccess) handleSuccess();
    toastSuccess('You have updated successfully');
    yield put(updateRemarkActions.success());
  } catch (e) {
    toastError(e);
    yield put(updateRemarkActions.failure());
  }
}

function* updateMasterChiefSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;

    yield call(updateMasterChiefApi, other?.data);
    if (handleSuccess) handleSuccess();
    toastSuccess('You have updated successfully');
    yield put(updateMasterChiefActions.success());
  } catch (e) {
    toastError(e);
    yield put(updateMasterChiefActions.failure());
  }
}

function* submitAuditWorkspaceChecklistDetailSaga(action) {
  try {
    const { afterSubmit, ...other } = action.payload;

    yield call(submitAuditWorkspaceChecklistDetailActionsApi, other);

    toastSuccess('You have submit successfully');

    yield put(
      getAuditWorkspaceChecklistActions.request({
        id: action.payload?.workspaceId,
      }),
    );
    yield put(
      getAuditWorkspaceSummaryActions.request({
        id: action.payload?.workspaceId,
      }),
    );
    yield put(
      getAuditInspectionWorkspaceDetailActions.request(
        action.payload?.workspaceId,
      ),
    );
    action?.payload?.afterSubmit();
    yield put(submitAuditWorkspaceChecklistDetailActions.success());
  } catch (e) {
    toastError(e);
    yield put(submitAuditWorkspaceChecklistDetailActions.failure());
  }
}

function* submitAuditWorkspaceSaga(action) {
  try {
    const { afterSubmit, ...other } = action.payload;
    yield call(submitAuditWorkspaceActionsApi, other);

    yield put(submitAuditWorkspaceActions.success());
    action?.payload?.afterSubmit();
    toastSuccess('You have submit workspace successfully');
  } catch (e) {
    toastError(e);
    yield put(submitAuditWorkspaceActions.failure());
  }
}

function* deleteRemarkSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(deleteRemarkApi, other);
    toastSuccess('You have deleted successfully');
    if (handleSuccess) handleSuccess();
    yield put(deleteRemarkActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteRemarkActions.failure());
  }
}

function* getAuditInspectionWorkspaceSummarySaga(action) {
  try {
    const response = yield call(
      getInspectionWorkspaceSummaryApi,
      action.payload,
    );
    const { data } = response;

    yield put(getInspectionWorkspaceSummaryAction.success(data));
  } catch (e) {
    toastError(e);
    yield put(getInspectionWorkspaceSummaryAction.failure());
  }
}

function* getAnalyticalReportPerformanceSaga(action) {
  try {
    const response = yield call(
      getAnalyticalReportPerformanceApi,
      action.payload,
    );
    const { data } = response;
    const potentialRiskPercent =
      data?.totalPotentialRisk / data?.maxValueVesselPotentialRisk;
    const potentialRiskRepeatPercent =
      data?.repeatedFindingScore?.totalPotentialRiskRepeatedFinding &&
      data?.repeatedFindingScore?.totalPotentialRiskRepeatedFinding !== 0
        ? data?.repeatedFindingScore?.totalPotentialRiskRepeatedFinding /
          data?.maxValueVesselPotentialRisk
        : potentialRiskPercent;

    const absNumber = (number: number) =>
      isNaN(Number(number || 0)) ? 0 : Math.abs(Number(number || 0));

    const normalNumber = (number: number) =>
      isNaN(Number(number || 0)) ? 0 : Number(number || 0);

    const configInspectionPercentOff =
      Number(
        data?.analyticalReportConfigInspection?.reduce(
          (a, b) => normalNumber(a) + normalNumber(b?.percentOff),
          0,
        ) || 0,
      ) / 100;
    const configInspectionPercentOffAbs =
      Number(
        data?.analyticalReportConfigInspection?.reduce(
          (a, b) => absNumber(a) + absNumber(b?.percentOff),
          0,
        ) || 0,
      ) / 100;

    const inspectionPerformanceAbs =
      absNumber(data?.inspectionScore) / absNumber(data?.maxMarkedValue);

    const inspectionPerformance =
      normalNumber(data?.inspectionScore) / normalNumber(data?.maxMarkedValue);

    const inspectionPerformanceRepeatAbs =
      data?.repeatedFindingScore?.inspectionScoreRepeatedFinding &&
      data?.repeatedFindingScore?.inspectionScoreRepeatedFinding !== 0
        ? absNumber(
            data?.repeatedFindingScore?.inspectionScoreRepeatedFinding,
          ) / absNumber(data?.maxMarkedValue)
        : inspectionPerformance;

    const inspectionPerformanceRepeat =
      data?.repeatedFindingScore?.inspectionScoreRepeatedFinding &&
      data?.repeatedFindingScore?.inspectionScoreRepeatedFinding !== 0
        ? normalNumber(
            data?.repeatedFindingScore?.inspectionScoreRepeatedFinding,
          ) / normalNumber(data?.maxMarkedValue)
        : inspectionPerformance;

    yield put(
      getAnalyticalReportPerformanceAction.success({
        ...data,
        inspectionScore: data?.inspectionScore,
        potentialRiskPercentAbs: absNumber(potentialRiskPercent),
        potentialRiskPercent: normalNumber(potentialRiskPercent),
        inspectionPerformance: normalNumber(inspectionPerformance),
        inspectionPerformanceAbs: absNumber(inspectionPerformanceAbs),
        potentialRiskRepeatPercent: normalNumber(potentialRiskRepeatPercent),
        potentialRiskRepeatPercentAbs: absNumber(potentialRiskRepeatPercent),
        inspectionPerformanceRepeat: normalNumber(inspectionPerformanceRepeat),
        inspectionPerformanceRepeatAbs: absNumber(
          inspectionPerformanceRepeatAbs,
        ),
        configInspectionPercentOffAbs,
        configInspectionPercentOff,
        initialData: data,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(getAnalyticalReportPerformanceAction.failure());
  }
}

function* getAnalyticalReportDetailSubcategoryWiseSaga(action) {
  try {
    const response = yield call(
      getAnalyticalReportDetailSubcategoryApi,
      action.payload,
    );
    const { data } = response;

    yield put(getAnalyticalReportDetailMainSubcategoryWiseAction.success(data));
  } catch (e) {
    toastError(e);
    yield put(getAnalyticalReportDetailMainSubcategoryWiseAction.failure());
  }
}

export default function* AuditInspectionWorkspaceAndPermissionSaga() {
  yield all([
    yield takeLatest(
      getListAuditInspectionWorkspaceActions.request,
      getListAuditInspectionWorkspacesSaga,
    ),

    yield takeLatest(deleteRemarkActions.request, deleteRemarkSaga),

    yield takeLatest(getRemarksActions.request, getRemarksActionsSaga),
    yield takeLatest(createRemarkActions.request, createRemarkSaga),
    yield takeLatest(updateRemarkActions.request, updateRemarkSaga),
    yield takeLatest(updateMasterChiefActions.request, updateMasterChiefSaga),
    yield takeLatest(
      getAuditInspectionWorkspaceDetailActions.request,
      getAuditInspectionWorkspaceDetailSaga,
    ),
    yield takeLatest(
      getAuditWorkspaceChecklistActions.request,
      getAuditInspectionWorkspaceChecklistSaga,
    ),
    yield takeLatest(
      getAuditWorkspaceChecklistDetailActions.request,
      getAuditWorkspaceChecklistDetailSaga,
    ),
    yield takeLatest(
      updateAuditWorkspaceChecklistDetailActions.request,
      updateAuditWorkspaceChecklistDetailSaga,
    ),
    yield takeLatest(
      updateAuditWorkspaceFindingSummaryActions.request,
      updateAuditWorkspaceFindingSummarySaga,
    ),
    yield takeLatest(
      submitAuditWorkspaceChecklistDetailActions.request,
      submitAuditWorkspaceChecklistDetailSaga,
    ),
    yield takeLatest(
      getAuditWorkspaceSummaryActions.request,
      getAuditInspectionWorkspaceSummarySage,
    ),
    yield takeLatest(
      submitAuditWorkspaceActions.request,
      submitAuditWorkspaceSaga,
    ),
    yield takeLatest(
      getInspectionWorkspaceSummaryAction.request,
      getAuditInspectionWorkspaceSummarySaga,
    ),
    yield takeLatest(
      getAnalyticalReportPerformanceAction.request,
      getAnalyticalReportPerformanceSaga,
    ),
    yield takeLatest(
      getAnalyticalReportDetailMainSubcategoryWiseAction.request,
      getAnalyticalReportDetailSubcategoryWiseSaga,
    ),
  ]);
}
