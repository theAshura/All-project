import images from 'assets/images/images';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
// import PermissionCheck from 'hoc/withPermissionCheck';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { FORMAT_DATE_TIME_SECOND } from 'constants/common.const';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { formatDateWithTimeUTC } from 'helpers/date.helper';
import history from 'helpers/history.helper';
import { dateStringComparator } from 'helpers/utils.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { getListVoyageInfoActions } from 'pages/vessel-screening/store/voyageInfo-store/voyage-info.action';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppRouteConst } from 'constants/route.const';
import styles from './voyage-info.module.scss';

const VoyageInfoContainer = () => {
  const { t } = useTranslation([I18nNamespace.VOYAGE, I18nNamespace.COMMON]);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { loading, listVoyageInfo, params } = useSelector(
    (state) => state.voyageInfo,
  );
  const { vesselScreeningDetail } = useSelector(
    (store) => store.vesselScreening,
  );

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListVoyageInfoActions.request({
        ...newParams,
        vesselCode: vesselScreeningDetail?.vessel?.code,
        pageSize: -1,
        page: 1,
        isLeftMenu: false,
      }),
    );
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const viewDetail = useCallback(
    (vesselId?: string, voyageInfoId?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          AppRouteConst.getVoyageInfoById(vesselId, voyageInfoId),
          '_blank',
        );
        win.focus();
      } else {
        history.push(AppRouteConst.getVoyageInfoById(vesselId, voyageInfoId));
      }
    },
    [],
  );

  const dataTable = useMemo(() => {
    if (!listVoyageInfo?.data) {
      return [];
    }
    return listVoyageInfo?.data?.map((data) => ({
      id: data?.id,
      voyageStatus: data?.voyageStatus,
      voyageNo: data?.voyageNo || '',
      oprType: data?.oprType || '',
      opsCoordinator: data?.opsCoordinator || '',
      companyCode: data?.company?.code || '',
      loadDate: formatDateWithTimeUTC(data?.loadDate) || '',
      totalLoadCargoVol: data?.totalLoadCargoVol || '',
      vesselType: data?.vessel?.vesselType?.name || '',
      cargoListNo: data?.cargoNo || '',
      firstLoadPort: data?.firstLoadPort || '',
      lastDischargePort: data?.lastDischargePort || '',
      cargoGradesList: data?.cargoGradesList || '',
      cargoCounterPartyShortName: data?.cargoCounterpartyShortnames || '',
      lastUpdateGmt:
        formatDateWithTimeUTC(data?.lastUpdateGMT, FORMAT_DATE_TIME_SECOND) ||
        '-',
      completeDateGmt: formatDateWithTimeUTC(data?.completeDateGMT) || '-',
      commenceDateGmt: formatDateWithTimeUTC(data?.commenceDateGMT) || '-',
      vesselCode: data?.vessel?.code || '',
      commenceDateLocal: formatDateWithTimeUTC(data?.commenceDateLocal) || '-',
      completeDateLocal: formatDateWithTimeUTC(data?.completeDateLocal) || '-',
    }));
  }, [listVoyageInfo?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('buttons.txAction'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(id, data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.table.icNewTab,
              function: () => data && viewDetail(id, data?.id, true),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Green,
            },
          ];
          if (!data) {
            actions = [];
          }
          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'voyageStatus',
        headerName: t('txVoyageStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'voyageNo',
        headerName: t('txVoyageNo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'oprType',
        headerName: t('txOprType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'opsCoordinator',
        headerName: t('txOpsCoordinator'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyCode',
        headerName: t('txCompanyCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'loadDate',
        headerName: t('txLoadDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },

      {
        field: 'totalLoadCargoVol',
        headerName: t('txTotalLoadCargoVol'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: t('txVesselType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'cargoListNo',
        headerName: t('txCargoListNo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'firstLoadPort',
        headerName: t('txFirstLoadPort'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'lastDischargePort',
        headerName: t('txLastDischargePort'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'cargoGradesList',
        headerName: t('txCargoGradesList'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'cargoCounterPartyShortName',
        headerName: t('txCargoCounterPartyShortName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'lastUpdateGmt',
        headerName: t('txLastUpdateGmt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'completeDateGmt',
        headerName: t('txCompleteDateGmt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'commenceDateGmt',
        headerName: t('txCommenceDateGmt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'vesselCode',
        headerName: t('txVesselCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'commenceDateLocal',
        headerName: t('txCommenceDateLocal'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'completeDateLocal',
        headerName: t('txCompleteDateLocal'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
    ],
    [t, isMultiColumnFilter, viewDetail, id],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <p>Voyage info</p>
      </div>
      {vesselScreeningDetail?.vessel?.code && (
        <AGGridModule
          loading={loading}
          params={params}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          hasRangePicker={false}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={MODULE_TEMPLATE.vessel}
          fileName="Vessel"
          dataTable={dataTable}
          height="calc(100vh - 370px)"
          getList={handleGetList}
          classNameHeader={styles.header}
        />
      )}
    </div>
  );
};

export default VoyageInfoContainer;
