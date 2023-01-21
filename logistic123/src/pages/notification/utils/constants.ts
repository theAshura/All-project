import { AppRouteConst } from 'constants/route.const';

export enum NotificationType {
  ALL = 'all',
  UNREAD = 'unread',
}

export interface Notification {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  receiverId: string;
  receiverName: string;
  receiverJobTitle: string;
  performerId: string;
  performerName: string;
  performerJobTitle: string;
  module: string;
  recordId: string;
  recordRef: string;
  previousStatus: string;
  currentStatus: string;
  isRead: boolean;
  type: string;
  executedAt: Date | string;
  extendData?: any;
}

export const moduleDetailPathDictionary = {
  'Report finding': (id: string) =>
    `${AppRouteConst.REPORT_OF_FINDING}/detail/${id}`,
  'Audit workspace': (id: string) =>
    `${AppRouteConst.AUDIT_INSPECTION_WORKSPACE}/detail/${id}`,
  'Audit time table': (id: string) =>
    `${AppRouteConst.AUDIT_TIME_TABLE}/detail/${id}`,
  'Audit checklist': (id: string) =>
    `${AppRouteConst.AUDIT_CHECKLIST}/detail/${id}`,
  'Planning request': (id: string) =>
    `${AppRouteConst.PLANNING_AND_REQUEST}/detail/${id}`,
  'CAR/CAP': (id: string) =>
    `${AppRouteConst.INTERNAL_AUDIT_REPORT}/detail/${id}`,
  'Internal audit report': (id: string) =>
    `${AppRouteConst.INTERNAL_AUDIT_REPORT}/detail/${id}`,
  'Self assessment': (id: string) =>
    `${AppRouteConst.SELF_ASSESSMENT}/detail/${id}?standard-and-matrix`,
  'Self declaration': (id: string, params?: any) =>
    `${AppRouteConst.SELF_ASSESSMENT}/declaration/detail/${id}?selfAssessmentId=${params?.selfAssessmentId}`,
  'Sail reporting': (id: string, params?: any) =>
    `${AppRouteConst.SAIL_GENERAL_REPORT}/detail/${id}`,
};
