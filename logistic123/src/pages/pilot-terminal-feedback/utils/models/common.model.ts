import { VesselCharterers, VesselOwners } from 'models/api/vessel/vessel.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  NumberIncident,
  PilotFeedBackAverageScore,
  PilotStatus,
} from 'pages/incidents/utils/models/common.model';

export interface ByUser {
  username: string;
  id?: string;
  jobTitle?: string;
  email?: string;
}

export interface CreatedUser {
  firstName: string;
  lastName: string;
}
export interface Port {
  code: string;
  name: string;
  country: string;
}

export interface Terminal {
  code: string;
  name: string;
}

export interface Vessel {
  id: string;
  imoNumber: string;
  name: string;
  code: string;
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  vesselDocHolders?: VesselOwners[];
}

export interface PilotTerminalFeedbackChecklist {
  id?: string;
  questionNo: number;
  checkListValue: string;
  createdAt?: Date;
  updatedAt?: Date;
  pilotTerminalFeedbackId?: string;
}

export interface PTFComment {
  id?: string;
  comment: string;
  pilotTerminalFeedbackId?: string;
  createdUser?: ByUser;
  updatedUser?: ByUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatedUserInfo {
  id: string;
  username: string;
  jobTitle: string;
  email: string;
}
export interface PilotTerminalFeedbackHistory {
  id: string;
  createdAt: string;
  comment: string;
  status: string;
  createdUser: CreatedUserInfo;
}

export interface WorkFlow {
  createdAt: string | Date;
  createdUser: CreatedUserInfo;
  status: string;
}

export interface PilotTerminalFeedbackDetail {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vesselId: string;
  feedbackType: string;
  dateOfInteraction: Date;
  refId: string;
  portId: string;
  terminalId: string;
  country: string;
  pilotAgeArea: string;
  feedBack: string;
  score: number;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  attachments: string[];
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: ByUser;
  updatedUser: ByUser;
  vessel: Vessel;
  port: Port;
  terminal: Terminal;
  pilotTerminalFeedbackChecklists: PilotTerminalFeedbackChecklist[];
  PTFComments: PTFComment[];
  status?: string;
  pilotTerminalFeedbackHistories: PilotTerminalFeedbackHistory[];
  workFlow: WorkFlow[];
}

export interface GetListPilotTerminalFeedbackResponse {
  data: PilotTerminalFeedbackDetail[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface CreatePilotTerminalFeedbackParams {
  vesselId: string;
  feedbackType: string;
  dateOfInteraction: Date;
  terminalId: string;
  portId: string;
  country: string;
  pilotAgeArea: string;
  feedback: string;
  attachments: string[];
  pilotTerminalFeedbackChecklists: PilotTerminalFeedbackChecklist[];
  PTFComments?: PTFComment[];

  handleSuccess?: () => void;
}

export interface UpdatePilotTerminalFeedbackParams {
  id: string;
  data: CreatePilotTerminalFeedbackParams;
  handleSuccess?: () => void;
}

// store

export interface PilotTerminalFeedbackStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listPilotTerminalFeedback: GetListPilotTerminalFeedbackResponse;
  pilotTerminalFeedbackDetail: PilotTerminalFeedbackDetail;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
  numberOfPilotFeedbacks: NumberIncident[];
  listPilotFeedbackStatus: PilotStatus[];
  listPilotFeedbackAverageScore: PilotFeedBackAverageScore[];
}
