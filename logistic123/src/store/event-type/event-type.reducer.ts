import { EventTypeStoreModel } from 'models/store/event-type/event-type.model';
import { createReducer } from 'typesafe-actions';
import {
  getListEventTypeActions,
  getListCompanyActions,
  updateParamsActions,
  deleteEventTypeActions,
  updateEventTypeActions,
  createEventTypeActions,
  getEventTypeDetailActions,
  clearEventTypeReducer,
  clearEventTypeErrorsReducer,
  clearEventTypeParamsReducer,
  checkExitCodeAction,
} from './event-type.action';

const INITIAL_STATE: EventTypeStoreModel = {
  loading: true,
  loadingCompany: false,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listCompany: undefined,
  listEventTypes: undefined,
  EventTypeDetail: null,
  errorList: undefined,
};

const eventTypeReducer = createReducer<EventTypeStoreModel>(INITIAL_STATE)
  .handleAction(getListEventTypeActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListEventTypeActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listEventTypes: payload,
  }))
  .handleAction(getListEventTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getListCompanyActions.request, (state) => ({
    ...state,
    loadingCompany: true,
  }))
  .handleAction(getListCompanyActions.success, (state, { payload }) => ({
    ...state,
    loadingCompany: false,
    listCompany: payload,
  }))
  .handleAction(getListCompanyActions.failure, (state) => ({
    ...state,
    loadingCompany: false,
  }))
  .handleAction(deleteEventTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteEventTypeActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteEventTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateEventTypeActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateEventTypeActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateEventTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createEventTypeActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createEventTypeActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createEventTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getEventTypeDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getEventTypeDetailActions.success, (state, { payload }) => ({
    ...state,
    EventTypeDetail: payload,
    loading: false,
  }))
  .handleAction(getEventTypeDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearEventTypeErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearEventTypeParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(checkExitCodeAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(checkExitCodeAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    isExistField: payload,
  }))
  .handleAction(checkExitCodeAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearEventTypeReducer, () => ({
    ...INITIAL_STATE,
  }));

export default eventTypeReducer;
