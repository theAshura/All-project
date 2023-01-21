import { useCallback, useContext, useMemo, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATA_SPACE,
  DATE_DEFAULT,
  DEFAULT_COL_DEF,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListVesselScreeningOtherTechRecordsActions,
  updateVesselScreeningOtherTechRecordsActions,
} from 'pages/vessel-screening/store/vessel-other-tech-records.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';

import {
  Features,
  ActionTypeEnum,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { formatDateTime, dateStringComparator } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import { VesselScreeningOtherTechRecords } from 'pages/vessel-screening/utils/models/common.model';
import { useParams } from 'react-router';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { ModalComment } from 'pages/vessel-screening/components/ModalComment';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import {
  OBJECT_REFERENCE,
  RISK_CELL_IDS,
  TAB_REFERENCE,
} from 'pages/vessel-screening/utils/constant';
import ModalOtherTechnicalRecords from './components/modal-other-technical-records';
import styles from './list-other-technical-records.module.scss';

export interface VesselScreeningOtherTechRecordsExtend
  extends VesselScreeningOtherTechRecords {
  index: number;
}

interface IProps {
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListOtherTechnicalRecords = ({ onObjectReviewFieldChange }: IProps) => {
  const { t } = useTranslation(I18nNamespace.MAINTENANCE_TECHNICAL);
  const dispatch = useDispatch();
  const { loading, list, params, dataFilter } = useSelector(
    (state) => state.vesselOtherTechRecords,
  );
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { isEditVessel } = useContext(VesselScreeningContext);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [selected, setSelected] =
    useState<VesselScreeningOtherTechRecordsExtend>(null);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);

  const getItemSelected = useCallback(
    (listData: VesselScreeningOtherTechRecords[], id: string) => {
      let dataResult: VesselScreeningOtherTechRecordsExtend = null;
      listData?.forEach((item, index) => {
        if (item.id === id) {
          dataResult = { ...item, index };
        }
      });
      return dataResult;
    },
    [],
  );
  const viewDetail = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(list?.list?.data, id);
      setIsEdit(false);
      setIsVisibleModal(true);
      setSelected(itemDetail);
      return true;
    },
    [getItemSelected, list?.list?.data],
  );

  const editDetail = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(list?.list?.data, id);
      setIsEdit(true);
      setIsVisibleModal(true);
      setSelected(itemDetail);
    },
    [getItemSelected, list?.list?.data],
  );

  const addComment = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(list?.list?.data, id);
      setIsVisibleComment(true);
      setSelected(itemDetail);
    },
    [getItemSelected, list?.list?.data],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningOtherTechRecordsActions.request({
          id: vesselScreeningId,
          ...newParams,
          filterRisk: newParams?.filterRisk || 'potential',
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
          function: () => viewDetail(item?.id),
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
    [addComment, editDetail, isEditVessel, viewDetail],
  );

  const dataTable = useMemo(
    () =>
      list?.list?.data?.map((item, index) => {
        const requestDetail = item?.otherTechRecordsRequests?.[0];
        const timeLoss = requestDetail?.timeLoss ? 'Yes' : 'No';

        return {
          id: item.id || DATA_SPACE,
          eventType: item?.eventType?.name || DATA_SPACE,
          recordDate: item?.recordDate
            ? formatDateTime(item?.recordDate)
            : DATA_SPACE,
          initialAttachments: item.initialAttachments,
          anySpecialPointsToNote: item?.techIssueNote?.name || DATA_SPACE,
          pendingAction: item?.pendingAction || DATA_SPACE,
          actionRemarks: item?.actionRemarks || DATA_SPACE,
          targetCloseDate: item?.targetCloseDate
            ? formatDateTime(item?.targetCloseDate)
            : DATA_SPACE,
          actionStatus: item?.actionStatus || DATA_SPACE,
          actualCloseDate: item?.actualCloseDate
            ? formatDateTime(item?.actualCloseDate)
            : DATA_SPACE,
          closureRemarks: item?.closureRemarks || DATA_SPACE,
          attachments: item?.attachments || DATA_SPACE,
          lastUpdatedDate: item?.updatedAt
            ? formatDateTime(item?.updatedAt)
            : DATA_SPACE,
          index,
          potentialRisk: requestDetail?.potentialRisk,
          observedRisk: requestDetail?.observedRisk,
          timeLoss:
            !requestDetail ||
            requestDetail?.timeLoss === undefined ||
            requestDetail?.timeLoss === null
              ? DATA_SPACE
              : timeLoss,
          comment: requestDetail?.OTRRComments?.[0]?.comment || DATA_SPACE,
        };
      }) || [],
    [list?.list?.data],
  );

  const handleSubmit = useCallback(
    (dataForm) => {
      dispatch(
        updateVesselScreeningOtherTechRecordsActions.request({
          id: vesselScreeningId,
          data: {
            ...dataForm,
            vesselScreeningId,
          },
          handleSuccess: () => {
            setSelected(null);
            setIsEdit(false);
            setIsVisibleModal(false);
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
    [
      dispatch,
      handleGetList,
      params?.createdAtFrom,
      params?.createdAtTo,
      vesselScreeningId,
    ],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: 'Action',
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
        field: 'eventType',
        minWidth: 200,
        headerName: t('eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'recordDate',
        minWidth: 200,
        headerName: t('recordDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'anySpecialPointsToNote',
        minWidth: 200,
        headerName: t('anySpecialPointsToNote'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'pendingAction',
        minWidth: 200,
        headerName: t('pendingAction'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'targetCloseDate',
        minWidth: 200,
        headerName: t('targetCloseDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actionStatus',
        minWidth: 200,
        headerName: t('actionStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'actualCloseDate',
        minWidth: 200,
        headerName: t('actualCloseDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'comment',
        headerName: 'Comment',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [checkWorkflow, isMultiColumnFilter, t],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      const {
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
      } = selected?.otherTechRecordsRequests?.[0] || {};

      handleSubmit({
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        otherTechRecordsId: selected?.id,
        comments: [
          comment,
          ...(selected?.otherTechRecordsRequests?.[0]?.OTRRComments ?? []),
        ],
      });
      setIsVisibleComment(false);
    },
    [handleSubmit, selected?.id, selected?.otherTechRecordsRequests],
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
        moduleTemplate={`${MODULE_TEMPLATE.vesselOtherTechnicalRecord}__${vesselScreeningId}`}
        fileName="Vessel Screening_Other Technical Record"
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
            table={OBJECT_REFERENCE.OTHER_TECHNICAL_RECORDS}
            tab={TAB_REFERENCE.TECHNICAL}
            className={styles.objectReview}
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />

      <ModalOtherTechnicalRecords
        data={selected}
        isOpen={isVisibleModal}
        title={t('otherTechnicalRecordInformation')}
        toggle={() => {
          setSelected(null);
          setIsEdit(false);
          setIsVisibleModal(false);
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

export default ListOtherTechnicalRecords;
