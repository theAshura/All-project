import { TemplateState } from 'models/store/template/template.model';
import { createReducer } from 'typesafe-actions';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import {
  clearTemplateReducer,
  createTemplateActions,
  deleteTemplateActions,
  getListTemplateActions,
  getTemplateDetailActions,
  updateTemplateActions,
  updateParamsActions,
  getListTemplateDictionaryActions,
  deleteTemplateDictionaryActions,
  createTemplateDictionaryActions,
  getTemplateDetailDictionaryActions,
  updateTemplateDictionaryActions,
  clearTemplateDictionaryReducer,
} from './template.action';

const INITIAL_STATE: TemplateState = {
  loading: false,
  listTemplateDictionary: {},
  listTemplate: null,
  listTemplate2: null,
  listTemplate3: null,
  listTemplate4: null,
  errorList: [],
  content: null,
  templateDetailDictionary: {},
  templateDetail: null,
  templateDetail2: null,
  templateDetail3: null,
  templateDetail4: null,
  params: { isLeftMenu: false },
};

const TemplateReducer = createReducer<TemplateState>(INITIAL_STATE)
  .handleAction(getListTemplateActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    content: payload.content,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListTemplateActions.success, (state, { payload }) => {
    switch (state.content) {
      case MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate:
      case MODULE_TEMPLATE.planningCompletedTab: {
        return {
          ...state,
          listTemplate2: payload.gridTemplates,
          templateDetail2: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }

      case MODULE_TEMPLATE.planningUnplannedTab: {
        return {
          ...state,
          listTemplate3: payload.gridTemplates,
          templateDetail3: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }
      case MODULE_TEMPLATE.inspectionHistorySummaryIWTemplate: {
        return {
          ...state,
          listTemplate4: payload.gridTemplates,
          templateDetail4: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }

      default: {
        return {
          ...state,
          listTemplate: payload.gridTemplates,
          templateDetail: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }
    }
  })
  .handleAction(getListTemplateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteTemplateActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteTemplateActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(deleteTemplateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createTemplateActions.request, (state, { payload }) => ({
    ...state,
    content: payload.module,
    loading: true,
  }))
  .handleAction(createTemplateActions.success, (state, { payload }) => {
    switch (state.content) {
      case MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate:
      case MODULE_TEMPLATE.planningCompletedTab: {
        return {
          ...state,
          listTemplate2: payload.gridTemplates,
          templateDetail2: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }
      case MODULE_TEMPLATE.planningUnplannedTab: {
        return {
          ...state,
          listTemplate3: payload.gridTemplates,
          templateDetail3: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }
      case MODULE_TEMPLATE.inspectionHistorySummaryIWTemplate: {
        return {
          ...state,
          listTemplate4: payload.gridTemplates,
          templateDetail4: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }
      default: {
        return {
          ...state,
          listTemplate: payload.gridTemplates,
          templateDetail: payload.firstGridTemplateDetail,
          errorList: [],
          loading: false,
        };
      }
    }
  })
  .handleAction(createTemplateActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))

  .handleAction(getTemplateDetailActions.request, (state, { payload }) => ({
    ...state,
    content: payload?.content || state.content,
    loading: true,
  }))
  .handleAction(getTemplateDetailActions.success, (state, { payload }) => {
    switch (state.content) {
      case MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate:
      case MODULE_TEMPLATE.planningCompletedTab: {
        return {
          ...state,
          templateDetail2: payload,
          errorList: [],
          loading: false,
        };
      }
      case MODULE_TEMPLATE.planningUnplannedTab: {
        return {
          ...state,
          templateDetail3: payload,
          errorList: [],
          loading: false,
        };
      }
      case MODULE_TEMPLATE.inspectionHistorySummaryIWTemplate: {
        return {
          ...state,
          templateDetail4: payload,
          errorList: [],
          loading: false,
        };
      }
      default: {
        return {
          ...state,
          templateDetail: payload,
          errorList: [],
          loading: false,
        };
      }
    }
  })
  .handleAction(getTemplateDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateTemplateActions.request, (state, { payload }) => ({
    ...state,
    content: payload?.module || state.content,
    loading: true,
  }))
  .handleAction(updateTemplateActions.success, (state, { payload }) => {
    switch (state.content) {
      case MODULE_TEMPLATE.iWChecklistFindingSummaryTemplate:
      case MODULE_TEMPLATE.planningCompletedTab: {
        return {
          ...state,
          templateDetail2: payload,
          errorList: [],
          loading: false,
        };
      }
      case MODULE_TEMPLATE.planningUnplannedTab: {
        return {
          ...state,
          templateDetail3: payload,
          errorList: [],
          loading: false,
        };
      }
      case MODULE_TEMPLATE.inspectionHistorySummaryIWTemplate: {
        return {
          ...state,
          templateDetail4: payload,
          errorList: [],
          loading: false,
        };
      }
      default: {
        return {
          ...state,
          templateDetail: payload,
          errorList: [],
          loading: false,
        };
      }
    }
  })
  .handleAction(updateTemplateActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))

  .handleAction(clearTemplateReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  // NOTED: New template logic
  .handleAction(
    getListTemplateDictionaryActions.request,
    (state, { payload }) => ({
      ...state,
      params: payload,
      content: payload.content,
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListTemplateDictionaryActions.success,
    (state, { payload }) => {
      const templateName = payload.templateName ?? '';
      return {
        ...state,
        listTemplateDictionary: {
          ...state.listTemplateDictionary,
          [templateName]: payload.gridTemplates,
        },
        templateDetailDictionary: {
          ...state.templateDetailDictionary,
          [templateName]: payload.firstGridTemplateDetail,
        },
        errorList: [],
        loading: false,
      };
    },
  )
  .handleAction(getListTemplateDictionaryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteTemplateDictionaryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteTemplateDictionaryActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(deleteTemplateDictionaryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(
    createTemplateDictionaryActions.request,
    (state, { payload }) => ({
      ...state,
      content: payload.module,
      loading: true,
    }),
  )
  .handleAction(
    createTemplateDictionaryActions.success,
    (state, { payload }) => {
      const templateName = payload.templateName ?? '';
      return {
        ...state,
        listTemplateDictionary: {
          ...state.listTemplateDictionary,
          [templateName]: payload.gridTemplates,
        },
        templateDetailDictionary: {
          ...state.templateDetailDictionary,
          [templateName]: payload.firstGridTemplateDetail,
        },
        errorList: [],
        loading: false,
      };
    },
  )
  .handleAction(
    createTemplateDictionaryActions.failure,
    (state, { payload }) => ({
      ...state,
      errorList: payload,
      loading: false,
    }),
  )

  .handleAction(
    getTemplateDetailDictionaryActions.request,
    (state, { payload }) => ({
      ...state,
      content: payload?.content || state.content,
      loading: true,
    }),
  )
  .handleAction(
    getTemplateDetailDictionaryActions.success,
    (state, { payload }) => {
      const templateName = payload.templateName ?? '';
      return {
        ...state,
        templateDetailDictionary: {
          ...state.templateDetailDictionary,
          [templateName]: payload,
        },
        errorList: [],
        loading: false,
      };
    },
  )
  .handleAction(getTemplateDetailDictionaryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(
    updateTemplateDictionaryActions.request,
    (state, { payload }) => ({
      ...state,
      content: payload?.module || state.content,
      loading: true,
    }),
  )
  .handleAction(
    updateTemplateDictionaryActions.success,
    (state, { payload }) => {
      const templateName = payload.templateName ?? '';
      return {
        ...state,
        templateDetailDictionary: {
          ...state.templateDetailDictionary,
          [templateName]: payload,
        },
        errorList: [],
        loading: false,
      };
    },
  )
  .handleAction(
    updateTemplateDictionaryActions.failure,
    (state, { payload }) => ({
      ...state,
      errorList: payload,
      loading: false,
    }),
  )

  .handleAction(clearTemplateDictionaryReducer, () => ({
    ...INITIAL_STATE,
  }));

export default TemplateReducer;
