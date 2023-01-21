import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import componentLoader from 'helpers/loader.helper';
import { lazy } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import CustomSwitch, {
  RouteProps,
} from '../components/common/custom-switch/CustomSwitch';
import { AppRouteConst, AuthRouteConst } from '../constants/route.const';
import withAuthenticate from '../hoc/withAuthenticate';
import PermissionCheck from '../hoc/withPermissionCheck';

export const AsyncUserManagementComponent = lazy(() =>
  componentLoader(() => import('containers/user/UserList')),
);

export const AsyncUserProfileDetailComponent = lazy(() =>
  componentLoader(() => import('containers/user-profile/UserDetail')),
);

export const AsyncUserManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/user/UserDetail')),
);

export const AsyncNewUserManagementComponent = lazy(() =>
  componentLoader(() => import('containers/user/UserCreate')),
);

export const AsyncRoleAndPermissionComponent = lazy(() =>
  componentLoader(() => import('containers/role/RoleList')),
);

export const AsyncNewRoleAndPermissionComponent = lazy(() =>
  componentLoader(() => import('containers/role/RoleCreate')),
);

export const AsyncRoleAndPermissionDetailComponent = lazy(() =>
  componentLoader(() => import('containers/role/RoleDetail')),
);

export const AsyncGroupManagementComponent = lazy(() =>
  componentLoader(() => import('containers/group/GroupList')),
);

export const AsyncGroupManagementCreateComponent = lazy(() =>
  componentLoader(() => import('containers/group/GroupCreate')),
);

export const AsyncGroupManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/group/GroupDetail')),
);

export const AsyncDashboardComponent = lazy(() =>
  componentLoader(() => import('containers/dashboard')),
);

export const AsyncAuditTypeManagementComponent = lazy(() =>
  componentLoader(() => import('containers/audit-type/AuditTypeList')),
);

export const AsyncNewAuditTypeManagementComponent = lazy(() =>
  componentLoader(() => import('containers/audit-type/AuditTypeCreate')),
);

export const AsyncAuditTypeManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/audit-type/AuditTypeDetail')),
);

export const AsyncCDIComponent = lazy(() =>
  componentLoader(() => import('containers/cdi/CDIList')),
);

// VIQ

export const AsyncVIQComponent = lazy(() =>
  componentLoader(() => import('containers/viq/VIQList')),
);

export const AsyncNewVIQComponent = lazy(() =>
  componentLoader(() => import('containers/viq/VIQCreate')),
);

export const AsyncVIQDetailComponent = lazy(() =>
  componentLoader(() => import('containers/viq/VIQDetail')),
);

export const AsyncReportTemplateListComponent = lazy(() =>
  componentLoader(
    () => import('containers/report-template/ReportTemplateList'),
  ),
);

// QA dashboard

export const AsyncQADashboardComponent = lazy(() =>
  componentLoader(
    () => import('components/dashboard/qa-dashboard/DashBoardQAContainer'),
  ),
);

// Standard master

export const AsyncStandardMasterComponent = lazy(() =>
  componentLoader(
    () => import('containers/standard-master/StandardMasterList'),
  ),
);

export const AsyncNewStandardMasterComponent = lazy(() =>
  componentLoader(
    () => import('containers/standard-master/StandardMasterCreate'),
  ),
);

export const AsyncStandardMasterDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/standard-master/StandardMasterDetail'),
  ),
);

export const AsyncReportTemplateNewComponent = lazy(() =>
  componentLoader(
    () => import('containers/report-template/ReportTemplateCreate'),
  ),
);

export const AsyncReportTemplateDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/report-template/ReportTemplateDetail'),
  ),
);

export const AsyncCharterOwnerManagementComponent = lazy(() =>
  componentLoader(() => import('containers/charter-owner/CharterOwnerList')),
);

export const AsyncAuditTimeTableManagementComponent = lazy(() =>
  componentLoader(
    () => import('containers/audit-time-table/AuditTimeTableList'),
  ),
);

export const AsyncAuditTimeTableManagementCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/audit-time-table/AuditTimeTableCreate'),
  ),
);

export const AsyncPscActionManagementComponent = lazy(() =>
  componentLoader(() => import('containers/psc-action/PscActionList')),
);

export const AsyncPscActionManagementCreateComponent = lazy(() =>
  componentLoader(() => import('containers/psc-action/PscActionCreate')),
);
export const AsyncOwnerBusinessManagementComponent = lazy(() =>
  componentLoader(() => import('pages/owner-business/list')),
);

export const AsyncLocationManagementComponent = lazy(() =>
  componentLoader(() => import('containers/location/LocationList')),
);

// export const AsyncLocationManagementCreateComponent = lazy(() =>
//   componentLoader(() => import('containers/location/LocationCreate')),
// );
export const AsyncShipDirectResponsibleManagementComponent = lazy(() =>
  componentLoader(
    () =>
      import('containers/ship-direct-responsible/ShipDirectResponsibleList'),
  ),
);

export const AsyncShipDirectResponsibleManagementCreateComponent = lazy(() =>
  componentLoader(
    () =>
      import('containers/ship-direct-responsible/ShipDirectResponsibleCreate'),
  ),
);

export const AsyncShipRankManagementComponent = lazy(() =>
  componentLoader(() => import('containers/ship-rank/ShipRankList')),
);

export const AsyncShipRankManagementCreateComponent = lazy(() =>
  componentLoader(() => import('containers/ship-rank/ShipRankCreate')),
);

export const AsyncShipRankManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/ship-rank/ShipRankDetail')),
);

export const AsyncShipDepartmentManagementComponent = lazy(() =>
  componentLoader(
    () => import('containers/ship-department/ShipDepartmentList'),
  ),
);

export const AsyncShipDepartmentManagementCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/ship-department/ShipDepartmentCreate'),
  ),
);
export const AsyncCategoryManagementComponent = lazy(() =>
  componentLoader(() => import('containers/category/CategoryList')),
);

