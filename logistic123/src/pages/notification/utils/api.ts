import { NOTIFICATION_API } from 'api/endpoints/config.endpoint';
import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';

export const getListNotificationsApi = (dataParams?: any) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(`${NOTIFICATION_API}?${params}`);
};

export const markNotificationAsReadApi = (id: string) =>
  requestAuthorized.put<any>(`${NOTIFICATION_API}/mark-as-read-single/${id}`);

export const markAllNotificationsAsReadApi = () =>
  requestAuthorized.put<any>(`${NOTIFICATION_API}/mark-as-read-all`);

export const deleteNotificationApi = (id: string) =>
  requestAuthorized.delete<any>(`${NOTIFICATION_API}/${id}`);
