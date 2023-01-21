import {
  updatePlanningAndRequestStatusActionsApi,
  cancelPlanningAndRequestStatusActionsApi,
  pdfPlanningAndRequestActionsApi,
  acceptPlanningAndRequestAuditorApi,
  acceptPlanningAndRequestAuditeeApi,
} from 'api/planning-and-request.api';
import images from 'assets/images/images';
import useEffectOnce from 'hoc/useEffectOnce';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/Container';
import { Item, StepStatus } from 'components/common/step-line/lineStepCP';
// import capitalize from 'lodash/capitalize';
import PopoverStatus from 'components/audit-checklist/common/popover-status/PopoverStatus';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
// import ModalRemark from 'components/ui/modal/modal-remark/ModalRemark';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { ActivePermission, CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { handleAndDownloadFilePdf, compareStatus } from 'helpers/utils.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  PlanningAndRequest,
  UpdatePlanningAndRequestParams,
} from 'models/api/planning-and-request/planning-and-request.model';
import { tz } from 'moment-timezone';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  deletePlanningAndRequestActions,
  getPlanningAndRequestDetailActions,
  updatePlanningAndRequestActions,
} from 'store/planning-and-request/planning-and-request.action';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  MAIL_MODULES_IDS,
  MAIL_TYPES_IDS,
  PLANNING_STATUES,
} from 'constants/planning-and-request.const';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import PlanningAndRequestForm from '../forms/PlanningAndRequestForm';
// import Assignment from '../components/assignment/Assignment';
import ModalSendMail from '../../mail-creation/modal-send-mail/ModalSendMail';
import styles from './detail.module.scss';

// import { replaceGrammar } from './plan.func';
import { checkDocHolderChartererVesselOwner } from '../forms/planning-and-request.helps';

