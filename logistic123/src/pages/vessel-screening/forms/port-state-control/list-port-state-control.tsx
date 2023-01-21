import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
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
import { VesselScreeningPortStateControl } from '../../utils/models/common.model';
import styles from './list-port-state-control.module.scss';
import {
  getListVesselScreeningPortStateControlActions,
  updateVesselScreeningPortStateControlActions,
} from '../../store/vessel-port-state-control.action';
import { ModalComment } from '../../components/ModalComment';

interface IProps {
  getObjectReview: () => void;
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListPortStateControl = ({
  getObjectReview,
  onObjectReviewFieldChange,
}: IProps) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const [selected, setSelected] =
    useState<VesselScreeningPortStateControl>(null);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const isEdit = useMemo(() => pathname.includes('edit'), [pathname]);

  const dispatch = useDispatch();
  const { loading, list, params, dataFilter } = useSelector(
    (state) => state.vesselPortStateControl,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const viewDetail = useCallback(
    (id: string, requestId: string) => {
      let url = `${AppRouteConst.getVesselScreeningPSCById(
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
      let url = `${AppRouteConst.getVesselScreeningPSCById(
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
      setSelected(list?.list?.data?.[index]);
      setIsVisibleComment(true);
    },
    [list?.list?.data],
  );

  const getList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningPortStateControlActions.request({
          id: vesselScreeningId,
          filterRisk: newParams?.filterRisk || 'potential',
          ...newParams,
          pageSize: -1,
        }),
      );
    },
    [dispatch, vesselScreeningId],
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
      list?.list?.data?.map((item, index) => {
        const requestDetail = item?.portStateControlRequests?.[0];

        return {
          id: item?.id || DATA_SPACE,
          refId: item.refId || DATA_SPACE,
          portStateRequestId: requestDetail?.id ?? null,
          eventType: item?.eventType?.name || DATA_SPACE,
          inspectionDate: item?.dateOfInspection
            ? moment(item?.dateOfInspection).format('DD/MM/YYYY')
            : DATA_SPACE,
          detention: item?.detention,
          totalFindings: item.portStateInspectionReports?.length || 0,
          openFindings:
            item.portStateInspectionReports?.filter(
              (element) => element.status === 'Open',
            )?.length || 0,
          potentialRisk:
            RISK_VALUE_TO_LEVEL[requestDetail?.potentialRisk] ?? null,
          observedRisk:
            RISK_VALUE_TO_LEVEL[requestDetail?.observedRisk] ?? null,
          timeLoss: isNil(requestDetail?.timeLoss)
            ? DATA_SPACE
            : TIMELOSS_VALUE_TO_LABEL[requestDetail?.timeLoss?.toString()],
          comment: requestDetail?.PSRComments?.[0]?.comment || DATA_SPACE,
          isEdit,
          index,
        };
      }) || [],
    [isEdit, list?.list?.data],
  );

  const handleSubmit = useCallback(
    (dataForm, successCb?: any) => {
      dispatch(
        updateVesselScreeningPortStateControlActions.request({
          id: vesselScreeningId,
          data: {
            ...dataForm,
            vesselScreeningId,
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
              }/${vesselScreeningId}?tab=inspections&subTab=port-state-control`,
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
        headerName: t('refId'),
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
        field: 'inspectionDate',
        headerName: t('inspectionDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'detention',
        headerName: t('detention'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalFindings',
        headerName: t('totalFindings'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'openFindings',
        headerName: t('openFindings'),
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
        singleClickEdit: true,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: RISK_LEVEL_OPTIONS,
        },
        cellRendererFramework: RiskObservedCellRender,
        onCellValueChanged: ({ data }) => {
          const selected = list?.list?.data?.find((el) => el?.id === data?.id);
          const { potentialRisk, potentialScore, timeLoss } =
            selected?.portStateControlRequests?.[0] || {};

          handleSubmit({
            potentialRisk,
            potentialScore,
            observedRisk: RISK_LEVEL_TO_VALUE[data?.observedRisk] ?? null,
            observedScore: RISK_LEVEL_TO_SCORE[data?.observedRisk] ?? null,
            timeLoss,
            portStateControlId: selected?.id,
            comments: selected?.portStateControlRequests?.[0]?.PSRComments
              ?.length
              ? selected?.portStateControlRequests?.[0]?.PSRComments
              : null,
          });
        },
      },
      {
        field: 'timeLoss',
        headerName: 'Time Loss',
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
          const selected = list?.list?.data?.find((el) => el?.id === data?.id);
          const { potentialRisk, potentialScore, observedRisk, observedScore } =
            selected?.portStateControlRequests?.[0] || {};

          handleSubmit({
            potentialRisk,
            potentialScore,
            observedRisk,
            observedScore,
            timeLoss: TIMELOSS_LABEL_TO_VALUE[data?.timeLoss] ?? null,
            portStateControlId: selected?.id,
            comments: selected?.portStateControlRequests?.[0]?.PSRComments
              ?.length
              ? selected?.portStateControlRequests?.[0]?.PSRComments
              : null,
          });
        },
      },
      {
        field: 'comment',
        headerName: 'Comment',
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
      list?.list?.data,
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
      } = selected?.portStateControlRequests?.[0] || {};

      handleSubmit({
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        portStateControlId: selected?.id,
        comments: [
          comment,
          ...(selected?.portStateControlRequests?.[0]?.PSRComments ?? []),
        ],
      });
      setIsVisibleComment(false);
    },
    [handleSubmit, selected?.id, selected?.portStateControlRequests],
  );

  return (
    <>
      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={dataFilter}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningPSC}__${vesselScreeningId}`}
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
            table={OBJECT_REFERENCE.PORT_STATE_CONTROL}
            tab={TAB_REFERENCE.INSPECTIONS}
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
  );
};

export default ListPortStateControl;
