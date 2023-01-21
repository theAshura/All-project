import { all, put, takeLatest } from '@redux-saga/core/effects';
import { toastError } from 'helpers/notification.helper';
import { saveNotificationActions } from './action';

function* saveNotification(action) {
  try {
    yield put(saveNotificationActions.success(action.payload));
  } catch (e) {
    toastError(e);
  }
}

export default function* NotificationSaga() {
  yield all([
    yield takeLatest(saveNotificationActions.request, saveNotification),
  ]);
}
