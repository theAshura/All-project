import { HOME_PAGE_DYNAMIC_LABEL } from 'constants/dynamic/home-page.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

export const renderAgingopenRecordsColumn = (dynamicLabels: IDynamicLabel) => [
  {
    title: renderDynamicLabel(
      dynamicLabels,
      HOME_PAGE_DYNAMIC_LABEL['Life cycle & Workflow stages'],
    ),
    dataIndex: 'lifecycleWorkFlow',
    width: 100,
    isSort: true,
  },
  {
    title: renderDynamicLabel(
      dynamicLabels,
      HOME_PAGE_DYNAMIC_LABEL['< 15 days'],
    ),
    dataIndex: 'below15days',
    isSort: true,
    width: 85,
  },
  {
    title: renderDynamicLabel(
      dynamicLabels,
      HOME_PAGE_DYNAMIC_LABEL['15 to 30 days'],
    ),
    dataIndex: 'to30days',
    isSort: true,
    width: 85,
  },
  {
    title: renderDynamicLabel(
      dynamicLabels,
      HOME_PAGE_DYNAMIC_LABEL['31 to 60 days'],
    ),
    dataIndex: 'to60days',
    isSort: true,
    width: 85,
  },
  {
    title: renderDynamicLabel(
      dynamicLabels,
      HOME_PAGE_DYNAMIC_LABEL['> 60 days'],
    ),
    dataIndex: 'over60days',
    isSort: true,
    width: 85,
  },
];
