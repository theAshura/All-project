import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { ModuleName } from 'constants/common.const';
import {
  ActionTypeEnum,
  Features,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import PermissionCheck from 'hoc/withPermissionCheck';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { VESSEL_LIST_DYNAMIC_FIELDS } from 'constants/dynamic/vessel.const';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { Action, CommonApiParam } from 'models/common.model';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { useCallback, useMemo, useState } from 'react';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteVesselActions,
  getListVesselActions,
} from 'store/vessel/vessel.action';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';

const VesselManagementContainer = () => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dispatch = useDispatch();
  const { loading, listVesselResponse, params } = useSelector(
    (state) => state.vessel,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonVessel,
    modulePage: ModulePage.List,
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListVesselActions.request({
        ...newParams,
        pageSize: -1,
        page: 1,
        isLeftMenu: false,
        byUserCreated: true,
        moduleName: ModuleName.MasterTable,
      }),
    );
  };

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteVesselActions.request({
        id,
        getListVesselManagement: () => {
          handleGetList({
            isRefreshLoading: false,
          });
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS[
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
      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getVesselById(id));
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getVesselById(id)}?edit`);
  }, []);

  const dataTable = useMemo(() => {
    if (!listVesselResponse?.data) {
      return [];
    }
    return listVesselResponse?.data?.map((data) => ({
      id: data.id,
      companyId: data?.company?.id,
      imoNumber: data.imoNumber || '',
      name: data.name || '',
      code: data.code || '',
      flag: data.countryFlag || '',
      type: data.vesselType?.name || '',
      division: data.divisionMapping?.division?.name || '',
      docHolder: data?.docHolder?.name || '',
      status: data.status || '',
      company: data?.company?.name || '',
      createdUserId: data?.createdUserId || '',
    }));
  }, [listVesselResponse?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const isCreated = userInfo?.id === data?.createdUserId;
          const isImported = data?.isImported;
          const canUserDelete =
            (isCreated && !isImported) ||
            (data?.companyId === userInfo?.company?.id &&
              userInfo?.roleScope === RoleScope.Admin);

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VESSEL,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VESSEL,
              action: ActionTypeEnum.UPDATE,
            },
            canUserDelete && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VESSEL,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
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
        field: 'imoNumber',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS['IMO number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS['Vessel code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'flag',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS.Flag,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'division',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS['Business division'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'docHolder',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS['DOC holder'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_LIST_DYNAMIC_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.VESSEL}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVessel,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.VESSEL,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => history.push(AppRouteConst.VESSEL_CREATE)}
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
                  COMMON_DYNAMIC_FIELDS['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.vessel}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVessel,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default VesselManagementContainer;
