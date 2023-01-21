import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError } from 'helpers/notification.helper';
// import history from 'helpers/history.helper';
// import { AppRouteConst } from 'constants/route.const';

import {
  getCompanyAvgActions,
  getCompanyOutstandingIssuesActions,
  getCompanyUpcomingActions,
  getCompanyFindingActions,
  getCompanyOverviewTaskActions,
  getCompanyTrendAuditInspectionActions,
  getAdminTotalAccountActions,
  getCompanyTrendIssueActions,
  getAuditorOutstandingIssuesActions,
  getAuditorTrendIssueActions,
  getCompanyUpcomingIARByVesselActions,
  getCompanyOpenNonConformityByVesselActions,
  getCompanyUpcomingPlanByVesselActions,
  getCompanyOpenFindingObservationByVesselActions,
  getAuditorUpcomingIARByVesselActions,
  getAuditorOpenNonConformityByVesselActions,
  getAuditorUpcomingPlanByVesselActions,
  getAuditorOpenFindingObservationByVesselActions,
  getTotalCkListRofIarAuditorActions,
  getTotalCkListRofIarCompanyActions,
  getVesselGHGRatingActions,
  getVesselSafetyScoreActions,
  getInspectionPlanActions,
  getLastInspectionActions,
  getVesselGroupByAgeActions,
  getBlacklistedVesselActions,
  getVesselHasRestrictedActions,
  getAuditChecklistOpenTaskActions,
  getFindingFormOpenTaskActions,
  getInspectionReportOpenTaskActions,
  getVesselRiskRatingActions,
  getTotalNumberRiskActions,
  getUpcomingInspectionPlansActions,
  getPlanningRequestDashboardActions,
  getReportFindingDashboardActions,
  getInternalAuditDashboardActions,
  getUpcomingRequestByVesselActions,
  getCompanyCarCapNeedReviewingActions,
  getTrendOfOutstandingCarCapDetailActions,
  getTrendOfOutstandingCarCapActions,
  getOutStandingCarCapIssueActions,
  getInspectionPerStatusActions,
  getInspectionPerTypeActions,
  getInspectionPerPortActions,
  getInspectionPerTypePerMonthActions,
  getInspectionPerPortPerMonthActions,
  getNumberIncidentsPerPortActions,
  getInspectionPerPortPerStatusActions,
  getNumberOfIncidentsByPotentialRiskActions,
  getNumberOfIncidentsByTypeActions,
  getNumberIncidentsPerPortPerDateActions,
  getNumberIncidentsPerPortPerStatusActions,
  getPlanningOpenTaskActions,
} from './dashboard.action';
import {
  getCompanyAvgActionsApi,
  getCompanyUpcomingActionsApi,
  getCompanyOutstandingIssuesActionsApi,
  getCompanyOverviewTaskActionsApi,
  getCompanyFindingActionsApi,
  getAuditorTrendIssuesActionsApi,
  getCompanyTrendAuditInspectionActionsApi,
  getAdminTotalAccountActionsApi,
  getCompanyTrendIssuesActionsApi,
  getAuditorOutstandingIssuesActionsApi,
  getCompanyUpcomingIARByVesselApi,
  getCompanyOpenNonConformityByVesselApi,
  getCompanyUpcomingPlanByVesselApi,
  getCompanyOpenFindingObservationByVesselApi,
  getAuditorUpcomingIARByVesselApi,
  getAuditorOpenNonConformityByVesselApi,
  getAuditorUpcomingPlanByVesselApi,
  getAuditorOpenFindingObservationByVesselApi,
  getTotalCkListRofIarAuditorApi,
  getTotalCkListRofIarCompanyApi,
  getVesselGHGRatingApi,
  getVesselSafetyScoreAPI,
  getInspectionPlanAPI,
  getLastInspectionAPI,
  getVesselGroupByAgeAPI,
  getBlacklistedVesselAPI,
  getVesselHasRestrictesAPI,
  getAuditChecklistOpenTaskAPI,
  getFindingFormOpenTaskAPI,
  getInspectionReportOpenTaskAPI,
  getVesselRiskRatingAPI,
  getTotalNumberRiskAPI,
  getUpcomingInspectionPlansAPI,
  getPlanningRequestDashboardTaskActionsApi,
  getInternalAuditDashboardTaskActionsApi,
  getReportFindingDashboardTaskActionsApi,
  getUpcomingRequestByVesselActionsApi,
  getCompanyCarCapNeedReviewingAPI,
  getTrendOfOutstandingCarCapAPI,
  getTrendOfOutstandingCarCapDetailAPI,
  getInspectionPerStatusAPI,
  getInspectionPerTypeAPI,
  getInspectionPerPortAPI,
  getInspectionPerTypePerMonthAPI,
  getInspectionPerPortPerMonthAPI,
  getNumberIncidentPerPortAPI,
  getInspectionPerPortPerStatusAPI,
  getNumberOfIncidentsByPotentialRiskAPI,
  getNumberOfIncidentsByTypeAPI,
  getNumberIncidentsPerPortPerDateAPI,
  getNumberIncidentsPerPortPerStatusAPI,
  getOpenTaskPlanningAPI,
} from '../../api/dashboard.api';

