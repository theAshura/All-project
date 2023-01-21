import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import ModalSurveyClassInfo from 'components/sail-general-report/form/survey-class-info';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DATA_SPACE,
  DATE_DEFAULT,
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';

import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  formatDateTime,
  formatDateTimeDay,
  setHeightTable,
} from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { CreateSurveyClassInfoParams } from 'models/api/survey-class-info/survey-class-info.model';
import { EventType } from 'models/api/event-type/event-type.model';
import { toastError } from 'helpers/notification.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_TYPE } from 'constants/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import {
  createSurveyClassInfoActions,
  deleteSurveyClassInfoActions,
  getDetailSurveyClassInfo,
  getListSurveyClassInfoActions,
  updateSurveyClassInfoActions,
} from 'store/survey-class-info/survey-class-info.action';
import { getListEventTypesActionsApi } from 'api/event-type.api';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useParams } from 'react-router';
import styles from './survey-class-info.module.scss';

const SurveyClassInfo = () => {
  const { t } = useTranslation(I18nNamespace.SURVEY_CLASS_INFO);
  const { loading, params, dataFilter, listSurveyClassInfo } = useSelector(
    (state) => state.surveyClassInfo,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isVisibleModalSurveyClassInfo, setIsVisibleModalSurveyClassInfo] =
    useState<boolean>(false);
  const [detailSurvey, setDetailSurvey] = useState(null);
  const [page, setPage] = useState(params.page || 1);
  const dispatch = useDispatch();
  const { id: vesselRequestId } = useParams<{ id: string }>();

  useEffect(() => {
    getListEventTypesActionsApi({
      pageSize: -1,
      status: 'active',
      module: MODULE_TYPE.SURVEY_CLASS_INFOR,
    })
      .then((r) => {
        setEventTypes(r?.data?.data);
      })
      .catch((e) => toastError(e));
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListSurveyClassInfoActions.request({
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
      dispatch(getDetailSurveyClassInfo.request(id));
    },
    [dispatch],
  );

  const viewDetail = useCallback(
    (id?: string, data?: any) => {
      setDetailSurvey(data);
      setIsEdit(false);
      setIsCreate(false);
      setIsView(true);
      dispatch(getDetailSurveyClassInfo.request(id));
      setIsVisibleModalSurveyClassInfo(true);
      return true;
    },
    [dispatch],
  );

  const handleDeleteStandardMaster = useCallback(
    (id: string) => {
      dispatch(
        deleteSurveyClassInfoActions.request({
          id,
          afterDelete: () => {
            if (page > 1 && listSurveyClassInfo?.data.length === 1) {
              setPage(page - 1);
              handleGetList({
                createdAtFrom:
                  params?.createdAtFrom || DATE_DEFAULT[0].toISOString(),
                createdAtTo:
                  params?.createdAtTo || DATE_DEFAULT[1].toISOString(),
                isRefreshLoading: false,
              });
            } else {
              handleGetList({
                createdAtFrom:
                  params?.createdAtFrom || DATE_DEFAULT[0].toISOString(),
                createdAtTo:
                  params?.createdAtTo || DATE_DEFAULT[1].toISOString(),
                isRefreshLoading: false,
              });
            }
          },
        }),
      );
    },
    [
      dispatch,
      handleGetList,
      listSurveyClassInfo?.data.length,
      page,
      params?.createdAtFrom,
      params?.createdAtTo,
    ],
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

  const handleSubmitForm = (dataForm: CreateSurveyClassInfoParams) => {
    if (isEdit) {
      dispatch(
        updateSurveyClassInfoActions.request({
          body: dataForm,
          id: detailSurvey?.id,
          afterUpdate: () => {
            setIsVisibleModalSurveyClassInfo(false);
            setPage(1);
            handleGetList({
              isRefreshLoading: false,
              createdAtFrom:
                params?.createdAtFrom || DATE_DEFAULT[0].toISOString(),
              createdAtTo: params?.createdAtTo || DATE_DEFAULT[1].toISOString(),
            });
          },
        }),
      );
    } else {
      dispatch(
        createSurveyClassInfoActions.request({
          ...dataForm,
          afterCreate: () => {
            setPage(1);
            setIsVisibleModalSurveyClassInfo(false);
            handleGetList({
              isRefreshLoading: false,
              createdAtFrom:
                params?.createdAtFrom || DATE_DEFAULT[0].toISOString(),
              createdAtTo: params?.createdAtTo || DATE_DEFAULT[1].toISOString(),
            });
          },
        }),
      );
    }
  };

  const dataTable = useMemo(
    () =>
      listSurveyClassInfo?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        no: index + 1,
        eventType: item.eventType?.name,
        issueDate: item?.issueDate
          ? formatDateTimeDay(item?.issueDate)
          : DATA_SPACE,
        authority: item?.authority?.name || DATA_SPACE,
        anyExpiredCertificates: item?.anyExpiredCertificates ? 'Yes' : 'No',
        remarks: item?.remarks ?? '',
        anyOpenCOC: item?.anyOpenCOC ? 'Yes' : 'No',
        cocRemarks: item?.cocRemarks ?? '',
        attachments: item?.attachments,
        updatedAt: item?.updatedAt
          ? formatDateTime(item?.updatedAt)
          : DATA_SPACE,
        refID: item?.refId,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      })) || [],
    [listSurveyClassInfo?.data],
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
        field: 'refID',
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
        field: 'issueDate',
        headerName: t('issueDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'authority',
        headerName: t('authority'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'anyExpiredCertificates',
        headerName: t('anyExpiredCertificates'),
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
        field: 'anyOpenCOC',
        headerName: t('anyOpenCOC'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'cocRemarks',
        headerName: t('cocRemarks'),
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
        headerName: t('updatedAt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
  );

  const buttonHeader = useMemo(
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
            <div className="pt10">
              <Button
                onClick={() => {
                  setIsCreate(true);
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
                {t('buttons.createNew')}
              </Button>
            </div>
          )
        }
      </PermissionCheck>
    ),
    [t],
  );

  return (
    <div className={styles.wrapperContainer}>
      <AGGridModule
        loading={loading}
        params={params}
        pageSizeDefault={5}
        buttons={buttonHeader}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={dataFilter}
        moduleTemplate={`${MODULE_TEMPLATE.surveyClassInfo}__${vesselRequestId}`}
        fileName="SAIL Reporting_Survey Class Info"
        title={t('surveys')}
        colDefProp={DEFAULT_COL_DEF}
        dataTable={dataTable}
        height={setHeightTable(listSurveyClassInfo?.totalItem || 0)}
        view={viewDetail}
        getList={handleGetList}
      />
      <ModalSurveyClassInfo
        data={detailSurvey}
        eventTypes={eventTypes}
        isOpen={isVisibleModalSurveyClassInfo}
        title="Survey/Class Info Information"
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
        defaultValueEventType="Class Info"
      />
    </div>
  );
};

export default SurveyClassInfo;
