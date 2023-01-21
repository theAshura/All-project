import {
  AppTypeProperty,
  ListAppTypePropertyResponse,
} from 'models/api/app-type-property/app-type-property.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface AppTypePropertyState {
  loading: boolean;
  disable: boolean;
  listAppTypeProperty: ListAppTypePropertyResponse;
  appTypePropertyDetail: AppTypeProperty;
  errorList: ErrorField[];
  params: CommonApiParam;
}
