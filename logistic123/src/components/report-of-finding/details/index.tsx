import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  getFillAuditCheckListByPlanningAndRequestActionsApi,
  getListNCPreviousOpenActionsApi,
  pdfROFActionsApi,
  updateReportOfFindingCloseoutStatusActionsApi,
  updateReportOfFindingReassignActionsApi,
  updateReportOfFindingStatusActionsApi,
} from 'api/report-of-finding.api';
import images from 'assets/images/images';
import cx from 'classnames';
import useEffectOnce from 'hoc/useEffectOnce';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import NoPermissionComponent from 'containers/no-permission/index';
import Container from 'components/common/container/ContainerPage';
import PopoverStatus from 'components/audit-checklist/common/popover-status/PopoverStatus';
import { StepStatus, Item } from 'components/common/step-line/lineStepCP';
import Button, { ButtonType } from 'components/ui/button/Button';
import { tz } from 'moment-timezone';
import {
  ActivePermission,
  CommonQuery,
  WorkFlowType,
} from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import * as yup from 'yup';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { UpdateReportOfFindingParams } from 'models/api/report-of-finding/report-of-finding.model';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import {
  getReportOfFindingDetailActions,
  updateReportOfFindingActions,
} from 'store/report-of-finding/report-of-finding.action';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import ModalSendMail from 'components/mail-creation/modal-send-mail/ModalSendMail';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROF_STATUES } from 'constants/rof.const';
import { getPlanningAndRequestDetailActions } from 'store/planning-and-request/planning-and-request.action';
import {
  formatDateTimeDay,
  handleAndDownloadFilePdf,
} from 'helpers/utils.helper';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import {
  MAIL_MODULES_IDS,
  MAIL_TYPES_IDS,
} from 'constants/planning-and-request.const';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import styles from './detail.module.scss';
import ReportOfFindingForm from '../forms/ReportOfFindingForm';
import { ModalNCOfPreviousAudit } from '../forms/modal/ModalNCOfPreviousAudit';
import CheckListModal from '../forms/modal/ModalCheckList';

// import useWorkflowPermission from '../../../hoc/useWorkflowPermission';

enum ReportOfFindingStatus {
  REASSIGNED = 'Reassigned',
  REVIEWED = 'Reviewed',
  CLOSE_OUT = 'Close out',
}
interface PreviousNCFindings {
  id: string;
  auditNumber: string;
  auditDate: string;
  auditName: string;
  findingComment: string;
  findingRemark: string;
  isVerify: boolean;
  isOpen: boolean;
}

