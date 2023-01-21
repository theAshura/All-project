import { getHistoryApiRequest } from 'api/planning-and-request.api';
import images from 'assets/images/images';
import cx from 'classnames';
import { AppRouteConst } from 'constants/route.const';
import { CommonApiParam, HistoryItem, Action } from 'models/common.model';
import moment from 'moment';
import { FC, useEffect, useMemo, useState, useCallback } from 'react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { dateStringComparator } from 'helpers/utils.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { useDispatch } from 'react-redux';
import styles from './table-history.module.scss';

export interface InspectionHistoryProps {
  vesselId: string;
  departmentId: string;
  title?: string;
  entityType?: string;
  loading?: boolean;
  featurePage?: Features;
  subFeaturePage?: SubFeatures;
  moduleTemplate?: string;
  pageSizeDefault?: number;
  aggridId?: string;
  dynamicLabels?: IDynamicLabel;
}

const InspectionHistory: FC<InspectionHistoryProps> = ({
  vesselId,
  departmentId,
  entityType,
  title,
  loading,
  featurePage,
  subFeaturePage,
  pageSizeDefault,
  moduleTemplate,
  aggridId,
  dynamicLabels,
}) => {
  const [dataHistory, setDataHistory] = useState<HistoryItem[]>([]);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let dataParam: CommonApiParam = {};
    if (vesselId) {
      dataParam = { vesselId };
    }
    if (departmentId) {
      dataParam = { departmentId };
    }
    if (entityType) {
      dataParam.entityType = entityType;
    }
    if (entityType || departmentId || vesselId) {
      getHistoryApiRequest(dataParam)
        .then((res) => {
          setDataHistory(res.data?.data || []);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselId, departmentId]);

  const checkWorkflow = useCallback(
    (item, index) => {
      const actions: Action[] = [
        {
          img: images.icons.table.icNewTab,
          function: () => {
            const win = window.open(
              AppRouteConst.getPlanningAndRequestById(item?.id),
              '_blank',
            );
            win.focus();
          },
          feature: featurePage,
          subFeature: subFeaturePage,
          action: '',
          buttonType: ButtonType.Green,
          cssClass: 'icon-white',
        },
      ];
      return actions;
    },
    [featurePage, subFeaturePage],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data, rowIndex } = params;
          let actions = checkWorkflow(data, rowIndex);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'inspectionRefId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Inspection Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fromDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['From date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },

      {
        field: 'toDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['To date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'place',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Place,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Type,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'noOfFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Total no of findings'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'noOfOpenFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Total no of open findings'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, checkWorkflow],
  );
  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: moduleTemplate,
      }),
    );
  }, [dispatch, moduleTemplate]);

  const dataTable = useMemo(
    () =>
      dataHistory.map((item, index) => {
        const noOfFindings =
          item?.internalAuditReport?.reportFindingItems?.length || 0;

        const noOfOpenFindings =
          item?.internalAuditReport?.reportFindingItems?.filter(
            (i) => i.findingStatus === 'Opened',
          )?.length || 0;
        return {
          inspectionRefId: item?.refId || '',
          inspectionType:
            item?.auditTypes?.map((i) => i.name)?.join(', ') || '',
          fromDate: moment(item?.plannedFromDate).format('DD/MM/YYYY'),
          toDate: moment(item?.plannedToDate).format('DD/MM/YYYY'),
          place: item?.toPort?.name,
          type: item?.workingType,
          noOfFindings,
          noOfOpenFindings,
          id: item?.id,
          key: item?.id,
        };
      }) || [],
    [dataHistory],
  );

  return (
    <div
      className={cx(
        styles.container,
        'ant-table-content',
        styles.wrapperContainer,
      )}
    >
      {title && (
        <div className={cx(styles.header)}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS?.[title] || title,
          )}
        </div>
      )}
      <AGGridModule
        loading={loading}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={moduleTemplate}
        fileName={renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS?.['Inspection history'],
        )}
        dataTable={dataTable}
        height="275px"
        getList={getList}
        pageSizeDefault={pageSizeDefault}
        classNameHeader={styles.header}
        aggridId={aggridId}
      />
    </div>
  );
};

export default InspectionHistory;
