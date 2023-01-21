import images from 'assets/images/images';
import cx from 'classnames';
import maxBy from 'lodash/maxBy';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import commonStyles from 'components/list-common.module.scss';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  RISK_CELL_IDS,
  RISK_LEVEL_OPTIONS,
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
  TIMELOSS_LABEL_TO_VALUE,
  TIMELOSS_OPTIONS,
  TIMELOSS_VALUE_TO_LABEL,
} from 'pages/vessel-screening/utils/constant';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import isNil from 'lodash/isNil';
import RiskPotentialCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-potential-cell-render';
import RiskObservedCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-observed-cell-render';
import RiskTimelossCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-timeloss-cell-render';
import PermissionCheck from 'hoc/withPermissionCheck';
import { ActivePermission, CompanyLevelEnum } from 'constants/common.const';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import { IncidentsStatuses } from 'constants/components/incidents.const';
import styles from './list.module.scss';
import {
  deleteIncidentsActions,
  getListIncidentActions,
  updateIncidentsActions,
} from './store/action';
import ModalRemark from './common/ModalRemark';
import {
  CreateIncidentParams,
  IncidentDetail,
} from './utils/models/common.model';

const ListIncident = () => {
  const { t } = useTranslation([I18nNamespace.INCIDENTS, I18nNamespace.COMMON]);
  const dispatch = useDispatch();
  const { listIncident } = useSelector((state) => state.incidents);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const [selected, setSelected] = useState<IncidentDetail>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const getList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListIncidentActions.request({ ...newParams, pageSize: -1 }));
    },
    [dispatch],
  );

  const viewDetail = useCallback((id?: string, isNewTab?: boolean) => {
    if (isNewTab) {
      const win = window.open(
        `${AppRouteConst.getIncidentsById(id)}`,
        '_blank',
      );
      win.focus();
    } else {
      history.push(`${AppRouteConst.getIncidentsById(id)}`);
    }
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getIncidentsById(id)}?status=edit`);
  }, []);

  const deleteRecord = useCallback(
    (idRecord?: string) => {
      dispatch(
        deleteIncidentsActions.request({
          id: idRecord,
          handleSuccess: () => {
            getList();
          },
        }),
      );
    },
    [dispatch, getList],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => deleteRecord(id),
      });
    },
    [deleteRecord, t],
  );

  const addComment = useCallback(
    (index?: number) => {
      setIsVisibleComment(true);
      setSelected(listIncident?.data?.[index]);
    },
    [listIncident?.data],
  );

  const handleSubmit = useCallback(
    (newData, selected, successCb?: any) => {
      if (selected) {
        const { incidentInvestigationReviews } = selected;
        const reviews = incidentInvestigationReviews?.map((item) => ({
          id: item.id,
          remark: item.remark,
          riskFactorId: item.riskFactorId,
          vesselAcceptable: item.vesselAcceptable,
          incidentStatus: item.incidentStatus,
          attachments: item.attachments || [],
        }));
        const params: CreateIncidentParams = {
          vesselId: selected.vesselId,
          description: selected?.description,
          title: selected?.title,
          voyageNo: selected?.voyageNo,
          totalNumberOfCrew: selected?.totalNumberOfCrew,
          dateTimeOfIncident: selected?.dateTimeOfIncident,
          typeIds: selected?.typeIncidents?.map((item) => item?.id),
          typeOfLoss: selected?.typeOfLoss,
          otherType: selected?.otherType,
          atPort: selected?.atPort,
          portId: selected?.portId,
          portToId: selected?.portToId,
          latitude: selected?.latitude,
          longitude: selected?.longitude,
          immediateDirectCause: selected?.immediateDirectCause,
          basicUnderlyingCauses: selected?.basicUnderlyingCauses,
          rootCause: selected?.rootCause,
          contributionFactor: selected?.contributionFactor,
          nonContributionFactor: selected?.nonContributionFactor,
          immediateAction: selected?.immediateAction,
          preventiveAction: selected?.preventiveAction,
          correctionAction: selected?.correctionAction,
          actionControlNeeds: selected?.actionControlNeeds,
          comments: selected?.incidentInvestigationComments?.length
            ? selected?.incidentInvestigationComments
            : null,
          reviews,
          potentialRisk: selected?.potentialRisk,
          observedRisk: selected?.observedRisk,
          timeLoss: selected?.timeLoss,
          observedScore: selected?.observedScore,
          potentialScore: selected?.potentialScore,
          remarks: selected?.incidentInvestigationRemarks ?? [],
          reviewStatus: selected?.reviewStatus,
          ...newData,
        };
        dispatch(
          updateIncidentsActions.request({
            id: selected?.id,
            data: params,
            handleSuccess: () => {
              successCb?.();
              getList();
            },
          }),
        );
      }
    },
    [dispatch, getList],
  );

  const handleSubmitRemark = useCallback(
    (value: { remark: string }) => {
      handleSubmit(
        {
          remarks: [
            { remark: value?.remark },
            ...(selected?.incidentInvestigationRemarks ?? []),
          ],
        },
        selected,
        () => {
          setIsVisibleComment(false);
        },
      );
    },
    [handleSubmit, selected],
  );

  const dataTable = useMemo(() => {
    if (!listIncident?.data) {
      return [];
    }

    return listIncident?.data?.map((item, index) => {
      const typeIncidents = item?.typeIncidents?.map((item) => item?.name);
      if (item?.otherType || item?.typeIncidents?.length === 0) {
        typeIncidents.push('Other');
      }
      const remarks = maxBy(
        item?.incidentInvestigationRemarks || [],
        (item) => {
          if (item?.createdAt) {
            return moment(item?.createdAt);
          }
          return null;
        },
      );

      return {
        id: item.id || DATA_SPACE,
        refId: item.refId || DATA_SPACE,
        incidentDate:
          moment(item?.dateTimeOfIncident).format('DD/MM/YYYY') || DATA_SPACE,
        incidentTitle: item?.title || DATA_SPACE,
        cimo: item?.company?.companyIMO,
        vessel: item?.vessel?.name || DATA_SPACE,
        imoNumber: item?.vessel?.imoNumber || DATA_SPACE,
        reportDate:
          moment(item?.dateTimeOfIncident).format('DD/MM/YYYY') || DATA_SPACE,
        typeOfIncident: typeIncidents?.join(', ') || DATA_SPACE,
        company: item?.company?.name,
        reviewStatus: item?.reviewStatus,
        description: item?.description,
        potentialRisk: RISK_VALUE_TO_LEVEL[item?.potentialRisk] ?? null,
        observedRisk: RISK_VALUE_TO_LEVEL[item?.observedRisk] ?? null,
        timeLoss: isNil(item?.timeLoss)
          ? DATA_SPACE
          : TIMELOSS_VALUE_TO_LABEL[item?.timeLoss?.toString()],
        remark: remarks?.remark || DATA_SPACE,
        createdDate: moment(item?.createdAt).format('DD/MM/YYYY') || DATA_SPACE,
        createdByUser: item?.createdUser?.username || DATA_SPACE,
        updatedDate: moment(item?.updatedAt).format('DD/MM/YYYY') || DATA_SPACE,
        updatedByUser: item?.updatedUser?.username || DATA_SPACE,
        isEdit: true,
        index,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
        createdUserId: item?.createdUserId,
        userAssignments: item?.userAssignments,
      };
    });
  }, [listIncident?.data]);

  const checkEditPermission = useCallback(
    (data) => {
      const reviewerAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        data?.userAssignments,
      );
      const creatorAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.CREATOR,
        data?.userAssignments,
      );
      const isCreator = data?.createdUserId === userInfo?.id;

      const isCurrentDocChartererVesselOwner =
        checkDocHolderChartererVesselOwner(
          {
            vesselDocHolders: data?.vesselDocHolders,
            vesselCharterers: data?.vesselCharterers,
            vesselOwners: data?.vesselOwners,
            createdAt: data?.createdAt,
          },
          userInfo,
        );

      const draftCase =
        (isCreator || creatorAssignmentPermission) &&
        data?.status === IncidentsStatuses.Draft;
      const sumittedCase =
        reviewerAssignmentPermission &&
        data?.status === IncidentsStatuses.Submitted;

      if (
        (draftCase || sumittedCase || isCreator) &&
        isCurrentDocChartererVesselOwner
      ) {
        return true;
      }
      return false;
    },
    [userInfo],
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
        minWidth: 150,
        maxWidth: 150,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          const isCurrentDocChartererVesselOwner =
            checkDocHolderChartererVesselOwner(
              {
                vesselDocHolders: data?.vesselDocHolders,
                vesselCharterers: data?.vesselCharterers,
                vesselOwners: data?.vesselOwners,
                createdAt: data?.createdAt,
              },
              userInfo,
            );
          const isCreator = data?.createdUserId === userInfo?.id;

          const allowEdit = checkEditPermission(data);

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.INCIDENTS,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            allowEdit && {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.INCIDENTS,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'me-1',
            },
            ((isCreator && isCurrentDocChartererVesselOwner) ||
              userInfo?.companyLevel === CompanyLevelEnum.MAIN_COMPANY) && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.INCIDENTS,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'me-1',
            },
            {
              img: images.icons.table.icNewTab,
              function: () => viewDetail(data?.id, true),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.INCIDENTS,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Green,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icComment,
              function: () => addComment(data?.index),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.INCIDENTS,
              action: ActionTypeEnum.UPDATE,
              buttonType: ButtonType.Green,
            },
          ]?.filter((item) => item);

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
        field: 'vessel',
        headerName: t('table.vessel'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'imoNumber',
        headerName: t('table.imoNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'company',
        headerName: t('table.company'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'cimo',
        headerName: t('table.cimo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'incidentDate',
        headerName: t('table.incidentDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'potentialRisk',
        headerName: 'Potential Risk',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        minWidth: 200,
        singleClickEdit: true,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        editable: true,
        cellEditorParams: {
          values: RISK_LEVEL_OPTIONS,
        },
        cellRendererFramework: RiskPotentialCellRender,
        onCellValueChanged: ({ data }) => {
          const item = listIncident?.data?.find((i) => i?.id === data?.id);
          setSelected(item);
          handleSubmit(
            {
              potentialRisk: RISK_LEVEL_TO_VALUE[data?.potentialRisk] ?? null,
              potentialScore: RISK_LEVEL_TO_SCORE[data?.potentialRisk] ?? null,
            },
            item,
          );
        },
      },
      {
        field: 'observedRisk',
        headerName: 'Observed Risk',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        minWidth: 200,
        singleClickEdit: true,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        editable: true,
        cellEditorParams: {
          values: RISK_LEVEL_OPTIONS,
        },
        cellRendererFramework: RiskObservedCellRender,
        onCellValueChanged: ({ data }) => {
          const item = listIncident?.data?.find((i) => i?.id === data?.id);
          setSelected(item);
          handleSubmit(
            {
              observedRisk: RISK_LEVEL_TO_VALUE[data?.observedRisk] ?? null,
              observedScore: RISK_LEVEL_TO_SCORE[data?.observedRisk] ?? null,
            },
            item,
          );
        },
      },
      {
        field: 'timeLoss',
        headerName: 'Time Loss',
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        singleClickEdit: true,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        editable: true,
        cellEditorParams: {
          values: TIMELOSS_OPTIONS,
        },
        cellRendererFramework: RiskTimelossCellRender,
        onCellValueChanged: ({ data }) => {
          const item = listIncident?.data?.find((i) => i?.id === data?.id);
          setSelected(item);
          handleSubmit(
            { timeLoss: TIMELOSS_LABEL_TO_VALUE[data.timeLoss] ?? null },
            item,
          );
        },
      },

      {
        field: 'typeOfIncident',
        headerName: t('table.typeOfIncident'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'description',
        headerName: t('table.description'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'remark',
        headerName: t('table.remark'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'reviewStatus',
        headerName: t('table.reviewStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'createdDate',
        headerName: t('table.createdDate'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdByUser',
        headerName: t('table.createdByUser'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: t('table.updatedDate'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedByUser',
        headerName: t('table.updatedByUser'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      addComment,
      checkEditPermission,
      editDetail,
      handleDelete,
      handleSubmit,
      isMultiColumnFilter,
      listIncident?.data,
      t,
      userInfo,
      viewDetail,
    ],
  );

  return (
    <div className={commonStyles.wrapper}>
      <HeaderPage breadCrumb={BREAD_CRUMB.INCIDENTS} titlePage={t('incidents')}>
        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.INCIDENTS,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  history.push(AppRouteConst.INCIDENTS_CREATE);
                }}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className="ps-2"
                  />
                }
                className={styles.btnCreate}
              >
                {t('buttons.createNew')}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>
      <AGGridModule
        loading={false}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.incidentsTemplate}
        fileName="Incidents"
        dataTable={dataTable}
        height="calc(100vh - 210px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={getList}
        classNameHeader={styles.header}
        preventRowEventWhenClickOn={RISK_CELL_IDS}
      />
      <ModalRemark
        isOpen={isVisibleComment}
        toggle={() => {
          setIsVisibleComment((e) => !e);
          setSelected(null);
        }}
        data={null}
        handleSubmitForm={handleSubmitRemark}
        index={0}
      />
    </div>
  );
};

export default ListIncident;
