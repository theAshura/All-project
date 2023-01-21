import { HomePageStoreModel } from 'models/store/home-page/home-page.model';
import { updateRemarkActions } from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import { createReducer } from 'typesafe-actions';
import {
  createRemarkActions,
  getAnalysisDataActions,
  getListActivityActions,
  getRemarksByDateActions,
} from './home-page.action';

const INITIAL_STATE: HomePageStoreModel = {
  loading: true,
  loadingModal: true,
  errorList: [],
  listActivity: undefined,
  analysisData: undefined,
  remarksByDate: undefined,
};

const homepageReducer = createReducer<HomePageStoreModel>(INITIAL_STATE)
  .handleAction(getListActivityActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getListActivityActions.success, (state, { payload }) => ({
    ...state,
    listActivity: { ...payload },
    loading: false,
  }))
  .handleAction(getListActivityActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getAnalysisDataActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getAnalysisDataActions.success, (state, { payload }) => ({
    ...state,
    analysisData: { ...payload },
    loading: false,
  }))
  .handleAction(getAnalysisDataActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createRemarkActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createRemarkActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createRemarkActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))

  .handleAction(getRemarksByDateActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getRemarksByDateActions.success, (state, { payload }) => ({
    ...state,
    remarksByDate: { ...payload },
    loading: false,
  }))
  .handleAction(getRemarksByDateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateRemarkActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateRemarkActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateRemarkActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }));

export default homepageReducer;