export default function PlanningAndRequestDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);
  const { loading, PlanningAndRequestDetail } = useSelector(
    (state) => state.planningAndRequest,
  );

  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const [timezone] = useState(tz?.guess());
  const [modalSendEmailVisible, setModalSendEmailVisible] = useState(false);

  const [loadingExport, setExportLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modalAssignMentVisible, openModalAssignment] =
    useState<boolean>(false);
  const [titleModalRemark, setTitleModalRemark] = useState<string>('');
  const [
    planningAndRequestDetailSendMail,
    setPlanningAndRequestDetailSendMail,
  ] = useState<PlanningAndRequest>(null);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionPar,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });

  const auditorAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.AUDITOR,
        PlanningAndRequestDetail?.userAssignments,
      ),
    [PlanningAndRequestDetail?.userAssignments, userInfo?.id],
  );
  const ownerManagerAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.OWNER_MANAGER,
        PlanningAndRequestDetail?.userAssignments,
      ),
    [PlanningAndRequestDetail?.userAssignments, userInfo?.id],
  );
  const approverAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.APPROVER,
        PlanningAndRequestDetail?.userAssignments,
      ),
    [PlanningAndRequestDetail?.userAssignments, userInfo?.id],
  );

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
      id: 'approved',
      name: t('statusPlan.txApproved'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'auditor_accepted',
      name: t('statusPlan.txAccepted'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'planned_successfully',
      name: t('statusPlan.txPlannedSuccessfully'),
      status: StepStatus.INACTIVE,
    },
    PlanningAndRequestDetail?.status !== PLANNING_STATUES.Cancelled && {
      id: PLANNING_STATUES.InProgress,
      name: t('statusPlan.txInProgress'),
      status: StepStatus.INACTIVE,
    },
    PlanningAndRequestDetail?.status !== PLANNING_STATUES.Cancelled && {
      id: PLANNING_STATUES.Completed,
      name: t('statusPlan.txCompleted'),
      status: StepStatus.INACTIVE,
    },
    PlanningAndRequestDetail?.status === PLANNING_STATUES.Cancelled && {
      id: PLANNING_STATUES.Cancelled,
      name: t('statusPlan.txCancelled'),
      status: StepStatus.INACTIVE,
    },
  ]?.filter((i) => i);

  const backToView = useCallback(() => {
    history.push(
      `${AppRouteConst.getPlanningAndRequestById(
        PlanningAndRequestDetail?.id,
      )}`,
    );
  }, [PlanningAndRequestDetail?.id]);

  const stepReject = (previousStep) => {
    switch (previousStep) {
      case 'submitted':
        return 2;
      case 'approved':
        return 3;
      case 'auditor_accepted':
        return 4;
      default:
        return 2;
    }
  };

  const findHistoryByStatus = (status: string) => {
    const statusHistory =
      PlanningAndRequestDetail?.planningRequestHistories || [];
    const historyFiltered = statusHistory.filter(
      (item) => item.status === status,
    );
    const dataPopulated = historyFiltered.map((item) => ({
      datetime: item?.updatedAt,
      description: item?.createdUser?.username,
      name: item?.createdUser?.jobTitle,
    }));
    return dataPopulated;
  };

  const renderDataByStatusIndex = (iStatus: number, errActive?: boolean) => {
    const items: Item[] = DEFAULT_ITEMS;
    return items.map((i, index) => {
      if (index < iStatus) {
        const errorAtLast = errActive && Number(index + 1) === iStatus;
        return {
          ...i,
          status: errorAtLast ? StepStatus.ERROR : StepStatus.ACTIVE,
          info: findHistoryByStatus(i.id),
        };
      }

      return i;
    });
  };

  const stepStatusItems = () => {
    const items: Item[] = DEFAULT_ITEMS;
    switch (PlanningAndRequestDetail?.status) {
      case PLANNING_STATUES.Draft: {
        return renderDataByStatusIndex(1);
      }

      case PLANNING_STATUES.Submitted: {
        return renderDataByStatusIndex(2);
      }
      case PLANNING_STATUES.Approved: {
        return renderDataByStatusIndex(3);
      }

      case PLANNING_STATUES.Auditor_accepted: {
        return renderDataByStatusIndex(4);
      }
      case 'planned_successfully': {
        return renderDataByStatusIndex(5);
      }
      case PLANNING_STATUES.InProgress: {
        return renderDataByStatusIndex(6);
      }
      case PLANNING_STATUES.Cancelled: {
        return renderDataByStatusIndex(6, true);
      }
      case PLANNING_STATUES.Completed: {
        return renderDataByStatusIndex(7);
      }
      case 'rejected': {
        const step = stepReject(PlanningAndRequestDetail?.previousStatus);
        const newItems = items.map((i, index) => {
          if (index < step) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          if (index === step) {
            return {
              ...i,
              status: StepStatus.ERROR,
              info: findHistoryByStatus('rejected'),
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

  const onDeletePlanningAndRequest = () => {
    dispatch(
      deletePlanningAndRequestActions.request({
        id,
        isDetail: true,
        getListPlanningAndRequest: () => {
          history.push(AppRouteConst.PLANNING);
        },
      }),
    );
  };

  const handleSubmit = useCallback(
    (formData: PlanningAndRequest) => {
      const { ...other } = formData;

      const finalParams: UpdatePlanningAndRequestParams = {
        id,
        body: { ...other },
      };
      dispatch(updatePlanningAndRequestActions.request(finalParams));
    },
    [dispatch, id],
  );

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),
      onPressButtonRight: onDeletePlanningAndRequest,
    });
  };

  const updateDataAndBackToView = useCallback(
    (message) => {
      dispatch(getPlanningAndRequestDetailActions.request(id));
      toastSuccess(message);
      openModalAssignment(false);
      backToView();
    },
    [backToView, dispatch, id],
  );

  const onSubmitStatus = useCallback(
    (status: string, remark?: string, userAssignment?: any) => {
      if (status === 'cancel') {
        cancelPlanningAndRequestStatusActionsApi({
          id,
          body: { comment: remark, userAssignment },
        })
          .then((res) => {
            updateDataAndBackToView(res?.data);
          })
          .catch((error) => {
            toastError(error);
            openModalAssignment(false);
          });
        return;
      }

      if (
        status === 'accept' &&
        PlanningAndRequestDetail?.status === PLANNING_STATUES.Approved
      ) {
        acceptPlanningAndRequestAuditorApi({
          id,
          body: { timezone, remark, comment: remark, userAssignment },
        })
          .then((res) => {
            updateDataAndBackToView(res?.data);
          })
          .catch((error) => {
            toastError(error);
            openModalAssignment(false);
          });
        return;
      }

      if (status === 'accept') {
        acceptPlanningAndRequestAuditeeApi({
          id,
          body: { timezone, remark, comment: remark, userAssignment },
        })
          .then((res) => {
            updateDataAndBackToView(res?.data);
          })
          .catch((error) => {
            toastError(error);
            openModalAssignment(false);
          });
        return;
      }
      if (status === PLANNING_STATUES.Auditor_accepted) {
        acceptPlanningAndRequestAuditeeApi({
          id,
          body: { timezone, remark, comment: remark, userAssignment },
        })
          .then((res) => {
            updateDataAndBackToView(res?.data);
          })
          .catch((error) => {
            toastError(error);
            openModalAssignment(false);
          });
        return;
      }
      updatePlanningAndRequestStatusActionsApi({
        id,
        status,
        body: { timezone, remark, comment: remark, userAssignment },
      })
        .then((res) => {
          updateDataAndBackToView(res?.data);
        })
        .catch((error) => {
          toastError(error);
          openModalAssignment(false);
        });
    },
    [PlanningAndRequestDetail?.status, id, timezone, updateDataAndBackToView],
  );

  const onReject = (remark?: string, userAssignment?: any) => {
    let statusPath = PlanningAndRequestDetail?.status;
    switch (PlanningAndRequestDetail?.status) {
      case 'submitted': {
        statusPath = 'approve';
        break;
      }
      case PLANNING_STATUES.Approved: {
        statusPath = 'auditor-accept';
        break;
      }
      case 'planned_successfully': {
        statusPath = 'cancel';
        break;
      }
      case PLANNING_STATUES.Auditor_accepted: {
        statusPath = 'auditee-accept';
        break;
      }
      default:
    }
    updatePlanningAndRequestStatusActionsApi({
      id,
      status: statusPath,
      params: { isRejected: true },
      body: { timezone, comment: remark, remark, userAssignment },
    })
      .then((res) => {
        dispatch(getPlanningAndRequestDetailActions.request(id));
        toastSuccess(res.data);
        openModalAssignment(false);
      })
      .catch((error) => {
        toastError(error);
        openModalAssignment(false);
      });
  };

  const handleSubmitStatus = (status: string) => {
    setTitleModalRemark(status);
    openModalAssignment(true);
  };

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    if (PlanningAndRequestDetail) {
      setPlanningAndRequestDetailSendMail(PlanningAndRequestDetail);
    }
  }, [PlanningAndRequestDetail]);
  useEffectOnce(() => {
    dispatch(getPlanningAndRequestDetailActions.request(id));

    return () => {
      dispatch(
        getPlanningAndRequestDetailActions.success({
          id: '',
          attachments: [],
          officeComments: [],
          additionalReviewers: [],
          status: 'active',
        }),
      );
    };
  });

  const dataFocusRequest = useMemo(
    () =>
      PlanningAndRequestDetail?.pRFocusRequests?.map((item) => ({
        focusRequestId: item.focusRequestId,
        question: item.focusRequestObj?.question,
        memo: item.memo,
        answer: item.answer || 'No',
        id: item.id,
      })) || [],
    [PlanningAndRequestDetail],
  );

  const getPdfPlanningAndRequest = () => {
    pdfPlanningAndRequestActionsApi(id)
      .then(async (res) => {
        await setExportLoading(true);
        await handleAndDownloadFilePdf(res.data, 'Planning And Request');
        setExportLoading(false);
      })
      .catch((e) => {
        toastError(e);
        setExportLoading(false);
      });
  };

  // render
  const renderButtonHeader = () => {
    switch (PlanningAndRequestDetail?.status) {
      case 'draft': {
        return (
          <div>
            <PermissionCheck
              options={{
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.PLANNING_AND_REQUEST,
                action: ActionTypeEnum.EXECUTE,
              }}
            >
              {({ hasPermission }) =>
                hasPermission &&
                workFlowActiveUserPermission.includes(
                  ActivePermission.CREATOR,
                ) && (
                  <Button
                    className={cx('ms-1', styles.buttonFilter)}
                    buttonType={ButtonType.Orange}
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    <span className="pe-2">
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Delete,
                      )}
                    </span>
                    <img
                      src={images.icons.icRemove}
                      alt="remove"
                      className={styles.icRemove}
                    />
                  </Button>
                )
              }
            </PermissionCheck>
          </div>
        );
      }

      case 'submitted': {
        return (
          <div>
            {approverAssignmentPermission && (
              <Button
                buttonType={ButtonType.Green}
                className={cx('me-1', styles.buttonFilter)}
                disabled={loading}
                onClick={() => {
                  handleSubmitStatus('approve');
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Approve,
                  )}
                </span>
                <img
                  src={images.icons.icAccept}
                  alt="edit"
                  className={styles.icEdit}
                />
              </Button>
            )}

            {approverAssignmentPermission && (
              <Button
                className={cx('ms-1', styles.buttonFilter)}
                buttonType={ButtonType.Dangerous}
                disabled={loading}
                onClick={() => {
                  handleSubmitStatus('reject');
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Reassign,
                  )}
                </span>
                <img
                  src={images.icons.icClose}
                  alt="remove"
                  className={styles.icRemove}
                />
              </Button>
            )}
          </div>
        );
      }
      case 'approved': {
        // const isAuditor = workFlowActiveUserPermission.includes(
        //   ActivePermission.AUDITOR,
        // );

        return (
          <div>
            {auditorAssignmentPermission && (
              <Button
                className={cx('me-1', styles.buttonFilter)}
                disabled={loading}
                onClick={(e) => {
                  handleSubmitStatus('accept');
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Accept,
                  )}
                </span>
                <img
                  src={images.icons.icAccept}
                  alt="edit"
                  className={styles.icEdit}
                />
              </Button>
            )}

            {auditorAssignmentPermission && (
              <Button
                className={cx('ms-1', styles.buttonFilter)}
                buttonType={ButtonType.Dangerous}
                disabled={loading}
                onClick={() => {
                  handleSubmitStatus('reject');
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Reassign,
                  )}
                </span>
                <img
                  src={images.icons.icClose}
                  alt="remove"
                  className={styles.icRemove}
                />
              </Button>
            )}
          </div>
        );
      }

      case 'auditor_accepted': {
        // const isAuditor = workFlowActiveUserPermission.includes(
        //   ActivePermission.AUDITOR,
        // );
        return (
          <div>
            {ownerManagerAssignmentPermission && (
              <Button
                className={cx('me-1', styles.buttonFilter)}
                disabled={loading}
                onClick={() => {
                  handleSubmitStatus('auditor_accepted');
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Accept,
                  )}
                </span>
                <img
                  src={images.icons.icAccept}
                  alt="edit"
                  className={styles.icEdit}
                />
              </Button>
            )}
            {ownerManagerAssignmentPermission && (
              <Button
                className={cx('ms-1', styles.buttonFilter)}
                buttonType={ButtonType.Dangerous}
                disabled={loading}
                onClick={() => {
                  handleSubmitStatus('reject');
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Reassign,
                  )}
                </span>
                <img
                  src={images.icons.icClose}
                  alt="remove"
                  className={styles.icRemove}
                />
              </Button>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  const renderButtonCancelHeader = useMemo(() => {
    const isStatusPlanned = compareStatus(
      PlanningAndRequestDetail?.status,
      PLANNING_STATUES.PlannedSuccessfully,
    );
    if (isStatusPlanned && ownerManagerAssignmentPermission) {
      return (
        <div>
          <Button
            className={cx('ms-2', styles.buttonFilter)}
            buttonType={ButtonType.Orange}
            disabled={loading}
            renderSuffix={<img src={images.icons.icErrorWhite} alt="cancel" />}
            onClick={() => {
              handleSubmitStatus('cancel');
            }}
          >
            <span className="pe-2">
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
            </span>
          </Button>
        </div>
      );
    }

    return null;
  }, [
    PlanningAndRequestDetail?.status,
    dynamicLabels,
    loading,
    ownerManagerAssignmentPermission,
  ]);

  const isShowButtonEdit = useMemo(() => {
    if (isEdit) {
      return false;
    }
    const isCurrentDoc = checkDocHolderChartererVesselOwner(
      {
        vesselDocHolders: PlanningAndRequestDetail?.vesselDocHolders,
        vesselCharterers: PlanningAndRequestDetail?.vesselCharterers,
        vesselOwners: PlanningAndRequestDetail?.vesselOwners,
        createdAt: PlanningAndRequestDetail?.createdAt,
        entityType: PlanningAndRequestDetail?.entityType,
      },
      userInfo,
    );

    const { status, createdUserId } = PlanningAndRequestDetail || {};

    const isCreator = userInfo?.id === createdUserId;

    const iSCompleted =
      PlanningAndRequestDetail?.status === PLANNING_STATUES.Completed;

    const draftCase =
      status?.toLowerCase() === PLANNING_STATUES.Draft && isCreator;
    const submittedCase =
      status?.toLowerCase() === PLANNING_STATUES.Submitted &&
      (approverAssignmentPermission || isCreator);
    const reassignCase =
      (status?.toLowerCase() === PLANNING_STATUES.Reassigned ||
        status?.toLowerCase() === PLANNING_STATUES.Rejected) &&
      isCreator;

    const approverCase =
      status?.toLowerCase() === PLANNING_STATUES.Approved &&
      (auditorAssignmentPermission || isCreator);

    const acceptedCase =
      status?.toLowerCase() === PLANNING_STATUES.Accepted &&
      (ownerManagerAssignmentPermission || isCreator);

    const auditorAcceptedCase =
      status?.toLowerCase() === PLANNING_STATUES.Auditor_accepted &&
      (ownerManagerAssignmentPermission || isCreator);

    if (iSCompleted) {
      return false;
    }
    if (draftCase && isCurrentDoc) {
      return true;
    }
    if (submittedCase && isCurrentDoc) {
      return true;
    }
    if (reassignCase && isCurrentDoc) {
      return true;
    }
    if ((auditorAcceptedCase || acceptedCase) && isCurrentDoc) {
      return true;
    }
    if (approverCase && isCurrentDoc) {
      return true;
    }

    return false;
  }, [
    isEdit,
    PlanningAndRequestDetail,
    userInfo,
    approverAssignmentPermission,
    auditorAssignmentPermission,
    ownerManagerAssignmentPermission,
  ]);

  const allowEditPAR = useMemo(() => {
    if (!isEdit) {
      return false;
    }
    const isCreator = userInfo?.id === PlanningAndRequestDetail?.createdUserId;
    const allowEditDraft = compareStatus(
      PlanningAndRequestDetail?.status,
      PLANNING_STATUES.Draft,
    );
    const allowEditRejected = compareStatus(
      PlanningAndRequestDetail?.status,
      PLANNING_STATUES.Rejected,
    );
    const allowEditSubmitted =
      compareStatus(
        PlanningAndRequestDetail?.status,
        PLANNING_STATUES.Submitted,
      ) &&
      (isCreator || approverAssignmentPermission);
    const allowEditApproved =
      compareStatus(
        PlanningAndRequestDetail?.status,
        PLANNING_STATUES.Approved,
      ) &&
      (isCreator || auditorAssignmentPermission);
    const allowEditAccepted =
      compareStatus(
        PlanningAndRequestDetail?.status,
        PLANNING_STATUES.Accepted,
      ) &&
      (isCreator || ownerManagerAssignmentPermission);
    const allowEditAuditorAccepted =
      compareStatus(
        PlanningAndRequestDetail?.status,
        PLANNING_STATUES.Auditor_accepted,
      ) &&
      (isCreator || ownerManagerAssignmentPermission);
    // const allowEditPlanned =
    //   compareStatus(
    //     PlanningAndRequestDetail?.status,
    //     PLANNING_STATUES.PlannedSuccessfully,
    //   ) &&
    //   (isCreator ||
    //     ownerManagerAssignmentPermission ||
    //     auditorAssignmentPermission ||
    //     approverAssignmentPermission);
    if (
      allowEditDraft ||
      allowEditRejected ||
      allowEditSubmitted ||
      allowEditApproved ||
      allowEditAccepted ||
      allowEditAuditorAccepted
      //  ||
      // allowEditPlanned
    ) {
      return true;
    }

    return false;
  }, [
    PlanningAndRequestDetail?.createdUserId,
    PlanningAndRequestDetail?.status,
    approverAssignmentPermission,
    auditorAssignmentPermission,
    isEdit,
    ownerManagerAssignmentPermission,
    userInfo?.id,
  ]);

  return (
    <div className={styles.editContainer}>
      <Container className={styles.headerContainer}>
        <div className={cx('d-flex justify-content-between')}>
          <div className={styles.headers}>
            <BreadCrumb
              current={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.PLANNING_AND_REQUEST_EDIT
                  : BREAD_CRUMB.PLANNING_AND_REQUEST_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>
              {renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.AuditInspectionPar,
              )}
            </div>
          </div>
          <div className="d-flex position-relative align-items-center pt-2">
            <WatchListManagement
              referenceId={PlanningAndRequestDetail?.id}
              referenceModuleName={WatchlistModuleEnum.PLANNING}
              referenceRefId={PlanningAndRequestDetail?.refId}
              dynamicLabels={dynamicLabels}
            />
            {!isEdit && (
              <Button
                className={cx(styles.buttonFilter)}
                buttonType={ButtonType.CancelOutline}
                disabled={loading}
                onClick={() => {
                  history.goBack();
                }}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS.Back,
                )}
              </Button>
            )}
            {isEdit && renderButtonHeader()}
            {renderButtonCancelHeader}
            {isShowButtonEdit && (
              <Button
                className={cx('ms-3', styles.buttonFilter)}
                disabled={loading}
                onClick={(e) => {
                  history.push(
                    `${AppRouteConst.getPlanningAndRequestById(
                      PlanningAndRequestDetail?.id,
                    )}${CommonQuery.EDIT}`,
                  );
                }}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS.Edit,
                  )}
                </span>
                <img
                  src={images.icons.icEdit}
                  alt="edit"
                  className={styles.icEdit}
                />
              </Button>
            )}
            <PermissionCheck
              options={{
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.PLANNING_AND_REQUEST,
                action: ActionTypeEnum.EXPORT,
              }}
            >
              {({ hasPermission }) =>
                PlanningAndRequestDetail &&
                hasPermission && (
                  <Button
                    className={cx('ms-3', styles.customExportBtn)}
                    onClick={getPdfPlanningAndRequest}
                  >
                    <span className="pe-2">
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_PLANNING_DYNAMIC_FIELDS.Export,
                      )}
                    </span>
                    {loadingExport ? <LoadingOutlined /> : <DownloadOutlined />}
                  </Button>
                )
              }
            </PermissionCheck>

            {userInfo?.mainCompanyId === PlanningAndRequestDetail?.companyId &&
              PlanningAndRequestDetail?.status !== PLANNING_STATUES.Draft && (
                <PermissionCheck
                  options={{
                    feature: Features.AUDIT_INSPECTION,
                    subFeature: SubFeatures.PLANNING_AND_REQUEST,
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
                            DETAIL_PLANNING_DYNAMIC_FIELDS['Send mail'],
                          )}
                        </span>
                        <img
                          src={images.icons.icEmail}
                          alt="icActiveMailSend"
                        />
                      </Button>
                    )
                  }
                </PermissionCheck>
              )}
          </div>
        </div>
        <div
          className={cx(
            styles.wrapInfoHeader,
            'd-flex justify-content-end align-items-center',
          )}
        >
          <div>
            <span className={styles.refTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Ref.ID'],
              )}
              :
            </span>
            <b className={styles.refValue}>{PlanningAndRequestDetail?.refId}</b>
          </div>
          <div className={styles.status}>
            <PopoverStatus
              header={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Workflow progress'],
              )}
              stepStatusItems={stepStatusItems()}
              status={PlanningAndRequestDetail?.status}
              className={styles.historySteps}
              dynamicLabels={dynamicLabels}
            />
          </div>
          <div className={cx(styles.borderLeft, 'd-flex align-items-center ')}>
            <span className={styles.refTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Global status'],
              )}
              :
            </span>
            <b className={cx(styles.refValue, styles.globalStatus)}>
              {PlanningAndRequestDetail?.globalStatus}
            </b>
          </div>
        </div>
      </Container>
      <Container className={styles.formContainer}>
        <PlanningAndRequestForm
          isEdit={allowEditPAR}
          data={PlanningAndRequestDetail}
          onSubmit={handleSubmit}
          // isCreate={statusTab === 'create'}
          dataFocusRequest={dataFocusRequest}
          getDataSendMail={(data) => {
            setPlanningAndRequestDetailSendMail((p) => ({
              ...p,
              dateOfLastInspection: data?.dateOfLastInspection,
              dueDate: data?.dueDate,
            }));
          }}
          onReject={onReject}
          titleModalRemark={titleModalRemark}
          onSubmitStatus={onSubmitStatus}
          modalAssignMentVisible={modalAssignMentVisible}
          openModalAssignment={openModalAssignment}
          dynamicLabels={dynamicLabels}
        />
      </Container>

      {/* <ModalRemark
        isOpen={modalAssignMentVisible}
        onClose={() => {
          openModalAssignment(false);
          setCurrentStatus('');
        }}
        title={capitalize(titleModalRemark)}
        content={`Are you sure you want to ${String(
          titleModalRemark !== 'auditor_accepted'
            ? titleModalRemark
            : 'accepted',
        ).toLowerCase()}?`}
        onConfirm={(remark) => {
          if (currentStatus) {
            onReject(remark);
            return;
          }
          onSubmitStatus(titleModalRemark, remark);
        }}
      /> */}

      <ModalSendMail
        planningAndRequestDetail={planningAndRequestDetailSendMail}
        mailModule={MAIL_MODULES_IDS.PLANNING_AND_REQUEST}
        planningRequestId={PlanningAndRequestDetail?.id}
        dynamicLabels={dynamicLabels}
        attachmentIdsPlanning={PlanningAndRequestDetail?.attachments || []}
        entityType={PlanningAndRequestDetail?.entityType || ''}
        vesselTypeId={PlanningAndRequestDetail?.vessel?.vesselType?.id || null}
        workingType={PlanningAndRequestDetail?.workingType || ''}
        isOpen={modalSendEmailVisible}
        mailTypeId={MAIL_TYPES_IDS.PLANNING_AND_REQUEST}
        zipFileName={`Planning ${PlanningAndRequestDetail?.auditNo}.zip`}
        onClose={() => {
          setModalSendEmailVisible(false);
        }}
        exportApi={() =>
          pdfPlanningAndRequestActionsApi(PlanningAndRequestDetail?.id)
        }
        exportName="Planning And Request.pdf"
      />
    </div>
  );
}