function* getCompanyAvgActionsSaga(action) {
  try {
    const response = yield call(getCompanyAvgActionsApi, action.payload);
    const { data } = response;
    yield put(getCompanyAvgActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCompanyAvgActions.failure());
  }
}

function* getCompanyTrendAuditInspectionActionsSaga(action) {
  try {
    const response = yield call(
      getCompanyTrendAuditInspectionActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getCompanyTrendAuditInspectionActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCompanyTrendAuditInspectionActions.failure());
  }
}

function* getCompanyTrendIssuesActionsSaga(action) {
  try {
    const response = yield call(
      getCompanyTrendIssuesActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getCompanyTrendIssueActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCompanyTrendIssueActions.failure());
  }
}

function* getCompanyUpcomingActionsSaga(action) {
  try {
    const response = yield call(getCompanyUpcomingActionsApi, action.payload);
    const { data } = response;
    yield put(getCompanyUpcomingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCompanyUpcomingActions.failure());
  }
}

function* getCompanyFindingActionsSaga(action) {
  try {
    const response = yield call(getCompanyFindingActionsApi, action.payload);
    const { data } = response;
    yield put(getCompanyFindingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCompanyFindingActions.failure());
  }
}

function* getCompanyOutstandingIssuesActionsSaga(action) {
  try {
    const response = yield call(
      getCompanyOutstandingIssuesActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getCompanyOutstandingIssuesActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCompanyOutstandingIssuesActions.failure());
  }
}
function* getCompanyOverviewTaskActionsSaga(action) {
  try {
    const response = yield call(
      getCompanyOverviewTaskActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getCompanyOverviewTaskActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCompanyOverviewTaskActions.failure());
  }
}

// auditor

function* getReportFindingDashboardActionsSaga(action) {
  try {
    const response = yield call(
      getReportFindingDashboardTaskActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getReportFindingDashboardActions.success(data.data));
  } catch (e) {
    toastError(e);
    yield put(getReportFindingDashboardActions.failure());
  }
}

function* getPlanningDashboardActionsSaga(action) {
  try {
    const response = yield call(
      getPlanningRequestDashboardTaskActionsApi,
      action.payload,
    );

    const { data } = response;
    yield put(getPlanningRequestDashboardActions.success(data.data));
  } catch (e) {
    toastError(e);
    yield put(getPlanningRequestDashboardActions.failure());
  }
}

function* getInternalAuditDashboardActionsSaga(action) {
  try {
    const response = yield call(
      getInternalAuditDashboardTaskActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getInternalAuditDashboardActions.success(data.data));
  } catch (e) {
    toastError(e);
    yield put(getInternalAuditDashboardActions.failure());
  }
}

function* getAuditorOutstandingIssuesActionsSaga(action) {
  try {
    const response = yield call(
      getAuditorOutstandingIssuesActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getAuditorOutstandingIssuesActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getAuditorOutstandingIssuesActions.failure());
  }
}

function* getAuditorTrendIssuesActionsSaga(action) {
  try {
    const response = yield call(
      getAuditorTrendIssuesActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getAuditorTrendIssueActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getAuditorTrendIssueActions.failure());
  }
}

function* getAdminTotalAccountSaga(action) {
  try {
    const response = yield call(getAdminTotalAccountActionsApi, action.payload);
    const { data } = response;
    yield put(getAdminTotalAccountActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getAdminTotalAccountActions.failure());
  }
}

function* getCompanyUpcomingIARByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(getCompanyUpcomingIARByVesselApi, id);
    const { data } = response;
    yield put(getCompanyUpcomingIARByVesselActions.success(data || []));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getCompanyUpcomingIARByVesselActions.failure());
  }
}

function* getCompanyOpenNonConformityByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(getCompanyOpenNonConformityByVesselApi, id);
    const { data } = response;
    yield put(getCompanyOpenNonConformityByVesselActions.success(data || []));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getCompanyOpenNonConformityByVesselActions.failure());
  }
}

function* getCompanyUpcomingPlanByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(getCompanyUpcomingPlanByVesselApi, id);
    const { data } = response;
    yield put(getCompanyUpcomingPlanByVesselActions.success(data || []));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getCompanyUpcomingPlanByVesselActions.failure());
  }
}

function* getCompanyOpenFindingObservationByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(
      getCompanyOpenFindingObservationByVesselApi,
      id,
    );
    const { data } = response;
    yield put(
      getCompanyOpenFindingObservationByVesselActions.success(data || []),
    );
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getCompanyOpenFindingObservationByVesselActions.failure());
  }
}

function* getAuditorUpcomingIARByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(getAuditorUpcomingIARByVesselApi, id);
    const { data } = response;
    yield put(getAuditorUpcomingIARByVesselActions.success(data || []));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getAuditorUpcomingIARByVesselActions.failure());
  }
}

function* getAuditorOpenNonConformityByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(getAuditorOpenNonConformityByVesselApi, id);
    const { data } = response;
    yield put(getAuditorOpenNonConformityByVesselActions.success(data || []));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getAuditorOpenNonConformityByVesselActions.failure());
  }
}

function* getAuditorUpcomingPlanByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(getAuditorUpcomingPlanByVesselApi, id);
    const { data } = response;
    yield put(getAuditorUpcomingPlanByVesselActions.success(data || []));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getAuditorUpcomingPlanByVesselActions.failure());
  }
}

function* getAuditorOpenFindingObservationByVesselSaga(action) {
  try {
    const { id, handleSuccess } = action.payload;
    const response = yield call(
      getAuditorOpenFindingObservationByVesselApi,
      id,
    );
    const { data } = response;
    yield put(
      getAuditorOpenFindingObservationByVesselActions.success(data || []),
    );
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getAuditorOpenFindingObservationByVesselActions.failure());
  }
}

function* getTotalCkListRofIarAuditorActionsSaga(action) {
  try {
    const response = yield call(getTotalCkListRofIarAuditorApi, action.payload);
    const { data } = response;
    yield put(getTotalCkListRofIarAuditorActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getTotalCkListRofIarAuditorActions.failure());
  }
}

function* getTotalCkListRofIarCompanyActionsSaga(action) {
  try {
    const response = yield call(getTotalCkListRofIarCompanyApi, action.payload);
    const { data } = response;
    yield put(getTotalCkListRofIarCompanyActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getTotalCkListRofIarCompanyActions.failure());
  }
}

function* getVesselGHGRatingSaga() {
  try {
    const response = yield call(() => getVesselGHGRatingApi());
    const { data } = response;
    yield put(getVesselGHGRatingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVesselGHGRatingActions.failure());
  }
}
function* getVesselSafetyScoreActionsSaga() {
  try {
    const response = yield call(() => getVesselSafetyScoreAPI());
    const { data } = response;
    yield put(getVesselSafetyScoreActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getVesselSafetyScoreActions.failure());
  }
}

function* getInspectionPlanActionsSaga() {
  try {
    const response = yield call(() => getInspectionPlanAPI());
    const { data } = response;
    yield put(getInspectionPlanActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionPlanActions.failure());
  }
}

function* getLastInspectionActionsSaga() {
  try {
    const response = yield call(() => getLastInspectionAPI());
    const { data } = response;
    yield put(getLastInspectionActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getLastInspectionActions.failure());
  }
}

function* getVesselGroupByAgeActionsSaga() {
  try {
    const response = yield call(() => getVesselGroupByAgeAPI());
    const { data } = response;
    yield put(getVesselGroupByAgeActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getVesselGroupByAgeActions.failure());
  }
}

function* getBlacklistedVesselSaga() {
  try {
    const response = yield call(() => getBlacklistedVesselAPI());
    const { data } = response;
    yield put(getBlacklistedVesselActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getBlacklistedVesselActions.failure());
  }
}

function* getVesselHasRestrictedSaga() {
  try {
    const response = yield call(() => getVesselHasRestrictesAPI());
    const { data } = response;
    yield put(getVesselHasRestrictedActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getVesselHasRestrictedActions.failure());
  }
}