export const AsyncMainCategoryManagementComponent = lazy(() =>
  componentLoader(() => import('containers/main-category/MainCategoryList')),
);
export const AsyncSecondCategoryManagementComponent = lazy(() =>
  componentLoader(
    () => import('containers/second-category/SecondCategoryList'),
  ),
);
export const AsyncRiskFactorManagementComponent = lazy(() =>
  componentLoader(() => import('containers/risk-factor/RiskFactorList')),
);
export const AsyncTerminalManagementComponent = lazy(() =>
  componentLoader(() => import('containers/terminal/TerminalList')),
);
export const AsyncThirdCategoryManagementComponent = lazy(() =>
  componentLoader(() => import('containers/third-category/ThirdCategoryList')),
);

export const AsyncCategoryManagementCreateComponent = lazy(() =>
  componentLoader(() => import('containers/category/CategoryCreate')),
);

export const AsyncTopicComponent = lazy(() =>
  componentLoader(() => import('containers/topic/TopicList')),
);

export const AsyncCategoryManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/category/CategoryDetail')),
);
export const AsyncAuditTimeTableManagementDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/audit-time-table/AuditTimeTableDetail'),
  ),
);

export const AsyncPscActionManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/psc-action/PscActionDetail')),
);

export const AsyncShipDirectResponsibleManagementDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import('containers/ship-direct-responsible/ShipDirectResponsibleDetail'),
  ),
);
export const AsyncShipDepartmentManagementDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/ship-department/ShipDepartmentDetail'),
  ),
);
export const AsyncVesselManagementComponent = lazy(() =>
  componentLoader(() => import('containers/vessel/VesselList')),
);
export const AsyncVesselManagementCreateComponent = lazy(() =>
  componentLoader(() => import('containers/vessel/VesselCreate')),
);

export const AsyncVesselManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/vessel/VesselDetail')),
);
export const AsyncVesselTypeComponent = lazy(() =>
  componentLoader(() => import('containers/vessel-type/VesselTypeList')),
);

export const AsyncAuthorityMasterComponent = lazy(() =>
  componentLoader(
    () => import('containers/authority-master/AuthorityMasterList'),
  ),
);

export const AsyncAuthorityMasterCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/authority-master/AuthorityMasterCreate'),
  ),
);

export const AsyncAuthorityMasterDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/authority-master/AuthorityMasterDetail'),
  ),
);

export const AsyncCompanyManagement = lazy(() =>
  componentLoader(() => import('containers/company/CompanyList')),
);

export const AsyncNewCompanyManagement = lazy(() =>
  componentLoader(() => import('containers/company/CompanyCreate')),
);

export const AsyncCompanyManagementDetail = lazy(() =>
  componentLoader(() => import('containers/company/CompanyDetail')),
);

export const AsyncNotFound = lazy(() =>
  componentLoader(() => import('containers/404')),
);

// export const AsyncFleetManagementComponent = lazy(() =>
//   componentLoader(() => import('containers/fleet/FleetList')),
// );

export const AsyncEventTypeManagementComponent = lazy(() =>
  componentLoader(() => import('containers/event-type/EventTypeList')),
);

export const AsyncFocusRequestManagementComponent = lazy(() =>
  componentLoader(() => import('containers/focus-request/FocusRequestList')),
);

export const AsyncInjuryMasterManagementComponent = lazy(() =>
  componentLoader(() => import('containers/injury-master/InjuryMasterList')),
);

export const AsyncInjuryBodyManagementComponent = lazy(() =>
  componentLoader(() => import('containers/injury-body/InjuryBodyList')),
);

export const AsyncInspectorTimeOffManagementComponent = lazy(() =>
  componentLoader(
    () => import('containers/inspector-time-off/InspectorTimeOffList'),
  ),
);

export const AsyncPortManagementComponent = lazy(() =>
  componentLoader(() => import('containers/port/PortList')),
);

export const AsyncPortManagementCreateComponent = lazy(() =>
  componentLoader(() => import('containers/port/PortCreate')),
);

export const AsyncPortManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/port/PortDetail')),
);
export const AsyncShoreRankManagementComponent = lazy(() =>
  componentLoader(() => import('containers/shore-rank/ShoreRankList')),
);
export const AsyncShoreRankManagementCreateComponent = lazy(() =>
  componentLoader(() => import('containers/shore-rank/ShoreRankCreate')),
);
export const AsyncShoreRankManagementDetailComponent = lazy(() =>
  componentLoader(() => import('containers/shore-rank/ShoreRankDetail')),
);

export const AsyncNoPermissionComponent = lazy(() =>
  componentLoader(() => import('containers/no-permission/index')),
);

export const AsyncShoreDepartmentComponent = lazy(() =>
  componentLoader(
    () => import('containers/shore-department/ShoreDepartmentList'),
  ),
);

export const AsyncShoreDepartmentCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/shore-department/ShoreDepartmentCreate'),
  ),
);

export const AsyncShoreDepartmentDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/shore-department/ShoreDepartmentDetail'),
  ),
);

export const AsyncAuditCheckListsComponent = lazy(() =>
  componentLoader(() => import('containers/audit-checklist/AuditCheckList')),
);

export const AsyncAuditCheckListDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/audit-checklist/AuditChecklistDetail'),
  ),
);

export const AsyncAuditCheckListCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/audit-checklist/AuditTypeChecklistCreate'),
  ),
);
export const AsyncPlanningAndRequestComponent = lazy(() =>
  componentLoader(
    () => import('containers/planning-and-request/PlanningAndRequestList'),
  ),
);
export const AsyncPlanningAndRequestCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/planning-and-request/PlanningAndRequestCreate'),
  ),
);
export const AsyncPlanningAndRequestDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/planning-and-request/PlanningAndRequestDetail'),
  ),
);
export const AsyncReportOfFindingComponent = lazy(() =>
  componentLoader(
    () => import('containers/report-of-finding/ReportOfFindingList'),
  ),
);
export const AsyncReportOfFindingCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/report-of-finding/ReportOfFindingCreate'),
  ),
);
export const AsyncReportOfFindingDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/report-of-finding/ReportOfFindingDetail'),
  ),
);
// export const AsyncDMSManagementComponent = lazy(() =>
//   componentLoader(() => import('containers/dms/DMSList')),
// );
// export const AsyncDMSManagementCreateComponent = lazy(() =>
//   componentLoader(() => import('containers/dms/DMSCreate')),
// );
// export const AsyncDMSManagementDetailComponent = lazy(() =>
//   componentLoader(() => import('containers/dms/DMSDetail')),
// );

