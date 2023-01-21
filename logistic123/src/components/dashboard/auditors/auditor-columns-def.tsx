import { openNewPage, dateStringComparator } from 'helpers/utils.helper';
import { AppRouteConst } from 'constants/route.const';
import { Action } from 'models/common.model';
import images from 'assets/images/images';
import {
  SubFeatures,
  ActionTypeEnum,
  Features,
} from 'constants/roleAndPermission.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import { ButtonType } from 'components/ui/button/Button';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import cx from 'classnames';
import { ModalTabType } from '../constants/auditor.const';
import { DataDetailModal } from '../components/modal-double/ModalDouble';

const checkWorkflow = (
  modalType: string,
  item,
  labelTotal: string,
  feature: string,
  subFeature: string,
  handleGetDataModalDetail: (
    modalType: string,
    id: string,
    data: DataDetailModal,
  ) => void,
): Action[] => {
  const actions: Action[] = [
    {
      img: images.icons.icViewDetail,
      function: () =>
        handleGetDataModalDetail(
          modalType,
          item?.vesselId || item?.auditCompanyId,
          {
            vesselCode: item?.vesselCode || '',
            vesselName: item?.vesselName || '',
            auditCompanyName: item?.auditCompanyName || '',
            labelTotal,
          },
        ),
      feature: Features.AUDIT_INSPECTION,
      subFeature,
      action: ActionTypeEnum.VIEW,
      buttonType: ButtonType.Blue,
      cssClass: 'me-1',
    },
  ];
  return actions;
};

