import { useCallback, useMemo, useState } from 'react';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATA_SPACE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import images from 'assets/images/images';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { OtherTechnicalRecords } from 'models/api/other-technical-records/other-technical-records.model';

import {
  deleteOtherTechnicalRecordsActions,
  getListOtherTechnicalRecordsActions,
  createOtherTechnicalRecordsActions,
  updateOtherTechnicalRecordsActions,
} from 'store/other-technical-records/other-technical-records.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import PermissionCheck from 'hoc/withPermissionCheck';
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
} from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { useParams } from 'react-router';
import styles from '../maintenance-technical.module.scss';
import ModalOtherTechnicalRecords from '../components/ModalOtherTechnicalRecords';

export interface OtherTechnicalRecordsExtend extends OtherTechnicalRecords {
  index: number;
}

const OtherRecordContainer = () => {
  const { t } = useTranslation(I18nNamespace.MAINTENANCE_TECHNICAL);

  const dispatch = useDispatch();
  const { loading, listOtherTechnicalRecords, params, dataFilter } =
    useSelector((state) => state.otherTechnicalRecords);
  const [page, setPage] = useState(params.page || 1);
  const [pageSize] = useState(params.pageSize || 5);
  const [content] = useState(params.content || '');
  const [status] = useState<string>(params?.status || 'all');
  const [sort] = useState<string>(params.sort || '');
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [selected, setSelected] = useState<OtherTechnicalRecordsExtend>(null);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const { userInfo } = useSelector((state) => state.authenticate);
  const viewDetail = useCallback(
    (id: string) => {
      setIsCreate(false);
      setIsEdit(false);
      setIsView(true);
      setIsVisibleModal(true);
      const index = listOtherTechnicalRecords?.data?.findIndex(
        (item) => item?.id === id,
      );
      setSelected({ ...listOtherTechnicalRecords?.data[index], index });
    },
    [listOtherTechnicalRecords?.data],
  );

  const editDetail = useCallback(
    (id: string) => {
      setIsCreate(false);
      setIsEdit(true);
      setIsView(false);
      setIsVisibleModal(true);
      const index = listOtherTechnicalRecords?.data?.findIndex(
        (item) => item?.id === id,
      );
      setSelected({ ...listOtherTechnicalRecords?.data[index], index });
    },
    [listOtherTechnicalRecords?.data],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListOtherTechnicalRecordsActions.request({
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
        deleteOtherTechnicalRecordsActions.request({
          id,
          handleSuccess: () => {
            if (page > 1 && listOtherTechnicalRecords?.data?.length === 1) {
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
      listOtherTechnicalRecords,
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
      listOtherTechnicalRecords?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        no: index + 1 || DATA_SPACE,
        eventType: item?.eventType?.name || DATA_SPACE,
        recordDate: item?.recordDate
          ? formatDateTime(item?.recordDate)
          : DATA_SPACE,
        initialAttachments: item.initialAttachments,
        anySpecialPointsToNote: item?.techIssueNote?.name || DATA_SPACE,
        pendingAction: item?.pendingAction || DATA_SPACE,
        actionRemarks: item?.actionRemarks || DATA_SPACE,
        targetCloseDate: item?.targetCloseDate
          ? formatDateTime(item?.targetCloseDate)
          : DATA_SPACE,
        actionStatus: item?.actionStatus || DATA_SPACE,
        actualCloseDate: item?.actualCloseDate
          ? formatDateTime(item?.actualCloseDate)
          : DATA_SPACE,
        closureRemarks: item?.closureRemarks || DATA_SPACE,
        attachments: item?.attachments || DATA_SPACE,
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
    [listOtherTechnicalRecords?.data],
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
        field: 'initialAttachments',
        headerName: t('initialAttachments'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => {
          if (data?.initialAttachments?.length > 0) {
            return (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  editDetail(data?.id);
                }}
                buttonType={ButtonType.Outline}
                className={styles.btnAttachment}
              >
                Init Attachment
              </Button>
            );
          }
          return null;
        },
      },
      {
        field: 'anySpecialPointsToNote',
        headerName: t('anySpecialPointsToNote'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'pendingAction',
        headerName: t('pendingAction'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actionRemarks',
        headerName: t('actionRemarks'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'targetCloseDate',
        headerName: t('targetCloseDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actionStatus',
        headerName: t('actionStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'actualCloseDate',
        headerName: t('actualCloseDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'closureRemarks',
        headerName: t('closureRemarks'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
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
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow, editDetail],
  );

  const handleSubmit = useCallback(
    (dataForm, isCreate: boolean) => {
      if (isCreate) {
        dispatch(
          createOtherTechnicalRecordsActions.request({
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
          updateOtherTechnicalRecordsActions.request({
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
            <div className="pt2">
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
            </div>
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
        title={t('otherTechnicalRecord')}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={null}
        pageSizeDefault={5}
        moduleTemplate={`${MODULE_TEMPLATE.otherRecord}__${vesselRequestId}`}
        fileName="SAIL Reporting_Other Technical Record"
        dataTable={dataTable}
        height={setHeightTable(listOtherTechnicalRecords?.totalItem || 0)}
        view={(id) => {
          viewDetail(id);
          return true;
        }}
        getList={handleGetList}
        buttons={headButtons}
      />

      <ModalOtherTechnicalRecords
        data={selected}
        isOpen={isVisibleModal}
        title={t('otherTechnicalRecordInformation')}
        toggle={() => {
          setSelected(null);
          setIsCreate(false);
          setIsEdit(false);
          setIsView(false);
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

export default OtherRecordContainer;
