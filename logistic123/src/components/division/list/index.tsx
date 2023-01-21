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
  getListDivisionActions,
  deleteDivisionActions,
} from 'pages/division/store/action';
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
import { DIVISION_FIELDS_LIST } from 'constants/dynamic/division.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';
import ModalFormDivision from '../modal/ModalFormDivision';

const DivisionContainer = () => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [modalFormDivisionVisible, setModalFormDivisionVisible] =
    useState(false);
  const [divisionSelected, setDivisionSelected] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dispatch = useDispatch();
  const { loading, listDivision, params } = useSelector(
    (state) => state.division,
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonDivision,
    modulePage: ModulePage.List,
  });

  const viewDetail = useCallback((id) => {
    setDivisionSelected(id);
    setModalFormDivisionVisible(true);
    setViewMode(true);
  }, []);

  const editDetail = useCallback((id?: string) => {
    setDivisionSelected(id);
    setModalFormDivisionVisible(true);
    setViewMode(false);
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...param } =
        handleFilterParams(params);
      dispatch(
        getListDivisionActions.request({
          ...param,
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
        deleteDivisionActions.request({
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
          DIVISION_FIELDS_LIST['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST[
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
      // services: data?.services?.join(', '),
      description: data?.description || '',
      created_date: formatDateNoTime(data?.createdAt) || '',
      created_by_user: data?.createdUser?.username || '',
      updated_date: formatDateNoTime(data?.updatedAt) || '',
      updated_by: data?.updatedUser?.username || '',
      status: data?.status || '',
      created_by_company: data?.company?.name || '',
    }));
  }, [listDivision?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST.Action,
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
              subFeature: SubFeatures.DIVISION,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.DIVISION,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.DIVISION,
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
          DIVISION_FIELDS_LIST['Division code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'divisionName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST['Division name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      // {
      //   field: 'services',
      //   headerName: 'Service',
      //   filter: isMultiColumnFilter
      //     ? 'agMultiColumnFilter'
      //     : 'agTextColumnFilter',
      // },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'created_date',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'created_by_user',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updated_date',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updated_by',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'created_by_company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, viewDetail, editDetail, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.DIVISION}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonDivision,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.DIVISION,
            action: ActionTypeEnum.VIEW,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => setModalFormDivisionVisible(true)}
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
                  DIVISION_FIELDS_LIST['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.division}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonDivision,
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

      <ModalFormDivision
        isOpen={modalFormDivisionVisible}
        divisionSelected={divisionSelected}
        handleGetList={handleGetList}
        viewMode={viewMode}
        clearData={() => {
          setDivisionSelected(null);
        }}
        onClose={() => {
          setModalFormDivisionVisible(false);
          setViewMode(false);
          setDivisionSelected(null);
        }}
      />
    </div>
  );
};

export default DivisionContainer;
