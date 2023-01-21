import { useCallback, useMemo, useState, memo, FC, useEffect } from 'react';
import OpenTaskCard from 'components/dashboard/components/card/OpenTaskCard';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { dateStringComparator, openNewPage } from 'helpers/utils.helper';
import { AppRouteConst } from 'constants/route.const';
import {
  getAuditChecklistOpenTaskActions,
  getFindingFormOpenTaskActions,
  getInspectionReportOpenTaskActions,
  getPlanningOpenTaskActions,
} from 'store/dashboard/dashboard.action';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { RoleScope } from 'constants/roleAndPermission.const';
import { Col, Row } from 'reactstrap';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import styles from './open-task.module.scss';

enum OpenTaskModalType {
  HIDDEN = 'hidden',
  CHECKLIST_TEMPLATE = 'CLT',
  REPORT_OF_FINDINGS = 'ROF',
  INSPECTION_REPORTS = 'IR',
  PlANNING = 'P',
}

interface OpenTaskProps {
  entity: string;
  dynamicLabels?: IDynamicLabel;
}

const OpenTask: FC<OpenTaskProps> = ({ entity, dynamicLabels }) => {
  const dispatch = useDispatch();
  const { auditChecklist, findingForm, inspectionReport, openTaskPlanning } =
    useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [modal, setModal] = useState<OpenTaskModalType>(
    OpenTaskModalType.HIDDEN,
  );
  const [openModal, setOpenModal] = useState(false);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const handleGetList = useCallback(() => {
    let content = '';
    switch (modal) {
      case OpenTaskModalType.CHECKLIST_TEMPLATE:
        content = MODULE_TEMPLATE.openTaskInspectionChecklistTemplate;
        break;
      case OpenTaskModalType.REPORT_OF_FINDINGS:
        content = MODULE_TEMPLATE.openTaskReportOfFindingsTemplate;
        break;
      case OpenTaskModalType.INSPECTION_REPORTS:
        content = MODULE_TEMPLATE.openTaskInspectionReportsTemplate;
        break;
      case OpenTaskModalType.PlANNING:
        content = MODULE_TEMPLATE.openTaskPlanningModal;
        break;
      default:
        return;
    }
    dispatch(
      getListTemplateDictionaryActions.request({
        content,
      }),
    );
  }, [dispatch, modal]);

  const totalData = useMemo(
    () => [
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection checklist templates'],
        ),
        color: '#66A3FF',
        data: [
          {
            value: auditChecklist?.totalAuditChecklistSubmitted || 0,
            status: 'Submitted',
          },
          {
            value: auditChecklist?.totalAuditChecklistReviewed || 0,
            status: 'Reviewed',
          },
          {
            value: auditChecklist?.totalAuditChecklistApproved || 0,
            status: 'Approved',
          },
        ],
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Planning,
        ),
        color: '#41E081',
        data: [
          {
            value: openTaskPlanning?.planningSubmitted || 0,
            status: 'Submitted',
          },
          {
            value: openTaskPlanning?.planningApproved || 0,
            status: 'Approved',
          },
          {
            value: openTaskPlanning?.planningAccepted || 0,
            status: 'Accepted',
          },
          {
            value: openTaskPlanning?.planningPlanned || 0,
            status: 'Planned',
          },
        ],
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of findings'],
        ),
        color: '#6FEEFF',
        data: [
          {
            value: findingForm?.totalFindingSubmitted || 0,
            status: 'Submitted',
          },
          {
            value: findingForm?.totalFindingReviewed || 0,
            status: 'Reviewed',
          },
        ],
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection reports'],
        ),
        color: '#AD45FF',
        data: [
          {
            value: inspectionReport?.totalFindingSubmitted || 0,
            status: 'Submitted',
          },
          {
            value: inspectionReport?.totalFindingReviewed || 0,
            status: 'Reviewed',
          },
          {
            value: inspectionReport?.totalAuditChecklistApproved || 0,
            status: 'Approved',
          },
        ],
      },
    ],
    [
      dynamicLabels,
      auditChecklist?.totalAuditChecklistSubmitted,
      auditChecklist?.totalAuditChecklistReviewed,
      auditChecklist?.totalAuditChecklistApproved,
      openTaskPlanning?.planningSubmitted,
      openTaskPlanning?.planningApproved,
      openTaskPlanning?.planningAccepted,
      openTaskPlanning?.planningPlanned,
      findingForm?.totalFindingSubmitted,
      findingForm?.totalFindingReviewed,
      inspectionReport?.totalFindingSubmitted,
      inspectionReport?.totalFindingReviewed,
      inspectionReport?.totalAuditChecklistApproved,
    ],
  );

  const openTaskModalByTitle = useCallback(
    (title: string) => {
      switch (title) {
        case renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection checklist templates'],
        ):
          setModal(OpenTaskModalType.CHECKLIST_TEMPLATE);
          break;
        case renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of findings'],
        ):
          setModal(OpenTaskModalType.REPORT_OF_FINDINGS);
          break;
        case renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection reports'],
        ):
          setModal(OpenTaskModalType.INSPECTION_REPORTS);
          break;
        case renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Planning,
        ):
          setModal(OpenTaskModalType.PlANNING);
          break;
        default:
          break;
      }
    },
    [dynamicLabels],
  );

  const handleClickOnHighLightText = useCallback(
    (data) => {
      switch (modal) {
        case OpenTaskModalType.CHECKLIST_TEMPLATE:
          return openNewPage(AppRouteConst.auditCheckListDetail(data?.id));
        case OpenTaskModalType.INSPECTION_REPORTS:
          return openNewPage(
            AppRouteConst.getInternalAuditReportById(data?.id),
          );
        case OpenTaskModalType.REPORT_OF_FINDINGS:
          return openNewPage(AppRouteConst.getReportOfFindingById(data?.id));
        case OpenTaskModalType.PlANNING:
          return openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id));
        default:
          return null;
      }
    },
    [modal],
  );

  const columnsDef = useCallback(
    (colType: OpenTaskModalType) => {
      if (colType === OpenTaskModalType.HIDDEN) {
        return [];
      }

      if (
        colType === OpenTaskModalType.REPORT_OF_FINDINGS ||
        colType === OpenTaskModalType.INSPECTION_REPORTS
      ) {
        return [
          {
            field: 'sNo',
            headerName: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['S.No'],
            ),
            filter: isMultiColumnFilter
              ? 'agMultiColumnFilter'
              : 'agTextColumnFilter',
          },
          {
            field: 'refID',
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
                onClick={() => handleClickOnHighLightText(data)}
              >
                {data?.refID || ''}
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
            field: 'leadInspector',
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
          entity !== 'Vessel' && {
            field: 'company',
            headerName: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Company,
            ),
            filter: isMultiColumnFilter
              ? 'agMultiColumnFilter'
              : 'agTextColumnFilter',
          },
        ];
      }

      if (colType === OpenTaskModalType.PlANNING) {
        return [
          {
            field: 'refID',
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
                onClick={() => handleClickOnHighLightText(data)}
              >
                {data?.refID || ''}
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
            field: 'company',
            headerName: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Company,
            ),
            filter: isMultiColumnFilter
              ? 'agMultiColumnFilter'
              : 'agTextColumnFilter',
          },
          {
            field: 'leadInspector',
            headerName: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead inspector'],
            ),
            filter: isMultiColumnFilter
              ? 'agMultiColumnFilter'
              : 'agTextColumnFilter',
          },
          {
            field: 'plannedDateFrom',
            headerName: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                'Planned inspection date from'
              ],
            ),
            filter: isMultiColumnFilter
              ? 'agMultiColumnFilter'
              : 'agTextColumnFilter',
            comparator: dateStringComparator,
          },
          {
            field: 'plannedDateTo',
            headerName: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Planned inspection date to'],
            ),
            filter: isMultiColumnFilter
              ? 'agMultiColumnFilter'
              : 'agTextColumnFilter',
            comparator: dateStringComparator,
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
      }

      return [
        {
          field: 'templateCode',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Template code'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() => handleClickOnHighLightText(data)}
            >
              {data?.templateCode || ''}
            </div>
          ),
        },
        {
          field: 'templateName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Template name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'revisionDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Revision date'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
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
        {
          field: 'company',
          headerName: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Company,
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
        },
      ];
    },
    [isMultiColumnFilter, dynamicLabels, entity, handleClickOnHighLightText],
  );

  const convertStatus = useCallback((status: string): string => {
    if (!status) {
      return '';
    }

    if (status.toLowerCase().includes('planned')) {
      return 'Planned';
    }
    if (status.toLowerCase().includes('accepted')) {
      return 'Accepted';
    }
    if (status.toLowerCase().includes('reviewed')) {
      return 'Reviewed';
    }
    return status;
  }, []);

  const renderModalTable = useMemo(() => {
    let title = '';
    let columns = [];
    let dataSource = [];
    let moduleTemplate = '';
    let fileName = '';

    if (modal === OpenTaskModalType.HIDDEN) {
      return null;
    }
    columns = columnsDef(modal);

    switch (modal) {
      case OpenTaskModalType.REPORT_OF_FINDINGS:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of findings'],
        );
        dataSource =
          findingForm?.auditFindingForms.map((form, index) => ({
            sNo: index + 1,
            refID: form?.refNo,
            vesselName: form?.vessel?.name || '',
            leadInspector: form?.leadInspector?.username || '',
            status: convertStatus(form?.status),
            id: form?.id,
            company: form?.auditCompany?.name || '',
          })) || [];
        moduleTemplate = MODULE_TEMPLATE.openTaskReportOfFindingsTemplate;
        fileName = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of findings'],
        );
        setOpenModal(true);

        break;
      case OpenTaskModalType.INSPECTION_REPORTS:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection reports'],
        );
        dataSource =
          inspectionReport?.inspectionReportForms.map((form, index) => ({
            sNo: index + 1,
            refID: form?.refId,
            vesselName: form?.vessel?.name || '',
            leadInspector: form?.leadInspector?.username || '',
            status: convertStatus(form?.status),
            id: form?.id,
            company: form?.auditCompany?.name || '',
          })) || [];
        moduleTemplate = MODULE_TEMPLATE.openTaskInspectionReportsTemplate;
        fileName = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection reports'],
        );
        setOpenModal(true);
        break;
      case OpenTaskModalType.CHECKLIST_TEMPLATE:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection checklist templates'],
        );
        dataSource =
          auditChecklist?.auditChecklists
            .map((item) => ({
              templateCode: item?.code,
              templateName: item?.name,
              revisionDate: formatDateLocalWithTime(item?.revisionDate),
              status: convertStatus(item?.status),
              id: item?.id,
              company: item?.company?.name || '',
              entity: item?.auditEntity || '',
            }))
            .sort(
              (currentValue, nextValue) =>
                moment(nextValue.revisionDate).valueOf() -
                moment(currentValue.revisionDate).valueOf(),
            ) || [];
        moduleTemplate = MODULE_TEMPLATE.openTaskInspectionChecklistTemplate;
        fileName = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection checklist templates'],
        );
        setOpenModal(true);
        break;

      case OpenTaskModalType.PlANNING:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Planning,
        );
        dataSource =
          openTaskPlanning?.planningRequests.map((item) => ({
            refID: item?.refId || '',
            vesselName: item?.vessel?.name || '',
            company: item?.auditCompany?.name || '',
            leadInspector: item?.leadInspector?.username || '',
            plannedDateFrom: formatDateLocalWithTime(item?.plannedFromDate),
            plannedDateTo: formatDateLocalWithTime(item?.plannedToDate),
            status: convertStatus(item.status),
            id: item?.id,
          })) || [];
        moduleTemplate = MODULE_TEMPLATE.openTaskPlanningModal;
        fileName = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Planning,
        );
        setOpenModal(true);
        break;
      default:
        break;
    }

    return (
      <Modal
        isOpen={openModal}
        title={title}
        bodyClassName={styles.bodyContent}
        titleClasseName={styles.titleBold}
        toggle={() => setModal(OpenTaskModalType.HIDDEN)}
        modalType={ModalType.LARGE}
        content={
          <AGGridModule
            dataFilter={null}
            dataTable={dataSource}
            loading={false}
            moduleTemplate={moduleTemplate}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            params={undefined}
            getList={handleGetList}
            hasRangePicker={false}
            columnDefs={columns}
            height="400px"
            onRowSelected={(e) => {
              handleClickOnHighLightText(e.data);
            }}
            hiddenTemplate={userInfo?.roleScope === RoleScope.SuperAdmin}
            extensions={
              userInfo?.roleScope === RoleScope.SuperAdmin
                ? {
                    saveTemplate: false,
                    saveAsTemplate: false,
                    deleteTemplate: false,
                    globalTemplate: false,
                  }
                : {}
            }
            fileName={fileName}
          />
        }
      />
    );
  }, [
    modal,
    columnsDef,
    openModal,
    handleGetList,
    userInfo?.roleScope,
    dynamicLabels,
    findingForm?.auditFindingForms,
    inspectionReport?.inspectionReportForms,
    auditChecklist?.auditChecklists,
    openTaskPlanning?.planningRequests,
    convertStatus,
    handleClickOnHighLightText,
  ]);

  const canUserViewMore = useCallback((data) => {
    if (data && Array.isArray(data)) {
      const sumAllField = data.reduce(
        (prevSum, currentData) => (currentData?.value || 0) + prevSum,
        0,
      );
      if (sumAllField === 0) {
        return false;
      }
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const entityType = entity !== 'All' ? entity : undefined;
    dispatch(getAuditChecklistOpenTaskActions.request({ entityType }));
    dispatch(getFindingFormOpenTaskActions.request({ entityType }));
    dispatch(getInspectionReportOpenTaskActions.request({ entityType }));
    dispatch(getPlanningOpenTaskActions.request({ entityType }));
  }, [dispatch, entity]);

  return (
    <>
      <h3 className={styles.title}>
        {renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Open tasks'],
        )}
      </h3>
      <Row className={styles.listOpenTaskContainer}>
        {totalData.map((data) => (
          <Col xs={12} xl={6} key={data.color}>
            <OpenTaskCard
              bodyData={data.data}
              colorTextBody={data.color}
              title={data.title}
              handleViewMore={() => openTaskModalByTitle(data.title)}
              canViewMore={canUserViewMore(data.data)}
              containerClassName={styles.openTaskCardContainer}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        ))}
      </Row>

      {renderModalTable}
    </>
  );
};

export default memo(OpenTask);
