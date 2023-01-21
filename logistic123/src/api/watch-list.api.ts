import { requestAuthorized } from 'helpers/request';
import {
  MultiCheckWatchListParam,
  WatchListParam,
} from 'models/api/watch-list/watch-list.model';
import { ASSETS_API } from './endpoints/config.endpoint';

export const createWatchListApi = (dataParams: WatchListParam) =>
  requestAuthorized
    .post<WatchListParam>(`${ASSETS_API}/watchlist`, dataParams)
    .catch((error) => Promise.reject(error));

export const getListActivityApi = () =>
  requestAuthorized.get<any>(`${ASSETS_API}/watchlist`);

export const checkWatchListApi = (dataParams: WatchListParam) =>
  requestAuthorized
    .post<WatchListParam>(`${ASSETS_API}/watchlist/check-watchlist`, dataParams)
    .catch((error) => Promise.reject(error));

export const unWatchListApi = (dataParams: WatchListParam) =>
  requestAuthorized
    .delete<WatchListParam>(`${ASSETS_API}/watchlist/un-watchlist`, {
      data: dataParams,
    })
    .catch((error) => Promise.reject(error));

export const unWatchListMultiApi = (dataParams: MultiCheckWatchListParam) =>
  requestAuthorized
    .delete<WatchListParam>(`${ASSETS_API}/watchlist/un-watchlist-multi`, {
      data: dataParams,
    })
    .catch((error) => Promise.reject(error));
