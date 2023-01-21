import { FC, useMemo } from 'react';
import ModalAssignment from 'components/ui/modal/modal-assignment/ModalAssignment';
import useWorkflowTypePermission from 'hoc/useWorkflowTypePermission';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import { PlanningAndRequest } from 'models/api/planning-and-request/planning-and-request.model';
import { PLANNING_STATUES } from 'constants/planning-and-request.const';
import { replaceGrammarPlanning } from 'helpers/grammar.helper';
import { UserAssignments } from 'models/common.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface Props {
  titleModalRemark?: string;
  planningAndRequestDetail?: PlanningAndRequest;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: (values: any) => void;
  isCreate?: boolean;
  initialData?: any;
  vesselId?: string;
  userAssignmentDetails: UserAssignments[];
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const Assignment: FC<Props> = ({
  titleModalRemark,
  planningAndRequestDetail,
  onConfirm,
  isOpen,
  onClose,
  isCreate,
  initialData,
  vesselId,
  userAssignmentDetails,
  loading,
  dynamicLabels,
}) => {
  const approvePermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.PLANNING_REQUEST,
    workflowPermission: ActivePermission.APPROVER,
    vesselId: vesselId || planningAndRequestDetail?.vesselId || undefined,
  });
  const acceptPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.PLANNING_REQUEST,
    workflowPermission: ActivePermission.AUDITOR,
    vesselId: vesselId || planningAndRequestDetail?.vesselId || undefined,
  });
  const ownerManagerPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.PLANNING_REQUEST,
    workflowPermission: ActivePermission.OWNER_MANAGER,
    vesselId: vesselId || planningAndRequestDetail?.vesselId || undefined,
  });

  const rejectCase = useMemo(
    () => titleModalRemark === 'reject',
    [titleModalRemark],
  );

  const caseSubmit = useMemo(
    () =>
      planningAndRequestDetail?.status === PLANNING_STATUES.Draft ||
      planningAndRequestDetail?.status === PLANNING_STATUES.Rejected ||
      isCreate,
    [isCreate, planningAndRequestDetail?.status],
  );

  const caseApprove = useMemo(
    () => titleModalRemark === 'approve',
    [titleModalRemark],
  );

  const caseAccept = useMemo(
    () => titleModalRemark === 'accept',
    [titleModalRemark],
  );

  const renderDataInput = useMemo(() => {
    if (caseSubmit) {
      return null;
    }
    return {
      title: `${renderDynamicLabel(
        dynamicLabels,
        DETAIL_PLANNING_DYNAMIC_FIELDS['Are you sure you want to'],
      )} ${replaceGrammarPlanning(titleModalRemark)?.toLowerCase()}?`,
      isRequired: rejectCase,
    };
  }, [caseSubmit, dynamicLabels, rejectCase, titleModalRemark]);

  const renderDataSelect = useMemo(() => {
    const approverDataSelect = approvePermission?.workflowType?.map((item) => ({
      value: item?.id,
      content: item?.username,
      id: item?.id,
      userName: item?.username,
      jobTitle: item?.jobTitle,
      company: item?.company?.name || '',
      businessDivision: item?.divisions?.length
        ? item?.divisions?.map((i) => i.name)?.join(', ')
        : '',
    }));
    const acceptorDataSelect = acceptPermission?.workflowType?.map((item) => ({
      value: item?.id,
      content: item?.username,
      id: item?.id,
      userName: item?.username,
      jobTitle: item?.jobTitle,
      company: item?.company?.name || '',
      businessDivision: item?.divisions?.length
        ? item?.divisions?.map((i) => i.name)?.join(', ')
        : ' ',
    }));
    const ownerManagerDataSelect = ownerManagerPermission?.workflowType?.map(
      (item) => ({
        value: item?.id,
        content: item?.username,
        id: item?.id,
        userName: item?.username,
        jobTitle: item?.jobTitle,
        company: item?.company?.name || '',
        businessDivision: item?.divisions?.length
          ? item?.divisions?.map((i) => i.name)?.join(', ')
          : '',
      }),
    );

    userAssignmentDetails?.forEach((userAssignment) => {
      const hasApprover = approverDataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasAuditor = acceptorDataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasOwnerManager = ownerManagerDataSelect?.some(
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
        userAssignment?.permission === ActivePermission.APPROVER &&
        !hasApprover
      ) {
        approverDataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === ActivePermission.AUDITOR &&
        !hasAuditor
      ) {
        acceptorDataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === ActivePermission.OWNER_MANAGER &&
        !hasOwnerManager
      ) {
        ownerManagerDataSelect?.push(newData);
      }
    });

    if (caseSubmit) {
      return [
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Approver,
          ),
          isRequired: true,
          name: 'approver',
          dataRows: approverDataSelect,
        },
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Acceptor,
          ),
          isRequired: false,
          name: 'auditor',
          dataRows: acceptorDataSelect,
        },
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Owner/Manager'],
          ),
          isRequired: false,
          name: 'owner/manager',
          dataRows: ownerManagerDataSelect,
        },
      ];
    }
    if (caseApprove) {
      return [
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Acceptor,
          ),
          isRequired: true,
          name: 'auditor',
          dataRows: acceptorDataSelect,
        },
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Owner/Manager'],
          ),
          isRequired: false,
          name: 'owner/manager',
          dataRows: ownerManagerDataSelect,
        },
      ];
    }
    if (caseAccept) {
      return [
        {
          title: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Owner/Manager'],
          ),
          isRequired: true,
          name: 'owner/manager',
          dataRows: ownerManagerDataSelect,
        },
      ];
    }
    if (rejectCase) {
      return null;
    }
    return null;
  }, [
    approvePermission?.workflowType,
    acceptPermission?.workflowType,
    ownerManagerPermission?.workflowType,
    userAssignmentDetails,
    caseSubmit,
    caseApprove,
    caseAccept,
    rejectCase,
    dynamicLabels,
  ]);

  return (
    <div>
      <ModalAssignment
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['User assignment'],
        )}
        dataInput={renderDataInput}
        dynamicLabels={dynamicLabels}
        isOpen={isOpen}
        initialData={initialData}
        onClose={onClose}
        onConfirm={(data) => {
          onConfirm(data);
        }}
        loading={loading}
        data={renderDataSelect}
      />
    </div>
  );
};

export default Assignment;
