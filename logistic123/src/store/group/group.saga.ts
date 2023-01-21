import { call, put, all, takeLatest, select } from '@redux-saga/core/effects';
import { MessageErrorResponse } from 'models/store/user/user.model';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  getAllGroupApi,
  createGroupApi,
  editGroupApi,
  deleteGroupApi,
} from '../../api/group.api';
import {
  getAllGroupAction,
  createGroupAction,
  editGroupAction,
  deleteGroupActions,
} from './group.action';

function* handleGetAllGroup(
  action: ReturnType<typeof getAllGroupAction.request>,
) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getAllGroupApi, other);
    yield put(getAllGroupAction.success(response.data));
  } catch (e) {
    toastError(e);
    yield put(getAllGroupAction.failure());
  }
}

function* handleCreateGroup(
  action: ReturnType<typeof createGroupAction.request>,
) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createGroupApi, other);
    yield put(createGroupAction.success());
    yield put(getAllGroupAction.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(createGroupAction.failure(messageTotal || []));
    } else {
      yield put(createGroupAction.failure(e));
    }
  }
}

function* handleDeleteGroup(action) {
  try {
    const { params, listGroup } = yield select((state: State) => state.group);
    yield call(deleteGroupApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listGroup.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');

    yield put(deleteGroupActions.success(newParams));
    action.payload?.getList();
  } catch (e) {
    toastError(e);
    yield put(deleteGroupActions.failure());
  }
}

function* handleEditGroup(action: ReturnType<typeof editGroupAction.request>) {
  try {
    yield call(editGroupApi, action.payload);
    yield put(editGroupAction.success());
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(editGroupAction.failure(messageTotal || []));
    } else {
      yield put(editGroupAction.failure(e));
    }
  }
}

export default function* groupManagementSaga() {
  yield all([
    yield takeLatest(getAllGroupAction.request, handleGetAllGroup),
    yield takeLatest(createGroupAction.request, handleCreateGroup),
    yield takeLatest(editGroupAction.request, handleEditGroup),
    yield takeLatest(deleteGroupActions.request, handleDeleteGroup),
  ]);
}
