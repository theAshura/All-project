import {
  IDynamicLabels,
  IModuleDynamicLabel,
} from 'models/api/dynamic/dynamic.model';

export interface DynamicStoreModel {
  loading: boolean;
  listDynamicLabels: IDynamicLabels[];
  listModuleDynamicLabels: IModuleDynamicLabel[];
}
