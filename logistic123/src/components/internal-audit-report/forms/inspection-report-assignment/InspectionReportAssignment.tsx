import { FC, useMemo, useCallback } from 'react';
// import capitalize from 'lodash/capitalize';
import ModalAssignment from 'components/ui/modal/modal-assignment/ModalAssignment';
import useWorkflowTypePermission from 'hoc/useWorkflowTypePermission';
import { useSelector } from 'react-redux';
import {
  ActivePermission,
  WorkFlowType,
  IARReviewPermission,
} from 'constants/common.const';
import { InternalAuditReportDetailResponse } from 'models/api/internal-audit-report/internal-audit-report.model';
import { replaceGrammarPlanning } from 'helpers/grammar.helper';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { UserAssignments } from 'models/common.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

const ARRAY_STATUS = [
  'draft',
  'submitted',
  'reviewed_1',
  'reviewed_2',
  'reviewed_3',
  'reviewed_4',
  'reviewed_5',
  'approved',
  'reassigned',
  'closeout',
];

interface Props {
  titleModalRemark?: string;
  data?: InternalAuditReportDetailResponse;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: (values: any) => void;
  isCreate?: boolean;
  initialData?: any;
  userAssignmentDetails?: UserAssignments[];
  loadingWhenSubmit?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const InspectionReportAssignment: FC<Props> = ({
  titleModalRemark,
  data,
  onConfirm,
  isOpen,
  onClose,
  userAssignmentDetails,
  isCreate,
  initialData,
  loadingWhenSubmit = false,
  dynamicLabels,
}) => {
  const { workFlowPermissionStep } = useSelector((store) => store.workFlow);

  const review1Permission = useWorkflowTypePermission({
    workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
    workflowPermission: IARReviewPermission.REVIEWER_1,
    vesselId: data?.iarPlanningRequest?.vesselId || undefined,
  });
  const review2Permission = useWorkflowTypePermission({
    workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
    workflowPermission: IARReviewPermission.REVIEWER_2,
    vesselId: data?.iarPlanningRequest?.vesselId || undefined,
  });
  const review3Permission = useWorkflowTypePermission({
    workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
    workflowPermission: IARReviewPermission.REVIEWER_3,
    vesselId: data?.iarPlanningRequest?.vesselId || undefined,
  });
  const review4Permission = useWorkflowTypePermission({
    workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
    workflowPermission: IARReviewPermission.REVIEWER_4,
    vesselId: data?.iarPlanningRequest?.vesselId || undefined,
  });
  const review5Permission = useWorkflowTypePermission({
    workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
    workflowPermission: IARReviewPermission.REVIEWER_5,
    vesselId: data?.iarPlanningRequest?.vesselId || undefined,
  });
  const approvePermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
    workflowPermission: ActivePermission.APPROVER,
    vesselId: data?.iarPlanningRequest?.vesselId || undefined,
  });

  const rejectCase = useMemo(
    () => titleModalRemark === 'reject',
    [titleModalRemark],
  );
  const review1Case = useMemo(
    () =>
      titleModalRemark === 'reviewed' &&
      data?.status === InternalAuditReportStatus.SUBMITTED,
    [data?.status, titleModalRemark],
  );
  // const review2Case = useMemo(
  //   () =>
  //     titleModalRemark === 'reviewed' &&
  //     data?.status === InternalAuditReportStatus.REVIEWED_1,
  //   [data?.status, titleModalRemark],
  // );
  // const review3Case = useMemo(
  //   () =>
  //     titleModalRemark === 'reviewed' &&
  //     data?.status === InternalAuditReportStatus.REVIEWED_2,
  //   [data?.status, titleModalRemark],
  // );
  // const review4Case = useMemo(
  //   () =>
  //     titleModalRemark === 'reviewed' &&
  //     data?.status === InternalAuditReportStatus.REVIEWED_3,
  //   [data?.status, titleModalRemark],
  // );

  // const review5Case = useMemo(
  //   () =>
  //     titleModalRemark === 'reviewed' &&
  //     data?.status === InternalAuditReportStatus.REVIEWED_4,
  //   [data?.status, titleModalRemark],
  // );

  const caseSubmit = useMemo(
    () =>
      data?.status === InternalAuditReportStatus.DRAFT ||
      data?.status === InternalAuditReportStatus.REASSIGNED,
    [data?.status],
  );

  const renderDataInput = useMemo(() => {
    if (caseSubmit) {
      return null;
    }

    return {
      title: `${renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Are you sure you want to'],
      )} ${replaceGrammarPlanning(titleModalRemark)?.toLowerCase()}?`,
      isRequired: rejectCase,
    };
  }, [caseSubmit, dynamicLabels, rejectCase, titleModalRemark]);

  const checkWorkflow = useCallback(
    (workflow: string) =>
      workFlowPermissionStep?.some((item) => item?.wfrPermission === workflow),
    [workFlowPermissionStep],
  );

  const renderDataSelect = useMemo(() => {
    const mapData = (item) => ({
      value: item?.id,
      content: item?.username,
      id: item?.id,
      userName: item?.username,
      jobTitle: item?.jobTitle,
      company: item?.company?.name || '',
      businessDivision: item?.divisions?.length
        ? item?.divisions?.map((i) => i.name)?.join(', ')
        : '',
    });

    const review1DataSelect = review1Permission?.workflowType?.map(mapData);
    const review2DataSelect = review2Permission?.workflowType?.map(mapData);
    const review3DataSelect = review3Permission?.workflowType?.map(mapData);
    const review4DataSelect = review4Permission?.workflowType?.map(mapData);
    const review5DataSelect = review5Permission?.workflowType?.map(mapData);
    const approverDataSelect = approvePermission?.workflowType?.map(mapData);

    userAssignmentDetails?.forEach((userAssignment) => {
      const hasReview1 = review1DataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasReview2 = review2DataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasReview3 = review3DataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasReview4 = review4DataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasReview5 = review5DataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasApprover = approverDataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const newData = {
        value: userAssignment?.user?.id,
        content: userAssignment?.user?.username,
        id: userAssignment?.user?.id,
        userName: userAssignment?.user?.username,
        jobTitle: userAssignment?.user?.jobTitle,
        company: userAssignment?.user?.company?.name || '',
        businessDivision: userAssignment?.user?.divisions?.length
          ? userAssignment?.user?.divisions?.map((i) => i.name)?.join(', ')
          : ' ',
      };
      if (
        userAssignment?.permission === IARReviewPermission.REVIEWER_1 &&
        !hasReview1
      ) {
        review1DataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === IARReviewPermission.REVIEWER_2 &&
        !hasReview2
      ) {
        review2DataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === IARReviewPermission.REVIEWER_3 &&
        !hasReview3
      ) {
        review3DataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === IARReviewPermission.REVIEWER_4 &&
        !hasReview4
      ) {
        review4DataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === IARReviewPermission.REVIEWER_5 &&
        !hasReview5
      ) {
        review5DataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === ActivePermission.APPROVER &&
        !hasApprover
      ) {
        approverDataSelect?.push(newData);
      }
    });

    if (caseSubmit) {
      return [
        checkWorkflow('reviewer1') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['First reviewer'],
          ),
          isRequired: true,
          name: 'reviewer1',
          dataRows: review1DataSelect,
        },
        checkWorkflow('reviewer2') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Second reviewer'],
          ),
          isRequired: !checkWorkflow('reviewer1'),
          name: 'reviewer2',
          dataRows: review2DataSelect,
        },
        checkWorkflow('reviewer3') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Third reviewer'],
          ),
          isRequired:
            !checkWorkflow('reviewer1') && !checkWorkflow('reviewer2'),
          name: 'reviewer3',
          dataRows: review3DataSelect,
        },
        checkWorkflow('reviewer4') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fourth reviewer'],
          ),
          isRequired:
            !checkWorkflow('reviewer1') &&
            !checkWorkflow('reviewer2') &&
            !checkWorkflow('reviewer3'),
          name: 'reviewer4',
          dataRows: review4DataSelect,
        },
        checkWorkflow('reviewer5') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fifth reviewer'],
          ),
          isRequired:
            !checkWorkflow('reviewer1') &&
            !checkWorkflow('reviewer2') &&
            !checkWorkflow('reviewer3') &&
            !checkWorkflow('reviewer4'),
          name: 'reviewer5',
          dataRows: review5DataSelect,
        },
        checkWorkflow('approver') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Approver,
          ),
          isRequired:
            !checkWorkflow('reviewer1') &&
            !checkWorkflow('reviewer2') &&
            !checkWorkflow('reviewer3') &&
            !checkWorkflow('reviewer4') &&
            !checkWorkflow('reviewer5'),
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }
    const indexStatus = ARRAY_STATUS.indexOf(data?.status);
    const arrayWorkflow = ARRAY_STATUS?.map((status) => ({
      status,
      hasStatus: workFlowPermissionStep?.some(
        (workFlow) =>
          workFlow?.wfrPermission?.replace('reviewer', 'reviewed_') === status,
      ),
    }));

    let statusCheck = '';
    if (indexStatus > -1 && indexStatus < arrayWorkflow?.length) {
      arrayWorkflow?.forEach((item, index) => {
        if (!statusCheck && index > indexStatus && item?.hasStatus) {
          statusCheck = item.status;
        }
      });
    }
    if (review1Case) {
      return [
        checkWorkflow('reviewer2') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Second reviewer'],
          ),
          isRequired: true,
          name: 'reviewer2',
          dataRows: review2DataSelect,
        },
        checkWorkflow('reviewer3') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Third reviewer'],
          ),
          isRequired: !checkWorkflow('reviewer2'),
          name: 'reviewer3',
          dataRows: review3DataSelect,
        },
        checkWorkflow('reviewer4') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fourth reviewer'],
          ),
          isRequired:
            !checkWorkflow('reviewer2') && !checkWorkflow('reviewer3'),
          name: 'reviewer4',
          dataRows: review4DataSelect,
        },
        checkWorkflow('reviewer5') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fifth reviewer'],
          ),
          isRequired:
            !checkWorkflow('reviewer2') &&
            !checkWorkflow('reviewer3') &&
            !checkWorkflow('reviewer4'),
          name: 'reviewer5',
          dataRows: review5DataSelect,
        },
        checkWorkflow('approver') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Approver,
          ),
          isRequired:
            !checkWorkflow('reviewer2') &&
            !checkWorkflow('reviewer3') &&
            !checkWorkflow('reviewer4') &&
            !checkWorkflow('reviewer5'),
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }
    if (
      titleModalRemark === 'reviewed' &&
      statusCheck === InternalAuditReportStatus.REVIEWED_2
    ) {
      return [
        checkWorkflow('reviewer3') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Third reviewer'],
          ),
          isRequired: true,
          name: 'reviewer3',
          dataRows: review3DataSelect,
        },
        checkWorkflow('reviewer4') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fourth reviewer'],
          ),
          isRequired: !checkWorkflow('reviewer3'),
          name: 'reviewer4',
          dataRows: review4DataSelect,
        },
        checkWorkflow('reviewer5') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fifth reviewer'],
          ),
          isRequired:
            !checkWorkflow('reviewer3') && !checkWorkflow('reviewer4'),
          name: 'reviewer5',
          dataRows: review5DataSelect,
        },
        checkWorkflow('approver') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Approver,
          ),
          isRequired:
            !checkWorkflow('reviewer3') &&
            !checkWorkflow('reviewer4') &&
            !checkWorkflow('reviewer5'),
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }
    if (
      titleModalRemark === 'reviewed' &&
      statusCheck === InternalAuditReportStatus.REVIEWED_3
    ) {
      return [
        checkWorkflow('reviewer4') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fourth reviewer'],
          ),
          isRequired: true,
          name: 'reviewer4',
          dataRows: review4DataSelect,
        },
        checkWorkflow('reviewer5') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fifth reviewer'],
          ),
          isRequired: !checkWorkflow('reviewer4'),
          name: 'reviewer5',
          dataRows: review5DataSelect,
        },
        checkWorkflow('approver') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Approver,
          ),
          isRequired:
            !checkWorkflow('reviewer4') && !checkWorkflow('reviewer5'),
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }
    if (
      titleModalRemark === 'reviewed' &&
      statusCheck === InternalAuditReportStatus.REVIEWED_4
    ) {
      return [
        checkWorkflow('reviewer5') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Fifth reviewer'],
          ),
          isRequired: true,
          name: 'reviewer5',
          dataRows: review5DataSelect,
        },
        checkWorkflow('approver') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Approver,
          ),
          isRequired: !checkWorkflow('reviewer5'),
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }
    if (
      titleModalRemark === 'reviewed' &&
      statusCheck === InternalAuditReportStatus.REVIEWED_5
    ) {
      return [
        checkWorkflow('approver') && {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Approver,
          ),
          isRequired: true,
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }

    if (rejectCase) {
      return null;
    }
    return null;
  }, [
    approvePermission?.workflowType,
    caseSubmit,
    checkWorkflow,
    data?.status,
    dynamicLabels,
    rejectCase,
    review1Case,
    review1Permission?.workflowType,
    review2Permission?.workflowType,
    review3Permission?.workflowType,
    review4Permission?.workflowType,
    review5Permission?.workflowType,
    titleModalRemark,
    userAssignmentDetails,
    workFlowPermissionStep,
  ]);

  return (
    <div>
      <ModalAssignment
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['User assignment'],
        )}
        dataInput={renderDataInput}
        isOpen={isOpen}
        initialData={initialData}
        onClose={onClose}
        onConfirm={(data) => {
          onConfirm({
            remark: data.dataInput,
            userAssignment: data,
          });
        }}
        data={renderDataSelect?.filter((item) => item)}
        loading={loadingWhenSubmit}
      />
    </div>
  );
};

export default InspectionReportAssignment;
