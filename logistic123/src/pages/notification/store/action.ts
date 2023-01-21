import { createAction, createAsyncAction } from 'typesafe-actions';

export const saveNotificationActions = createAsyncAction(
  `@Notification/SAVE_NOTIFICATION_ACTIONS`,
  `@Notification/SAVE_NOTIFICATION_ACTIONS_SUCCESS`,
  `@Notification/SAVE_NOTIFICATION_ACTIONS_FAIL`,
)<any, any, void>();

export const clearNotificationReducer = createAction(
  `@Notification/CLEAR_NOTIFICATION_REDUCER`,
)<void>();
