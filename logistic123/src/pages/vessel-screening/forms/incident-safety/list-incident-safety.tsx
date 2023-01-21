import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF,
  DATA_SPACE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { useLocation, useParams } from 'react-router';
import moment from 'moment';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';

import maxBy from 'lodash/maxBy';
import {
  getListIncidentActions,
  updateIncidentsActions,
} from 'pages/incidents/store/action';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { IncidentDetail } from 'pages/incidents/utils/models/common.model';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import { IncidentsStatuses } from 'constants/components/incidents.const';
import {
  OBJECT_REFERENCE,
  RISK_CELL_IDS,
  RISK_LEVEL_OPTIONS,
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
  TAB_REFERENCE,
  TIMELOSS_LABEL_TO_VALUE,
  TIMELOSS_OPTIONS,
  TIMELOSS_VALUE_TO_LABEL,
} from 'pages/vessel-screening/utils/constant';
import isNil from 'lodash/isNil';
import RiskPotentialCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-potential-cell-render';
import RiskObservedCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-observed-cell-render';
import RiskTimelossCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-timeloss-cell-render';
import { ModalFeedbackAndRemarks } from '../../components/ModalFeedbackAndRemarks';
import styles from './list-incident-safety.module.scss';

interface IProps {
  getObjectReview: () => void;
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListIncidentSafety = ({
  getObjectReview,
  onObjectReviewFieldChange,
}: IProps) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { isEditVessel } = useContext(VesselScreeningContext);
  const { pathname } = useLocation();
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);
  const dispatch = useDispatch();
  const { loading, listIncident, params, dataFilter } = useSelector(
    (state) => state.incidents,
  );
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [selected, setSelected] = useState<IncidentDetail>(null);

  const viewDetail = useCallback(
    (id: string, requestId?: string) => {
      let url = `${AppRouteConst.getVesselScreeningIncidentSafetyById(
        vesselScreeningId,
        editMode ? 'edit' : 'detail',
      )}?recordStatus=detail&recordId=${id}`;

      if (requestId) {
        url += `&requestId=${requestId}`;
      }
      const win = window.open(url, '_blank');
      win.focus();
      return true;
    },
    [editMode, vesselScreeningId],
  );

  const editDetail = useCallback(
    (id: string, requestId?: string) => {
      let url = `${AppRouteConst.getVesselScreeningIncidentSafetyById(
        vesselScreeningId,
        editMode ? 'edit' : 'detail',
      )}?recordStatus=edit&recordId=${id}`;

      if (requestId) {
        url += `&requestId=${requestId}`;
      }
      const win = window.open(url, '_blank');
      win.focus();
    },
    [editMode, vesselScreeningId],
  );

  const addComment = useCallback(
    (id: string) => {
      const selected = listIncident?.data?.find((el) => el.id === id);
      setSelected(selected);
      setIsVisibleComment(true);
    },
    [listIncident?.data, setIsVisibleComment, setSelected],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);

      if (vesselScreeningDetail?.vesselId) {
        dispatch(
          getListIncidentActions.request({
            vesselId: vesselScreeningDetail?.vesselId,
            filterRisk: newParams?.filterRisk || 'potential',
            ...newParams,
            incidentStatus: IncidentsStatuses.Reviewed,
            pageSize: -1,
          }),
        );
      }
    },
    [dispatch, vesselScreeningDetail],
  );

  useEffect(() => {
    if (!listIncident) {
      handleGetList();
    }
  }, [listIncident, handleGetList]);

  const handleSubmit = useCallback(
    (newData, selected, successCb?: any) => {
      const { incidentInvestigationReviews } = selected;
      const reviews = incidentInvestigationReviews?.map((item) => ({
        id: item.id,
        remark: item.remark,
        riskFactorId: item.riskFactorId,
        vesselAcceptable: item.vesselAcceptable,
        incidentStatus: item.incidentStatus,
        attachments: item.attachments || [],
      }));
      const params = {
        incidentId: selected?.id,
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
        reviews,
        potentialRisk: selected?.potentialRisk,
        observedRisk: selected?.observedRisk,
        observedScore: selected?.observedScore,
        potentialScore: selected?.potentialScore,
        timeLoss: selected?.timeLoss,
        comments: selected?.incidentInvestigationComments?.length
          ? selected?.incidentInvestigationComments
          : null,
        reviewStatus: selected?.reviewStatus,
        ...newData,
      };

      dispatch(
        updateIncidentsActions.request({
          id: selected?.id,
          data: {
            ...params,
          },
          handleSuccess: () => {
            getObjectReview?.();
            setIsVisibleComment(false);
            setSelected(null);
            history.push(
              `${AppRouteConst.VESSEL_SCREENING}/${
                editMode ? 'edit' : 'detail'
              }/${vesselScreeningId}?tab=safety-management&subTab=incident`,
            );
            successCb?.();
            handleGetList({
              isRefreshLoading: false,
              createdAtFrom:
                params?.createdAtFrom || DATE_DEFAULT[0].toISOString(),
              createdAtTo: params?.createdAtTo || DATE_DEFAULT[1].toISOString(),
            });
          },
        }),
      );
    },
    [dispatch, editMode, getObjectReview, handleGetList, vesselScreeningId],
  );

  const handleSubmitComment = useCallback(
    (remark) => {
      handleSubmit(
        {
          remarks: [remark, ...(selected?.incidentInvestigationRemarks ?? [])],
        },
        selected,
      );
    },
    [handleSubmit, selected],
  );

  const checkWorkflow = useCallback(
    (item): Action[] => {
      let actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
      ];

      if (isEditVessel) {
        const extraActions = [
          {
            img: images.icons.icEdit,
            function: () => editDetail(item?.id),
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.VESSEL_SCREENING,
            action: ActionTypeEnum.UPDATE,
            cssClass: 'me-1',
          },
          {
            img: images.icons.icComment,
            function: () => addComment(item?.id),
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.VESSEL_SCREENING,
            action: ActionTypeEnum.UPDATE,
            buttonType: ButtonType.Green,
          },
        ];
        actions = [...actions, ...extraActions];
      }
      return actions;
    },
    [isEditVessel, viewDetail, editDetail, addComment],
  );
  const dataTable = useMemo(
    () =>
      listIncident?.data?.map((item, index) => {
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
          typeOfIncident:
            item?.typeIncidents?.map((i) => i?.name)?.join(', ') || DATA_SPACE,
          reportDate:
            moment(item?.dateTimeOfIncident).format('DD/MM/YYYY') ||
            DATA_SPACE ||
            DATA_SPACE,
          reviewStatus: item?.reviewStatus,
          potentialRisk: RISK_VALUE_TO_LEVEL[item?.potentialRisk] ?? null,
          observedRisk: RISK_VALUE_TO_LEVEL[item?.observedRisk] ?? null,
          timeLoss: isNil(item?.timeLoss)
            ? DATA_SPACE
            : TIMELOSS_VALUE_TO_LABEL[item?.timeLoss?.toString()],
          remark: remarks?.remark || DATA_SPACE,
          isEdit: editMode,
          index,
        };
      }) || [],
    [editMode, listIncident?.data],
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
        minWidth: 125,
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
        headerName: t('refId'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'incidentTitle',
        headerName: t('incidentTitleTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'incidentDate',
        headerName: t('incidentDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'typeOfIncident',
        headerName: t('typeOfIncidentTx'),
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
        field: 'potentialRisk',
        headerName: 'Potential Risk',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        minWidth: 200,
        editable: false,
        singleClickEdit: false,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: RISK_LEVEL_OPTIONS,
        },
        cellRendererFramework: RiskPotentialCellRender,
      },
      {
        field: 'observedRisk',
        headerName: 'Observed Risk',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        minWidth: 200,
        editable: isEditVessel,
        singleClickEdit: true,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: RISK_LEVEL_OPTIONS,
        },
        cellRendererFramework: RiskObservedCellRender,
        onCellValueChanged: ({ data }) => {
          const selected = listIncident?.data?.find((i) => i?.id === data?.id);
          handleSubmit(
            {
              observedRisk: RISK_LEVEL_TO_VALUE[data?.observedRisk] ?? null,
              observedScore: RISK_LEVEL_TO_SCORE[data?.observedRisk] ?? null,
            },
            selected,
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
        editable: true,
        singleClickEdit: true,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: TIMELOSS_OPTIONS,
        },
        cellRendererFramework: RiskTimelossCellRender,
        onCellValueChanged: ({ data }) => {
          const selected = listIncident?.data?.find((i) => i?.id === data?.id);
          handleSubmit(
            { timeLoss: TIMELOSS_LABEL_TO_VALUE[data?.timeLoss] ?? null },
            selected,
          );
        },
      },
      {
        field: 'remark',
        headerName: 'Remark',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      checkWorkflow,
      handleSubmit,
      isEditVessel,
      isMultiColumnFilter,
      listIncident?.data,
      t,
    ],
  );

  return (
    <>
      <AGGridModule
        loading={loading}
        params={params}
        pageSizeDefault={10}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={dataFilter}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningIncident}__${vesselScreeningId}`}
        fileName="Vessel Screening_Incident"
        colDefProp={DEFAULT_COL_DEF}
        dataTable={dataTable}
        height="395px"
        view={(id) => viewDetail(id)}
        getList={(params) =>
          vesselScreeningDetail?.vesselId && handleGetList(params)
        }
        preventRowEventWhenClickOn={isEditVessel ? RISK_CELL_IDS : null}
        datePickerClassName={styles.datePickerReview}
        objectReview={
          <ObjectReview
            onChange={onObjectReviewFieldChange}
            table={OBJECT_REFERENCE.INCIDENTS}
            tab={TAB_REFERENCE.SAFETY_MANAGEMENT}
            className={styles.objectReview}
            showOnly
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />

      <ModalFeedbackAndRemarks
        isOpen={isVisibleComment}
        toggle={() => {
          setIsVisibleComment((e) => !e);
        }}
        title={t('addRemarksTitle')}
        titleRemark={t('remarkLabel')}
        placeholderRemark={t('placeholder.remark')}
        handleSubmitForm={handleSubmitComment}
        isEdit
      />
    </>
  );
};

export default ListIncidentSafety;
