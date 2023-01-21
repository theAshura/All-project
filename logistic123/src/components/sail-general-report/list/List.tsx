import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import commonStyles from 'components/list-common.module.scss';
import { ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleName } from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { Vessel } from 'models/api/vessel/vessel.model';
import styles from './list.module.scss';

const ListSailGeneralReport = () => {
  const { t } = useTranslation([I18nNamespace.VESSEL, I18nNamespace.COMMON]);
  const dispatch = useDispatch();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { loading, listVesselResponse, params } = useSelector(
    (state) => state.vessel,
  );

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const viewDetail = useCallback((id?: string, isNewTab?: boolean) => {
    if (isNewTab) {
      const win = window.open(
        AppRouteConst.getSailGeneralReportById(id),
        '_blank',
      );
      win.focus();
    } else {
      history.push(`${AppRouteConst.getSailGeneralReportById(id)}`);
    }
  }, []);

  const getList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtTo, createdAtFrom, page } = handleFilterParams(params);
      dispatch(
        getListVesselActions.request({
          createdAtTo,
          createdAtFrom,
          page,
          pageSize: -1,
          status: 'active',
          moduleName: ModuleName.QA,
        }),
      );
    },
    [dispatch],
  );

  const checkWorkflow = useCallback(
    (item: Vessel): Action[] => {
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => viewDetail(item?.id, true),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          buttonType: ButtonType.Green,
        },
      ];
      return actions;
    },
    [viewDetail],
  );

  const dataTable = useMemo(() => {
    if (!listVesselResponse?.data) {
      return [];
    }
    return listVesselResponse?.data?.map((item) => ({
      id: item?.id,
      code: item?.code || DATA_SPACE,
      name: item?.name || DATA_SPACE,
      company: item?.company?.name || DATA_SPACE,
      realOwnerName: item?.owners[0]?.username || DATA_SPACE,
      fleetName: item.fleetName || DATA_SPACE,
      status: item?.status || DATA_SPACE,
    }));
  }, [listVesselResponse?.data]);

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
          let actions = checkWorkflow(data);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                commonStyles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: t('txVesselCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('txVesselName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'realOwnerName',
        headerName: t('txOwnerName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fleetName',
        headerName: t('txFleetName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'status',
        headerName: t('txStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
  );

  return (
    <div className={commonStyles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.SAIL_GENERAL_REPORT}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceSailingReportSailingGeneralReport,
        )}
      />
      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.sailGeneralReport}
        fileName="SAIL Reporting_SAIL General Report"
        dataTable={dataTable}
        height="calc(100vh - 188px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={getList}
        classNameHeader={styles.header}
      />
    </div>
  );
};

export default ListSailGeneralReport;
