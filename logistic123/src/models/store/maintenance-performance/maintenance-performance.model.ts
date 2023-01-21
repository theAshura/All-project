import {
  GetDetailMaintenancePerformance,
  GetMaintenancePerformanceResponse,
} from 'models/api/maintenance-performance/maintenance-performance.model';
import {
  ListTemplate,
  TemplateDetail,
} from 'models/api/template/template.model';
import {
  CommonApiParam,
  CommonErrorResponse,
  ErrorField,
} from 'models/common.model';

export interface MaintenanceTechnicalStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  detailMaintenancePerformance: GetDetailMaintenancePerformance;
  listMaintenancePerformance: GetMaintenancePerformanceResponse;
  errorLists: CommonErrorResponse;
  dataFilter: CommonApiParam;
  // TODO: Template
  content: string;
  errorListTemplate: ErrorField[];
  paramTemplate: CommonApiParam;
  listTemplate: ListTemplate;
  templateDetail: TemplateDetail;
}
