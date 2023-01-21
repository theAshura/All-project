import { FC, useCallback, useMemo, useState } from 'react';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  MODULE_TEMPLATE,
  DATE_DEFAULT,
  DATA_SPACE,
  DEFAULT_COL_DEF_TYPE_FLEX_QA,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlansAndDrawing,
  PlansAndDrawingDetailResponse,
} from 'models/api/plans-and-drawings/plans-and-drawings.model';
import { getListPlansAndDrawingMasterActions } from 'store/plans-and-drawings/plans-and-drawings.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { useParams } from 'react-router';
import Tooltip from 'antd/lib/tooltip';
import {
  getPlansAndDrawingDetailActionsApi,
  updatePlansAndDrawingDetailActionsApi,
} from 'api/plans-and-drawings.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import styles from './list.module.scss';
import ModalPlansAndDrawing from '../components/ModalPlansAndDrawing';

interface ListPlansAndDrawingProps {
  activeTab: string;
}

const ListPlansAndDrawing: FC<ListPlansAndDrawingProps> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.PLANS_AND_DRAWINGS);
  const { loading, listPlanningAndDrawings, dataFilter } = useSelector(
    (state) => state.plansAndDrawing,
  );
  const { vesselDetail } = useSelector((state) => state.vessel);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [selected, setSelected] = useState<PlansAndDrawingDetailResponse>(null);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const metadata = useVesselMetadata(styles.metadata);

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
            setIsVisibleModal(true);
          })
          .catch((e) => {
            toastError(e.message);
            setIsVisibleModal(false);
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
      setIsEdit(false);
      getDetailPlanAndDrawing(id);
    },
    [getDetailPlanAndDrawing],
  );

  const editDetail = useCallback(
    (id: string) => {
      setIsEdit(true);
      getDetailPlanAndDrawing(id);
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
    (item: PlansAndDrawing): Action[] => {
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
      ];
      return actions;
    },
    [viewDetail, editDetail],
  );

  const dataTable = useMemo(
    () =>
      listPlanningAndDrawings?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        no: index + 1,
        nameOfPlanning: item?.name || DATA_SPACE,
        remarks: item?.plansDrawings[0]?.remarks || DATA_SPACE,
        attachments: item?.plansDrawings[0]?.attachments || DATA_SPACE,
        createdAt: formatDateTime(item?.createdAt),
        createdUser: item?.createdUser?.username || DATA_SPACE,
        updatedAt: item?.plansDrawings[0]?.updatedAt
          ? formatDateTime(item?.plansDrawings[0]?.updatedAt)
          : DATA_SPACE,
        updatedUser:
          item?.plansDrawings[0]?.updatedUser?.username || DATA_SPACE,
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
        field: 'no',
        headerName: 'No',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'nameOfPlanning',
        headerName: 'Name of Plan',
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
        field: 'createdAt',
        headerName: t('createdDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: t('createdUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: t('updatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: t('updatedUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow, editDetail],
  );

  const handleSubmit = useCallback(
    (dataForm) => {
      if (selected) {
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
              createdAtFrom: dataFilter?.dateFilter[0]
                ? dataFilter?.dateFilter[0]?.toISOString()
                : DATE_DEFAULT[0].toISOString(),
              createdAtTo: dataFilter?.dateFilter[1]
                ? dataFilter?.dateFilter[1]?.toISOString()
                : DATE_DEFAULT[1].toISOString(),
            });
          });
      }
    },
    [dataFilter?.dateFilter, handleGetList, selected],
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
          placement="topLeft"
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
    <div className={styles.wrapper}>
      {metadata}
      <div className={styles.wrapperTable}>
        {vesselDetail && (
          <AGGridModule
            loading={loading}
            title={t('plansAndDrawing')}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            columnDefs={columnDefs}
            dataFilter={null}
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX_QA}
            moduleTemplate={`${MODULE_TEMPLATE.plansAndDrawing}__${vesselRequestId}`}
            fileName="SAIL Reporting_Plans And Drawing"
            dataTable={dataTable}
            height="calc(100vh - 270px)"
            view={(id) => {
              viewDetail(id);
              return true;
            }}
            getList={handleGetList}
            buttons={pendingCount}
            classNameHeader={styles.header}
          />
        )}
      </div>

      <ModalPlansAndDrawing
        data={selected}
        loading={isLoading}
        isOpen={isVisibleModal}
        title={t('plansAndDrawingInformation')}
        toggle={() => {
          setSelected(null);
          setIsEdit(false);
          setIsVisibleModal(false);
        }}
        onSubmit={handleSubmit}
        isEdit={isEdit}
      />
    </div>
  );
};

export default ListPlansAndDrawing;
