import { TerminalStoreModel } from 'models/store/terminal/terminal.model';
import { createReducer } from 'typesafe-actions';
import {
  getListTerminalActions,
  getTerminalDetailActions,
  updateTerminalActions,
  createTerminalActions,
  deleteTerminalActions,
  clearTerminalErrorsReducer,
  getListTerminalByMainIdActions,
  clearTerminalReducer,
  updateParamsActions,
} from './terminal.action';

const INITIAL_STATE: TerminalStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listTerminal: undefined,
  terminalDetail: null,
  errorList: undefined,
};

const terminalReducer = createReducer<TerminalStoreModel>(INITIAL_STATE)
  .handleAction(getListTerminalActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListTerminalActions.success, (state, { payload }) => ({
    ...state,
    listTerminal: payload,
    loading: false,
  }))
  .handleAction(getListTerminalActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(
    getListTerminalByMainIdActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListTerminalByMainIdActions.success,
    (state, { payload }) => ({
      ...state,
      listTerminal: {
        data: payload,
        page: 1,
        pageSize: payload?.length,
        totalPage: 1,
        totalItem: payload?.length,
      },
      loading: false,
    }),
  )
  .handleAction(getListTerminalByMainIdActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteTerminalActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteTerminalActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteTerminalActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateTerminalActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateTerminalActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateTerminalActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createTerminalActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createTerminalActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createTerminalActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getTerminalDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getTerminalDetailActions.success, (state, { payload }) => ({
    ...state,
    terminalDetail: payload,
    loading: false,
  }))
  .handleAction(getTerminalDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearTerminalErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearTerminalReducer, () => ({
    ...INITIAL_STATE,
  }));

export default terminalReducer;
