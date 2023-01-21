import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { ButtonType } from 'components/ui/button/Button';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import cx from 'classnames';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { getListAppTypePropertyActions } from 'store/app-type-property/app-type-property.action';

import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { APP_TYPE_PROPERTY_LIST_MODULE_FIELD } from 'constants/dynamic/appTypeProperty.const';
import styles from '../../list-common.module.scss';

const AppTypePropertyContainer = () => {
  const dispatch = useDispatch();

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const { loading, listAppTypeProperty, params } = useSelector(
    (state) => state.appTypeProperty,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
    modulePage: ModulePage.List,
  });

  const viewDetail = useCallback((id?: string, isNewTab?: boolean) => {
    if (isNewTab) {
      const win = window.open(
        AppRouteConst.getAppTypePropertyById(id),
        '_blank',
      );
      win.focus();
    } else {
      history.push(`${AppRouteConst.getAppTypePropertyById(id)}`);
    }
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(
      `${AppRouteConst.getAppTypePropertyById(id)}${CommonQuery.EDIT}`,
    );
  }, []);

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListAppTypePropertyActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const dataTable = useMemo(() => {
    if (!listAppTypeProperty?.data) {
      return [];
    }
    return listAppTypeProperty?.data?.map((data) => ({
      id: data.id,
      appCode: data?.appCode || '',
      appName: data?.appName || '',
      eligibleSyncLocation: data?.eligibleSyncLocation || '',
      dataLifeSpan: data?.dataLifeSpan || '',
      fileValidity: data?.fileValidity || '',
      autoDeactive: data?.autoDeactive || '',
      autoPurge: data?.autoPurge || '',
      networkMode: data?.networkMode || '',
      downloadLimit: data?.downloadLimit || '',
      USBPath: data?.USBPath || '',
      isAutoFlush: data?.isAutoFlush ? 'Yes' : 'No',
      enableVesselFieldAudit: data?.enableVesselFieldAudit ? 'Yes' : 'No',
      androidVersion: data?.androidVersion || '',
      iOSVersion: data?.iOSVersion || '',
      windowsVersion: data?.windowsVersion || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listAppTypeProperty?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.APP_TYPE_PROPERTY,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
          ];

          if (userInfo?.mainCompanyId === data?.companyId) {
            actions.push({
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.APP_TYPE_PROPERTY,
              action: ActionTypeEnum.UPDATE,
            });
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
        field: 'appCode',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['App code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'appName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['App name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eligibleSyncLocation',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Sync location'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dataLifeSpan',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Data life span'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fileValidity',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['File validity'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'autoDeactive',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Auto de-active'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'autoPurge',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Auto purge'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'networkMode',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD.Network,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'downloadLimit',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Download limit'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'USBPath',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['USB path'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'isAutoFlush',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Auto flush'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'enableVesselFieldAudit',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Enable vessel field inspection'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'androidVersion',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Android app version'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'iOSVersion',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['IOS app version'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'windowsVersion',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Windows app version'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_LIST_MODULE_FIELD['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo?.mainCompanyId,
      viewDetail,
      editDetail,
    ],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.APP_TYPE_PROPERTY}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
        )}
      />

      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.appTypeProperty}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default AppTypePropertyContainer;
