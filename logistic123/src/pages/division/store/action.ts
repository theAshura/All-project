import { createAsyncAction } from 'typesafe-actions';
import { GetListDivision } from '../utils/model';

export const getListDivisionActions = createAsyncAction(
  `@division/GET_LIST_DIVISION_ACTIONS`,
  `@division/GET_LIST_DIVISION_ACTIONS_SUCCESS`,
  `@division/GET_LIST_DIVISION_ACTIONS_FAIL`,
)<GetListDivision, any, void>();

export const deleteDivisionActions = createAsyncAction(
  `@division/DELETE_DIVISION_ACTIONS`,
  `@division/DELETE_DIVISION_ACTIONS_SUCCESS`,
  `@division/DELETE_DIVISION_ACTIONS_FAIL`,
)<any, void, void>();

export const createDivisionActions = createAsyncAction(
  `@division/CREATE_DIVISION_ACTIONS`,
  `@division/CREATE_DIVISION_ACTIONS_SUCCESS`,
  `@division/CREATE_DIVISION_ACTIONS_FAIL`,
)<any, void, void>();

export const updateDivisionActions = createAsyncAction(
  `@division/UPDATE_DIVISION_ACTIONS`,
  `@division/UPDATE_DIVISION_ACTIONS_SUCCESS`,
  `@division/UPDATE_DIVISION_ACTIONS_FAIL`,
)<any, void, void>();

export const getDivisionDetailActions = createAsyncAction(
  `@division/GET_DIVISION_DETAIL_ACTIONS`,
  `@division/GET_DIVISION_DETAIL_ACTIONS_SUCCESS`,
  `@division/GET_DIVISION_DETAIL_ACTIONS_FAIL`,
)<string, any, void>();
