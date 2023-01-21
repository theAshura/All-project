import {
  ExportListVesselParams,
  ListVesselResponse,
  Vessel,
  UpdateVesselParams,
  GetVesselDetail,
  CreateVesselParams,
} from 'models/api/vessel/vessel.model';
import { AvatarType, ErrorField, CommonApiParam } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListVesselManagement: () => void;
}

interface SuccessDetail {
  avatar?: AvatarType;
  data?: Vessel;
}
export const getListVesselActions = createAsyncAction(
  `@vessel/GET_LIST_VESSEL_ACTIONS`,
  `@vessel/GET_LIST_VESSEL_ACTIONS_SUCCESS`,
  `@vessel/GET_LIST_VESSEL_ACTIONS_FAIL`,
)<CommonApiParam, ListVesselResponse, void>();

export const deleteVesselActions = createAsyncAction(
  `@vessel/DELETE_VESSEL_ACTIONS`,
  `@vessel/DELETE_VESSEL_ACTIONS_SUCCESS`,
  `@vessel/DELETE_VESSEL_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createVesselActions = createAsyncAction(
  `@vessel/CREATE_VESSEL_ACTIONS`,
  `@vessel/CREATE_VESSEL_ACTIONS_SUCCESS`,
  `@vessel/CREATE_VESSEL_ACTIONS_FAIL`,
)<CreateVesselParams, void, ErrorField[]>();

export const updateVesselActions = createAsyncAction(
  `@vessel/UPDATE_VESSEL_ACTIONS`,
  `@vessel/UPDATE_VESSEL_ACTIONS_SUCCESS`,
  `@vessel/UPDATE_VESSEL_ACTIONS_FAIL`,
)<UpdateVesselParams, void, ErrorField[]>();

export const getVesselDetailActions = createAsyncAction(
  `@vessel/GET_VESSEL_ACTIONS`,
  `@vessel/GET_VESSEL_ACTIONS_SUCCESS`,
  `@vessel/GET_VESSEL_ACTIONS_FAIL`,
)<GetVesselDetail, SuccessDetail, void>();

export const exportListVesselActions = createAsyncAction(
  `@vessel/EXPORT_VESSEL_ACTIONS`,
  `@vessel/EXPORT_VESSEL_ACTIONS_SUCCESS`,
  `@vessel/EXPORT_VESSEL_ACTIONS_FAIL`,
)<ExportListVesselParams, void, void>();

export const uploadFileActions = createAsyncAction(
  `@vessel/UPLOAD_FILE_ACTIONS`,
  `@vessel/UPLOAD_FILE_ACTIONS_SUCCESS`,
  `@vessel/UPLOAD_FILE_ACTIONS_FAIL`,
)<FormData, AvatarType, void>();

export const clearVesselManagementReducer = createAction(
  `@vessel/CLEAR_VESSEL_REDUCER`,
)<void>();

export const clearVesselDetailAction = createAction(
  '`@vessel/CLEAR_VESSEL_DETAIL_ACTION',
)<void>();

export const updateParamsActions = createAction(
  `@vessel/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@vessel/SET_DATA_FILTER`,
)<CommonApiParam>();
