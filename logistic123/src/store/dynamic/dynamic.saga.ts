import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError } from 'helpers/notification.helper';
import {
  getListConfigCompanyDynamicLabelsActionsApi,
  getListConfigModuleDynamicLabelsActionsApi,
} from 'api/dynamic.api';
import { getListDynamicLabelsActions } from './dynamic.action';

function* getListDynamicLabelsSaga(action) {
  try {
    const configCompany = yield call(
      getListConfigCompanyDynamicLabelsActionsApi,
      action.payload,
    );
    const configModule = yield call(
      getListConfigModuleDynamicLabelsActionsApi,
      action.payload,
    );

    yield put(
      getListDynamicLabelsActions.success({
        listDynamicLabels: configCompany?.data,
        listModuleDynamicLabels: configModule?.data,
      }),
    );
  } catch (e) {
    toastError(e?.message);
    yield put(getListDynamicLabelsActions.failure());
  }
}

export default function* DynamicSaga() {
  yield all([
    yield takeLatest(
      getListDynamicLabelsActions.request,
      getListDynamicLabelsSaga,
    ),
  ]);
}
