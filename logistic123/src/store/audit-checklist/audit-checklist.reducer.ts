import { createReducer } from 'typesafe-actions';
import { AuditCheckListStore } from 'models/store/audit-checklist/audit-checklist.model';
import {
  clearAuditCheckListReducer,
  clearErrorMessages,
  getListAuditCheckListAction,
  deleteAuditCheckListAction,
  createGeneralInfoAction,
  updateParamsActions,
  clearCreatedAuditCheckListAction,
  clearAuditCheckListDetail,
  getAuditCheckListDetailAction,
  refreshChecklistDetailAction,
  createQuestionAction,
  getListQuestionAction,
  deleteQuestionAction,
  submitAuditCheckListAction,
  updateQuestionAction,
  acceptAuditCheckListAction,
  undoSubmitAuditCheckListAction,
  cancelAuditCheckListAction,
  approveAuditCheckListAction,
  updateGeneralInfoAction,
  reorderQuestionList,
  setDataFilterAction,
  checkIsCreatedInitialData,
  getListROFFromIARAction,
} from './audit-checklist.action';

const INITIAL_STATE: AuditCheckListStore = {
  loading: false,
  listAuditCheckList: undefined,
  errorList: [],
  isCreatedInitialData: false,
  createdAuditCheckList: undefined,
  auditCheckListDetail: undefined,
  params: { isLeftMenu: false },
  listQuestion: [],
  listROFFromIAR: undefined,
  dataFilter: null,
};

// TODO handle more audit checklist actions and create saga

const auditCheckListReducer = createReducer<AuditCheckListStore>(INITIAL_STATE)
  .handleAction(getListAuditCheckListAction.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: true,
  }))
  .handleAction(getListAuditCheckListAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listAuditCheckList: payload,
  }))
  .handleAction(getListAuditCheckListAction.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(checkIsCreatedInitialData, (state, { payload }) => ({
    ...state,
    isCreatedInitialData: payload,
  }))
  .handleAction(getListROFFromIARAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getListROFFromIARAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listROFFromIAR: payload,
  }))
  .handleAction(getListROFFromIARAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getAuditCheckListDetailAction.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    getAuditCheckListDetailAction.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      auditCheckListDetail: payload,
    }),
  )
  .handleAction(getAuditCheckListDetailAction.failure, (state) => ({
    ...state,
    loading: false,
    auditCheckListDetail: undefined,
  }))
  .handleAction(deleteAuditCheckListAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteAuditCheckListAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    params: { ...payload },
  }))
  .handleAction(deleteAuditCheckListAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createGeneralInfoAction.request, (state) => ({
    ...state,
    loading: true,
    errorList: null,
  }))
  .handleAction(createGeneralInfoAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    createdAuditCheckList: {
      ...state.createdAuditCheckList,
      generalInfo: payload,
    },
  }))
  .handleAction(createGeneralInfoAction.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    createdAuditCheckList: {
      ...state.createdAuditCheckList,
      generalInfo: undefined,
    },
    errorList: payload,
  }))

  .handleAction(updateGeneralInfoAction.request, (state) => ({
    ...state,
    loading: true,
    errorList: null,
  }))
  .handleAction(updateGeneralInfoAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    createdAuditCheckList: {
      ...state.createdAuditCheckList,
      generalInfo: payload,
    },
  }))
  .handleAction(updateGeneralInfoAction.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    createdAuditCheckList: {
      ...state.createdAuditCheckList,
      generalInfo: undefined,
    },
    errorList: payload,
  }))

  .handleAction(submitAuditCheckListAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(submitAuditCheckListAction.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(submitAuditCheckListAction.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(refreshChecklistDetailAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(refreshChecklistDetailAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    createdAuditCheckList: {
      ...state.createdAuditCheckList,
      generalInfo: payload,
    },
  }))
  .handleAction(refreshChecklistDetailAction.failure, (state) => ({
    ...state,
    loading: false,
    createdAuditCheckList: {
      ...state.createdAuditCheckList,
      generalInfo: undefined,
    },
  }))
  .handleAction(clearCreatedAuditCheckListAction, (state) => ({
    ...state,
    createdAuditCheckList: undefined,
    params: undefined,
    listQuestion: [],
  }))
  .handleAction(clearAuditCheckListDetail, (state) => ({
    ...state,
    auditCheckListDetail: undefined,
  }))
  .handleAction(clearErrorMessages, (state) => ({
    ...state,
    errorList: [],
  }))
  .handleAction(clearAuditCheckListReducer, (state) => ({
    ...state,
    loading: false,
    listAuditCheckList: undefined,
    errorList: [],
    params: undefined,
    createdAuditCheckList: {},
    listQuestion: [],
  }))
  .handleAction(createQuestionAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createQuestionAction.success, (state, { payload }) => ({
    ...state,
    listQuestion: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(createQuestionAction.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(updateQuestionAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateQuestionAction.success, (state, { payload }) => ({
    ...state,
    listQuestion: payload,
    loading: false,
  }))
  .handleAction(updateQuestionAction.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getListQuestionAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getListQuestionAction.success, (state, { payload }) => ({
    ...state,
    listQuestion: payload,
    loading: false,
  }))
  .handleAction(getListQuestionAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(reorderQuestionList.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(reorderQuestionList.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(reorderQuestionList.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteQuestionAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteQuestionAction.success, (state, { payload }) => ({
    ...state,
    listQuestion: payload,
    loading: false,
  }))
  .handleAction(deleteQuestionAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(acceptAuditCheckListAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(acceptAuditCheckListAction.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(acceptAuditCheckListAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(undoSubmitAuditCheckListAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(undoSubmitAuditCheckListAction.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(undoSubmitAuditCheckListAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(approveAuditCheckListAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(approveAuditCheckListAction.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(approveAuditCheckListAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(cancelAuditCheckListAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(cancelAuditCheckListAction.success, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
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
  .handleAction(cancelAuditCheckListAction.failure, (state) => ({
    ...state,
    loading: false,
  }));

export default auditCheckListReducer;
