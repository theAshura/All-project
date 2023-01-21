import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetCrewGroupingsResponse,
  CreateCrewGroupingParams,
  UpdateCrewGroupingParams,
  CrewGroupingDetailResponse,
  CheckExitCodeParams,
  CheckExitResponse,
} from '../utils/model';

interface ParamsDeleteCrewGrouping {
  id: string;
  isDetail?: boolean;
  getListCrewGrouping: () => void;
}

export const getListCrewGroupingActions = createAsyncAction(
  `@CrewGrouping/GET_LIST_CREW_GROUPING_ACTIONS`,
  `@CrewGrouping/GET_LIST_CREW_GROUPING_ACTIONS_SUCCESS`,
  `@CrewGrouping/GET_LIST_CREW_GROUPING_ACTIONS_FAIL`,
)<CommonApiParam, GetCrewGroupingsResponse, void>();

export const deleteCrewGroupingActions = createAsyncAction(
  `@CrewGrouping/DELETE_CREW_GROUPING_ACTIONS`,
  `@CrewGrouping/DELETE_CREW_GROUPING_ACTIONS_SUCCESS`,
  `@CrewGrouping/DELETE_CREW_GROUPING_ACTIONS_FAIL`,
)<ParamsDeleteCrewGrouping, CommonApiParam, void>();

export const createCrewGroupingActions = createAsyncAction(
  `@CrewGrouping/CREATE_CREW_GROUPING_ACTIONS`,
  `@CrewGrouping/CREATE_CREW_GROUPING_ACTIONS_SUCCESS`,
  `@CrewGrouping/CREATE_CREW_GROUPING_ACTIONS_FAIL`,
)<CreateCrewGroupingParams, void, ErrorField[]>();

export const checkExitCodeAction = createAsyncAction(
  `@CrewGrouping/CHECK_EXIT_CODE_ACTIONS`,
  `@CrewGrouping/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@CrewGrouping/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, CheckExitResponse, void>();

export const updateCrewGroupingActions = createAsyncAction(
  `@CrewGrouping/UPDATE_CREW_GROUPING_ACTIONS`,
  `@CrewGrouping/UPDATE_CREW_GROUPING_ACTIONS_SUCCESS`,
  `@CrewGrouping/UPDATE_CREW_GROUPING_ACTIONS_FAIL`,
)<UpdateCrewGroupingParams, void, ErrorField[]>();

export const getCrewGroupingDetailActions = createAsyncAction(
  `@CrewGrouping/GET_CREW_GROUPING_DETAIL_ACTIONS`,
  `@CrewGrouping/GET_CREW_GROUPING_DETAIL_ACTIONS_SUCCESS`,
  `@CrewGrouping/GET_CREW_GROUPING_DETAIL_ACTIONS_FAIL`,
)<string, CrewGroupingDetailResponse, void>();

export const clearCrewGroupingReducer = createAction(
  `@CrewGrouping/CLEAR_CREW_GROUPING_REDUCER`,
)<void>();

export const clearCrewGroupingErrorsReducer = createAction(
  `@CrewGrouping/CLEAR_CREW_GROUPING_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@CrewGrouping/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearCrewGroupingParamsReducer = createAction(
  `@CrewGrouping/CLEAR_CREW_GROUPING_PARAMS_REDUCER`,
)<void>();
