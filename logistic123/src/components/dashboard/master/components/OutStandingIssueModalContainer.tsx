import {
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  FC,
  useMemo,
} from 'react';
import { DataDetailModal } from 'components/dashboard/components/modal-double/ModalDouble';
import { useDispatch, useSelector } from 'react-redux';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import {
  openNewPage,
  dateStringComparator,
  formatDateTime,
} from 'helpers/utils.helper';
import { AppRouteConst } from 'constants/route.const';
import {
  getCompanyOpenFindingObservationByVesselActions,
  getCompanyOpenNonConformityByVesselActions,
} from 'store/dashboard/dashboard.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';

import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { Features, ActionTypeEnum } from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import cx from 'classnames';
import {
  OutstandingFindingIssues,
  OutstandingIssuesTimeTable,
} from 'models/api/dashboard/dashboard.model';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { ModalDashboardType } from '../../constants/company.const';
import OutStandingIssueModal from './OutStandingIssueModal';

interface OutStandingIssueModalProps {
  openIssueModal: ModalDashboardType;
  setOpenIssueModal: Dispatch<SetStateAction<ModalDashboardType>>;
}

const renderButtonView = (
  handleClick: () => void,
  disable: boolean = false,
) => (
  <Button
    disabledCss={disable}
    disabled={disable}
    buttonSize={ButtonSize.IconSmallAction}
    buttonType={ButtonType.Blue}
    onClick={(e) => {
      if (handleClick) {
        handleClick();
      }
      e.stopPropagation();
    }}
  >
    <img src={images.icons.icViewDetail} alt="view" />
  </Button>
);

