import { CommonApiParam } from 'models/common.model';
import { createAsyncAction } from 'typesafe-actions';
import {
  GetVoyageInfoResponse,
  VoyageInfoDetailResponse,
} from '../../utils/models/voyage-info.model';

export const getListVoyageInfoActions = createAsyncAction(
  `@VoyageInfo/GET_LIST_VOYAGE_NFO_ACTIONS`,
  `@VoyageInfo/GET_LIST_VOYAGE_INFO_ACTIONS_SUCCESS`,
  `@VoyageInfo/GET_LIST_VOYAGE_INFO_ACTIONS_FAIL`,
)<CommonApiParam, GetVoyageInfoResponse, void>();

export const getVoyageInfoDetailActions = createAsyncAction(
  `@VoyageInfo/GET_VOYAGE_INFO_DETAIL_ACTIONS`,
  `@VoyageInfo/GET_VOYAGE_INFO_DETAIL_ACTIONS_SUCCESS`,
  `@VoyageInfo/GET_VOYAGE_INFO_DETAIL_ACTIONS_FAIL`,
)<string, VoyageInfoDetailResponse, void>();
