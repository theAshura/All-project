import { FC, useMemo } from 'react';
import ModalAssignment from 'components/ui/modal/modal-assignment/ModalAssignment';
import useWorkflowTypePermission from 'hoc/useWorkflowTypePermission';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import { UserAssignments } from 'models/common.model';
import { replaceGrammarPlanning } from 'helpers/grammar.helper';
import { ReportOfFinding } from 'models/api/report-of-finding/report-of-finding.model';
import { ROF_STATUES } from 'constants/rof.const';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface Props {
  titleModalRemark?: string;
  data?: ReportOfFinding;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: (values: any) => void;
  isCreate?: boolean;
  initialData?: any;
  userAssignmentDetails?: UserAssignments[];
  loadingWhenSubmit?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const RofAssignment: FC<Props> = ({
  titleModalRemark,
  data,
  onConfirm,
  isOpen,
  onClose,
  isCreate,
  initialData,
  userAssignmentDetails,
  loadingWhenSubmit = false,
  dynamicLabels,
}) => {
  const reviewerPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.REPORT_FINDING,
    workflowPermission: ActivePermission.REVIEWER,
    vesselId: data?.rofPlanningRequest?.vesselId || undefined,
  });
  const closeoutPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.REPORT_FINDING,
    workflowPermission: ActivePermission.CLOSE_OUT,
    vesselId: data?.rofPlanningRequest?.vesselId || undefined,
  });

  const submitCase = useMemo(
    () =>
      data?.status === ROF_STATUES.DRAFT ||
      data?.status === ROF_STATUES.REASSIGNED,
    [data?.status],
  );

  const reviewCase = useMemo(
    () => titleModalRemark === 'Review',
    [titleModalRemark],
  );

  const rejectCase = useMemo(
    () => titleModalRemark === 'Reassign',
    [titleModalRemark],
  );

  const renderDataInput = useMemo(() => {
    if (submitCase) {
      return null;
    }
    return {
      title: `${renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Are you sure you want to'],
      )} ${replaceGrammarPlanning(titleModalRemark)?.toLowerCase()}?`,
      isRequired: rejectCase,
    };
  }, [dynamicLabels, rejectCase, submitCase, titleModalRemark]);

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
    const reviewerDataSelect = reviewerPermission?.workflowType?.map(mapData);
    const closeoutDataSelect = closeoutPermission?.workflowType?.map(mapData);

    userAssignmentDetails?.forEach((userAssignment) => {
      const hasReview = reviewerDataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasCloseout = closeoutDataSelect?.some(
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
        userAssignment?.permission === ActivePermission.REVIEWER &&
        !hasReview
      ) {
        reviewerDataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === ActivePermission.CLOSE_OUT &&
        !hasCloseout
      ) {
        closeoutDataSelect?.push(newData);
      }
    });

    if (submitCase) {
      return [
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Reviewer,
          ),
          isRequired: true,
          name: 'reviewer',
          dataRows: reviewerDataSelect,
        },
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Close out'],
          ),
          isRequired: false,
          name: 'close_out',
          dataRows: closeoutDataSelect,
        },
      ];
    }
    if (reviewCase) {
      return [
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Close out'],
          ),
          isRequired: true,
          name: 'close_out',
          dataRows: closeoutDataSelect,
        },
      ];
    }

    if (rejectCase) {
      return null;
    }
    return null;
  }, [
    closeoutPermission?.workflowType,
    dynamicLabels,
    rejectCase,
    reviewCase,
    reviewerPermission?.workflowType,
    submitCase,
    userAssignmentDetails,
  ]);

  return (
    <div>
      <ModalAssignment
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['User assignment'],
        )}
        dataInput={renderDataInput}
        isOpen={isOpen}
        dynamicLabels={dynamicLabels}
        initialData={initialData}
        onClose={onClose}
        onConfirm={(data) => {
          onConfirm(data);
        }}
        data={renderDataSelect}
        loading={loadingWhenSubmit}
      />
    </div>
  );
};

export default RofAssignment;