export const columnsDefinition = (options: {
  colType?: string;
  isMultiColumnFilter?: boolean;
  t?: any;
  handleGetDataModalDetail?: any;
  modalTabType?: string;
  feature?: string;
  entityType?: string;
  dynamicLabels?: IDynamicLabel;
}) => {
  const {
    colType,
    isMultiColumnFilter,
    t,
    handleGetDataModalDetail,
    // modalTabType,
    feature,
    // entityType,
    dynamicLabels,
  } = options;

  switch (colType) {
    case 'columnNonConformityDetail':
      return [
        {
          field: 'refId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection report Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getInternalAuditReportById(data?.iarId),
                )
              }
            >
              {data.refId}
            </div>
          ),
        },
        {
          field: 'refNo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Findings Ref.No'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditType',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'findings',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Findings,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'isSignificant',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Is significant'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'columnNonConformity':
      return [
        {
          field: 'action',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Action,
          ),
          filter: false,
          sortable: false,
          enableRowGroup: false,
          lockPosition: true,
          minWidth: 125,
          maxWidth: 125,
          pinned: 'left',
          cellRendererFramework: (params) => {
            const { data } = params;

            let actions = checkWorkflow(
              ModalTabType.NON_CONFORMITY,
              data,
              t('totalNonConformityFinding'),
              Features.AUDIT_INSPECTION,
              SubFeatures.VIEW_DASHBOARD,
              handleGetDataModalDetail,
            );
            if (!data) {
              actions = [];
            }
            return (
              <div
                className={cx(
                  'd-flex justify-content-start align-items-center',
                )}
              >
                <ActionBuilder actionList={actions} />
              </div>
            );
          },
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                handleGetDataModalDetail(
                  ModalTabType.NON_CONFORMITY,
                  data?.vesselId || data?.auditCompanyId,
                  {
                    vesselCode: data?.vesselCode,
                    vesselName: data?.vesselName,
                    auditCompanyName: data?.auditCompanyName || '',
                    labelTotal: t('totalNonConformityFinding'),
                  },
                )
              }
            >
              {data?.vesselName}
            </div>
          ),
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'entity',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Entity,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div>{data?.vesselId ? 'Vessel' : 'Office'}</div>
          ),
        },
        {
          field: 'total',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Total open non-conformity'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ]?.filter((item) => item);
    case 'columnObservations':
      return [
        {
          field: 'action',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Action,
          ),
          filter: false,
          sortable: false,
          enableRowGroup: false,
          lockPosition: true,
          minWidth: 125,
          maxWidth: 125,
          pinned: 'left',
          cellRendererFramework: (params) => {
            const { data } = params;

            let actions = checkWorkflow(
              ModalTabType.OBSERVATIONS,
              data,
              t('totalOpenObservations'),
              feature,
              SubFeatures.VIEW_DASHBOARD,
              handleGetDataModalDetail,
            );
            if (!data) {
              actions = [];
            }
            return (
              <div
                className={cx(
                  'd-flex justify-content-start align-items-center',
                  // styles.subAction,
                )}
              >
                <ActionBuilder actionList={actions} />
              </div>
            );
          },
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                handleGetDataModalDetail(
                  ModalTabType.OBSERVATIONS,
                  data?.vesselId || data?.auditCompanyId,
                  {
                    vesselCode: data?.vesselCode,
                    vesselName: data?.vesselName,
                    auditCompanyName: data?.auditCompanyName || '',
                    labelTotal: t('totalOpenObservations'),
                  },
                )
              }
            >
              {data?.vesselName}
            </div>
          ),
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'entity',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Entity,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div>{data?.vesselId ? 'Vessel' : 'Office'}</div>
          ),
        },
        {
          field: 'total',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Total open observation findings'
            ],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'columnObservationsDetail':
      return [
        {
          field: 'refId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection report Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getInternalAuditReportById(data?.iarId),
                )
              }
            >
              {data.refId}
            </div>
          ),
        },
        {
          field: 'refNo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Findings Ref.No'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditType',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'findings',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Findings,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'isSignificant',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Is significant'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'columnAuditTimeTable':
      return [
        {
          field: 'refNo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Reference number'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditRefId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Plan Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getPlanningAndRequestById(
                    data?.planningRequestId,
                  ),
                )
              }
            >
              {data?.auditRefId}
            </div>
          ),
        },
        {
          field: 'sNo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection time table S.No'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'leadAuditor',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead auditor'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'plannedFromDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Planned audit from date'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
      ];

    case 'columnReportOfFinding':
      return [
        {
          field: 'refId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of Findings Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getReportOfFindingById(
                    data?.reportFindingFormId,
                  ),
                )
              }
            >
              {data?.refId}
            </div>
          ),
        },
        {
          field: 'auditRefID',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Plan Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getPlanningAndRequestById(data?.auditRefId),
                )
              }
            >
              {data?.auditRefID}
            </div>
          ),
        },
        {
          field: 'sNo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of findings S.No'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'leadAuditor',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead inspector'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'plannedFromDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Actual Inspection From Date'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
      ];
    case 'columnInternalAuditReport':
      return [
        {
          field: 'refId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection report Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(AppRouteConst.getInternalAuditReportById(data?.id))
              }
            >
              {data?.refId}
            </div>
          ),
        },
        {
          field: 'auditRefID',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Plan Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getPlanningAndRequestById(data?.planningID),
                )
              }
            >
              {data?.auditRefID}
            </div>
          ),
        },
        {
          field: 'serialNumber',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection report S.No'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'leadAuditor',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead inspector'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'status',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Status,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRenderer: 'cellRenderStatus',
        },
      ];
    case 'columnUpcomingAuditPlanVesselDetail':
      return [
        {
          field: 'auditNo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Audit plan ref. ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getPlanningAndRequestById(data?.planId),
                )
              }
            >
              {data.auditNo}
            </div>
          ),
        },
        {
          field: 'plannedFromDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Planned inspection date from'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
        {
          field: 'username',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead inspector name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'columnUpcomingAuditPlanVessel':
      return [
        {
          field: 'action',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Action,
          ),
          filter: false,
          sortable: false,
          enableRowGroup: false,
          lockPosition: true,
          minWidth: 125,
          maxWidth: 125,
          pinned: 'left',
          cellRendererFramework: (params) => {
            const { data } = params;

            let actions = checkWorkflow(
              ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL,
              data,
              t('totalUpcomingInspectionPlans'),
              feature,
              SubFeatures.VIEW_DASHBOARD,
              handleGetDataModalDetail,
            );
            if (!data) {
              actions = [];
            }
            return (
              <div
                className={cx(
                  'd-flex justify-content-start align-items-center',
                )}
              >
                <ActionBuilder actionList={actions} />
              </div>
            );
          },
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'entity',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Entity,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div>{data?.vesselId ? 'Vessel' : 'Office'}</div>
          ),
        },
        {
          field: 'upComingPr',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Upcoming audit plans'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'columnUpcomingReportVesselDetail':
      return [
        {
          field: 'serialNumber',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report S.No'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(
                  AppRouteConst.getInternalAuditReportById(data?.iarId),
                )
              }
            >
              {data.serialNumber}
            </div>
          ),
        },
        {
          field: 'refId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'username',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead inspector name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'columnUpcomingReportVessel':
      return [
        {
          field: 'action',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Action,
          ),
          filter: false,
          sortable: false,
          enableRowGroup: false,
          lockPosition: true,
          minWidth: 125,
          maxWidth: 125,
          pinned: 'left',
          cellRendererFramework: (params) => {
            const { data } = params;

            let actions = checkWorkflow(
              ModalTabType.UPCOMING_REPORTS_VESSEL,
              data,
              t('totalUpcomingReport'),
              feature,
              SubFeatures.VIEW_DASHBOARD,
              handleGetDataModalDetail,
            );
            if (!data) {
              actions = [];
            }
            return (
              <div
                className={cx(
                  'd-flex justify-content-start align-items-center',
                )}
              >
                <ActionBuilder actionList={actions} />
              </div>
            );
          },
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'entity',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Entity,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div>{data?.vesselId ? 'Vessel' : 'Office'}</div>
          ),
        },
        {
          field: 'upComingIAR',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Upcoming audit plans'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'columnInspectionPlansNeedReviewing':
      return [
        {
          field: 'refId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id))
              }
            >
              {data?.refId}
            </div>
          ),
        },
        {
          field: 'sno',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['S.No'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id))
              }
            >
              {data?.sno}
            </div>
          ),
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'leadAuditor',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead inspector'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'actualFromDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Planned Inspection Date From'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
        {
          field: 'actualToDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Planned Inspection Date To'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
      ];
    case 'columnInspectionTimeTableNotClosedOutSection':
      return [
        {
          field: 'refId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                data &&
                data?.planningRequestId &&
                openNewPage(
                  AppRouteConst.getPlanningAndRequestById(
                    data?.planningRequestId,
                  ),
                )
              }
            >
              {data?.refId}
            </div>
          ),
        },
        {
          field: 'sno',
          headerName: 'S.No',
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() =>
                openNewPage(AppRouteConst.getAuditTimeTableById(data?.id))
              }
            >
              {data?.sno}
            </div>
          ),
        },
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditCompanyName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Company name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'auditRefId',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Audit Ref.Id'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'actualFromDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Actual Inspection From Date'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
      ];
    default:
      return [];
  }
};
