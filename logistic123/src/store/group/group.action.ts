import { createAction, createAsyncAction } from 'typesafe-actions';
import { GetAllGroupPayload } from 'models/store/group/group.model';
import { MessageErrorResponse } from 'models/store/user/user.model';
import {
  EditGroupParams,
  GetAllGroupResponse,
  CreateGroupBody,
} from 'models/api/group/group.model';
import { CommonApiParam } from 'models/common.model';

interface ParamsDeleteGroup {
  id: string;
  isDetail?: boolean;
  getList: () => void;
}

export const getAllGroupAction = createAsyncAction(
  '@group/GET_ALL_GROUP_REQUEST',
  '@group/GET_ALL_GROUP_SUCCESS',
  '@group/GET_ALL_GROUP_FAILURE',
)<GetAllGroupPayload, GetAllGroupResponse, void>();

export const createGroupAction = createAsyncAction(
  '@group/CREATE_GROUP_REQUEST',
  '@group/CREATE_GROUP_SUCCESS',
  '@group/CREATE_GROUP_FAILURE',
)<CreateGroupBody, void, MessageErrorResponse[]>();

export const editGroupAction = createAsyncAction(
  '@group/EDIT_GROUP_REQUEST',
  '@group/EDIT_GROUP_SUCCESS',
  '@group/EDIT_GROUP_FAILURE',
)<EditGroupParams, void, MessageErrorResponse[]>();

export const deleteGroupActions = createAsyncAction(
  `@group/DELETE_GROUP_ACTIONS`,
  `@group/DELETE_GROUP_ACTIONS_SUCCESS`,
  `@group/DELETE_GROUP_ACTIONS_FAIL`,
)<ParamsDeleteGroup, CommonApiParam, void>();

export const clearErrorMessages = createAction(
  '@group/REMOVE_ERROR_MESSAGE',
)<void>();

export const clearGroupManagementReducer =
  createAction('@group/CLEAR_GROUP')<void>();

export const updateParamsActions = createAction(
  '@group/UPDATE_PARAMS_LIST',
)<GetAllGroupPayload>();
