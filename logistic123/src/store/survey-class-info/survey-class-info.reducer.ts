import { SurveyClassInfoStoreModel } from 'models/store/survey-class-info/survey-class-info.model';
import { createReducer } from 'typesafe-actions';
import {
  getListSurveyClassInfoActions,
  createSurveyClassInfoActions,
  deleteSurveyClassInfoActions,
  getDetailSurveyClassInfo,
  clearSurveyClassInfo,
  updateSurveyClassInfoActions,
  getSurveyClassInfoListTemplateActions,
  deleteSurveyClassInfoTemplateActions,
  createSurveyClassInfoTemplateActions,
  updateParamsActions,
  getSurveyClassInfoTemplateDetailActions,
  updateSurveyClassInfoTemplateActions,
  clearTemplateReducer,
} from './survey-class-info.action';

const INITIAL_STATE: SurveyClassInfoStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  listSurveyClassInfo: null,
  detailSurveyClassInfo: null,
  dataFilter: null,
  errorList: undefined,
  // TODO: template
  content: null,
  errorListTemplate: null,
  paramTemplate: null,
  listTemplate: null,
  templateDetail: null,
};

const surveyClassInfoReducer = createReducer<SurveyClassInfoStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListSurveyClassInfoActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListSurveyClassInfoActions.success,
    (state, { payload }) => ({
      ...state,
      listSurveyClassInfo: payload,
      loading: false,
    }),
  )
  .handleAction(getListSurveyClassInfoActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteSurveyClassInfoActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteSurveyClassInfoActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteSurveyClassInfoActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getDetailSurveyClassInfo.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getDetailSurveyClassInfo.success, (state, { payload }) => ({
    ...state,
    detailSurveyClassInfo: payload,
    loading: false,
  }))
  .handleAction(getDetailSurveyClassInfo.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createSurveyClassInfoActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createSurveyClassInfoActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createSurveyClassInfoActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateSurveyClassInfoActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateSurveyClassInfoActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateSurveyClassInfoActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearSurveyClassInfo, (state) => ({
    ...state,
    detailSurveyClassInfo: null,
  }))
  .handleAction(
    getSurveyClassInfoListTemplateActions.request,
    (state, { payload }) => ({
      ...state,
      paramTemplate: payload,
      content: payload.content,
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getSurveyClassInfoListTemplateActions.success,
    (state, { payload }) => ({
      ...state,
      listTemplate: payload.gridTemplates,
      templateDetail: payload.firstGridTemplateDetail,
      errorListTemplate: null,
      loading: false,
    }),
  )
  .handleAction(getSurveyClassInfoListTemplateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteSurveyClassInfoTemplateActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteSurveyClassInfoTemplateActions.success, (state) => ({
    ...state,
    errorListTemplate: null,
    loading: false,
  }))
  .handleAction(deleteSurveyClassInfoTemplateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    createSurveyClassInfoTemplateActions.request,
    (state, { payload }) => ({
      ...state,
      content: payload.module,
      loading: true,
    }),
  )
  .handleAction(
    createSurveyClassInfoTemplateActions.success,
    (state, { payload }) => ({
      ...state,
      listTemplate: payload.gridTemplates,
      templateDetail: payload.firstGridTemplateDetail,
      errorListTemplate: null,
      loading: false,
    }),
  )
  .handleAction(
    createSurveyClassInfoTemplateActions.failure,
    (state, { payload }) => ({
      ...state,
      errorListTemplate: payload,
      loading: false,
    }),
  )
  .handleAction(
    getSurveyClassInfoTemplateDetailActions.request,
    (state, { payload }) => ({
      ...state,
      content: payload?.content || state.content,
      loading: true,
    }),
  )
  .handleAction(
    getSurveyClassInfoTemplateDetailActions.success,
    (state, { payload }) => ({
      ...state,
      templateDetail: payload,
      errorListTemplate: null,
      loading: false,
    }),
  )
  .handleAction(getSurveyClassInfoTemplateDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateSurveyClassInfoTemplateActions.request,
    (state, { payload }) => ({
      ...state,
      content: payload?.module || state.content,
      loading: true,
    }),
  )
  .handleAction(
    updateSurveyClassInfoTemplateActions.success,
    (state, { payload }) => ({
      ...state,
      templateDetail: payload,
      errorListTemplate: null,
      loading: false,
    }),
  )
  .handleAction(
    updateSurveyClassInfoTemplateActions.failure,
    (state, { payload }) => ({
      ...state,
      errorListTemplate: payload,
      loading: false,
    }),
  )
  .handleAction(clearTemplateReducer, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }));

export default surveyClassInfoReducer;
