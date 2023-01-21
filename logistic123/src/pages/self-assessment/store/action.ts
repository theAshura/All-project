import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetLookBackCommentResponse,
  ReOpenDeclarationParams,
  GetSelfDeclarationResponse,
  CreateSelfAssessmentParams,
  GetSelfAssessmentResponse,
  GetVersionSelfAssessmentParam,
  GetVersionSelfAssessmentResponse,
  SelfAssessmentDetailResponse,
  UpdateSelfAssessmentParams,
  SelfDeclarationDetailResponse,
  ApproveSelfDeclarationParams,
  StandardMaster,
  ReassignDeclarationParams,
  SelfAssessmentMatrixResponse,
  UnpublishSelfAssessmentParams,
  PublishSelfAssessmentParams,
  GetListSelfDeclarationParams,
  GetSelfDeclarationDetailParams,
  SelfAssessmentMatrixParams,
  ComplianceAndTargetDateSelfAssessment,
} from '../utils/model';

interface ParamsDeleteSelfAssessment {
  id: string;
  isDetail?: boolean;
  getListSelfAssessment: () => void;
}

export const getListSelfAssessmentActions = createAsyncAction(
  `@SelfAssessment/GET_LIST_SELF_ASSESSMENT_ACTIONS`,
  `@SelfAssessment/GET_LIST_SELF_ASSESSMENT_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_LIST_SELF_ASSESSMENT_ACTIONS_FAIL`,
)<CommonApiParam, GetSelfAssessmentResponse, void>();

export const getVersionNumberActions = createAsyncAction(
  `@SelfAssessment/GET_VERSION_NUMBER_ACTIONS`,
  `@SelfAssessment/GET_VERSION_NUMBER_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_VERSION_NUMBER_ACTIONS_FAIL`,
)<GetVersionSelfAssessmentParam, GetVersionSelfAssessmentResponse, void>();

export const deleteSelfAssessmentActions = createAsyncAction(
  `@SelfAssessment/DELETE_SELF_ASSESSMENT_ACTIONS`,
  `@SelfAssessment/DELETE_SELF_ASSESSMENT_ACTIONS_SUCCESS`,
  `@SelfAssessment/DELETE_SELF_ASSESSMENT_ACTIONS_FAIL`,
)<ParamsDeleteSelfAssessment, void, void>();

export const createSelfAssessmentActions = createAsyncAction(
  `@SelfAssessment/CREATE_SELF_ASSESSMENT_ACTIONS`,
  `@SelfAssessment/CREATE_SELF_ASSESSMENT_ACTIONS_SUCCESS`,
  `@SelfAssessment/CREATE_SELF_ASSESSMENT_ACTIONS_FAIL`,
)<CreateSelfAssessmentParams, void, ErrorField[]>();

export const updateSelfAssessmentActions = createAsyncAction(
  `@SelfAssessment/UPDATE_SELF_ASSESSMENT_ACTIONS`,
  `@SelfAssessment/UPDATE_SELF_ASSESSMENT_ACTIONS_SUCCESS`,
  `@SelfAssessment/UPDATE_SELF_ASSESSMENT_ACTIONS_FAIL`,
)<UpdateSelfAssessmentParams, void, ErrorField[]>();

export const getSelfAssessmentDetailActions = createAsyncAction(
  `@SelfAssessment/GET_SELF_ASSESSMENT_DETAIL_ACTIONS`,
  `@SelfAssessment/GET_SELF_ASSESSMENT_DETAIL_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_SELF_ASSESSMENT_DETAIL_ACTIONS_FAIL`,
)<string, SelfAssessmentDetailResponse, void>();

export const getListSelfDeclarationActions = createAsyncAction(
  `@SelfAssessment/GET_LIST_SELF_DECLARATION_ACTIONS`,
  `@SelfAssessment/GET_LIST_SELF_DECLARATION_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_LIST_SELF_DECLARATION_ACTIONS_FAIL`,
)<GetListSelfDeclarationParams, GetSelfDeclarationResponse, void>();

export const getSelfDeclarationDetailActions = createAsyncAction(
  `@SelfAssessment/GET_SELF_DECLARATION_DETAIL_ACTIONS`,
  `@SelfAssessment/GET_SELF_DECLARATION_DETAIL_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_SELF_DECLARATION_DETAIL_ACTIONS_FAIL`,
)<GetSelfDeclarationDetailParams, SelfDeclarationDetailResponse, void>();

export const approveSelfDeclarationActions = createAsyncAction(
  `@SelfAssessment/APPROVE_SELF_DECLARATION_ACTIONS`,
  `@SelfAssessment/APPROVE_SELF_DECLARATION_ACTIONS_SUCCESS`,
  `@SelfAssessment/APPROVE_SELF_DECLARATION_ACTIONS_FAIL`,
)<ApproveSelfDeclarationParams, void, ErrorField[]>();

