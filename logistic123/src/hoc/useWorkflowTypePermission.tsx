import { useState, useEffect } from 'react';
import { toastError } from 'helpers/notification.helper';
import { getWorkFlowTypePermissionApi } from 'api/work-flow.api';

const useWorkflowTypePermission = (params: {
  workflowType: string;
  workflowPermission: string;
  vesselId?: string;
}) => {
  const [workflowType, setWorkflowType] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (params) {
      setLoading(true);
      getWorkFlowTypePermissionApi(params)
        .then((res) => {
          setLoading(false);
          setWorkflowType(res?.data || []);
        })
        .catch((err) => {
          setLoading(false);
          toastError(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.vesselId]);
  return { workflowType, loading };
};

export default useWorkflowTypePermission;
