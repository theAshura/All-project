import {
  CreateDryDockingParams,
  DeleteDryDockingParams,
  GetDetailDryDocking,
  GetDryDockingResponse,
  UpdateDryDockingParams,
} from 'models/api/dry-docking/dry-docking.model';
import { CommonApiParam } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

export const getLisDryDockingActions = createAsyncAction(
  `@dryDocking/GET_LIST_DRY_DOCKING_ACTIONS`,
  `@dryDocking/GET_LIST_DRY_DOCKING_ACTIONS_SUCCESS`,
  `@dryDocking/GET_LIST_DRY_DOCKING_ACTIONS_FAIL`,
)<CommonApiParam, GetDryDockingResponse, void>();

export const createDryDockingActions = createAsyncAction(
  `@dryDocking/CREATE_DRY_DOCKING_ACTIONS`,
  `@dryDocking/CREATE_DRY_DOCKING_ACTIONS_SUCCESS`,
  `@dryDocking/CREATE_DRY_DOCKING_ACTIONS_FAIL`,
)<CreateDryDockingParams, void, void>();
export const updateDryDockingActions = createAsyncAction(
  `@dryDocking/UPDATE_DRY_DOCKING_ACTIONS`,
  `@dryDocking/UPDATE_DRY_DOCKING_ACTIONS_SUCCESS`,
  `@dryDocking/UPDATE_DRY_DOCKING_ACTIONS_FAIL`,
)<UpdateDryDockingParams, void, void>();
export const deleteDryDockingActions = createAsyncAction(
  `@dryDocking/DELETE_DRY_DOCKING_ACTIONS`,
  `@dryDocking/DELETE_DRY_DOCKING_ACTIONS_SUCCESS`,
  `@dryDocking/DELETE_DRY_DOCKING_ACTIONS_FAIL`,
)<DeleteDryDockingParams, void, void>();
export const getDetailDryDocking = createAsyncAction(
  `@dryDocking/GET_DETAIL_DRY_DOCKING_ACTIONS`,
  `@dryDocking/GET_DETAIL_DRY_DOCKING_ACTIONS_SUCCESS`,
  `@dryDocking/GET_DETAIL_DRY_DOCKING_ACTIONS_FAIL`,
)<string, GetDetailDryDocking, void>();
export const clearDryDockingAction = createAction(
  `@dryDocking/CLEAR_DRY_DOCKING_ACTIONS`,
)<void>();
