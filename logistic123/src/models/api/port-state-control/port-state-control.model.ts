import { ErrorField } from 'models/common.model';
import { IComment } from 'pages/vessel-screening/utils/models/common.model';
import { NewAsyncSelectProps } from 'components/ui/async-select/NewAsyncSelect';
import { Vessel } from 'models/api/condition-of-class/condition-of-class.model';

export interface Company {
  name: string;
}

export interface Inspector {
  id?: string;
  firstName: string;
  lastName: string;
}

export interface Port {
  id?: string;
  code: string;
  name: string;
  country: string;
}

export interface Terminal {
  code: string;
  name: string;
  portMaster: Port;
}

export interface Fleet {
  code: string;
  name: string;
  id?: string;
}

export interface PSC {
  code: string;
  name: string;
  id?: string;
}

export interface VIQ {
  viqVesselType: string;
  id?: string;
}

export interface PortStateInspectionReport {
  id?: string;
  finding: string;
  estimatedCompletion: Date | string;
  actualCompletion: Date | string;
  status: string;
  pscDeficiency: PSC;
  pscAction: PSC;
  mainCategory?: {
    id?: string;
    code?: string;
    name?: string;
  };
  viq: VIQ;
}

export interface PortStateControl {
  id?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  eventType: {
    name: string;
    code: string;
  };
  dateOfInspection: Date | string;
  noFindings: boolean;
  detention: string;
  refId: string;
  comment: string;
  isPort: boolean;
  authorityId: string;
  companyId: string;
  vesselId: string;
  portId: string;
  terminalId: string;
  createdUserId: string;
  updatedUserId: string;
  company: Company;
  vessel: Vessel;
  port: Port;
  terminal: Terminal;
  inspectors: Inspector[];
  portStateInspectionReports: PortStateInspectionReport[];
  attachments: string[];
  isNew?: boolean;
  handleSuccess?: () => void;
}

export interface GetPortStateControlsResponse {
  data: PortStateControl[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  scope?: string;
  sort?: string;
}
export interface GetPortStateControlsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface PortStateInspectionReportParams {
  id?: string;
  pscDeficiencyId?: string;
  pscActionId?: string;
  finding: string;
  viqId?: string;
  estimatedCompletion: Date | string;
  actualCompletion: Date | string;
  mainCategoryId?: string;
  status: string;
  // TODO: to display
  pscAction?: PSC;
  pscDeficiency?: PSC;
  viq?: VIQ;
  mainCategory?: any;
}

export interface CreatePortStateControlParams {
  vesselId: string;
  eventType: string;
  eventTypeId?: string | NewAsyncSelectProps[];
  authorityId: string;
  dateOfInspection: Date | string;
  noFindings: boolean;
  detention: string;
  comment: string;
  isPort: boolean;
  portId: string;
  terminalId: string;
  attachments: string[];
  portStateInspectionReports: PortStateInspectionReportParams[];
  inspectorName: string;
  handleSuccess?: () => void;
}

export interface UpdatePortStateControlParams {
  id?: string;
  data: CreatePortStateControlParams;
  resetForm?: () => void;
  handleSuccess?: () => void;
}

export interface PortStateControlRequests {
  PSRComments: IComment[];
  comments?: IComment[];
  id?: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  portStateControlId: string;
}

export interface PortStateControlDetailResponse {
  attachments: string[];
  id?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  eventType: {
    code: string;
    name: string;
  };
  dateOfInspection: Date | string;
  noFindings: boolean;
  detention: string;
  refId: string;
  authority: { name: string };
  eventTypeId?: string | NewAsyncSelectProps[];
  comment: string;
  isPort: boolean;
  authorityId: string;
  companyId: string;
  vesselId: string;
  portId: string;
  terminalId: string;
  createdUserId: string;
  updatedUserId: string;
  company: Company;
  vessel: Vessel;
  port: Port;
  terminal: string;
  inspectorName: string;
  portStateInspectionReports: PortStateInspectionReport[];
  portStateControlRequests: PortStateControlRequests[];
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
