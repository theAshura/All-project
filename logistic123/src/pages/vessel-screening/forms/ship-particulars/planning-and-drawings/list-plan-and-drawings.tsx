import { FC, useCallback, useMemo, useState } from 'react';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATE_DEFAULT,
  DATA_SPACE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import Tooltip from 'antd/lib/tooltip';
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
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useParams } from 'react-router-dom';
import { VesselScreeningPlanAndDrawing } from 'pages/vessel-screening/utils/models/plan-and-drawing.model';
import { getListPlansAndDrawingMasterActions } from 'store/plans-and-drawings/plans-and-drawings.action';
import { PlansAndDrawingDetailResponse } from 'models/api/plans-and-drawings/plans-and-drawings.model';
import { ModalNoteByReviewer } from 'pages/vessel-screening/components/note-reviewer/ModalNoteByReviewer';
import {
  getPlansAndDrawingDetailActionsApi,
  updatePlansAndDrawingDetailActionsApi,
} from 'api/plans-and-drawings.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import {
  OBJECT_REFERENCE,
  TAB_REFERENCE,
} from 'pages/vessel-screening/utils/constant';
import styles from './list-plan-and-drawings.module.scss';
import PlanningAndDrawingsForm from './modal-plans-and-drawings';

export interface VesselScreeningPlansAndDrawingExtend
  extends VesselScreeningPlanAndDrawing {
  index: number;
}

export interface CProps {
  edit?: boolean;
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListPlansAndDrawing: FC<CProps> = ({
  edit,
  onObjectReviewFieldChange,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.PLANS_AND_DRAWINGS);
  const { loading, listPlanningAndDrawings, params, dataFilter } = useSelector(
    (state) => state.plansAndDrawing,
  );
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [selected, setSelected] = useState<PlansAndDrawingDetailResponse>(null);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const { vesselDetail } = useSelector((state) => state.vessel);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisibleNote, setIsVisibleNote] = useState<boolean>(false);

