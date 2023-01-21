import { useEffect, useState } from 'react';
import { toastError } from 'helpers/notification.helper';
import { getWorkFlowActiveUserPermissionApi } from 'api/work-flow.api';

const useWorkflowPermission = (workflowType: string) => {
  const [workflow, setWorkflow] = useState(null);
  useEffect(() => {
    if (workflowType) {
      getWorkFlowActiveUserPermissionApi({
        workflowType,
      })
        .then((res) => {
          setWorkflow(res?.data || []);
        })
        .catch((err) => toastError(err));
    }
  }, [workflowType]);
  return workflow;
};

export default useWorkflowPermission;
