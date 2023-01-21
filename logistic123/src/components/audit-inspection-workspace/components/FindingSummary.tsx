import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { ColumnsType } from 'antd/lib/table';
import images from 'assets/images/images';
import cx from 'classnames';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonType } from 'components/ui/button/Button';
import { AuditWorkspaceStatus } from 'constants/common.const';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  TYPE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import { openNewPage } from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import {
  AuditInspectionWorkspaceDetailResponse,
  AuditInspectionWorkspaceSummaryResponse,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Action } from 'models/common.model';
import { FC, useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getAuditWorkspaceSummaryActions,
  submitAuditWorkspaceActions,
  updateAuditWorkspaceFindingSummaryActions,
} from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import {
  createTemplateActions,
  deleteTemplateActions,
  getListTemplateActions,
  getTemplateDetailActions,
  updateTemplateActions,
} from 'store/template/template.action';
import { PDFWrapper } from './Checklist';
import ModalFinding from './modal/ModalFinding';
import ModalOnboard from './modal/ModalOnboard';
import styles from './tab.module.scss';
import './tab.scss';

interface FindingSummaryProps {
  summaryData: AuditInspectionWorkspaceSummaryResponse[];
  data: AuditInspectionWorkspaceDetailResponse;
  disabled?: boolean;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

enum ModalType {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  HIDDEN = 'HIDDEN',
  ONBOARD = 'ONBOARD',
}

const FindingSummary: FC<FindingSummaryProps> = ({
  summaryData,
  data,
  loading,
  disabled,
  dynamicLabels,
}) => {
  const { listTemplate2, templateDetail2 } = useSelector(
    (state) => state.template,
  );

  const dispatch = useDispatch();

  const [modal, setModal] = useState<ModalType>(ModalType.HIDDEN);
  const [dataModal, setDataModal] =
    useState<AuditInspectionWorkspaceSummaryResponse>();

  const [pageSize, setPageSize] = useState<number>(20);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);

  const [gridApi, setGridApi] = useState<GridApi>(null);

  const el = document.getElementById('ag-grid-table');
  const el2 = document.getElementById('ag-grid-table-theme');

  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [titleModal, setTitleModal] = useState('');
  const [openTemplate, setOpenTemplate] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [templateID, setTemplateID] = useState(null);

