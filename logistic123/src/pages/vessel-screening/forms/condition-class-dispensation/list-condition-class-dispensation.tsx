import { useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import images from 'assets/images/images';
import { ButtonType } from 'components/ui/button/Button';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateTime, formatDateTimeDay } from 'helpers/utils.helper';
import {
  DATA_SPACE,
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import {
  getListVesselClassDispensationsActions,
  updateVesselClassDispensationsActions,
} from 'pages/vessel-screening/store/vessel-class-dispensations.action';
import { VesselScreeningClassDispensations } from 'pages/vessel-screening/utils/models/vessel-class-dispensations.model';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useLocation, useParams } from 'react-router';
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
import ModalConditionOfClass from './components/modal-condition-class-dispensation';
import styles from './list-condition-class-dispensation.module.scss';

export interface VesselScreeningClassDispensationsExtends
  extends VesselScreeningClassDispensations {
  index: number;
}

interface IProps {
  getObjectReview: () => void;
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListConditionOfClassDispensation = ({
  getObjectReview,
  onObjectReviewFieldChange,
}: IProps) => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const {
    loading,
    params,
    dataFilter,
    list: classDispensationsData,
  } = useSelector((state) => state.vesselClassDispensations);
  const { pathname } = useLocation();
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const [detailConditionOfClass, setDetail] =
    useState<VesselScreeningClassDispensationsExtends>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const dispatch = useDispatch();

  const isEditVessel = useMemo(() => pathname.includes('edit'), [pathname]);

  const handleGetList = useCallback(
    (param?: CommonApiParam) => {
      const newParams = handleFilterParams(param);
      dispatch(
        getListVesselClassDispensationsActions.request({
          ...newParams,
          filterRisk: params?.filterRisk || 'potential',
          pageSize: -1,
          id: vesselScreeningId,
        }),
      );
    },
    [dispatch, params?.filterRisk, vesselScreeningId],
  );

  const dataTable = useMemo(() => {
    if (!classDispensationsData?.list?.data) {
      return [];
    }
    return classDispensationsData?.list?.data?.map((item, index) => {
      const requestDetail = item?.classDispensationsRequests?.[0];
      return {
        id: item?.id,
        index,
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
        updatedAt: item?.updatedAt
          ? formatDateTime(item?.updatedAt)
          : DATA_SPACE,
        authorityId: item?.authorityId || DATA_SPACE,
        potentialRisk:
          RISK_VALUE_TO_LEVEL[requestDetail?.potentialRisk] ?? null,
        observedRisk: RISK_VALUE_TO_LEVEL[requestDetail?.observedRisk] ?? null,
        timeLoss: isNil(requestDetail?.timeLoss)
          ? DATA_SPACE
          : TIMELOSS_VALUE_TO_LABEL[requestDetail?.timeLoss?.toString()],
        comment: requestDetail?.CDRComments?.[0]?.comment || DATA_SPACE,
        isEdit: isEditVessel,
      };
    });
  }, [classDispensationsData?.list?.data, isEditVessel]);

  const handleSubmitForm = useCallback(
    (dataForm) => {
      dispatch(
        updateVesselClassDispensationsActions.request({
          id: vesselScreeningId,
          data: {
            ...dataForm,
            vesselScreeningId,
          },
          handleSuccess: () => {
            getObjectReview();
            setDetail(null);
            setIsEdit(false);
            setIsVisibleModal(false);
            handleGetList();
          },
        }),
      );
    },
    [dispatch, getObjectReview, handleGetList, vesselScreeningId],
  );

  const handleSubmit = useCallback(
    (newData, selected: any, successCB?: any) => {
      const {
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
      } = selected?.classDispensationsRequests?.[0] || {};

      handleSubmitForm({
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        classDispensationsId: selected?.id,
        comments: selected?.classDispensationsRequests?.[0]?.CDRComments?.length
          ? selected?.classDispensationsRequests?.[0]?.CDRComments
          : null,
        ...newData,
      });
      successCB?.();
    },
    [handleSubmitForm],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      handleSubmit(
        {
          comments: [
            comment,
            ...(detailConditionOfClass?.classDispensationsRequests?.[0]
              ?.CDRComments ?? []),
          ],
        },
        detailConditionOfClass,
        () => {
          setIsVisibleComment(false);
        },
      );
    },
    [detailConditionOfClass, handleSubmit],
  );

  const getItemSelected = useCallback(
    (listData: VesselScreeningClassDispensations[], id: string) => {
      let dataResult: VesselScreeningClassDispensationsExtends = null;
      listData?.forEach((item, index) => {
        if (item.id === id) {
          dataResult = { ...item, index };
        }
      });
      return dataResult;
    },
    [],
  );

  const editDetail = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(
        classDispensationsData?.list?.data,
        id,
      );
      setIsVisibleModal(true);
      setDetail(itemDetail);
      setIsEdit(true);
    },
    [classDispensationsData?.list?.data, getItemSelected],
  );

  const addComment = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(
        classDispensationsData?.list?.data,
        id,
      );
      setIsVisibleComment(true);
      setDetail(itemDetail);
    },
    [classDispensationsData?.list?.data, getItemSelected],
  );

  const viewDetail = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(
        classDispensationsData?.list?.data,
        id,
      );
      setIsVisibleModal(true);
      setDetail(itemDetail);
      setIsEdit(false);
      return true;
    },
    [classDispensationsData?.list?.data, getItemSelected],
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
          if (data?.isEdit) {
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
        field: 'status',
        headerName: t('table.status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'closeDate',
        headerName: t('table.closeDate'),
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
          const item = getItemSelected(
            classDispensationsData?.list?.data,
            data?.id,
          );
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
          const item = getItemSelected(
            classDispensationsData?.list?.data,
            data?.id,
          );
          handleSubmit(
            { timeLoss: TIMELOSS_LABEL_TO_VALUE[data?.timeLoss] ?? null },
            item,
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
      classDispensationsData?.list?.data,
      editDetail,
      getItemSelected,
      handleSubmit,
      isEditVessel,
      isMultiColumnFilter,
      t,
      viewDetail,
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
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningConditionOfClass}__${vesselScreeningId}`}
        fileName="Vessel Screening_Condition of Class Dispensations"
        colDefProp={DEFAULT_COL_DEF}
        dataTable={dataTable}
        height="395px"
        view={viewDetail}
        getList={handleGetList}
        preventRowEventWhenClickOn={isEditVessel ? RISK_CELL_IDS : null}
        datePickerClassName={styles.datePickerReview}
        objectReview={
          <ObjectReview
            onChange={onObjectReviewFieldChange}
            table={OBJECT_REFERENCE.CONDITION_OF_CLASS_DISPENSATIONS}
            tab={TAB_REFERENCE.TECHNICAL}
            className={styles.objectReview}
            showOnly
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalConditionOfClass
        title={t('conditionClassDispensationInformation')}
        isOpen={isVisibleModal}
        toggle={() => {
          setDetail(null);
          setIsVisibleModal((e) => !e);
          setIsEdit(false);
        }}
        onSubmit={handleSubmitForm}
        isEdit={isEdit}
        data={detailConditionOfClass}
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

export default ListConditionOfClassDispensation;
