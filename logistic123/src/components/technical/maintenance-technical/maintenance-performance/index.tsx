import { useCallback, useMemo, useState } from 'react';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATA_SPACE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { MaintenancePerformance } from 'models/api/maintenance-performance/maintenance-performance.model';

import {
  createMaintenancePerformanceActions,
  deleteMaintenancePerformanceActions,
  getListMaintenancePerformanceActions,
  updateMaintenancePerformanceActions,
} from 'store/maintenance-performance/maintenance-performance.action';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import PermissionCheck from 'hoc/withPermissionCheck';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import {
  Features,
  ActionTypeEnum,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  formatDateTime,
  dateStringComparator,
  setHeightTable,
  convertToPercent,
} from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { useParams } from 'react-router';
import ModalMaintenancePerformance from '../components/ModalMaintenancePerformance';
import styles from '../maintenance-technical.module.scss';

export interface MaintenancePerformanceExtend extends MaintenancePerformance {
  index: number;
}

const MaintenanceTechnicalContainer = () => {
  const { t } = useTranslation(I18nNamespace.MAINTENANCE_TECHNICAL);

  const dispatch = useDispatch();
  const { loading, listMaintenancePerformance, params, dataFilter } =
    useSelector((state) => state.maintenancePerformance);
  const { userInfo } = useSelector((state) => state.authenticate);

  const [page, setPage] = useState(params.page || 1);
  const [pageSize] = useState(params.pageSize || 5);
  const [content] = useState(params.content || '');
  const [status] = useState<string>(params?.status || 'all');
  const [sort] = useState<string>(params.sort || '');
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const [selected, setSelected] = useState<MaintenancePerformanceExtend>(null);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const viewDetail = useCallback(
    (id: string) => {
      setIsCreate(false);
      setIsEdit(false);
      setIsView(true);
      setIsVisibleModal(true);
      const index = listMaintenancePerformance?.data?.findIndex(
        (item) => item?.id === id,
      );
      setSelected({ ...listMaintenancePerformance?.data[index], index });
    },
    [listMaintenancePerformance?.data],
  );

  const editDetail = useCallback(
    (id: string) => {
      setIsCreate(false);
      setIsEdit(true);
      setIsView(false);
      setIsVisibleModal(true);
      const index = listMaintenancePerformance?.data?.findIndex(
        (item) => item?.id === id,
      );
      setSelected({ ...listMaintenancePerformance?.data[index], index });
    },
    [listMaintenancePerformance?.data],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListMaintenancePerformanceActions.request({
          ...newParams,
          pageSize: -1,
          vesselId: vesselRequestId,
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  const handleDeleteFunc = useCallback(
    (id: string) => {
      dispatch(
        deleteMaintenancePerformanceActions.request({
          id,
          handleSuccess: () => {
            if (page > 1 && listMaintenancePerformance?.data?.length === 1) {
              setPage(page - 1);
              handleGetList({
                isRefreshLoading: false,
                page: page - 1,
                pageSize,
                content,
                sort,
                status: status?.toString(),
              });
            } else {
              handleGetList({
                isRefreshLoading: false,
                page,
                pageSize,
                content,
                sort,
                status: status?.toString(),
              });
            }
          },
        }),
      );
    },
    [
      content,
      dispatch,
      handleGetList,
      listMaintenancePerformance,
      page,
      pageSize,
      sort,
      status,
    ],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteFunc(id),
      });
    },
    [handleDeleteFunc, t],
  );

  const checkWorkflow = useCallback(
    (item): Action[] => {
      const isCurrentDocChartererVesselOwner =
        checkDocHolderChartererVesselOwner(
          {
            vesselDocHolders: item?.vesselDocHolders,
            vesselCharterers: item?.vesselCharterers,
            vesselOwners: item?.vesselOwners,
            createdAt: item?.createdAt,
          },
          userInfo,
        );
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        isCurrentDocChartererVesselOwner && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        isCurrentDocChartererVesselOwner && {
          img: images.icons.icRemove,
          function: () => handleDelete(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
          cssClass: 'me-1',
        },
      ]?.filter((item) => item);
      return actions;
    },
    [editDetail, handleDelete, userInfo, viewDetail],
  );

  const dataTable = useMemo(
    () =>
      listMaintenancePerformance?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        no: index + 1 || DATA_SPACE,

        eventType: item?.eventType || DATA_SPACE,
        recordDate: formatDateTime(item?.recordDate),
        periodFrom: formatDateTime(item?.periodFrom),
        periodTo: formatDateTime(item?.periodTo),
        totalPlannedJobs: item?.totalPlannedJobs || DATA_SPACE,
        overdueCriticalJobs: item?.overdueCriticalJobs || DATA_SPACE,
        overdueNonCriticalJobs: item?.overdueJobs || DATA_SPACE,
        overdueNonCriticalPercentage:
          convertToPercent(item?.overdueJobs, item?.totalPlannedJobs) ||
          DATA_SPACE,
        attachments: item?.attachments,
        remarks: item?.remarks || DATA_SPACE,
        lastUpdatedDate: item?.updatedAt
          ? formatDateTime(item?.updatedAt)
          : DATA_SPACE,
        index,
        refId: item?.refId,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      })) || [],
    [listMaintenancePerformance?.data],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: 'Action',
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;

          let actions = checkWorkflow(data);
          if (!data) {
            actions = [];
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
        field: 'refId',
        headerName: t('refID'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eventType',
        headerName: t('eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'recordDate',
        headerName: t('recordDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'periodFrom',
        headerName: t('periodFrom'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'periodTo',

        headerName: t('periodTo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'totalPlannedJobs',

        headerName: t('totalPlannedJobs'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'overdueCriticalJobs',
        headerName: t('overdueCriticalJobs'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },

      {
        field: 'overdueNonCriticalJobs',

        headerName: t('overdueNonCriticalJobs'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'overdueNonCriticalPercentage',

        headerName: t('overdueNonCriticalPercentage'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'remarks',

        headerName: t('remarks'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'attachments',

        headerName: t('attachments'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => {
          if (data?.attachments?.length > 0) {
            return (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  editDetail(data?.id);
                }}
                buttonType={ButtonType.Outline}
                className={styles.btnAttachment}
              >
                Attachment
              </Button>
            );
          }
          return null;
        },
      },
      {
        field: 'lastUpdatedDate',
        headerName: t('lastUpdatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow, editDetail],
  );

  const handleSubmit = useCallback(
    (dataForm, isCreate: boolean) => {
      if (isCreate) {
        dispatch(
          createMaintenancePerformanceActions.request({
            ...dataForm,
            handleSuccess: () => {
              handleGetList({
                createdAtFrom: dataFilter?.dateFilter[0]
                  ? dataFilter?.dateFilter[0]?.toISOString()
                  : DATE_DEFAULT[0].toISOString(),
                createdAtTo: dataFilter?.dateFilter[1]
                  ? dataFilter?.dateFilter[1]?.toISOString()
                  : DATE_DEFAULT[1].toISOString(),
                handleSuccess: () => {
                  dataForm?.handleSuccess();
                },
              });
              setSelected(null);
              setIsCreate(false);
              setIsEdit(false);
            },
          }),
        );
      } else if (selected) {
        dispatch(
          updateMaintenancePerformanceActions.request({
            id: selected?.id,
            body: dataForm,
            handleSuccess: () => {
              handleGetList({
                createdAtFrom: dataFilter?.dateFilter[0]
                  ? dataFilter?.dateFilter[0]?.toISOString()
                  : DATE_DEFAULT[0].toISOString(),
                createdAtTo: dataFilter?.dateFilter[1]
                  ? dataFilter?.dateFilter[1]?.toISOString()
                  : DATE_DEFAULT[1].toISOString(),
                handleSuccess: () => {
                  dataForm?.handleSuccess();
                },
              });
              setSelected(null);
              setIsCreate(false);
              setIsEdit(false);
            },
          }),
        );
      }
    },
    [dataFilter?.dateFilter, dispatch, handleGetList, selected],
  );

  const headButtons = useMemo(
    () => (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission && (
            <Button
              onClick={() => {
                setIsCreate(true);
                setSelected(null);
                setIsEdit(false);
                setIsView(false);
                setIsVisibleModal(true);
              }}
              buttonSize={ButtonSize.Medium}
              className="button_create"
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
              disabled={loading}
            >
              {t('createNew')}
            </Button>
          )
        }
      </PermissionCheck>
    ),
    [loading, t],
  );

  return (
    <div className={cx(styles.wrapper)}>
      <AGGridModule
        loading={loading}
        title={t('maintenancePerformance')}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={null}
        pageSizeDefault={5}
        moduleTemplate={`${MODULE_TEMPLATE.maintenancePerformance}__${vesselRequestId}`}
        fileName="SAIL Reporting_Maintenance Performance"
        dataTable={dataTable}
        height={setHeightTable(listMaintenancePerformance?.totalItem || 0)}
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={handleGetList}
        buttons={headButtons}
      />
      <ModalMaintenancePerformance
        data={selected}
        isOpen={isVisibleModal}
        title={t('maintenancePerformanceInformation')}
        toggle={() => {
          setSelected(null);
          setIsCreate(false);
          setIsEdit(false);
          setIsVisibleModal(false);
        }}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        isCreate={isCreate}
        isView={isView}
      />
    </div>
  );
};

export default MaintenanceTechnicalContainer;
