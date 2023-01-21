import { createReducer } from 'typesafe-actions';
import { DivisionMappingStore } from '../utils/model';
import {
  getListDivisionMappingActions,
  deleteDivisionMappingActions,
} from './action';

const INITIAL_STATE: DivisionMappingStore = {
  loading: true,
  listDivision: [],
  params: { isLeftMenu: false },
  errorList: null,
};

const DivisionMappingReducer = createReducer<DivisionMappingStore>(
  INITIAL_STATE,
)
  .handleAction(
    getListDivisionMappingActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: true,
    }),
  )
  .handleAction(
    getListDivisionMappingActions.success,
    (state, { payload }) => ({
      ...state,
      listDivision: payload,
      loading: false,
    }),
  )
  .handleAction(
    getListDivisionMappingActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(deleteDivisionMappingActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(deleteDivisionMappingActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteDivisionMappingActions.failure, (state) => ({
    ...state,
    loading: false,
  }));
export default DivisionMappingReducer;
