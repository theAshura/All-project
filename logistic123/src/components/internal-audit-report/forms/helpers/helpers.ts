import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IARReviewPermission, ActivePermission } from 'constants/common.const';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';

export const useAuditor = () => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { userInfo } = useSelector((store) => store.authenticate);

  const isAuditor = useCallback(() => {
    if (
      internalAuditReportDetail?.iarUsers?.some(
        (i) =>
          i.userId === userInfo?.id &&
          (i.relationship === 'leadAuditor' || i.relationship === 'auditor'),
      )
    ) {
      return true;
    }
    return false;
  }, [internalAuditReportDetail, userInfo]);
  return isAuditor;
};

export const populateStatus = (status) =>
  String(status).toLowerCase()?.replace('_', '')?.replace(' ', '');

export const allowApprover = (status, workflow) => {
  switch (true) {
    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_1) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_2) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_3) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_4) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_5) &&
      workflow?.includes(ActivePermission.APPROVER):
      return true;

    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_2) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_3) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_4) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_5) &&
      workflow?.includes(ActivePermission.APPROVER):
      return true;

    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_3) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_4) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_5) &&
      workflow?.includes(ActivePermission.APPROVER):
      return true;

    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_4) &&
      !workflow?.includes(IARReviewPermission.REVIEWER_5) &&
      workflow?.includes(ActivePermission.APPROVER):
      return true;

    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_5) &&
      workflow?.includes(ActivePermission.APPROVER):
      return true;
    default:
      return false;
  }
};

export const checkReviewStatus = (status, workflow) => {
  switch (true) {
    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.SUBMITTED) &&
      workflow?.includes(IARReviewPermission.REVIEWER_1):
      return true;
    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_1) &&
      (workflow?.includes(IARReviewPermission.REVIEWER_2) ||
        workflow?.includes(IARReviewPermission.REVIEWER_3) ||
        workflow?.includes(IARReviewPermission.REVIEWER_4) ||
        workflow?.includes(IARReviewPermission.REVIEWER_5)):
      return true;

    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_2) &&
      (workflow?.includes(IARReviewPermission.REVIEWER_3) ||
        workflow?.includes(IARReviewPermission.REVIEWER_4) ||
        workflow?.includes(IARReviewPermission.REVIEWER_5)):
      return true;

    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_3) &&
      (workflow?.includes(IARReviewPermission.REVIEWER_4) ||
        workflow?.includes(IARReviewPermission.REVIEWER_5)):
      return true;

    case populateStatus(status) ===
      populateStatus(InternalAuditReportStatus.REVIEWED_4) &&
      workflow?.includes(IARReviewPermission.REVIEWER_5):
      return true;
    default:
      return false;
  }
};

export const useReviewStatus = () => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { workFlowActiveUserPermission } = useSelector(
    (store) => store.workFlow,
  );

  const handleCheckReviewStatus = useCallback(
    () =>
      checkReviewStatus(
        internalAuditReportDetail?.status,
        workFlowActiveUserPermission,
      ),
    [internalAuditReportDetail, workFlowActiveUserPermission],
  );

  const isReviewerOrApprover = useCallback(() => {
    if (
      workFlowActiveUserPermission?.some((status) =>
        [
          IARReviewPermission.REVIEWER_1.toString(),
          IARReviewPermission.REVIEWER_2.toString(),
          IARReviewPermission.REVIEWER_3.toString(),
          IARReviewPermission.REVIEWER_4.toString(),
          IARReviewPermission.REVIEWER_5.toString(),
          ActivePermission.APPROVER.toString(),
        ].includes(status),
      )
    ) {
      return true;
    }
    return false;
  }, [workFlowActiveUserPermission]);

  return { checkReviewStatus: handleCheckReviewStatus, isReviewerOrApprover };
};

export const useDraftOrReassigned = () => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const isDraftOrReassigned = useCallback(() => {
    if (
      [
        InternalAuditReportStatus.DRAFT.toString(),
        InternalAuditReportStatus.REASSIGNED.toString(),
      ].includes(internalAuditReportDetail?.status)
    ) {
      return true;
    }
    return false;
  }, [internalAuditReportDetail]);
  return isDraftOrReassigned;
};
