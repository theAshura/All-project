import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  WebServicesGetListParams,
  WebServicesResponse,
  WebServicesUpdateParams,
  VesselSummaryUpdateParams,
  VesselSummaryParams,
  VesselSummaryResponse,
  AttachmentsAndRemarksResponse,
  AttachmentAndRemarkGetListParams,
  AttachmentAndRemarksUpdateParams,
  AttachmentAndRemarkDeleteParams,
  AttachmentAndRemarkCreateParams,
  FeedbackAndRemarksResponse,
  FeedbackAndRemarksUpdateParams,
  FeedbackAndRemarksCreateParams,
  FeedbackAndRemarkDeleteParams,
  SummaryByTabResponse,
  GetSummaryByTabParams,
  WebServicesCreateParams,
  WebServicesDeleteParams,
} from '../utils/models/summary.model';

export const getFeedbackAndRemarksActions = createAsyncAction(
  `@VesselScreening/GET_FEEDBACK_AND_REMARKS_ACTIONS`,
  `@VesselScreening/GET_FEEDBACK_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_FEEDBACK_AND_REMARKS_ACTIONS_FAIL`,
)<CommonApiParam, FeedbackAndRemarksResponse, void>();

export const updateFeedbackAndRemarksActions = createAsyncAction(
  `@VesselScreening/UPDATE_FEEDBACK_AND_REMARKS_ACTIONS`,
  `@VesselScreening/UPDATE_FEEDBACK_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_FEEDBACK_AND_REMARKS_ACTIONS_FAIL`,
)<FeedbackAndRemarksUpdateParams, void, ErrorField[]>();

export const createFeedbackAndRemarksActions = createAsyncAction(
  `@VesselScreening/CREATE_FEEDBACK_AND_REMARKS_ACTIONS`,
  `@VesselScreening/CREATE_FEEDBACK_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/CREATE_FEEDBACK_AND_REMARKS_ACTIONS_FAIL`,
)<FeedbackAndRemarksCreateParams, void, ErrorField[]>();

export const deleteFeedbackAndRemarksActions = createAsyncAction(
  `@VesselScreening/DELETE_FEEDBACK_AND_REMARKS_ACTIONS`,
  `@VesselScreening/DELETE_FEEDBACK_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/DELETE_FEEDBACK_AND_REMARKS_ACTIONS_FAIL`,
)<FeedbackAndRemarkDeleteParams, void, ErrorField[]>();

export const getSummaryAttachmentsAndRemarksActions = createAsyncAction(
  `@VesselScreening/GET_ATTACHMENT_AND_REMARKS_ACTIONS`,
  `@VesselScreening/GET_ATTACHMENT_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_ATTACHMENT_AND_REMARKS_ACTIONS_FAIL`,
)<AttachmentAndRemarkGetListParams, AttachmentsAndRemarksResponse, void>();

export const updateSummaryAttachmentsAndRemarksActions = createAsyncAction(
  `@VesselScreening/UPDATE_ATTACHMENT_AND_REMARKS_ACTIONS`,
  `@VesselScreening/UPDATE_ATTACHMENT_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_ATTACHMENT_AND_REMARKS_ACTIONS_FAIL`,
)<AttachmentAndRemarksUpdateParams, void, ErrorField[]>();

export const createSummaryAttachmentsAndRemarksActions = createAsyncAction(
  `@VesselScreening/CREATE_ATTACHMENT_AND_REMARKS_ACTIONS`,
  `@VesselScreening/CREATE_ATTACHMENT_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/CREATE_ATTACHMENT_AND_REMARKS_ACTIONS_FAIL`,
)<AttachmentAndRemarkCreateParams, void, ErrorField[]>();

export const deleteSummaryAttachmentsAndRemarksActions = createAsyncAction(
  `@VesselScreening/DELETE_ATTACHMENT_AND_REMARKS_ACTIONS`,
  `@VesselScreening/DELETE_ATTACHMENT_AND_REMARKS_ACTIONS_SUCCESS`,
  `@VesselScreening/DELETE_ATTACHMENT_AND_REMARKS_ACTIONS_FAIL`,
)<AttachmentAndRemarkDeleteParams, void, ErrorField[]>();

export const getVesselSummaryActions = createAsyncAction(
  `@VesselScreening/GET_VESSEL_SUMMARY_ACTIONS`,
  `@VesselScreening/GET_VESSEL_SUMMARY_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_VESSEL_SUMMARY_ACTIONS_FAIL`,
)<VesselSummaryParams, VesselSummaryResponse, ErrorField[]>();

export const updateVesselSummaryActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SUMMARY_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SUMMARY_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SUMMARY_ACTIONS_FAIL`,
)<VesselSummaryUpdateParams, void, ErrorField[]>();

export const getSummaryByTabActions = createAsyncAction(
  `@VesselScreening/GET_SUMMARY_BY_TAB_ACTIONS`,
  `@VesselScreening/GET_SUMMARY_BY_TAB_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_SUMMARY_BY_TAB_ACTIONS_FAIL`,
)<GetSummaryByTabParams, SummaryByTabResponse, void>();

export const getSummaryWebServicesActions = createAsyncAction(
  `@VesselScreening/GET_WEB_SERVICES_ACTIONS`,
  `@VesselScreening/GET_WEB_SERVICES_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_WEB_SERVICES_ACTIONS_FAIL`,
)<WebServicesGetListParams, WebServicesResponse, void>();

export const updateSummaryWebServicesActions = createAsyncAction(
  `@VesselScreening/UPDATE_WEB_SERVICES_ACTIONS`,
  `@VesselScreening/UPDATE_WEB_SERVICES_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_WEB_SERVICES_ACTIONS_FAIL`,
)<WebServicesUpdateParams, void, ErrorField[]>();

export const createSummaryWebServicesActions = createAsyncAction(
  `@VesselScreening/CREATE_WEB_SERVICES_ACTIONS`,
  `@VesselScreening/CREATE_WEB_SERVICES_ACTIONS_SUCCESS`,
  `@VesselScreening/CREATE_WEB_SERVICES_ACTIONS_FAIL`,
)<WebServicesCreateParams, void, ErrorField[]>();

export const deleteSummaryWebServicesActions = createAsyncAction(
  `@VesselScreening/DELETE_WEB_SERVICES_ACTIONS`,
  `@VesselScreening/DELETE_WEB_SERVICES_ACTIONS_SUCCESS`,
  `@VesselScreening/DELETE_WEB_SERVICES_ACTIONS_FAIL`,
)<WebServicesDeleteParams, void, ErrorField[]>();

export const clearSummaryObjectsReducer = createAction(
  `@VesselScreening/CLEAR_SUMMARY_OBJECTS_REDUCER`,
)<void>();

export const clearAttachmentAndRemarksReducer = createAction(
  `@VesselScreening/CLEAR_ATTACHMENT_AND_REMARKS_REDUCER`,
)<void>();
