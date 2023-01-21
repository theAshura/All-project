import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import {
  createNewCountryMasterAPI,
  getListCountryMasterAPI,
} from 'api/country-master.api';
import { toastError } from 'helpers/notification.helper';
import {
  createCountryMasterActions,
  getListCountryMasterActions,
} from './country-master.action';

function* getListCountryMasterSaga(action) {
  try {
    const { content, ...other } = action.payload;
    const params = { ...other };
    const { data } = yield call(getListCountryMasterAPI, params);
    yield put(getListCountryMasterActions.success(data));
  } catch (error) {
    toastError(error);
    yield put(getListCountryMasterActions.failure());
  }
}

function* createCountryMasterSaga(action) {
  try {
    const { handleSuccess, ...remain } = action.payload;
    yield put(createCountryMasterActions.failure([]));
    yield call(createNewCountryMasterAPI, remain);
    yield put(createCountryMasterActions.success());
    handleSuccess?.();
  } catch (error) {
    toastError(error);
    yield put(createCountryMasterActions.failure([error]));
  }
}

export default function* countryMasterSaga() {
  yield all([
    yield takeLatest(
      getListCountryMasterActions.request,
      getListCountryMasterSaga,
    ),
    yield takeLatest(
      createCountryMasterActions.request,
      createCountryMasterSaga,
    ),
  ]);
}
