import { DepartmentMasterState } from 'models/store/department-master/department-master.model';
import { createReducer } from 'typesafe-actions';
import {
  clearDepartmentMasterErrorsReducer,
  clearDepartmentMasterReducer,
  clearParamsDepartmentMasterReducer,
  createDepartmentMasterActions,
  updateParamsActions,
  deleteDepartmentMasterActions,
  getDepartmentMasterDetailActions,
  getListDepartmentMasterActions,
  updateDepartmentMasterActions,
} from './department-master.action';

const INITIAL_STATE: DepartmentMasterState = {
  loading: false,
  disable: false,
  listDepartmentMaster: null,
  departmentMasterDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const DepartmentMasterReducer = createReducer<DepartmentMasterState>(
  INITIAL_STATE,
)
  .handleAction(
    getListDepartmentMasterActions.request,
    (state, { payload }) => ({
      ...state,
      params: payload,
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListDepartmentMasterActions.success,
    (state, { payload }) => ({
      ...state,
      listDepartmentMaster: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getListDepartmentMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteDepartmentMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deleteDepartmentMasterActions.success,
    (state, { payload }) => ({
      ...state,
      errorList: [],
      params: payload,
      loading: false,
    }),
  )
  .handleAction(deleteDepartmentMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createDepartmentMasterActions.request, (state) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createDepartmentMasterActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(
    createDepartmentMasterActions.failure,
    (state, { payload }) => ({
      ...state,
      errorList: payload,
      loading: false,
    }),
  )
  .handleAction(getDepartmentMasterDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getDepartmentMasterDetailActions.success,
    (state, { payload }) => ({
      ...state,
      departmentMasterDetail: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getDepartmentMasterDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateDepartmentMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateDepartmentMasterActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(
    updateDepartmentMasterActions.failure,
    (state, { payload }) => ({
      ...state,
      errorList: payload,
      loading: false,
    }),
  )
  .handleAction(clearDepartmentMasterReducer, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(clearParamsDepartmentMasterReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))
  .handleAction(clearDepartmentMasterErrorsReducer, (state) => ({
    ...state,
    errorList: [],
  }));

export default DepartmentMasterReducer;
