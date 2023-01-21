import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { VIQ_FIELDS_LIST } from 'constants/dynamic/vessel-inspection-questionnaires.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVIQActions, getListVIQActions } from 'store/viq/viq.action';
import styles from '../../list-common.module.scss';

const VIQContainer = () => {
  const dispatch = useDispatch();
  const dynamicLabels = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
    modulePage: ModulePage.List,
  });

  const { loading, listVIQs, params } = useSelector((state) => state.viq);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getVIQById(id));
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getVIQById(id)}?edit`);
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListVIQActions.request({ ...newParams, page: 1, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  const handleDeleteVIQ = (id: string) => {
    dispatch(
      deleteVIQActions.request({
        id,
        afterDelete: () => {
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
      txTitle: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_LIST['Delete?']),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_LIST[
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
      onPressButtonRight: () => handleDeleteVIQ(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listVIQs?.data) {
      return [];
    }
    return listVIQs?.data?.map((data) => ({
      id: data.id,
      refNo: data?.refNo || '',
      type: data?.type || '',
      viqVesselType: data?.viqVesselType || '',
      status: data?.status || '',
      companyName: data?.company?.name || '',
    }));
  }, [listVIQs?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_LIST.Action),
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
              subFeature: SubFeatures.VIQ,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VIQ,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VIQ,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];
          if (userInfo?.mainCompanyId === data?.companyId) {
            actions.push({
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VIQ,
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
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'refNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_LIST['Ref.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_LIST.Type),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'viqVesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_LIST['VIQ vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_LIST.Status),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_LIST['Created by company'],
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
      handleDelete,
    ],
  );
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.VIQ}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.VIQ,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => history.push(AppRouteConst.VIQ_CREATE)}
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
                  VIQ_FIELDS_LIST['Create New'],
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
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        moduleTemplate={MODULE_TEMPLATE.viq}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
        )}
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
};

export default VIQContainer;
