import { useCallback, useMemo, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATA_SPACE,
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
import moment from 'moment';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useParams } from 'react-router-dom';
import {
  getInjuriesSafetyRequestDetailActions,
  getListVesselScreeningInjuriesSafetyActions,
  updateInjuriesSafetyRequestActions,
} from 'pages/vessel-screening/store/vessel-injuries-safety.action';
import {
  clearInjuryReducer,
  getInjuryDetailActions,
} from 'store/injury/injury.action';
import { UpdateInjuriesSafetyRequestParams } from 'pages/vessel-screening/utils/models/injuries-safety.model';
import { ModalComment } from 'pages/vessel-screening/components/ModalComment';
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
import { useLocation } from 'react-router';
import ModalInjuries from './components/modal-injuries';
import styles from './list-injuries.module.scss';

interface IProps {
  getObjectReview: () => void;
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListInjuries = ({
  getObjectReview,
  onObjectReviewFieldChange,
}: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const {
    listInjuriesSafety,
    params,
    dataFilter,
    injuriesSafetyRequestDetail,
  } = useSelector((state) => state.vesselInjuriesSafety);
  const { injuryDetail } = useSelector((state) => state.injury);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const { pathname } = useLocation();

  const { id: vesselScreeningId } = useParams<{ id: string }>();

  const isEditVessel = useMemo(() => pathname.includes('edit'), [pathname]);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningInjuriesSafetyActions.request({
          ...newParams,
          isRefreshLoading: true,
          filterRisk: newParams?.filterRisk || 'potential',
          vesselScreeningId,
          pageSize: -1,
        }),
      );
    },
    [dispatch, vesselScreeningId],
  );

  const handleGetDetail = useCallback(
    (id: string, injuryRequestId?: string) => {
      dispatch(getInjuryDetailActions.request(id));
      if (injuryRequestId) {
        dispatch(
          getInjuriesSafetyRequestDetailActions.request({
            vesselScreeningId,
            id: injuryRequestId,
          }),
        );
      }
    },
    [dispatch, vesselScreeningId],
  );

  const handleAfterSubmitForm = useCallback(
    (injuryRequestId?: string) => {
      setVisibleModal(false);
      setIsEdit(false);

      handleGetList();
      setIsVisibleComment(false);
      dispatch(clearInjuryReducer());
      if (injuryRequestId) {
        dispatch(
          getInjuriesSafetyRequestDetailActions.request({
            vesselScreeningId,
            id: injuryRequestId,
          }),
        );
      } else {
        dispatch(getInjuriesSafetyRequestDetailActions.success(null));
      }
    },
    [dispatch, handleGetList, vesselScreeningId],
  );

  const handleSubmit = useCallback(
    (
      dataForm: UpdateInjuriesSafetyRequestParams,
      injuryRequestId?: string,
      successCb?: any,
    ) => {
      dispatch(
        updateInjuriesSafetyRequestActions.request({
          ...dataForm,
          handleSuccess: () => {
            if (!injuryRequestId) {
              handleAfterSubmitForm();
            } else {
              handleAfterSubmitForm(injuryRequestId);
            }
            successCb?.();
            getObjectReview?.();
          },
        }),
      );
    },
    [dispatch, getObjectReview, handleAfterSubmitForm],
  );

  const dataTable = useMemo(
    () =>
      listInjuriesSafety?.data?.map((item, index) => {
        const requestDetail = item?.injuryRequests?.[0];
        return {
          id: item.id || DATA_SPACE,
          sno: index + 1,
          injuryRequestId: requestDetail?.id ?? null,
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
          potentialRisk:
            RISK_VALUE_TO_LEVEL[requestDetail?.potentialRisk] ?? null,
          observedRisk:
            RISK_VALUE_TO_LEVEL[requestDetail?.observedRisk] ?? null,
          timeLoss: isNil(requestDetail?.timeLoss)
            ? DATA_SPACE
            : TIMELOSS_VALUE_TO_LABEL[requestDetail?.timeLoss?.toString()],
          comment: requestDetail?.IRComments?.[0]?.comment || DATA_SPACE,
          isEdit: isEditVessel,
        };
      }) || [],
    [isEditVessel, listInjuriesSafety?.data],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      handleSubmit({
        id: vesselScreeningId,
        data: {
          injuryId: injuryDetail?.id ?? null,
          vesselScreeningId,
          potentialRisk: injuriesSafetyRequestDetail?.potentialRisk ?? null,
          potentialScore: injuriesSafetyRequestDetail?.potentialScore ?? null,
          observedRisk: injuriesSafetyRequestDetail?.observedRisk ?? null,
          observedScore: injuriesSafetyRequestDetail?.observedScore ?? null,
          timeLoss: injuriesSafetyRequestDetail
            ? injuriesSafetyRequestDetail.timeLoss
            : null,
          comments: [
            comment,
            ...(injuriesSafetyRequestDetail?.IRComments ?? []),
          ],
        },
      });
    },
    [
      handleSubmit,
      injuriesSafetyRequestDetail,
      injuryDetail?.id,
      vesselScreeningId,
    ],
  );

  const viewDetail = useCallback(
    (id: string) => {
      const itemDetail = dataTable.find((i) => i.id === id);
      handleGetDetail(id, itemDetail?.injuryRequestId);
      setIsEdit(false);
      setVisibleModal(true);
      return true;
    },
    [dataTable, handleGetDetail],
  );

  const editDetail = useCallback(
    (id: string) => {
      const itemDetail = dataTable.find((i) => i.id === id);
      handleGetDetail(id, itemDetail?.injuryRequestId);
      setIsEdit(true);
      setVisibleModal(true);
    },
    [dataTable, handleGetDetail],
  );

  const addComment = useCallback(
    (id: string) => {
      const itemDetail = dataTable.find((i) => i.id === id);
      handleGetDetail(id, itemDetail?.injuryRequestId);
      setIsEdit(false);
      setIsVisibleComment(true);
    },
    [dataTable, handleGetDetail],
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
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
          ];

          if (isEditVessel) {
            const extraActions = [
              {
                img: images.icons.icEdit,
                function: () => editDetail(data?.id),
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.VESSEL_SCREENING,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'me-1',
              },
              {
                img: images.icons.icComment,
                function: () => addComment(data?.id),
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.VESSEL_SCREENING,
                action: ActionTypeEnum.UPDATE,
                buttonType: ButtonType.Green,
              },
            ];
            actions = [...actions, ...extraActions];
          }

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
        field: 'eventType',
        headerName: t('table.eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'lti',
        headerName: t('table.lti'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'eventTitle',
        headerName: t('table.eventTitle'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dateOfInjuries',
        headerName: t('table.dateOfInjuries'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'deptOfInjuredPerson',
        headerName: t('table.deptOfInjuredPerson'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'locationOfIncident',
        headerName: t('table.locationOfIncident'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'injuriesBodyPart',
        headerName: t('table.injuriesBodyPart'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'causes',
        headerName: t('table.causes'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'countermeasures',
        headerName: t('table.countermeasures'),
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
        editable: isEditVessel,
        singleClickEdit: true,
        cellEditorPopupPosition: 'under',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: RISK_LEVEL_OPTIONS,
        },
        cellRendererFramework: RiskObservedCellRender,
        onCellValueChanged: ({ data }) => {
          const itemDetail = listInjuriesSafety?.data?.find(
            (i) => i.id === data?.id,
          );
          const requestDetail = itemDetail?.injuryRequests?.[0];
          handleSubmit(
            {
              id: vesselScreeningId,
              data: {
                injuryId: itemDetail?.id ?? null,
                vesselScreeningId,
                observedRisk: RISK_LEVEL_TO_VALUE[data?.observedRisk] ?? null,
                observedScore: RISK_LEVEL_TO_SCORE[data?.observedRisk] ?? null,
                potentialRisk: requestDetail?.potentialRisk ?? null,
                potentialScore: requestDetail?.potentialScore ?? null,
                timeLoss: requestDetail.timeLoss,
                comments: requestDetail?.IRComments?.length
                  ? requestDetail?.IRComments
                  : null,
              },
            },
            requestDetail?.injuryId,
          );
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
          const itemDetail = listInjuriesSafety?.data?.find(
            (i) => i.id === data?.id,
          );
          const requestDetail = itemDetail?.injuryRequests?.[0];
          handleSubmit(
            {
              id: vesselScreeningId,
              data: {
                injuryId: itemDetail?.id ?? null,
                vesselScreeningId,
                observedRisk: requestDetail?.observedRisk ?? null,
                observedScore: requestDetail?.observedScore ?? null,
                potentialRisk: requestDetail?.potentialRisk ?? null,
                potentialScore: requestDetail?.potentialScore ?? null,
                timeLoss: TIMELOSS_LABEL_TO_VALUE[data?.timeLoss] ?? null,
                comments: requestDetail?.IRComments?.length
                  ? requestDetail?.IRComments
                  : null,
              },
            },
            requestDetail?.injuryId,
          );
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
      addComment,
      editDetail,
      handleSubmit,
      isEditVessel,
      isMultiColumnFilter,
      listInjuriesSafety?.data,
      t,
      vesselScreeningId,
      viewDetail,
    ],
  );

  return (
    <>
      <AGGridModule
        pageSizeDefault={10}
        loading={false}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={dataFilter}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningInjuries}__${vesselScreeningId}`}
        fileName="Vessel Screening_Injuries"
        dataTable={dataTable}
        height="395px"
        view={viewDetail}
        getList={handleGetList}
        preventRowEventWhenClickOn={isEditVessel ? RISK_CELL_IDS : null}
        datePickerClassName={styles.datePickerReview}
        objectReview={
          <ObjectReview
            onChange={onObjectReviewFieldChange}
            table={OBJECT_REFERENCE.INJURIES}
            tab={TAB_REFERENCE.SAFETY_MANAGEMENT}
            className={styles.objectReview}
            showOnly
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalInjuries
        title={t('injuriesInformation')}
        isOpen={visibleModal}
        toggle={() => {
          setVisibleModal((e) => !e);
          setIsEdit(false);
        }}
        onSubmit={handleSubmit}
        isEdit={isEdit}
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

export default ListInjuries;
