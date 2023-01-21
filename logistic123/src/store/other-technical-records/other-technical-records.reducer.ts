import { OtherTechnicalRecordsStoreModel } from 'models/store/other-technical-records/other-technical-records.model';
import { createReducer } from 'typesafe-actions';
import {
  getListOtherTechnicalRecordsActions,
  createOtherTechnicalRecordsActions,
  deleteOtherTechnicalRecordsActions,
  getDetailOtherTechnicalRecords,
  clearOtherTechnicalRecords,
  updateOtherTechnicalRecordsActions,
  setDataFilterAction,
  clearTemplateReducer,
  updateParamsActions,
  createOtherTechnicalRecordsTemplateActions,
  deleteOtherTechnicalRecordsTemplateActions,
  getListOtherTechnicalRecordsTemplateActions,
  getOtherTechnicalRecordsTemplateDetailActions,
  updateOtherTechnicalRecordsTemplateActions,
} from './other-technical-records.action';

const INITIAL_STATE: OtherTechnicalRecordsStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  listOtherTechnicalRecords: null,
  detailOtherTechnicalRecords: null,
  dataFilter: null,
  errorList: undefined,
  // TODO: template
  content: null,
  errorListTemplate: null,
  paramTemplate: null,
  listTemplate: null,
  templateDetail: null,
};

const otherTechnicalRecordsReducer =
  createReducer<OtherTechnicalRecordsStoreModel>(INITIAL_STATE)
    .handleAction(
      getListOtherTechnicalRecordsActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListOtherTechnicalRecordsActions.success,
      (state, { payload }) => ({
        ...state,
        listOtherTechnicalRecords: payload,
        loading: false,
      }),
    )
    .handleAction(getListOtherTechnicalRecordsActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      deleteOtherTechnicalRecordsActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      deleteOtherTechnicalRecordsActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(deleteOtherTechnicalRecordsActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      getDetailOtherTechnicalRecords.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getDetailOtherTechnicalRecords.success,
      (state, { payload }) => ({
        ...state,
        detailOtherTechnicalRecords: payload,
        loading: false,
      }),
    )
    .handleAction(getDetailOtherTechnicalRecords.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      createOtherTechnicalRecordsActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      createOtherTechnicalRecordsActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(createOtherTechnicalRecordsActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateOtherTechnicalRecordsActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateOtherTechnicalRecordsActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(updateOtherTechnicalRecordsActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(clearOtherTechnicalRecords, (state) => ({
      ...state,
      detailOtherTechnicalRecords: null,
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

    // TODO: Template

    .handleAction(
      getListOtherTechnicalRecordsTemplateActions.request,
      (state, { payload }) => ({
        ...state,
        paramTemplate: payload,
        content: payload.content,
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListOtherTechnicalRecordsTemplateActions.success,
      (state, { payload }) => ({
        ...state,
        listTemplate: payload.gridTemplates,
        templateDetail: payload.firstGridTemplateDetail,
        errorListTemplate: null,
        loading: false,
      }),
    )
    .handleAction(
      getListOtherTechnicalRecordsTemplateActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      deleteOtherTechnicalRecordsTemplateActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      deleteOtherTechnicalRecordsTemplateActions.success,
      (state) => ({
        ...state,
        errorListTemplate: null,
        loading: false,
      }),
    )
    .handleAction(
      deleteOtherTechnicalRecordsTemplateActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      createOtherTechnicalRecordsTemplateActions.request,
      (state, { payload }) => ({
        ...state,
        content: payload.module,
        loading: true,
      }),
    )
    .handleAction(
      createOtherTechnicalRecordsTemplateActions.success,
      (state, { payload }) => ({
        ...state,
        listTemplate: payload.gridTemplates,
        templateDetail: payload.firstGridTemplateDetail,
        errorListTemplate: null,
        loading: false,
      }),
    )
    .handleAction(
      createOtherTechnicalRecordsTemplateActions.failure,
      (state, { payload }) => ({
        ...state,
        errorListTemplate: payload,
        loading: false,
      }),
    )
    .handleAction(
      getOtherTechnicalRecordsTemplateDetailActions.request,
      (state, { payload }) => ({
        ...state,
        content: payload?.content || state.content,
        loading: true,
      }),
    )
    .handleAction(
      getOtherTechnicalRecordsTemplateDetailActions.success,
      (state, { payload }) => ({
        ...state,
        templateDetail: payload,
        errorListTemplate: null,
        loading: false,
      }),
    )
    .handleAction(
      getOtherTechnicalRecordsTemplateDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateOtherTechnicalRecordsTemplateActions.request,
      (state, { payload }) => ({
        ...state,
        content: payload?.module || state.content,
        loading: true,
      }),
    )
    .handleAction(
      updateOtherTechnicalRecordsTemplateActions.success,
      (state, { payload }) => ({
        ...state,
        templateDetail: payload,
        errorListTemplate: null,
        loading: false,
      }),
    )
    .handleAction(
      updateOtherTechnicalRecordsTemplateActions.failure,
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

export default otherTechnicalRecordsReducer;
