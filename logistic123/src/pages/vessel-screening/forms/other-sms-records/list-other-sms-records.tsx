import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { ButtonType } from 'components/ui/button/Button';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import moment from 'moment';
import { useParams } from 'react-router';
import {
  getListVesselScreeningOtherSMSActions,
  getOtherSMSRequestDetailActions,
  updateOtherSMSRequestActions,
} from 'pages/vessel-screening/store/vessel-other-sms.action';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import { getSmsDetailActions, clearSmsReducer } from 'store/sms/sms.action';
import { UpdateOtherSMSRequestParams } from 'pages/vessel-screening/utils/models/other-sms.model';
import { ModalComment } from 'pages/vessel-screening/components/ModalComment';
import ObjectReview, {
  IOnChangeParams,
} from 'pages/vessel-screening/components/object-review/object-review';
import {
  OBJECT_REFERENCE,
  RISK_CELL_IDS,
  TAB_REFERENCE,
} from 'pages/vessel-screening/utils/constant';
import styles from './list-other-sms-records.module.scss';
import ModalSms from './components/modal-sms';

interface IProps {
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListOtherSMSRecords = ({ onObjectReviewFieldChange }: IProps) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const [sno, setSno] = useState<number>(1);
  const { loading, listOtherSMS, params, dataFilter, otherSMSRequestDetail } =
    useSelector((state) => state.vesselOtherSMS);
  const { smsDetail } = useSelector((state) => state.smsRecord);
  const { isEditVessel } = useContext(VesselScreeningContext);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningOtherSMSActions.request({
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

  const dataTable = useMemo(
    () =>
      listOtherSMS?.data?.map((item, index) => {
        const requestDetail = item?.otherSmsRecordsRequests?.[0];
        const timeLoss = requestDetail?.timeLoss ? 'Yes' : 'No';
        return {
          sno: index + 1,
          id: item.id || DATA_SPACE,
          otherSMSRequestId: requestDetail?.id ?? null,
          eventType: item?.eventType?.name || DATA_SPACE,
          recordDate:
            moment(item?.recordDate).format('DD/MM/YYYY') || DATA_SPACE,
          anySpecialPointsToNote: item?.techIssueNote?.name || DATA_SPACE,
          pendingAction: item?.pendingAction || DATA_SPACE,
          targetCloseDate:
            moment(item?.targetCloseDate).format('DD/MM/YYYY') || DATA_SPACE,
          actionStatus: item?.actionStatus || DATA_SPACE,
          actualCloseDate:
            moment(item?.actualCloseDate).format('DD/MM/YYYY') || DATA_SPACE,
          potentialRisk: requestDetail?.potentialRisk ?? '',
          observedRisk: requestDetail?.observedRisk ?? '',
          timeLoss:
            !requestDetail ||
            requestDetail?.timeLoss === undefined ||
            requestDetail?.timeLoss === null
              ? DATA_SPACE
              : timeLoss,
          comment: requestDetail?.OSRRComments?.[0]?.comment || DATA_SPACE,
        };
      }),
    [listOtherSMS?.data],
  );

  const handleGetDetail = useCallback(
    (id: string, otherSMSRequestId?: string) => {
      dispatch(getSmsDetailActions.request(id));
      if (otherSMSRequestId) {
        dispatch(
          getOtherSMSRequestDetailActions.request({
            vesselScreeningId,
            id: otherSMSRequestId,
          }),
        );
      }
    },
    [dispatch, vesselScreeningId],
  );

  const viewDetail = useCallback(
    (id?: string) => {
      const itemDetail = dataTable.find((i) => i.id === id);
      handleGetDetail(id, itemDetail?.otherSMSRequestId);
      setSno(itemDetail?.sno);
      setIsEdit(false);
      setVisibleModal(true);
      return true;
    },
    [dataTable, handleGetDetail],
  );

  const editDetail = useCallback(
    (id?: string) => {
      const itemDetail = dataTable.find((i) => i.id === id);
      handleGetDetail(id, itemDetail?.otherSMSRequestId);
      setSno(itemDetail?.sno);
      setIsEdit(true);
      setVisibleModal(true);
    },
    [dataTable, handleGetDetail],
  );

  const addComment = useCallback(
    (id: string) => {
      const itemDetail = dataTable.find((i) => i.id === id);
      handleGetDetail(id, itemDetail?.otherSMSRequestId);
      setSno(itemDetail?.sno);
      setIsEdit(false);
      setIsVisibleComment(true);
    },
    [dataTable, handleGetDetail],
  );

  const handleAfterSubmitForm = useCallback(
    (otherSmsRecordsId?: string) => {
      setVisibleModal(false);
      setIsEdit(false);
      setSno(1);
      setIsVisibleComment(false);
      handleGetList();
      dispatch(clearSmsReducer());
      if (otherSmsRecordsId) {
        dispatch(
          getOtherSMSRequestDetailActions.request({
            vesselScreeningId,
            id: otherSmsRecordsId,
          }),
        );
      } else {
        dispatch(getOtherSMSRequestDetailActions.success(null));
      }
    },
    [dispatch, handleGetList, vesselScreeningId],
  );

  const handleSubmit = useCallback(
    (dataForm: UpdateOtherSMSRequestParams, otherSmsRecordsId?: string) => {
      dispatch(
        updateOtherSMSRequestActions.request({
          ...dataForm,
          handleSuccess: !otherSmsRecordsId
            ? handleAfterSubmitForm
            : () => handleAfterSubmitForm(otherSmsRecordsId),
        }),
      );
    },
    [dispatch, handleAfterSubmitForm],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      handleSubmit({
        id: vesselScreeningId,
        data: {
          otherSmsRecordsId: smsDetail?.id ?? null,
          vesselScreeningId,
          potentialRisk: otherSMSRequestDetail?.potentialRisk ?? null,
          potentialScore: otherSMSRequestDetail?.potentialScore ?? null,
          observedRisk: otherSMSRequestDetail?.observedRisk ?? null,
          observedScore: otherSMSRequestDetail?.observedScore ?? null,
          timeLoss: otherSMSRequestDetail
            ? otherSMSRequestDetail?.timeLoss
            : null,
          comments: [comment, ...(otherSMSRequestDetail?.OSRRComments ?? [])],
        },
      });
    },
    [handleSubmit, otherSMSRequestDetail, smsDetail?.id, vesselScreeningId],
  );

  const columnDefs = useMemo(
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
        field: 'recordDate',
        headerName: t('table.recordDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'anySpecialPointsToNote',
        headerName: t('table.anySpecialPointsToNote'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'pendingAction',
        headerName: t('table.pendingAction'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'targetCloseDate',
        headerName: t('table.targetCloseDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actionStatus',
        headerName: t('table.actionStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'actualCloseDate',
        headerName: t('table.actualCloseDate'),
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

  return (
    <>
      <AGGridModule
        pageSizeDefault={10}
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={dataFilter}
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningOtherSMSRecords}__${vesselScreeningId}`}
        fileName="Vessel Screening_Other SMS Records"
        dataTable={dataTable}
        height="395px"
        view={viewDetail}
        getList={handleGetList}
        preventRowEventWhenClickOn={isEditVessel ? RISK_CELL_IDS : null}
        datePickerClassName={styles.datePickerReview}
        objectReview={
          <ObjectReview
            onChange={onObjectReviewFieldChange}
            table={OBJECT_REFERENCE.OTHER_SMS_RECORDS}
            tab={TAB_REFERENCE.SAFETY_MANAGEMENT}
            className={styles.objectReview}
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalSms
        title={t('sms.smsInformation')}
        isOpen={visibleModal}
        toggle={() => {
          setVisibleModal((e) => !e);
          setIsEdit(false);
        }}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        no={sno}
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

export default ListOtherSMSRecords;
