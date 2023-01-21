import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
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
import { Sms } from 'models/api/sms/sms.model';
import { Action, CommonApiParam } from 'models/common.model';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import {
  createSmsActions,
  deleteSmsActions,
  getListSmsActions,
  getSmsDetailActions,
  updateSmsActions,
} from 'store/sms/sms.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import { setHeightTable } from 'helpers/utils.helper';
import { useParams } from 'react-router';
import ModalSms from './form/SmsForm';
import styles from './sms.module.scss';

const ListSmsContainer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, listSms, params, dataFilter } = useSelector(
    (state) => state.smsRecord,
  );
  const [, setPage] = useState(params.page || 1);
  const [, setPageSize] = useState(params.pageSize || 5);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [dateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [idSelected, setIdSelectd] = useState<string>('');
  const [dataDetailSms, setDataDetailSms] = useState<Sms>(null);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state) => state.authenticate);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListSmsActions.request({
          ...newParams,
          pageSize: -1,
          vesselId: vesselRequestId,
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  const editDetail = useCallback(
    (id?: string, data?: Sms) => {
      dispatch(getSmsDetailActions.request(id));
      setIdSelectd(id);
      setDataDetailSms(data);
      setIsCreate(false);
      setIsEdit(true);
      setIsView(false);
      setVisibleModal(true);
    },
    [dispatch],
  );

  const handleSubmit = useCallback(
    (formData) => {
      if (isCreate) {
        const { ...other } = formData;
        dispatch(
          createSmsActions.request({
            ...other,
            afterCreate: () => {
              setPage(1);
              setPageSize(5);
              handleGetList({
                page: 1,
                pageSize: -1,
                isRefreshLoading: false,
              });
            },
          }),
        );
      } else {
        const { ...other } = formData;
        dispatch(
          updateSmsActions.request({
            id: idSelected,
            data: other,
            afterUpdate: () => {
              setPage(1);
              setPageSize(5);
              handleGetList({
                page: 1,
                pageSize: -1,
                isRefreshLoading: false,
              });
            },
          }),
        );
      }
    },
    [dispatch, handleGetList, idSelected, isCreate, setPageSize],
  );

  const addReference = useCallback(() => {
    setIsEdit(false);
    setIsView(false);
    setVisibleModal(true);
    setIsCreate(true);
    setDataDetailSms(null);
  }, []);

  const viewDetail = useCallback(
    (id?: string, data?: Sms) => {
      dispatch(getSmsDetailActions.request(id));
      setDataDetailSms(data);
      setIsCreate(false);
      setIdSelectd(id);
      setIsEdit(false);
      setIsView(true);
      setVisibleModal(true);
    },
    [dispatch],
  );

  const handleDeleteIncidentInvestigation = useCallback(
    (id: string) => {
      dispatch(
        deleteSmsActions.request({
          id,
          handleSuccess: () => {
            handleGetList({
              createdAtFrom: dateFilter[0].toISOString(),
              createdAtTo: dateFilter[1].toISOString(),
            });
          },
        }),
      );
    },
    [dateFilter, dispatch, handleGetList],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: 'Confirmation?',
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteIncidentInvestigation(id),
      });
    },
    [handleDeleteIncidentInvestigation, t],
  );

  const checkWorkflow = useCallback(
    (item: Sms): Action[] => {
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
          function: () => viewDetail(item?.id, item),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        isCurrentDocChartererVesselOwner && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id, item),
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
    [userInfo, viewDetail, editDetail, handleDelete],
  );

  const dataTable = useMemo(
    () =>
      listSms?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        sno: index + 1 || DATA_SPACE,
        eventType: item?.eventType?.name || DATA_SPACE,
        recordDate: moment(item?.recordDate).format('DD/MM/YYYY') || DATA_SPACE,
        anySpecialPointsToNote: item?.techIssueNote?.name || DATA_SPACE,
        pendingAction: item?.pendingAction || DATA_SPACE,
        actionRemarks: item?.actionRemarks || DATA_SPACE,
        targetCloseDate:
          moment(item?.targetCloseDate).format('DD/MM/YYYY') || DATA_SPACE,
        actionStatus: item?.actionStatus || DATA_SPACE,
        actualCloseDate:
          moment(item?.actualCloseDate).format('DD/MM/YYYY') || DATA_SPACE,
        closureRemarks: item?.closureRemarks || DATA_SPACE,
        initialAttachments: item?.initialAttachments || [],
        attachments: item?.attachments || [],
        updatedAt:
          moment(item?.updatedAt).format('DD/MM/YYYY') ||
          DATA_SPACE ||
          DATA_SPACE,
        refId: item?.refId,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      })) || [],
    [listSms?.data],
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
        headerName: t('sms.eventTypeTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'recordDate',
        headerName: t('sms.recordDateTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'anySpecialPointsToNote',
        headerName: t('sms.anySpecialPointsToNoteTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'pendingAction',
        headerName: t('sms.pendingActionTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actionRemarks',
        headerName: t('sms.actionRemarksTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'targetCloseDate',
        headerName: t('sms.targetCloseDateTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actionStatus',
        headerName: t('sms.actionStatusTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'actualCloseDate',
        headerName: t('sms.actualCloseDateTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'closureRemarks',
        headerName: t('sms.closureRemarksTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'attachments',
        headerName: t('sms.attachments'),
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
                  editDetail(data?.id, data);
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
        headerName: t('sms.updatedAt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow, editDetail],
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
    <div className={styles.wrapper}>
      <div className={styles.wrapTable}>
        <AGGridModule
          loading={loading}
          title={t('sms.smsTitle')}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={`${MODULE_TEMPLATE.sailReportOtherSMSRecords}__${vesselRequestId}`}
          fileName="SAIL Reporting_Other SMS Records"
          dataTable={dataTable}
          pageSizeDefault={5}
          height={setHeightTable(listSms?.totalItem || 0)}
          view={(id, item) => {
            viewDetail(id, item);
            return true;
          }}
          getList={handleGetList}
          buttons={headButtons}
        />
      </div>

      <ModalSms
        title={t('sms.smsInformation')}
        isOpen={visibleModal}
        toggle={() => {
          setDataDetailSms(null);
          setVisibleModal((e) => !e);
          setIsCreate(false);
          setIsEdit(false);
          setIsView(false);
        }}
        onSubmit={handleSubmit}
        isCreate={isCreate}
        isEdit={isEdit}
        isView={isView}
        data={dataDetailSms}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

export default ListSmsContainer;
