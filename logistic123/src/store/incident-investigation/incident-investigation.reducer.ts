import { IncidentInvestigationStoreModel } from 'models/store/incident-investigation/incident-investigation.model';
import { createReducer } from 'typesafe-actions';
import {
  getListIncidentInvestigationActions,
  deleteIncidentInvestigationActions,
  updateIncidentInvestigationActions,
  createIncidentInvestigationActions,
  getIncidentInvestigationDetailActions,
  clearIncidentInvestigationReducer,
  updateParamsActions,
  clearIncidentInvestigationErrorsReducer,
  setDataFilterAction,
} from './incident-investigation.action';

const INITIAL_STATE: IncidentInvestigationStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  dataFilter: null,

  listIncidentInvestigations: undefined,
  incidentInvestigationDetail: null,
  errorList: undefined,
};

const IncidentInvestigationReducer =
  createReducer<IncidentInvestigationStoreModel>(INITIAL_STATE)
    .handleAction(
      getListIncidentInvestigationActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListIncidentInvestigationActions.success,
      (state, { payload }) => ({
        ...state,
        listIncidentInvestigations: payload,
        loading: false,
      }),
    )
    .handleAction(getListIncidentInvestigationActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(deleteIncidentInvestigationActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      deleteIncidentInvestigationActions.success,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: false,
      }),
    )
    .handleAction(deleteIncidentInvestigationActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateIncidentInvestigationActions.request, (state) => ({
      ...state,
      loading: true,
      errorList: undefined,
    }))
    .handleAction(updateIncidentInvestigationActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateIncidentInvestigationActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(createIncidentInvestigationActions.request, (state) => ({
      ...state,
      loading: true,
      errorList: undefined,
    }))
    .handleAction(createIncidentInvestigationActions.success, (state) => ({
      ...state,
      params: { isLeftMenu: false },

      loading: false,
    }))
    .handleAction(
      createIncidentInvestigationActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(getIncidentInvestigationDetailActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getIncidentInvestigationDetailActions.success,
      (state, { payload }) => ({
        ...state,
        incidentInvestigationDetail: payload,
        loading: false,
      }),
    )
    .handleAction(getIncidentInvestigationDetailActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(clearIncidentInvestigationErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
    }))

    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
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

    .handleAction(clearIncidentInvestigationReducer, () => ({
      ...INITIAL_STATE,
    }));

export default IncidentInvestigationReducer;