  const onFullScreenChange = (event) => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
      el2.style.height = 'calc(100% - 36px)';
    } else {
      setIsFullScreen(false);
      el2.style.height = '100%';
    }
  };

  useEffectOnce(() => {
    dispatch(
      getListTemplateActions.request({
        content: MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate,
      }),
    );
  });

  useEffect(() => {
    if (templateDetail2 && listTemplate2?.data?.length > 0) {
      setTemplateID(templateDetail2.id);
      const template = JSON.parse(templateDetail2.template);
      if (template) {
        gridApi?.setFilterModel(template.filterModel);
        gridColumnApi?.applyColumnState({
          state: template.columns,
          applyOrder: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateDetail2]);

  const handleGetTemplate = (templateId: string) => {
    dispatch(
      getTemplateDetailActions.request({
        templateId,
        content: MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate,
      }),
    );
  };

  const handleDeleteTemplate = (templateId: string) => {
    dispatch(
      deleteTemplateActions.request({
        ids: [templateId],
        getList: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate,
            }),
          );
        },
      }),
    );
  };

  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'].Action,
      ),
      key: 'action',
      width: 90,
      fixed: 'left',
      dataIndex: 'id',
      render: (text) => (
        <div className={cx(styles.actionContent)}>
          <div
            className={cx(styles.imageWrapper, styles.view)}
            onClick={() => {
              setModal(ModalType.VIEW);
              const dataModal: AuditInspectionWorkspaceSummaryResponse =
                summaryData.find((i) => i.id === text);
              setDataModal(dataModal);
            }}
          >
            <img src={images.icons.icViewDetail} alt="view" />
          </div>
          {!disabled && data?.status !== AuditWorkspaceStatus.FINAL && (
            <div
              className={cx(styles.imageWrapper, styles.edit)}
              onClick={() => {
                setModal(ModalType.EDIT);
                const dataModal: AuditInspectionWorkspaceSummaryResponse =
                  summaryData.find((i) => i.id === text);
                setDataModal(dataModal);
              }}
            >
              <img src={images.icons.icEdit} alt="edit" />
            </div>
          )}
        </div>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'App instance ID'
        ],
      ),
      key: 'appInstance',

      dataIndex: 'appInstance',
      width: 240,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Web instance ID'
        ],
      ),
      key: 'webInstance',
      dataIndex: 'webInstance',
      width: 240,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Template code'
        ],
      ),
      key: 'templateCode',
      dataIndex: 'templateCode',
      width: 240,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Question name'
        ],
      ),
      key: 'questionName',
      dataIndex: 'questionName',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'].Reference,
      ),
      key: 'reference',
      dataIndex: 'reference',
      width: 240,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Inspection type'
        ],
      ),
      key: 'auditType',
      dataIndex: 'auditType',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Finding type'
        ],
      ),
      dataIndex: 'findingType',
      key: 'findingType',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Is significant'
        ],
      ),
      dataIndex: 'isSignificant',
      key: 'isSignificant',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Main category'
        ],
      ),
      dataIndex: 'mainCategory',
      key: 'mainCategory',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Second category'
        ],
      ),
      dataIndex: 'sub1stCategory',
      key: 'sub1stCategory',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Third category'
        ],
      ),
      dataIndex: 'sub2ndCategory',
      key: 'sub2ndCategory',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'].Finding,
      ),
      dataIndex: 'finding',
      key: 'finding',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Rectification/ verified'
        ],
      ),
      dataIndex: 'rectificationVerified',
      key: 'rectificationVerified',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Question ID'
        ],
      ),
      key: 'questionId',
      dataIndex: 'questionId',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
  ];

  const extensionOptions: ExtensionOption[] = [
    {
      label: TEXT_ACTION_TEMPLATE.saveTemplate,
      icon: images.icons.agGrid.icAGSave,
      onClick: () => {
        if (listTemplate2?.data?.length > 0) {
          dispatch(
            updateTemplateActions.request({
              id: templateDetail2.id,
              module: MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate,
              type: templateDetail2.type,
              name: templateDetail2.name,
              defaultTemplate: JSON.stringify({
                columns: gridColumnApi?.getColumnState(),
                filterModel: currentFilterModel,
              }),
              template: JSON.stringify({
                columns: gridColumnApi?.getColumnState(),
                filterModel: currentFilterModel,
              }),
            }),
          );
        } else {
          setTitleModal(TEXT_ACTION_TEMPLATE.saveTemplate);
          setOpenTemplate((p) => !p);
        }
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.saveAsTemplate,
      icon: images.icons.agGrid.icAGSaveAs,
      onClick: () => {
        setTitleModal(TEXT_ACTION_TEMPLATE.saveAsTemplate);
        setOpenTemplate((p) => !p);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.deleteTemplate,
      icon: images.icons.agGrid.icAGDelete,
      onClick: () => setModalOpen(true),
    },
    {
      label: TEXT_ACTION_TEMPLATE.globalTemplate,
      icon: images.icons.agGrid.icAGGlobal,
      onClick: () => {
        setTitleModal(TEXT_ACTION_TEMPLATE.globalTemplate);
        setOpenTemplate((p) => !p);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.distinctFilter,
      icon: images.icons.agGrid.icAGDistinctFilter,
      onClick: () => {
        const columnDefs = gridApi.getColumnDefs();
        columnDefs.forEach((colDef: ColDef, index) => {
          // eslint-disable-next-line no-param-reassign
          colDef.floatingFilter = false;
        });
        gridApi.setColumnDefs(columnDefs);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.conditionFilter,
      icon: images.icons.agGrid.icAGConditionalFilter,
      onClick: () => {
        const columnDefs = gridApi.getColumnDefs();
        columnDefs.forEach((colDef: ColDef, index) => {
          // eslint-disable-next-line no-param-reassign
          colDef.floatingFilter = true;
        });
        gridApi.setColumnDefs(columnDefs);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.multipleFilter,
      icon: images.icons.agGrid.icAGMultipleFilter,
      onClick: () => {
        setIsMultiColumnFilter(true);
        setColDef({ ...colDef });
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.reset,
      icon: images.icons.agGrid.icAGReset,
      onClick: () => {
        gridColumnApi?.resetColumnState();
        setColDef(DEFAULT_COL_DEF);
        gridApi?.setFilterModel(null);
        setIsMultiColumnFilter(false);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.excel,
      icon: images.icons.agGrid.icAGExcel,
      onClick: () =>
        gridApi?.exportDataAsExcel({
          fileName: 'Finding summary.xlsx',
        }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({
          fileName: 'Finding summary.csv',
        }),
    },
    !isFullScreen && {
      label: TEXT_ACTION_TEMPLATE.fullScreen,
      icon: images.icons.agGrid.icAGFullScreen,
      onClick: () => {
        el.requestFullscreen();

        el.addEventListener('fullscreenchange', onFullScreenChange);
      },
    },
  ];

  const dataTable: Object[] = useMemo(
    () =>
      summaryData?.map((item, index) => ({
        key: `id${index + 1}`,
        id: item?.id,
        appInstance: item?.fillQuestion?.fillAuditChecklist?.appInstance,
        webInstance: item?.fillQuestion?.fillAuditChecklist?.webInstance,
        templateCode: item?.auditChecklist?.code,
        questionName: item?.chkQuestion?.question,
        reference: item?.reference,
        auditType: item?.auditType?.name,
        findingType: item?.natureFinding?.name,
        isSignificant: item?.isSignificant ? 'Yes' : 'No',
        mainCategory: item?.mainCategory?.name,
        sub1stCategory: item?.secondCategory?.name,
        sub2ndCategory: item?.thirdCategory?.name,
        finding: item?.findingComment,
        rectificationVerified: item?.isVerify ? 'Yes' : 'No',
        questionId: item?.chkQuestion?.code,
      })),
    [summaryData],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'].Action,
        ),
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                if (data) {
                  setModal(ModalType.VIEW);
                  const dataModal: AuditInspectionWorkspaceSummaryResponse =
                    summaryData.find((i) => i.id === data?.id);
                  setDataModal(dataModal);
                }
              },
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
          ];

          if (!disabled && data?.status !== AuditWorkspaceStatus.FINAL) {
            actions.push({
              img: images.icons.icEdit,
              function: () => {
                if (data) {
                  setModal(ModalType.EDIT);
                  const dataModal: AuditInspectionWorkspaceSummaryResponse =
                    summaryData.find((i) => i.id === data?.id);
                  setDataModal(dataModal);
                }
              },
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
              action: ActionTypeEnum.UPDATE,
            });
          }

          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'appInstance',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'App instance ID'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'webInstance',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Web instance ID'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'templateCode',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Template code'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'questionName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Question name'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'reference',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary']
            .Reference,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Inspection type'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'findingType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Finding type'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'isSignificant',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Is significant'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'mainCategory',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Main category'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'sub1stCategory',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Second category'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'sub2ndCategory',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Third category'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'finding',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'].Finding,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'rectificationVerified',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Rectification/ verified'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'questionId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
            'Question ID'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, disabled, summaryData],
  );

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleEditFinding = (dataForm) => {
    dispatch(
      updateAuditWorkspaceFindingSummaryActions.request({
        workspaceId: data.id,
        findingItemId: dataForm.id,
        data: dataForm,
        afterSubmit: () => {
          dispatch(
            getAuditWorkspaceSummaryActions.request({
              id: data.id,
              afterGetDetail: () => {},
            }),
          );
        },
      }),
    );
  };

  const getTypeTemplate = (type: string, templateDetail2Type: string) => {
    if (type === TEXT_ACTION_TEMPLATE.globalTemplate)
      return TYPE_TEMPLATE.global;
    if (type === TEXT_ACTION_TEMPLATE.saveAsTemplate)
      return TYPE_TEMPLATE.template;
    return templateDetail2Type || TYPE_TEMPLATE.template;
  };

  const handleSaveTemplate = (templateName: string) => {
    dispatch(
      createTemplateActions.request({
        module: MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate,
        type: getTypeTemplate(titleModal, templateDetail2?.type),
        name: templateName,
        defaultTemplate: JSON.stringify({
          columns: gridColumnApi?.getColumnState(),
          filterModel: currentFilterModel,
        }),
        template: JSON.stringify({
          columns: gridColumnApi?.getColumnState(),
          filterModel: currentFilterModel,
        }),
      }),
    );

    setOpenTemplate((p) => !p);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <img
          src={images.common.loading}
          className={cx(styles.loading)}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <div className={cx(styles.TabContainer)}>
      <div className="d-flex justify-content-end mb-3">
        {data?.attachments?.length > 0 && (
          <PDFWrapper attachments={data?.attachments} />
        )}
      </div>
      <div className={cx(styles.contentWrapperSummary)}>
        <div className={cx(styles.headerTitle)}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
              'Finding summary'
            ],
          )}
        </div>
        <div className={styles.table}>
          {dataTable?.length ? (
            <AGGridTable
              loading={loading}
              isFullScreen={isFullScreen}
              extensionOptions={extensionOptions}
              onGridReady={onGridReady}
              height="calc(100vh - 388px)"
              rowData={dataTable}
              columnDefs={columnDefs}
              defaultColDef={colDef}
              templates={listTemplate2?.data || []}
              pageSize={pageSize}
              setPageSize={(newPageSize: number) => {
                setPageSize(newPageSize);
                gridApi.paginationGoToPage(0);
              }}
              totalItem={dataTable?.length}
              onFilterChanged={(event: FilterChangedEvent) => {
                const filterModel = event.api.getFilterModel();
                setCurrentFilterModel(filterModel);
              }}
              templateID={templateID}
              handleSetTemplateID={handleGetTemplate}
              handleDeleteTemplate={handleDeleteTemplate}
              rowSelection="single"
              renderModalInside={
                <>
                  <ModalList
                    data={listTemplate2?.data || []}
                    isOpen={modalOpen}
                    toggle={setModalOpen}
                    templateModule={
                      MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate
                    }
                  />
                  <TemplateModal
                    title={titleModal}
                    isOpen={openTemplate}
                    loading={loading}
                    toggle={() => setOpenTemplate((p) => !p)}
                    handleSave={handleSaveTemplate}
                    templates={listTemplate2?.data || []}
                  />
                </>
              }
            />
          ) : (
            <div className={cx(styles.noDataWrapper)}>
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
        </div>
        <ModalFinding
          isOpen={ModalType.VIEW === modal || ModalType.EDIT === modal}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
              'Finding detail'
            ],
          )}
          data={dataModal}
          disabled={ModalType.VIEW === modal}
          toggle={() => {
            setModal(ModalType.HIDDEN);
          }}
          onSubmit={handleEditFinding}
          dynamicLabels={dynamicLabels}
        />
      </div>
      <div
        className={cx(
          styles.footerWrapper,
          'd-flex align-item-center justify-content',
        )}
      >
        <div>
          {data?.status === AuditWorkspaceStatus.FINAL &&
            data?.planningRequest?.reportFindingForm?.sNo && (
              <div className={cx(styles.textInformation)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                    'Rof.ID'
                  ],
                )}
                :
                <span
                  className={cx(styles.linkName)}
                  onClick={() =>
                    openNewPage(
                      AppRouteConst.getReportOfFindingById(
                        data?.planningRequest?.reportFindingForm?.id,
                      ),
                    )
                  }
                >
                  {` ${data?.planningRequest?.reportFindingForm?.sNo}`}
                </span>
              </div>
            )}
          {data?.planningRequest?.reportFindingForm?.internalAuditReport
            ?.serialNumber && (
            <div className={cx(styles.textInformation)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                  'Ir.ID'
                ],
              )}
              :
              <span
                className={cx(styles.linkName)}
                onClick={() =>
                  openNewPage(
                    AppRouteConst.getInternalAuditReportById(
                      data?.planningRequest?.reportFindingForm
                        ?.internalAuditReport?.id,
                    ),
                  )
                }
              >
                {` ${data?.planningRequest?.reportFindingForm?.internalAuditReport?.serialNumber}`}
              </span>
            </div>
          )}
        </div>
        <div className={cx('ms-auto', styles.buttonWrapper)}>
          <Button
            className={styles.btn}
            onClick={() => {
              setModal(ModalType.ONBOARD);
            }}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                'Onboard finding summary'
              ],
            )}
          </Button>
          {!disabled && (
            <Button
              className={styles.btn}
              onClick={() => {
                dispatch(
                  submitAuditWorkspaceActions.request({
                    id: data.id,
                    data: {
                      planningRequestId: data.planningRequestId,
                      timezone: 'Asia/Ho_Chi_Minh',
                    },
                    afterSubmit: () => {
                      history.push(AppRouteConst.AUDIT_INSPECTION_WORKSPACE);
                    },
                  }),
                );
              }}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                  'Submit to final'
                ],
              )}
            </Button>
          )}
          <ModalOnboard
            isOpen={ModalType.ONBOARD === modal}
            title={renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                'Onboard finding summary'
              ],
            )}
            dataSource={dataTable}
            columns={columns}
            dynamicLabels={dynamicLabels}
            toggle={() => {
              setModal(ModalType.HIDDEN);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FindingSummary;
