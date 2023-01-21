import {
  ListPSCDeficiencyResponse,
  PSCDeficiency,
  UpdatePSCDeficiencyParams,
} from 'models/api/psc-deficiency/psc-deficiency.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListPSCDeficiency: () => void;
}

export const getListPSCDeficiencyActions = createAsyncAction(
  `@psc/GET_LIST_PSCDeficiency_ACTIONS`,
  `@psc/GET_LIST_PSCDeficiency_ACTIONS_SUCCESS`,
  `@psc/GET_LIST_PSCDeficiency_ACTIONS_FAIL`,
)<CommonApiParam, ListPSCDeficiencyResponse, void>();

export const deletePSCDeficiencyActions = createAsyncAction(
  `@psc/DELETE_PSCDeficiency_ACTIONS`,
  `@psc/DELETE_PSCDeficiency_ACTIONS_SUCCESS`,
  `@psc/DELETE_PSCDeficiency_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createPSCDeficiencyActions = createAsyncAction(
  `@psc/CREATE_PSCDeficiency_ACTIONS`,
  `@psc/CREATE_PSCDeficiency_ACTIONS_SUCCESS`,
  `@psc/CREATE_PSCDeficiency_ACTIONS_FAIL`,
)<PSCDeficiency, void, ErrorField[]>();

export const updatePSCDeficiencyActions = createAsyncAction(
  `@psc/UPDATE_PSCDeficiency_ACTIONS`,
  `@psc/UPDATE_PSCDeficiency_ACTIONS_SUCCESS`,
  `@psc/UPDATE_PSCDeficiency_ACTIONS_FAIL`,
)<UpdatePSCDeficiencyParams, void, ErrorField[]>();

export const getPSCDeficiencyDetailActions = createAsyncAction(
  `@psc/GET_PSCDeficiency_ACTIONS`,
  `@psc/GET_PSCDeficiency_ACTIONS_SUCCESS`,
  `@psc/GET_PSCDeficiency_ACTIONS_FAIL`,
)<PSCDeficiency, PSCDeficiency, void>();

export const clearPSCDeficiencyReducer = createAction(
  `@psc/CLEAR_PSCDeficiency_REDUCER`,
)<void>();

export const clearParamsPSCDeficiencyReducer = createAction(
  `@psc/CLEAR_PARAMS_PSCDeficiency_REDUCER`,
)<void>();

export const clearPSCDeficiencyErrorsReducer = createAction(
  `@psc/CLEAR_ERRORS_PSCDeficiency_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@pscDef/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
