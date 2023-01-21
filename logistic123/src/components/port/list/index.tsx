import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePortActions, getListPortActions } from 'store/port/port.action';

import { CommonQuery } from 'constants/common.const';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { PORT_FIELDS_LIST } from 'constants/dynamic/port.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './list.module.scss';

export default function PortManagementContainer() {
  // state
  const dispatch = useDispatch();
  const { loading, listPort, params } = useSelector((state) => state.port);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const handleGetList = (params?: CommonApiParam) => {
    const newParams = handleFilterParams({ ...params, pageSize: -1 });
    const { createdAtFrom, createdAtTo, ...other } = newParams;
    dispatch(getListPortActions.request(other));
  };
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonPortmaster,
    modulePage: ModulePage.List,
  });
  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getPortById(id));
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getPortById(id)}${CommonQuery.EDIT}`);
  }, []);

  const handleDeletePort = (id: string) => {
    dispatch(
      deletePortActions.request({
        id,
        getListPort: () => {
          handleGetList({
            isRefreshLoading: false,
          });
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id?: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(dynamicLabels, PORT_FIELDS_LIST['Delete?']),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        PORT_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),
      onPressButtonRight: () => handleDeletePort(id),
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const dataTable = useMemo(() => {
    if (!listPort?.data) {
      return [];
    }
    return listPort?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
      country: data?.country || '',
      portType: data?.portType || '',
      isBunkerPort: data?.isBunkerPort ? 'Yes' : 'No',
      isEuroFlag: data?.isEuroFlag ? 'Yes' : 'No',
      latitude: data?.latitude || '',
      longitude: data?.longitude || '',
      gmtOffset: data?.gmtOffset || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUserUsername: data?.companyId
        ? data?.createdUser?.username
        : renderDynamicLabel(dynamicLabels, PORT_FIELDS_LIST.System),
      updatedAt: data?.updatedUser ? formatDateTime(data?.updatedAt) : '',
      updatedUserUsername: data?.updatedUser?.username || '',
      status: data?.status || '',
      companyName: data?.company?.name || '',
    }));
  }, [dynamicLabels, listPort?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(dynamicLabels, PORT_FIELDS_LIST.Action),
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
              subFeature: SubFeatures.PORT_MASTER,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),

              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.PORT_MASTER,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.PORT_MASTER,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];

          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Port code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Port name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: renderDynamicLabel(dynamicLabels, PORT_FIELDS_LIST.Country),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'portType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Port type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'isBunkerPort',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Bunkering port'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'isEuroFlag',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Europe flag'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'latitude',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST.Latitude,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(dynamicLabels, PORT_FIELDS_LIST.Status),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'longitude',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST.Longitude,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'gmtOffset',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['GMT offset'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdUserUsername',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedUserUsername',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, viewDetail, editDetail, handleDelete],
  );
  // render
  return (
    <div className={styles.portManagement}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PORT}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonPortmaster,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.PORT_MASTER,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => history.push(AppRouteConst.PORT_CREATE)}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  PORT_FIELDS_LIST['Create New'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>
      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.port}
        fileName="Port"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={handleGetList}
        classNameHeader={styles.header}
      />
    </div>
  );
}
