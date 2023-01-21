import { createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import { SelfAssessmentStoreModel } from '../utils/model';
import {
  getListSelfAssessmentActions,
  deleteSelfAssessmentActions,
  updateSelfAssessmentActions,
  createSelfAssessmentActions,
  getSelfAssessmentDetailActions,
  updateParamsActions,
  clearSelfAssessmentReducer,
  clearSelfAssessmentErrorsReducer,
  setDataFilterAction,
  getListSelfDeclarationActions,
  getSelfDeclarationDetailActions,
  reOpenAllSelfDeclarationApprovedActions,
  approveSelfDeclarationActions,
  getLookUpCompanyCommentActions,
  getStandardMasterDetailActions,
  clearLookBackCommentReducer,
  clearSelfAssessmentDetailReducer,
  reAssignSelfDeclarationApprovedActions,
  publishOfficialSelfAssessmentActions,
  getSelfAssessmentMatrixActions,
  unpublishSelfAssessmentActions,
  clearSelfAssessmentMatrixReducer,
  updateComplianceAndTargetDateActions,
} from './action';

const initParams = { isRefreshLoading: true, paramsList: {} };
const INITIAL_STATE: SelfAssessmentStoreModel = {
  loading: false,
  disable: false,
  params: initParams,
  listSelfAssessment: undefined,
  listSelfDeclaration: undefined,
  listLookUpCompanyComment: undefined,
  selfAssessmentDetail: null,
  selfDeclarationDetail: null,
  standardMasterDetail: null,
  errorList: undefined,
  dataFilter: null,
  selfAssessmentMatrix: null,
};

const SelfAssessmentReducer = createReducer<SelfAssessmentStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListSelfAssessmentActions.request, (state, { payload }) => {
    let params = cloneDeep(payload);
    if (payload?.isNotSaveSearch) {
      params = omit(payload, ['status', 'isNotSaveSearch']);
    }
    return {
      ...state,
      params: {
        ...params,
        pageSize:
          payload.pageSize === -1 ? state.params?.pageSize : payload?.pageSize,
      },
      loading:
        payload?.isRefreshLoading === false || payload?.isRefreshLoading
          ? payload?.isRefreshLoading
          : true,
    };
  })
  .handleAction(getListSelfAssessmentActions.success, (state, { payload }) => ({
    ...state,
    listSelfAssessment: payload,
    loading: false,
  }))
  .handleAction(getListSelfAssessmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteSelfAssessmentActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteSelfAssessmentActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteSelfAssessmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateSelfAssessmentActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateSelfAssessmentActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateSelfAssessmentActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createSelfAssessmentActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createSelfAssessmentActions.success, (state) => ({
    ...state,
    params: initParams,
    loading: false,
  }))
  .handleAction(createSelfAssessmentActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getSelfAssessmentDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getSelfAssessmentDetailActions.success,
    (state, { payload }) => ({
      ...state,
      selfAssessmentDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getSelfAssessmentDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getSelfDeclarationDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getSelfDeclarationDetailActions.success,
    (state, { payload }) => ({
      ...state,
      selfDeclarationDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getSelfDeclarationDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(approveSelfDeclarationActions.request, (state) => ({
    ...state,
  }))
  .handleAction(approveSelfDeclarationActions.success, (state) => ({
    ...state,
  }))
  .handleAction(approveSelfDeclarationActions.failure, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(reAssignSelfDeclarationApprovedActions.request, (state) => ({
    ...state,
  }))
  .handleAction(reAssignSelfDeclarationApprovedActions.success, (state) => ({
    ...state,
  }))
  .handleAction(
    reAssignSelfDeclarationApprovedActions.failure,
    (state, { payload }) => ({
      ...state,
      errorList: payload,
    }),
  )

  .handleAction(publishOfficialSelfAssessmentActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(publishOfficialSelfAssessmentActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(publishOfficialSelfAssessmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(unpublishSelfAssessmentActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(unpublishSelfAssessmentActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(unpublishSelfAssessmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearSelfAssessmentErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearSelfAssessmentMatrixReducer, (state) => ({
    ...state,
    selfAssessmentMatrix: null,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))

  .handleAction(clearSelfAssessmentReducer, (state, { payload }) => ({
    ...state,
    dataFilter: payload ? null : state?.dataFilter,
  }))
  .handleAction(setDataFilterAction, (state, { payload }) => ({
    ...state,
    dataFilter: {
      ...payload,
      typeRange: payload?.dateFilter
        ? state.dataFilter?.typeRange
        : payload.typeRange,
    },
  }))

  .handleAction(getListSelfDeclarationActions.request, (state, { payload }) => {
    let params = cloneDeep(payload?.params);
    if (params?.isNotSaveSearch) {
      params = omit(payload, ['status', 'isNotSaveSearch']);
    }
    return {
      ...state,
      params: {
        ...params,
        pageSize:
          payload?.params?.pageSize === -1
            ? state.params?.pageSize
            : payload?.params?.pageSize,
      },
      loading: true,
    };
  })
  .handleAction(
    getListSelfDeclarationActions.success,
    (state, { payload }) => ({
      ...state,
      listSelfDeclaration: payload,
      loading: false,
    }),
  )
  .handleAction(getListSelfDeclarationActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(reOpenAllSelfDeclarationApprovedActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(reOpenAllSelfDeclarationApprovedActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    reOpenAllSelfDeclarationApprovedActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )
  .handleAction(getLookUpCompanyCommentActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getLookUpCompanyCommentActions.success,
    (state, { payload }) => ({
      ...state,
      listLookUpCompanyComment: payload,
      loading: false,
    }),
  )
  .handleAction(getLookUpCompanyCommentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearLookBackCommentReducer, (state) => ({
    ...state,
    listLookUpCompanyComment: undefined,
  }))
  .handleAction(clearSelfAssessmentDetailReducer, (state) => ({
    ...state,
    selfAssessmentDetail: undefined,
  }))
  .handleAction(getStandardMasterDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getStandardMasterDetailActions.success,
    (state, { payload }) => ({
      ...state,
      standardMasterDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getStandardMasterDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getSelfAssessmentMatrixActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getSelfAssessmentMatrixActions.success,
    (state, { payload }) => ({
      ...state,
      selfAssessmentMatrix: payload,
      loading: false,
    }),
  )
  .handleAction(getSelfAssessmentMatrixActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateComplianceAndTargetDateActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateComplianceAndTargetDateActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateComplianceAndTargetDateActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  );

export default SelfAssessmentReducer;
