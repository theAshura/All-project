import { FC, useMemo } from 'react';
import ModalAssignment from 'components/ui/modal/modal-assignment/ModalAssignment';
import useWorkflowTypePermission from 'hoc/useWorkflowTypePermission';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import { UserAssignments } from 'models/common.model';

interface Props {
  titleModal?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: (values: any) => void;
  initialData?: any;
  userAssignmentDetails?: UserAssignments[];
  isCreate?: boolean;
  loading?: boolean;
}

const Assignment: FC<Props> = ({
  titleModal,
  onConfirm,
  isOpen,
  onClose,
  initialData,
  userAssignmentDetails,
  isCreate,
  loading = false,
}) => {
  const publisherPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.SELF_ASSESSMENT,
    workflowPermission: ActivePermission.PUBLISHER,
  });

  const reviewPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.SELF_ASSESSMENT,
    workflowPermission: ActivePermission.REVIEWER,
  });

  const renderDataSelect = useMemo(() => {
    const publisherDataSelect = publisherPermission?.workflowType?.map(
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
      const hasPublisher = publisherDataSelect?.some(
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
        userAssignment?.permission === ActivePermission.PUBLISHER &&
        !hasPublisher
      ) {
        publisherDataSelect?.push(newData);
      }
      if (
        userAssignment?.permission === ActivePermission.REVIEWER &&
        !hasAcceptor
      ) {
        acceptorDataSelect?.push(newData);
      }
    });

    if (titleModal === 'creator') {
      return [
        {
          title: 'Reviewer',
          isRequired: true,
          name: 'reviewer',
          dataRows: acceptorDataSelect,
          autoSelectData:
            acceptorDataSelect?.length === 1 && isCreate && !initialData?.length
              ? acceptorDataSelect
              : undefined, // when create case and just 1 select option => auto focus
        },
        {
          title: 'Publisher',
          isRequired: false,
          name: 'publisher',
          dataRows: publisherDataSelect,
          autoSelectData:
            publisherDataSelect?.length === 1 &&
            isCreate &&
            !initialData?.length
              ? publisherDataSelect
              : undefined, // when create case and just 1 select option => auto focus
        },
      ];
    }
    return [
      {
        title: 'Publisher',
        isRequired: true,
        name: 'publisher',
        dataRows: publisherDataSelect,
      },
    ];
  }, [
    publisherPermission?.workflowType,
    reviewPermission?.workflowType,
    userAssignmentDetails,
    titleModal,
    isCreate,
    initialData?.length,
  ]);

  return (
    <div>
      <ModalAssignment
        title="User assignment"
        initialData={initialData}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        data={renderDataSelect}
        loading={loading}
      />
    </div>
  );
};

export default Assignment;
