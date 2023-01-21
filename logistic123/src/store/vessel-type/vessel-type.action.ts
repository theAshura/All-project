import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  updateVesselTypeParam,
  ListVesselTypeResponse,
  VesselType,
} from '../../models/api/vessel-type/vessel-type.model';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListVesselType: () => void;
}

export const getListVesselTypeActions = createAsyncAction(
  `@vesselType/GET_LIST_VESSEL_TYPE_ACTIONS`,
  `@vesselType/GET_LIST_VESSEL_TYPE_ACTIONS_SUCCESS`,
  `@vesselType/GET_LIST_VESSEL_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, ListVesselTypeResponse, void>();

export const deleteVesselTypeActions = createAsyncAction(
  `@vesselType/DELETE_VESSEL_TYPE_ACTIONS`,
  `@vesselType/DELETE_VESSEL_TYPE_ACTIONS_SUCCESS`,
  `@vesselType/DELETE_VESSEL_TYPE_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createVesselTypeActions = createAsyncAction(
  `@vesselType/CREATE_VESSEL_TYPE_ACTIONS`,
  `@vesselType/CREATE_VESSEL_TYPE_ACTIONS_SUCCESS`,
  `@vesselType/CREATE_VESSEL_TYPE_ACTIONS_FAIL`,
)<VesselType, void, ErrorField[]>();

export const updateVesselTypeActions = createAsyncAction(
  `@vesselType/UPDATE_VESSEL_TYPE_ACTIONS`,
  `@vesselType/UPDATE_VESSEL_TYPE_ACTIONS_SUCCESS`,
  `@vesselType/UPDATE_VESSEL_TYPE_ACTIONS_FAIL`,
)<updateVesselTypeParam, void, ErrorField[]>();

export const getVesselTypeDetailActions = createAsyncAction(
  `@vesselType/GET_VESSEL_TYPE_ACTIONS`,
  `@vesselType/GET_VESSEL_TYPE_ACTIONS_SUCCESS`,
  `@vesselType/GET_VESSEL_TYPE_ACTIONS_FAIL`,
)<VesselType, VesselType, void>();

export const clearVesselTypeReducer = createAction(
  `@vesselType/CLEAR_VESSEL_TYPE_REDUCER`,
)<void>();

export const clearParamsVesselTypeReducer = createAction(
  `@vesselType/CLEAR_PARAMS_VESSEL_TYPE_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@vesselType/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