export const reOpenAllSelfDeclarationApprovedActions = createAsyncAction(
  `@SelfAssessment/REOPEN_SELF_DECLARATION_APPROVED_ACTIONS`,
  `@SelfAssessment/REOPEN_SELF_DECLARATION_APPROVED_ACTIONS_SUCCESS`,
  `@SelfAssessment/REOPEN_SELF_DECLARATION_APPROVED_ACTIONS_FAIL`,
)<ReOpenDeclarationParams, void, ErrorField[]>();

export const reAssignSelfDeclarationApprovedActions = createAsyncAction(
  `@SelfAssessment/REASSIGN_SELF_DECLARATION_APPROVED_ACTIONS`,
  `@SelfAssessment/REASSIGN_SELF_DECLARATION_APPROVED_ACTIONS_SUCCESS`,
  `@SelfAssessment/REASSIGN_SELF_DECLARATION_APPROVED_ACTIONS_FAIL`,
)<ReassignDeclarationParams, void, ErrorField[]>();

export const publishOfficialSelfAssessmentActions = createAsyncAction(
  `@SelfAssessment/PUBLISH_OFFICIAL_SELF_ASSESSMENT_ACTIONS`,
  `@SelfAssessment/PUBLISH_OFFICIAL_SELF_ASSESSMENT_ACTIONS_SUCCESS`,
  `@SelfAssessment/PUBLISH_OFFICIAL_SELF_ASSESSMENT_ACTIONS_FAIL`,
)<PublishSelfAssessmentParams, void, ErrorField[]>();

export const unpublishSelfAssessmentActions = createAsyncAction(
  `@SelfAssessment/UNPUBLISH_SELF_ASSESSMENT_ACTIONS`,
  `@SelfAssessment/UNPUBLISH_SELF_ASSESSMENT_ACTIONS_SUCCESS`,
  `@SelfAssessment/UNPUBLISH_SELF_ASSESSMENT_ACTIONS_FAIL`,
)<UnpublishSelfAssessmentParams, void, ErrorField[]>();

export const getLookUpCompanyCommentActions = createAsyncAction(
  `@SelfAssessment/GET_LOOKUP_COMPANY_COMMENT_ACTIONS`,
  `@SelfAssessment/GET_LOOKUP_COMPANY_COMMENT_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_LOOKUP_COMPANY)COMMENT_ACTIONS_FAIL`,
)<CommonApiParam, GetLookBackCommentResponse, void>();

export const getSelfAssessmentMatrixActions = createAsyncAction(
  `@SelfAssessment/GET_SELF_ASSESSMENT_MATRIX_ACTIONS`,
  `@SelfAssessment/GET_SELF_ASSESSMENT_MATRIX_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_SELF_ASSESSMENT_MATRIX_ACTIONS_FAIL`,
)<SelfAssessmentMatrixParams, SelfAssessmentMatrixResponse, void>();

export const clearLookBackCommentReducer = createAction(
  `@SelfAssessment/CLEAR_LOOKBACK_COMMENT_REDUCER`,
)<void>();

export const getStandardMasterDetailActions = createAsyncAction(
  `@SelfAssessment/GET_STANDARD_MASTER_DETAIL_ACTIONS`,
  `@SelfAssessment/GET_STANDARD_MASTER_DETAIL_ACTIONS_SUCCESS`,
  `@SelfAssessment/GET_STANDARD_MASTER_DETAIL_ACTIONS_FAIL`,
)<string, StandardMaster, void>();

export const clearSelfAssessmentReducer = createAction(
  `@SelfAssessment/CLEAR_SELF_ASSESSMENT_REDUCER`,
)<void | boolean>();

export const clearSelfAssessmentErrorsReducer = createAction(
  `@SelfAssessment/CLEAR_SELF_ASSESSMENT_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@SelfAssessment/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@SelfAssessment/SET_DATA_FILTER`,
)<CommonApiParam>();

export const clearSelfAssessmentMatrixReducer = createAction(
  `@SelfAssessment/CLEAR_SELF_ASSESSMENT_MATRIX_REDUCER`,
)<void>();

export const clearSelfAssessmentDetailReducer = createAction(
  `@SelfAssessment/CLEAR_SELF_ASSESSMENT_DETAIL_REDUCER`,
)<void>();

export const updateComplianceAndTargetDateActions = createAsyncAction(
  `@SelfAssessment/UPDATE_COMPLIANCE_AND_TARGET_DATE_ACTIONS`,
  `@SelfAssessment/UPDATE_COMPLIANCE_AND_TARGET_DATE_ACTIONS_SUCCESS`,
  `@SelfAssessment/UPDATE_COMPLIANCE_AND_TARGET_DATE_ACTIONS_FAIL`,
)<ComplianceAndTargetDateSelfAssessment, void, void>();