export const AsyncMobileConfigComponent = lazy(() =>
  componentLoader(() => import('containers/mobile-config')),
);

export const AsyncModuleManagementListComponent = lazy(() =>
  componentLoader(
    () => import('containers/module-management/ModuleManagementList'),
  ),
);

export const AsyncElementMasterListComponent = lazy(() =>
  componentLoader(() => import('containers/element-master/ElementMasterList')),
);
export const AsyncElementMasterCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/element-master/ElementMasterCreate'),
  ),
);
export const AsyncElementMasterDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/element-master/ElementMasterDetail'),
  ),
);

export const AsyncPSCComponent = lazy(() =>
  componentLoader(() => import('containers/psc-deficiency/PSCList')),
);
export const AsyncPSCCreateComponent = lazy(() =>
  componentLoader(() => import('containers/psc-deficiency/PSCCreate')),
);
export const AsyncPSCDetailComponent = lazy(() =>
  componentLoader(() => import('containers/psc-deficiency/PSCDetail')),
);

// INSPECTION MAPPING

export const AsyncInspectionMappingComponent = lazy(() =>
  componentLoader(
    () => import('containers/inspection-mapping/InspectionMappingList'),
  ),
);
export const AsyncInspectionMappingCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/inspection-mapping/InspectionMappingCreate'),
  ),
);
export const AsyncInspectionMappingDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/inspection-mapping/InspectionMappingDetail'),
  ),
);

// AUDIT INSPECTION WORKSPACE

export const AsyncAuditInspectionWorkspaceComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'containers/audit-inspection-workspace/AuditInspectionWorkspaceList'
      ),
  ),
);

export const AsyncAuditInspectionWorkspaceDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'containers/audit-inspection-workspace/AuditInspectionWorkspaceDetail'
      ),
  ),
);

// INTERNAL AUDIT REPORT

export const AsyncInternalAuditReportComponent = lazy(() =>
  componentLoader(
    () => import('containers/internal-audit-report/InternalAuditReportList'),
  ),
);
export const AsyncInternalAuditReportDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/internal-audit-report/InternalAuditReportDetail'),
  ),
);

// DEPARTMENT MASTER

export const AsyncDepartmentMasterComponent = lazy(() =>
  componentLoader(
    () => import('containers/department-master/DepartmentMasterList'),
  ),
);

export const AsyncRankMasterComponent = lazy(() =>
  componentLoader(() => import('containers/rank-master/RankMasterList')),
);

// Nature of Findings
export const AsyncNatureOfFindingsMasterComponent = lazy(() =>
  componentLoader(
    () =>
      import('containers/nature-of-findings-master/NatureOfFindingsMasterList'),
  ),
);

// WORK FLOW
export const AsyncWorkFlowComponent = lazy(() =>
  componentLoader(() => import('containers/work-flow/WorkFlowList')),
);
export const AsyncWorkFlowCreateComponent = lazy(() =>
  componentLoader(() => import('containers/work-flow/WorkFlowCreate')),
);
export const AsyncWorkFlowDetailComponent = lazy(() =>
  componentLoader(() => import('containers/work-flow/WorkFlowDetail')),
);

// SAIL GENERAL REPORT
export const AsyncSailGeneralReportDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/sail-general-report/SailGeneralReportDetail'),
  ),
);

export const AsyncSailGeneralReportListComponent = lazy(() =>
  componentLoader(
    () => import('containers/sail-general-report/SailGeneralReportList'),
  ),
);

export const AsyncSailGeneralReportIncidentCreateComponent = lazy(() =>
  componentLoader(
    () =>
      import('containers/sail-general-report/SailGeneralReportIncidentCreate'),
  ),
);

export const AsyncSailGeneralReportIncidentDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import('containers/sail-general-report/SailGeneralReportIncidentDetail'),
  ),
);

export const AsyncSailGeneralReportPortStateControlCreateComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'containers/sail-general-report/SailGeneralReportPortStateControlCreate'
      ),
  ),
);

export const AsyncSailGeneralReportOtherExternalInspectionAuditCreateComponent =
  lazy(() =>
    componentLoader(
      () =>
        import(
          'containers/sail-general-report/SailGeneralReportOtherExternalInspectionsAuditCreate'
        ),
    ),
  );

export const AsyncSailGeneralReportPortStateControlDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'containers/sail-general-report/SailGeneralReportPortStateControlDetail'
      ),
  ),
);

export const AsyncSailGeneralReportInternalInpectionAuditCreateComponent = lazy(
  () =>
    componentLoader(
      () =>
        import('containers/sail-general-report/InternalInpectionAuditCreate'),
    ),
);

export const AsyncSailGeneralReportExternalInpectionAuditDetailComponent = lazy(
  () =>
    componentLoader(
      () =>
        import(
          'containers/sail-general-report/SailGeneralReportOtherExternalInspectionsAuditDetail'
        ),
    ),
);

export const AsyncSailGeneralReportInternalInpectionAuditDetailComponent = lazy(
  () =>
    componentLoader(
      () =>
        import('containers/sail-general-report/InternalInpectionAuditDetail'),
    ),
);

// DEVICE CONTROL
export const AsyncDeviceControlComponent = lazy(() =>
  componentLoader(() => import('containers/device-control/DeviceControlList')),
);

// APP TYPE PROPERTY
export const AsyncAppTypePropertyComponent = lazy(() =>
  componentLoader(
    () => import('containers/app-type-property/AppTypePropertyList'),
  ),
);

export const AsyncAppTypePropertyDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/app-type-property/AppTypePropertyDetail'),
  ),
);

// CATEGORY MAPPING
export const AsyncCategoryMappingComponent = lazy(() =>
  componentLoader(
    () => import('containers/category-mapping/CategoryMappingList'),
  ),
);
export const AsyncCategoryMappingCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/category-mapping/CategoryMappingCreate'),
  ),
);
export const AsyncCategoryMappingDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/category-mapping/CategoryMappingDetail'),
  ),
);
export const AsyncDashboardWidget = lazy(() =>
  componentLoader(() => import('containers/dashboard-widget/DashboardWidget')),
);

