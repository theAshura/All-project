import {
  GetPlansAndDrawingsResponse,
  PlansAndDrawing,
} from 'models/api/plans-and-drawings/plans-and-drawings.model';
import { CommonApiParam, ErrorField } from 'models/common.model';

export interface PlanningAndDrawingsStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listPlanningAndDrawings: GetPlansAndDrawingsResponse;
  planningAndDrawingsDetail: PlansAndDrawing;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
