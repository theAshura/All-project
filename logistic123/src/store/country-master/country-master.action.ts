import {
  ListCountryMasterData,
  ListCountryMasterResponse,
} from 'models/api/country-master/country-master.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction } from 'typesafe-actions';

export const getListCountryMasterActions = createAsyncAction(
  `@countryMaster/GET_LIST_COUNTRY_MASTER_ACTIONS`,
  `@countryMaster/GET_LIST_COUNTRY_MASTER_ACTIONS_SUCCESS`,
  `@countryMaster/GET_LIST_COUNTRY_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, ListCountryMasterResponse, void>();

export const getOneCountryMasterActions = createAsyncAction(
  `@countryMaster/GET_ONE_COUNTRY_MASTER_ACTIONS`,
  `@countryMaster/GET_ONE_COUNTRY_MASTER_ACTIONS_SUCCESS`,
  `@countryMaster/GET_ONE_COUNTRY_MASTER_ACTIONS_FAIL`,
)<string, ListCountryMasterData, void>();

export const createCountryMasterActions = createAsyncAction(
  `@countryMaster/CREATE_COUNTRY_MASTER_ACTIONS`,
  `@countryMaster/CREATE_COUNTRY_MASTER_ACTIONS_SUCCESS`,
  `@countryMaster/CREATE_COUNTRY_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, void, ErrorField[]>();

export const updateCountryMasterActions = createAsyncAction(
  `@countryMaster/UPDATE_COUNTRY_MASTER_ACTIONS`,
  `@countryMaster/UPDATE_COUNTRY_MASTER_ACTIONS_SUCCESS`,
  `@countryMaster/UPDATE_COUNTRY_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, void, ErrorField[]>();

export const deleteCountryMasterActions = createAsyncAction(
  `@countryMaster/DELETE_COUNTRY_MASTER_ACTIONS`,
  `@countryMaster/DELETE_COUNTRY_MASTER_ACTIONS_SUCCESS`,
  `@countryMaster/DELETE_COUNTRY_MASTER_ACTIONS_FAIL`,
)<string, void, void>();