function* getAuditChecklistOpenTaskSaga(action) {
  try {
    const response = yield call(getAuditChecklistOpenTaskAPI, action.payload);
    const { data } = response;
    yield put(getAuditChecklistOpenTaskActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getAuditChecklistOpenTaskActions.failure());
  }
}

function* getFindingFormOpenTaskSaga(action) {
  try {
    const response = yield call(getFindingFormOpenTaskAPI, action.payload);
    const { data } = response;
    yield put(getFindingFormOpenTaskActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getFindingFormOpenTaskActions.failure());
  }
}

function* getInspectionReportOpenTaskSaga(action) {
  try {
    const response = yield call(getInspectionReportOpenTaskAPI, action.payload);
    const { data } = response;
    yield put(getInspectionReportOpenTaskActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionReportOpenTaskActions.failure());
  }
}

function* getVesselRiskRatingSaga() {
  try {
    const response = yield call(() => getVesselRiskRatingAPI());
    const { data } = response;
    yield put(getVesselRiskRatingActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getVesselRiskRatingActions.failure());
  }
}

function* getTotalNumberRiskSaga() {
  try {
    const response = yield call(() => getTotalNumberRiskAPI());
    const { data } = response;
    yield put(getTotalNumberRiskActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getTotalNumberRiskActions.failure());
  }
}

function* getUpcomingInspectionPlansSaga(action) {
  try {
    const response = yield call(() =>
      getUpcomingInspectionPlansAPI(action.payload),
    );
    const { data } = response;
    yield put(getUpcomingInspectionPlansActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getUpcomingInspectionPlansActions.failure());
  }
}

function* getUpcomingRequestByVesselSaga(action) {
  try {
    const { params, handleSuccess } = action.payload;
    const response = yield call(() =>
      getUpcomingRequestByVesselActionsApi(params),
    );
    const { data } = response;
    yield put(getUpcomingRequestByVesselActions.success(data));
    handleSuccess?.();
  } catch (error) {
    toastError(error);
    yield put(getUpcomingRequestByVesselActions.failure());
  }
}

function* getCompanyCarCapNeedReviewingSaga(action) {
  try {
    const response = yield call(
      getCompanyCarCapNeedReviewingAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getCompanyCarCapNeedReviewingActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getCompanyCarCapNeedReviewingActions.failure());
  }
}

function* getTrendOfOutstandingCarCapSaga(action) {
  try {
    const response = yield call(getTrendOfOutstandingCarCapAPI, action.payload);
    const { data } = response;
    yield put(getTrendOfOutstandingCarCapActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getTrendOfOutstandingCarCapActions.failure());
  }
}

function* getTrendOfOutstandingCarCapDetailSaga(action) {
  try {
    const response = yield call(
      getTrendOfOutstandingCarCapDetailAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getTrendOfOutstandingCarCapDetailActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getTrendOfOutstandingCarCapDetailActions.failure());
  }
}

function* getOutStandingCarCapIssueSaga(action) {
  try {
    const response = yield call(getTrendOfOutstandingCarCapAPI, action.payload);
    const { data } = response;
    yield put(getOutStandingCarCapIssueActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getOutStandingCarCapIssueActions.failure());
  }
}

function* getInspectionPerStatusSaga(action) {
  try {
    const response = yield call(getInspectionPerStatusAPI, action.payload);
    const { data } = response;
    yield put(getInspectionPerStatusActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionPerStatusActions.failure());
  }
}

function* getInspectionPerTypeSaga(action) {
  try {
    const response = yield call(getInspectionPerTypeAPI, action.payload);
    const { data } = response;
    yield put(getInspectionPerTypeActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionPerTypeActions.failure());
  }
}

function* getInspectionPerPortSaga(action) {
  try {
    const response = yield call(getInspectionPerPortAPI, action.payload);
    const { data } = response;
    yield put(getInspectionPerPortActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionPerPortActions.failure());
  }
}

function* getInspectionPerTypePerMonthSaga(action) {
  try {
    const response = yield call(
      getInspectionPerTypePerMonthAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getInspectionPerTypePerMonthActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionPerTypePerMonthActions.failure());
  }
}

function* getInspectionPerPortPerMonthSaga(action) {
  try {
    const response = yield call(
      getInspectionPerPortPerMonthAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getInspectionPerPortPerMonthActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionPerPortPerMonthActions.failure());
  }
}

