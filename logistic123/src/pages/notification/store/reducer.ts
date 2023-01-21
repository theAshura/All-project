import { createReducer } from 'typesafe-actions';
import { NotificationStore } from '../utils/model';
import { clearNotificationReducer, saveNotificationActions } from './action';

const INITIAL_STATE: NotificationStore = {
  loading: true,
  totalUnreadNotification: 0,
};

const NotificationReducer = createReducer<NotificationStore>(INITIAL_STATE)
  .handleAction(saveNotificationActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(saveNotificationActions.success, (state, { payload }) => ({
    ...state,
    totalUnreadNotification: payload,
    loading: false,
  }))
  .handleAction(saveNotificationActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearNotificationReducer, () => ({
    ...INITIAL_STATE,
  }));

export default NotificationReducer;
