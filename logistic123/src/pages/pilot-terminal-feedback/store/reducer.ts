import { createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import { PilotTerminalFeedbackStoreModel } from '../utils/models/common.model';
import {
  getListPilotTerminalFeedbackActions,
  createPilotTerminalFeedbackActions,
  clearPilotTerminalFeedbackErrorsReducer,
  clearPilotTerminalFeedbackReducer,
  updateParamsActions,
  setDataFilterAction,
  getPilotTerminalFeedbackDetailActions,
  updatePilotTerminalFeedbacksActions,
  deletePilotTerminalFeedbacksActions,
  getNumberOfPilotFeedbackActions,
  getPilotFeedbackStatusActions,
  getPilotFeedbackAverageScoreActions,
} from './action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: PilotTerminalFeedbackStoreModel = {
  loading: false,
  disable: false,
  params: initParams,
  pilotTerminalFeedbackDetail: null,
  listPilotTerminalFeedback: null,
  errorList: undefined,
  dataFilter: null,
  numberOfPilotFeedbacks: null,
  listPilotFeedbackStatus: null,
  listPilotFeedbackAverageScore: null,
};

const PilotTerminalFeedbackReducer =
  createReducer<PilotTerminalFeedbackStoreModel>(INITIAL_STATE)
    .handleAction(
      getListPilotTerminalFeedbackActions.request,
      (state, { payload }) => {
        let params = cloneDeep(payload);
        if (payload?.isNotSaveSearch) {
          params = omit(payload, ['status', 'isNotSaveSearch']);
        }
        return {
          ...state,
          params: {
            ...params,
            pageSize:
              payload.pageSize === -1
                ? state.params?.pageSize
                : payload?.pageSize,
          },
          loading:
            payload?.isRefreshLoading === false || payload?.isRefreshLoading
              ? payload?.isRefreshLoading
              : true,
        };
      },
    )
    .handleAction(
      getListPilotTerminalFeedbackActions.success,
      (state, { payload }) => ({
        ...state,
        listPilotTerminalFeedback: payload,
        loading: false,
      }),
    )
    .handleAction(getListPilotTerminalFeedbackActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(createPilotTerminalFeedbackActions.request, (state) => ({
      ...state,
      errorList: undefined,
    }))
    .handleAction(createPilotTerminalFeedbackActions.success, (state) => ({
      ...state,
      params: initParams,
      loading: false,
    }))
    .handleAction(
      createPilotTerminalFeedbackActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(getPilotTerminalFeedbackDetailActions.request, (state) => ({
      ...state,
      loading: true,
    }))

    .handleAction(
      getPilotTerminalFeedbackDetailActions.success,
      (state, { payload }) => ({
        ...state,
        pilotTerminalFeedbackDetail: payload,
        loading: false,
      }),
    )
    .handleAction(getPilotTerminalFeedbackDetailActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(updatePilotTerminalFeedbacksActions.request, (state) => ({
      ...state,
      loading: true,
      errorList: undefined,
    }))
    .handleAction(updatePilotTerminalFeedbacksActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updatePilotTerminalFeedbacksActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(deletePilotTerminalFeedbacksActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      deletePilotTerminalFeedbacksActions.success,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: false,
      }),
    )
    .handleAction(deletePilotTerminalFeedbacksActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(clearPilotTerminalFeedbackErrorsReducer, (state) => ({
      ...state,
      errorList: [],
    }))
    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
      dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
    }))
    .handleAction(clearPilotTerminalFeedbackReducer, (state, { payload }) => ({
      ...state,
      dataFilter: payload ? null : state?.dataFilter,
      pilotTerminalFeedbackDetail: null,
    }))
    .handleAction(setDataFilterAction, (state, { payload }) => ({
      ...state,
      dataFilter: {
        ...payload,
        typeRange: payload?.dateFilter
          ? state.dataFilter?.typeRange
          : payload.typeRange,
      },
    }))
    .handleAction(getNumberOfPilotFeedbackActions.request, (state) => ({
      ...state,
      loading: true,
    }))

    .handleAction(
      getNumberOfPilotFeedbackActions.success,
      (state, { payload }) => ({
        ...state,
        numberOfPilotFeedbacks: payload,
        loading: false,
      }),
    )

    .handleAction(getNumberOfPilotFeedbackActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(getPilotFeedbackStatusActions.request, (state) => ({
      ...state,
      loading: true,
    }))

    .handleAction(
      getPilotFeedbackStatusActions.success,
      (state, { payload }) => ({
        ...state,
        listPilotFeedbackStatus: payload,
        loading: false,
      }),
    )
    .handleAction(getPilotFeedbackStatusActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(getPilotFeedbackAverageScoreActions.request, (state) => ({
      ...state,
      loading: true,
    }))

    .handleAction(
      getPilotFeedbackAverageScoreActions.success,
      (state, { payload }) => ({
        ...state,
        listPilotFeedbackAverageScore: payload,
        loading: false,
      }),
    )
    .handleAction(getPilotFeedbackAverageScoreActions.failure, (state) => ({
      ...state,
      loading: false,
    }));

export default PilotTerminalFeedbackReducer;
