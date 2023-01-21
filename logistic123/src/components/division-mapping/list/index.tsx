import { useCallback, useState, useMemo } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { formatDateNoTime } from 'helpers/date.helper';
import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  getListDivisionMappingActions,
  deleteDivisionMappingActions,
} from 'pages/division-mapping/store/action';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { DIVISION_MAPPING_FIELDS_LIST } from 'constants/dynamic/division-mapping.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';

const DivisionMappingContainer = () => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
    modulePage: ModulePage.List,
  });

  const dispatch = useDispatch();
  const { loading, listDivision, params } = useSelector(
    (state) => state.divisionMapping,
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);

      dispatch(
        getListDivisionMappingActions.request({
          ...newParams,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const handleDeleteDivision = useCallback(
    (id: string) => {
      dispatch(
        deleteDivisionMappingActions.request({
          id,
          handleSuccess: () => {
            handleGetList();
          },
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST[
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
        onPressButtonRight: () => handleDeleteDivision(id),
      });
    },
    [dynamicLabels, handleDeleteDivision],
  );

  const dataTable = useMemo(() => {
    if (!listDivision?.data) {
      return [];
    }
    return listDivision?.data?.map((data) => ({
      id: data.id,
      divisionCode: data?.code || '',
      divisionName: data?.name || '',
      imoNumber: data?.divisionMapping?.length
        ? data?.divisionMapping
            ?.map((item) => item?.vessel?.imoNumber)
            ?.join(', ')
        : '',
      vesselName: data?.divisionMapping?.length
        ? data?.divisionMapping?.map((item) => item?.vessel?.name)?.join(', ')
        : '',
      vesselType: data?.divisionMapping?.length
        ? data?.divisionMapping
            ?.map((item) => item?.vessel?.vesselType?.name)
            ?.join(', ')
        : '',
      createdDate:
        formatDateNoTime(data?.divisionMapping?.[0]?.createdAt) || '',
      createdByUser: data?.divisionMapping?.[0]?.createdUser?.username || '',
      updatedDate: formatDateNoTime(data?.updatedAt) || '',
      updatedBy: data?.divisionMapping?.[0]?.updatedUser?.username || '',
      createdByCompany: data?.divisionMapping?.[0]?.company?.name || '',
    }));
  }, [listDivision?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 100,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () =>
                history.push(`/mapping-division/${data?.id}`, {
                  isView: true,
                }),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.DIVISION_MAPPING,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () =>
                history.push(`/mapping-division/${data?.id}`, {
                  isView: false,
                }),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.DIVISION_MAPPING,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.DIVISION_MAPPING,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];

          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'divisionCode',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Division code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'divisionName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Division name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'imoNumber',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['IMO number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'createdDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdByUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedBy',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdByCompany',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.DIVISION_MAPPING}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.DIVISION_MAPPING,
            action: ActionTypeEnum.VIEW,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() =>
                  history.push(AppRouteConst.DIVISION_MAPPING_CREATE)
                }
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
                  DIVISION_MAPPING_FIELDS_LIST['Map vessel'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <AGGridModule
        loading={loading}
        params={params}
        colDefProp={DEFAULT_COL_DEF}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.divisionMapping}
        fileName="Division Mapping"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />
    </div>
  );
};

export default DivisionMappingContainer;
