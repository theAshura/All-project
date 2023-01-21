export const columnsDefinition = (
  isMultiColumnFilter: boolean,
  t: any,
  handleClickHighLightTextModal: (data, valueStrArray?: string) => void,
  colType?: string,
) => {
  switch (colType) {
    case 'safetyScore':
      return [
        {
          field: 'vesselName',
          headerName: t('vesselName'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: t('imo'),
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
          headerName: t('vesselType'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'safetyScore',
          headerName: t('txtsafetyScore'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: t('businessDivision'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'ghgRating':
      return [
        {
          field: 'vesselName',
          headerName: t('vesselName'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: t('imo'),
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
          headerName: t('vesselType'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'ghgRating',
          headerName: t('ghgRating'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: t('businessDivision'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    case 'vesselUnderInspection':
      return [
        {
          field: 'vesselName',
          headerName: t('vesselName'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: t('imo'),
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
          headerName: t('vesselType'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'ghgRating',
          headerName: t('ghgRating'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: t('businessDivision'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'planRef',
          headerName: t('planRef'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRendererFramework: ({ data }) =>
            data?.planRef?.map((item) => (
              <div
                key={item}
                className="cell-high-light"
                onClick={() => handleClickHighLightTextModal(data, 'planRef')}
              >
                {item}
              </div>
            )),
          autoGroupColumnDef: {
            headerName: 'planRef',
            field: 'planRef',
            width: 250,
            cellRenderer: 'agGroupCellRenderer',
          },
        },
      ];
    case 'validity':
      return [
        {
          field: 'vesselName',
          headerName: t('vesselName'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: t('imo'),
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
          headerName: t('vesselType'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: t('businessDivision'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'validity',
          headerName: t('remainingValidity'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
    default:
      return [
        {
          field: 'vesselName',
          headerName: t('vesselName'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'imo',
          headerName: t('imo'),
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
          headerName: t('vesselType'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'businessDivision',
          headerName: t('businessDivision'),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];
  }
};
