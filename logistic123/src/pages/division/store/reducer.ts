import { createReducer } from 'typesafe-actions';
import { DivisionStore } from '../utils/model';
import { getListDivisionActions, deleteDivisionActions } from './action';

const INITIAL_STATE: DivisionStore = {
  loading: true,
  listDivision: [],
  params: { isLeftMenu: false },
  errorList: null,
};

const DivisionReducer = createReducer<DivisionStore>(INITIAL_STATE)
  .handleAction(getListDivisionActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: true,
  }))
  .handleAction(getListDivisionActions.success, (state, { payload }) => ({
    ...state,
    listDivision: payload,
    loading: false,
  }))
  .handleAction(getListDivisionActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteDivisionActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(deleteDivisionActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteDivisionActions.failure, (state) => ({
    ...state,
    loading: false,
  }));
export default DivisionReducer;