function* getNumberIncidentPerPortSaga(action) {
  try {
    const response = yield call(getNumberIncidentPerPortAPI, action.payload);
    const { data } = response;
    yield put(getNumberIncidentsPerPortActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getNumberIncidentsPerPortActions.failure());
  }
}
function* getInspectionPerPortPerStatusSaga(action) {
  try {
    const response = yield call(
      getInspectionPerPortPerStatusAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getInspectionPerPortPerStatusActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getInspectionPerPortPerStatusActions.failure());
  }
}

function* getNumberOfIncidentsByPotentialRiskSaga(action) {
  try {
    const response = yield call(
      getNumberOfIncidentsByPotentialRiskAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getNumberOfIncidentsByPotentialRiskActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getNumberOfIncidentsByPotentialRiskActions.failure());
  }
}
function* getNumberOfIncidentsByTypeSaga(action) {
  try {
    const response = yield call(getNumberOfIncidentsByTypeAPI, action.payload);
    const { data } = response;
    yield put(getNumberOfIncidentsByTypeActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getNumberOfIncidentsByTypeActions.failure());
  }
}
function* getNumberIncidentsPerPortPerDateSaga(action) {
  try {
    const response = yield call(
      getNumberIncidentsPerPortPerDateAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getNumberIncidentsPerPortPerDateActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getNumberIncidentsPerPortPerDateActions.failure());
  }
}

function* getNumberIncidentsPerPortPerStatusSaga(action) {
  try {
    const response = yield call(
      getNumberIncidentsPerPortPerStatusAPI,
      action.payload,
    );
    const { data } = response;
    yield put(getNumberIncidentsPerPortPerStatusActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getNumberIncidentsPerPortPerStatusActions.failure());
  }
}

function* getOpenTaskPlanningSaga(action) {
  try {
    const response = yield call(getOpenTaskPlanningAPI, action.payload);
    const { data } = response;
    yield put(getPlanningOpenTaskActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getPlanningOpenTaskActions.failure());
  }
}

