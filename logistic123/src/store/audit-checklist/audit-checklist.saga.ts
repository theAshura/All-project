import {
  createGeneralInfoApi,
  getListAuditCheckListApi,
  deleteAuditCheckListApi,
  getAuditCheckListDetailApi,
  createQuestionApi,
  deleteQuestionApi,
  getGeneralInfoDetailApi,
  getListQuestionApi,
  submitAuditCheckListApi,
  updateQuestionApi,
  acceptAuditCheckListApi,
  cancelAuditCheckListApi,
  approveAuditCheckListApi,
  undoSubmitAuditCheckListApi,
  updateGeneralInfoApi,
  reorderQuestionListApi,
  getROFFromIARApi,
} from 'api/audit-checklist.api';
import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { AppRouteConst } from 'constants/route.const';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { CommonMessageErrorResponse } from 'models/common.model';
import { handleErrorsToFields } from '../../helpers/utils.helper';
import { State } from '../reducer';
import {
  createGeneralInfoAction,
  getListAuditCheckListAction,
  deleteAuditCheckListAction,
  getAuditCheckListDetailAction,
  refreshChecklistDetailAction,
  createQuestionAction,
  getListQuestionAction,
  submitAuditCheckListAction,
  deleteQuestionAction,
  updateQuestionAction,
  acceptAuditCheckListAction,
  undoSubmitAuditCheckListAction,
  cancelAuditCheckListAction,
  approveAuditCheckListAction,
  updateGeneralInfoAction,
  reorderQuestionList,
  getListROFFromIARAction,
} from './audit-checklist.action';

function* handleGetListAuditCheckList(
  action: ReturnType<typeof getListAuditCheckListAction.request>,
) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListAuditCheckListApi, other);
    action?.payload?.handleSuccess?.();
    yield put(getListAuditCheckListAction.success(response.data));
  } catch (e) {
    toastError(e);
    yield put(getListAuditCheckListAction.failure());
  }
}

function* handleGetListROFFromIAR(
  action: ReturnType<typeof getListROFFromIARAction.request>,
) {
  try {
    const response = yield call(getROFFromIARApi, action.payload);
    yield put(getListROFFromIARAction.success(response.data));
  } catch (e) {
    toastError(e);
    yield put(getListROFFromIARAction.failure());
  }
}

function* handleGetAuditCheckListDetail(
  action: ReturnType<typeof getAuditCheckListDetailAction.request>,
) {
  try {
    const response = yield call(getAuditCheckListDetailApi, action.payload);
    yield put(getAuditCheckListDetailAction.success(response.data));
  } catch (e) {
    toastError(e);
    yield put(getAuditCheckListDetailAction.failure());
  }
}

function* handleRefreshPageCreate(
  action: ReturnType<typeof refreshChecklistDetailAction.request>,
) {
  try {
    const response = yield call(getGeneralInfoDetailApi, action.payload);
    const { data } = response;
    const referencesCategoryId = data.referencesCategory.map((i) => ({
      id: i.id,
    }));

    const refreshData = {
      ...data,
      // statusHistory: undefined,
      reviewInProgress: undefined,
      referencesCategory: referencesCategoryId,
    };
    yield put(refreshChecklistDetailAction.success(refreshData));
  } catch (e) {
    toastError(e);
    yield put(refreshChecklistDetailAction.failure());
  }
}

function* handleDeleteAuditCheckList(
  action: ReturnType<typeof deleteAuditCheckListAction.request>,
) {
  try {
    const { params, listAuditCheckList } = yield select(
      (state: State) => state.auditCheckList,
    );
    yield call(deleteAuditCheckListApi, action.payload?.id);
    toastSuccess('You have deleted successfully');

    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listAuditCheckList.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteAuditCheckListAction.success(newParams));
    action.payload?.getListAuditCheckList();
  } catch (e) {
    toastError(e);
    yield put(deleteAuditCheckListAction.failure());
  }
}

function* handleSubmitAuditCheckList(
  action: ReturnType<typeof submitAuditCheckListAction.request>,
) {
  try {
    yield call(submitAuditCheckListApi, action.payload);
    yield put(submitAuditCheckListAction.success());
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }
    history.push(AppRouteConst.AUDIT_CHECKLIST);
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(submitAuditCheckListAction.failure());
  }
}

