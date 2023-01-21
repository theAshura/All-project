import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import maxBy from 'lodash/maxBy';
import images from 'assets/images/images';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
  DATE_DEFAULT,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import moment from 'moment';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { useLocation, useParams } from 'react-router';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import {
  OBJECT_REFERENCE,
  RISK_CELL_IDS,
  RISK_LEVEL,
  RISK_LEVEL_OPTIONS,
  TAB_REFERENCE,
  TIMELOSS_OPTIONS,
  TIMELOSS_VALUE_TO_LABEL,
  TIMELOSS_LABEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
  RISK_LEVEL_TO_VALUE,
  RISK_LEVEL_TO_SCORE,
} from 'pages/vessel-screening/utils/constant';
import isNil from 'lodash/isNil';
import {
  getListPilotTerminalFeedbackActions,
  updatePilotTerminalFeedbacksActions,
} from 'pages/pilot-terminal-feedback/store/action';
import { PilotTerminalFeedbackDetail } from 'pages/pilot-terminal-feedback/utils/models/common.model';
import { getRiskLevel } from 'pages/vessel-screening/utils/functions';
import RiskPotentialCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-potential-cell-render';
import RiskObservedCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-observed-cell-render';
import RiskTimelossCellRender from 'pages/vessel-screening/components/risk-cell-render/risk-timeloss-cell-render';
import { ModalComment } from '../../components/ModalComment';
import styles from './list-pilot-terminal-feedback.module.scss';

interface IProps {
  getObjectReview: () => void;
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListPilotTerminalFeedback = ({
  getObjectReview,
  onObjectReviewFieldChange,
}: IProps) => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const [selected, setSelected] = useState<PilotTerminalFeedbackDetail>(null);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const isEdit = useMemo(() => pathname.includes('edit'), [pathname]);

  const dispatch = useDispatch();
  const { loading, listPilotTerminalFeedback, params, dataFilter } =
    useSelector((state) => state.pilotTerminalFeedback);

  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const viewDetail = useCallback(
    (id: string, requestId: string) => {
      let url = `${AppRouteConst.getVesselScreeningPilotTerminalFeedbackById(
        vesselScreeningId,
        isEdit ? 'edit' : 'detail',
      )}?recordStatus=detail&recordId=${id}`;

      if (requestId) {
        url += `&requestId=${requestId}`;
      }
      const win = window.open(url, '_blank');
      win.focus();
      return true;
    },
    [isEdit, vesselScreeningId],
  );

  const editDetail = useCallback(
    (id: string, requestId: string) => {
      let url = `${AppRouteConst.getVesselScreeningPilotTerminalFeedbackById(
        vesselScreeningId,
        isEdit ? 'edit' : 'detail',
      )}?recordStatus=edit&recordId=${id}`;

      if (requestId) {
        url += `&requestId=${requestId}`;
      }
      const win = window.open(url, '_blank');
      win.focus();
    },
    [isEdit, vesselScreeningId],
  );

  const addComment = useCallback(
    (index: number) => {
      setSelected(listPilotTerminalFeedback?.data?.[index]);
      setIsVisibleComment(true);
    },
    [listPilotTerminalFeedback?.data],
  );