// DIVISION
export const AsyncDivisionListComponent = lazy(() =>
  componentLoader(() => import('pages/division/DivisionList')),
);

// DIVISION Mapping
export const AsyncDivisionMappingListComponent = lazy(() =>
  componentLoader(() => import('pages/division-mapping/DivisionMappingList')),
);
export const AsyncDivisionMappingCreateComponent = lazy(() =>
  componentLoader(() => import('pages/division-mapping/create')),
);

export const AsyncDivisionMappingDetailComponent = lazy(() =>
  componentLoader(() => import('pages/division-mapping/detail')),
);

// ATTACHMENT KIT
export const AsyncAttachmentKitListComponent = lazy(() =>
  componentLoader(() => import('containers/attachment-kit/AttachmentKitList')),
);
export const AsyncAttachmentKitCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/attachment-kit/AttachmentKitCreate'),
  ),
);
export const AsyncAttachmentKitDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/attachment-kit/AttachmentKitDetail'),
  ),
);

// MAIL MANAGEMENT
export const AsyncMailManagementListComponent = lazy(() =>
  componentLoader(
    () => import('containers/mail-management/MailManagementList'),
  ),
);
export const AsyncMailManagementCreateComponent = lazy(() =>
  componentLoader(
    () => import('containers/mail-management/MailManagementCreate'),
  ),
);
export const AsyncMailManagementDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/mail-management/MailManagementDetail'),
  ),
);

// INSPECTION FOLLOW UP

export const AsynInspectionFollowUpLisComponent = lazy(() =>
  componentLoader(
    () => import('containers/inspection-follow-up/InternalAuditReportList'),
  ),
);

export const AsyncInspectionFollowUpDetailComponent = lazy(() =>
  componentLoader(
    () => import('containers/inspection-follow-up/InspectionFollowUpDetail'),
  ),
);

// Incident Type

export const AsyncIncidentTypeComponent = lazy(() =>
  componentLoader(() => import('containers/incident-type/IncidentTypeList')),
);

// feature config

export const AsyncFeatureConfigComponent = lazy(() =>
  componentLoader(() => import('containers/feature-config/FeatureConfigList')),
);

// Self Assessment
export const AsyncSelfAssessmentComponent = lazy(() =>
  componentLoader(() => import('pages/self-assessment/list')),
);

export const AsyncNewSelfAssessmentComponent = lazy(() =>
  componentLoader(() => import('pages/self-assessment/create')),
);

export const AsyncSelfAssessmentDetailComponent = lazy(() =>
  componentLoader(() => import('pages/self-assessment/detail')),
);

export const AsyncSelfAssessmentDeclarationComponent = lazy(() =>
  componentLoader(() => import('pages/self-assessment/self-declaration')),
);

export const AsyncIssueNoteComponent = lazy(() =>
  componentLoader(() => import('containers/issue-note/IssueNoteList')),
);
export const AsyncCargoComponent = lazy(() =>
  componentLoader(() => import('pages/cargo/list')),
);

export const AsyncPlanDrawingComponent = lazy(() =>
  componentLoader(() => import('pages/plan-drawing/list')),
);
// START_NEW_PAGE
export const AsyncValueManagementComponent = lazy(() =>
  componentLoader(() => import('pages/value-management/list')),
);
// END_NEW_PAGE
export const AsyncCompanyTypeComponent = lazy(() =>
  componentLoader(() => import('pages/company-type/CompanyTypeList')),
);

export const AsyncMapViewComponent = lazy(() =>
  componentLoader(() => import('pages/map-view/MapView')),
);
export const AsyncCargoTypeComponent = lazy(() =>
  componentLoader(() => import('pages/cargo-type/list')),
);

export const AsyncRepeateFindingCalculationComponent = lazy(() =>
  componentLoader(() => import('pages/repeated-finding/list')),
);

export const AsyncTransferTypeManagementComponent = lazy(() =>
  componentLoader(() => import('pages/transfer-type/index')),
);
/**
 * VESSEL SCREENING
 */
export const AsyncListVesselScreeningComponent = lazy(() =>
  componentLoader(() => import('pages/vessel-screening/list')),
);

export const AsyncCreateVesselScreeningComponent = lazy(() =>
  componentLoader(() => import('pages/vessel-screening/create')),
);

export const AsyncViewVesselScreeningComponent = lazy(() =>
  componentLoader(() => import('pages/vessel-screening/detail')),
);

/**
 * INCIDENTS
 */
export const AsyncListIncidentsComponent = lazy(() =>
  componentLoader(() => import('pages/incidents/list')),
);

export const AsyncDetailIncidentsComponent = lazy(() =>
  componentLoader(() => import('pages/incidents/detail')),
);

export const AsyncCreateIncidentsComponent = lazy(() =>
  componentLoader(() => import('pages/incidents/create')),
);

export const AsyncSummaryIncidentsComponent = lazy(() =>
  componentLoader(() => import('pages/incidents/summary/detail')),
);

export const AsyncVesselScreeningPSCDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'pages/vessel-screening/forms/port-state-control/detail-port-state-control'
      ),
  ),
);

export const AsyncVesselScreeningPilotTerminalFeedbackDetailComponent = lazy(
  () =>
    componentLoader(
      () =>
        import(
          'pages/vessel-screening/forms/pilot-terminal-feedback/detail-pilot-terminal-feedback'
        ),
    ),
);

// export const AsyncVesselScreeningPilotFeedbackDetailComponent = lazy(() =>
//   componentLoader(
//     () =>
//       import(
//         'pages/vessel-screening/forms/pilot-terminal-feedback/detail-pilot-terminal-feedback'
//       ),
//   ),
// );

export const AsyncVesselScreeningIncidentSafetyDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'pages/vessel-screening/forms/incident-safety/detail-incident-safety'
      ),
  ),
);

export const AsyncVesselScreeningInternalInspectionDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'pages/vessel-screening/forms/internal-inspection/detail-internal-inspection'
      ),
  ),
);