export default function ReportOfFindingDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.REPORT_OF_FINDING,
    I18nNamespace.COMMON,
  ]);
  const [modalActionVisible, openModalActions] = useState<boolean>(false);
  const [modalNC, openModalNC] = useState<boolean>(false);
  const { ReportOfFindingDetail, loading } = useSelector(
    (state) => state.reportOfFinding,
  );
  // const workflowCapCar = useWorkflowPermission(WorkFlowType.CAR_CAP);
  const [checklistAttachments, setChecklistAttachment] = useState<string[]>([]);
  const [checkListView, setCheckListView] = useState<boolean>(false);
  const [listPreviousAudit, setListPreviousAudit] = useState<
    PreviousNCFindings[]
  >([]);

  const [listCheckView, setListCheckView] = useState([]);
  const [loadingExport, setExportLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [modalSendEmailVisible, setModalSendEmailVisible] = useState(false);
  const [loadingAfterSubmit, setLoadingAfterSubmit] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionReportOfFinding,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { PlanningAndRequestDetail } = useSelector(
    (state) => state.planningAndRequest,
  );
  const reviewAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        ReportOfFindingDetail?.userAssignments,
      ),
    [ReportOfFindingDetail?.userAssignments, userInfo?.id],
  );
  const closeOutAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.CLOSE_OUT,
        ReportOfFindingDetail?.userAssignments,
      ),
    [ReportOfFindingDetail?.userAssignments, userInfo?.id],
  );

  const defaultValues = {
    remarks: '',
  };

  const schema = yup.object().shape({
    remarks: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const { setValue } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const DEFAULT_ITEMS: Item[] = [
    {
      id: 'draft',
      name: t('statusPlan.txDraft'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'submitted',
      name: t('statusPlan.txSubmitted'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'reviewed',
      name: t('statusPlan.txReviewed'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'closeOut',
      name: t('statusPlan.txCloseOut'),
      status: StepStatus.INACTIVE,
    },
  ];
  const stepReject = (previousStep: string) => {
    switch (previousStep) {
      case ROF_STATUES.SUBMITTED:
        return 2;
      case ROF_STATUES.REVIEWED:
        return 3;
      default:
        return 2;
    }
  };

  const findHistoryByStatus = (status: string) => {
    const statusHistory = ReportOfFindingDetail?.reportFindingHistories || [];

    const historyFiltered = statusHistory.filter(
      (item) =>
        String(item.status).toLowerCase() === String(status).toLowerCase(),
    );
    const dataPopulated = historyFiltered.map((item) => ({
      datetime: item?.updatedAt,
      description: item?.createdUser?.username,
      name: item?.createdUser?.jobTitle,
    }));
    return dataPopulated;
  };

  const stepStatusItems = () => {
    const items: Item[] = DEFAULT_ITEMS;
    switch (ReportOfFindingDetail?.status) {
      case ROF_STATUES.DRAFT: {
        const newItems = items.map((i, index) => {
          if (index < 1) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.name),
            };
          }
          return i;
        });
        return newItems;
      }

      case ROF_STATUES.SUBMITTED: {
        const newItems = items.map((i, index) => {
          if (index < 2) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.name),
            };
          }
          return i;
        });
        return newItems;
      }
      case ROF_STATUES.REVIEWED: {
        const newItems = items.map((i, index) => {
          if (index < 3) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.name),
            };
          }
          return i;
        });
        return newItems;
      }

      case ROF_STATUES.CLOSE_OUT: {
        const newItems = items.map((i, index) => {
          if (index < 4) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.name),
            };
          }
          return i;
        });
        return newItems;
      }
      case ROF_STATUES.REASSIGNED: {
        const findingHistories =
          ReportOfFindingDetail?.reportFindingHistories || [];
        const latestStatus = findingHistories[1]?.status;
        const step = stepReject(latestStatus);

        const newItems = items.map((i, index) => {
          if (index < step) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.name),
            };
          }
          if (index === step) {
            return {
              ...i,
              status: StepStatus.ERROR,
              info: findHistoryByStatus(i.name),
            };
          }
          return i;
        });
        return newItems;
      }

      default:
        return items;
    }
  };

  const handleSaveDraft = useCallback(
    (formData) => {
      const timezone = tz.guess();
      const { reportFindingItems, officeComments } = formData;
      const previousNCFindingsAudit = listPreviousAudit?.map((item) => ({
        id: item?.id,
        isVerify: item?.isVerify,
        isOpen: item?.isOpen,
      }));

      const newItem = reportFindingItems?.map((item) => ({
        id: item?.id || undefined,
        natureFindingId: item?.natureFindingId,
        auditTypeId: item?.auditTypeId,
        isSignificant: item?.isSignificant || false,
        findingRemark: item?.findingRemark,
        findingComment: item?.findingComment,
        reference: item?.reference || 'N/A',
        mainCategoryId: item?.mainCategoryId,
        secondCategoryId: item?.secondCategoryId,
        viqId: item?.viqId,
        departmentId: item?.departmentId,
        rectifiedOnBoard: item?.rectifiedOnBoard,
        findingAttachments: item?.findingAttachments || [],
      }));

      const dataSaveDraft = {
        timezone,
        checklistAttachments,
        reportFindingItems: newItem,
        attachments: [],
        previousNCFindings: previousNCFindingsAudit,
        officeComments,
        isSubmit: false,
      };
      const finalParams: UpdateReportOfFindingParams = {
        id,
        body: dataSaveDraft,
      };
      dispatch(updateReportOfFindingActions.request(finalParams));
    },
    [dispatch, id, checklistAttachments, listPreviousAudit],
  );

  const handleSubmit = useCallback(
    (formData) => {
      const timezone = tz.guess();
      const { reportFindingItems, officeComments, userAssignment } = formData;

      const previousNCFindingsAudit = listPreviousAudit?.map((item) => ({
        id: item?.id,
        isVerify: item?.isVerify,
        isOpen: item?.isOpen,
      }));
      const newItem = reportFindingItems?.map((item) => ({
        id: item?.id || undefined,
        natureFindingId: item?.natureFindingId,
        auditTypeId: item?.auditTypeId,
        isSignificant: item?.isSignificant || false,
        findingRemark: item?.findingRemark,
        findingComment: item?.findingComment,
        reference: item?.reference || 'N/A',
        mainCategoryId: item?.mainCategoryId,
        secondCategoryId: item?.secondCategoryId,
        viqId: item?.viqId,
        departmentId: item?.departmentId,
        rectifiedOnBoard: item?.rectifiedOnBoard,
        findingAttachments: item?.findingAttachments?.length
          ? item?.findingAttachments
          : [],
      }));

      const dataSubmit = {
        timezone,
        checklistAttachments,
        attachments: [],
        reportFindingItems: newItem,
        previousNCFindings: previousNCFindingsAudit,
        officeComments,
        userAssignment,
        isSubmit: true,
      };
      const finalParams: UpdateReportOfFindingParams = {
        id,
        body: dataSubmit,
      };
      dispatch(updateReportOfFindingActions.request(finalParams));
    },
    [dispatch, id, checklistAttachments, listPreviousAudit],
  );

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    dispatch(getReportOfFindingDetailActions.request(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (ReportOfFindingDetail?.planningRequestId) {
      dispatch(
        getPlanningAndRequestDetailActions.request(
          ReportOfFindingDetail?.planningRequestId,
        ),
      );
    }
  }, [ReportOfFindingDetail?.planningRequestId, dispatch]);

  useEffect(() => {
    if (!modalActionVisible) {
      setValue('remarks', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalActionVisible]);

  useEffectOnce(() => {
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.REPORT_FINDING,
        isRefreshLoading: false,
      }),
    );
  });

  useEffect(() => {
    if (ReportOfFindingDetail) {
      getListNCPreviousOpenActionsApi(ReportOfFindingDetail.id).then(
        (value) => {
          const newListPrevious = value?.data?.map((el) => ({
            id: el?.id,
            auditNumber: el?.internalAuditReport?.planningRequest.auditNo,
            auditDate: formatDateTimeDay(
              el?.internalAuditReport?.planningRequest?.auditTimeTable
                ?.actualFrom,
            ),

            auditName: el?.auditTypeName,
            findingComment: el?.findingComment,
            findingRemark: el?.findingRemark,
            isVerify: el?.isVerify || false,
            isOpen: el?.isOpen || false,
            key: el?.id,
          }));

          setListPreviousAudit(newListPrevious);
        },
      );

      getFillAuditCheckListByPlanningAndRequestActionsApi(
        ReportOfFindingDetail?.planningRequest?.id,
      ).then((result) => {
        const listCheckList = result?.data?.map((item) => ({
          id: item?.id,
          checklistNo: item?.auditChecklist?.code,
          checklistName: item?.auditChecklist?.name,
          auditType: item?.auditType?.name,
          auditTypeId: item?.auditTypeId,
        }));
        setListCheckView(listCheckList);
      });

      setChecklistAttachment(ReportOfFindingDetail?.checklistAttachments);
    }
  }, [ReportOfFindingDetail]);

  const titleModalRemark = useMemo(() => {
    switch (status) {
      case ReportOfFindingStatus.REVIEWED: {
        return 'Review';
      }
      case ReportOfFindingStatus.REASSIGNED: {
        return 'Reassign';
      }
      case ReportOfFindingStatus.CLOSE_OUT: {
        return 'Close out';
      }
      default:
        return '';
    }
  }, [status]);

  const handleChooseTemplate = () => {
    openModalNC(true);
  };

  const getPdfPlanningAndRequest = useCallback(() => {
    pdfROFActionsApi(id)
      .then(async (res) => {
        await setExportLoading(true);
        await handleAndDownloadFilePdf(res.data, 'Report of finding');
        setExportLoading(false);
      })
      .catch((e) => {
        toastError(e);
        setExportLoading(false);
      });
  }, [id]);

  const onSubmitStatus = (remark?: string, userAssignment?: any) => {
    const timezone = tz?.guess();
    setLoadingAfterSubmit(true);
    if (ReportOfFindingDetail?.status === ROF_STATUES.REVIEWED) {
      updateReportOfFindingCloseoutStatusActionsApi({
        id,
        body: {
          status: ROF_STATUES.CLOSE_OUT,
          timezone,
          workflowRemark: remark,
          userAssignment,
        },
      })
        .then((res) => {
          dispatch(getReportOfFindingDetailActions.request(id));
          toastSuccess(res.data);
          openModalActions(false);
          history.replace({ search: '' });
        })
        .catch((error) => toastError(error))
        .finally(() => {
          setLoadingAfterSubmit(false);
        });
    } else {
      updateReportOfFindingStatusActionsApi({
        id,
        body: {
          status: ROF_STATUES.REVIEWED,
          workflowRemark: remark,
          userAssignment,
        },
      })
        .then((res) => {
          dispatch(getReportOfFindingDetailActions.request(id));
          toastSuccess(res.data);
          openModalActions(false);
          history.replace({ search: '' });
        })
        .catch((error) => toastError(error))
        .finally(() => {
          setLoadingAfterSubmit(false);
        });
    }
  };
  const renderPreviousAndChecklist = useMemo(
    () => (
      <>
        <Button
          buttonType={ButtonType.Primary}
          className={cx(styles.chooseTemplate, styles.mr_08)}
          onClick={() => handleChooseTemplate()}
        >
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
              'NC and CAR of previous inspection'
            ],
          )}
        </Button>
        <Button
          buttonType={ButtonType.Primary}
          className={cx(styles.chooseTemplate)}
          onClick={() => setCheckListView(true)}
        >
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Checklist view'],
          )}
        </Button>
      </>
    ),
    [dynamicLabels],
  );

  // const allowCarPermission = useMemo(
  //   () => workflowCapCar?.length > 0,
  //   [workflowCapCar?.length],
  // );

  const isCurrentDoc = useMemo(
    () =>
      checkDocHolderChartererVesselOwner(
        {
          vesselDocHolders:
            ReportOfFindingDetail?.planningRequest?.vessel?.vesselDocHolders,
          vesselCharterers:
            ReportOfFindingDetail?.planningRequest?.vessel?.vesselCharterers,
          vesselOwners:
            ReportOfFindingDetail?.planningRequest?.vessel?.vesselOwners,
          createdAt: ReportOfFindingDetail?.createdAt,
          entityType: ReportOfFindingDetail?.entityType,
        },
        userInfo,
      ),
    [
      ReportOfFindingDetail?.createdAt,
      ReportOfFindingDetail?.entityType,
      ReportOfFindingDetail?.planningRequest?.vessel?.vesselCharterers,
      ReportOfFindingDetail?.planningRequest?.vessel?.vesselDocHolders,
      ReportOfFindingDetail?.planningRequest?.vessel?.vesselOwners,
      userInfo,
    ],
  );

  const renderEditButton = useMemo(() => {
    const isCompany =
      userInfo?.mainCompanyId === ReportOfFindingDetail?.companyId;
    if (isEdit || !isCompany || !isCurrentDoc) {
      return null;
    }
    return (
      <Button
        className={cx('ms-2', styles.mr_08, styles.buttonFilter)}
        onClick={() => {
          history.push(
            `${AppRouteConst.getReportOfFindingById(
              ReportOfFindingDetail?.id,
            )}${CommonQuery.EDIT}`,
          );
        }}
      >
        <span className="pe-2">
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Edit)}
        </span>
        <img src={images.icons.icEdit} alt="edit" className={styles.icEdit} />
      </Button>
    );
  }, [
    ReportOfFindingDetail?.companyId,
    ReportOfFindingDetail?.id,
    dynamicLabels,
    isCurrentDoc,
    isEdit,
    userInfo?.mainCompanyId,
  ]);

  const backButton = useMemo(
    () => (
      <Button
        onClick={() => history.push(AppRouteConst.REPORT_OF_FINDING)}
        buttonType={ButtonType.CancelOutline}
        className={cx('ms-2', styles.buttonFilter, styles.mr_08)}
      >
        Back
      </Button>
    ),
    [],
  );

  const renderWatchIcon = useMemo(
    () => (
      <WatchListManagement
        dynamicLabels={dynamicLabels}
        referenceId={id}
        referenceModuleName={WatchlistModuleEnum.REPORT_FINDING}
        referenceRefId={ReportOfFindingDetail?.refNo}
      />
    ),
    [id, ReportOfFindingDetail?.refNo, dynamicLabels],
  );

  const renderActionsWithReassignCase = useMemo(() => {
    const isCreatorWorkFlow = workFlowActiveUserPermission?.includes(
      ActivePermission.CREATOR,
    );
    const isReviewerWorkFlow = workFlowActiveUserPermission?.includes(
      ActivePermission.REVIEWER,
    );
    if (
      ReportOfFindingDetail?.status === ROF_STATUES.DRAFT &&
      isCreatorWorkFlow
    ) {
      return (
        <div className={styles.flex}>
          {renderWatchIcon}
          {backButton}
          {renderPreviousAndChecklist}
          {renderEditButton}
        </div>
      );
    }
    if (
      ReportOfFindingDetail?.status === ROF_STATUES.SUBMITTED &&
      isReviewerWorkFlow
    ) {
      return (
        <div className={styles.flex}>
          {renderWatchIcon}
          {backButton}
          {renderPreviousAndChecklist}
          {renderEditButton}
        </div>
      );
    }
    if (
      ReportOfFindingDetail?.status === ROF_STATUES.REVIEWED &&
      workFlowActiveUserPermission?.includes(ActivePermission.CLOSE_OUT)
    ) {
      return (
        <div className={styles.flex}>
          {renderWatchIcon}
          {backButton}
          {renderPreviousAndChecklist}
          {renderEditButton}
        </div>
      );
    }
    if (
      ReportOfFindingDetail?.status === ROF_STATUES.REASSIGNED &&
      isCreatorWorkFlow
    ) {
      return (
        <div className={styles.flex}>
          {renderWatchIcon}
          {backButton}
          {renderPreviousAndChecklist}
          {!isEdit && renderEditButton}
        </div>
      );
    }

    return null;
  }, [
    ReportOfFindingDetail?.status,
    backButton,
    isEdit,
    renderEditButton,
    renderPreviousAndChecklist,
    renderWatchIcon,
    workFlowActiveUserPermission,
  ]);

  // render
  const renderButtonHeader = useMemo(() => {
    switch (ReportOfFindingDetail?.status) {
      case ROF_STATUES.DRAFT: {
        return (
          <>
            {renderWatchIcon}
            {!isEdit && (
              <Button
                onClick={() => history.goBack()}
                buttonType={ButtonType.CancelOutline}
                className={cx('ms-2', styles.buttonFilter, styles.mr_08)}
              >
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Back)}
              </Button>
            )}
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate, styles.mr_08)}
              onClick={() => handleChooseTemplate()}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                  'NC and CAR of previous inspection'
                ],
              )}
            </Button>
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate)}
              onClick={() => setCheckListView(true)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Checklist view'],
              )}
            </Button>

            <PermissionCheck
              options={{
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.EXECUTE,
              }}
            >
              {({ hasPermission }) =>
                hasPermission &&
                workFlowActiveUserPermission.includes(
                  ActivePermission.CREATOR,
                ) &&
                renderEditButton
              }
            </PermissionCheck>
          </>
        );
      }

      case ROF_STATUES.SUBMITTED: {
        const workflowReviewer = workFlowActiveUserPermission.includes(
          ActivePermission.REVIEWER,
        );
        const allowReview =
          workflowReviewer && isEdit && reviewAssignmentPermission;
        return (
          <>
            {renderWatchIcon}
            <Button
              onClick={() => history.push(AppRouteConst.REPORT_OF_FINDING)}
              buttonType={ButtonType.CancelOutline}
              className={cx('ms-2', styles.buttonFilter, styles.mr_08)}
            >
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Back)}
            </Button>
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate, styles.mr_08)}
              onClick={() => handleChooseTemplate()}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                  'NC and CAR of previous inspection'
                ],
              )}
            </Button>
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate)}
              onClick={() => setCheckListView(true)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Checklist view'],
              )}
            </Button>
            {workflowReviewer && !isEdit && renderEditButton}
            {allowReview && (
              <Button
                className={cx('ms-2', styles.buttonFilter)}
                buttonType={ButtonType.Blue}
                onClick={() => {
                  setStatus(ReportOfFindingStatus.REVIEWED);
                  openModalActions(true);
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Review,
                  )}
                </span>
                <img
                  src={images.icons.icAccept}
                  alt="remove"
                  className={styles.icRemove}
                />
              </Button>
            )}
            {allowReview && (
              <Button
                buttonType={ButtonType.Dangerous}
                className={cx('ms-2', styles.buttonFilter)}
                onClick={() => {
                  setStatus(ReportOfFindingStatus.REASSIGNED);
                  openModalActions(true);
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Reassign,
                  )}
                </span>
                <img
                  src={images.icons.icClose}
                  alt="edit"
                  className={styles.icEdit}
                />
              </Button>
            )}
          </>
        );
      }
      case ROF_STATUES.REVIEWED: {
        const closeOutWorkflow = workFlowActiveUserPermission.includes(
          ActivePermission.CLOSE_OUT,
        );
        const allowCloseOut =
          closeOutWorkflow && isEdit && closeOutAssignmentPermission;

        return (
          <>
            {renderWatchIcon}
            <Button
              onClick={() => history.push(AppRouteConst.REPORT_OF_FINDING)}
              buttonType={ButtonType.CancelOutline}
              className={cx('ms-2', styles.buttonFilter, styles.mr_08)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Back,
              )}
            </Button>
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate, styles.mr_08)}
              onClick={() => handleChooseTemplate()}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                  'NC and CAR of previous inspection'
                ],
              )}
            </Button>
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate)}
              onClick={() => setCheckListView(true)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Checklist view'],
              )}
            </Button>
            {closeOutWorkflow &&
              closeOutAssignmentPermission &&
              renderEditButton}
            {allowCloseOut && (
              <Button
                className={cx('ms-2', styles.buttonFilter)}
                buttonType={ButtonType.Green}
                onClick={() => {
                  setStatus(ReportOfFindingStatus.CLOSE_OUT);
                  openModalActions(true);
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Close out'],
                  )}
                </span>
                <img
                  src={images.icons.icSend}
                  alt="remove"
                  className={styles.icRemove}
                />
              </Button>
            )}
            {allowCloseOut && (
              <Button
                className={cx('ms-2', styles.buttonFilter)}
                buttonType={ButtonType.Dangerous}
                onClick={() => {
                  setStatus(ReportOfFindingStatus.REASSIGNED);
                  openModalActions(true);
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Reassign,
                  )}
                </span>
                <img
                  src={images.icons.icClose}
                  alt="edit"
                  className={styles.icEdit}
                />
              </Button>
            )}
          </>
        );
      }

      case ROF_STATUES.REASSIGNED:
        return renderActionsWithReassignCase;
      case ROF_STATUES.CLOSE_OUT: {
        const closeOutWorkflow = workFlowActiveUserPermission.includes(
          ActivePermission.CLOSE_OUT,
        );
        const allowCloseOut =
          closeOutWorkflow && isEdit && closeOutAssignmentPermission;
        return (
          <>
            {renderWatchIcon}
            <Button
              onClick={() => history.push(AppRouteConst.REPORT_OF_FINDING)}
              buttonType={ButtonType.CancelOutline}
              className={cx('ms-2', styles.buttonFilter, styles.mr_08)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Back,
              )}
            </Button>
            {closeOutWorkflow && renderEditButton}
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate, styles.mr_08)}
              onClick={() => handleChooseTemplate()}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                  'NC and CAR of previous inspection'
                ],
              )}
            </Button>
            <Button
              buttonType={ButtonType.Primary}
              className={cx(styles.chooseTemplate)}
              onClick={() => setCheckListView(true)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Checklist view'],
              )}
            </Button>
            {allowCloseOut && (
              <Button
                buttonType={ButtonType.Dangerous}
                className={cx('ms-2', styles.buttonFilter)}
                onClick={() => {
                  setStatus(ReportOfFindingStatus.REASSIGNED);
                  openModalActions(true);
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Reassign,
                  )}
                </span>
                <img
                  src={images.icons.icClose}
                  alt="edit"
                  className={styles.icEdit}
                />
              </Button>
            )}
          </>
        );
      }

      default:
        return null;
    }
  }, [
    ReportOfFindingDetail?.status,
    renderActionsWithReassignCase,
    isEdit,
    dynamicLabels,
    workFlowActiveUserPermission,
    renderEditButton,
    reviewAssignmentPermission,
    closeOutAssignmentPermission,
    renderWatchIcon,
  ]);

  const handleRemark = (remark: string) => {
    const timezone = tz?.guess();
    setLoadingAfterSubmit(true);
    if (ReportOfFindingDetail?.status === ROF_STATUES.CLOSE_OUT) {
      updateReportOfFindingReassignActionsApi({
        id,
        body: {
          status: 'Draft',
          workflowRemark: remark,
        },
      })
        .then((res) => {
          dispatch(getReportOfFindingDetailActions.request(id));
          toastSuccess(res.data);
          openModalActions(false);
          history.replace({ search: '' });
        })
        .catch((error) => toastError(error))
        .finally(() => {
          setLoadingAfterSubmit(false);
        });
      return;
    }
    if (ReportOfFindingDetail?.status === ROF_STATUES.REVIEWED) {
      updateReportOfFindingCloseoutStatusActionsApi({
        id,
        body: {
          status: ROF_STATUES.REASSIGNED,
          workflowRemark: remark,
          timezone,
        },
      })
        .then((res) => {
          dispatch(getReportOfFindingDetailActions.request(id));
          toastSuccess(res.data);
          openModalActions(false);
          history.replace({ search: '' });
        })
        .catch((error) => toastError(error))
        .finally(() => {
          setLoadingAfterSubmit(false);
        });
      return;
    }
    updateReportOfFindingStatusActionsApi({
      id,
      body: {
        status: ROF_STATUES.REASSIGNED,
        workflowRemark: remark,
      },
    })
      .then((res) => {
        dispatch(getReportOfFindingDetailActions.request(id));
        toastSuccess(res.data);
        openModalActions(false);
        history.replace({ search: '' });
      })
      .catch((error) => toastError(error))
      .finally(() => {
        setLoadingAfterSubmit(false);
      });
  };

  const getListByRelationship = useCallback(
    (relationship) => {
      if (ReportOfFindingDetail?.rofUsers?.length > 0) {
        const rofUserManager = ReportOfFindingDetail?.rofUsers?.filter(
          (item) => item.relationship === relationship,
        );
        return rofUserManager.map((item) => item.username)?.join(', ');
      }
      return '-';
    },
    [ReportOfFindingDetail],
  );

  const vesselManagerList = useMemo(
    () => getListByRelationship('vesselManager'),
    [getListByRelationship],
  );
  const leadAuditorList = useMemo(
    () => getListByRelationship('leadAuditor'),
    [getListByRelationship],
  );

  const auditorList = useMemo(() => {
    if (ReportOfFindingDetail?.rofUsers?.length > 0) {
      const rofUserManager = ReportOfFindingDetail?.rofUsers?.filter(
        (item) =>
          item.relationship === 'auditor' ||
          item.relationship === 'leadAuditor',
      );
      return rofUserManager.map((item) => item.username)?.join(', ');
    }
    return '-';
  }, [ReportOfFindingDetail]);

  const renderActions = useMemo(() => {
    const allowSendMail =
      userInfo?.mainCompanyId === ReportOfFindingDetail?.companyId &&
      ReportOfFindingDetail?.status !== 'Draft';

    return (
      <div className={cx(styles.wrapBtnsHeader, 'd-flex')}>
        {renderButtonHeader}
        <PermissionCheck
          options={{
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.REPORT_OF_FINDING,
            action: ActionTypeEnum.EXPORT,
          }}
        >
          {({ hasPermission }) =>
            ReportOfFindingDetail &&
            hasPermission && (
              <Button
                className={cx('ms-2', styles.customExportBtn)}
                onClick={getPdfPlanningAndRequest}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Export,
                  )}
                </span>
                {loadingExport ? <LoadingOutlined /> : <DownloadOutlined />}
              </Button>
            )
          }
        </PermissionCheck>
        {allowSendMail && (
          <PermissionCheck
            options={{
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.REPORT_OF_FINDING,
              action: ActionTypeEnum.EMAIL,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <Button
                  className={styles.btnSendMail}
                  onClick={() => setModalSendEmailVisible(true)}
                >
                  <span className="pe-2">
                    {renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Send mail'],
                    )}
                  </span>
                  <img src={images.icons.icEmail} alt="icActiveMailSend" />
                </Button>
              )
            }
          </PermissionCheck>
        )}
      </div>
    );
  }, [
    ReportOfFindingDetail,
    dynamicLabels,
    getPdfPlanningAndRequest,
    loadingExport,
    renderButtonHeader,
    userInfo?.mainCompanyId,
  ]);

  return (
    <PermissionCheck
      options={{
        feature: Features.AUDIT_INSPECTION,
        subFeature: SubFeatures.REPORT_OF_FINDING,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.EXECUTE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.editContainer}>
            <Container className={styles.headerContainer}>
              <div className={cx('d-flex justify-content-between')}>
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.REPORT_OF_FINDING_EDIT
                        : BREAD_CRUMB.REPORT_OF_FINDING_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {renderDynamicModuleLabel(
                      listModuleDynamicLabels,
                      DynamicLabelModuleName.AuditInspectionReportOfFinding,
                    )}
                  </div>
                </div>

                {renderActions}
              </div>

              <div className="d-flex align-items-center justify-content-end">
                <div className={styles.sno}>
                  <span className={styles.label}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Ref.ID'],
                    )}
                    :
                  </span>
                  <b>{ReportOfFindingDetail?.refNo || '-'}</b>
                </div>
                <PopoverStatus
                  header={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Workflow progress'
                    ],
                  )}
                  dynamicLabels={dynamicLabels}
                  stepStatusItems={stepStatusItems()}
                  status={ReportOfFindingDetail?.status}
                  className={styles.historySteps}
                />
                <div className={styles.globalStatus}>
                  <span className={styles.label}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Global status'],
                    )}
                    :
                  </span>
                  <b>
                    {ReportOfFindingDetail?.planningRequest?.globalStatus ||
                      '-'}
                  </b>
                </div>
              </div>
            </Container>
            <Container
              className={cx(styles.formContainer, styles.rofContainer)}
            >
              <ReportOfFindingForm
                isEdit={isEdit}
                data={ReportOfFindingDetail}
                onSaveDraft={handleSaveDraft}
                onSubmit={handleSubmit}
                setIsEdit={setIsEdit}
                titleModalRemark={titleModalRemark}
                onSubmitStatus={onSubmitStatus}
                modalAssignMentVisible={modalActionVisible}
                openModalAssignment={openModalActions}
                handleRemark={handleRemark}
                loadingWhenSubmit={loadingAfterSubmit || loading}
                dynamicLabels={dynamicLabels}
              />
            </Container>

            <ModalNCOfPreviousAudit
              dynamicLabels={dynamicLabels}
              isEdit={
                isEdit &&
                ReportOfFindingDetail?.status !== ROF_STATUES.CLOSE_OUT
              }
              isShow={modalNC}
              planingId={ReportOfFindingDetail?.planningRequest?.id}
              rofId={ReportOfFindingDetail?.id}
              handlePrevious={(data) => setListPreviousAudit(data)}
              setShow={(e) => openModalNC(e)}
            />

            <CheckListModal
              isEdit={
                isEdit &&
                ReportOfFindingDetail?.status !== ROF_STATUES.CLOSE_OUT
              }
              header="Checklist - list"
              bodyClassName={styles.modalBody}
              toggle={() => setCheckListView(!checkListView)}
              data={listCheckView}
              setCheckListView={(value) => setCheckListView(value)}
              attachments={checklistAttachments}
              handleAdd={(data) => {
                setChecklistAttachment(data?.attachments);
                setCheckListView(!checkListView);
              }}
              modal={checkListView}
              dynamicLabels={dynamicLabels}
            />

            <ModalSendMail
              planningAndRequestDetail={{
                ...PlanningAndRequestDetail,
                leadAuditorList,
                auditorList,
                vesselManagerList,
              }}
              dynamicLabels={dynamicLabels}
              mailModule={MAIL_MODULES_IDS.REPORT_OF_FINDING}
              planningRequestId={PlanningAndRequestDetail?.id}
              attachmentIdsPlanning={
                PlanningAndRequestDetail?.attachments || []
              }
              entityType={PlanningAndRequestDetail?.entityType || ''}
              vesselTypeId={
                PlanningAndRequestDetail?.vessel?.vesselType?.id || null
              }
              workingType={PlanningAndRequestDetail?.workingType || ''}
              isOpen={modalSendEmailVisible}
              mailTypeId={MAIL_TYPES_IDS.REPORT_OF_FINDING}
              zipFileName={`Report of finding ${ReportOfFindingDetail?.sNo}.zip`}
              onClose={() => {
                setModalSendEmailVisible(false);
              }}
              exportApi={() => pdfROFActionsApi(id)}
              exportName="Report of finding.pdf"
            />
          </div>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
}
