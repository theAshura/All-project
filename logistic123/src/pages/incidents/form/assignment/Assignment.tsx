import { FC, useMemo } from 'react';
import ModalAssignment from 'components/ui/modal/modal-assignment/ModalAssignment';
import useWorkflowTypePermission from 'hoc/useWorkflowTypePermission';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import { replaceGrammarPlanning } from 'helpers/grammar.helper';
import { UserAssignments } from 'models/common.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IncidentsStatuses } from 'constants/components/incidents.const';

interface Props {
  titleModalRemark?: string;
  data?: any;
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
  data,
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
  const reviewerPermission = useWorkflowTypePermission({
    workflowType: WorkFlowType.Incidents,
    workflowPermission: ActivePermission.REVIEWER,
    vesselId: vesselId || data?.vesselId || undefined,
  });

  const reassignCase = useMemo(
    () => titleModalRemark === 'reassign',
    [titleModalRemark],
  );

  const caseSubmit = useMemo(
    () =>
      data?.status === IncidentsStatuses.Draft ||
      data?.status === IncidentsStatuses.Reassign ||
      isCreate,
    [isCreate, data?.status],
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
      isRequired: reassignCase,
    };
  }, [caseSubmit, dynamicLabels, reassignCase, titleModalRemark]);

  const renderDataSelect = useMemo(() => {
    const reviewerDataSelect = reviewerPermission?.workflowType?.map(
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

    if (caseSubmit) {
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
      ];
    }

    return null;
  }, [reviewerPermission?.workflowType, caseSubmit, dynamicLabels]);

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
