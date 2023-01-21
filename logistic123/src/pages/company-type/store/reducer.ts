import { createReducer } from 'typesafe-actions';
import { CompanyTypeStore } from '../utils/model';
import { getListCompanyTypeActions, deleteCompanyTypeActions } from './action';

const INITIAL_STATE: CompanyTypeStore = {
  loading: true,
  listData: null,
  params: { isLeftMenu: false },
  errorList: null,
};

const CompanyTypeReducer = createReducer<CompanyTypeStore>(INITIAL_STATE)
  .handleAction(getListCompanyTypeActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: true,
  }))
  .handleAction(getListCompanyTypeActions.success, (state, { payload }) => ({
    ...state,
    listData: payload,
    loading: false,
  }))
  .handleAction(getListCompanyTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteCompanyTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(deleteCompanyTypeActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteCompanyTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }));
export default CompanyTypeReducer;
