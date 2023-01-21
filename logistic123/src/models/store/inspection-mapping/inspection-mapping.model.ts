import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetInspectionMappingsResponse,
  GetNatureOfFindingsResponse,
  InspectionMappingDetailResponse,
} from '../../api/inspection-mapping/inspection-mapping.model';

export interface InspectionMappingStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listInspectionMappings: GetInspectionMappingsResponse;
  listNatureOfFindings: GetNatureOfFindingsResponse;
  inspectionMappingDetail: InspectionMappingDetailResponse;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
