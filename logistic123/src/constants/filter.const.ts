import { EntityType } from 'models/common.model';
import moment from 'moment';
import { ReportTemplateModule } from './common.const';

export const TYPE_CUSTOM_RANGE = 'Custom range';

export const PRINT_OPTION = [
  { value: 'All', label: 'All' },
  { value: 'Internal', label: 'Internal' },
  { value: 'External', label: 'External' },
];

export const TYPE_HEADER = [
  { value: 'CK editor', label: 'CK editor' },
  {
    value: 'Inspection history table',
    label: 'Inspection history table',
  },
  {
    value: 'Internal audit table',
    label: 'Internal audit table',
  },
  {
    value: 'Dynamic',
    label: 'Dynamic',
  },
];

export const DATE_TIME_RANGES_OPTIONS = [
  {
    name: 'Today',
    range: [moment().startOf('day'), moment().endOf('day')],
  },
  {
    name: 'Yesterday',
    range: [
      moment().subtract(1, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day'),
    ],
  },
  {
    name: 'Last 7 days',
    range: [moment().subtract(7, 'days').startOf('day'), moment().endOf('day')],
  },
  {
    name: 'Last 30 days',
    range: [
      moment().subtract(30, 'days').startOf('day'),
      moment().endOf('day'),
    ],
  },
  {
    name: 'This Month',
    range: [moment().startOf('month'), moment().endOf('day')],
  },
  {
    name: 'Last Month',
    range: [
      moment().startOf('month').subtract(1, 'months'),
      moment().endOf('day'),
    ],
  },
  {
    name: 'Last 2 months',
    range: [
      moment().startOf('month').subtract(2, 'months'),
      moment().endOf('day'),
    ],
  },
  {
    name: 'Last 3 months',
    range: [
      moment().startOf('month').subtract(3, 'months'),
      moment().endOf('day'),
    ],
  },
  {
    name: 'Last 6 months',
    range: [
      moment().startOf('month').subtract(6, 'months'),
      moment().endOf('day'),
    ],
  },
  {
    name: 'Last 365 days',
    range: [moment().subtract(365, 'days'), moment().endOf('day')],
  },
  {
    name: 'Last year',
    range: [
      moment().startOf('years').subtract(1, 'years'),
      moment().endOf('day'),
    ],
  },
  {
    name: 'Last 3 years',
    range: [
      moment().startOf('years').subtract(3, 'years'),
      moment().endOf('day'),
    ],
  },
  {
    name: 'Last 6 years',
    range: [
      moment().startOf('years').subtract(6, 'years'),
      moment().endOf('day'),
    ],
  },
];

export const statusAllOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const statusSubmitAllOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'close_out', label: 'Close Out' },
];

export enum ACStatus {
  ALL = 'All',
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  REVIEWED = 'Reviewed',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export const ACStatusOptions = [
  { value: ACStatus.ALL, label: 'All' },
  { value: ACStatus.DRAFT, label: 'Draft' },
  { value: ACStatus.SUBMITTED, label: 'Submitted' },
  { value: ACStatus.REVIEWED, label: 'Reviewed' },
  { value: ACStatus.APPROVED, label: 'Approved' },
  { value: ACStatus.REJECTED, label: 'Rejected' },
  { value: ACStatus.CANCELLED, label: 'Cancelled' },
];

export const IARStatusOption = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'reviewed_1', label: 'Reviewed 1' },
  { value: 'reviewed_2', label: 'Reviewed 2' },
  { value: 'reviewed_3', label: 'Reviewed 3' },
  { value: 'reviewed_4', label: 'Reviewed 4' },
  { value: 'reviewed_5', label: 'Reviewed 5' },
  { value: 'approved', label: 'Approved' },
  { value: 'reassigned', label: 'Reassigned' },
  { value: 'closeout', label: 'Closed out' },
];

