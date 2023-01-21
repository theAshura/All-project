import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
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
import { formatDateTimeDay } from 'helpers/utils.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  getListVesselScreeningDryDockingActions,
  updateVesselScreeningDryDockingActions,
} from 'pages/vessel-screening/store/vessel-dry-docking.action';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import { useParams } from 'react-router';
import { VesselScreeningDryDocking } from 'pages/vessel-screening/utils/models/common.model';
import { ModalComment } from 'pages/vessel-screening/components/ModalComment';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import {
  OBJECT_REFERENCE,
  RISK_CELL_IDS,
  TAB_REFERENCE,
} from 'pages/vessel-screening/utils/constant';
import styles from './list-dry-docking.module.scss';
import ModalDryDocking from './components/modal-dry-docking';

export enum DryDockingStatus {
  PLANNED = 'Planned',
  IN_DOCK = 'In-Dock',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface VesselScreeningDryDockingExtend
  extends VesselScreeningDryDocking {
  index: number;
}

interface IProps {
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListDryDocking = ({ onObjectReviewFieldChange }: IProps) => {
  const { t } = useTranslation(I18nNamespace.DRY_DOCKING);
  const { loading, params, dataFilter, list } = useSelector(
    (state) => state.vesselDryDocking,
  );
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { isEditVessel } = useContext(VesselScreeningContext);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [selected, setSelected] =
    useState<VesselScreeningDryDockingExtend>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { handleSuccess, ...other } = params;
      let newParams = handleFilterParams(other);
      if (handleSuccess) {
        newParams = { ...newParams, handleSuccess };
      }
      dispatch(
        getListVesselScreeningDryDockingActions.request({
          id: vesselScreeningId,
          filterRisk: newParams?.filterRisk || 'potential',
          ...newParams,
          pageSize: -1,
        }),
      );
    },
    [dispatch, vesselScreeningId],
  );

  const handleSubmitForm = useCallback(
    (dataForm) => {
      dispatch(
        updateVesselScreeningDryDockingActions.request({
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

  const handleSubmitComment = useCallback(
    (comment) => {
      const {
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
      } = selected?.dryDockingRequests?.[0] || {};

      handleSubmitForm({
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        dryDockingId: selected?.id,
        comments: [
          comment,
          ...(selected?.dryDockingRequests?.[0]?.DDRComments ?? []),
        ],
      });
      setIsVisibleComment(false);
    },
    [handleSubmitForm, selected],
  );

  const dataTable = useMemo(
    () =>
      list?.list?.data?.map((item, index) => {
        const requestDetail = item?.dryDockingRequests?.[0];
        const timeLoss = requestDetail?.timeLoss ? 'Yes' : 'No';
        return {
          id: item.id || DATA_SPACE,
          no: index + 1,
          eventType: item.eventType,
          plannedDate: item?.plannedDate
            ? formatDateTimeDay(item?.plannedDate)
            : DATA_SPACE,
          portMasterId: item?.portMaster?.name || DATA_SPACE,
          status: item?.status,
          completedDate: item?.completedDate
            ? formatDateTimeDay(item?.completedDate)
            : DATA_SPACE,
          potentialRisk: requestDetail?.potentialRisk,
          observedRisk: requestDetail?.observedRisk,
          timeLoss:
            !requestDetail ||
            requestDetail?.timeLoss === undefined ||
            requestDetail?.timeLoss === null
              ? DATA_SPACE
              : timeLoss,
          comment: requestDetail?.DDRComments?.[0]?.comment || DATA_SPACE,
          index,
        };
      }) || [],
    [list?.list?.data],
  );

  const getItemSelected = useCallback(
    (listData: VesselScreeningDryDocking[], id: string) => {
      let dataResult: VesselScreeningDryDockingExtend = null;
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
      setIsVisibleModal(true);
      const itemDetail = getItemSelected(list?.list?.data, id);
      setSelected(itemDetail);
      setIsEdit(true);
    },
    [getItemSelected, list?.list?.data],
  );

  const addComment = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(list?.list?.data, id);
      setSelected(itemDetail);
      setIsVisibleComment(true);
    },
    [getItemSelected, list?.list?.data],
  );

  const viewDetail = useCallback(
    (id: string) => {
      setIsEdit(false);
      const itemDetail = getItemSelected(list?.list?.data, id);
      setSelected(itemDetail);
      setIsVisibleModal(true);
      return true;
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
    [isEditVessel, viewDetail, editDetail, addComment],
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
        field: 'eventType',
        headerName: 'Event type',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'plannedDate',
        headerName: t('plannedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'portMasterId',
        headerName: t('portMasterId'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'status',
        headerName: t('status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'completedDate',
        headerName: 'Completed date',
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

  return (
    <>
      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        pageSizeDefault={10}
        dataFilter={dataFilter}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningDryDocking}__${vesselScreeningId}`}
        fileName="Vessel Screening_Dry Docking"
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
            table={OBJECT_REFERENCE.DRY_DOCKING}
            tab={TAB_REFERENCE.TECHNICAL}
            className={styles.objectReview}
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalDryDocking
        data={selected}
        isOpen={isVisibleModal}
        title="Dry Docking Information"
        toggle={() => {
          setSelected(null);
          setIsEdit(false);
          setIsVisibleModal(false);
        }}
        onSubmit={handleSubmitForm}
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

export default ListDryDocking;