  const getDetailPlanAndDrawing = useCallback(
    (id: string) => {
      if (vesselDetail) {
        setIsLoading(true);
        getPlansAndDrawingDetailActionsApi({
          id,
          vesselId: vesselDetail.id,
        })
          .then((res) => {
            const detailPD = res?.data;
            setSelected(detailPD);
          })
          .catch((e) => {
            toastError(e.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    [vesselDetail],
  );

  const viewDetail = useCallback(
    (id: string) => {
      getDetailPlanAndDrawing(id);
      setIsEdit(false);
      setIsVisibleModal(true);
      return true;
    },
    [getDetailPlanAndDrawing],
  );

  const editDetail = useCallback(
    (id: string) => {
      getDetailPlanAndDrawing(id);
      setIsEdit(true);
      setIsVisibleModal(true);
    },
    [getDetailPlanAndDrawing],
  );

  const addComment = useCallback(
    (id: string) => {
      getDetailPlanAndDrawing(id);
      setIsEdit(false);
      setIsVisibleNote(true);
    },
    [getDetailPlanAndDrawing],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListPlansAndDrawingMasterActions.request({
          ...newParams,
          pageSize: -1,
          status: 'active',
          vesselId: vesselDetail?.id,
          vesselTypeName: vesselDetail?.vesselType?.name,
        }),
      );
    },
    [dispatch, vesselDetail?.id, vesselDetail?.vesselType?.name],
  );

  const checkWorkflow = useCallback(
    (item: VesselScreeningPlansAndDrawingExtend): Action[] => {
      const actions: Action[] = [
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
      if (edit) {
        actions.push(
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
        );
      }
      return actions;
    },
    [edit, viewDetail, editDetail, addComment],
  );

  const dataTable = useMemo(
    () =>
      listPlanningAndDrawings?.data?.map((item, index) => ({
        index,
        id: item.id || DATA_SPACE,
        nameOfPlanning: item?.name || DATA_SPACE,
        remarks: item?.plansDrawings?.length
          ? item?.plansDrawings[0]?.remarks
          : DATA_SPACE,
        attachments: item?.plansDrawings[0]?.attachments?.length
          ? [...item?.plansDrawings[0]?.attachments]
          : [],
        comments: item?.plansDrawings?.length
          ? item?.plansDrawings[0]?.PDComments[0]?.comment
          : DATA_SPACE,
      })) || [],
    [listPlanningAndDrawings?.data],
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
        field: 'nameOfPlanning',
        headerName: t('table.nameOfPlanning'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'remarks',
        headerName: t('comment'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'attachment',
        headerName: t('attachment'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => {
          if (data?.attachments?.length > 0) {
            return (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  editDetail(data?.id);
                }}
                buttonType={ButtonType.Outline}
                className={styles.btnAttachment}
              >
                {t('attachment')}
              </Button>
            );
          }
          return null;
        },
      },
      {
        field: 'comments',
        headerName: t('table.noteByReviewer'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow, editDetail],
  );

  const handleSubmit = useCallback(
    (dataForm) => {
      setIsLoading(true);
      updatePlansAndDrawingDetailActionsApi({
        id: selected?.plansDrawingsMaster?.id,
        data: dataForm,
      })
        .then(() => {
          toastSuccess('You have updated successfully');
        })
        .catch((e) => {
          toastError(e.message);
        })
        .finally(() => {
          setSelected(null);
          setIsEdit(false);
          setIsVisibleModal(false);
          setIsLoading(false);
          handleGetList({
            createdAtFrom:
              params?.createdAtFrom || DATE_DEFAULT[0].toISOString(),
            createdAtTo: params?.createdAtTo || DATE_DEFAULT[1].toISOString(),
          });
        });
    },
    [
      handleGetList,
      params?.createdAtFrom,
      params?.createdAtTo,
      selected?.plansDrawingsMaster?.id,
    ],
  );

  const handleSubmitNote = useCallback(
    (comment) => {
      handleSubmit({
        plansDrawingsMasterId: selected?.plansDrawingsMaster?.id,
        remarks: selected?.remarks || '',
        comments: selected?.PDComments?.length
          ? [comment, ...selected?.PDComments]
          : [comment],
        attachments: selected?.attachments?.length
          ? [...selected?.attachments]
          : [],
        vesselId: vesselDetail?.id,
      });
      setIsVisibleNote(false);
    },
    [
      handleSubmit,
      selected?.PDComments,
      selected?.attachments,
      selected?.plansDrawingsMaster?.id,
      selected?.remarks,
      vesselDetail?.id,
    ],
  );

  const pendingCount = useMemo(
    () => (
      <div className="d-flex align-items-start">
        <div className={styles.pendingContainer}>
          <span className={styles.labelPending}>Pending</span>
          <span className={styles.valuePending}>
            {listPlanningAndDrawings?.countPending || ''}
          </span>
        </div>
        <Tooltip
          placement="bottom"
          title={
            <div className={styles.infoText}>
              Plans without attachments are considered as pending plans
            </div>
          }
          overlayClassName={styles.pendingInfoOverlay}
          overlayInnerStyle={{ width: 'fit-content' }}
          color="#E5F3FF"
        >
          <img
            src={images.icons.icPendingInfo}
            className="ms-1"
            alt="pending-info"
          />
        </Tooltip>
      </div>
    ),
    [listPlanningAndDrawings?.countPending],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      {vesselDetail && (
        <div className={styles.wrapTable}>
          <AGGridModule
            title={t('plansAndDrawing')}
            pageSizeDefault={10}
            loading={loading}
            params={params}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
            columnDefs={columnDefs}
            dataFilter={dataFilter}
            moduleTemplate={`${MODULE_TEMPLATE.vesselPlansAndDrawings}__${vesselScreeningId}`}
            fileName="Vessel Screening_Plans And Drawing"
            dataTable={dataTable}
            height="275px"
            view={viewDetail}
            getList={handleGetList}
            classNameHeader={styles.header}
            objectReview={
              <ObjectReview
                onChange={onObjectReviewFieldChange}
                table={OBJECT_REFERENCE.PLANS_AND_DRAWINGS}
                tab={TAB_REFERENCE.SHIP_PARTICULARS}
                className={styles.objectReview}
              />
            }
            buttons={pendingCount}
          />
        </div>
      )}
      <PlanningAndDrawingsForm
        loading={isLoading}
        data={selected}
        isOpen={isVisibleModal}
        title={t('plansAndDrawingInformation')}
        toggle={() => {
          setSelected(null);
          setIsEdit(false);
          setIsVisibleModal(false);
        }}
        onSubmit={handleSubmit}
        isEdit={isEdit && edit}
      />
      <ModalNoteByReviewer
        isOpen={isVisibleNote}
        toggle={() => {
          setIsVisibleNote((e) => !e);
        }}
        handleSubmitForm={handleSubmitNote}
        isEdit
      />
    </div>
  );
};

export default ListPlansAndDrawing;
