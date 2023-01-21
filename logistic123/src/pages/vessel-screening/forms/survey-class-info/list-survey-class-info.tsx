import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
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
import { formatDateTime, formatDateTimeDay } from 'helpers/utils.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailSurveyClassInfo } from 'store/survey-class-info/survey-class-info.action';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  getListVesselSurveysClassInfoActions,
  updateVesselSurveysClassInfoActions,
} from 'pages/vessel-screening/store/vessel-surveys-class-info.action';
import { useLocation, useParams } from 'react-router';
import { VesselScreeningSurveyClassInfo } from 'pages/vessel-screening/utils/models/vessel-surveys-class-info.model';
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
import ModalSurveyClassInfo from './components/modal-survey-class-info';
import styles from './list-survey-class-info.module.scss';

export interface VesselScreeningSurveyClassInfoExtends
  extends VesselScreeningSurveyClassInfo {
  index: number;
}

interface IProps {
  getObjectReview: () => void;
  onObjectReviewFieldChange: (params: IOnChangeParams) => void;
}

const ListSurveyClassInfo = ({
  getObjectReview,
  onObjectReviewFieldChange,
}: IProps) => {
  const { t } = useTranslation(I18nNamespace.SURVEY_CLASS_INFO);
  const {
    loading,
    params,
    dataFilter,
    list: surveyClassInfoData,
  } = useSelector((state) => state.vesselSurveysClassInfo);
  const { pathname } = useLocation();
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [detailSurvey, setDetailSurvey] =
    useState<VesselScreeningSurveyClassInfoExtends>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isVisibleComment, setIsVisibleComment] = useState<boolean>(false);
  const dispatch = useDispatch();

  const isEditVessel = useMemo(() => pathname.includes('edit'), [pathname]);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselSurveysClassInfoActions.request({
          ...newParams,
          pageSize: -1,
          id: vesselScreeningId,
        }),
      );
    },
    [dispatch, vesselScreeningId],
  );

  const getItemSelected = useCallback(
    (listData: VesselScreeningSurveyClassInfo[], id: string) => {
      let dataResult: VesselScreeningSurveyClassInfoExtends = null;

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
      const itemDetail = getItemSelected(surveyClassInfoData?.list?.data, id);
      setDetailSurvey(itemDetail);
      setIsEdit(true);
      dispatch(getDetailSurveyClassInfo.request(id));
    },
    [dispatch, getItemSelected, surveyClassInfoData?.list?.data],
  );

  const viewDetail = useCallback(
    (id?: string) => {
      const itemDetail = getItemSelected(surveyClassInfoData?.list?.data, id);
      setDetailSurvey(itemDetail);
      setIsEdit(false);
      dispatch(getDetailSurveyClassInfo.request(id));
      setIsVisibleModal(true);
      return true;
    },
    [dispatch, getItemSelected, surveyClassInfoData?.list?.data],
  );

  const addComment = useCallback(
    (id: string) => {
      const itemDetail = getItemSelected(surveyClassInfoData?.list?.data, id);
      setIsVisibleComment(true);
      setDetailSurvey(itemDetail);
    },
    [surveyClassInfoData?.list?.data, getItemSelected],
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

  const handleSubmitForm = useCallback(
    (dataForm, successCB?: any) => {
      dispatch(
        updateVesselSurveysClassInfoActions.request({
          id: vesselScreeningId,
          data: {
            ...dataForm,
            vesselScreeningId,
          },
          handleSuccess: () => {
            getObjectReview();
            setDetailSurvey(null);
            setIsEdit(false);
            setIsVisibleModal(false);
            handleGetList();
            successCB?.();
          },
        }),
      );
    },
    [dispatch, getObjectReview, handleGetList, vesselScreeningId],
  );

  const handleSubmitComment = useCallback(
    (comment) => {
      const {
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        SCRComments,
      } = detailSurvey?.surveyClassInfoRequests?.[0] || {};

      handleSubmitForm({
        potentialRisk,
        potentialScore,
        observedRisk,
        observedScore,
        timeLoss,
        surveyClassInfoId: detailSurvey?.id,
        comments: [comment, ...(SCRComments ?? [])],
      });
      setIsVisibleComment(false);
    },
    [detailSurvey?.id, detailSurvey?.surveyClassInfoRequests, handleSubmitForm],
  );

  const dataTable = useMemo(
    () =>
      surveyClassInfoData?.list?.data?.map((item, index) => {
        const requestDetail = item?.surveyClassInfoRequests?.[0];

        return {
          id: item.id || DATA_SPACE,
          eventType: item.eventType?.name || DATA_SPACE,
          issueDate: item?.issueDate
            ? formatDateTimeDay(item?.issueDate)
            : DATA_SPACE,
          authority: item?.authority?.name || DATA_SPACE,
          anyExpiredCertificates: item?.anyExpiredCertificates ? 'Yes' : 'No',
          remarks: item?.remarks ?? '',
          anyOpenCOC: item?.anyOpenCOC ? 'Yes' : 'No',
          cocRemarks: item?.cocRemarks || '',
          surveyClassInfoRequests: item?.surveyClassInfoRequests || [],
          attachments: item?.attachments,
          updatedAt: item?.updatedAt
            ? formatDateTime(item?.updatedAt)
            : DATA_SPACE,
          vesselName: item?.vesselId || DATA_SPACE,
          imoNumber: item?.vesselId || DATA_SPACE,
          potentialRisk:
            RISK_VALUE_TO_LEVEL[requestDetail?.potentialRisk] ?? null,
          observedRisk:
            RISK_VALUE_TO_LEVEL[requestDetail?.observedRisk] ?? null,
          timeLoss: isNil(requestDetail?.timeLoss)
            ? DATA_SPACE
            : TIMELOSS_VALUE_TO_LABEL[requestDetail?.timeLoss?.toString()],
          comment: requestDetail?.SCRComments?.[0]?.comment || DATA_SPACE,
          isEdit: isEditVessel,
        };
      }) || [],
    [isEditVessel, surveyClassInfoData?.list?.data],
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
        headerName: t('eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'issueDate',
        headerName: t('issueDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'authority',
        headerName: t('authority'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'anyExpiredCertificates',
        headerName: t('anyExpiredCertificates'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },

      {
        field: 'anyOpenCOC',
        headerName: t('anyOpenCOC'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'potentialRisk',
        headerName: 'Potential Risk',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        minWidth: 200,
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
        minWidth: 200,
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
            surveyClassInfoData?.list?.data,
            data?.id,
          );
          const { potentialScore, potentialRisk, timeLoss, SCRComments } =
            item?.surveyClassInfoRequests?.[0] || {};

          handleSubmitForm({
            potentialRisk,
            potentialScore,
            observedRisk: RISK_LEVEL_TO_VALUE[data?.observedRisk] ?? null,
            observedScore: RISK_LEVEL_TO_SCORE[data?.observedRisk] ?? null,
            timeLoss,
            surveyClassInfoId: item?.id,
            comments: SCRComments?.length ? SCRComments : null,
          });
        },
      },
      {
        field: 'timeLoss',
        minWidth: 100,
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
            surveyClassInfoData?.list?.data,
            data?.id,
          );
          const {
            potentialScore,
            potentialRisk,
            observedScore,
            observedRisk,
            SCRComments,
          } = item?.surveyClassInfoRequests?.[0] || {};

          handleSubmitForm({
            potentialRisk,
            potentialScore,
            observedRisk,
            observedScore,
            timeLoss: TIMELOSS_LABEL_TO_VALUE[data?.timeLoss] ?? null,
            surveyClassInfoId: item?.id,
            comments: SCRComments?.length ? SCRComments : null,
          });
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
      checkWorkflow,
      getItemSelected,
      handleSubmitForm,
      isEditVessel,
      isMultiColumnFilter,
      surveyClassInfoData?.list?.data,
      t,
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
        moduleTemplate={`${MODULE_TEMPLATE.vesselScreeningSurveyClass}__${vesselScreeningId}`}
        fileName="Vessel Screening_Survey Class Info"
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
            table={OBJECT_REFERENCE.SURVEY_CLASS_INFO}
            tab={TAB_REFERENCE.TECHNICAL}
            className={styles.objectReview}
            showOnly
          />
        }
        classNameHeader={styles.header}
        isQuickSearchDatePicker
      />
      <ModalSurveyClassInfo
        data={detailSurvey}
        isOpen={isVisibleModal}
        title="Survey/Class Info Information"
        toggle={() => {
          setDetailSurvey(null);
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

export default ListSurveyClassInfo;
