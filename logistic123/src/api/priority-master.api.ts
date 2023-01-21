import { requestAuthorized } from 'helpers/request';
import { PriorityRisk } from 'models/api/audit-checklist/audit-checklist.model';
import queryString from 'query-string';
import { ASSETS_API_PRIORITY_MASTER } from './endpoints/config.endpoint';

export const getPriorityMaster = (data?: any) => {
  const params = queryString.stringify(data);
  return requestAuthorized.get<PriorityRisk[]>(
    `${ASSETS_API_PRIORITY_MASTER}?${params}`,
  );
};
