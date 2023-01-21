import { AppRouteConst } from 'constants/route.const';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  RoleScope,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { permissionCheck } from 'helpers/permissionCheck.helper';
import { CompanyLevelEnum } from 'constants/common.const';

export const menuWithPermission = ({
  listModuleDynamicLabels,
  userInfo,
  search = '',
}) => [
  {
    name: renderDynamicModuleLabel(
      listModuleDynamicLabels,
      DynamicLabelModuleName.Homepage,
    ),
    visible: userInfo?.roleScope !== RoleScope.SuperAdmin,
    link: AppRouteConst.HOME_PAGE,
  },
  {
    name: renderDynamicModuleLabel(
      listModuleDynamicLabels,
      DynamicLabelModuleName.Dashboard,
    ),
    visible: permissionCheck(userInfo, {
      feature: Features.MASTER_DASHBOARD,
      subFeature: SubFeatures.VIEW_DASHBOARD,
    }),
    link: AppRouteConst.DASHBOARD_MASTER,
  },
  {
    // visible:permissionRoleMenu(Features.AUDIT_INSPECTION),
    name: renderDynamicModuleLabel(
      listModuleDynamicLabels,
      DynamicLabelModuleName.AuditInspection,
    ),
    subMenus: [
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionDashboard,
        ),
        visible:
          permissionCheck(
            userInfo,
            {
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.VIEW_DASHBOARD,
            },
            search,
          ) || userInfo?.roleScope === RoleScope.SuperAdmin,
        link: AppRouteConst.DASHBOARD,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionMapView,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.MAP_VIEW,
          },
          search,
        ),
        link: AppRouteConst.MAP_VIEW,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionPar,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.PLANNING_AND_REQUEST,
          },
          search,
        ),
        link: AppRouteConst.PLANNING,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionAuditTimeTable,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.AUDIT_TIME_TABLE,
          },
          search,
        ),
        link: AppRouteConst.AUDIT_TIME_TABLE,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionInspectionWorkspace,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
          },
          search,
        ),
        link: AppRouteConst.AUDIT_INSPECTION_WORKSPACE,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionReportOfFinding,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.REPORT_OF_FINDING,
          },
          search,
        ),
        link: AppRouteConst.REPORT_OF_FINDING,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionInspectionReport,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
          },
          search,
        ),
        link: AppRouteConst.INTERNAL_AUDIT_REPORT,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
          },
          search,
        ),
        link: AppRouteConst.INSPECTION_FOLLOW_UP,
      },
    ],
  },
  {
    // visible:permissionRoleMenu(Features.AUDIT_INSPECTION),
    name: renderDynamicModuleLabel(
      listModuleDynamicLabels,
      DynamicLabelModuleName.QuantityAssurance,
    ),
    subMenus: [
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceSelfAssessment,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.SELF_ASSESSMENT_SUB_FEATURE,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssuranceSelfAssessmentStamdardMaster,
            ),
            visible: permissionCheck(userInfo, {
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.STANDARD_MASTER,
            }),
            link: AppRouteConst.STANDARD_MASTER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssuranceSelfAssessmentElementMaster,
            ),
            visible: permissionCheck(userInfo, {
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.ELEMENT_MASTER,
            }),
            link: AppRouteConst.ELEMENT_MASTER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssuranceSelfAssessmentSelfAssessment,
            ),
            visible: permissionCheck(userInfo, {
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SELF_ASSESSMENT,
            }),
            link: AppRouteConst.SELF_ASSESSMENT,
          },
        ],
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceSailingReport,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.SAILING_REPORT,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssuranceSailingReportSailingGeneralReport,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              },
              search,
            ),
            link: AppRouteConst.SAIL_GENERAL_REPORT,
          },
        ],
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceIncidents,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.INCIDENTS_SUB_FEATURE,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssuranceIncidentsSummary,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.INCIDENTS_SUMMARY,
              },
              search,
            ),
            link: AppRouteConst.INCIDENTS_SUMMARY,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssuranceIncidentsIncidents,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.INCIDENTS,
              },
              search,
            ),
            link: AppRouteConst.INCIDENTS,
          },
        ],
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssurancePilotTerminalFeedback,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssurancePilotTerminalFeedbackPilotTerminalFeedback,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
              },
              search,
            ),
            link: AppRouteConst.PILOT_TERMINAL_FEEDBACK,
          },
        ],
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceVesselScreening,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.VESSEL_SCREENING_SUB_FEATURE,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.QuantityAssuranceVesselScreeningVesselScreening,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.VESSEL_SCREENING,
              },
              search,
            ),
            link: AppRouteConst.VESSEL_SCREENING,
          },
        ],
      },
    ],
  },
  {
    name: renderDynamicModuleLabel(
      listModuleDynamicLabels,
      DynamicLabelModuleName.GroupCompany,
    ),
    visible:
      userInfo?.roleScope === RoleScope.SuperAdmin ||
      (userInfo?.rolePermissions?.some((item) =>
        item?.includes(`${Features.GROUP_COMPANY}::`),
      ) &&
        userInfo.companyLevel === CompanyLevelEnum.MAIN_COMPANY),
    link: '',
    subMenus: [
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.GroupCompanyCompanyType,
        ),
        visible:
          userInfo?.roleScope === RoleScope.SuperAdmin ||
          permissionCheck(
            userInfo,
            {
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY_TYPE,
            },
            search,
          ),
        link: AppRouteConst.COMPANY_TYPE,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.GroupCompanyCompany,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.GROUP_COMPANY,
            subFeature: SubFeatures.COMPANY,
          },
          search,
        ),
        link: AppRouteConst.COMPANY,
      },
      {
        name: 'Group master',
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.GROUP_COMPANY,
            subFeature: SubFeatures.GROUP_MASTER,
          },
          search,
        ),
        link: AppRouteConst.GROUP,
      },
    ],
  },
  {
    name: renderDynamicModuleLabel(
      listModuleDynamicLabels,
      DynamicLabelModuleName.UserRoles,
    ),
    visible: true,
    link: '',
    subMenus: [
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.UserRolesRoleAndPermission,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.USER_ROLE,
            subFeature: SubFeatures.ROLE_AND_PERMISSION,
          },
          search,
        ),
        link: AppRouteConst.ROLE,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.UserRolesUser,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.USER_ROLE,
            subFeature: SubFeatures.USER,
          },
          search,
        ),
        link: AppRouteConst.USER,
      },
    ],
  },
  {
    name: renderDynamicModuleLabel(
      listModuleDynamicLabels,
      DynamicLabelModuleName.Configuration,
    ),
    visible: true,
    link: '',
    subMenus: [
      {
        name: 'Country master',
        visible: userInfo?.roleScope === RoleScope.SuperAdmin,
        link: AppRouteConst.COUNTRY,
      },
      {
        name: 'Module Configuration',
        visible: userInfo?.roleScope === RoleScope.SuperAdmin,
        link: AppRouteConst.MODULE_CONFIGURATION,
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommon,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CONFIGURATION_COMMON_SUB_FEATURES,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonCrewGrouping,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.CREW_GROUPING,
              },
              search,
            ),
            link: AppRouteConst.CREW_GROUPING,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonDivision,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.DIVISION,
              },
              search,
            ),
            link: AppRouteConst.DIVISION,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonDepartment,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.DEPARTMENT_MASTER,
              },
              search,
            ),
            link: AppRouteConst.DEPARTMENT_MASTER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.DIVISION_MAPPING,
              },
              search,
            ),
            link: AppRouteConst.DIVISION_MAPPING,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonAudittype,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.AUDIT_TYPE,
              },
              search,
            ),
            link: AppRouteConst.AUDIT_TYPE,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonLocationmaster,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.LOCATION_MASTER,
              },
              search,
            ),
            link: AppRouteConst.LOCATION,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonMaincategory,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.MAIN_CATEGORY,
              },
              search,
            ),
            link: AppRouteConst.MAIN_CATEGORY,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonPortmaster,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.PORT_MASTER,
              },
              search,
            ),
            link: AppRouteConst.PORT,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonVessel,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VESSEL,
              },
              search,
            ),
            link: AppRouteConst.VESSEL,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VIQ,
              },
              search,
            ),
            link: AppRouteConst.VIQ,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonVesseltype,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VESSEL_TYPE,
              },
              search,
            ),
            link: AppRouteConst.VESSEL_TYPE,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
              },
              search,
            ),
            link: AppRouteConst.WORK_FLOW,
          },
        ],
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspection,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CONFIGURATION_INSPECTION_SUB_FEATURES,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.APP_TYPE_PROPERTY,
              },
              search,
            ),
            link: AppRouteConst.APP_TYPE_PROPERTY,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.ATTACHMENT_KIT,
              },
              search,
            ),
            link: AppRouteConst.ATTACHMENT_KIT,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.CATEGORY_MAPPING,
              },
              search,
            ),
            link: AppRouteConst.CATEGORY_MAPPING,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionCharterOwner,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.CHARTER_OWNER,
              },
              search,
            ),
            link: AppRouteConst.CHARTER_OWNER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.CDI,
              },
              search,
            ),
            link: AppRouteConst.CDI,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionDeviceControl,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.DEVICE_CONTROL,
              },
              search,
            ),
            link: AppRouteConst.DEVICE_CONTROL,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.AUDIT_CHECKLIST,
              },
              search,
            ),
            link: AppRouteConst.AUDIT_CHECKLIST,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.INSPECTION_MAPPING,
              },
              search,
            ),
            link: AppRouteConst.INSPECTION_MAPPING,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionFocusRequest,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.FOCUS_REQUEST,
              },
              search,
            ),
            link: AppRouteConst.FOCUS_REQUEST,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.MAIL_MANAGEMENT,
              },
              search,
            ),
            link: AppRouteConst.MAIL_MANAGEMENT,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionMobileconfig,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.MOBILE_CONFIG,
              },
              search,
            ),
            link: AppRouteConst.MOBILE_CONFIG,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.NATURE_OF_FINDINGS_MASTER,
              },
              search,
            ),
            link: AppRouteConst.NATURE_OF_FINDINGS_MASTER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionRank,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.RANK_MASTER,
              },
              search,
            ),
            link: AppRouteConst.RANK_MASTER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.REPEATED_FINDING,
              },
              search,
            ),
            link: AppRouteConst.REPEATED_FINDING,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.REPORT_TEMPLATE,
              },
              search,
            ),
            link: AppRouteConst.REPORT_TEMPLATE,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.SECOND_CATEGORY,
              },
              search,
            ),
            link: AppRouteConst.SECOND_CATEGORY,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionThirdCategory,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.THIRD_CATEGORY,
              },
              search,
            ),
            link: AppRouteConst.THIRD_CATEGORY,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionInspectorTimeOff,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.INSPECTOR_TIME_OFF,
              },
              search,
            ),
            link: AppRouteConst.INSPECTOR_TIME_OFF,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionTopic,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.TOPIC,
              },
              search,
            ),
            link: AppRouteConst.TOPIC,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationInspectionAnswerValue,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.ANSWER_VALUE,
              },
              search,
            ),
            link: AppRouteConst.VALUE_MANAGEMENT,
          },
        ],
      },
      {
        name: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationQA,
        ),
        visible: permissionCheck(
          userInfo,
          {
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CONFIGURATION_QA_SUB_FEATURES,
          },
          search,
        ),
        link: '',
        subMenus: [
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAAuthorityMaster,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.AUTHORITY_MASTER,
              },
              search,
            ),
            link: AppRouteConst.AUTHORITY_MASTER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAInjuryBody,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.INJURY_BODY,
              },
              search,
            ),
            link: AppRouteConst.INJURY_BODY,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQACargo,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.CARGO,
              },
              search,
            ),
            link: AppRouteConst.CARGO,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQACargoType,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.CARGO_TYPE,
              },
              search,
            ),
            link: AppRouteConst.CARGO_TYPE,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAEventType,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.EVENT_TYPE,
              },
              search,
            ),
            link: AppRouteConst.EVENT_TYPE,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAIncidentMaster,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.INCIDENT_TYPE,
              },
              search,
            ),
            link: AppRouteConst.INCIDENT_TYPE,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAInjuryMaster,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.INJURY_MASTER,
              },
              search,
            ),
            link: AppRouteConst.INJURY_MASTER,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQATechnicalIssueNote,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.ISSUE_NOTE,
              },
              search,
            ),
            link: AppRouteConst.ISSUE_NOTE,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAPlansDrawingsMaster,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.PLAN_DRAWING,
              },
              search,
            ),
            link: AppRouteConst.PLAN_DRAWING,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAPSCAction,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.PSC_ACTION,
              },
              search,
            ),
            link: AppRouteConst.PSC_ACTION,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQAPSCDeficiency,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.PSC_DEFICIENCY,
              },
              search,
            ),
            link: AppRouteConst.PSC_DEFICIENCY,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQATerminal,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.TERMINAL,
              },
              search,
            ),
            link: AppRouteConst.TERMINAL,
          },
          {
            name: renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.ConfigurationQATransferType,
            ),
            visible: permissionCheck(
              userInfo,
              {
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.TRANSFER_TYPE,
              },
              search,
            ),
            link: AppRouteConst.TRANSFER_TYPE,
          },
        ],
      },
    ],
  },
];

export const searchBarMenu = ({ listModuleDynamicLabels, userInfo }) => {
  const menuRender = [];

  const menuList = menuWithPermission({
    listModuleDynamicLabels,
    userInfo,
  });

  const recusiveMenuItem = (item) => {
    if (item?.subMenus?.length) {
      item?.subMenus?.forEach((e) => {
        recusiveMenuItem(e);
      });
      return;
    }
    if (item?.visible) {
      menuRender?.push(item);
    }
  };

  menuList?.forEach((menu) => {
    recusiveMenuItem(menu);
  });

  return menuRender;
};
