import { SmsStoreModel } from 'models/store/sms/sms.model';
import { createReducer } from 'typesafe-actions';
import {
  createSmsActions,
  clearSmsReducer,
  clearSmsErrorsReducer,
  clearSmsParamsReducer,
  getListSmsActions,
  deleteSmsActions,
  updateSmsActions,
  getSmsDetailActions,
  clearSmsDetailReducer,
} from './sms.action';

const INITIAL_STATE: SmsStoreModel = {
  loading: true,
  loadingCompany: false,
  disable: false,
  params: { isLeftMenu: false },
  errorList: undefined,
  dataFilter: null,
  listSms: null,
  smsDetail: null,
};

const smsReducer = createReducer<SmsStoreModel>(INITIAL_STATE)
  .handleAction(getListSmsActions.request, (state, { payload }) => ({
    ...state,
    loading: false,
    params: { ...payload },
  }))
  .handleAction(getListSmsActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listSms: payload,
  }))
  .handleAction(getListSmsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createSmsActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createSmsActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createSmsActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))
  .handleAction(deleteSmsActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteSmsActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteSmsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateSmsActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateSmsActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateSmsActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))
  .handleAction(getSmsDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getSmsDetailActions.success, (state, { payload }) => ({
    ...state,
    smsDetail: payload,
    loading: false,
  }))
  .handleAction(getSmsDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearSmsErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearSmsParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))
  .handleAction(clearSmsDetailReducer, (state) => ({
    ...state,
    smsDetail: undefined,
  }))

  .handleAction(clearSmsReducer, (state) => ({
    ...INITIAL_STATE,
  }));

export default smsReducer;
