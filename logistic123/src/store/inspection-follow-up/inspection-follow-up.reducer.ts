import { createReducer } from 'typesafe-actions';
import { InspectionFollowUpStoreModel } from 'models/store/inspection-follow-up/inspection-follow-up.model';
import {
  clearInspectionFollowUpReducer,
  editInspectionFollowUpAction,
  getInspectionFollowUpAction,
  updateParamsActions,
  clearErrorMessages,
  deleteInspectionFollowUpActions,
} from './inspection-follow-up.action';

const INITIAL_STATE = {
  loading: false,
  disable: false,
  params: null,
  listInspectionFollowUps: null,
  errorList: null,
  dataFilter: null,
};

const inspectionFollowUpReducer = createReducer<InspectionFollowUpStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getInspectionFollowUpAction.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getInspectionFollowUpAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listGroup: payload,
  }))
  .handleAction(getInspectionFollowUpAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteInspectionFollowUpActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deleteInspectionFollowUpActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deleteInspectionFollowUpActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(editInspectionFollowUpAction.request, (state) => ({
    ...state,
    loading: true,
    messageError: [],
  }))
  .handleAction(editInspectionFollowUpAction.success, (state) => ({
    ...state,
    loading: false,
    messageError: [],
  }))
  .handleAction(editInspectionFollowUpAction.failure, (state, { payload }) => ({
    ...state,
    loading: true,
    messageError: payload,
  }))
  .handleAction(clearErrorMessages, (state) => ({
    ...state,
    messageError: [],
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))
  .handleAction(clearInspectionFollowUpReducer, (state) => ({
    ...state,
    loading: false,
    messageError: [],
    params: { isLeftMenu: false },
    listGroup: undefined,
  }));
export default inspectionFollowUpReducer;
