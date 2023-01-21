import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useCallback, useContext, useMemo, useState } from 'react';
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
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { useLocation, useParams } from 'react-router-dom';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import { formatDateLocalNoTime } from 'helpers/date.helper';
import { UpdateInternalInspectionRequestParams } from 'pages/vessel-screening/utils/models/internal-inspection.model';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { ModalComment } from 'pages/vessel-screening/components/ModalComment';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import {
  OBJECT_REFERENCE,
  RISK_CELL_IDS,
  TAB_REFERENCE,
} from 'pages/vessel-screening/utils/constant';
import styles from './list-internal-inpsection.module.scss';
import {
  getListVesselScreeningInternalInspectionActions,
  updateInternalInspectionRequestActions,
} from '../../store/vessel-internal-inspection.action';

interface IProps {
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListInternalInspection = ({ onObjectReviewFieldChange }: IProps) => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const { isEditVessel } = useContext(VesselScreeningContext);
  const [isShowModalComment, setIsShowModalComment] = useState<boolean>(false);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const {
    loading: loadingInternal,
    params: paramsInternal,
    listInternalInspections,
    dataFilter: dataFilterInternal,
  } = useSelector((state) => state.vesselInternalInspection);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [recordID, setRecordID] = useState('');
  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);

  const viewDetail = useCallback(
    (id: string, requestId?: string) => {
      let url = `${AppRouteConst.getVesselScreeningInternalById(
        vesselScreeningId,
        editMode ? 'edit' : 'detail',
      )}?recordStatus=detail&recordId=${id}`;

      if (requestId) {
        url += `&requestId=${requestId}`;
      }
      const win = window.open(url, '_blank');
      win.focus();
    },
    [editMode, vesselScreeningId],
  );

  const editDetail = useCallback(
    (id?: string, requestId?: string) => {
      let url = `${AppRouteConst.getVesselScreeningInternalById(
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

  const addComment = useCallback((id: string) => {
    setRecordID(id);
    setIsShowModalComment(true);
  }, []);

  const handleResetForm = useCallback(() => {
    history.push(
      `${AppRouteConst.VESSEL_SCREENING}/${
        editMode ? 'edit' : 'detail'
      }/${vesselScreeningId}?tab=inspections&subTab=other-inspections`,
    );
  }, [editMode, vesselScreeningId]);

  const getInternalList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningInternalInspectionActions.request({
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

  const handleSubmitUpdateInternal = useCallback(
    (dataForm: UpdateInternalInspectionRequestParams) => {
      dispatch(
        updateInternalInspectionRequestActions.request({
          ...dataForm,
          handleSuccess: () => {
            handleResetForm();
            getInternalList();
          },
        }),
      );
    },
    [dispatch, getInternalList, handleResetForm],
  );

  const internalDataTable = useMemo(
    () =>
      listInternalInspections?.data?.map((item) => {
        const requestDetail = item?.internalInspectionsRequests?.[0];
        const timeLoss = requestDetail?.timeLoss ? 'Yes' : 'No';
        return {
          id: item?.id,
          refId: item?.refId || DATA_SPACE,
          internalInspectionsRequestId: requestDetail?.id || null,
          eventType: item?.eventType?.name || DATA_SPACE,
          inspectionDateFrom: item?.inspectionDateFrom
            ? formatDateLocalNoTime(item?.inspectionDateFrom)
            : DATA_SPACE,
          inspectionDateTo: item?.inspectionDateTo
            ? formatDateLocalNoTime(item?.inspectionDateTo)
            : DATA_SPACE,
          nextInspectionDue: item?.nextInspectionDue
            ? formatDateLocalNoTime(item?.nextInspectionDue)
            : DATA_SPACE,
          potentialRisk: requestDetail?.potentialRisk,
          observedRisk: requestDetail?.observedRisk,
          timeLoss:
            !requestDetail ||
            requestDetail?.timeLoss === undefined ||
            requestDetail?.timeLoss === null
              ? DATA_SPACE
              : timeLoss,
          comment: requestDetail?.IIRComments?.[0]?.comment || DATA_SPACE,
        };
      }),
    [listInternalInspections],
  );

  const internalColumnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: 'Action',
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () =>
                data &&
                viewDetail(data?.id, data?.internalInspectionsRequestId),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
              cssClass: 'me-1',
            },
          ];
          if (isEditVessel) {
            const extraActions = [
              {
                img: images.icons.icEdit,
                function: () => data && editDetail(data?.id),
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.VESSEL_SCREENING,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'me-1',
              },
              {
                img: images.icons.icComment,
                function: () => data && addComment(data?.id),
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
        field: 'refId',
        headerName: 'Ref.ID',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eventType',
        headerName: t('tableHeaders.eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionDateFrom',
        headerName: t('tableHeaders.inspectionDateFrom'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionDateTo',
        headerName: t('tableHeaders.inspectionDateTo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'nextInspectionDue',
        headerName: t('tableHeaders.nextInspectionDue'),
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
    [addComment, editDetail, isEditVessel, isMultiColumnFilter, t, viewDetail],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      const item = listInternalInspections?.data?.find(
        (el) => el?.id === recordID,
      );
      const internalRequestDetail = item?.internalInspectionsRequests?.[0];
      handleSubmitUpdateInternal?.({
        id: vesselScreeningId,
        data: {
          internalInspectionsId: item?.id,
          vesselScreeningId,
          potentialRisk: internalRequestDetail?.potentialRisk,
          potentialScore: internalRequestDetail?.potentialScore,
          observedRisk: internalRequestDetail?.observedRisk,
          observedScore: internalRequestDetail?.observedScore,
          timeLoss: internalRequestDetail
            ? internalRequestDetail.timeLoss
            : null,
          comments: [comment, ...(internalRequestDetail?.IIRComments ?? [])],
        },
      });

      setIsShowModalComment(false);
      setRecordID('');
    },
    [
      handleSubmitUpdateInternal,
      listInternalInspections?.data,
      recordID,
      vesselScreeningId,
    ],
  );

  return (
    <>
      <AGGridModule
        pageSizeDefault={10}
        loading={loadingInternal}
        params={paramsInternal}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={internalColumnDefs}
        dataFilter={dataFilterInternal}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningInspectionInternal}__${vesselScreeningId}`}
        fileName="Vessel Screening_Internal Inspection"
        dataTable={internalDataTable}
        height="395px"
        view={(id, item) => {
          if (!isShowModalComment) {
            viewDetail(id, item?.einternalInspectionsRequestId);
          }
          return true;
        }}
        getList={getInternalList}
        preventRowEventWhenClickOn={isEditVessel ? RISK_CELL_IDS : null}
        datePickerClassName={styles.datePickerReview}
        objectReview={
          <ObjectReview
            onChange={onObjectReviewFieldChange}
            table={OBJECT_REFERENCE.INTERNAL_INSPECTIONS_AUDITS}
            tab={TAB_REFERENCE.INSPECTIONS}
            className={styles.objectReview}
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalComment
        isOpen={isShowModalComment}
        toggle={() => {
          setIsShowModalComment((e) => !e);
          setRecordID('');
        }}
        handleSubmitForm={handleSubmitComment}
        isEdit
      />
    </>
  );
};

export default ListInternalInspection;
