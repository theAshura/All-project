import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

export const ColumnsDefinition = (
  dynamicLabels: IDynamicLabel,
  isMultiColumnFilter: boolean,
  handleClickHighLightTextModal: (data, valueStrArray?: string) => void,
  colType?: string,
) => {
  switch (colType) {
    case 'safetyScore':
      return [
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS.IMO,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() => handleClickHighLightTextModal(data, 'imo')}
            >
              {data?.imo}
            </div>
          ),
        },
        {
          field: 'vesselType',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'safetyScore',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Safety score'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Business division'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'ghgRating':
      return [
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS.IMO,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() => handleClickHighLightTextModal(data, 'imo')}
            >
              {data?.imo}
            </div>
          ),
        },
        {
          field: 'vesselType',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'ghgRating',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['GHG Rating'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Business division'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'vesselUnderInspection':
      return [
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS.IMO,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light under-inspection"
              onClick={() => handleClickHighLightTextModal(data, 'imo')}
            >
              {data?.imo}
            </div>
          ),
        },
        {
          field: 'vesselType',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Business division'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'planRef',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Plan Ref.ID'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          wrapText: true,
          autoHeight: true,
          cellRendererFramework: ({ data }) => (
            <div>
              {data?.planPopup?.map((item) => (
                <div
                  key={item?.refId}
                  className="cell-high-light"
                  onClick={() => handleClickHighLightTextModal(item, 'planRef')}
                >
                  {item.refId}
                </div>
              ))}
            </div>
          ),
        },
      ];
    case 'validity':
      return [
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS.IMO,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() => handleClickHighLightTextModal(data, 'imo')}
            >
              {data?.imo}
            </div>
          ),
        },
        {
          field: 'vesselType',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Business division'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'validity',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS[
              'Vessels with last inspection validity < 90 days'
            ],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    default:
      return [
        {
          field: 'vesselName',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS.IMO,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) => (
            <div
              className="cell-high-light"
              onClick={() => handleClickHighLightTextModal(data, 'imo')}
            >
              {data?.imo || ''}
            </div>
          ),
        },
        {
          field: 'vesselType',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Business division'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
  }
};