export const AsyncVesselScreeningExternalInspectionDetailComponent = lazy(() =>
  componentLoader(
    () =>
      import(
        'pages/vessel-screening/forms/external-inspection/detail-external-inspection'
      ),
  ),
);

export const AsyncPageComingSoon = lazy(() =>
  componentLoader(() => import('pages/coming-soon/coming-soon')),
);

/**
 * Pilot Terminal Feedback
 */
export const AsyncListPilotTerminalFeedbackComponent = lazy(() =>
  componentLoader(() => import('pages/pilot-terminal-feedback/list')),
);

export const AsyncDetailPilotTerminalFeedbackComponent = lazy(() =>
  componentLoader(() => import('pages/pilot-terminal-feedback/detail')),
);

export const AsyncCreatePilotTerminalFeedbackComponent = lazy(() =>
  componentLoader(() => import('pages/pilot-terminal-feedback/create')),
);
/**
 * crew
 */
export const AsyncCrewGroupingComponent = lazy(() =>
  componentLoader(() => import('pages/crew-grouping/list')),
);

/**
 * Notification
 */
export const AsyncNotificationListComponent = lazy(() =>
  componentLoader(() => import('pages/notification/list')),
);

export const AsyncDashBoardMasterComponent = lazy(() =>
  componentLoader(
    () => import('../components/dashboard/master/DashBoardMasterContainer'),
  ),
);

export const AsyncCountryComponent = lazy(() =>
  componentLoader(() => import('../pages/country/CountryContainer')),
);

export const AsyncHomePageComponent = lazy(() =>
  componentLoader(() => import('../pages/home-page/HomePage')),
);

export const AsyncModuleConfigurationComponent = lazy(() =>
  componentLoader(
    () => import('../pages/module-configuration/ModuleConfigurationContainer'),
  ),
);

export const AsyncModuleConfigurationDetailComponent = lazy(() =>
  componentLoader(
    () => import('../pages/module-configuration/detail/ModuleConfigDetail'),
  ),
);

export const AsyncWatchListLandingPage = lazy(() =>
  componentLoader(() => import('../pages/watch-list/WatchList')),
);

