import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import ModalDryDocking from 'components/sail-general-report/form/dry-docking';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DATA_SPACE,
  DATE_DEFAULT,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { formatDateTime, formatDateTimeDay } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { CreateDryDockingParams } from 'models/api/dry-docking/dry-docking.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  createDryDockingActions,
  deleteDryDockingActions,
  getDetailDryDocking,
  getLisDryDockingActions,
  updateDryDockingActions,
} from 'store/dry-docking/dry-docking.action';
import styles from './dry-docking.module.scss';

export enum DryDockingStatus {
  PLANNED = 'Planned',
  IN_DOCK = 'In-Dock',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

const DryDocking = () => {
  const { t } = useTranslation(I18nNamespace.DRY_DOCKING);
  const { loading, params, dataFilter, listDryDocking } = useSelector(
    (state) => state.dryDocking,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isVisibleModalSurveyClassInfo, setIsVisibleModalSurveyClassInfo] =
    useState<boolean>(false);
  const [detailSurvey, setDetailSurvey] = useState(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [page, setPage] = useState(params.page || 1);
  const dispatch = useDispatch();
  const [dateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const { id: vesselRequestId } = useParams<{ id: string }>();

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { handleSuccess, ...other } = params;
      let newParams = handleFilterParams(other);
      if (handleSuccess) {
        newParams = { ...newParams, handleSuccess };
      }
      dispatch(
        getLisDryDockingActions.request({
          ...newParams,
          pageSize: -1,
          vesselId: vesselRequestId,
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  const editDetail = useCallback(
    (id?: string, data?: any) => {
      setIsVisibleModalSurveyClassInfo(true);
      setDetailSurvey(data);
      setIsEdit(true);
      setIsCreate(false);
      setIsView(false);
      dispatch(getDetailDryDocking.request(id));
    },
    [dispatch],
  );

  const viewDetail = useCallback(
    (id?: string, data?: any) => {
      setIsEdit(false);
      setIsCreate(false);
      setIsView(true);
      setDetailSurvey(data);
      dispatch(getDetailDryDocking.request(id));
      setIsVisibleModalSurveyClassInfo(true);
    },
    [dispatch],
  );

  const handleDeleteStandardMaster = useCallback(
    (id: string) => {
      dispatch(
        deleteDryDockingActions.request({
          id,
          afterDelete: () => {
            if (page > 1 && listDryDocking?.data.length === 1) {
              setPage(page - 1);
              handleGetList({
                createdAtFrom: dateFilter[0].toISOString(),
                createdAtTo: dateFilter[1].toISOString(),
                isRefreshLoading: false,
              });
            } else {
              handleGetList({
                createdAtFrom: dateFilter[0].toISOString(),
                createdAtTo: dateFilter[1].toISOString(),
                isRefreshLoading: false,
              });
            }
          },
        }),
      );
    },
    [dateFilter, dispatch, handleGetList, listDryDocking?.data.length, page],
  );
  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteStandardMaster(id),
      });
    },
    [handleDeleteStandardMaster, t],
  );

  const handleActions = useCallback(
    (item): Action[] => {
      const isCurrentDoc = checkDocHolderChartererVesselOwner(
        {
          vesselDocHolders: item?.vesselDocHolders,
          vesselCharterers: item?.vesselCharterers,
          vesselOwners: item?.vesselOwners,
          createdAt: item?.createdAt,
          entityType: item?.entityType,
        },
        userInfo,
      );
      const allowEdit =
        item?.status !== DryDockingStatus.CANCELLED && isCurrentDoc;
      const allowDelete = isCurrentDoc;
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id, item),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        allowEdit && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id, item),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        allowDelete && {
          img: images.icons.icRemove,
          function: () => handleDelete(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
          cssClass: 'me-1',
        },
      ];
      return actions;
    },
    [userInfo, viewDetail, handleDelete, editDetail],
  );

