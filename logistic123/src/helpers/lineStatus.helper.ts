import moment from 'moment';
import { WorkFlow } from 'pages/pilot-terminal-feedback/utils/models/common.model';
import { Info } from 'components/common/step-line/lineStepInfoCP';
import { ItemStatus } from 'components/common/step-line/lineStepCP';

export const getInfoByStatusAndWorkFlow = (
  status: ItemStatus,
  workFlow?: WorkFlow[],
): Info[] => {
  if (!workFlow) {
    return [];
  }

  const filteredRecordsByStatus = workFlow.filter(
    (record) => record?.status === status,
  );

  if (filteredRecordsByStatus.length === 0) {
    return [];
  }

  return filteredRecordsByStatus.map((record) => ({
    datetime: moment(record.createdAt).toDate(),
    description: record?.createdUser?.jobTitle || '',
    name: record?.createdUser?.username || '',
    isMulti: true,
    id: record?.createdUser?.id,
  }));
};