function* handleCreateGeneralInfo(
  action: ReturnType<typeof createGeneralInfoAction.request>,
) {
  try {
    const response = yield call(createGeneralInfoApi, action.payload);
    const res = yield call(getGeneralInfoDetailApi, response.data.id);
    if (action.payload?.auditChecklistTemplateId) {
      yield put(
        getListQuestionAction.request({
          id: response.data.id,
          body: { page: 1, pageSize: -1 },
        }),
      );
    }
    yield put(createGeneralInfoAction.success(res.data));

    history.push(`?${response.data.id}`);
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: CommonMessageErrorResponse[] = e?.errorList || [];
      const message2: CommonMessageErrorResponse[] =
        (e?.message &&
          e?.message?.map((i) => ({
            fieldName: i?.field || i?.fieldName,
            message: i?.message[0],
          }))) ||
        [];

      const messageTotal: CommonMessageErrorResponse[] = [
        ...message1,
        ...message2,
      ];
      yield put(createGeneralInfoAction.failure(messageTotal || []));
    } else {
      yield put(createGeneralInfoAction.failure(e));
    }
  }
}

function* handleUpdateGeneralInfo(
  action: ReturnType<typeof updateGeneralInfoAction.request>,
) {
  try {
    const response = yield call(updateGeneralInfoApi, action.payload);
    yield put(updateGeneralInfoAction.success(response.data));
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const errors: CommonMessageErrorResponse[] = handleErrorsToFields(e);
      yield put(updateGeneralInfoAction.failure(errors || []));
    } else {
      yield put(updateGeneralInfoAction.failure(e));
    }
  }
}

function* handleCreateQuestion(
  action: ReturnType<typeof createQuestionAction.request>,
) {
  try {
    const newQuestions = yield call(createQuestionApi, action.payload);
    const response = yield call(getListQuestionApi, {
      id: action.payload?.id,
      body: { page: 1, pageSize: -1 },
    });
    toastSuccess('You have created successfully');

    yield put(createQuestionAction.success(response?.data?.data || []));
    if (action.payload.handleSuccess) {
      if (action.payload.isDuplicate) {
        yield call(action.payload.handleSuccess, newQuestions?.data[0]);
      } else {
        yield call(action.payload.handleSuccess);
      }
    }
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: CommonMessageErrorResponse[] = e?.errorList || [];
      const message2: CommonMessageErrorResponse[] =
        e?.message && Array.isArray(e?.message)
          ? e?.message?.map((i) => ({
              fieldName: i?.field || i?.fieldName,
              message: i?.message ? i?.message[0] : '',
            }))
          : [];
      const message3: CommonMessageErrorResponse[] = e?.message;
      const messageTotal: CommonMessageErrorResponse[] = [
        ...message1,
        ...message2,
      ];
      if (
        message3 &&
        Array.isArray(message3) &&
        message3[0]?.field === 'remarkSpecificAnswers'
      ) {
        toastError(message3[0]?.message[0]);
      }

      if (typeof e?.message === 'string') {
        toastError(e?.message);
      }
      yield put(createQuestionAction.failure(messageTotal || []));
    } else {
      yield put(createQuestionAction.failure(e));
    }
  }
}

function* handleUpdateQuestion(
  action: ReturnType<typeof updateQuestionAction.request>,
) {
  try {
    const { hasSubmit, ...other } = action.payload;
    yield call(updateQuestionApi, other);
    const response = yield call(getListQuestionApi, {
      id: action.payload?.idAuditChecklist,
      body: { page: 1, pageSize: -1 },
    });
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }
    yield put(updateQuestionAction.success(response?.data?.data || []));
    if (!hasSubmit) {
      toastSuccess('You have updated successfully');
    }
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      if (typeof e.message === 'string') {
        toastError(e);
      }
      const errors: CommonMessageErrorResponse[] = handleErrorsToFields(e);
      yield put(updateQuestionAction.failure(errors || []));
    } else {
      yield put(updateQuestionAction.failure(e));
    }
  }
}

function* handleGetListQuestion(
  action: ReturnType<typeof getListQuestionAction.request>,
) {
  try {
    const { onSuccess, ...params } = action.payload;
    const response = yield call(getListQuestionApi, params);

    if (onSuccess) {
      onSuccess(response?.data?.data);
    }
    yield put(getListQuestionAction.success(response?.data?.data || []));
  } catch (e) {
    toastError(e);
    yield put(getListQuestionAction.failure(e));
  }
}

function* handleReorderQuestionList(
  action: ReturnType<typeof reorderQuestionList.request>,
) {
  try {
    yield call(reorderQuestionListApi, action.payload);
    yield put(reorderQuestionList.success());
    if (action.payload.reorderBodySucceed) {
      action.payload.reorderBodySucceed();
    }
  } catch (e) {
    toastError(e);
    yield put(
      getListQuestionAction.request({
        id: action.payload.id,
        body: { page: 1, pageSize: -1 },
      }),
    );
    yield put(reorderQuestionList.failure(e));
  }
}

