import { FC, useMemo } from 'react';
import ModalAssignment from 'components/ui/modal/modal-assignment/ModalAssignment';
import useWorkflowTypePermission from 'hoc/useWorkflowTypePermission';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import { UserAssignments } from 'models/common.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';

interface Props {
  titleModal?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: (values: any) => void;
  initialData?: any;
  userAssignmentDetails?: UserAssignments[];
  dynamicLabel: IDynamicLabel;
}

const Assignment: FC<Props> = ({
  titleModal,
  onConfirm,
  isOpen,
  onClose,
  initialData,
  userAssignmentDetails,
  dynamicLabel,
}) => {
  const approvePermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.AUDIT_CHECKLIST,
    workflowPermission: ActivePermission.APPROVER,
  });
  const reviewPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.AUDIT_CHECKLIST,
    workflowPermission: ActivePermission.REVIEWER,
  });

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
    const acceptorDataSelect = reviewPermission?.workflowType?.map((item) => ({
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

    userAssignmentDetails?.forEach((userAssignment) => {
      const hasApprover = approverDataSelect?.some(
        (publisher) => publisher?.id === userAssignment?.user?.id,
      );
      const hasAcceptor = acceptorDataSelect?.some(
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
        userAssignment?.permission === ActivePermission.REVIEWER &&
        !hasAcceptor
      ) {
        acceptorDataSelect?.push(newData);
      }
    });

    if (titleModal === 'submit') {
      return [
        {
          title: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
              .Reviewer,
          ),
          isRequired: true,
          name: 'reviewer',
          dataRows: acceptorDataSelect,
        },
        {
          title: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
              .Approver,
          ),
          isRequired: false,
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }
    if (titleModal === 'accept') {
      return [
        {
          title: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
              .Approver,
          ),
          isRequired: true,
          name: 'approver',
          dataRows: approverDataSelect,
        },
      ];
    }
    return null;
  }, [
    approvePermission?.workflowType,
    dynamicLabel,
    reviewPermission?.workflowType,
    titleModal,
    userAssignmentDetails,
  ]);
  const renderDataInput = useMemo(() => {
    if (titleModal === 'accept') {
      return {
        title: `${renderDynamicLabel(
          dynamicLabel,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Are you sure you want to'
          ],
        )} ${titleModal?.toLowerCase()}?`,
        isRequired: false,
        minLength: 2,
      };
    }
    return null;
  }, [dynamicLabel, titleModal]);

  return (
    <div>
      <ModalAssignment
        dataInput={renderDataInput}
        title={renderDynamicLabel(
          dynamicLabel,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'User assignment'
          ],
        )}
        initialData={initialData}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        data={renderDataSelect}
        dynamicLabel={dynamicLabel}
      />
    </div>
  );
};

export default Assignment;
