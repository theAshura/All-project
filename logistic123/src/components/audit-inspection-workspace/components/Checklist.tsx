import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { triggerAuditWorkspaceChecklistActionsApi } from 'api/audit-inspection-workspace.api';
import images from 'assets/images/images';
import cx from 'classnames';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import Button from 'components/ui/button/Button';
import { FORMAT_DATE_TIME } from 'constants/common.const';
import {
  DATA_SPACE,
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  TYPE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { toastError } from 'helpers/notification.helper';
import {
  dateStringComparator,
  downloadPDF,
  viewPDF,
} from 'helpers/utils.helper';
import {
  AuditInspectionChecklistResponse,
  AuditInspectionWorkspaceDetailResponse,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAuditInspectionWorkspaceDetailActions,
  getAuditWorkspaceChecklistActions,
} from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import {
  createTemplateActions,
  deleteTemplateActions,
  getListTemplateActions,
  getTemplateDetailActions,
  updateTemplateActions,
} from 'store/template/template.action';
import ChecklistForm from './ChecklistForm';
import styles from './tab.module.scss';
import './tab.scss';

interface ChecklistInformationProps {
  checklists: AuditInspectionChecklistResponse[];
  data: AuditInspectionWorkspaceDetailResponse;
  disabled?: boolean;
  loading?: boolean;
  isAuditor: boolean;
  activeTab?: string;
  dynamicLabels?: IDynamicLabel;
}

interface PDFWrapperProps {
  attachments: string[];
}

export const PDFWrapper: FC<PDFWrapperProps> = ({ attachments }) => {
  const [isDropdown, setIsDropdown] = useState<boolean>(false);

  return (
    <div className={cx(styles.pdfWrapper, '')}>
      <Button
        className={cx(styles.btn, {
          [styles.dropdownClose]: !isDropdown,
          [styles.dropdownOpen]: isDropdown,
        })}
        onClick={() => setIsDropdown((prev) => !prev)}
      >
        PDF File
        {!isDropdown ? (
          <img
            src={images.icons.icDownBlue}
            className={cx(styles.icon, 'ps-1')}
            alt="icon"
          />
        ) : (
          <img
            src={images.icons.icDownWhite}
            className={cx(styles.icon, 'ps-1')}
            alt="icon"
          />
        )}
      </Button>
      {isDropdown && (
        <div className={cx(styles.dropdown, '')}>
          <div className={cx(styles.dropdownItem, '')}>
            <span
              className={cx(styles.optionPDF, 'd-flex align-items-center')}
              onClick={() => {
                downloadPDF(attachments);
                setIsDropdown(false);
              }}
            >
              <img
                src={images.icons.icDownloadGray}
                className="me-2"
                alt="download"
              />
              Download
            </span>
          </div>
          <div className={cx(styles.dropdownItem, ' px-')}>
            <span
              className={cx(styles.optionPDF, 'd-flex align-items-center')}
              onClick={() => {
                viewPDF(attachments);
                setIsDropdown(false);
              }}
            >
              <img src={images.icons.icViewGray} className="me-2" alt="view" />{' '}
              View
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ChecklistInformation: FC<ChecklistInformationProps> = ({
  data,
  checklists,
  disabled,
  loading,
  isAuditor,
  activeTab,
  dynamicLabels,
}) => {
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const dispatch = useDispatch();
  const [isShowChecklist, setIsShowChecklist] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [pageSize, setPageSize] = useState<number>(20);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [titleModal, setTitleModal] = useState('');
  const [openTemplate, setOpenTemplate] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [templateID, setTemplateID] = useState(null);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [gridApi, setGridApi] = useState<GridApi>(null);

  const el = document.getElementById('ag-grid-table');
  const el2 = document.getElementById('ag-grid-table-theme');

  const onFullScreenChange = (event) => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
      el2.style.height = 'calc(100% - 36px)';
    } else {
      setIsFullScreen(false);
      el2.style.height = '100%';
    }
  };

  useEffect(() => {
    if (activeTab === 'Checklist') {
      dispatch(
        getListTemplateActions.request({
          content: MODULE_TEMPLATE.iWChecklistInformationTemplate,
        }),
      );
      setSelectedItem(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (templateDetail && listTemplate?.data?.length > 0) {
      setTemplateID(templateDetail.id);
      const template = JSON.parse(templateDetail.template);
      if (template) {
        gridApi?.setFilterModel(template.filterModel);
        gridColumnApi?.applyColumnState({
          state: template.columns,
          applyOrder: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateDetail]);

  const dataTable = useMemo(
    () =>
      checklists?.map((item) => ({
        id: item?.id || DATA_SPACE,
        appInstance: item?.appInstance || DATA_SPACE,
        webInstance: item?.webInstance || DATA_SPACE,
        status: item?.status || DATA_SPACE,
        code: item?.auditChecklist?.code || DATA_SPACE,
        name: item?.auditChecklist?.name || DATA_SPACE,
        chkType: item?.auditChecklist?.chkType || DATA_SPACE,
        revisionNumber: item?.auditChecklist?.revisionNumber || DATA_SPACE,
        revisionDate:
          (item?.auditChecklist?.revisionDate &&
            moment(item?.auditChecklist?.revisionDate)
              .local()
              .format(FORMAT_DATE_TIME)) ||
          DATA_SPACE,
        publishedDate:
          (item?.auditChecklist?.publishedDate &&
            moment(item?.auditChecklist?.publishedDate)
              .local()
              .format(FORMAT_DATE_TIME)) ||
          DATA_SPACE,
        submitOn:
          (item?.submitOn &&
            moment(item?.submitOn).local().format(FORMAT_DATE_TIME)) ||
          DATA_SPACE,
        submitBy: item?.submitBy?.username || DATA_SPACE,
        updatedAt:
          (item?.updatedAt &&
            moment(item?.updatedAt).local().format(FORMAT_DATE_TIME)) ||
          DATA_SPACE,
        lastUpdatedByUser: item?.lastUpdatedBy?.username || DATA_SPACE,
        // appType: item?.auditChecklist?.appType,
        key: item?.id || DATA_SPACE,
        listQuestions: item?.listQuestions || 0,
        pendingQuestion: item?.pendingQuestion || 0,
        completedQuestion: item?.completedQuestion || 0,
        totalOfFinding: item?.totalOfFinding || 0,
      })),
    [checklists],
  );

  const handleBack = () => {
    setIsShowChecklist(false);
    setSelectedItem(undefined);
  };

  const triggerChecklist = useCallback(
    (dataItem: AuditInspectionChecklistResponse) => {
      triggerAuditWorkspaceChecklistActionsApi({
        workspaceId: dataItem.auditWorkspaceId,
        fillChecklistId: dataItem.id,
        data: {
          planningRequestId: data.planningRequestId,
          timezone: 'Asia/Ho_Chi_Minh',
        },
      })
        .then((res) => {
          dispatch(
            getAuditWorkspaceChecklistActions.request({
              id: data?.id,
              afterGetDetail: () => {
                setIsShowChecklist(true);
                setSelectedItem(dataItem);
                dispatch(
                  getAuditInspectionWorkspaceDetailActions.request(
                    dataItem.auditWorkspaceId,
                  ),
                );
              },
            }),
          );
        })
        .catch((e) => {
          toastError(e);
        });
    },
    [data?.id, data?.planningRequestId, dispatch],
  );

  const onShowChecklist = useCallback(
    (idItem) => {
      setIsShowChecklist(true);
      const dataModal = checklists.find((item) => item?.id === idItem);
      if (dataModal) {
        setSelectedItem(dataModal);
      }
    },
    [checklists],
  );

  const handleGetTemplate = (templateId: string) => {
    dispatch(
      getTemplateDetailActions.request({
        templateId,
        content: MODULE_TEMPLATE.iWChecklistInformationTemplate,
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
              content: MODULE_TEMPLATE.iWChecklistInformationTemplate,
            }),
          );
        },
      }),
    );
  };

  const extensionOptions: ExtensionOption[] = [
    {
      label: TEXT_ACTION_TEMPLATE.saveTemplate,
      icon: images.icons.agGrid.icAGSave,
      onClick: () => {
        if (listTemplate?.data?.length > 0) {
          dispatch(
            updateTemplateActions.request({
              id: templateDetail.id,
              module: MODULE_TEMPLATE.iWChecklistInformationTemplate,
              type: templateDetail.type,
              name: templateDetail.name,
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
          fileName: 'Checklist information.xlsx',
        }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({
          fileName: 'Checklist information.csv',
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

  const columnDefs = useMemo(
    () => [
      {
        field: 'appInstance',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'App instance ID'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',

        cellRendererFramework: (params) => {
          const { data } = params;

          return (
            <span
              className={cx(
                { 'text__color--blue_3 text__link': data?.appInstance },
                'limit-line-text',
              )}
              onClick={() => {
                if (data?.appInstance) {
                  onShowChecklist(data?.id);
                }
              }}
            >
              {data?.appInstance}
            </span>
          );
        },
      },
      {
        field: 'webInstance',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Web instance ID'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',

        cellRendererFramework: (params) => {
          const { data } = params;

          return (
            <span
              className={cx(
                { 'text__color--blue_3 text__link': data?.webInstance },
                'limit-line-text',
              )}
              onClick={() => {
                if (data?.webInstance) {
                  onShowChecklist(data?.id);
                }
              }}
            >
              {data?.webInstance}
            </span>
          );
        },
      },
      {
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Checklist code'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: (params) => {
          const { data } = params;
          const checkListDetail = checklists.find(
            (item) => item?.id === data?.id,
          );
          return (
            <span
              className={cx(
                {
                  'text__color--blue_3 text__link': !(
                    checkListDetail?.webInstance || checkListDetail?.appInstance
                  ),
                },
                'limit-line-text',
              )}
              onClick={() => {
                if (
                  checkListDetail?.webInstance ||
                  checkListDetail?.appInstance
                ) {
                  return null;
                }
                if (
                  !(
                    checkListDetail?.webInstance || checkListDetail?.appInstance
                  ) &&
                  isAuditor
                ) {
                  triggerChecklist(checkListDetail);
                } else {
                  onShowChecklist(params?.id);
                }
                return null;
              }}
            >
              {data?.code}
            </span>
          );
        },
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Checklist name'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'chkType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Checklist type'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Checklist status'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'revisionNumber',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Revision number'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'revisionDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Revision date'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'publishedDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Publish on'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'submitOn',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Submitted on'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'submitBy',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Submitted by'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Last updated on'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'lastUpdatedByUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Last updated by'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'listQuestions',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Number of questions'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'pendingQuestion',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Pending questions'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'completedQuestion',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Completed questions'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },

      {
        field: 'totalOfFinding',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
            'Number of findings'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      onShowChecklist,
      checklists,
      isAuditor,
      triggerChecklist,
    ],
  );

  const getTypeTemplate = (type: string, templateDetailType: string) => {
    if (type === TEXT_ACTION_TEMPLATE.globalTemplate)
      return TYPE_TEMPLATE.global;
    if (type === TEXT_ACTION_TEMPLATE.saveAsTemplate)
      return TYPE_TEMPLATE.template;
    return templateDetailType || TYPE_TEMPLATE.template;
  };

  const handleSaveTemplate = (templateName: string) => {
    dispatch(
      createTemplateActions.request({
        module: MODULE_TEMPLATE.iWChecklistInformationTemplate,
        type: getTypeTemplate(titleModal, templateDetail?.type),
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

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return isShowChecklist && selectedItem ? (
    <ChecklistForm
      selectedItem={selectedItem}
      toggle={() => handleBack()}
      data={data}
      loading={loading}
      disabled={disabled}
      dynamicLabels={dynamicLabels}
    />
  ) : (
    <div className="">
      {loading ? (
        <div className={styles.loadingWrapper}>
          <img
            src={images.common.loading}
            className={cx(styles.loading)}
            alt="loading"
          />
        </div>
      ) : (
        <div className={cx(styles.TabContainer)}>
          <div className="d-flex justify-content-end mb-3">
            {data?.attachments?.length > 0 && (
              <PDFWrapper attachments={data?.attachments} />
            )}
          </div>
          <div className={cx(styles.contentWrapperChecklist)}>
            <div className={cx(styles.headerTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Checklist information'],
              )}
            </div>
            {dataTable?.length ? (
              <AGGridTable
                loading={loading}
                isFullScreen={isFullScreen}
                extensionOptions={extensionOptions}
                onGridReady={onGridReady}
                height="calc(100vh - 340px)"
                rowData={dataTable}
                columnDefs={columnDefs}
                defaultColDef={colDef}
                templates={listTemplate?.data || []}
                pageSize={pageSize}
                setPageSize={(newPageSize: number) => {
                  setPageSize(newPageSize);
                  gridApi.paginationGoToPage(0);
                }}
                totalItem={dataTable?.length}
                templateID={templateID}
                onFilterChanged={(event: FilterChangedEvent) => {
                  const filterModel = event.api.getFilterModel();
                  setCurrentFilterModel(filterModel);
                }}
                handleSetTemplateID={handleGetTemplate}
                handleDeleteTemplate={handleDeleteTemplate}
                rowSelection="single"
                renderModalInside={
                  <>
                    <ModalList
                      data={listTemplate?.data || []}
                      isOpen={modalOpen}
                      toggle={setModalOpen}
                      templateModule={
                        MODULE_TEMPLATE.iWChecklistInformationTemplate
                      }
                    />
                    <TemplateModal
                      title={titleModal}
                      isOpen={openTemplate}
                      loading={loading}
                      toggle={() => setOpenTemplate((p) => !p)}
                      handleSave={handleSaveTemplate}
                      templates={listTemplate?.data || []}
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
        </div>
      )}
    </div>
  );
};

export default ChecklistInformation;
