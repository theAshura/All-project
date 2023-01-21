import {
  IDynamicLabels,
  IModuleDynamicLabel,
} from 'models/api/dynamic/dynamic.model';
import { CommonApiParam } from 'models/common.model';
import { createAsyncAction } from 'typesafe-actions';

export const getListDynamicLabelsActions = createAsyncAction(
  `@dynamic/GET_LIST_DYNAMIC_LABELS_ACTIONS`,
  `@dynamic/GET_LIST_DYNAMIC_LABELS_ACTIONS_SUCCESS`,
  `@dynamic/GET_LIST_DYNAMIC_LABELS_ACTIONS_FAIL`,
)<
  CommonApiParam,
  {
    listDynamicLabels: IDynamicLabels[];
    listModuleDynamicLabels: IModuleDynamicLabel[];
  },
  void
>();
