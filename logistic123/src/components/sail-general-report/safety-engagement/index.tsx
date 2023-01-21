import cx from 'classnames';
import { useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { AppRouteConst } from 'constants/route.const';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Action, CommonApiParam, HistoryItem } from 'models/common.model';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import images from 'assets/images/images';
import { dateStringComparator } from 'helpers/utils.helper';
import { ButtonType } from 'components/ui/button/Button';
import { getHistoryApiRequest } from 'api/planning-and-request.api';
import { formatDateLocalNoTime } from 'helpers/date.helper';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import styles from './list.module.scss';

const ListSafetyEngagement = () => {
  const { vesselDetail } = useSelector((state) => state.vessel);
  const [dataHistory, setDataHistory] = useState<HistoryItem[]>([]);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const metadata = useVesselMetadata(styles.metadata);
  const getList = useCallback(
    (paramData?: CommonApiParam) => {
      const dataParam: any = {
        vesselId: vesselDetail?.id,
        entityType: 'Vessel',
        isSafetyEngagementType: true,
        pageSize: -1,
      };
      setLoading(true);
      getHistoryApiRequest(dataParam)
        .then((res) => {
          setLoading(false);
          setDataHistory(res.data?.data || []);
          if (paramData?.handleSuccess) {
            paramData?.handleSuccess();
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    },
    [vesselDetail?.id],
  );

  useEffect(() => {
    if (vesselDetail?.id) {
      getList();
    }
  }, [getList, vesselDetail?.id]);

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
          fromDate: item?.plannedFromDate
            ? formatDateLocalNoTime(item?.plannedFromDate)
            : '',
          toDate: item?.plannedToDate
            ? formatDateLocalNoTime(item?.plannedToDate)
            : '',
          place: item?.toPort?.name || '',
          type: item?.workingType || '',
          globalStatus: item?.globalStatus,
          inspectorName:
            item?.auditors?.map((i) => i.username).join(', ') || '-',
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
        headerName: 'Action',
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
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
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
        headerName: 'Inspection Ref.ID',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectorName',
        headerName: 'Inspector Name',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'globalStatus',
        headerName: 'Global Status',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fromDate',
        headerName: 'From Date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
        comparator: dateStringComparator,
      },
      {
        field: 'toDate',
        headerName: 'To Date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'place',
        headerName: 'Place',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: 'Type',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'noOfFindings',
        headerName: 'Total no of findings',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'noOfOpenFindings',
        headerName: 'Total no of open findings',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [isMultiColumnFilter, viewDetail],
  );

  return (
    <div className={styles.wrapper}>
      {metadata}
      <div className={styles.container}>
        <div className={styles.wrapTable}>
          <AGGridModule
            loading={loading}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker
            columnDefs={columnDefs}
            dataFilter={null}
            moduleTemplate={MODULE_TEMPLATE.sailSafetyEngagement}
            fileName="Safety Engagement"
            title="Safety Engagement"
            dataTable={dataSource}
            height="calc(100vh - 240px)"
            view={(params?: CommonApiParam) => {
              const win = window.open(
                AppRouteConst.getPlanningAndRequestById(params.id),
                '_blank',
              );
              win.focus();
              return true;
            }}
            getList={() => vesselDetail?.id && getList()}
          />
        </div>
      </div>
    </div>
  );
};

export default ListSafetyEngagement;
