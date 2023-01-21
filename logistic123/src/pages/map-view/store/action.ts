import { createAsyncAction } from 'typesafe-actions';
import { GetListInspectionInspector } from '../utils/model';

export const getListMapViewInspectionActions = createAsyncAction(
  `@MapView/GET_LIST_MAP_VIEW_INSPECTION_ACTIONS`,
  `@MapView/GET_LIST_MAP_VIEW_INSPECTION_ACTIONS_SUCCESS`,
  `@MapView/GET_LIST_MAP_VIEW_INSPECTION_ACTIONS_FAIL`,
)<GetListInspectionInspector, any, void>();

export const getListMapViewInspectorActions = createAsyncAction(
  `@MapView/GET_LIST_MAP_VIEW_INSPECTOR_ACTIONS`,
  `@MapView/GET_LIST_MAP_VIEW_INSPECTOR_ACTIONS_SUCCESS`,
  `@MapView/GET_LIST_MAP_VIEW_INSPECTOR_ACTIONS_FAIL`,
)<GetListInspectionInspector, any, void>();