export const RPofFStatus = [
  { value: 'all', label: 'All' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Reviewed', label: 'Reviewed' },
  { value: 'Close out', label: 'Close out' },
  { value: 'Reassigned', label: 'Reassigned' },
];

export const VIQVesselTypeAllOptions = [
  { value: 'all', label: 'All' },
  { value: 'LNG', label: 'LNG' },
  { value: 'LPG', label: 'LPG' },
  { value: 'Petroleum', label: 'Petroleum' },
  { value: 'Chemical', label: 'Chemical' },
  { value: 'Non-Tanker', label: 'Non-Tanker' },
];

export const optionTypes = [{ value: 'VIQ', label: 'VIQ' }];

export const optionVIQVesselTypes = [
  { value: 'LNG', label: 'LNG' },
  { value: 'LPG', label: 'LPG' },
  { value: 'Petroleum', label: 'Petroleum' },
  { value: 'Chemical', label: 'Chemical' },
  { value: 'Non-Tanker', label: 'Non-Tanker' },
];

export const optionAuditWorkspaceStatus = [
  { value: 'all', label: 'All' },
  { value: 'New', label: 'New' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Final', label: 'Final' },
];

export const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const MODULE_MAIL_OPTIONS = [
  { value: 'Planning', label: 'Planning' },
  { value: 'Inspection Report', label: 'Inspection Report' },
  { value: 'Inspection Follow Up', label: 'Inspection Follow Up' },
  { value: 'Report of Finding', label: 'Report of Finding' },
];

export const scopeAllOptions = [
  { value: 'all', label: 'All' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
];

export const scopeOptions = [
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
];

export const sortOptions = [
  { value: '1', label: 'Sort A -> Z' },
  { value: '-1', label: 'Sort Z -> A' },
];

export const roleParentOptions = [
  { value: 'all', label: 'All' },
  { value: 'Admin', label: 'Admin' },
  { value: 'BPO', label: 'BPO' },
  { value: 'Auditor', label: 'Inspector' },
  { value: 'Auditee', label: 'Auditee' },
  { value: 'Members', label: 'Members' },
];

export const roleOptions = [
  { value: 'all', label: 'All' },
  { value: 'BPO', label: 'BPO' },
  { value: 'Auditor', label: 'Inspector' },
  { value: 'Auditee', label: 'Auditee' },
  { value: 'Members', label: 'Members' },
];

export const vettingAllOption = [
  { value: 'all', label: 'All' },
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

export const approverTypeAllOption = [
  { value: 'all', label: 'All' },
  { value: 'Without budget amount', label: 'Without budget amount' },
];

export const vettingOptions = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

export const lifeSpanOptions = [
  { value: 3, label: '3' },
  { value: 6, label: '6' },
  { value: 9, label: '9' },
  { value: 12, label: '12' },
  { value: 15, label: '15' },
  { value: 18, label: '18' },
  { value: 21, label: '21' },
  { value: 24, label: '24' },
  { value: 27, label: '27' },
  { value: 30, label: '30' },
  { value: 33, label: '33' },
  { value: 36, label: '36' },
];

export const portTypeAllOptions = [
  { value: 'all', label: 'All' },
  { value: 'Inland', label: 'Inland' },
  { value: 'Seaport', label: 'Seaport' },
  { value: 'Dry port', label: 'Dry port' },
  { value: 'Warm-water port', label: 'Warm-water port' },
];

export const portTypeOptions = [
  { value: 'Inland', label: 'Inland' },
  { value: 'Seaport', label: 'Seaport' },
  { value: 'Dry port', label: 'Dry port' },
  { value: 'Warm-water port', label: 'Warm-water port' },
];

export const moduleOptions = [
  { value: 'sms', label: 'SMS' },
  { value: 'due_diligence', label: 'Due Diligence' },
];
export const moduleReportTemplateOptions = [
  {
    value: ReportTemplateModule.INTERNAL_AUDIT_REPORT,
    label: 'Internal Inspection Type',
  },
];
export const PARAMS_DEFAULT = {
  page: 1,
  pageSize: 20,
};

export const PARAMS_DEFAULT_MENU = {
  page: 1,
  pageSize: 20,
  isLeftMenu: true,
  isRefreshLoading: true,
};

export const visitingTypeOptions = [
  { value: 'sailing', label: 'Sailing' },
  { value: 'port', label: 'Port' },
];
export enum SortType {
  DESC = -1,
  ASC = 1,
}
export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export enum KeyCode {
  ENTER = 13,
}
export const DCStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inActive', label: 'In-Active' },
];
export const NetWorkModeOptions = [
  { value: 'mobile_data', label: 'Mobile data' },
  { value: 'wifi', label: 'Wifi' },
  { value: 'both', label: 'Both' },
];
export const PRStatusOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'auditor_accepted', label: 'Accepted' },
  { value: 'planned_successfully', label: 'Planned successfully' },
  { value: 'rejected', label: 'Rejected' },
];

export const QUESTION_TYPE_OPTIONS = [
  { value: 'Yes/No', label: 'Yes/No' },
  { value: 'Yes/No/NA', label: 'Yes/No/NA' },
  { value: 'Radio list', label: 'Radio list' },
  { value: 'Combo list', label: 'Combo list' },
];

export const WORK_FLOW_TYPE_OPTIONS = [
  { value: 'Audit checklist', label: 'Inspection  Checklist Template' },
  { value: 'Planning request', label: 'Planning' },
  { value: 'Report finding', label: 'Report of Finding' },
  { value: 'Internal audit report', label: 'Inspection Report' },
  { value: 'CAR/CAP', label: 'CAR/CAP' },
  { value: 'Self assessment', label: 'Self Assessment' },
  { value: 'Incidents', label: 'Incidents' },
];

export const STATUS_WORK_FLOW = [
  { value: 'Published', label: 'Published' },
  { value: 'Inactive', label: 'Inactive' },
];
export const RADIO_OPTIONS = [
  { value: 'shore', label: 'Shore' },
  { value: 'ship', label: 'Ship' },
];

export enum PermissionStatus {
  CREATOR = 'creator',
  APPROVER = 'approver',
  REVIEWER = 'reviewer',
  AUDITOR = 'auditor',
}

export const ALL_VALUE = 'all';

export const ENTITY_OPTIONS = [
  { value: EntityType.Vessel, label: EntityType.Vessel },
  { value: EntityType.Office, label: EntityType.Office },
];

export const MODULE_TYPE = {
  CLASS_DISPENSATIONS: 'Class/Dispensations',
  OTHER_SMS_RECORDS: 'Other SMS Records',
  OTHER_TECHNICAL_RECORDS: 'Other Technical Records',
  PORT_STATE_CONTROL: 'Port State Control',
  SURVEY_CLASS_INFOR: 'Survey ClassInfo',
};

export const MODULE_TYPES = [
  {
    value: MODULE_TYPE.CLASS_DISPENSATIONS,
    label: 'Condition of Class/Dispensations',
  },
  { value: MODULE_TYPE.OTHER_SMS_RECORDS, label: 'Other SMS Records' },
  {
    value: MODULE_TYPE.OTHER_TECHNICAL_RECORDS,
    label: 'Other Technical Records',
  },
  { value: MODULE_TYPE.PORT_STATE_CONTROL, label: 'Port State Control' },
  { value: MODULE_TYPE.SURVEY_CLASS_INFOR, label: 'Survey/Class Info' },
];

export const SECTION_TYPES = [
  { value: MODULE_TYPE.OTHER_SMS_RECORDS, label: 'Other SMS Records' },
  {
    value: MODULE_TYPE.OTHER_TECHNICAL_RECORDS,
    label: 'Other Technical Records',
  },
];

export const CONDITION_STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
];

