import { useCallback, useContext, useMemo, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATA_SPACE,
  DEFAULT_COL_DEF,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { VesselScreeningMaintenance } from 'pages/vessel-screening/utils/models/common.model';
import {
  Features,
  ActionTypeEnum,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import {
  formatDateTime,
  dateStringComparator,
  convertToPercent,
} from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  getListVesselScreeningMaintenanceActions,
  updateVesselScreeningMaintenanceActions,
} from 'pages/vessel-screening/store/vessel-maintenance-performance.action';
import { useParams } from 'react-router';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import cx from 'classnames';
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
import ModalMaintenancePerformance from './components/modal-maintenance-performance';
import styles from './list-maintenance-performance.module.scss';

export interface VesselScreeningMaintenanceExtend
  extends VesselScreeningMaintenance {
  index: number;
}

interface IProps {
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListMaintenancePerformance = ({ onObjectReviewFieldChange }: IProps) => {
  const { t } = useTranslation(I18nNamespace.MAINTENANCE_TECHNICAL);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { isEditVessel } = useContext(VesselScreeningContext);

  const dispatch = useDispatch();
  const { loading, list, params, dataFilter } = useSelector(
    (state) => state.vesselMaintenancePerformance,
  );

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [selected, setSelected] =
    useState<VesselScreeningMaintenanceExtend>(null);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningMaintenanceActions.request({
          id: vesselScreeningId,
          filterRisk: newParams?.filterRisk || 'potential',
          ...newParams,
          pageSize: -1,
        }),
      );
    },
    [dispatch, vesselScreeningId],
  );

  const dataTable = useMemo(
    () =>
      list?.list?.data?.map((item, index) => {
        const requestDetail = item?.maintenancePerformanceRequests?.[0];
        const timeLoss = requestDetail?.timeLoss ? 'Yes' : 'No';
        return {
          id: item.id || DATA_SPACE,
          maintenanceRequestId: requestDetail?.id || null,
          eventType: item?.eventType || DATA_SPACE,
          recordDate: formatDateTime(item?.recordDate),
          periodFrom: formatDateTime(item?.periodFrom),
          periodTo: formatDateTime(item?.periodTo),
          totalPlannedJobs: item?.totalPlannedJobs || DATA_SPACE,
          overdueCriticalJobs: item?.overdueCriticalJobs || DATA_SPACE,
          overdueNonCriticalJobs: item?.overdueJobs || DATA_SPACE,
          overdueNonCriticalPercentage:
            convertToPercent(item?.overdueJobs, item?.totalPlannedJobs) ||
            DATA_SPACE,
          attachments: item?.attachments,
          remarks: item?.remarks || DATA_SPACE,
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
          comment: requestDetail?.MPRComments?.[0]?.comment || DATA_SPACE,
        };
      }) || [],
    [list?.list?.data],
  );

  const getItemSelected = useCallback(
    (listData: VesselScreeningMaintenance[], id: string) => {
      let dataResult: VesselScreeningMaintenanceExtend = null;
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

  const handleSubmit = useCallback(
    (dataForm) => {
      dispatch(
        updateVesselScreeningMaintenanceActions.request({
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
        field: 'totalPlannedJobs',
        minWidth: 200,
        headerName: t('totalPlannedJobs'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'overdueCriticalJobs',
        minWidth: 200,
        headerName: t('overdueCriticalJobs'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },

      {
        field: 'overdueNonCriticalJobs',
        minWidth: 200,
        headerName: t('overdueNonCriticalJobs'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'overdueNonCriticalPercentage',
        minWidth: 200,
        headerName: t('overdueNonCriticalPercentage'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
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
      } = selected?.maintenancePerformanceRequests?.[0] || {};

      handleSubmit({
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        maintenancePerformanceId: selected?.id,
        comments: [
          comment,
          ...(selected?.maintenancePerformanceRequests?.[0]?.MPRComments ?? []),
        ],
      });
      setIsVisibleComment(false);
    },
    [handleSubmit, selected?.id, selected?.maintenancePerformanceRequests],
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
        moduleTemplate={`${MODULE_TEMPLATE.vesselMaintenancePerformance}__${vesselScreeningId}`}
        fileName="Vessel Screening_Maintenance Performance"
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
            table={OBJECT_REFERENCE.MAINTENANCE_PERFORMANCE}
            tab={TAB_REFERENCE.TECHNICAL}
            className={styles.objectReview}
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalMaintenancePerformance
        data={selected}
        isOpen={isVisibleModal}
        title={t('maintenancePerformanceInformation')}
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

export default ListMaintenancePerformance;
