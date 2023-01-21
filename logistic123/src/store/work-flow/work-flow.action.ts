import { User } from 'models/api/user/user.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  ListWorkFlowResponse,
  CreateWorkflowParams,
  WorkflowRoleDetail,
} from '../../models/api/work-flow/work-flow.model';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListWorkFlowActions = createAsyncAction(
  `@workFlow/GET_LIST_WORK_FLOW_ACTIONS`,
  `@workFlow/GET_LIST_WORK_FLOW_ACTIONS_SUCCESS`,
  `@workFlow/GET_LIST_WORK_FLOW_ACTIONS_FAIL`,
)<CommonApiParam, ListWorkFlowResponse, void>();

export const deleteWorkFlowActions = createAsyncAction(
  `@workFlow/DELETE_WORK_FLOW_ACTIONS`,
  `@workFlow/DELETE_WORK_FLOW_ACTIONS_SUCCESS`,
  `@workFlow/DELETE_WORK_FLOW_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createWorkFlowActions = createAsyncAction(
  `@workFlow/CREATE_WORK_FLOW_ACTIONS`,
  `@workFlow/CREATE_WORK_FLOW_ACTIONS_SUCCESS`,
  `@workFlow/CREATE_WORK_FLOW_ACTIONS_FAIL`,
)<CreateWorkflowParams, void, ErrorField[]>();

export const updateWorkFlowActions = createAsyncAction(
  `@workFlow/UPDATE_WORK_FLOW_ACTIONS`,
  `@workFlow/UPDATE_WORK_FLOW_ACTIONS_SUCCESS`,
  `@workFlow/UPDATE_WORK_FLOW_ACTIONS_FAIL`,
)<CreateWorkflowParams, void, ErrorField[]>();

export const getWorkFlowDetailActions = createAsyncAction(
  `@workFlow/GET_WORK_FLOW_ACTIONS`,
  `@workFlow/GET_WORK_FLOW_ACTIONS_SUCCESS`,
  `@workFlow/GET_WORK_FLOW_ACTIONS_FAIL`,
)<string, WorkflowRoleDetail, void>();

export const getWorkFlowActiveUserPermissionActions = createAsyncAction(
  `@workFlow/GET_WORK_FLOW_ACTIVE_USER_PERMISSION_ACTIONS`,
  `@workFlow/GET_WORK_FLOW_ACTIVE_USER_PERMISSION_ACTIONS_SUCCESS`,
  `@workFlow/GET_WORK_FLOW_ACTIVE_USER_PERMISSION_ACTIONS_FAIL`,
)<CommonApiParam, string[], void>();

export const getWorkFlowPermissionStepActions = createAsyncAction(
  `@workFlow/GET_WORK_FLOW_PERMISSION_STEP_ACTIONS`,
  `@workFlow/GET_WORK_FLOW_PERMISSION_STEP_ACTIONS_SUCCESS`,
  `@workFlow/GET_WORK_FLOW_PERMISSION_STEP_ACTIONS_FAIL`,
)<CommonApiParam, string[], void>();

export const getListAuditorsActions = createAsyncAction(
  `@workFlow/GET_LIST_AUDITORS_ACTIONS`,
  `@workFlow/GET_LIST_AUDITORS_ACTIONS_SUCCESS`,
  `@workFlow/GET_LIST_AUDITORS_ACTIONS_FAIL`,
)<CommonApiParam, User[], void>();

export const clearWorkFlowReducer = createAction(
  `@workFlow/CLEAR_WORK_FLOW_REDUCER`,
)<void>();

export const clearParamsWorkFlowReducer = createAction(
  `@workFlow/CLEAR_PARAMS_WORK_FLOW_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@workFlow/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
