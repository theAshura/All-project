import { useState, useCallback, useMemo, useContext } from 'react';
import {
  CommonQuery,
  ActivePermission,
  IARReviewPermission,
} from 'constants/common.const';
import HeaderButtons, {
  HeaderBtn,
  HeaderBtnType,
} from 'components/audit-checklist/common/header-buttons/HeaderButtons';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import images from 'assets/images/images';
import ModalSendMail from 'components/mail-creation/modal-send-mail/ModalSendMail';
import {
  MAIL_MODULES_IDS,
  MAIL_TYPES_IDS,
} from 'constants/planning-and-request.const';
import {
  InternalAuditReportFormContext,
  WorkflowStatus,
} from 'contexts/internal-audit-report/IARFormContext';
import {
  updateInternalAuditReportReviewActionsApi,
  updateInternalAuditReportApproveActionsApi,
  updateInternalAuditReportCloseoutActionsApi,
  getDetailPdfInternalAuditReport,
} from 'api/internal-audit-report.api';
import { useSelector, useDispatch } from 'react-redux';
import { tz } from 'moment-timezone';
import { AppRouteConst } from 'constants/route.const';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  getInternalAuditReportDetailActions,
  clearInternalAuditReportReducer,
} from 'store/internal-audit-report/internal-audit-report.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import { closeConfirmationModal } from 'components/internal-audit-report/forms/common/modals/confirmation-modal/ConfirmationModal';
import { useParams, useLocation } from 'react-router';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import Button from 'components/ui/button/Button';
import history from 'helpers/history.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import ModalConfirmExport from 'components/common/modal/modal-export/ModalConfirmExport';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import { populateStatus, allowApprover } from '../../helpers/helpers';
import { handleAndDownloadFilePdf } from '../../../../../helpers/utils.helper';
import styles from './header-section.module.scss';
import InspectionReportAssignment from '../../inspection-report-assignment/InspectionReportAssignment';