  const getList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListPilotTerminalFeedbackActions.request({
          vesselId: vesselScreeningDetail?.vesselId,
          ...newParams,
          pageSize: -1,
        }),
      );
    },
    [dispatch, vesselScreeningDetail?.vesselId],
  );

  const checkWorkflow = useCallback(
    (item): Action[] => {
      let actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id, item?.portStateRequestId),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
      ];

      if (isEdit) {
        const extraActions = [
          {
            img: images.icons.icEdit,
            function: () => editDetail(item?.id, item?.portStateRequestId),
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.VESSEL_SCREENING,
            action: ActionTypeEnum.UPDATE,
            cssClass: 'me-1',
          },
          {
            img: images.icons.icComment,
            function: () => addComment(item?.index),
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
    [addComment, editDetail, isEdit, viewDetail],
  );

  const dataTable = useMemo(
    () =>
      listPilotTerminalFeedback?.data?.map((item, index) => {
        const comment = maxBy(item?.PTFComments || [], (item) => {
          if (item?.createdAt) {
            return moment(item?.createdAt);
          }
          return null;
        });
        return {
          id: item.id || DATA_SPACE,
          refId: item?.refId,
          vesselName: item?.vessel?.name,
          imo: item?.vessel?.imoNumber,
          riskScore: item?.score,
          feedbackType: item?.feedbackType,
          feedbackByUser: item?.createdUser?.username,
          dateOfInteraction: moment(item?.dateOfInteraction).format(
            'DD/MM/YYYY',
          ),
          terminal: item?.terminal?.name,
          port: item?.port?.name,
          country: item?.country,
          pilotage: item?.pilotAgeArea,
          potentialRisk: RISK_VALUE_TO_LEVEL[item?.potentialRisk] ?? null,
          observedRisk: RISK_VALUE_TO_LEVEL[item?.observedRisk] ?? null,
          timeLoss: isNil(item?.timeLoss)
            ? DATA_SPACE
            : TIMELOSS_VALUE_TO_LABEL[item?.timeLoss?.toString()],
          index,
          comment: comment?.comment || DATA_SPACE,
          score: item?.score ?? null,
          isEdit,
        };
      }) || [],
    [isEdit, listPilotTerminalFeedback?.data],
  );

  const handleSubmit = useCallback(
    (dataForm, selected, successCb?: any) => {
      dispatch(
        updatePilotTerminalFeedbacksActions.request({
          id: selected?.id,
          data: {
            ...dataForm,
          },
          handleSuccess: () => {
            getObjectReview?.();
            successCb?.();
            setSelected(null);
            getList({
              isRefreshLoading: false,
              createdAtFrom:
                params?.createdAtFrom || DATE_DEFAULT[0].toISOString(),
              createdAtTo: params?.createdAtTo || DATE_DEFAULT[1].toISOString(),
            });
            history.push(
              `${AppRouteConst.VESSEL_SCREENING}/${
                isEdit ? 'edit' : 'detail'
              }/${vesselScreeningId}?tab=pilot-terminal-feedback`,
            );
          },
        }),
      );
    },
    [
      dispatch,
      getList,
      getObjectReview,
      isEdit,
      params?.createdAtFrom,
      params?.createdAtTo,
      vesselScreeningId,
    ],
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
        headerName: t('pilotTerminalFeedback.refId'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'riskLevel',
        headerName: t('pilotTerminalFeedback.riskLevel'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: (params) => {
          const { data } = params;
          const riskLevel = isNil(data?.score)
            ? null
            : getRiskLevel(data?.score);

          return riskLevel ? (
            <span
              className={cx(styles.labelRisk, {
                [styles.negligible]: riskLevel === RISK_LEVEL.NEGLIGIBLE,
                [styles.low]: riskLevel === RISK_LEVEL.LOW,
                [styles.medium]: riskLevel === RISK_LEVEL.MEDIUM,
                [styles.high]: riskLevel === RISK_LEVEL.HIGH,
              })}
            >
              {riskLevel}
            </span>
          ) : (
            <span>-</span>
          );
        },
      },
      {
        field: 'feedbackType',
        headerName: t('pilotTerminalFeedback.feedbackType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'feedbackByUser',
        headerName: t('pilotTerminalFeedback.feedbackByUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dateOfInteraction',
        headerName: t('pilotTerminalFeedback.dateOfInteraction'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'terminal',
        headerName: t('pilotTerminalFeedback.terminal'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'port',
        headerName: t('pilotTerminalFeedback.port'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: t('pilotTerminalFeedback.country'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'pilotageArea',
        headerName: t('pilotTerminalFeedback.pilotageArea'),
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
        editable: isEdit,
        singleClickEdit: isEdit,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: RISK_LEVEL_OPTIONS,
        },
        cellRendererFramework: RiskObservedCellRender,
        onCellValueChanged: ({ data }) => {
          const selected = listPilotTerminalFeedback?.data?.find(
            (el) => el?.id === data?.id,
          );
          const { potentialRisk, potentialScore, timeLoss } = selected || {};
          handleSubmit(
            {
              observedRisk: RISK_LEVEL_TO_VALUE[data?.observedRisk] ?? null,
              observedScore: RISK_LEVEL_TO_SCORE[data?.observedRisk] ?? null,
              potentialRisk,
              potentialScore,
              timeLoss,
              portStateControlId: selected?.id,
              comments: selected?.PTFComments?.length
                ? selected?.PTFComments
                : null,
            },
            selected,
          );
        },
      },
      {
        field: 'timeLoss',
        headerName: 'Time Loss',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        editable: isEdit,
        singleClickEdit: isEdit,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: TIMELOSS_OPTIONS,
        },
        cellRendererFramework: RiskTimelossCellRender,
        onCellValueChanged: ({ data }) => {
          const selected = listPilotTerminalFeedback?.data?.find(
            (el) => el?.id === data?.id,
          );
          setSelected(selected);
          const { potentialRisk, potentialScore, observedRisk, observedScore } =
            selected || {};

          handleSubmit(
            {
              observedRisk,
              observedScore,
              potentialRisk,
              potentialScore,
              timeLoss: TIMELOSS_LABEL_TO_VALUE[data?.timeLoss] ?? null,
              portStateControlId: selected?.id,
              comments: selected?.PTFComments?.length
                ? selected?.PTFComments
                : null,
            },
            selected,
          );
        },
      },
      {
        field: 'comment',
        headerName: t('pilotTerminalFeedback.comment'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      checkWorkflow,
      handleSubmit,
      isEdit,
      isMultiColumnFilter,
      listPilotTerminalFeedback?.data,
      t,
    ],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      const {
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        country,
        dateOfInteraction,
        portId,
        terminalId,
        vesselId,
        feedBack,
        pilotAgeArea,
        pilotTerminalFeedbackChecklists,
      } = selected || {};

      handleSubmit(
        {
          potentialRisk,
          potentialScore,
          observedRisk,
          observedScore,
          timeLoss,
          country,
          dateOfInteraction,
          portId,
          terminalId,
          vesselId,
          feedBack,
          pilotAgeArea,
          pilotTerminalFeedbackChecklists,
          comments: [comment, ...(selected?.PTFComments ?? [])],
        },
        selected,
      );
      setIsVisibleComment(false);
    },
    [handleSubmit, selected],
  );

  return vesselScreeningDetail?.vesselId ? (
    <>
      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={dataFilter}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningPilotTerminalFeedback}__${vesselScreeningId}`}
        fileName="Vessel Screening_Port State Control"
        dataTable={dataTable}
        height="395px"
        pageSizeDefault={10}
        getList={getList}
        preventRowEventWhenClickOn={isEdit ? RISK_CELL_IDS : null}
        datePickerClassName={styles.datePickerReview}
        objectReview={
          <ObjectReview
            onChange={onObjectReviewFieldChange}
            table={OBJECT_REFERENCE.PILOT_TERMINAL_FEEDBACK}
            tab={TAB_REFERENCE.PILOT_TERMINAL_FEEDBACK}
            showOnly
            className={styles.objectReview}
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalComment
        isOpen={isVisibleComment}
        toggle={() => {
          setIsVisibleComment((e) => !e);
        }}
        handleSubmitForm={handleSubmitComment}
        isEdit
      />
    </>
  ) : null;
};

export default ListPilotTerminalFeedback;
