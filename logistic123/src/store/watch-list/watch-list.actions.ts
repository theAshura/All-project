import {
  WatchListParam,
  GetWatchListResponse,
  MultiCheckWatchListParam,
} from 'models/api/watch-list/watch-list.model';
import { createAsyncAction } from 'typesafe-actions';

export const createWatchListActions = createAsyncAction(
  `@watchlist/CREATE_WATCH_LIST_ACTIONS`,
  `@watchlist/CREATE_WATCH_LIST_ACTIONS_SUCCESS`,
  `@watchlist/CREATE_WATCH_LIST_ACTIONS_FAIL`,
)<WatchListParam, void, void>();

export const getWatchListActions = createAsyncAction(
  `@watchlist/GET_WATCH_LIST_ACTIONS`,
  `@watchlist/GET_WATCH_LIST_ACTIONS_SUCCESS`,
  `@watchlist/GET_WATCH_LIST_ACTIONS_FAIL`,
)<void, GetWatchListResponse, void>();

export const checkWatchListActions = createAsyncAction(
  `@watchlist/CHECK_WATCH_LIST_ACTIONS`,
  `@watchlist/CHECK_WATCH_LIST_ACTIONS_SUCCESS`,
  `@watchlist/CHECK_WATCH_LIST_ACTIONS_FAIL`,
)<WatchListParam, boolean, void>();

export const unWatchListActions = createAsyncAction(
  `@watchlist/UN_WATCH_LIST_ACTIONS`,
  `@watchlist/UN_WATCH_LIST_ACTIONS_SUCCESS`,
  `@watchlist/UN_WATCH_LIST_ACTIONS_FAIL`,
)<WatchListParam, void, void>();

export const unWatchListMultiActions = createAsyncAction(
  `@watchlist/UN_WATCH_LIST_MULTI_ACTIONS`,
  `@watchlist/UN_WATCH_LIST_MULTI_ACTIONS_SUCCESS`,
  `@watchlist/UN_WATCH_LIST_MULTI_ACTIONS_FAIL`,
)<MultiCheckWatchListParam, void, void>();
