import { User } from 'models/api/user/user.model';
import {
  ListWorkFlowResponse,
  WorkflowRoleDetail,
} from 'models/api/work-flow/work-flow.model';
import { CommonApiParam, ErrorField } from 'models/common.model';

export interface WorkFlowState {
  loading: boolean;
  disable: boolean;
  listWorkFlows: ListWorkFlowResponse;
  workFlowDetail: WorkflowRoleDetail;
  errorList: ErrorField[];
  params: CommonApiParam;
  workFlowActiveUserPermission: string[];
  workFlowPermissionStep: { wfrPermission: string; workflowType: string }[];
  auditors: User[];
  dataFilter?: CommonApiParam;
}
