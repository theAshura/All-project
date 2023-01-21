import images from 'assets/images/images';
import ModalExport from 'components/role/modal/ModalExport';
import { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListDeviceControlActions,
  updateDeviceControlActions,
} from 'store/device-control/device-control.action';
import { DeviceControlStatus } from 'constants/common.const';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
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
import { DEVICE_CONTROL_DYNAMIC_LIST_FIELDS } from 'constants/dynamic/deviceControl.const';
import styles from '../../list-common.module.scss';

export default function DeviceControlContainer() {
  const dispatch = useDispatch();
  const { listDeviceControl, params, loading } = useSelector(
    (state) => state.deviceControl,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionDeviceControl,
    modulePage: ModulePage.List,
  });

  const [modalExport, setModalExport] = useState(false);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListDeviceControlActions.request({
          ...newParams,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const dataTable = useMemo(() => {
    if (!listDeviceControl?.data) {
      return [];
    }
    return listDeviceControl?.data?.map((data) => ({
      id: data?.id,
      deviceId: data?.deviceId || '',
      deviceType: data?.deviceType || '',
      version: data?.version || '',
      deviceModel: data?.deviceModel || '',
      deviceStatus: data?.deviceStatus || '',
      status: data?.status || '',
      lastSyncDeviceTime:
        formatDateLocalWithTime(data?.lastAsyncDeviceTime) || '',
      lastSyncServerTime:
        formatDateLocalWithTime(data?.lastAsyncServerTime) || '',
      companyName: data?.company?.name || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listDeviceControl?.data]);

  const handleChangeStatusDevice = useCallback(
    (value: DeviceControlStatus, id) => {
      dispatch(
        updateDeviceControlActions.request({
          id,
          body: {
            status: value,
          },
          afterUpdate: () => {
            handleGetList();
          },
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const tooltip =
            data?.status === DeviceControlStatus.ACTIVATE
              ? DeviceControlStatus.DE_ACTIVATE
              : DeviceControlStatus.ACTIVATE;
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              onchange: (value) => {
                showConfirmBase({
                  isDelete: false,
                  txTitle: renderDynamicLabel(
                    dynamicFields,
                    DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Confirmation?'],
                  ),
                  txMsg: renderDynamicLabel(
                    dynamicFields,
                    DEVICE_CONTROL_DYNAMIC_LIST_FIELDS[
                      'Are you sure you want to proceed with this action?'
                    ],
                  ),
                  txButtonLeft: renderDynamicLabel(
                    dynamicFields,
                    DEVICE_CONTROL_DYNAMIC_LIST_FIELDS.Cancel,
                  ),
                  txButtonRight: renderDynamicLabel(
                    dynamicFields,
                    DEVICE_CONTROL_DYNAMIC_LIST_FIELDS.Confirm,
                  ),
                  onPressButtonRight: () => {
                    handleChangeStatusDevice(
                      value
                        ? DeviceControlStatus.ACTIVATE
                        : DeviceControlStatus.DE_ACTIVATE,
                      data?.id,
                    );
                  },
                });
              },
              valueSwitch: data?.status === DeviceControlStatus.ACTIVATE,
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.DEVICE_CONTROL,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              classNameToggleSwitch: 'pt-2',
              isSwitch: true,
              tooltipTitle:
                data?.status !== DeviceControlStatus.PURGE ? tooltip : '',
              cssClass: 'me-1',
            },
          ];
          if (data?.status !== DeviceControlStatus.PURGE) {
            actions = [
              ...actions,
              {
                img: images.icons.icRemove,
                function: () => {
                  showConfirmBase({
                    isDelete: false,
                    txTitle: renderDynamicLabel(
                      dynamicFields,
                      DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Confirmation?'],
                    ),
                    txMsg: renderDynamicLabel(
                      dynamicFields,
                      DEVICE_CONTROL_DYNAMIC_LIST_FIELDS[
                        'Are you sure you want to proceed with this action?'
                      ],
                    ),
                    onPressButtonRight: () => {
                      handleChangeStatusDevice(
                        DeviceControlStatus.PURGE,
                        data?.id,
                      );
                    },
                    txButtonLeft: renderDynamicLabel(
                      dynamicFields,
                      DEVICE_CONTROL_DYNAMIC_LIST_FIELDS.Cancel,
                    ),
                    txButtonRight: renderDynamicLabel(
                      dynamicFields,
                      DEVICE_CONTROL_DYNAMIC_LIST_FIELDS.Confirm,
                    ),
                  });
                },
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.DEPARTMENT_MASTER,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
                tooltipTitle: 'Purge',
              },
            ];
          }

          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'deviceId',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Device id'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'deviceType',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Device type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'version',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['App version'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'deviceModel',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Device model'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'deviceStatus',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Device status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'lastSyncDeviceTime',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Last sync device time'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'lastSyncServerTime',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Last sync server time'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Company name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicFields, isMultiColumnFilter, handleChangeStatusDevice],
  );

  const handleExportPR = () => {};

  // render
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.DEVICE_CONTROL}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionDeviceControl,
        )}
      />

      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.deviceControl}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionDeviceControl,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicFields}
      />
      <ModalExport
        disable={loading}
        toggle={() => setModalExport(!modalExport)}
        modal={modalExport}
        handleSubmit={handleExportPR}
        title={renderDynamicLabel(
          dynamicFields,
          DEVICE_CONTROL_DYNAMIC_LIST_FIELDS['Export CSV'],
        )}
        totalPage={listDeviceControl?.totalPage}
      />
    </div>
  );
}