function* handleDeleteQuestion(
  action: ReturnType<typeof deleteQuestionAction.request>,
) {
  try {
    yield call(deleteQuestionApi, action.payload);
    const response = yield call(getListQuestionApi, {
      id: action.payload?.idAuditChecklist,
      body: { page: 1, pageSize: -1 },
    });
    yield put(createQuestionAction.success(response?.data?.data || []));
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: CommonMessageErrorResponse[] = e?.errorList || [];
      const message2: CommonMessageErrorResponse[] =
        (e?.message &&
          e?.message?.map((i) => ({
            fieldName: i?.field || i?.fieldName,
            message: i?.message[0],
          }))) ||
        [];

      const messageTotal: CommonMessageErrorResponse[] = [
        ...message1,
        ...message2,
      ];
      yield put(createGeneralInfoAction.failure(messageTotal || []));
    } else {
      yield put(createGeneralInfoAction.failure(e));
    }
  }
}

function* handleAcceptAuditCheckList(
  action: ReturnType<typeof acceptAuditCheckListAction.request>,
) {
  try {
    yield call(acceptAuditCheckListApi, action.payload);
    action.payload?.requestSuccess();
    toastSuccess(
      action.payload?.body?.status === 'Rejected'
        ? 'Audit checklist rejected successfully'
        : 'Audit checklist reviewed successfully',
    );
    yield put(acceptAuditCheckListAction.success());
  } catch (e) {
    toastError(e);
    yield put(acceptAuditCheckListAction.failure(e));
  }
}

function* handleUndoSubmitAuditCheckList(
  action: ReturnType<typeof undoSubmitAuditCheckListAction.request>,
) {
  try {
    yield call(undoSubmitAuditCheckListApi, action.payload);
    if (action.payload?.type) {
      toastSuccess(
        action.payload?.type === 'Revoke'
          ? 'Revoked successfully'
          : 'Recalled successfully',
      );
    }
    action.payload?.requestSuccess();
    yield put(undoSubmitAuditCheckListAction.success());
  } catch (e) {
    toastError(e);
    yield put(undoSubmitAuditCheckListAction.failure(e));
  }
}

function* handleCancelAuditCheckList(
  action: ReturnType<typeof cancelAuditCheckListAction.request>,
) {
  try {
    yield call(cancelAuditCheckListApi, action.payload);
    action.payload?.requestSuccess();
    toastSuccess('Audit checklist cancelled successfully');
    yield put(cancelAuditCheckListAction.success());
  } catch (e) {
    toastError(e);
    yield put(cancelAuditCheckListAction.failure(e));
  }
}

function* handleApproveAuditCheckList(
  action: ReturnType<typeof approveAuditCheckListAction.request>,
) {
  try {
    yield call(approveAuditCheckListApi, action.payload);
    action.payload?.requestSuccess();
    toastSuccess(
      action.payload?.body?.status === 'Rejected'
        ? 'Audit checklist rejected successfully'
        : 'Audit checklist approved successfully',
    );
    yield put(approveAuditCheckListAction.success());
  } catch (e) {
    toastError(e);
    yield put(approveAuditCheckListAction.failure(e));
  }
}

export default function* auditCheckListSaga() {
  yield all([
    yield takeLatest(
      deleteAuditCheckListAction.request,
      handleDeleteAuditCheckList,
    ),
    yield takeLatest(
      getListAuditCheckListAction.request,
      handleGetListAuditCheckList,
    ),
    yield takeLatest(updateGeneralInfoAction.request, handleUpdateGeneralInfo),
    yield takeLatest(getListROFFromIARAction.request, handleGetListROFFromIAR),

    yield takeLatest(createGeneralInfoAction.request, handleCreateGeneralInfo),
    yield takeLatest(
      getAuditCheckListDetailAction.request,
      handleGetAuditCheckListDetail,
    ),
    yield takeLatest(updateQuestionAction.request, handleUpdateQuestion),
    yield takeLatest(createQuestionAction.request, handleCreateQuestion),
    yield takeLatest(getListQuestionAction.request, handleGetListQuestion),
    yield takeLatest(
      submitAuditCheckListAction.request,
      handleSubmitAuditCheckList,
    ),
    yield takeLatest(
      refreshChecklistDetailAction.request,
      handleRefreshPageCreate,
    ),
    yield takeLatest(deleteQuestionAction.request, handleDeleteQuestion),
    yield takeLatest(
      acceptAuditCheckListAction.request,
      handleAcceptAuditCheckList,
    ),

    yield takeLatest(
      undoSubmitAuditCheckListAction.request,
      handleUndoSubmitAuditCheckList,
    ),

    yield takeLatest(
      cancelAuditCheckListAction.request,
      handleCancelAuditCheckList,
    ),
    yield takeLatest(
      approveAuditCheckListAction.request,
      handleApproveAuditCheckList,
    ),
    yield takeLatest(reorderQuestionList.request, handleReorderQuestionList),

    // yield takeLatest(updateAuditTypeActions.request, updateAuditTypeSaga),
  ]);
}