export const routes: RouteProps[] = [
  {
    path: AppRouteConst.USER,
    exact: true,
    children: (
      <PermissionCheck
        options={{
          feature: Features.USER_ROLE,
          subFeature: SubFeatures.USER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncUserManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
  },
  {
    path: AppRouteConst.USER_CREATE,
    exact: true,
    children: (
      <PermissionCheck
        options={{
          feature: Features.USER_ROLE,
          subFeature: SubFeatures.USER,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNewUserManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
  },
  {
    path: AppRouteConst.getDetailUserProfileById(),
    exact: true,
    children: <AsyncUserProfileDetailComponent />,
  },
  {
    path: AppRouteConst.getUserById(),
    exact: true,
    children: <AsyncUserManagementDetailComponent />,
  },
  {
    path: AppRouteConst.ROLE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.USER_ROLE,
          subFeature: SubFeatures.ROLE_AND_PERMISSION,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncRoleAndPermissionComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.ROLE_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.USER_ROLE,
          subFeature: SubFeatures.ROLE_AND_PERMISSION,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNewRoleAndPermissionComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getRoleAndPermissionById(),
    children: <AsyncRoleAndPermissionDetailComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.GROUP,
    children: (
      <PermissionCheck
        options={{
          feature: Features.GROUP_COMPANY,
          subFeature: SubFeatures.GROUP_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncGroupManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.GROUP_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.GROUP_COMPANY,
          subFeature: SubFeatures.GROUP_MASTER,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncGroupManagementCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getGroupById(),
    children: <AsyncGroupManagementDetailComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.DASHBOARD,
    children: <AsyncDashboardComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.CHECKLIST,
    children: <AsyncNotFound />,
    exact: true,
  },
  // planning and request
  {
    path: AppRouteConst.PLANNING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.PLANNING_AND_REQUEST,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPlanningAndRequestComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.PLANNING_AND_REQUEST_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.PLANNING_AND_REQUEST,
          action: ActionTypeEnum.EXECUTE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPlanningAndRequestCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getPlanningAndRequestById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.PLANNING_AND_REQUEST,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPlanningAndRequestDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // report of finding
  {
    path: AppRouteConst.REPORT_OF_FINDING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncReportOfFindingComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.REPORT_OF_FINDING_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncReportOfFindingCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getReportOfFindingById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncReportOfFindingDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.REPORT_OF_FINDING,
    children: <AsyncNotFound />,
    exact: true,
  },
  {
    path: AppRouteConst.AUDIT_TYPE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUDIT_TYPE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditTypeManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.AUDIT_TYPE_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUDIT_TYPE,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNewAuditTypeManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getAuditTypeById(),
    children: <AsyncAuditTypeManagementDetailComponent />,
    exact: true,
  },

  {
    path: AppRouteConst.CDI,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CDI,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? <AsyncCDIComponent /> : <AsyncNoPermissionComponent />
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // {
  //   path: AppRouteConst.CDI_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.CDI,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncNewCDIComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.getCDIById(),
  //   children: <AsyncCDIDetailComponent />,
  //   exact: true,
  // },

  // report template master

  {
    path: AppRouteConst.REPORT_TEMPLATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.REPORT_TEMPLATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncReportTemplateListComponent />
          ) : (
            // <AsyncNotFound />
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.REPORT_TEMPLATE_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.REPORT_TEMPLATE,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncReportTemplateNewComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.ReportTemplateDetail(),
    children: <AsyncReportTemplateDetailComponent />,
    exact: true,
  },

  // charter - owner

  // {
  //   path: AppRouteConst.SHIP_DEPARTMENT,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHIP_DEPARTMENT,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShipDepartmentManagementComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.SHIP_DEPARTMENT_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHIP_DEPARTMENT,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShipDepartmentManagementCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  {
    path: AppRouteConst.getShipDepartmentById(),
    children: <AsyncShipDepartmentManagementDetailComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.CHARTER_OWNER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CHARTER_OWNER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCharterOwnerManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // {
  //   path: AppRouteConst.CHARTER_OWNER_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.CHARTER_OWNER,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncCharterOwnerManagementCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.getCharterOwnerById(),
  //   children: <AsyncCharterOwnerManagementDetailComponent />,
  //   exact: true,
  // },
  {
    path: AppRouteConst.AUDIT_TIME_TABLE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.AUDIT_TIME_TABLE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditTimeTableManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.AUDIT_TIME_TABLE_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.AUDIT_TIME_TABLE,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditTimeTableManagementCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getAuditTimeTableById(),
    children: <AsyncAuditTimeTableManagementDetailComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.PSC_ACTION,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PSC_ACTION,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPscActionManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.PSC_ACTION_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PSC_ACTION,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPscActionManagementCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getPscActionById(),
    children: <AsyncPscActionManagementDetailComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.OWNER_BUSINESS,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VESSEL_OWNER_BUSINESS,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncOwnerBusinessManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // LOCATION
  {
    path: AppRouteConst.LOCATION,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.LOCATION_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncLocationManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // {
  //   path: AppRouteConst.LOCATION_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.LOCATION_MASTER,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncLocationManagementCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.getLocationById(),
  //   children: <AsyncLocationManagementDetailComponent />,
  //   exact: true,
  // },

  // {
  //   path: AppRouteConst.SHIP_DIRECT_RESPONSIBLE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHIP_DIRECT_RESPONSIBLE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShipDirectResponsibleManagementComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.SHIP_DIRECT_RESPONSIBLE_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHIP_DIRECT_RESPONSIBLE,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShipDirectResponsibleManagementCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.getShipDirectResponsibleById(),
  //   children: <AsyncShipDirectResponsibleManagementDetailComponent />,
  //   exact: true,
  // },

  // ship rank

  // {
  //   path: AppRouteConst.SHIP_RANK,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHIP_RANK,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShipRankManagementComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.SHIP_RANK_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHIP_RANK,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShipRankManagementCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.getShipRankById(),
  //   children: <AsyncShipRankManagementDetailComponent />,
  //   exact: true,
  // },

  // VIQ

  {
    path: AppRouteConst.VIQ,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VIQ,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? <AsyncVIQComponent /> : <AsyncNoPermissionComponent />
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.VIQ_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VIQ,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNewVIQComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVIQById(),
    children: <AsyncVIQDetailComponent />,
    exact: true,
  },

  //
  {
    path: AppRouteConst.CATEGORY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.MAIN_CATEGORY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCategoryManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.CATEGORY_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.MAIN_CATEGORY,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCategoryManagementCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getCategoryById(),
    children: <AsyncCategoryManagementDetailComponent />,
    exact: true,
  },

  {
    path: AppRouteConst.MAIN_CATEGORY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.MAIN_CATEGORY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncMainCategoryManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.SECOND_CATEGORY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.SECOND_CATEGORY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSecondCategoryManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.RISK_FACTOR,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.RISK_FACTOR,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncRiskFactorManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.TERMINAL,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.TERMINAL,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncTerminalManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.THIRD_CATEGORY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.THIRD_CATEGORY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncThirdCategoryManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.TOPIC,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.TOPIC,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncTopicComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.VESSEL,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VESSEL,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.VESSEL_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VESSEL,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselManagementCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVesselById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VESSEL,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselManagementDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.VESSEL_TYPE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.VESSEL_TYPE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselTypeComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.AUTHORITY_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUTHORITY_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuthorityMasterComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.COMPANY_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.GROUP_COMPANY,
          subFeature: SubFeatures.COMPANY,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNewCompanyManagement />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
  },
  {
    path: AppRouteConst.getCompanyById(),
    children: <AsyncCompanyManagementDetail />,
  },
  {
    path: AppRouteConst.COMPANY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.GROUP_COMPANY,
          subFeature: SubFeatures.COMPANY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCompanyManagement />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
  },

  {
    path: AppRouteConst.getAuthorityMasterById(),
    children: <AsyncAuthorityMasterDetailComponent />,
    exact: true,
  },

  // {
  //   path: AppRouteConst.FLEET,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.FLEET,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncFleetManagementComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },

  // focus request

  {
    path: AppRouteConst.FOCUS_REQUEST,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.FOCUS_REQUEST,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncFocusRequestManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // injury master

  {
    path: AppRouteConst.INJURY_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INJURY_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInjuryMasterManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // injury body

  {
    path: AppRouteConst.INJURY_BODY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INJURY_BODY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInjuryBodyManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // Inspector Time Off

  {
    path: AppRouteConst.INSPECTOR_TIME_OFF,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTOR_TIME_OFF,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInspectorTimeOffManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.PORT,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PORT_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPortManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.PORT_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PORT_MASTER,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPortManagementCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getPortById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PORT_MASTER,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPortManagementDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // {
  //   path: AppRouteConst.SHORE_DEPARTMENT,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHORE_DEPARTMENT,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShoreDepartmentComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.SHORE_DEPARTMENT_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHORE_DEPARTMENT,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShoreDepartmentCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.shoreDepartmentDetail(),
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHORE_DEPARTMENT,
  //         action: ActionTypeEnum.VIEW,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShoreDepartmentDetailComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.SHORE_RANK,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHORE_RANK,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShoreRankManagementComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },

  // {
  //   path: AppRouteConst.SHORE_RANK_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHORE_RANK,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShoreRankManagementCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.getShoreRankById(),
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHORE_RANK,
  //         action: ActionTypeEnum.VIEW,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShoreRankManagementDetailComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.SHORE_DEPARTMENT,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.SHORE_DEPARTMENT,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncShoreDepartmentComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  {
    path: AppRouteConst.AUDIT_CHECKLIST,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUDIT_CHECKLIST,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditCheckListsComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.AUDIT_CHECKLIST_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUDIT_CHECKLIST,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditCheckListCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.auditCheckListDetail(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUDIT_CHECKLIST,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditCheckListDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // {
  //   path: AppRouteConst.DMS,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.DMS,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncDMSManagementComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.DMS_CREATE,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.DMS,
  //         action: ActionTypeEnum.CREATE,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncDMSManagementCreateComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // {
  //   path: AppRouteConst.getDMSById(),
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.DMS,
  //         action: ActionTypeEnum.VIEW,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncDMSManagementDetailComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  {
    path: AppRouteConst.MOBILE_CONFIG,
    children: <AsyncMobileConfigComponent />,
    exact: true,
  },

  {
    path: AppRouteConst.MODULE_MANAGEMENT,
    children: <AsyncModuleManagementListComponent />,
    exact: true,
  },

  {
    path: AppRouteConst.PSC_DEFICIENCY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PSC_DEFICIENCY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? <AsyncPSCComponent /> : <AsyncNoPermissionComponent />
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.PSC_DEFICIENCY_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PSC_DEFICIENCY,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPSCCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getPSCDeficiencyById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PSC_DEFICIENCY,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPSCDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // DEPARTMENT MASTER
  {
    path: AppRouteConst.DEPARTMENT_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.DEPARTMENT_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDepartmentMasterComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // RANK MASTER
  {
    path: AppRouteConst.RANK_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.RANK_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncRankMasterComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // WORK FLOW
  {
    path: AppRouteConst.WORK_FLOW_CREATE,

    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncWorkFlowCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // Nature Of Findings Master
  {
    path: AppRouteConst.NATURE_OF_FINDINGS_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.NATURE_OF_FINDINGS_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNatureOfFindingsMasterComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.WORK_FLOW,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncWorkFlowComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getWorkFlowById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncWorkFlowDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // INSPECTION MAPPING

  {
    path: AppRouteConst.INSPECTION_MAPPING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTION_MAPPING, // fix later
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInspectionMappingComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.INSPECTION_MAPPING_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTION_MAPPING, // fix later
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInspectionMappingCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getInspectionMappingById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTION_MAPPING, // fix later
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInspectionMappingDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // AUDIT INSPECTION WORKSPACE

  {
    path: AppRouteConst.AUDIT_INSPECTION_WORKSPACE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditInspectionWorkspaceComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getAuditInspectionWorkspaceById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAuditInspectionWorkspaceDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: '/',
    children: <Redirect to="/home-page" />,
    exact: true,
  },

  // INTERNAL AUDIT REPORT

  {
    path: AppRouteConst.INTERNAL_AUDIT_REPORT,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInternalAuditReportComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getInternalAuditReportById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.INTERNAL_AUDIT_REPORT, // fix later
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInternalAuditReportDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // DEVICE CONTROL
  {
    path: AppRouteConst.DEVICE_CONTROL,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.DEVICE_CONTROL,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDeviceControlComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // APP TYPE PROPERTY
  {
    path: AppRouteConst.APP_TYPE_PROPERTY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.APP_TYPE_PROPERTY,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAppTypePropertyComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getAppTypePropertyById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.APP_TYPE_PROPERTY,
          action: ActionTypeEnum.UPDATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAppTypePropertyDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // CATEGORY MAPPING

  {
    path: AppRouteConst.CATEGORY_MAPPING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CATEGORY_MAPPING,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCategoryMappingComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.CATEGORY_MAPPING_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CATEGORY_MAPPING,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCategoryMappingCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getCategoryMappingById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CATEGORY_MAPPING,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCategoryMappingDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // Division

  {
    path: AppRouteConst.DIVISION_MAPPING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.DIVISION_MAPPING,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDivisionMappingListComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.DIVISION_MAPPING_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.DIVISION_MAPPING,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDivisionMappingCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getDetailDivisionMappingById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.ATTACHMENT_KIT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDivisionMappingDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // Division

  {
    path: AppRouteConst.DIVISION,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.DIVISION,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDivisionListComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // ATTACHMENT KIT

  {
    path: AppRouteConst.ATTACHMENT_KIT,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.ATTACHMENT_KIT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAttachmentKitListComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.ATTACHMENT_KIT_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.ATTACHMENT_KIT,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAttachmentKitCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getAttachmentKiteById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.ATTACHMENT_KIT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncAttachmentKitDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // MAIL MANAGEMENT

  {
    path: AppRouteConst.MAIL_MANAGEMENT,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.MAIL_MANAGEMENT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncMailManagementListComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.MAIL_MANAGEMENT_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.MAIL_MANAGEMENT,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncMailManagementCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getMailManagementById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.MAIL_MANAGEMENT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncMailManagementDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.INSPECTION_FOLLOW_UP,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsynInspectionFollowUpLisComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getInspectionFollowUpById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncInspectionFollowUpDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // FEATURE CONFIG
  // {
  //   path: AppRouteConst.FEATURE_CONFIG,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.CONFIGURATION,
  //         subFeature: SubFeatures.FEATURE_CONFIG,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncFeatureConfigComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },

  // INCIDENT TYPE
  {
    path: AppRouteConst.INCIDENT_TYPE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INCIDENT_TYPE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncIncidentTypeComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // QA DASHBOARD
  // {
  //   path: AppRouteConst.QA_DASHBOARD,
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.QUALITY_ASSURANCE,
  //         subFeature: SubFeatures.QA_DASHBOARD,
  //         action: ActionTypeEnum.VIEW,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncQADashboardComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },

  // STANDARD_MASTER
  {
    path: AppRouteConst.STANDARD_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.STANDARD_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncStandardMasterComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.STANDARD_MASTER_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.STANDARD_MASTER,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNewStandardMasterComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getStandardMasterById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.STANDARD_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncStandardMasterDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    // children: <AsyncStandardMasterDetailComponent />,
    exact: true,
  },

  // SELF ASSESSMENT
  {
    path: AppRouteConst.SELF_ASSESSMENT,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SELF_ASSESSMENT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSelfAssessmentComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.SELF_ASSESSMENT_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SELF_ASSESSMENT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncNewSelfAssessmentComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getSelfAssessmentById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SELF_ASSESSMENT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSelfAssessmentDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getSelfAssessmentDeclarationById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SELF_ASSESSMENT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSelfAssessmentDeclarationComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // ELEMENT MASTER
  {
    path: AppRouteConst.ELEMENT_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.ELEMENT_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncElementMasterListComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.ELEMENT_MASTER_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.ELEMENT_MASTER,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncElementMasterCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getElementMasterById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.ELEMENT_MASTER,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncElementMasterDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // SAIL_GENERAL_REPORT

  {
    path: AppRouteConst.SAIL_GENERAL_REPORT,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportListComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getSailGeneralReportById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getCreateSailGeneralReportIncidentById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportIncidentCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getSailGeneralReportIncidentById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportIncidentDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getCreateInspectionPSCById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportPortStateControlCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getInspectionPSCById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportPortStateControlDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getCreateSailReportInspectionInternalById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportInternalInpectionAuditCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getSailReportInspectionInternalById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportInternalInpectionAuditDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getCreateExternalInspectionById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportOtherExternalInspectionAuditCreateComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getExternalInspectionById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSailGeneralReportExternalInpectionAuditDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.EVENT_TYPE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.EVENT_TYPE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncEventTypeManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.TRANSFER_TYPE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          // subFeature: SubFeatures.TRANSFER_TYPE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncTransferTypeManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.ISSUE_NOTE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.ISSUE_NOTE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncIssueNoteComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  /**
   * VESSEL SCREENING
   */
  {
    path: AppRouteConst.VESSEL_SCREENING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncListVesselScreeningComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.VESSEL_SCREENING_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCreateVesselScreeningComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVesselScreeningById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncViewVesselScreeningComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVesselScreeningById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncViewVesselScreeningComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVesselScreeningIncidentSafetyById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselScreeningIncidentSafetyDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVesselScreeningPSCById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselScreeningPSCDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getVesselScreeningPilotTerminalFeedbackById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselScreeningPilotTerminalFeedbackDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVesselScreeningInternalById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselScreeningInternalInspectionDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getVesselScreeningExternalById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncVesselScreeningExternalInspectionDetailComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  // {
  //   path: AppRouteConst.getVesselScreeningPilotFeedbackById(),
  //   children: (
  //     <PermissionCheck
  //       options={{
  //         feature: Features.QUALITY_ASSURANCE,
  //         subFeature: SubFeatures.VESSEL_SCREENING,
  //       }}
  //     >
  //       {({ hasPermission }) =>
  //         hasPermission ? (
  //           <AsyncVesselScreeningPilotFeedbackDetailComponent />
  //         ) : (
  //           <AsyncNoPermissionComponent />
  //         )
  //       }
  //     </PermissionCheck>
  //   ),
  //   exact: true,
  // },
  // START_NEW_PAGE
  {
    path: AppRouteConst.VALUE_MANAGEMENT,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.ANSWER_VALUE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncValueManagementComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  // END_NEW_PAGE

  {
    path: AppRouteConst.MAP_VIEW,
    children: (
      <PermissionCheck
        options={{
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.MAP_VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncMapViewComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.COMPANY_TYPE,
    children: <AsyncCompanyTypeComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.CARGO,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CARGO,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCargoComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.PLAN_DRAWING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.PLAN_DRAWING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncPlanDrawingComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.CARGO_TYPE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CARGO_TYPE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCargoTypeComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.REPEATED_FINDING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.REPEATED_FINDING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncRepeateFindingCalculationComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  /**
   * INCIDENTS
   */
  {
    path: AppRouteConst.INCIDENTS,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,

          subFeature: SubFeatures.INCIDENTS,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncListIncidentsComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getIncidentsById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,

          subFeature: SubFeatures.INCIDENTS,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDetailIncidentsComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.INCIDENTS_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,

          subFeature: SubFeatures.INCIDENTS,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCreateIncidentsComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.INCIDENTS_SUMMARY,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.INCIDENTS_SUMMARY,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncSummaryIncidentsComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  /**
   * PILOT TERMINAL FEEDBACK
   */
  {
    path: AppRouteConst.PILOT_TERMINAL_FEEDBACK,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,

          subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncListPilotTerminalFeedbackComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },

  {
    path: AppRouteConst.getPilotTerminalFeedbackById(),
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDetailPilotTerminalFeedbackComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.getModuleConfigurationDetailById(),
    children: <AsyncModuleConfigurationDetailComponent />,
    // exact: true,
  },
  {
    path: AppRouteConst.PILOT_TERMINAL_FEEDBACK_CREATE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCreatePilotTerminalFeedbackComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.CREW_GROUPING,
    children: (
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.CREW_GROUPING,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncCrewGroupingComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.NOTIFICATION,
    children: <AsyncNotificationListComponent />,
    exact: true,
  },
  {
    path: '/coming-soon',
    children: <AsyncPageComingSoon />,
  },
  {
    path: '/dashboard-widget',
    children: <AsyncDashboardWidget />,
    exact: true,
  },
  {
    path: AppRouteConst.DASHBOARD_MASTER,
    children: (
      <PermissionCheck
        options={{
          feature: Features.MASTER_DASHBOARD,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncDashBoardMasterComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    exact: true,
  },
  {
    path: AppRouteConst.COUNTRY,
    children: <AsyncCountryComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.HOME_PAGE,
    children: (
      <PermissionCheck
        options={{
          feature: Features.HOME_PAGE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <AsyncHomePageComponent />
          ) : (
            <AsyncNoPermissionComponent />
          )
        }
      </PermissionCheck>
    ),
    // children: <AsyncHomePageComponent />,
    exact: true,
  },

  {
    path: AppRouteConst.MODULE_CONFIGURATION,
    children: <AsyncModuleConfigurationComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.getListModuleConfigByCompanyID(),
    children: <AsyncModuleConfigurationComponent />,
    exact: true,
  },
  {
    path: AppRouteConst.WATCH_LIST,
    children: <AsyncWatchListLandingPage />,
    exact: true,
  },
  {
    path: '',
    children: <AsyncNotFound />,
  },
];
const AppRoute = () => <CustomSwitch routes={routes} />;

export default withAuthenticate(withRouter(AppRoute), {
  needAuthenticated: true,
  unMatchingRedirect: AuthRouteConst.SIGN_IN,
});