export default function* DashboardSaga() {
  yield all([
    yield takeLatest(getCompanyAvgActions.request, getCompanyAvgActionsSaga),
    yield takeLatest(
      getCompanyUpcomingActions.request,
      getCompanyUpcomingActionsSaga,
    ),
    yield takeLatest(
      getCompanyOverviewTaskActions.request,
      getCompanyOverviewTaskActionsSaga,
    ),
    yield takeLatest(
      getCompanyOutstandingIssuesActions.request,
      getCompanyOutstandingIssuesActionsSaga,
    ),

    yield takeLatest(
      getCompanyFindingActions.request,
      getCompanyFindingActionsSaga,
    ),
    yield takeLatest(
      getCompanyTrendIssueActions.request,
      getCompanyTrendIssuesActionsSaga,
    ),
    yield takeLatest(
      getCompanyTrendAuditInspectionActions.request,
      getCompanyTrendAuditInspectionActionsSaga,
    ),
    yield takeLatest(
      getReportFindingDashboardActions.request,
      getReportFindingDashboardActionsSaga,
    ),

    yield takeLatest(
      getPlanningRequestDashboardActions.request,
      getPlanningDashboardActionsSaga,
    ),
    yield takeLatest(
      getInternalAuditDashboardActions.request,
      getInternalAuditDashboardActionsSaga,
    ),

    yield takeLatest(
      getAdminTotalAccountActions.request,
      getAdminTotalAccountSaga,
    ),
    yield takeLatest(
      getAuditorTrendIssueActions.request,
      getAuditorTrendIssuesActionsSaga,
    ),
    yield takeLatest(
      getAuditorOutstandingIssuesActions.request,
      getAuditorOutstandingIssuesActionsSaga,
    ),
    yield takeLatest(
      getCompanyUpcomingIARByVesselActions.request,
      getCompanyUpcomingIARByVesselSaga,
    ),
    yield takeLatest(
      getCompanyOpenNonConformityByVesselActions.request,
      getCompanyOpenNonConformityByVesselSaga,
    ),

    yield takeLatest(
      getCompanyUpcomingPlanByVesselActions.request,
      getCompanyUpcomingPlanByVesselSaga,
    ),
    yield takeLatest(
      getCompanyOpenFindingObservationByVesselActions.request,
      getCompanyOpenFindingObservationByVesselSaga,
    ),

    yield takeLatest(
      getAuditorUpcomingIARByVesselActions.request,
      getAuditorUpcomingIARByVesselSaga,
    ),
    yield takeLatest(
      getAuditorOpenNonConformityByVesselActions.request,
      getAuditorOpenNonConformityByVesselSaga,
    ),

    yield takeLatest(
      getAuditorUpcomingPlanByVesselActions.request,
      getAuditorUpcomingPlanByVesselSaga,
    ),
    yield takeLatest(
      getAuditorOpenFindingObservationByVesselActions.request,
      getAuditorOpenFindingObservationByVesselSaga,
    ),

    yield takeLatest(
      getTotalCkListRofIarAuditorActions.request,
      getTotalCkListRofIarAuditorActionsSaga,
    ),
    yield takeLatest(
      getTotalCkListRofIarCompanyActions.request,
      getTotalCkListRofIarCompanyActionsSaga,
    ),
    yield takeLatest(getVesselGHGRatingActions.request, getVesselGHGRatingSaga),
    yield takeLatest(
      getVesselSafetyScoreActions.request,
      getVesselSafetyScoreActionsSaga,
    ),
    yield takeLatest(
      getInspectionPlanActions.request,
      getInspectionPlanActionsSaga,
    ),
    yield takeLatest(
      getLastInspectionActions.request,
      getLastInspectionActionsSaga,
    ),
    yield takeLatest(
      getVesselGroupByAgeActions.request,
      getVesselGroupByAgeActionsSaga,
    ),
    yield takeLatest(
      getBlacklistedVesselActions.request,
      getBlacklistedVesselSaga,
    ),
    yield takeLatest(
      getVesselHasRestrictedActions.request,
      getVesselHasRestrictedSaga,
    ),
    yield takeLatest(
      getAuditChecklistOpenTaskActions.request,
      getAuditChecklistOpenTaskSaga,
    ),
    yield takeLatest(
      getFindingFormOpenTaskActions.request,
      getFindingFormOpenTaskSaga,
    ),
    yield takeLatest(
      getInspectionReportOpenTaskActions.request,
      getInspectionReportOpenTaskSaga,
    ),
    yield takeLatest(
      getVesselRiskRatingActions.request,
      getVesselRiskRatingSaga,
    ),
    yield takeLatest(getTotalNumberRiskActions.request, getTotalNumberRiskSaga),
    yield takeLatest(
      getUpcomingInspectionPlansActions.request,
      getUpcomingInspectionPlansSaga,
    ),
    yield takeLatest(
      getUpcomingRequestByVesselActions.request,
      getUpcomingRequestByVesselSaga,
    ),
    yield takeLatest(
      getCompanyCarCapNeedReviewingActions.request,
      getCompanyCarCapNeedReviewingSaga,
    ),
    yield takeLatest(
      getTrendOfOutstandingCarCapActions.request,
      getTrendOfOutstandingCarCapSaga,
    ),
    yield takeLatest(
      getTrendOfOutstandingCarCapDetailActions.request,
      getTrendOfOutstandingCarCapDetailSaga,
    ),
    yield takeLatest(
      getOutStandingCarCapIssueActions.request,
      getOutStandingCarCapIssueSaga,
    ),
    yield takeLatest(
      getInspectionPerStatusActions.request,
      getInspectionPerStatusSaga,
    ),
    yield takeLatest(
      getInspectionPerTypeActions.request,
      getInspectionPerTypeSaga,
    ),
    yield takeLatest(
      getInspectionPerPortActions.request,
      getInspectionPerPortSaga,
    ),
    yield takeLatest(
      getInspectionPerTypePerMonthActions.request,
      getInspectionPerTypePerMonthSaga,
    ),
    yield takeLatest(
      getInspectionPerPortPerMonthActions.request,
      getInspectionPerPortPerMonthSaga,
    ),
    yield takeLatest(
      getNumberIncidentsPerPortActions.request,
      getNumberIncidentPerPortSaga,
    ),
    yield takeLatest(
      getInspectionPerPortPerStatusActions.request,
      getInspectionPerPortPerStatusSaga,
    ),
    yield takeLatest(
      getNumberOfIncidentsByPotentialRiskActions.request,
      getNumberOfIncidentsByPotentialRiskSaga,
    ),
    yield takeLatest(
      getNumberOfIncidentsByTypeActions.request,
      getNumberOfIncidentsByTypeSaga,
    ),
    yield takeLatest(
      getNumberIncidentsPerPortPerDateActions.request,
      getNumberIncidentsPerPortPerDateSaga,
    ),
    yield takeLatest(
      getNumberIncidentsPerPortPerStatusActions.request,
      getNumberIncidentsPerPortPerStatusSaga,
    ),
    yield takeLatest(
      getPlanningOpenTaskActions.request,
      getOpenTaskPlanningSaga,
    ),
  ]);
}
