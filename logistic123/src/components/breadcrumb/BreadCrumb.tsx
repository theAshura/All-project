import { FC } from 'react';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import * as ActionRedux from 'store/action';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import mapLocationToBreadCrumb from './mapLocationToBreadCrumb';
import styles from './breadcrumb.module.scss';

interface BreadCrumbProp {
  current: string;
  highLightCurrent?: boolean;
}

const BreadCrumb: FC<BreadCrumbProp> = ({
  current,
  highLightCurrent = false,
}) => {
  const currentPage = get(mapLocationToBreadCrumb, current);
  const dispatch = useDispatch();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const clearParams = () => {
    dispatch(ActionRedux.default.auditCheckList.clearAuditCheckListReducer());
    dispatch(ActionRedux.default.vesselType.clearParamsVesselTypeReducer());
    dispatch(ActionRedux.default.auditType.clearAuditTypeReducer());
    dispatch(ActionRedux.default.auditCheckList.clearAuditCheckListReducer());
    dispatch(
      ActionRedux.default.roleAndPermission.clearRoleAndPermissionReducer(),
    );
    dispatch(ActionRedux.default.user.clearUserManagementReducer());
    dispatch(ActionRedux.default.fleet.clearFleetParamsReducer());
    dispatch(ActionRedux.default.vessel.clearVesselManagementReducer());
    dispatch(ActionRedux.default.group.clearGroupManagementReducer());
    dispatch(ActionRedux.default.company.clearCompanyManagementReducer());
    dispatch(ActionRedux.default.shoreDepartment.clearShoreDepartmentReducer());
    dispatch(ActionRedux.default.charterOwner.clearCharterOwnerReducer());
    dispatch(ActionRedux.default.auditTimeTable.clearAuditTimeTableReducer());
    dispatch(ActionRedux.default.pscAction.clearPscActionReducer());
    dispatch(ActionRedux.default.ownerBusiness.clearOwnerBusinessReducer());
    dispatch(ActionRedux.default.mainCategory.clearMainCategoryReducer());
    dispatch(ActionRedux.default.secondCategory.clearSecondCategoryReducer());
    dispatch(ActionRedux.default.thirdCategory.clearThirdCategoryReducer());
    dispatch(ActionRedux.default.location.clearLocationReducer());
    dispatch(
      ActionRedux.default.shipDirectResponsible.clearShipDirectResponsibleReducer(),
    );
    dispatch(ActionRedux.default.shipDepartment.clearShipDepartmentReducer());
    dispatch(ActionRedux.default.topic.clearTopicReducer());
    dispatch(ActionRedux.default.port.clearParamsPortReducer());
    dispatch(ActionRedux.default.shoreRank.clearParamsShoreRankReducer());
    dispatch(ActionRedux.default.cdi.clearCDIReducer());
    dispatch(ActionRedux.default.dms.clearDMSReducer());
    dispatch(ActionRedux.default.shipRank.clearShipRankReducer());
    dispatch(ActionRedux.default.viq.clearVIQReducer());
    dispatch(ActionRedux.default.focusRequest.clearFocusRequestReducer());

    dispatch(ActionRedux.default.ReportTemplate.clearReportTemplateReducer());
    dispatch(
      ActionRedux.default.reportOfFinding.clearReportOfFindingReducer(false),
    );
    dispatch(ActionRedux.default.pscDeficiency.clearPSCDeficiencyReducer());
    dispatch(
      ActionRedux.default.inspectionMapping.clearInspectionMappingReducer(),
    );
    dispatch(
      ActionRedux.default.auditInspectionWorkspace.clearAuditInspectionWorkspaceReducer(),
    );
    dispatch(
      ActionRedux.default.internalAuditReport.clearInternalAuditReportReducer(),
    );
    dispatch(
      ActionRedux.default.planningAndRequest.clearPlanningAndRequestReducer(),
    );
    dispatch(
      ActionRedux.default.departmentMaster.clearDepartmentMasterReducer(),
    );
    dispatch(ActionRedux.default.rankMaster.clearRankMasterReducer());
    dispatch(
      ActionRedux.default.natureOfFindings.clearNatureOfFindingsMasterReducer(),
    );
    dispatch(ActionRedux.default.categoryMapping.clearCategoryMappingReducer());
    dispatch(ActionRedux.default.featureConfig.clearFeatureConfigReducer());
    dispatch(ActionRedux.default.standardMaster.clearStandardMasterReducer());
    dispatch(ActionRedux.default.selfAssessment.clearSelfAssessmentReducer());
    dispatch(ActionRedux.default.elementMaster.clearElementMasterReducer());
    dispatch(ActionRedux.default.eventType.clearEventTypeParamsReducer());
    dispatch(ActionRedux.default.incidentType.clearIncidentTypeReducer());
    dispatch(ActionRedux.default.issueNote.clearIssueNoteReducer());
    dispatch(ActionRedux.default.injuryMaster.clearInjuryMasterReducer());
    dispatch(
      ActionRedux.default.portStateControl.clearPortStateControlReducer(),
    );
    dispatch(ActionRedux.default.vesselScreening.clearVesselScreeningReducer());
    dispatch(
      ActionRedux.default.vesselInternalInspection.clearVesselInternalInspectionReducer(),
    );
    dispatch(
      ActionRedux.default.vesselExternalInspection.clearVesselExternalInspectionReducer(),
    );
    dispatch(ActionRedux.default.crewGrouping.clearCrewGroupingReducer());
  };

  return (
    <div className={styles.breadCrumb}>
      {currentPage?.breadCrumbs.map((item, index, array) => {
        if (array.length === 1) {
          if (highLightCurrent) {
            return (
              <Link
                to={item.path}
                key={`${item.name}-${item.path}`}
                className={styles.breadCrumbLink}
                onClick={clearParams}
              >
                <span className={styles.breadCrumbLink}>
                  {renderDynamicModuleLabel(listModuleDynamicLabels, item.name)}{' '}
                </span>
              </Link>
            );
          }
          return (
            <span key={`${item.name}-${item.path}`}>
              {renderDynamicModuleLabel(listModuleDynamicLabels, item.name)}
            </span>
          );
        }
        if (index === array.length - 1) {
          return (
            <span key={`${item.name}-${item.path}`}>
              {renderDynamicModuleLabel(listModuleDynamicLabels, item.name)}
            </span>
          );
        }
        if (index === 0 || !item.path.length) {
          return (
            <span key={`${item.name}-${item.path}`}>
              {renderDynamicModuleLabel(listModuleDynamicLabels, item.name)}
              {` / `}
            </span>
          );
        }
        return (
          <Link
            to={item.path}
            key={`${item.name}-${item.path}`}
            className={styles.breadCrumbLink}
            onClick={clearParams}
          >
            <span className={styles.breadCrumbLink}>
              {renderDynamicModuleLabel(listModuleDynamicLabels, item.name)}
            </span>
            <span>{` / `}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