const IARActionButtonsSection = ({ dynamicLabels }) => {
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [titleModalRemark, setTitleModalRemark] = useState<string>('');
  const [currentAction, setCurrentAction] = useState<string>('');
  const [modalExportVisible, setModalExportVisible] = useState<boolean>(false);
  const [modalSendEmailVisible, setModalSendEmailVisible] = useState(false);

  const { userInfo } = useSelector((state) => state.authenticate);
  const { PlanningAndRequestDetail } = useSelector(
    (state) => state.planningAndRequest,
  );

  const {
    nonConformityList,
    globalLoading,
    handleSetGlobalLoading,
    workflowRemarks,
    reportFindingItems,
    listAttachments,
    internalAuditComments,
    backgroundImage,
    IARRpHeaderDescription,
    IARRpSubHeaderDescription,
    IARRpHeaderComments,
    IARRpSubHeaderComments,
    officeComment,
    listCarCap,
    modalRemarkVisible,
    openModalRemark,
    handleSubmit,
    populateAssignment,
    userAssignmentFromDetail,
    loading,
    setLoading,
  } = useContext(InternalAuditReportFormContext);

  const { workFlowActiveUserPermission } = useSelector(
    (store) => store.workFlow,
  );

  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const approveAssignmentPermission: boolean = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.APPROVER,
        internalAuditReportDetail?.userAssignments,
      ),
    [internalAuditReportDetail?.userAssignments, userInfo?.id],
  );

  const reviewer1AssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_1,
        internalAuditReportDetail?.userAssignments,
      ),
    [internalAuditReportDetail?.userAssignments, userInfo?.id],
  );
  const reviewer2AssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_2,
        internalAuditReportDetail?.userAssignments,
      ),
    [internalAuditReportDetail?.userAssignments, userInfo?.id],
  );
  const reviewer3AssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_3,
        internalAuditReportDetail?.userAssignments,
      ),
    [internalAuditReportDetail?.userAssignments, userInfo?.id],
  );
  const reviewer4AssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_4,
        internalAuditReportDetail?.userAssignments,
      ),
    [internalAuditReportDetail?.userAssignments, userInfo?.id],
  );
  const reviewer5AssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_5,
        internalAuditReportDetail?.userAssignments,
      ),
    [internalAuditReportDetail?.userAssignments, userInfo?.id],
  );

  const isClosedOutAllFindingsInDetail = useCallback(() => {
    if (
      !internalAuditReportDetail?.nonConformities?.data?.some(
        (i) => i?.workflowStatus !== WorkflowStatus.CLOSE_OUT,
      )
    ) {
      return true;
    }
    return false;
  }, [internalAuditReportDetail]);

  const isAllCarClose = useMemo(() => {
    if (!listCarCap?.length) {
      return true;
    }
    return !listCarCap?.some((i) => i?.status !== 'Closed');
  }, [listCarCap]);

  const isClosedOutAllFindingsInContext = useCallback(() => {
    if (
      !nonConformityList?.some(
        (i) => i?.workflowStatus !== WorkflowStatus.CLOSE_OUT,
      )
    ) {
      return true;
    }
    return false;
  }, [nonConformityList]);

  const isClosedOutAllFindings = useCallback(() => {
    if (isClosedOutAllFindingsInDetail() || isClosedOutAllFindingsInContext()) {
      return true;
    }
    return false;
  }, [isClosedOutAllFindingsInContext, isClosedOutAllFindingsInDetail]);

  const buildIARRpHeaderResponse = useCallback(() => {
    const IARReportHeaders = IARRpHeaderComments.map((header) => {
      const rpHeaderDescription = IARRpHeaderDescription.filter(
        (description) => description.headerId === header.reportHeaderId,
      ).map((description) => ({
        id: !description.isNew ? description.id : undefined,
        topic: description.topic,
        score: description.score,
        description: description.description,
      }));
      return {
        id: header.id,
        reportHeaderId: header.reportHeaderId,
        headerComment: header.headerComment || '',
        IARReportHeaderDescriptions:
          rpHeaderDescription.length > 0 ? rpHeaderDescription : [],
      };
    });
    const IARReportSubHeaders = IARRpSubHeaderComments.map((subHeader) => {
      const rpSubHeaderDescription = IARRpSubHeaderDescription.filter(
        (description) => description.headerId === subHeader.reportHeaderId,
      ).map((description) => ({
        id: !description.isNew ? description.id : undefined,
        topic: description.topic,
        score: description.score,
        description: description.description,
      }));
      return {
        id: subHeader.id,
        reportHeaderId: subHeader.reportHeaderId,
        headerComment: subHeader.headerComment || '',
        IARReportHeaderDescriptions:
          rpSubHeaderDescription.length > 0 ? rpSubHeaderDescription : [],
      };
    });
    const finalRpHeaderList = [...IARReportHeaders, ...IARReportSubHeaders];
    return finalRpHeaderList;
  }, [
    IARRpHeaderDescription,
    IARRpSubHeaderDescription,
    IARRpHeaderComments,
    IARRpSubHeaderComments,
  ]);

  const populateFinalData = useCallback(
    (additionalData: any) => {
      const IARComment = {
        id: internalAuditReportDetail?.internalAuditReportComment?.id,
        executiveSummary: internalAuditComments?.find(
          (i) => i.name === 'executiveSummary',
        )?.value,
        statusLastAuditFinding: internalAuditComments?.find(
          (i) => i.name === 'statusLastAuditFinding',
        )?.value,
        hullAndDeck: internalAuditComments?.find(
          (i) => i.name === 'hullAndDeck',
        )?.value,
        navigation: internalAuditComments?.find((i) => i.name === 'navigation')
          ?.value,
        machineryAndTechnical: internalAuditComments?.find(
          (i) => i.name === 'machineryAndTechnical',
        )?.value,
        cargoAndBallast: internalAuditComments?.find(
          (i) => i.name === 'cargoAndBallast',
        )?.value,
        crewManagement: internalAuditComments?.find(
          (i) => i.name === 'crewManagement',
        )?.value,
        pollutionPrevention: internalAuditComments?.find(
          (i) => i.name === 'pollutionPrevention',
        )?.value,
        safetyCulture: internalAuditComments?.find(
          (i) => i.name === 'safetyCulture',
        )?.value,
        other: internalAuditComments?.find((i) => i.name === 'other')?.value,
      };
      const newComments =
        officeComment.map((item) => {
          if (item.isNew) {
            return { comment: item.comment };
          }
          return { id: item.id, comment: item.comment };
        }) || [];
      const finalData = {
        background: backgroundImage?.id,
        attachments:
          listAttachments?.length > 0 ? listAttachments?.map((i) => i?.id) : [],
        internalAuditComment: IARComment,
        officeComments: newComments.length > 0 ? newComments : [],
        IARReportHeaders: buildIARRpHeaderResponse(),
        workflowRemarks,
        ...additionalData,
      };
      return finalData;
    },
    [
      backgroundImage?.id,
      buildIARRpHeaderResponse,
      internalAuditComments,
      internalAuditReportDetail?.internalAuditReportComment?.id,
      listAttachments,
      officeComment,
      workflowRemarks,
    ],
  );

  const handleSubmitReview = useCallback(
    async (remark: string, userAssignment?: any) => {
      setLoading(true);
      const finalData = populateFinalData({
        workflowRemarks,
        reportFindingItems:
          reportFindingItems?.length > 0 ? reportFindingItems : undefined,
        remark,
        userAssignment,
      });
      try {
        handleSetGlobalLoading(true);
        await updateInternalAuditReportReviewActionsApi({
          id,
          isReviewed: true,
          data: finalData,
        });
        dispatch(getInternalAuditReportDetailActions.request(id));
        closeConfirmationModal();
        toastSuccess('You have reviewed successfully');
      } catch (e) {
        toastError(e);
        handleSetGlobalLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      populateFinalData,
      workflowRemarks,
      reportFindingItems,
      handleSetGlobalLoading,
      id,
      dispatch,
    ],
  );

  const handleSubmitReassign = useCallback(
    async (remark?: string, userAssignment?: any) => {
      const finalData = populateFinalData({ remark, userAssignment });
      setLoading(true);
      try {
        handleSetGlobalLoading(true);
        await updateInternalAuditReportReviewActionsApi({
          id,
          isReassigned: true,
          data: finalData,
        });
        dispatch(getInternalAuditReportDetailActions.request(id));
        closeConfirmationModal();
        toastSuccess('You have reassigned successfully');
      } catch (e) {
        toastError(e);
        handleSetGlobalLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, handleSetGlobalLoading, id, populateFinalData, setLoading],
  );

  const handleSubmitApprove = useCallback(
    async (remark?: string, userAssignment?: any) => {
      setLoading(true);
      const finalData = populateFinalData({
        workflowRemarks,
        remark,
        userAssignment,
      });
      try {
        handleSetGlobalLoading(true);
        await updateInternalAuditReportApproveActionsApi({
          id,
          data: finalData,
          isApproved: true,
        });
        dispatch(getInternalAuditReportDetailActions.request(id));
        closeConfirmationModal();
        toastSuccess('You have approved successfully');
      } catch (e) {
        handleSetGlobalLoading(false);
        toastError(e);
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      handleSetGlobalLoading,
      id,
      populateFinalData,
      setLoading,
      workflowRemarks,
    ],
  );

  const handleSubmitCloseout = useCallback(
    async (remark: string, userAssignment?: any) => {
      setLoading(true);
      try {
        const finalData = populateFinalData({ remark, userAssignment });
        handleSetGlobalLoading(true);
        await updateInternalAuditReportCloseoutActionsApi({
          id,
          isCloseout: true,
          data: finalData,
        });
        closeConfirmationModal();
        toastSuccess('You have closed out successfully');
        dispatch(clearInternalAuditReportReducer());
        setTimeout(() => {
          history.push(AppRouteConst.INTERNAL_AUDIT_REPORT);
        }, 100);
      } catch (e) {
        handleSetGlobalLoading(false);
        toastError(e);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, handleSetGlobalLoading, id, populateFinalData, setLoading],
  );

  const handleActionsByStatus = useCallback(
    (remark?: any, userAssignment?: any) => {
      openModalRemark(false);
      switch (currentAction) {
        case 'reviewed': {
          handleSubmitReview(remark, userAssignment);
          break;
        }
        case 'reassigned': {
          handleSubmitReassign(remark, userAssignment);
          break;
        }

        case 'approved': {
          handleSubmitApprove(remark, userAssignment);
          break;
        }
        case 'closeout': {
          handleSubmitCloseout(remark, userAssignment);
          break;
        }
        default:
          break;
      }
    },
    [
      currentAction,
      handleSubmitApprove,
      handleSubmitCloseout,
      handleSubmitReassign,
      handleSubmitReview,
      openModalRemark,
    ],
  );

  const isPIC = useMemo(
    () =>
      internalAuditReportDetail?.nonConformities?.data?.some(
        (i) => i.picId === userInfo?.id,
      ) ||
      internalAuditReportDetail?.observations?.data?.some(
        (i) => i.picId === userInfo?.id,
      ),
    [
      internalAuditReportDetail?.nonConformities?.data,
      internalAuditReportDetail?.observations?.data,
      userInfo?.id,
    ],
  );

  const workFollowInternalAuditReportDetail = useMemo(() => {
    const workFollow = [];
    internalAuditReportDetail?.userAssignments?.forEach((item) => {
      if (!workFollow?.includes(item?.permission)) {
        workFollow.push(item?.permission);
      }
    });
    return workFollow?.sort();
  }, [internalAuditReportDetail?.userAssignments]);

  const isVisibleEditBtn = useMemo(() => {
    const isCurrentDocChartererVesselOwner = checkDocHolderChartererVesselOwner(
      {
        vesselDocHolders: internalAuditReportDetail?.vesselDocHolders,
        vesselCharterers: internalAuditReportDetail?.vesselCharterers,
        vesselOwners: internalAuditReportDetail?.vesselOwners,
        createdAt: internalAuditReportDetail?.createdAt,
        entityType: internalAuditReportDetail?.entityType,
      },
      userInfo,
    );

    const status = internalAuditReportDetail?.status;

    const hasPermissionCreator = workFlowActiveUserPermission?.includes(
      ActivePermission.CREATOR,
    );
    const hasPermissionApprover = workFlowActiveUserPermission?.includes(
      ActivePermission.APPROVER,
    );
    const hasPermissionReview2 = workFlowActiveUserPermission?.includes(
      IARReviewPermission.REVIEWER_2,
    );
    const hasPermissionReview3 = workFlowActiveUserPermission?.includes(
      IARReviewPermission.REVIEWER_3,
    );
    const hasPermissionReview4 = workFlowActiveUserPermission?.includes(
      IARReviewPermission.REVIEWER_4,
    );
    const hasPermissionReview5 = workFlowActiveUserPermission?.includes(
      IARReviewPermission.REVIEWER_5,
    );

    // const closeOutAssignmentPermission = checkAssignmentPermission(
    //   userInfo?.id,
    //   ActivePermission.CLOSE_OUT,
    //   userAssignments,
    // );
    const hasReview2IARDetail = workFollowInternalAuditReportDetail?.includes(
      IARReviewPermission.REVIEWER_2,
    );
    const hasReview3IARDetail = workFollowInternalAuditReportDetail?.includes(
      IARReviewPermission.REVIEWER_3,
    );
    const hasReview4IARDetail = workFollowInternalAuditReportDetail?.includes(
      IARReviewPermission.REVIEWER_4,
    );
    const hasReview5IARDetail = workFollowInternalAuditReportDetail?.includes(
      IARReviewPermission.REVIEWER_5,
    );

    const draftEditCase =
      InternalAuditReportStatus.DRAFT === status &&
      (hasPermissionCreator || isPIC);

    const submittedCase =
      status === InternalAuditReportStatus.SUBMITTED &&
      (reviewer1AssignmentPermission || isPIC);
    const reviewer1Case =
      status === InternalAuditReportStatus.REVIEWED_1 &&
      ((reviewer2AssignmentPermission && hasReview2IARDetail) ||
        (reviewer3AssignmentPermission &&
          hasReview3IARDetail &&
          !hasReview2IARDetail) ||
        (reviewer4AssignmentPermission &&
          hasReview4IARDetail &&
          !hasReview2IARDetail &&
          !hasReview3IARDetail) ||
        (reviewer5AssignmentPermission &&
          hasReview5IARDetail &&
          !hasReview2IARDetail &&
          !hasReview3IARDetail &&
          !hasReview4IARDetail) ||
        isPIC ||
        (hasPermissionApprover &&
          !hasPermissionReview2 &&
          !hasPermissionReview3 &&
          !hasPermissionReview4 &&
          !hasPermissionReview5));
    const reviewer2Case =
      status === InternalAuditReportStatus.REVIEWED_2 &&
      ((reviewer3AssignmentPermission && hasReview3IARDetail) ||
        isPIC ||
        (reviewer4AssignmentPermission &&
          hasReview4IARDetail &&
          !hasReview3IARDetail) ||
        (reviewer5AssignmentPermission &&
          hasReview5IARDetail &&
          !hasReview3IARDetail &&
          !hasReview4IARDetail) ||
        (hasPermissionApprover &&
          !hasPermissionReview3 &&
          !hasPermissionReview4 &&
          !hasPermissionReview5));

    const reviewer3Case =
      status === InternalAuditReportStatus.REVIEWED_3 &&
      ((reviewer4AssignmentPermission && hasReview4IARDetail) ||
        isPIC ||
        (reviewer5AssignmentPermission &&
          hasReview5IARDetail &&
          !hasReview4IARDetail) ||
        (hasPermissionApprover &&
          !hasPermissionReview4 &&
          !hasPermissionReview5));
    const reviewer4Case =
      status === InternalAuditReportStatus.REVIEWED_4 &&
      ((reviewer5AssignmentPermission && hasReview5IARDetail) ||
        isPIC ||
        (hasPermissionApprover && !hasPermissionReview5));
    const reviewer5Case =
      status === InternalAuditReportStatus.REVIEWED_5 &&
      (approveAssignmentPermission || isPIC);

    const approverEditCase =
      status === InternalAuditReportStatus.APPROVED &&
      (approveAssignmentPermission || isPIC);

    const reassignEditCase =
      InternalAuditReportStatus.REASSIGNED === status && hasPermissionCreator;

    if (
      (draftEditCase ||
        submittedCase ||
        reviewer1Case ||
        reviewer2Case ||
        reviewer3Case ||
        reviewer4Case ||
        reviewer5Case ||
        approverEditCase ||
        reassignEditCase) &&
      isCurrentDocChartererVesselOwner
    ) {
      return true;
    }
    return false;
  }, [
    internalAuditReportDetail?.vesselDocHolders,
    internalAuditReportDetail?.vesselCharterers,
    internalAuditReportDetail?.vesselOwners,
    internalAuditReportDetail?.createdAt,
    internalAuditReportDetail?.entityType,
    internalAuditReportDetail?.status,
    userInfo,
    workFlowActiveUserPermission,
    workFollowInternalAuditReportDetail,
    isPIC,
    reviewer1AssignmentPermission,
    reviewer2AssignmentPermission,
    reviewer3AssignmentPermission,
    reviewer4AssignmentPermission,
    reviewer5AssignmentPermission,
    approveAssignmentPermission,
  ]);

  const isVisibleReviewBtn = useMemo(() => {
    if (
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.SUBMITTED) &&
        reviewer1AssignmentPermission) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_1) &&
        (reviewer2AssignmentPermission ||
          reviewer3AssignmentPermission ||
          reviewer4AssignmentPermission ||
          reviewer5AssignmentPermission)) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_2) &&
        (reviewer3AssignmentPermission ||
          reviewer4AssignmentPermission ||
          reviewer5AssignmentPermission)) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_3) &&
        (reviewer4AssignmentPermission || reviewer5AssignmentPermission)) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_4) &&
        reviewer5AssignmentPermission)
    ) {
      return true;
    }
    return false;
  }, [
    internalAuditReportDetail?.status,
    reviewer1AssignmentPermission,
    reviewer2AssignmentPermission,
    reviewer3AssignmentPermission,
    reviewer4AssignmentPermission,
    reviewer5AssignmentPermission,
  ]);

  const isVisibleReassignBtn = useMemo(() => {
    if (
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.SUBMITTED) &&
        reviewer1AssignmentPermission) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_1) &&
        (reviewer2AssignmentPermission ||
          reviewer3AssignmentPermission ||
          reviewer4AssignmentPermission ||
          reviewer5AssignmentPermission)) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_2) &&
        (reviewer3AssignmentPermission ||
          reviewer4AssignmentPermission ||
          reviewer5AssignmentPermission)) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_3) &&
        (reviewer4AssignmentPermission || reviewer5AssignmentPermission)) ||
      (populateStatus(internalAuditReportDetail?.status) ===
        populateStatus(InternalAuditReportStatus.REVIEWED_4) &&
        reviewer5AssignmentPermission) ||
      (allowApprover(
        internalAuditReportDetail?.status,
        workFlowActiveUserPermission,
      ) &&
        (approveAssignmentPermission || isPIC))
    ) {
      return true;
    }
    return false;
  }, [
    approveAssignmentPermission,
    internalAuditReportDetail?.status,
    isPIC,
    reviewer1AssignmentPermission,
    reviewer2AssignmentPermission,
    reviewer3AssignmentPermission,
    reviewer4AssignmentPermission,
    reviewer5AssignmentPermission,
    workFlowActiveUserPermission,
  ]);

  const isVisibleCloseoutBtn = useMemo(() => {
    if (
      internalAuditReportDetail?.status ===
        InternalAuditReportStatus.APPROVED &&
      approveAssignmentPermission &&
      isClosedOutAllFindings() &&
      isAllCarClose
    ) {
      return true;
    }
    return false;
  }, [
    approveAssignmentPermission,
    internalAuditReportDetail?.status,
    isAllCarClose,
    isClosedOutAllFindings,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openModalByStatus = (status: string) => {
    setCurrentAction(status);
    setTitleModalRemark(status);
    openModalRemark(true);
  };

  const headerButtons: HeaderBtn[] = useMemo(() => {
    const isCompany =
      userInfo?.mainCompanyId === internalAuditReportDetail?.companyId;
    let newAction = [
      {
        name: HeaderBtnType.BACK,
        onClick: () => {
          history.push('/internal-audit-report');
        },
        disabled: globalLoading,
        visible: true,
      },
    ];
    if (isCompany) {
      newAction = [
        ...newAction,

        {
          name: HeaderBtnType.EDIT,
          onClick: () => {
            history.push(
              `${AppRouteConst.getInternalAuditReportById(id)}${
                CommonQuery.EDIT
              }`,
            );
          },
          disabled: globalLoading,
          visible: search !== CommonQuery.EDIT && isVisibleEditBtn,
        },
        {
          onClick: () => {
            openModalByStatus('reviewed');
          },
          name: HeaderBtnType.REVIEW,
          disabled: globalLoading,
          visible: search === CommonQuery.EDIT && isVisibleReviewBtn,
        },
        {
          onClick: () => {
            openModalByStatus('reassigned');
          },
          name: HeaderBtnType.REASSIGN,
          disabled: globalLoading,
          visible: search === CommonQuery.EDIT && isVisibleReassignBtn,
        },
        {
          onClick: () => {
            openModalByStatus('approved');
          },
          name: HeaderBtnType.APPROVE,
          disabled: globalLoading,
          visible:
            search === CommonQuery.EDIT &&
            allowApprover(
              internalAuditReportDetail?.status,
              workFlowActiveUserPermission,
            ) &&
            (approveAssignmentPermission || isPIC),
        },
        {
          onClick: () => {
            openModalByStatus('closeout');
          },
          name: HeaderBtnType.CLOSEOUT,
          disabled: globalLoading,
          visible: search === CommonQuery.EDIT && isVisibleCloseoutBtn,
        },
      ];
    }
    return newAction;
  }, [
    userInfo?.mainCompanyId,
    internalAuditReportDetail?.companyId,
    internalAuditReportDetail?.status,
    globalLoading,
    search,
    isVisibleEditBtn,
    isVisibleReviewBtn,
    isVisibleReassignBtn,
    workFlowActiveUserPermission,
    approveAssignmentPermission,
    isPIC,
    isVisibleCloseoutBtn,
    id,
    openModalByStatus,
  ]);

  const handleExportPdf = useCallback(
    (params) => {
      setExportLoading(true);
      getDetailPdfInternalAuditReport(id, { ...params, timezone: tz?.guess() })
        .then(async (res) => {
          await setExportLoading(true);
          await handleAndDownloadFilePdf(
            res.data,
            params?.name || 'Inspection Report',
          );
          setExportLoading(false);
        })
        .catch((e) => {
          toastError(e);
          setExportLoading(false);
        });
    },
    [id],
  );

  const leadAuditors =
    internalAuditReportDetail?.iarUsers?.length > 0
      ? internalAuditReportDetail?.iarUsers
          ?.filter((item) => item.relationship === 'leadAuditor')
          ?.map((item) => item.username)
          ?.join(', ')
      : '';
  const auditors =
    internalAuditReportDetail?.iarUsers?.length > 0
      ? internalAuditReportDetail?.iarUsers
          ?.filter(
            (item) =>
              item.relationship === 'leadAuditor' ||
              item.relationship === 'auditor',
          )
          ?.map((item) => item.username)
          ?.join(', ')
      : '';

  return useMemo(
    () => (
      <div className="d-flex align-items-center">
        <HeaderButtons
          dynamicLabels={dynamicLabels}
          buttons={headerButtons.filter(
            (button) => button.visible && !button.disabled,
          )}
        />

        <PermissionCheck
          options={{
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
            action: ActionTypeEnum.EXPORT,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                style={{ marginLeft: 10 }}
                disabled={exportLoading}
                onClick={() => setModalExportVisible(true)}
                className={styles.customExportBtn}
              >
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Export,
                  )}
                </span>
                {exportLoading ? <LoadingOutlined /> : <DownloadOutlined />}
              </Button>
            )
          }
        </PermissionCheck>
        {userInfo?.mainCompanyId === internalAuditReportDetail?.companyId &&
          internalAuditReportDetail?.status !==
            InternalAuditReportStatus.DRAFT && (
            <PermissionCheck
              options={{
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
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
        <ModalSendMail
          planningAndRequestDetail={{
            ...PlanningAndRequestDetail,
            leadAuditorList: leadAuditors,
            auditorList: auditors,
          }}
          dynamicLabels={dynamicLabels}
          mailModule={MAIL_MODULES_IDS.INSPECTION_REPORT}
          planningRequestId={PlanningAndRequestDetail?.id}
          attachmentIdsPlanning={PlanningAndRequestDetail?.attachments || []}
          entityType={PlanningAndRequestDetail?.entityType || ''}
          vesselTypeId={
            PlanningAndRequestDetail?.vessel?.vesselType?.id || null
          }
          mailTypeId={MAIL_TYPES_IDS.INSPECTION_REPORT}
          workingType={PlanningAndRequestDetail?.workingType || ''}
          isOpen={modalSendEmailVisible}
          zipFileName={`Inspection report ${internalAuditReportDetail?.refId}.zip`}
          onClose={() => {
            setModalSendEmailVisible(false);
          }}
          exportApi={() =>
            getDetailPdfInternalAuditReport(id, { timezone: tz?.guess() })
          }
          exportName="Inspection Report.pdf"
        />
        {/* <ModalRemark
          isOpen={modalRemarkVisible}
          onClose={() => openModalRemark(false)}
          title={capitalize(titleModalRemark)}
          content={`Are you sure you want to ${String(
            titleModalRemark,
          ).toLowerCase()}?`}
          onConfirm={(remark) => handleActionsByStatus(remark)}
        /> */}
        <InspectionReportAssignment
          titleModalRemark={titleModalRemark}
          data={internalAuditReportDetail}
          isOpen={modalRemarkVisible}
          onClose={() => openModalRemark(false)}
          initialData={userAssignmentFromDetail}
          userAssignmentDetails={internalAuditReportDetail?.userAssignments}
          loadingWhenSubmit={loading}
          dynamicLabels={dynamicLabels}
          onConfirm={(values) => {
            const { remark, ...dataAssignment } = values;
            const userAssignment = populateAssignment(
              dataAssignment?.userAssignment,
            );
            // case submit
            if (
              internalAuditReportDetail?.status ===
                InternalAuditReportStatus.DRAFT ||
              internalAuditReportDetail?.status ===
                InternalAuditReportStatus.REASSIGNED
            ) {
              handleSubmit(true, userAssignment);
              return;
            }

            handleActionsByStatus(remark, userAssignment);
          }}
        />
        <ModalConfirmExport
          isOpen={modalExportVisible}
          dynamicLabels={dynamicLabels}
          onConfirm={handleExportPdf}
          initialValues={{
            name: internalAuditReportDetail?.refId
              ? `Detailed Report - ${internalAuditReportDetail?.refId}`
              : '',
          }}
          onClose={() => setModalExportVisible(false)}
        />
      </div>
    ),
    [
      headerButtons,
      userInfo?.mainCompanyId,
      internalAuditReportDetail,
      PlanningAndRequestDetail,
      leadAuditors,
      auditors,
      modalSendEmailVisible,
      titleModalRemark,
      modalRemarkVisible,
      userAssignmentFromDetail,
      loading,
      modalExportVisible,
      handleExportPdf,
      exportLoading,
      dynamicLabels,
      id,
      openModalRemark,
      populateAssignment,
      handleActionsByStatus,
      handleSubmit,
    ],
  );
};
export default IARActionButtonsSection;
