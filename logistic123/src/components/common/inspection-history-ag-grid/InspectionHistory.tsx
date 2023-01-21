import { getHistoryApiRequest } from 'api/planning-and-request.api';
import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import NoDataImg from 'components/common/no-data/NoData';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { dateStringComparator } from 'helpers/utils.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Action, CommonApiParam, HistoryItem } from 'models/common.model';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListTemplateActions } from 'store/template/template.action';
import styles from './table-history.module.scss';

export interface InspectionHistoryProps {
  vesselId: string;
  departmentId: string;
  title?: string;
  entityType?: string;
  featurePage: Features;
  subFeaturePage: SubFeatures;
  dynamicLabels?: IDynamicLabel;
}

const InspectionHistory: FC<InspectionHistoryProps> = ({
  vesselId,
  departmentId,
  entityType,
  title,
  featurePage,
  subFeaturePage,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();

  const [dataHistory, setDataHistory] = useState<HistoryItem[]>([]);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const getList = useCallback(
    (paramData?: CommonApiParam) => {
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
        setLoading(true);
        getHistoryApiRequest(dataParam)
          .then((res) => {
            setLoading(false);

            setDataHistory(res.data?.data || []);
            if (paramData?.handleSuccess) {
              paramData?.handleSuccess();
            } else {
              dispatch(
                getListTemplateActions.request({
                  content: MODULE_TEMPLATE.inspectionHistorySummaryIWTemplate,
                }),
              );
            }
          })
          .catch((e) => {
            setLoading(false);
            // eslint-disable-next-line no-console
            console.log(e);
          });
      }
    },
    [vesselId, departmentId, entityType, dispatch],
  );

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
      getList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselId, departmentId]);

  const dataSource = useMemo(
    () =>
      dataHistory?.map((item) => {
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
          fromDate: moment(item?.plannedFromDate).format('DD/MM/YYYY') || '',
          toDate: moment(item?.plannedToDate).format('DD/MM/YYYY') || '',
          place: item?.toPort?.name || '',
          type: item?.workingType || '',
          noOfFindings,
          noOfOpenFindings,
          id: item?.id,
          key: item?.id,
        };
      }) || [],
    [dataHistory],
  );

  const viewDetail = useCallback((id?: string) => {
    const win = window.open(
      AppRouteConst.getPlanningAndRequestById(id),
      '_blank',
    );
    win.focus();
    return true;
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Action,
        ),
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          let actions: Action[] = [
            {
              img: images.icons.table.icNewTab,
              function: () => data && viewDetail(data?.id),
              feature: featurePage,
              subFeature: subFeaturePage,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Green,
              cssClass: 'me-1',
            },
          ];
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
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Inspection Ref.ID'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fromDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['From date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
        comparator: dateStringComparator,
      },
      {
        field: 'toDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['To date'],
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
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Place,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Type,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'noOfFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Total no of findings'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'noOfOpenFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Total no of open findings'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      featurePage,
      isMultiColumnFilter,
      subFeaturePage,
      viewDetail,
    ],
  );

  return (
    <div className={cx({ [styles.container]: !!dataSource?.length })}>
      {title && <div className={cx(styles.header)}>{title}</div>}
      {dataSource?.length ? (
        <AGGridModule
          loading={loading}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          hasRangePicker={false}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={MODULE_TEMPLATE.inspectionHistorySummaryIWTemplate}
          fileName="Inspection history"
          dataTable={dataSource}
          height="450px"
          view={(params?: CommonApiParam) => {
            const win = window.open(
              AppRouteConst.getPlanningAndRequestById(params.id),
              '_blank',
            );
            win.focus();
            return true;
          }}
          getList={getList}
        />
      ) : (
        <NoDataImg />
      )}
    </div>
  );
};

export default InspectionHistory;