  const handleSubmitForm = (dataForm: CreateDryDockingParams) => {
    if (isEdit) {
      dispatch(
        updateDryDockingActions.request({
          body: dataForm,
          id: detailSurvey?.id,
          afterUpdate: () => {
            setIsVisibleModalSurveyClassInfo(false);
            setPage(1);
            handleGetList({
              isRefreshLoading: false,
              createdAtFrom: dateFilter[0].toISOString(),
              createdAtTo: dateFilter[1].toISOString(),
            });
          },
        }),
      );
    } else {
      dispatch(
        createDryDockingActions.request({
          ...dataForm,
          afterCreate: () => {
            setPage(1);
            setIsVisibleModalSurveyClassInfo(false);
            handleGetList({
              isRefreshLoading: false,
              createdAtFrom: dateFilter[0].toISOString(),
              createdAtTo: dateFilter[1].toISOString(),
            });
          },
        }),
      );
    }
  };
  const dataTable = useMemo(
    () =>
      listDryDocking?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        no: index + 1,
        eventType: item.eventType,
        plannedDate: item?.plannedDate
          ? formatDateTimeDay(item?.plannedDate)
          : DATA_SPACE,
        actualDateFrom: item?.actualDateFrom
          ? formatDateTimeDay(item?.actualDateFrom)
          : DATA_SPACE,
        actualDateTo: item?.actualDateTo
          ? formatDateTimeDay(item?.actualDateTo)
          : DATA_SPACE,
        portMasterId: item?.portMaster?.name || DATA_SPACE,
        remarks: item?.remarks ? `${item?.remarks?.substring(0, 20)}...` : '',
        status: item?.status,
        completedDate: item?.completedDate
          ? formatDateTimeDay(item?.completedDate)
          : DATA_SPACE,
        completionRemarks: item?.completionRemarks
          ? `${item?.completionRemarks?.substring(0, 20)}...`
          : '',
        attachments: item?.attachments,
        updatedAt: item?.updatedAt
          ? formatDateTime(item?.updatedAt)
          : DATA_SPACE,
        refId: item?.refId,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      })) || [],
    [listDryDocking?.data],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          let actions = handleActions(data);
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
        headerName: 'Event Type',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'plannedDate',
        headerName: t('plannedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actualDateFrom',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actualDateTo',
        headerName: t('actualDateTo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'portMasterId',
        headerName: t('portMasterId'),
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
        field: 'status',
        headerName: t('status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'completedDate',
        headerName: 'Completed Date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'completionRemarks',
        headerName: t('completionRemarks'),
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
                buttonType={ButtonType.Outline}
                className={styles.btnAttachment}
                onClick={() => {
                  if (data?.status === DryDockingStatus.CANCELLED) {
                    viewDetail(data?.id, data);
                  } else {
                    editDetail(data?.id, data);
                  }
                }}
              >
                Attachment
              </Button>
            );
          }
          return null;
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Last Updated Date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, handleActions, viewDetail, editDetail],
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
                setIsView(false);
                setIsEdit(false);
                setIsVisibleModalSurveyClassInfo(true);
              }}
              className={styles.btnAdd}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
            >
              Create New
            </Button>
          )
        }
      </PermissionCheck>
    ),
    [],
  );

  return (
    <div className={styles.wrapperContainer}>
      <AGGridModule
        loading={loading}
        title={t('dryDocking')}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={`${MODULE_TEMPLATE.dryDocking}__${vesselRequestId}`}
        fileName="SAIL Reporting_Dry Docking"
        dataTable={dataTable}
        height="calc(100vh - 312px)"
        view={(id, item) => {
          viewDetail(id, item);
          return true;
        }}
        getList={handleGetList}
        buttons={headButtons}
      />

      <ModalDryDocking
        data={detailSurvey}
        isOpen={isVisibleModalSurveyClassInfo}
        title="Dry Docking Information"
        toggle={() => {
          setDetailSurvey(null);
          setIsCreate(false);
          setIsEdit(false);
          setIsView(false);
          setIsVisibleModalSurveyClassInfo(false);
        }}
        onSubmit={handleSubmitForm}
        isEdit={isEdit}
        isCreate={isCreate}
        isView={isView}
      />
    </div>
  );
};

export default DryDocking;
