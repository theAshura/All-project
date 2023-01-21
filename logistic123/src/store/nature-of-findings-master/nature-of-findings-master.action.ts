import {
  ListNatureOfFindingsMasterResponse,
  NatureOfFindingsMaster,
  UpdateNatureOfFindingsMasterParams,
} from 'models/api/nature-of-findings-master/nature-of-findings-master.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListNatureOfFindingsMaster: () => void;
}

export const getListNatureOfFindingsMasterActions = createAsyncAction(
  `@psc/GET_LIST_NATURE_OF_FINDING_ACTIONS`,
  `@psc/GET_LIST_NATURE_OF_FINDING_ACTIONS_SUCCESS`,
  `@psc/GET_LIST_NATURE_OF_FINDING_ACTIONS_FAIL`,
)<CommonApiParam, ListNatureOfFindingsMasterResponse, void>();

export const deleteNatureOfFindingsMasterActions = createAsyncAction(
  `@psc/DELETE_NATURE_OF_FINDING_ACTIONS`,
  `@psc/DELETE_NATURE_OF_FINDING_ACTIONS_SUCCESS`,
  `@psc/DELETE_NATURE_OF_FINDING_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createNatureOfFindingsMasterActions = createAsyncAction(
  `@psc/CREATE_NATURE_OF_FINDING_ACTIONS`,
  `@psc/CREATE_NATURE_OF_FINDING_ACTIONS_SUCCESS`,
  `@psc/CREATE_NATURE_OF_FINDING_ACTIONS_FAIL`,
)<NatureOfFindingsMaster, void, ErrorField[]>();

export const updateNatureOfFindingsMasterActions = createAsyncAction(
  `@psc/UPDATE_NATURE_OF_FINDING_ACTIONS`,
  `@psc/UPDATE_NATURE_OF_FINDING_ACTIONS_SUCCESS`,
  `@psc/UPDATE_NATURE_OF_FINDING_ACTIONS_FAIL`,
)<UpdateNatureOfFindingsMasterParams, void, ErrorField[]>();

export const getNatureOfFindingsMasterDetailActions = createAsyncAction(
  `@psc/GET_NATURE_OF_FINDING_ACTIONS`,
  `@psc/GET_NATURE_OF_FINDING_ACTIONS_SUCCESS`,
  `@psc/GET_NATURE_OF_FINDING_ACTIONS_FAIL`,
)<NatureOfFindingsMaster, NatureOfFindingsMaster, void>();

export const clearNatureOfFindingsMasterReducer = createAction(
  `@psc/CLEAR_NATURE_OF_FINDING_REDUCER`,
)<void>();

export const clearParamsNatureOfFindingsMasterReducer = createAction(
  `@psc/CLEAR_PARAMS_NATURE_OF_FINDING_REDUCER`,
)<void>();

export const clearNatureOfFindingsMasterErrorsReducer = createAction(
  `@psc/CLEAR_ERRORS_NATURE_OF_FINDING_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@NOF/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
