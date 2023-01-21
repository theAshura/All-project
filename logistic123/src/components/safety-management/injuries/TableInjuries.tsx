import { useCallback, useMemo, useState } from 'react';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATA_SPACE,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IncidentInvestigation } from 'models/api/incident-investigation/incident-investigation.model';
import {
  getListInjuryActions,
  deleteInjuryActions,
  getInjuryDetailActions,
  createInjuryActions,
  updateInjuryActions,
} from 'store/injury/injury.action';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import moment from 'moment';
import PermissionCheck from 'hoc/withPermissionCheck';
import { setHeightTable } from 'helpers/utils.helper';
import { useParams } from 'react-router';
import styles from './injuries.module.scss';
import ModalInjuries from './form/injuriesForm';

const ListInjiries = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, listInjury, params } = useSelector((state) => state.injury);
  const [page, setPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 5);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [idSelected, setIdSelectd] = useState<string>('');
  const [dataDetail, setDataDetail] = useState(null);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state) => state.authenticate);
  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListInjuryActions.request({
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
      dispatch(getInjuryDetailActions.request(id));
      setDataDetail(data);
      setIdSelectd(id);
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
          createInjuryActions.request({
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
          updateInjuryActions.request({
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
    [dispatch, handleGetList, idSelected, isCreate],
  );

  const addReference = useCallback(() => {
    setDataDetail(null);
    setIsEdit(false);
    setIsView(false);
    setVisibleModal(true);
    setIsCreate(true);
  }, []);

  const viewDetail = useCallback(
    (id?: string, data?: any) => {
      dispatch(getInjuryDetailActions.request(id));
      setDataDetail(data);
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
        deleteInjuryActions.request({
          id,
          handleSuccess: () => {
            if (page > 1 && listInjury?.data.length === 1) {
              setPage(page - 1);
              handleGetList({
                isRefreshLoading: false,
                page: page - 1,
                pageSize,
              });
            } else {
              handleGetList({
                isRefreshLoading: false,
                page,
                pageSize,
              });
            }
          },
        }),
      );
    },
    [dispatch, handleGetList, listInjury?.data.length, page, pageSize],
  );

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
    (item: IncidentInvestigation): Action[] => {
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
      listInjury?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        sno: index + 1 || DATA_SPACE,
        eventType: item?.injuryMaster?.name || DATA_SPACE,
        lti: item?.injuryMaster?.lti === true ? 'Yes' : 'No' || DATA_SPACE,
        eventTitle: item?.eventTitle || DATA_SPACE,
        dateOfInjuries:
          moment(item?.injuryDate).format('DD/MM/YYYY') || DATA_SPACE,
        deptOfInjuredPerson: item?.department?.name || DATA_SPACE,
        locationOfIncident: item?.location?.name || DATA_SPACE,
        injuriesBodyPart: item?.injuredBodyPart?.name || DATA_SPACE,
        causes: item?.causes || DATA_SPACE,
        countermeasures: item?.countermeasures || DATA_SPACE,
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
    [listInjury?.data],
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
        headerName: t('injuries.eventTypeTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'lti',
        headerName: t('injuries.lti'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eventTitle',
        headerName: t('injuries.eventTitleTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dateOfInjuries',
        headerName: t('injuries.dateOfInjuriesTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'deptOfInjuredPerson',
        headerName: t('injuries.deptOfInjuredPersonTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'locationOfIncident',
        headerName: t('injuries.locationOfIncidentTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'injuriesBodyPart',
        headerName: t('injuries.injuriesBodyPartTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'causes',
        headerName: t('injuries.causes'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'countermeasures',
        headerName: t('injuries.countermeasures'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'attachments',
        headerName: t('injuries.attachments'),
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
        headerName: t('injuries.updatedAt'),
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
          title={t('injuriesTitle')}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          columnDefs={columnDefs}
          dataFilter={null}
          pageSizeDefault={5}
          moduleTemplate={`${MODULE_TEMPLATE.sailReportInjuries}__${vesselRequestId}`}
          fileName="SAIL Reporting_Injuries"
          dataTable={dataTable}
          height={setHeightTable(listInjury?.totalItem || 0)}
          view={(id, item) => {
            viewDetail(id, item);
            return true;
          }}
          getList={handleGetList}
          buttons={headButtons}
        />
      </div>

      <ModalInjuries
        title={t('injuriesInformation')}
        isOpen={visibleModal}
        toggle={() => {
          setVisibleModal((e) => !e);
          setDataDetail(null);
          setIsCreate(false);
          setIsEdit(false);
          setIsView(false);
        }}
        onSubmit={handleSubmit}
        isCreate={isCreate}
        isEdit={isEdit}
        isView={isView}
        data={dataDetail}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

export default ListInjiries;
