import { WatchListStoreModel } from 'models/store/watch-list/watch-list.model';
import { createReducer } from 'typesafe-actions';
import {
  checkWatchListActions,
  createWatchListActions,
  getWatchListActions,
  unWatchListActions,
  unWatchListMultiActions,
} from './watch-list.actions';

const INITIAL_STATE: WatchListStoreModel = {
  loading: true,
  loadingModal: true,
  errorList: [],
  watchingList: undefined,
  isWatchingList: undefined,
};

const watchListReducer = createReducer<WatchListStoreModel>(INITIAL_STATE)
  .handleAction(createWatchListActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createWatchListActions.success, (state, { payload }) => ({
    ...state,
    listActivity: { ...payload },
    isWatchingList: true,
    loading: false,
  }))
  .handleAction(createWatchListActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getWatchListActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getWatchListActions.success, (state, { payload }) => ({
    ...state,
    watchingList: { ...payload },
    loading: false,
  }))
  .handleAction(getWatchListActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(checkWatchListActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(checkWatchListActions.success, (state, { payload }) => ({
    ...state,
    isWatchingList: payload,
    loading: false,
  }))
  .handleAction(checkWatchListActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(unWatchListActions.request, (state) => ({
    ...state,
    loading: false,
    isWatchingList: false,
  }))
  .handleAction(unWatchListActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    isWatchingList: false,
  }))
  .handleAction(unWatchListActions.failure, (state) => ({
    ...state,
    loading: false,
    isWatchingList: false,
  }))
  .handleAction(unWatchListMultiActions.request, (state) => ({
    ...state,
    loading: false,
    isWatchingList: false,
  }))
  .handleAction(unWatchListMultiActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    isWatchingList: false,
  }))
  .handleAction(unWatchListMultiActions.failure, (state) => ({
    ...state,
    loading: false,
    isWatchingList: false,
  }));
export default watchListReducer;
