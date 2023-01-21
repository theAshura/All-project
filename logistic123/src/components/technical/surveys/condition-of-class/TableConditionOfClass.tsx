import { getListEventTypesActionsApi } from 'api/event-type.api';
import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { MODULE_TYPE } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { toastError } from 'helpers/notification.helper';
import {
  formatDateTime,
  formatDateTimeDay,
  setHeightTable,
} from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { EventType } from 'models/api/event-type/event-type.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  createConditionOfClassActions,
  deleteConditionOfClassActions,
  getConditionOfClassDetailActions,
  getListConditionOfClassActions,
  updateConditionOfClassActions,
} from 'store/condition-of-class/condition-of-class.action';
import styles from './condition-of-class.module.scss';
import ModalConditionOfClass from './forms/ConditionOfClassForm';

interface TableReferenceProps {
  references?: { referenceModule: string }[];
  setData?: (state: any) => void;
  loading?: boolean;
  className?: any;
  disabled?: boolean;
}

const TableConditionOfClass = ({ loading }: TableReferenceProps) => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { params, listConditionOfClass } = useSelector(
    (state) => state.conditionOfClass,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [page, setPage] = useState(params?.page || 1);
  const [pageSize, setPageSize] = useState(params?.pageSize || 5);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [content, setContent] = useState(params?.content || '');
  const [status, setStatus] = useState<string>(params?.status || '');
  const [sort, setSort] = useState<string>(params?.sort || '');
  const [detailConditionOfClass, setDetailConditionOfClass] = useState(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [idSelected, setIdSelectd] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const { id: vesselRequestId } = useParams<{ id: string }>();

  useEffect(() => {
    getListEventTypesActionsApi({
      pageSize: -1,
      status: 'active',
      module: MODULE_TYPE.CLASS_DISPENSATIONS,
    })
      .then((r) => {
        setEventTypes(r?.data?.data || []);
      })
      .catch((e) => toastError(e));
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListConditionOfClassActions.request({
          ...newParams,
          pageSize: -1,
          vesselId: vesselRequestId,
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  const handleSubmit = (formData) => {
    if (isCreate) {
      const { ...other } = formData;
      dispatch(
        createConditionOfClassActions.request({
          ...other,
          afterCreate: () => {
            setContent('');
            setPage(1);
            setPageSize(5);
            setStatus('');
            setSort('');
            handleGetList({
              page: 1,
              pageSize: -1,
              isRefreshLoading: false,
              status: '',
              content: '',
              sort: '',
            });
          },
        }),
      );
    } else {
      const { ...other } = formData;
      dispatch(
        updateConditionOfClassActions.request({
          id: idSelected,
          data: other,
          afterUpdate: () => {
            setContent('');
            setPage(1);
            setPageSize(5);
            setStatus('');
            setSort('');
            handleGetList({
              page: 1,
              pageSize: -1,
              isRefreshLoading: false,
              status: '',
              content: '',
              sort: '',
            });
          },
        }),
      );
    }
  };

  const viewDetail = useCallback(
    (id: string, data?: any) => {
      dispatch(getConditionOfClassDetailActions.request(id));
      setDetailConditionOfClass(data);
      setIdSelectd(id);
      setIsCreate(false);
      setIsEdit(false);
      setIsView(true);
      setVisibleModal(true);
    },
    [dispatch],
  );

  const editItem = useCallback(
    (id: string, data?: any) => {
      setDetailConditionOfClass(data);
      dispatch(getConditionOfClassDetailActions.request(id));
      setIdSelectd(id);
      setIsCreate(false);
      setIsEdit(true);
      setIsView(false);
      setVisibleModal(true);
    },
    [dispatch],
  );

  const handleDeleteCharterOwner = useCallback(
    (id: string) => {
      dispatch(
        deleteConditionOfClassActions.request({
          id,
          getListConditionOfClass: () => {
            if (page > 1 && listConditionOfClass?.data.length === 1) {
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
      listConditionOfClass?.data.length,
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
        onPressButtonRight: () => handleDeleteCharterOwner(id),
      });
    },
    [handleDeleteCharterOwner, t],
  );

  useEffect(() => {
    if (params && params?.isRefreshLoading) {
      // params?.isRefreshLoading = true  set state ve default
      setContent('');
      setPage(1);
      setPageSize(5);
      setStatus('');
      setSort('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const addReference = useCallback(() => {
    setDetailConditionOfClass(null);
    setIsEdit(false);
    setIsView(false);
    setVisibleModal(true);
    setIsCreate(true);
  }, []);

  const dataTable = useMemo(() => {
    if (!listConditionOfClass?.data) {
      return [];
    }
    return listConditionOfClass?.data?.map((item, index) => ({
      no: index + 1,
      eventType: item?.eventType?.name || DATA_SPACE,
      issueDate: item?.issueDate
        ? formatDateTimeDay(item?.issueDate)
        : DATA_SPACE,
      authority: item?.authority?.name || DATA_SPACE,
      expiryDate: item?.expiryDate
        ? formatDateTimeDay(item?.expiryDate)
        : DATA_SPACE,
      remarks: item?.remarks || DATA_SPACE,
      status: item?.status || DATA_SPACE,
      closureRemarks: item?.closureRemarks || DATA_SPACE,
      closeDate: item?.closedDate
        ? formatDateTimeDay(item?.closedDate)
        : DATA_SPACE,
      attachments: item?.attachments || [],
      updatedAt: item?.updatedAt ? formatDateTime(item?.updatedAt) : DATA_SPACE,
      id: item?.id,
      authorityId: item?.authorityId || DATA_SPACE,
      refId: item?.refId,
      vesselDocHolders: item?.vessel?.vesselDocHolders || [],
      vesselCharterers: item?.vessel?.vesselCharterers || [],
      vesselOwners: item?.vessel?.vesselOwners || [],
      createdAt: item?.createdAt,
    }));
  }, [listConditionOfClass?.data]);

  const checkWorkflow = useCallback(
    (item): Action[] => {
      const isCurrentDoc = checkDocHolderChartererVesselOwner(
        {
          vesselDocHolders: item?.vesselDocHolders,
          vesselCharterers: item?.vesselCharterers,
          vesselOwners: item?.vesselOwners,
          createdAt: item?.createdAt,
          entityType: item?.planningRequest?.entityType,
        },
        userInfo,
      );

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
        isCurrentDoc && {
          img: images.icons.icEdit,
          function: () => editItem(item?.id, item),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        isCurrentDoc && {
          img: images.icons.icRemove,
          function: () => handleDelete(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
        },
      ]?.filter((item) => item);
      return actions;
    },
    [editItem, handleDelete, userInfo, viewDetail],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('table.action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
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
        headerName: t('table.eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'issueDate',
        headerName: t('table.issueDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'authority',
        headerName: t('table.authority'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'expiryDate',
        headerName: t('table.expiryDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'remarks',
        headerName: t('table.remarks'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('table.status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'closureRemarks',
        headerName: t('table.closureRemarks'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'closeDate',
        headerName: t('table.closeDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'attachments',
        headerName: t('table.attachments'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => {
          if (data?.attachments?.length > 0) {
            return (
              <Button
                buttonType={ButtonType.Outline}
                className={styles.btnAttachment}
                onClick={(e) => {
                  e.stopPropagation();
                  editItem(data?.id, data);
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
        headerName: t('table.updatedAt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow, editItem],
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
              onClick={addReference}
              className={styles.btnAdd}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
            >
              {t('buttons.createNew')}
            </Button>
          )
        }
      </PermissionCheck>
    ),
    [addReference, t],
  );

  return (
    <div className={styles.wrapperContainer}>
      <AGGridModule
        loading={loading}
        title={t('conditionOfClassTitle')}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={null}
        pageSizeDefault={5}
        moduleTemplate={`${MODULE_TEMPLATE.conditionOfClass}__${vesselRequestId}`}
        fileName="SAIL Reporting_Condition of Class Dispensations"
        dataTable={dataTable}
        height={setHeightTable(listConditionOfClass?.totalItem || 0)}
        view={(params, item) => {
          viewDetail(params, item);
          return true;
        }}
        getList={handleGetList}
        buttons={headButtons}
      />

      <ModalConditionOfClass
        title={t('conditionClassDispensationInformation')}
        isOpen={visibleModal}
        toggle={() => {
          setDetailConditionOfClass(null);
          setVisibleModal((e) => !e);
          setIsCreate(false);
          setIsEdit(false);
        }}
        eventTypes={eventTypes || []}
        onSubmit={handleSubmit}
        isCreate={isCreate}
        isEdit={isEdit}
        isView={isView}
        setIsCreate={(value) => setIsCreate(value)}
        data={detailConditionOfClass}
      />
    </div>
  );
};

export default TableConditionOfClass;