const OutStandingIssueModalContainer: FC<OutStandingIssueModalProps> = ({
  openIssueModal,
  setOpenIssueModal,
}) => {
  const dispatch = useDispatch();
  const [sort, setSort] = useState<string>('');
  const {
    companyOutstandingIssues,
    dataOpenNonConformityByVessel,
    dataOpenFindingObservationByVessel,
  } = useSelector((state) => state.dashboard);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const [isDetailModal, setIsDetailModal] = useState<boolean>(false);
  const [dataDetailModal, setDataDetailModal] = useState<DataDetailModal>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const handleToggleModal = useCallback(() => {
    setSort('');
    setOpenIssueModal(ModalDashboardType.HIDDEN);
  }, [setOpenIssueModal]);

  const dataOpenNonConformityByVesselList = useMemo(
    () =>
      dataOpenNonConformityByVessel?.map((item) => ({
        ...item,
        isSignificant: item?.isSignificant ? 'Yes' : 'No',
      })) || [],
    [dataOpenNonConformityByVessel],
  );

  const dataOpenFindingObservationByVesselList = useMemo(
    () =>
      dataOpenFindingObservationByVessel?.map((item) => ({
        ...item,
        isSignificant: item?.isSignificant ? 'Yes' : 'No',
      })) || [],
    [dataOpenFindingObservationByVessel],
  );

  const handleGetDataModalDetail = useCallback(
    (modal: ModalDashboardType, id: string, data: DataDetailModal) => {
      switch (modal) {
        case ModalDashboardType.NON_CONFORMITY: {
          dispatch(
            getCompanyOpenNonConformityByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }
        case ModalDashboardType.OBSERVATIONS: {
          dispatch(
            getCompanyOpenFindingObservationByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }

        default:
          break;
      }
      setDataDetailModal(data);
    },
    [dispatch, setIsDetailModal, setDataDetailModal],
  );
  const checkWorkflow = useCallback(
    (modalType, item, labelTotal): Action[] => {
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () =>
            handleGetDataModalDetail(
              modalType,
              item?.vesselId || item?.auditCompanyId,
              {
                vesselCode: item?.vesselCode,
                vesselName: item?.vesselName,
                auditCompanyName: item?.auditCompanyName || '',
                labelTotal,
              },
            ),
          feature: Features.MASTER_DASHBOARD,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
      ];
      return actions;
    },
    [handleGetDataModalDetail],
  );

  const columnsDef = useCallback(
    (colType?: string) => {
      switch (colType) {
        case 'columnNonConformityDetail':
          return [
            {
              field: 'refId',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection report Ref.ID'],
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
                  {data?.refId}
                </div>
              ),
            },
            {
              field: 'refNo',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Findings Ref.No'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'auditType',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection type'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'findings',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS.Findings,
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'isSignificant',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Is significant'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS.Action,
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
                  ModalDashboardType.NON_CONFORMITY,
                  data,
                  renderDynamicLabel(
                    dynamicLabels,
                    MAIN_DASHBOARD_DYNAMIC_FIELDS[
                      'Total non-conformity findings'
                    ],
                  ),
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
              cellRendererFramework: ({ data }) => (
                <div
                  className="cell-high-light"
                  onClick={() =>
                    handleGetDataModalDetail(
                      ModalDashboardType.NON_CONFORMITY,
                      data?.vesselId || data?.auditCompanyId,
                      {
                        vesselCode: data?.vesselCode,
                        vesselName: data?.vesselName,
                        auditCompanyName: data?.auditCompanyName || '',
                        labelTotal: renderDynamicLabel(
                          dynamicLabels,
                          MAIN_DASHBOARD_DYNAMIC_FIELDS[
                            'Total non-conformity findings'
                          ],
                        ),
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Company name'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'entity',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS.Entity,
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS[
                  'Total open non-conformity findings'
                ],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
          ];
        case 'columnObservations':
          return [
            {
              field: 'action',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS.Action,
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
                  ModalDashboardType.OBSERVATIONS,
                  data,
                  renderDynamicLabel(
                    dynamicLabels,
                    MAIN_DASHBOARD_DYNAMIC_FIELDS[
                      'Total open observation findings'
                    ],
                  ),
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
              cellRendererFramework: ({ data }) => (
                <div
                  className="cell-high-light"
                  onClick={() =>
                    handleGetDataModalDetail(
                      ModalDashboardType.OBSERVATIONS,
                      data?.vesselId || data?.auditCompanyId,
                      {
                        vesselCode: data?.vesselCode,
                        vesselName: data?.vesselName,
                        auditCompanyName: data?.auditCompanyName || '',
                        labelTotal: renderDynamicLabel(
                          dynamicLabels,
                          MAIN_DASHBOARD_DYNAMIC_FIELDS[
                            'Total open observation findings'
                          ],
                        ),
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Company name'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'entity',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS.Entity,
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS[
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection report Ref.ID'],
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
                  {data?.refId}
                </div>
              ),
            },
            {
              field: 'refNo',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Findings Ref.No'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'auditType',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection type'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'findings',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS.Findings,
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'isSignificant',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Is significant'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection time table Ref.ID'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
              cellRendererFramework: ({ data }) => (
                <div
                  className="cell-high-light"
                  onClick={() =>
                    openNewPage(
                      AppRouteConst.getAuditTimeTableById(
                        data?.auditTimeTableId,
                      ),
                    )
                  }
                >
                  {data?.refNo}
                </div>
              ),
            },
            {
              field: 'auditRefId',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Plan Ref.ID'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection time table S.No'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'vesselName',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'leadAuditor',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Lead auditor'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'plannedFromDate',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Planned audit from date'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Report of findings Ref.ID'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Plan Ref.ID'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Report of findings S.No'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'vesselName',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'leadAuditor',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Lead inspector'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'plannedFromDate',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Actual inspection from date'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection report Ref.ID'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
              cellRendererFramework: ({ data }) => (
                <div
                  className="cell-high-light"
                  onClick={() =>
                    openNewPage(
                      AppRouteConst.getInternalAuditReportById(data?.id),
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Plan Ref.ID'],
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
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection report s.no'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'vesselName',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'leadAuditor',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Lead inspector'],
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
            },
            {
              field: 'status',
              headerName: renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS.Status,
              ),
              filter: isMultiColumnFilter
                ? 'agMultiColumnFilter'
                : 'agTextColumnFilter',
              cellRenderer: 'cellRenderStatus',
            },
          ];
        default:
          return [];
      }
    },
    [
      checkWorkflow,
      dynamicLabels,
      handleGetDataModalDetail,
      isMultiColumnFilter,
    ],
  );

  const renderOutStandingIssueModalTable = useCallback(() => {
    let title = '';
    let columns = [];
    let data = [];
    let newData = [];
    let moduleTemplate = '';
    let fileName = '';
    let aggridId = '';
    let w = '';
    let hasVesselName;

    let dataDefault = [];
    const sortName = sort?.split(':')[0] || '';
    const sortType = sort?.split(':')[1] || '';
    const isSortFieldNumber = ['upComingPr', 'total', 'upComingIAR'].includes(
      sortName,
    );

    const isSortFieldDate = ['plannedFromDate'].includes(sortName);

    if (openIssueModal === ModalDashboardType.HIDDEN) {
      return null;
    }

    switch (openIssueModal) {
      case ModalDashboardType.NON_CONFORMITY:
        newData =
          companyOutstandingIssues?.outstandingIssuesNonConformity?.map(
            (item) => ({
              ...item,
              action: (
                <div className="d-flex align-items-center">
                  {renderButtonView(
                    () =>
                      handleGetDataModalDetail(
                        openIssueModal,
                        item?.vesselId || item?.auditCompanyId,
                        {
                          vesselCode: item?.vesselCode,
                          vesselName: item?.vesselName,
                          auditCompanyName: item?.auditCompanyName || '',
                          labelTotal: renderDynamicLabel(
                            dynamicLabels,
                            MAIN_DASHBOARD_DYNAMIC_FIELDS[
                              'Total non-conformity findings'
                            ],
                          ),
                        },
                      ),
                    false,
                  )}
                </div>
              ),
            }),
          ) || [];
        title = isDetailModal
          ? renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS['Open non-conformity details'],
            )
          : renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS['Open non-conformity'],
            );
        columns = isDetailModal
          ? columnsDef('columnNonConformityDetail')
          : columnsDef('columnNonConformity');
        fileName = MODULE_TEMPLATE.openNonConformity;
        aggridId = 'ag-grid-table-4';
        moduleTemplate = MODULE_TEMPLATE.openNonConformity;
        data = isDetailModal
          ? [...dataOpenNonConformityByVesselList]
          : [...newData];
        dataDefault = isDetailModal
          ? [...dataOpenNonConformityByVesselList]
          : newData || [];
        hasVesselName = true;

        break;
      case ModalDashboardType.OBSERVATIONS:
        newData =
          companyOutstandingIssues?.outstandingIssuesObservation?.map(
            (item) => ({
              ...item,
              action: (
                <div className="d-flex align-items-center">
                  {renderButtonView(
                    () =>
                      handleGetDataModalDetail(
                        openIssueModal,
                        item?.vesselId || item?.auditCompanyId,
                        {
                          vesselCode: item?.vesselCode,
                          vesselName: item?.vesselName,
                          auditCompanyName: item?.auditCompanyName || '',
                          labelTotal: renderDynamicLabel(
                            dynamicLabels,
                            MAIN_DASHBOARD_DYNAMIC_FIELDS[
                              'Total open observations'
                            ],
                          ),
                        },
                      ),
                    false,
                  )}
                </div>
              ),
            }),
          ) || [];
        columns = isDetailModal
          ? columnsDef('columnObservationsDetail')
          : columnsDef('columnObservations');
        title = isDetailModal
          ? renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS['Open observations details'],
            )
          : renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS['Open observations'],
            );
        w = '1200px';
        fileName = MODULE_TEMPLATE.openObservations;
        aggridId = 'ag-grid-table-5';
        moduleTemplate = MODULE_TEMPLATE.openObservations;
        data = isDetailModal
          ? [...dataOpenFindingObservationByVesselList]
          : [...newData];
        dataDefault = isDetailModal
          ? [...dataOpenFindingObservationByVesselList]
          : newData || [];
        hasVesselName = true;
        break;
      case ModalDashboardType.NUMBER_AUDIT_TIME_TABLE:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Inspection time tables not closed out'
          ],
        );
        columns = columnsDef('columnAuditTimeTable');
        fileName = MODULE_TEMPLATE.inspectionTimeTablesNotClosedOut;
        aggridId = 'ag-grid-table-1';
        w = '800px';
        moduleTemplate = MODULE_TEMPLATE.inspectionTimeTablesNotClosedOut;
        data = companyOutstandingIssues?.outstandingIssuesTimeTable?.map(
          (item: OutstandingIssuesTimeTable) => ({
            ...item,
            plannedFromDate: formatDateTime(item?.plannedFromDate),
          }),
        );
        dataDefault =
          companyOutstandingIssues?.outstandingIssuesTimeTable?.map(
            (item: OutstandingIssuesTimeTable) => ({
              ...item,
              plannedFromDate: formatDateTime(item?.plannedFromDate),
            }),
          ) || [];
        break;
      case ModalDashboardType.NUMBER_REPORT_OF_FINDING:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Report of findings not closed out'],
        );
        columns = columnsDef('columnReportOfFinding');
        fileName = MODULE_TEMPLATE.reportOfFindingsNotClosedOut;
        aggridId = 'ag-grid-table-2';
        w = '1200px';
        moduleTemplate = MODULE_TEMPLATE.reportOfFindingsNotClosedOut;
        data = companyOutstandingIssues?.outstandingIssuesFindingForm?.map(
          (item: OutstandingFindingIssues) => ({
            ...item,
            auditRefID: item?.['auditRef.ID'],
            plannedFromDate: formatDateTime(item?.plannedFromDate),
          }),
        );
        dataDefault =
          companyOutstandingIssues?.outstandingIssuesFindingForm?.map(
            (item: OutstandingFindingIssues) => ({
              ...item,
              auditRefID: item?.['auditRef.ID'],
              plannedFromDate: formatDateTime(item?.plannedFromDate),
            }),
          ) || [];
        break;
      case ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection reports not closed out'],
        );
        columns = columnsDef('columnInternalAuditReport');
        fileName = MODULE_TEMPLATE.inspectionReportsNotClosedOut;
        aggridId = 'ag-grid-table-3';
        w = '1200px';
        moduleTemplate = MODULE_TEMPLATE.inspectionReportsNotClosedOut;
        data = [...companyOutstandingIssues?.outstandingIssuesIar].map(
          (issue) => {
            if (issue?.status.toLowerCase().includes('reviewed')) {
              return {
                ...issue,
                status: 'Reviewed',
                auditRefID: issue?.['auditRef.ID'],
              };
            }
            return {
              ...issue,
              auditRefID: issue?.['auditRef.ID'],
            };
          },
        );
        dataDefault =
          [...companyOutstandingIssues?.outstandingIssuesIar].map((issue) => {
            if (issue?.status.toLowerCase().includes('reviewed')) {
              return {
                ...issue,
                status: 'Reviewed',
                auditRefID: issue?.['auditRef.ID'],
              };
            }
            return {
              ...issue,
              auditRefID: issue?.['auditRef.ID'],
            };
          }) || [];
        break;
      default:
        break;
    }

    if (sort) {
      data.sort((current, next) => {
        const currentValue = isSortFieldNumber
          ? Number(current[sortName])
          : current[sortName];

        const nextValue = isSortFieldNumber
          ? Number(next[sortName])
          : next[sortName];

        if (sortType === '1') {
          if (isSortFieldDate) {
            return new Date(currentValue) > new Date(nextValue) ? 1 : -1;
          }
          return currentValue > nextValue ? 1 : -1;
        }
        if (sortType === '-1') {
          if (isSortFieldDate) {
            return new Date(currentValue) < new Date(nextValue) ? 1 : -1;
          }
          return currentValue < nextValue ? 1 : -1;
        }
        return 1;
      });
    } else {
      data = [...dataDefault];
    }

    return (
      <OutStandingIssueModal
        data={[...data]}
        columns={columns}
        title={title}
        handleToggleModal={handleToggleModal}
        sort={sort}
        handleSort={(value: string) => {
          setSort(value);
        }}
        moduleTemplate={moduleTemplate}
        fileName={fileName}
        aggridId={aggridId}
        w={w}
        modalType={openIssueModal}
        isDetail={isDetailModal}
        setIsDetailModal={setIsDetailModal}
        dataDetailModal={dataDetailModal}
        setDataDetailModal={setDataDetailModal}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasVesselName={hasVesselName}
      />
    );
  }, [
    sort,
    openIssueModal,
    handleToggleModal,
    isDetailModal,
    dataDetailModal,
    companyOutstandingIssues?.outstandingIssuesNonConformity,
    companyOutstandingIssues?.outstandingIssuesObservation,
    companyOutstandingIssues?.outstandingIssuesTimeTable,
    companyOutstandingIssues?.outstandingIssuesFindingForm,
    companyOutstandingIssues?.outstandingIssuesIar,
    dynamicLabels,
    columnsDef,
    dataOpenNonConformityByVesselList,
    dataOpenFindingObservationByVesselList,
    handleGetDataModalDetail,
  ]);

  return <>{renderOutStandingIssueModalTable()}</>;
};

export default OutStandingIssueModalContainer;