export const CONDITION_EVENT_TYPE_OPTIONS = [
  { value: 'COC', label: 'COC' },
  { value: 'Dispensation', label: 'Dispensation' },
];
export const ANY_EXPIRED_CERTIFICATES = [
  {
    value: 1,
    label: 'Yes',
  },
  {
    value: 0,
    label: 'No',
  },
];
export const PENDING_ACTION_OPTION = [
  {
    value: 'Yes',
    label: 'Yes',
  },
  {
    value: 'No',
    label: 'No',
  },
];

export const DRY_DOCKING_STATUS = [
  {
    value: 'Planned',
    label: 'Planned',
  },
  {
    value: 'In-Dock',
    label: 'In-Dock',
  },
  {
    value: 'Completed',
    label: 'Completed',
  },
  {
    value: 'Cancelled ',
    label: 'Canceled',
  },
];

export const ENTITY_ALL_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Vessel', label: 'Vessel' },
  { value: 'Office', label: 'Office' },
];

export const ENTITY_VESSEL = 'Vessel';
export const ENTITY_OFFICE = 'Office';

export const fieldTypeAllOptions = [
  { value: 'all', label: 'All' },
  { value: 'requiredField', label: 'Required field' },
  { value: 'optionalField', label: 'Optional field' },
  { value: 'additionalField', label: 'Additional field' },
];

export const fieldTypeOptions = [
  { value: 'requiredField', label: 'Required field' },
  { value: 'optionalField', label: 'Optional field' },
  { value: 'additionalField', label: 'Additional field' },
];

export const dataTypeAllOptions = [
  { value: 'all', label: 'All' },
  { value: 'inputText', label: 'Input text' },
  { value: 'listBox', label: 'List box' },
  { value: 'radioButton', label: 'Radio button' },
  { value: 'textEditor', label: 'Text editor' },
  { value: 'dataTable', label: 'Data table' },
  { value: 'search', label: 'Search' },
  { value: 'inputTextArea', label: 'Input text area' },
  { value: 'doubleText', label: 'Double text' },
  { value: 'calendar', label: 'Calendar' },
];

export const dataTypeOptions = [
  { value: 'inputText', label: 'Input text' },
  { value: 'listBox', label: 'List box' },
  { value: 'radioButton', label: 'Radio button' },
  { value: 'textEditor', label: 'Text editor' },
  { value: 'dataTable', label: 'Data table' },
  { value: 'search', label: 'Search' },
  { value: 'inputTextArea', label: 'Input text area' },
  { value: 'doubleText', label: 'Double text' },
  { value: 'calendar', label: 'Calendar' },
];

export const chartererTypeOptions = [
  { value: 'Time', label: 'Time' },
  { value: 'Voyage', label: 'Voyage' },
  { value: 'Others', label: 'Others' },
];

export const FILTER_INSPECTION_CHECKLIST = [
  {
    label: 'Yet to start',
    value: 'Yet To Start',
  },
  {
    label: 'In progress',
    value: 'In-progress',
  },
  {
    label: 'Completed',
    value: 'Completed',
  },
];

export const FILTER_REPORT_OF_FINDINGS = [
  {
    label: 'Draft',
    value: 'Draft',
  },
  {
    label: 'Submitted',
    value: 'Submitted',
  },
  {
    label: 'Reviewed',
    value: 'Reviewed',
  },
  {
    label: 'Close out',
    value: 'Close out',
  },
];

export const FILTER_INSPECTION_REPORT = [
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Submitted',
    value: 'submitted',
  },
  {
    label: 'Reviewed',
    value: 'reviewed',
  },
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Close out',
    value: 'closeout',
  },
];
