import { ShipDirectResponsibleStoreModel } from 'models/store/ship-direct-responsible/ship-direct-responsible.model';
import { createReducer } from 'typesafe-actions';
import {
  getListShipDirectResponsibleActions,
  deleteShipDirectResponsibleActions,
  updateShipDirectResponsibleActions,
  createShipDirectResponsibleActions,
  updateParamsActions,
  getShipDirectResponsibleDetailActions,
  clearShipDirectResponsibleReducer,
  clearShipDirectResponsibleErrorsReducer,
} from './ship-direct-responsible.action';

const INITIAL_STATE: ShipDirectResponsibleStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listShipDirectResponsibles: undefined,
  shipDirectResponsibleDetail: null,
  errorList: undefined,
};

const shipDirectResponsibleReducer =
  createReducer<ShipDirectResponsibleStoreModel>(INITIAL_STATE)
    .handleAction(
      getListShipDirectResponsibleActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListShipDirectResponsibleActions.success,
      (state, { payload }) => ({
        ...state,
        listShipDirectResponsibles: payload,
        loading: false,
      }),
    )
    .handleAction(getListShipDirectResponsibleActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(deleteShipDirectResponsibleActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      deleteShipDirectResponsibleActions.success,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: false,
      }),
    )
    .handleAction(deleteShipDirectResponsibleActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateShipDirectResponsibleActions.request, (state) => ({
      ...state,
      loading: true,
      errorList: undefined,
    }))
    .handleAction(updateShipDirectResponsibleActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateShipDirectResponsibleActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(createShipDirectResponsibleActions.request, (state) => ({
      ...state,
      loading: true,
      errorList: undefined,
    }))
    .handleAction(createShipDirectResponsibleActions.success, (state) => ({
      ...state,
      params: { isLeftMenu: false },

      loading: false,
    }))
    .handleAction(
      createShipDirectResponsibleActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(getShipDirectResponsibleDetailActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getShipDirectResponsibleDetailActions.success,
      (state, { payload }) => ({
        ...state,
        shipDirectResponsibleDetail: payload,
        loading: false,
      }),
    )
    .handleAction(getShipDirectResponsibleDetailActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
    }))

    .handleAction(clearShipDirectResponsibleErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
    }))

    .handleAction(clearShipDirectResponsibleReducer, () => ({
      ...INITIAL_STATE,
    }));

export default shipDirectResponsibleReducer;
