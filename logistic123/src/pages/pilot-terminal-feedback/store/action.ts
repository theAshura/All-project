import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  NumberIncident,
  PilotFeedBackAverageScore,
  PilotStatus,
} from 'pages/incidents/utils/models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  CreatePilotTerminalFeedbackParams,
  GetListPilotTerminalFeedbackResponse,
  PilotTerminalFeedbackDetail,
  UpdatePilotTerminalFeedbackParams,
} from '../utils/models/common.model';

interface ParamsDeletePilotTerminalFeedback {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListPilotTerminalFeedbackActions = createAsyncAction(
  `@pilotTerminalFeedback/GET_LIST_PILOT_TERMINAL_FEEDBACK_ACTIONS`,
  `@pilotTerminalFeedback/GET_LIST_PILOT_TERMINAL_FEEDBACK_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/GET_LIST_PILOT_TERMINAL_FEEDBACK_ACTIONS_FAIL`,
)<CommonApiParam, GetListPilotTerminalFeedbackResponse, void>();

export const getPilotTerminalFeedbackDetailActions = createAsyncAction(
  `@pilotTerminalFeedback/GET_PILOT_TERMINAL_FEEDBACK_DETAIL_ACTIONS`,
  `@pilotTerminalFeedback/GET_PILOT_TERMINAL_FEEDBACK_DETAIL_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/GET_PILOT_TERMINAL_FEEDBACK_DETAIL_ACTIONS_FAIL`,
)<string, PilotTerminalFeedbackDetail, void>();

export const createPilotTerminalFeedbackActions = createAsyncAction(
  `@pilotTerminalFeedback/CREATE_PILOT_TERMINAL_FEEDBACK_ACTIONS`,
  `@pilotTerminalFeedback/CREATE_PILOT_TERMINAL_FEEDBACK_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/CREATE_PILOT_TERMINAL_FEEDBACK_ACTIONS_FAIL`,
)<CreatePilotTerminalFeedbackParams, void, ErrorField[]>();

export const updatePilotTerminalFeedbacksActions = createAsyncAction(
  `@pilotTerminalFeedback/UPDATE_PILOT_TERMINAL_FEEDBACK_ACTIONS`,
  `@pilotTerminalFeedback/UPDATE_PILOT_TERMINAL_FEEDBACK_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/UPDATE_PILOT_TERMINAL_FEEDBACK_ACTIONS_FAIL`,
)<UpdatePilotTerminalFeedbackParams, void, ErrorField[]>();

export const deletePilotTerminalFeedbacksActions = createAsyncAction(
  `@pilotTerminalFeedback/DELETE_PILOT_TERMINAL_FEEDBACK_ACTIONS`,
  `@pilotTerminalFeedback/DELETE_PILOT_TERMINAL_FEEDBACK_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/DELETE_PILOT_TERMINAL_FEEDBACK_ACTIONS_FAIL`,
)<ParamsDeletePilotTerminalFeedback, CommonApiParam, void>();

export const clearPilotTerminalFeedbackReducer = createAction(
  `@pilotTerminalFeedback/CLEAR_PILOT_TERMINAL_FEEDBACK_REDUCER`,
)<void | boolean>();

export const clearPilotTerminalFeedbackErrorsReducer = createAction(
  `@pilotTerminalFeedback/CLEAR_PILOT_TERMINAL_FEEDBACK_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@pilotTerminalFeedback/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@pilotTerminalFeedback/SET_DATA_FILTER`,
)<CommonApiParam>();

export const getNumberOfPilotFeedbackActions = createAsyncAction(
  `@pilotTerminalFeedback/NUMBER_OF_FEEDBACK_ACTIONS`,
  `@pilotTerminalFeedback/NUMBER_OF_FEEDBACK_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/NUMBER_OF_FEEDBACK_ACTIONS_FAIL`,
)<CommonApiParam, NumberIncident[], void>();

export const getPilotFeedbackStatusActions = createAsyncAction(
  `@pilotTerminalFeedback/STATUS_FEEDBACK_ACTIONS`,
  `@pilotTerminalFeedback/STATUS_FEEDBACK_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/STATUS_FEEDBACK_ACTIONS_FAIL`,
)<CommonApiParam, PilotStatus[], void>();

export const getPilotFeedbackAverageScoreActions = createAsyncAction(
  `@pilotTerminalFeedback/AVERAGE_SCORE_FEEDBACK_ACTIONS`,
  `@pilotTerminalFeedback/AVERAGE_SCORE_FEEDBACK_ACTIONS_SUCCESS`,
  `@pilotTerminalFeedback/AVERAGE_SCORE_FEEDBACK_ACTIONS_FAIL`,
)<CommonApiParam, PilotFeedBackAverageScore[], void>();
