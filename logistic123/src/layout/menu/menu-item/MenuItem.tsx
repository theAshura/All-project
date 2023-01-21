import cx from 'classnames';
import { PARAMS_DEFAULT_MENU } from 'constants/filter.const';
import { AppRouteConst } from 'constants/route.const';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as ActionRedux from 'store/action';
import styles from './menu-item.module.scss';

interface MenuItemProps {
  content: string;
  imagesActive?: string;
  imagesInActive?: string;
  urlPage: string;
  isGroup?: boolean;
  isQuality?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  contentStyle?: string;
}

const MenuItem: FC<MenuItemProps> = (props) => {
  const {
    content,
    urlPage,
    imagesActive,
    isGroup,
    isQuality,
    imagesInActive,
    onClick,
    isActive,
    contentStyle,
  } = props;
  const menuItemRef = useRef(null);
  const dispatch = useDispatch();

  const clearParams = useCallback(() => {
    switch (urlPage) {
      case AppRouteConst.VESSEL_TYPE: {
        dispatch(
          ActionRedux.default.vesselType.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.AUTHORITY_MASTER: {
        dispatch(
          ActionRedux.default.authorityMaster.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.AUDIT_CHECKLIST: {
        dispatch(
          ActionRedux.default.auditCheckList.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.AUDIT_TYPE: {
        dispatch(
          ActionRedux.default.auditType.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.ROLE: {
        dispatch(
          ActionRedux.default.roleAndPermission.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.USER: {
        dispatch(
          ActionRedux.default.user.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.ATTACHMENT_KIT: {
        dispatch(
          ActionRedux.default.AttachmentKit.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.FLEET: {
        dispatch(
          ActionRedux.default.fleet.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.VESSEL: {
        dispatch(
          ActionRedux.default.vessel.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.GROUP: {
        dispatch(
          ActionRedux.default.group.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.MAIL_MANAGEMENT: {
        dispatch(
          ActionRedux.default.mailManagement.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.COMPANY: {
        dispatch(
          ActionRedux.default.company.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.SHORE_DEPARTMENT: {
        dispatch(
          ActionRedux.default.shoreDepartment.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.CHARTER_OWNER: {
        dispatch(
          ActionRedux.default.charterOwner.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.PSC_ACTION: {
        dispatch(
          ActionRedux.default.pscAction.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.OWNER_BUSINESS: {
        dispatch(
          ActionRedux.default.pscAction.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.AUDIT_TIME_TABLE: {
        dispatch(
          ActionRedux.default.auditTimeTable.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.LOCATION: {
        dispatch(
          ActionRedux.default.location.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.SHIP_DEPARTMENT: {
        dispatch(
          ActionRedux.default.shipDepartment.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.REPORT_TEMPLATE: {
        dispatch(
          ActionRedux.default.ReportTemplate.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.SHIP_DIRECT_RESPONSIBLE: {
        dispatch(
          ActionRedux.default.shipDirectResponsible.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.CATEGORY: {
        dispatch(
          ActionRedux.default.category.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.MAIN_CATEGORY: {
        dispatch(
          ActionRedux.default.mainCategory.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.SECOND_CATEGORY: {
        dispatch(
          ActionRedux.default.secondCategory.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.RISK_FACTOR: {
        dispatch(
          ActionRedux.default.riskFactor.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.TERMINAL: {
        dispatch(
          ActionRedux.default.terminal.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.THIRD_CATEGORY: {
        dispatch(
          ActionRedux.default.thirdCategory.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.TOPIC: {
        dispatch(
          ActionRedux.default.topic.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.TRANSFER_TYPE: {
        dispatch(
          ActionRedux.default.transferType.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.PORT: {
        dispatch(
          ActionRedux.default.port.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.SHORE_RANK: {
        dispatch(
          ActionRedux.default.shoreRank.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.CDI: {
        dispatch(
          ActionRedux.default.cdi.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.SHIP_RANK: {
        dispatch(
          ActionRedux.default.shipRank.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.VIQ: {
        dispatch(
          ActionRedux.default.viq.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }

      case AppRouteConst.PSC_DEFICIENCY: {
        dispatch(
          ActionRedux.default.pscDeficiency.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.INSPECTION_MAPPING: {
        dispatch(
          ActionRedux.default.inspectionMapping.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.AUDIT_INSPECTION_WORKSPACE: {
        dispatch(
          ActionRedux.default.auditInspectionWorkspace.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.INTERNAL_AUDIT_REPORT: {
        dispatch(
          ActionRedux.default.internalAuditReport.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.PLANNING: {
        dispatch(
          ActionRedux.default.planningAndRequest.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.RANK_MASTER: {
        dispatch(
          ActionRedux.default.rankMaster.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.DEPARTMENT_MASTER: {
        dispatch(
          ActionRedux.default.departmentMaster.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.NATURE_OF_FINDINGS_MASTER: {
        dispatch(
          ActionRedux.default.natureOfFindings.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.WORK_FLOW: {
        dispatch(
          ActionRedux.default.WorkFlow.updateParamsActions(PARAMS_DEFAULT_MENU),
        );

        break;
      }

      case AppRouteConst.REPORT_OF_FINDING: {
        dispatch(
          ActionRedux.default.reportOfFinding.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.CATEGORY_MAPPING: {
        dispatch(
          ActionRedux.default.categoryMapping.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.INSPECTOR_TIME_OFF: {
        dispatch(
          ActionRedux.default.inspectorTimeOff.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.FOCUS_REQUEST: {
        dispatch(
          ActionRedux.default.focusRequest.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.STANDARD_MASTER:
      case AppRouteConst.QA_DASHBOARD: {
        dispatch(
          ActionRedux.default.standardMaster.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.SELF_ASSESSMENT: {
        dispatch(
          ActionRedux.default.selfAssessment.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.ELEMENT_MASTER: {
        dispatch(
          ActionRedux.default.elementMaster.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.EVENT_TYPE: {
        dispatch(
          ActionRedux.default.eventType.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.INCIDENT_TYPE: {
        dispatch(
          ActionRedux.default.incidentType.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.ISSUE_NOTE: {
        dispatch(
          ActionRedux.default.issueNote.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.INJURY_MASTER: {
        dispatch(
          ActionRedux.default.injuryMaster.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.SAIL_GENERAL_REPORT: {
        dispatch(
          ActionRedux.default.incidentInvestigation.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        dispatch(
          ActionRedux.default.surveyClassInfo.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        dispatch(
          ActionRedux.default.maintenancePerformance.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        dispatch(ActionRedux.default.dryDocking.clearDryDockingAction());
        dispatch(
          ActionRedux.default.portStateControl.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        dispatch(
          ActionRedux.default.plansAndDrawing.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.INJURY_BODY: {
        dispatch(
          ActionRedux.default.injuryBody.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }
      case AppRouteConst.CARGO: {
        dispatch(
          ActionRedux.default.cargo.updateParamsActions(PARAMS_DEFAULT_MENU),
        );
        break;
      }
      case AppRouteConst.CARGO_TYPE: {
        dispatch(
          ActionRedux.default.cargoType.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      case AppRouteConst.VESSEL_SCREENING: {
        dispatch(
          ActionRedux.default.vesselScreening.updateParamsActions(
            PARAMS_DEFAULT_MENU,
          ),
        );
        break;
      }

      default:
    }
  }, [dispatch, urlPage]);

  const handleClick = useCallback(() => {
    clearParams();
    onClick();
  }, [clearParams, onClick]);

  useEffect(() => {
    if (isActive) {
      menuItemRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isActive]);

  return (
    <Link
      to={urlPage}
      className={cx('d-flex', styles.menuItem, {
        [styles.active]: isActive,
        [styles.inActive]: !isActive,
        [styles.headerGroup]: isGroup,
        [styles.quality]: isQuality,
        [styles.normal]: !isQuality,
      })}
      onClick={handleClick}
    >
      <img
        className={styles.icMenu}
        src={isActive ? imagesActive : imagesInActive}
        alt="icon menu"
      />
      <span className={cx(styles.content, contentStyle)}>{content}</span>
    </Link>
  );
};

export default MenuItem;
