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
import { Vessel } from 'models/api/condition-of-class/condition-of-class.model';
import { ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { formatDateTimeDay } from 'helpers/utils.helper';
import { useLocation, useParams } from 'react-router-dom';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import { UpdateExternalInspectionRequestParams } from 'pages/vessel-screening/utils/models/external-inspection.model';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { ModalComment } from 'pages/vessel-screening/components/ModalComment';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import {
  OBJECT_REFERENCE,
  RISK_CELL_IDS,
  TAB_REFERENCE,
} from 'pages/vessel-screening/utils/constant';
import styles from './list-external-inspection.module.scss';
import {
  getListVesselScreeningExternalInspectionActions,
  updateExternalInspectionRequestActions,
} from '../../store/vessel-external-inspection.action';

interface IProps {
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListExternalInspection = ({ onObjectReviewFieldChange }: IProps) => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const { isEditVessel } = useContext(VesselScreeningContext);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isShowModalComment, setIsShowModalComment] = useState<boolean>(false);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const {
    loading: loadingExternal,
    params: paramsExternal,
    listExternalInspections,
    dataFilter: dataFilterExternal,
  } = useSelector((state) => state.vesselExternalInspection);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [recordID, setRecordID] = useState('');
  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);

  const viewDetail = useCallback(
    (id: string, requestId?: string) => {
      let url = `${AppRouteConst.getVesselScreeningExternalById(
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
      let url = `${AppRouteConst.getVesselScreeningExternalById(
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

  const getExternalList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningExternalInspectionActions.request({
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

  const externalDataTable = useMemo(
    () =>
      listExternalInspections?.data?.map((item, index) => {
        const requestDetail = item?.externalInspectionsRequests?.[0];
        const timeLoss = requestDetail?.timeLoss ? 'Yes' : 'No';
        return {
          id: item.id || DATA_SPACE,
          refId: item?.refId || DATA_SPACE,
          externalInspectionsRequestId: requestDetail?.id || null,
          eventType: item.eventType.name,
          dateOfInspection: item?.dateOfInspection
            ? formatDateTimeDay(item?.dateOfInspection)
            : DATA_SPACE,
          total: item.externalInspectionReports.length || DATA_SPACE,
          totalOpenFindings:
            item.externalInspectionReports.filter(
              (item) => item.status === 'Open',
            )?.length || DATA_SPACE,
          updatedAt: item?.updatedAt
            ? formatDateTimeDay(item?.updatedAt)
            : DATA_SPACE,
          potentialRisk: requestDetail?.potentialRisk,
          observedRisk: requestDetail?.observedRisk,
          timeLoss:
            !requestDetail ||
            requestDetail?.timeLoss === undefined ||
            requestDetail?.timeLoss === null
              ? DATA_SPACE
              : timeLoss,
          comment: requestDetail?.EIRComments?.[0]?.comment || DATA_SPACE,
          vessel: item?.vessel,
          createdAt: item?.createdAt,
        };
      }) || [],
    [listExternalInspections?.data],
  );

  const handleSubmitUpdateExternal = useCallback(
    (dataForm: UpdateExternalInspectionRequestParams) => {
      dispatch(
        updateExternalInspectionRequestActions.request({
          ...dataForm,
          handleSuccess: () => {
            handleResetForm();
            getExternalList();
          },
        }),
      );
    },
    [dispatch, getExternalList, handleResetForm],
  );

  const canCurrentUserEdit = useCallback(
    (createdAt?: string | Date, vessel?: Vessel) =>
      vessel
        ? checkDocHolderChartererVesselOwner(
            {
              createdAt,
              vesselCharterers: vessel?.vesselCharterers || [],
              vesselDocHolders: vessel?.vesselOwners || [],
              vesselOwners: vessel?.vesselDocHolders || [],
            },
            userInfo,
          )
        : false,
    [userInfo],
  );

  const externalColumnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('tableHeaders.action'),
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
              function: () => {
                if (data) {
                  viewDetail(data?.id, data?.externalInspectionsRequestId);
                }
              },
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
          ];
          if (isEditVessel) {
            const extraActions = [
              canCurrentUserEdit(data?.createdAt, data?.vessel as Vessel) && {
                img: images.icons.icEdit,
                function: () =>
                  data &&
                  editDetail(data?.id, data?.externalInspectionsRequestId),
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.VESSEL_SCREENING,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'me-1',
              },
              {
                img: images.icons.icComment,
                function: () => {
                  if (data) {
                    addComment(data?.id);
                  }
                },
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
        headerName: t('tableHeaders.refId'),
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
        field: 'dateOfInspection',
        headerName: t('tableHeaders.inspectionDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'total',
        headerName: t('tableHeaders.totalFindings'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'totalOpenFindings',
        headerName: t('tableHeaders.openFindings'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'updatedAt',
        headerName: t('tableHeaders.updatedAt'),
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
    [
      addComment,
      editDetail,
      isEditVessel,
      isMultiColumnFilter,
      t,
      viewDetail,
      canCurrentUserEdit,
    ],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      const item = listExternalInspections?.data?.find(
        (el) => el?.id === recordID,
      );
      const externalRequestDetail = item?.externalInspectionsRequests?.[0];
      handleSubmitUpdateExternal?.({
        id: vesselScreeningId,
        data: {
          externalInspectionsId: item?.id,
          vesselScreeningId,
          potentialRisk: externalRequestDetail?.potentialRisk,
          potentialScore: externalRequestDetail?.potentialScore,
          observedRisk: externalRequestDetail?.observedRisk,
          observedScore: externalRequestDetail?.observedScore,
          timeLoss: externalRequestDetail
            ? externalRequestDetail.timeLoss
            : null,
          comments: [comment, ...(externalRequestDetail?.EIRComments ?? [])],
        },
      });

      setIsShowModalComment(false);
      setRecordID('');
    },
    [
      handleSubmitUpdateExternal,
      listExternalInspections?.data,
      recordID,
      vesselScreeningId,
    ],
  );

  return (
    <>
      <AGGridModule
        loading={loadingExternal}
        params={paramsExternal}
        pageSizeDefault={10}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={externalColumnDefs}
        dataFilter={dataFilterExternal}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningInspectionExternal}__${vesselScreeningId}`}
        fileName="Vessel Screening_External Inspection"
        dataTable={externalDataTable}
        height="395px"
        view={(id, item) => {
          if (!isShowModalComment) {
            viewDetail(id, item?.externalInspectionsRequestId);
          }
          return true;
        }}
        getList={getExternalList}
        preventRowEventWhenClickOn={isEditVessel ? RISK_CELL_IDS : null}
        datePickerClassName={styles.datePickerReview}
        objectReview={
          <ObjectReview
            onChange={onObjectReviewFieldChange}
            table={OBJECT_REFERENCE.EXTERNAL_INSPECTIONS}
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

export default ListExternalInspection;
