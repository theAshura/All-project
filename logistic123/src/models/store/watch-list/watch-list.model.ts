import { ErrorField } from 'models/common.model';
import { GetWatchListResponse } from 'models/api/watch-list/watch-list.model';

export interface WatchListStoreModel {
  loading: boolean;
  loadingModal: boolean;
  errorList: ErrorField[];

  watchingList: GetWatchListResponse;
  isWatchingList: boolean;
}
