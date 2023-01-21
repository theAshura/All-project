import { CountryMasterStoreModel } from 'models/api/country-master/country-master.model';
import { createReducer } from 'typesafe-actions';
import {
  getListCountryMasterActions,
  getOneCountryMasterActions,
  deleteCountryMasterActions,
  createCountryMasterActions,
} from './country-master.action';

const INITIAL_STATE: CountryMasterStoreModel = {
  loading: false,
  errorList: [],
  params: { content: '' },
  listCountryMaster: null,
  countryMasterDetail: null,
};

const CountryMasterReducer = createReducer<CountryMasterStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListCountryMasterActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: true,
  }))
  .handleAction(getListCountryMasterActions.success, (state, { payload }) => ({
    ...state,
    listCountryMaster: payload,
    loading: false,
  }))
  .handleAction(getListCountryMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getOneCountryMasterActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getOneCountryMasterActions.success, (state, { payload }) => ({
    ...state,
    countryMasterDetail: payload,
    loading: false,
  }))
  .handleAction(getOneCountryMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteCountryMasterActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCountryMasterActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteCountryMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createCountryMasterActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createCountryMasterActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createCountryMasterActions.failure, (state, { payload }) => ({
    ...state,
    // errorList: payload,
    loading: false,
  }));

export default CountryMasterReducer;
