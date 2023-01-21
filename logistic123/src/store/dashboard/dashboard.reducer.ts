import { DashboardStoreModel } from 'models/store/dashboard/dashboard.model';
import { createReducer } from 'typesafe-actions';
import {
  getCompanyAvgActions,
  getCompanyUpcomingActions,
  clearDashboardErrorsReducer,
  clearDashboardReducer,
  getCompanyFindingActions,
  getCompanyOutstandingIssuesActions,
  getCompanyTrendAuditInspectionActions,
  getCompanyOverviewTaskActions,
  getAdminTotalAccountActions,
  getCompanyTrendIssueActions,
  getAuditorTrendIssueActions,
  getAuditorOutstandingIssuesActions,
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
  getReportFindingDashboardActions,
  getPlanningRequestDashboardActions,
  getInternalAuditDashboardActions,
  getUpcomingRequestByVesselActions,
  getCompanyCarCapNeedReviewingActions,
  getTrendOfOutstandingCarCapActions,
  getTrendOfOutstandingCarCapDetailActions,
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

const INITIAL_STATE: DashboardStoreModel = {
  loading: true,
  loadingModal: true,
  errorList: undefined,
  totalCkListRofIar: null,
  // company admin
  companyAvgResponse: undefined,
  dataUpcomingIARByVessel: [],
  dataOpenNonConformityByVessel: [],
  dataUpcomingPlanByVessel: [],
  dataOpenFindingObservationByVessel: [],

  companyUpcomingResponse: null,
  companyOverviewTask: undefined,
  companyOutstandingIssues: undefined,
  companyFindings: undefined,
  companyTrendAuditInspection: undefined,
  companyTrendIssues: undefined,

  companyVesselSafetyScore: undefined,
  companyInspectionPlan: undefined,
  companyBlacklistedVessel: [],
  companyCarCapNeedReviewing: undefined,

  //  supper admin
  totalAccount: undefined,
  // auditor
  auditorTrendIssues: undefined,
  auditorOutstandingIssues: undefined,
  // auditorUpcomingIARByVessel: [],
  // auditorOpenNonConformityByVessel: [],
  // auditorUpcomingPlanByVessel: [],
  // auditorOpenFindingObservationByVessel: [],
  vesselGHGRating: undefined,
  vesselLastInspection: undefined,
  vesselGroupByAge: undefined,
  vesselHasRestricted: undefined,

  auditChecklist: undefined,
  findingForm: undefined,
  inspectionReport: undefined,
  vesselRiskRating: undefined,
  totalNumberRisk: undefined,
  upcomingInspectionPlans: undefined,
  openTaskDashboard: {
    overviewDashboard: null,
    overviewChecklist: null,
    overviewInternalAuditReport: null,
    overviewReportFindingForm: null,
  },
  upcomingRequestByVessel: null,

  trendOfOutstandingCarCap: undefined,
  trendOfOutstandingCarCapDetail: undefined,
  outStandingCarCapIssue: undefined,

  inspectionPerStatus: undefined,
  inspectionPerType: undefined,
  inspectionPerPort: undefined,
  inspectionPerTypePerMonth: undefined,
  inspectionPerPortPerMonth: undefined,
  inspectionPerPortPerStatus: undefined,
  incidentsPotentialRisk: undefined,
  incidentsByType: undefined,
  incidentsPerPortPerDate: undefined,
  incidentsPerPortPerStatus: undefined,

  numberIncidentsPerPort: undefined,
  openTaskPlanning: undefined,
};

const dashboardReducer = createReducer<DashboardStoreModel>(INITIAL_STATE)
  .handleAction(getCompanyAvgActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCompanyAvgActions.success, (state, { payload }) => ({
    ...state,
    companyAvgResponse: { ...payload },
    loading: false,
  }))
  .handleAction(getCompanyAvgActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCompanyTrendAuditInspectionActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getCompanyTrendAuditInspectionActions.success,
    (state, { payload }) => ({
      ...state,
      companyTrendAuditInspection: { ...payload },
      loading: false,
    }),
  )
  .handleAction(getCompanyTrendAuditInspectionActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCompanyTrendIssueActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCompanyTrendIssueActions.success, (state, { payload }) => ({
    ...state,
    companyTrendIssues: { ...payload },
    loading: false,
  }))
  .handleAction(getCompanyTrendIssueActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCompanyUpcomingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCompanyUpcomingActions.success, (state, { payload }) => ({
    ...state,
    companyUpcomingResponse: { ...payload },
    loading: false,
  }))
  .handleAction(getCompanyUpcomingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCompanyFindingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCompanyFindingActions.success, (state, { payload }) => ({
    ...state,
    companyFindings: { ...payload },
    loading: false,
  }))
  .handleAction(getCompanyFindingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getTotalCkListRofIarAuditorActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getTotalCkListRofIarAuditorActions.success,
    (state, { payload }) => ({
      ...state,
      totalCkListRofIar: { ...payload },
      loading: false,
    }),
  )
  .handleAction(getTotalCkListRofIarAuditorActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getTotalCkListRofIarCompanyActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getTotalCkListRofIarCompanyActions.success,
    (state, { payload }) => ({
      ...state,
      totalCkListRofIar: { ...payload },
      loading: false,
    }),
  )
  .handleAction(getTotalCkListRofIarCompanyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCompanyOutstandingIssuesActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getCompanyOutstandingIssuesActions.success,
    (state, { payload }) => ({
      ...state,
      companyOutstandingIssues: { ...payload },
      loading: false,
    }),
  )
  .handleAction(getCompanyOutstandingIssuesActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCompanyOverviewTaskActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getCompanyOverviewTaskActions.success,
    (state, { payload }) => ({
      ...state,
      companyOverviewTask: { ...payload },
      loading: false,
    }),
  )
  .handleAction(getCompanyOverviewTaskActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getAdminTotalAccountActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getAdminTotalAccountActions.success, (state, { payload }) => ({
    ...state,
    totalAccount: { ...payload },
    loading: false,
  }))
  .handleAction(getAdminTotalAccountActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getCompanyUpcomingIARByVesselActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))
  .handleAction(
    getCompanyUpcomingIARByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataUpcomingIARByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(getCompanyUpcomingIARByVesselActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(
    getCompanyOpenNonConformityByVesselActions.request,
    (state) => ({
      ...state,
      loadingModal: true,
    }),
  )
  .handleAction(
    getCompanyOpenNonConformityByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataOpenNonConformityByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(
    getCompanyOpenNonConformityByVesselActions.failure,
    (state) => ({
      ...state,
      loadingModal: false,
    }),
  )

  .handleAction(getCompanyUpcomingPlanByVesselActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))
  .handleAction(
    getCompanyUpcomingPlanByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataUpcomingPlanByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(getCompanyUpcomingPlanByVesselActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(
    getCompanyOpenFindingObservationByVesselActions.request,
    (state) => ({
      ...state,
      loadingModal: true,
    }),
  )
  .handleAction(
    getCompanyOpenFindingObservationByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataOpenFindingObservationByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(
    getCompanyOpenFindingObservationByVesselActions.failure,
    (state) => ({
      ...state,
      loadingModal: false,
    }),
  )

  // auditor

  .handleAction(getAuditorTrendIssueActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getAuditorTrendIssueActions.success, (state, { payload }) => ({
    ...state,
    auditorTrendIssues: { ...payload },
    loading: false,
  }))
  .handleAction(getAuditorTrendIssueActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getAuditorOutstandingIssuesActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getAuditorOutstandingIssuesActions.success,
    (state, { payload }) => ({
      ...state,
      auditorOutstandingIssues: { ...payload },
      loading: false,
    }),
  )
  .handleAction(getAuditorOutstandingIssuesActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getAuditorUpcomingIARByVesselActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))
  .handleAction(
    getAuditorUpcomingIARByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataUpcomingIARByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(getAuditorUpcomingIARByVesselActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(
    getAuditorOpenNonConformityByVesselActions.request,
    (state) => ({
      ...state,
      loadingModal: true,
    }),
  )
  .handleAction(
    getAuditorOpenNonConformityByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataOpenNonConformityByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(
    getAuditorOpenNonConformityByVesselActions.failure,
    (state) => ({
      ...state,
      loadingModal: false,
    }),
  )

  .handleAction(getAuditorUpcomingPlanByVesselActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))
  .handleAction(
    getAuditorUpcomingPlanByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataUpcomingPlanByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(getAuditorUpcomingPlanByVesselActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(
    getAuditorOpenFindingObservationByVesselActions.request,
    (state) => ({
      ...state,
      loadingModal: true,
    }),
  )
  .handleAction(
    getAuditorOpenFindingObservationByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      dataOpenFindingObservationByVessel: [...payload],
      loadingModal: false,
    }),
  )
  .handleAction(
    getAuditorOpenFindingObservationByVesselActions.failure,
    (state) => ({
      ...state,
      loadingModal: false,
    }),
  )

  //
  .handleAction(clearDashboardErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(getVesselGHGRatingActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getVesselGHGRatingActions.success, (state, { payload }) => ({
    ...state,
    vesselGHGRating: payload,
    loading: false,
  }))
  .handleAction(getVesselGHGRatingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearDashboardReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(getVesselSafetyScoreActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(getVesselSafetyScoreActions.success, (state, { payload }) => ({
    ...state,
    companyVesselSafetyScore: payload,
    loadingModal: false,
  }))

  .handleAction(getVesselSafetyScoreActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getInspectionPlanActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(getInspectionPlanActions.success, (state, { payload }) => ({
    ...state,
    companyInspectionPlan: payload,
    loadingModal: false,
  }))

  .handleAction(getInspectionPlanActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getLastInspectionActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(getLastInspectionActions.success, (state, { payload }) => ({
    ...state,
    vesselLastInspection: payload,
    loadingModal: false,
  }))

  .handleAction(getLastInspectionActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getVesselGroupByAgeActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(getVesselGroupByAgeActions.success, (state, { payload }) => ({
    ...state,
    vesselGroupByAge: payload,
    loadingModal: false,
  }))

  .handleAction(getVesselGroupByAgeActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getBlacklistedVesselActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(getBlacklistedVesselActions.success, (state, { payload }) => ({
    ...state,
    companyBlacklistedVessel: payload,
    loadingModal: false,
  }))

  .handleAction(getBlacklistedVesselActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getVesselHasRestrictedActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(
    getVesselHasRestrictedActions.success,
    (state, { payload }) => ({
      ...state,
      vesselHasRestricted: payload,
      loadingModal: false,
    }),
  )

  .handleAction(getVesselHasRestrictedActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getAuditChecklistOpenTaskActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(
    getAuditChecklistOpenTaskActions.success,
    (state, { payload }) => ({
      ...state,
      auditChecklist: payload,
      loadingModal: false,
    }),
  )

  .handleAction(getAuditChecklistOpenTaskActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getFindingFormOpenTaskActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(
    getFindingFormOpenTaskActions.success,
    (state, { payload }) => ({
      ...state,
      findingForm: payload,
      loadingModal: false,
    }),
  )

  .handleAction(getFindingFormOpenTaskActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getInspectionReportOpenTaskActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(
    getInspectionReportOpenTaskActions.success,
    (state, { payload }) => ({
      ...state,
      inspectionReport: payload,
      loadingModal: false,
    }),
  )

  .handleAction(getInspectionReportOpenTaskActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getVesselRiskRatingActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(getVesselRiskRatingActions.success, (state, { payload }) => ({
    ...state,
    vesselRiskRating: payload,
    loadingModal: false,
  }))

  .handleAction(getVesselRiskRatingActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getTotalNumberRiskActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(getTotalNumberRiskActions.success, (state, { payload }) => ({
    ...state,
    totalNumberRisk: payload,
    loadingModal: false,
  }))

  .handleAction(getTotalNumberRiskActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getUpcomingInspectionPlansActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(
    getUpcomingInspectionPlansActions.success,
    (state, { payload }) => ({
      ...state,
      upcomingInspectionPlans: payload,
      loadingModal: false,
    }),
  )

  .handleAction(getUpcomingInspectionPlansActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(getReportFindingDashboardActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getReportFindingDashboardActions.success,
    (state, { payload }) => ({
      ...state,
      openTaskDashboard: {
        ...state.openTaskDashboard,
        overviewReportFindingForm:
          payload && Array.isArray(payload) ? [...payload] : [],
      },
      loading: false,
    }),
  )
  .handleAction(getReportFindingDashboardActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getPlanningRequestDashboardActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getPlanningRequestDashboardActions.success,
    (state, { payload }) => ({
      ...state,
      openTaskDashboard: {
        ...state.openTaskDashboard,
        overviewDashboard:
          payload && Array.isArray(payload) ? [...payload] : [],
      },
      loading: false,
    }),
  )
  .handleAction(getPlanningRequestDashboardActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getInternalAuditDashboardActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getCompanyCarCapNeedReviewingActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getInternalAuditDashboardActions.success,
    (state, { payload }) => ({
      ...state,
      openTaskDashboard: {
        ...state.openTaskDashboard,
        overviewInternalAuditReport:
          payload && Array.isArray(payload) ? [...payload] : [],
      },
      loading: false,
    }),
  )
  .handleAction(getInternalAuditDashboardActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getUpcomingRequestByVesselActions.request, (state) => ({
    ...state,
    loadingModal: true,
  }))

  .handleAction(
    getUpcomingRequestByVesselActions.success,
    (state, { payload }) => ({
      ...state,
      upcomingRequestByVessel: payload,
      loadingModal: false,
    }),
  )

  .handleAction(getUpcomingRequestByVesselActions.failure, (state) => ({
    ...state,
    loadingModal: false,
  }))

  .handleAction(
    getCompanyCarCapNeedReviewingActions.success,
    (state, { payload }) => ({
      ...state,
      companyCarCapNeedReviewing: payload,
      loading: false,
    }),
  )

  .handleAction(getCompanyCarCapNeedReviewingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getTrendOfOutstandingCarCapActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getTrendOfOutstandingCarCapActions.success,
    (state, { payload }) => ({
      ...state,
      trendOfOutstandingCarCap: payload,
      loading: false,
    }),
  )

  .handleAction(getTrendOfOutstandingCarCapActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getTrendOfOutstandingCarCapDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getTrendOfOutstandingCarCapDetailActions.success,
    (state, { payload }) => ({
      ...state,
      trendOfOutstandingCarCapDetail: payload,
      loading: false,
    }),
  )

  .handleAction(getTrendOfOutstandingCarCapDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getOutStandingCarCapIssueActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getOutStandingCarCapIssueActions.success,
    (state, { payload }) => ({
      ...state,
      outStandingCarCapIssue: payload?.total ? payload?.total : undefined,
      loading: false,
    }),
  )

  .handleAction(getOutStandingCarCapIssueActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getInspectionPerStatusActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getInspectionPerStatusActions.success,
    (state, { payload }) => ({
      ...state,
      inspectionPerStatus: payload,
      loading: false,
    }),
  )

  .handleAction(getInspectionPerStatusActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getInspectionPerTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getInspectionPerTypeActions.success, (state, { payload }) => ({
    ...state,
    inspectionPerType: payload,
    loading: false,
  }))

  .handleAction(getInspectionPerTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getInspectionPerPortActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getInspectionPerPortActions.success, (state, { payload }) => ({
    ...state,
    inspectionPerPort: payload,
    loading: false,
  }))

  .handleAction(getInspectionPerPortActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getInspectionPerTypePerMonthActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getInspectionPerTypePerMonthActions.success,
    (state, { payload }) => ({
      ...state,
      inspectionPerTypePerMonth: payload,
      loading: false,
    }),
  )

  .handleAction(getInspectionPerTypePerMonthActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getInspectionPerPortPerMonthActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getInspectionPerPortPerMonthActions.success,
    (state, { payload }) => ({
      ...state,
      inspectionPerPortPerMonth: payload,
      loading: false,
    }),
  )

  .handleAction(getInspectionPerPortPerMonthActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getInspectionPerPortPerStatusActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getInspectionPerPortPerStatusActions.success,
    (state, { payload }) => ({
      ...state,
      inspectionPerPortPerStatus: payload,
      loading: false,
    }),
  )

  .handleAction(getInspectionPerPortPerStatusActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getNumberIncidentsPerPortActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getNumberIncidentsPerPortActions.success,
    (state, { payload }) => ({
      ...state,
      numberIncidentsPerPort: payload,
      loading: false,
    }),
  )
  .handleAction(getNumberIncidentsPerPortActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(
    getNumberOfIncidentsByPotentialRiskActions.request,
    (state) => ({
      ...state,
      loading: true,
    }),
  )
  .handleAction(
    getNumberOfIncidentsByPotentialRiskActions.success,
    (state, { payload }) => ({
      ...state,
      incidentsPotentialRisk: payload,
      loading: false,
    }),
  )
  .handleAction(
    getNumberOfIncidentsByPotentialRiskActions.failure,
    (state) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(getNumberOfIncidentsByTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getNumberOfIncidentsByTypeActions.success,
    (state, { payload }) => ({
      ...state,
      incidentsByType: payload,
      loading: false,
    }),
  )
  .handleAction(getNumberOfIncidentsByTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getNumberIncidentsPerPortPerDateActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getNumberIncidentsPerPortPerDateActions.success,
    (state, { payload }) => ({
      ...state,
      incidentsPerPortPerDate: payload,
      loading: false,
    }),
  )
  .handleAction(getNumberIncidentsPerPortPerDateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getNumberIncidentsPerPortPerStatusActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getNumberIncidentsPerPortPerStatusActions.success,
    (state, { payload }) => ({
      ...state,
      incidentsPerPortPerStatus: payload,
      loading: false,
    }),
  )
  .handleAction(getNumberIncidentsPerPortPerStatusActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getPlanningOpenTaskActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getPlanningOpenTaskActions.success, (state, { payload }) => ({
    ...state,
    openTaskPlanning: payload,
    loading: false,
  }))

  .handleAction(getPlanningOpenTaskActions.failure, (state) => ({
    ...state,
    loading: false,
  }));
export default dashboardReducer;
