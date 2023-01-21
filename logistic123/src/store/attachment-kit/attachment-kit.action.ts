import {
  ListAttachmentKitResponse,
  AttachmentKitData,
  AttachmentKitDetail,
} from 'models/api/attachment-kit/attachment-kit.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const getListAttachmentKitSActions = createAsyncAction(
  `@attachmentKit/GET_LIST_ATTACHMENT_KIT_ACTIONS`,
  `@attachmentKit/GET_LIST_ATTACHMENT_KIT_ACTIONS_SUCCESS`,
  `@attachmentKit/GET_LIST_ATTACHMENT_KIT_ACTIONS_FAIL`,
)<CommonApiParam, ListAttachmentKitResponse, void>();

export const deleteAttachmentKitActions = createAsyncAction(
  `@attachmentKit/DELETE_ATTACHMENT_KIT_ACTIONS`,
  `@attachmentKit/DELETE_ATTACHMENT_KIT_ACTIONS_SUCCESS`,
  `@attachmentKit/DELETE_ATTACHMENT_KIT_ACTIONS_FAIL`,
)<CommonApiParam, void, void>();

export const createAttachmentKitActions = createAsyncAction(
  `@attachmentKit/CREATE_ATTACHMENT_KIT_ACTIONS`,
  `@attachmentKit/CREATE_ATTACHMENT_KIT_ACTIONS_SUCCESS`,
  `@attachmentKit/CREATE_ATTACHMENT_KIT_ACTIONS_FAIL`,
)<AttachmentKitData, void, ErrorField[]>();

export const updateAttachmentKitActions = createAsyncAction(
  `@attachmentKit/UPDATE_ATTACHMENT_KIT_ACTIONS`,
  `@attachmentKit/UPDATE_ATTACHMENT_KIT_ACTIONS_SUCCESS`,
  `@attachmentKit/UPDATE_ATTACHMENT_KIT_ACTIONS_FAIL`,
)<AttachmentKitData, void, ErrorField[]>();

export const getAttachmentKitDetailActions = createAsyncAction(
  `@attachmentKit/GET_ATTACHMENT_KIT_DETAIL_ACTIONS`,
  `@attachmentKit/GET_ATTACHMENT_KIT_DETAIL_ACTIONS_SUCCESS`,
  `@attachmentKit/GET_ATTACHMENT_KIT_DETAIL_ACTIONS_FAIL`,
)<string, AttachmentKitDetail, void>();

// export const getListFileActions = createAsyncAction(
//   `@attachmentKit/GET_LIST_FILE_ACTIONS`,
//   `@attachmentKit/GET_LIST_FILE_ACTIONS_SUCCESS`,
//   `@attachmentKit/GET_LIST_FILE_ACTIONS_FAIL`,
// )<any, GetListFile[], void>();

export const clearAttachmentKitReducer = createAction(
  `@attachmentKit/CLEAR_ATTACHMENT_KIT_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@attachmentKit/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
