import { createReducer } from 'typesafe-actions';
import { MapViewStore } from '../utils/model';
import {
  getListMapViewInspectionActions,
  getListMapViewInspectorActions,
} from './action';

const INITIAL_STATE: MapViewStore = {
  loading: true,
  listInspection: [],
  listInspector: [],
};

const MapViewReducer = createReducer<MapViewStore>(INITIAL_STATE)
  .handleAction(
    getListMapViewInspectionActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
    }),
  )
  .handleAction(
    getListMapViewInspectionActions.success,
    (state, { payload }) => ({
      ...state,
      listInspection: payload,
      loading: false,
    }),
  )
  .handleAction(getListMapViewInspectionActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    getListMapViewInspectorActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
    }),
  )
  .handleAction(
    getListMapViewInspectorActions.success,
    (state, { payload }) => ({
      ...state,
      listInspector: payload,
      loading: false,
    }),
  )
  .handleAction(getListMapViewInspectorActions.failure, (state) => ({
    ...state,
    loading: false,
  }));

export default MapViewReducer;
