import { AttachmentKitStoreModel } from 'models/store/attachment-kit/attachment-kit.model';
import { createReducer } from 'typesafe-actions';
import {
  clearAttachmentKitReducer,
  deleteAttachmentKitActions,
  getListAttachmentKitSActions,
  updateParamsActions,
  getAttachmentKitDetailActions,
  updateAttachmentKitActions,
  createAttachmentKitActions,
} from './attachment-kit.action';

const INITIAL_STATE: AttachmentKitStoreModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },
  attachmentKitDetail: undefined,
  listAttachmentKit: undefined,
  errorList: undefined,
};

const AttachmentKitReducer = createReducer<AttachmentKitStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListAttachmentKitSActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListAttachmentKitSActions.success, (state, { payload }) => ({
    ...state,
    listAttachmentKit: payload,
    loading: false,
  }))
  .handleAction(getListAttachmentKitSActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createAttachmentKitActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createAttachmentKitActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createAttachmentKitActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(updateAttachmentKitActions.request, (state) => ({
    ...state,
    errorList: undefined,
    loading: true,
  }))
  .handleAction(updateAttachmentKitActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateAttachmentKitActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))

  .handleAction(getAttachmentKitDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getAttachmentKitDetailActions.success,
    (state, { payload }) => ({
      ...state,
      attachmentKitDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getAttachmentKitDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteAttachmentKitActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(deleteAttachmentKitActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteAttachmentKitActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearAttachmentKitReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }));

export default AttachmentKitReducer;
