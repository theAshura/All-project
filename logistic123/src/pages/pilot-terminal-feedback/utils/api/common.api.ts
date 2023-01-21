import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import {
  ASSETS_API_PILOT_FEEDBACK_SUMMARY,
  ASSETS_API_PILOT_TERMINAL_FEEDBACK,
} from 'api/endpoints/config.endpoint';
import {
  NumberIncident,
  PilotFeedBackAverageScore,
  PilotStatus,
} from 'pages/incidents/utils/models/common.model';
import {
  GetListPilotTerminalFeedbackResponse,
  CreatePilotTerminalFeedbackParams,
  PilotTerminalFeedbackDetail,
  UpdatePilotTerminalFeedbackParams,
} from '../models/common.model';

export const getListPilotTerminalFeedbackActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListPilotTerminalFeedbackResponse>(
    `${ASSETS_API_PILOT_TERMINAL_FEEDBACK}?${params}`,
  );
};

export const deletePilotTerminalFeedbackActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_PILOT_TERMINAL_FEEDBACK}/${dataParams}`,
  );

export const createPilotTerminalFeedbackActionsApi = (
  dataParams: CreatePilotTerminalFeedbackParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_PILOT_TERMINAL_FEEDBACK, dataParams)
    .catch((error) => Promise.reject(error));

export const getPilotTerminalFeedbackDetailActionsApi = (id: string) =>
  requestAuthorized.get<PilotTerminalFeedbackDetail>(
    `${ASSETS_API_PILOT_TERMINAL_FEEDBACK}/${id}`,
  );

export const updatePilotTerminalFeedbackDetailActionsApi = (
  dataParams: UpdatePilotTerminalFeedbackParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_PILOT_TERMINAL_FEEDBACK}/${dataParams.id}`,
    dataParams.data,
  );

export const getNumberOfPilotFeedback = (params: CommonApiParam) => {
  const query = queryString.stringify(params);
  return requestAuthorized.get<NumberIncident[]>(
    `${ASSETS_API_PILOT_FEEDBACK_SUMMARY}/number-pilot-feedback?${query}`,
  );
};

export const getPilotFeedbackStatus = (params: CommonApiParam) => {
  const query = queryString.stringify(params);
  return requestAuthorized.get<PilotStatus[]>(
    `${ASSETS_API_PILOT_FEEDBACK_SUMMARY}/status?${query}`,
  );
};

export const getPilotFeedbackAverageScore = (params: CommonApiParam) => {
  const query = queryString.stringify(params);
  return requestAuthorized.get<PilotFeedBackAverageScore[]>(
    `${ASSETS_API_PILOT_FEEDBACK_SUMMARY}/average-score?${query}`,
  );
};
