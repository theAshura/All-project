import { createAction, createAsyncAction } from 'typesafe-actions';
import { MessageErrorResponse } from 'models/store/user/user.model';
import { CommonListParams, CommonApiParam } from 'models/common.model';
import { InspectionFollowUp } from 'models/api/inspection-follow-up/inspection-follow-up.model';

interface ParamsDeleteGroup {
  id: string;
  isDetail?: boolean;
  getList: () => void;
}

export const getInspectionFollowUpAction = createAsyncAction(
  '@inspectionFollowUp/GET_INSPECTION_FOLLOW_UP_REQUEST',
  '@inspectionFollowUp/GET_INSPECTION_FOLLOW_UP_SUCCESS',
  '@inspectionFollowUp/GET_INSPECTION_FOLLOW_UP_FAILURE',
)<CommonApiParam, InspectionFollowUp[], void>();

export const editInspectionFollowUpAction = createAsyncAction(
  '@inspectionFollowUp/EDIT_INSPECTION_FOLLOW_UP_REQUEST',
  '@inspectionFollowUp/EDIT_INSPECTION_FOLLOW_UP_SUCCESS',
  '@inspectionFollowUp/EDIT_INSPECTION_FOLLOW_UP_FAILURE',
)<any, void, MessageErrorResponse[]>();

export const deleteInspectionFollowUpActions = createAsyncAction(
  `@inspectionFollowUp/DELETE_INSPECTION_FOLLOW_UP_ACTIONS`,
  `@inspectionFollowUp/DELETE_INSPECTION_FOLLOW_UP_ACTIONS_SUCCESS`,
  `@inspectionFollowUp/DELETE_INSPECTION_FOLLOW_UP_ACTIONS_FAIL`,
)<ParamsDeleteGroup, CommonApiParam, void>();

export const clearErrorMessages = createAction(
  '@inspectionFollowUp/REMOVE_ERROR_MESSAGE',
)<void>();

export const clearInspectionFollowUpReducer = createAction(
  '@inspectionFollowUp/CLEAR_INSPECTION_FOLLOW_UP',
)<void>();

export const updateParamsActions = createAction(
  '@inspectionFollowUp/UPDATE_PARAMS_LIST',
)<CommonListParams>();
