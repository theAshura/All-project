import cx from 'classnames';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import history from 'helpers/history.helper';

import lowerCase from 'lodash/lowerCase';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import HeaderPage from 'components/common/header-page/HeaderPage';
import moment from 'moment';

import { AuditTimeTable } from 'models/api/audit-time-table/audit-time-table.model';
import {
  deleteAuditTimeTableActions,
  setDataFilterAction,
  getListAuditTimeTableActions,
  recallActions,
} from 'store/audit-time-table/audit-time-table.action';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';

import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import ButtonActionRow, {
  ButtonTypeRow,
} from 'components/common/table/row/ButtonActionRow';
import { CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { dateStringComparator } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';

import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  GridApi,
  PaginationChangedEvent,
  GridReadyEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import { CommonQuery } from 'constants/common.const';
import TemplateModal from 'components/common/ag-grid/TemplateModal';

import {
  getListTemplateActions,
  deleteTemplateActions,
  createTemplateActions,
  updateTemplateActions,
  getTemplateDetailActions,
  clearTemplateReducer,
} from 'store/template/template.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import CustomModalInside from 'components/ui/modal/custom-modal-inside/CustomModalInside';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-time-table.const';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  TYPE_TEMPLATE,
  DATA_SPACE,
  TEXT_ACTION_TEMPLATE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';
import { checkDocHolderChartererVesselOwner } from '../../planning-and-request/forms/planning-and-request.helps';

const AuditTimeTableContainer = () => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionAuditTimeTable,
    modulePage: ModulePage.List,
  });

  const dispatch = useDispatch();

  const { loading, listAuditTimeTables, params, dataFilter } = useSelector(
    (state) => state.auditTimeTable,
  );
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { userInfo } = useSelector((state) => state.authenticate);

  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);

  const [pageSize, setPageSize] = useState(dataFilter?.pageSize || 20);
  const [page, setPage] = useState(dataFilter?.page > 0 ? dataFilter?.page : 0);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [idItemRow, setIdItemRow] = useState('');
  const [reviewInProgress, setReviewInProgress] = useState(false);
  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [titleModal, setTitleModal] = useState('');
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const totalPage = gridApi?.paginationGetTotalPages();

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

  const handleSaveFilter = useCallback(
    (data: CommonApiParam) => {
      dispatch(setDataFilterAction(data));
    },
    [dispatch],
  );

  const viewDetail = useCallback(
    (id?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          AppRouteConst.getAuditTimeTableById(id),
          '_blank',
        );
        win.focus();
      } else {
        handleSaveFilter({
          columnsAGGrid: gridColumnApi?.getColumnState(),
          filterModel: currentFilterModel,
          page,
          pageSize,
          dateFilter,
          typeRange,
        });
        history.push(AppRouteConst.getAuditTimeTableById(id));
      }
    },
    [
      handleSaveFilter,
      gridColumnApi,
      currentFilterModel,
      page,
      pageSize,
      dateFilter,
      typeRange,
    ],
  );

  const editDetail = useCallback(
    (id?: string) => {
      handleSaveFilter({
        columnsAGGrid: gridColumnApi?.getColumnState(),
        filterModel: currentFilterModel,
        page,
        pageSize,
        dateFilter,
        typeRange,
      });
      history.push(
        `${AppRouteConst.getAuditTimeTableById(id)}${CommonQuery.EDIT}`,
      );
    },
    [
      handleSaveFilter,
      gridColumnApi,
      currentFilterModel,
      page,
      pageSize,
      dateFilter,
      typeRange,
    ],
  );

  const handleGetList = (params?: CommonApiParam) => {
    const { handleSuccess, ...other } = params;
    let newParams = handleFilterParams(other);
    if (handleSuccess) {
      newParams = { ...newParams, handleSuccess };
    }
    dispatch(
      getListAuditTimeTableActions.request({ ...newParams, pageSize: -1 }),
    );
  };

  useEffect(() => {
    if (listTemplate?.data?.length === 0) {
      gridColumnApi?.resetColumnState();
      setColDef(DEFAULT_COL_DEF);
      gridApi?.setFilterModel(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTemplate]);

  useEffect(() => {
    if (dataFilter?.pageSize && totalPage && isFirstSetDataFilter) {
      setIsFirstSetDataFilter(false);
      gridApi?.setFilterModel(dataFilter.filterModel);
      gridApi?.paginationGoToPage(dataFilter?.page);
      setDateFilter([...dataFilter?.dateFilter]);
      if (dataFilter?.columnsAGGrid) {
        gridColumnApi?.applyColumnState({
          state: dataFilter.columnsAGGrid,
          applyOrder: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter, gridApi, totalPage]);

  useEffect(() => {
    if (templateDetail && listTemplate?.data?.length > 0) {
      setTemplateID(templateDetail.id);
      if (!dataFilter || !isFirstSetDataFilter) {
        setPage(0);
        setPageSize(20);
        const template = JSON.parse(templateDetail.template);
        if (template) {
          gridApi?.setFilterModel(template.filterModel);
          gridColumnApi?.applyColumnState({
            state: template.columns,
            applyOrder: true,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateDetail]);

  useEffect(() => {
    if (params?.isLeftMenu) {
      setDateFilter(DATE_DEFAULT);
      setTypeRange(TYPE_CUSTOM_RANGE);
      setPageSize(20);
      setPage(0);
      gridApi?.paginationGoToPage(0);
      handleGetList({
        createdAtFrom: DATE_DEFAULT[0].toISOString(),
        createdAtTo: DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.auditTimeTable,
            }),
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.isLeftMenu]);

  useEffectOnce(() => {
    if (!params?.isLeftMenu) {
      handleGetList({
        createdAtFrom: dataFilter?.dateFilter[0]
          ? dataFilter?.dateFilter[0]?.toISOString()
          : DATE_DEFAULT[0].toISOString(),
        createdAtTo: dataFilter?.dateFilter[1]
          ? dataFilter?.dateFilter[1]?.toISOString()
          : DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.auditTimeTable,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListAuditTimeTableActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
      // el.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  });

  const handleActionRow = (data: AuditTimeTable) => {
    setIsOpenConfirm(true);
    setIdItemRow(data.id);
    setReviewInProgress(data.reviewInProgress);
    // if (data.status === 'Submitted' && data?.reviewInProgress) {
    //   setBusinessRule('Revoke');
    // }
    // if (data.status === 'Submitted' && !data?.reviewInProgress) {
    //   setBusinessRule('Recall');
    // }
  };

  const handleDeleteAuditTimeTable = (id: string) => {
    dispatch(
      deleteAuditTimeTableActions.request({
        id,
        getListAuditTimeTable: () => {
          handleGetList({
            createdAtFrom: dateFilter[0].toISOString(),
            createdAtTo: dateFilter[1].toISOString(),
          });
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),
      onPressButtonRight: () => handleDeleteAuditTimeTable(id),
    });
  };

  const fillStatus = (status) => {
    switch (status) {
      case 'draft': {
        return 'Draft';
      }

      case 'submitted': {
        return 'Submitted';
      }
      case 'approved': {
        return 'Approved';
      }

      case 'close_out': {
        return 'Close Out';
      }

      default:
        return 'Reassigned';
    }
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

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
        module: MODULE_TEMPLATE.auditTimeTable,
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

  const handleGetTemplate = (templateId: string) => {
    dispatch(getTemplateDetailActions.request({ templateId }));
  };

  const handleDeleteTemplate = (templateId: string) => {
    dispatch(
      deleteTemplateActions.request({
        ids: [templateId],
        getList: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.auditTimeTable,
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
              module: MODULE_TEMPLATE.auditTimeTable,
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
        gridApi?.exportDataAsExcel({ fileName: 'Inspection Time Table.xlsx' }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({ fileName: 'Inspection Time Table.csv' }),
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

  const renderConfirm = () => (
    <div>
      <p>
        {renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
            `On ${
              reviewInProgress ? 'Revoke' : 'Recall'
            }, your submitted task will be
          reverted to you if no one has claimed yet. Do you want to proceed?`
          ],
        )}
      </p>
      <div className="d-flex w-50 mx-auto mt-4">
        <Button
          className={cx('w-100 me-4')}
          buttonType={ButtonType.CancelOutline}
          disabled={loading}
          onClick={() => {
            setIsOpenConfirm(false);
          }}
        >
          {renderDynamicLabel(
            dynamicLabels,
            LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.No,
          )}
        </Button>
        <Button
          onClick={() => {
            dispatch(
              recallActions.request({
                id: idItemRow,
                handleSuccess: () => {
                  handleGetList({
                    createdAtFrom: dateFilter[0].toISOString(),
                    createdAtTo: dateFilter[1].toISOString(),
                  });
                  setIsOpenConfirm(false);
                },
              }),
            );
          }}
          disabled={loading}
          buttonType={ButtonType.Primary}
          className={cx('w-100 ms-4')}
        >
          {renderDynamicLabel(
            dynamicLabels,
            LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Yes,
          )}
        </Button>
      </div>
    </div>
  );

  const handleActions = useCallback(
    (data) => {
      const isCreator = userInfo?.id === data?.createdUserId;
      const isCompany = userInfo?.mainCompanyId === data?.companyObject?.id;
      const draftCase = isCreator && data?.status?.toLowerCase() === 'draft';
      const submittedCase =
        isCreator && data?.status?.toLowerCase() === 'submitted';
      const isCurrentDoc = checkDocHolderChartererVesselOwner(
        {
          vesselDocHolders: data?.vesselDocHolders,
          vesselCharterers: data?.vesselCharterers,
          vesselOwners: data?.vesselOwners,
          createdAt: data?.createdAt,
          entityType: data?.entityType,
        },
        userInfo,
      );

      const allowEdit =
        (draftCase || submittedCase) && isCompany && isCurrentDoc;
      const allowDelete = draftCase && isCompany && isCurrentDoc;
      return [
        {
          img: images.icons.icViewDetail,
          function: () => data && viewDetail(data?.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.AUDIT_TIME_TABLE,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        allowEdit && {
          img: images.icons.icEdit,
          function: () => data && editDetail(data?.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.AUDIT_TIME_TABLE,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        allowDelete && {
          img: images.icons.icRemove,
          function: () => data && handleDelete(data?.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.AUDIT_TIME_TABLE,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => data && viewDetail(data?.id, true),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.PLANNING_AND_REQUEST,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Green,
        },
      ]?.filter((item) => item);
    },
    [editDetail, handleDelete, userInfo, viewDetail],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        enableRowGroup: false,
        sortable: false,
        minWidth: 125,
        maxWidth: 125,
        lockPosition: true,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;

          const actions = handleActions(data);

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
        field: 'refNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Reference number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditRefId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Inspection Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'entityType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'fleetName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Fleet name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselFlag',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Vessel flag'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Company,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'department',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Department,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'auditSno',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Inspection S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'auditType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'leadAuditorName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Lead inspector name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'plannedFromDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Planned from date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'plannedToDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Planned to date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'sNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'revoke',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Revoke/ Recall'],
        ),
        enableRowGroup: false,
        filter: false,
        cellRendererFramework: ({ data }) =>
          lowerCase(data?.status) === 'submitted' &&
          userInfo?.id === data?.createdUserId ? (
            <div className="d-flex align-items-center justify-content-between height__action-row">
              <ButtonActionRow
                typeButton={
                  data?.reviewInProgress
                    ? ButtonTypeRow.OutlineGreen
                    : ButtonTypeRow.OutlinePrimary
                }
                handleClick={() => handleActionRow(data)}
              >
                {data?.reviewInProgress ? 'Revoke' : 'Recall'}
              </ButtonActionRow>
            </div>
          ) : (
            <div />
          ),
      },
    ],
    [dynamicLabels, isMultiColumnFilter, handleActions, userInfo?.id],
  );

  const dataTable = useMemo(
    () =>
      listAuditTimeTables?.data?.map((item) => ({
        id: item?.id || DATA_SPACE,
        refNo: item?.refNo || DATA_SPACE,
        auditRefId: item?.planningRequest?.refId || DATA_SPACE,
        fleetName: item?.vessel?.fleet?.name || DATA_SPACE,
        vesselName: item?.vessel?.name || DATA_SPACE,
        vesselType: item?.vessel?.vesselType.name || DATA_SPACE,
        company: item?.planningRequest?.auditCompany?.name || DATA_SPACE,
        department:
          item?.planningRequest?.departments?.map((i) => i.name).join(', ') ||
          DATA_SPACE,
        vesselFlag: item?.vessel?.countryFlag || DATA_SPACE,
        auditSno: item?.planningRequest?.auditNo || DATA_SPACE,
        entityType: item?.planningRequest?.entityType || DATA_SPACE,
        auditType:
          item?.planningRequest?.auditTypes
            ?.map((item) => item.name)
            .join(', ') || DATA_SPACE,
        leadAuditorName:
          item?.planningRequest?.leadAuditor?.username || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        plannedFromDate: item?.planningRequest?.plannedFromDate
          ? moment(item?.planningRequest?.plannedFromDate)
              .local()
              .format('DD/MM/YYYY HH:mm')
          : DATA_SPACE,
        plannedToDate: item?.planningRequest?.plannedToDate
          ? moment(item?.planningRequest?.plannedToDate)
              .local()
              .format('DD/MM/YYYY HH:mm')
          : DATA_SPACE,
        sNo: item?.sNo,
        status: fillStatus(item?.status),
        revoke:
          // eslint-disable-next-line no-nested-ternary
          lowerCase(item?.status) === 'submitted'
            ? item?.reviewInProgress
              ? 'Revoke'
              : 'Recall'
            : DATA_SPACE,
        createdUserId: item?.createdUserId || DATA_SPACE,
        reviewInProgress: item?.reviewInProgress || DATA_SPACE,
        companyObject: item?.company,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      })) || [],
    [listAuditTimeTables?.data],
  );
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.AUDIT_TIME_TABLE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionAuditTimeTable,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.AUDIT_TIME_TABLE,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() =>
                  history.push(AppRouteConst.AUDIT_TIME_TABLE_CREATE)
                }
                disabled={loading}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  LIST_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Create New'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>
      <RangePickerFilter
        disable={loading}
        valueDateRange={dateFilter}
        dynamicLabels={dynamicLabels}
        onChangeRange={(data) => {
          setDateFilter(data);
        }}
        handleGetList={() =>
          handleGetList({
            createdAtFrom: dateFilter[0].toISOString(),
            createdAtTo: dateFilter[1].toISOString(),
          })
        }
        setTypeRange={(type: string) => {
          handleSaveFilter({ typeRange: type });
          setTypeRange(type);
        }}
        typeRange={typeRange}
      />

      <AGGridTable
        isFullScreen={isFullScreen}
        loading={loading}
        extensionOptions={extensionOptions}
        onGridReady={onGridReady}
        height="calc(100vh - 188px)"
        rowData={dataTable}
        columnDefs={columnDefs}
        defaultColDef={colDef}
        templates={listTemplate?.data || []}
        pageSize={pageSize}
        setPageSize={(newPageSize: number) => {
          setPageSize(newPageSize);
          gridApi.paginationGoToPage(0);
          setPage(0);
        }}
        totalItem={listAuditTimeTables?.totalItem}
        templateID={templateID}
        handleSetTemplateID={handleGetTemplate}
        handleDeleteTemplate={handleDeleteTemplate}
        onFilterChanged={(event: FilterChangedEvent) => {
          const filterModel = event.api.getFilterModel();
          setCurrentFilterModel(filterModel);
        }}
        onPaginationChanged={(event: PaginationChangedEvent) => {
          const pageNumber = event.api.paginationGetCurrentPage();
          setPage(pageNumber);
        }}
        rowSelection="single"
        onSelectionChanged={(event: SelectionChangedEvent) => {
          const selectedRows = event.api.getSelectedRows();
          if (selectedRows[0]?.id?.length > 0) viewDetail(selectedRows[0].id);
        }}
        renderModalInside={
          <>
            <TemplateModal
              title={titleModal}
              isOpen={openTemplate}
              loading={loading}
              toggle={() => setOpenTemplate((p) => !p)}
              handleSave={handleSaveTemplate}
              templates={listTemplate?.data || []}
            />
            <CustomModalInside
              isOpen={isOpenConfirm}
              title="Confirmation"
              toggle={() => {
                if (!loading) {
                  setIsOpenConfirm((prev) => !prev);
                }
              }}
              content={renderConfirm()}
              w="500px"
            />
            <ModalList
              data={listTemplate?.data || []}
              isOpen={modalOpen}
              toggle={setModalOpen}
              templateModule={MODULE_TEMPLATE.auditTimeTable}
            />
          </>
        }
      />
    </div>
  );
};

export default AuditTimeTableContainer;
