import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  Features,
  SubFeatures,
  RoleScope,
} from 'constants/roleAndPermission.const';
import { formatDateNoTime } from 'helpers/date.helper';
import { dateStringComparator } from 'helpers/utils.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';

import { handleFilterParams } from 'helpers/filterParams.helper';
import NoPermissionComponent from 'containers/no-permission/index';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { COMPANY_TYPE_DYNAMIC_LIST_FIELDS } from 'constants/dynamic/companyType.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import styles from './company-type.module.scss';
import ModalFormCompanyType from './modal/ModalFormCompanyType';
import {
  deleteCompanyTypeActions,
  getListCompanyTypeActions,
} from './store/action';

const CompanyTypeList = () => {
  const { userInfo } = useSelector((state) => state.authenticate);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [modalFormCompanyType, setModalFormCompanyType] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const [dataSelected, setDataSelected] = useState(null);

  const dispatch = useDispatch();
  const { loading, listData, params } = useSelector(
    (state) => state.companyType,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.GroupCompanyCompanyType,
    modulePage: ModulePage.List,
  });

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const param = handleFilterParams(params);

      dispatch(
        getListCompanyTypeActions.request({
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
        deleteCompanyTypeActions.request({
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
        onPressButtonRight: () => handleDeleteDivision(id),
      });
    },
    [dynamicLabels, handleDeleteDivision],
  );

  const dataTable = useMemo(() => {
    if (!listData?.data) {
      return [];
    }
    return listData?.data?.map((data) => ({
      id: data.id,
      isDefault: data?.isDefault,
      industry: data?.industry || '',
      industryCode: data?.industryCode || '',
      companyType: data?.companyType || '',
      role: data?.actors?.join(', ') || '',
      createdAt: formatDateNoTime(data?.createdAt) || '',
      updatedAt:
        (data?.lastUpdatedById && formatDateNoTime(data?.updatedAt)) || '',
      status: data?.status,
    }));
  }, [listData?.data]);

  const viewDetail = useCallback((id) => {
    setViewMode(true);
    setDataSelected(id);
    setModalFormCompanyType(true);
  }, []);

  const editDetail = useCallback((id?: string) => {
    setViewMode(false);
    setDataSelected(id);
    setModalFormCompanyType(true);
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const actions: Action[] =
            data?.isDefault || userInfo?.roleScope !== RoleScope.SuperAdmin
              ? [
                  {
                    img: images.icons.icViewDetail,
                    function: () => viewDetail(data?.id),
                    feature: Features.CONFIGURATION,
                    buttonType: ButtonType.Blue,
                    cssClass: 'me-1',
                  },
                ]
              : [
                  {
                    img: images.icons.icViewDetail,
                    function: () => viewDetail(data?.id),
                    feature: Features.CONFIGURATION,
                    buttonType: ButtonType.Blue,
                    cssClass: 'me-1',
                  },
                  {
                    img: images.icons.icEdit,
                    function: () => editDetail(data?.id),
                  },
                  {
                    img: images.icons.icRemove,
                    function: () => handleDelete(data?.id),
                    feature: Features.CONFIGURATION,
                    buttonType: ButtonType.Orange,
                    cssClass: 'ms-1',
                  },
                ];

          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={actions} validWordFlow />
            </div>
          );
        },
      },
      {
        field: 'industry',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS.Industry,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'industryCode',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS['Industry code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS['Company type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'role',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS.Role,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS['Created at'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS['Updated at'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_TYPE_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo?.roleScope,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.COMPANY_TYPE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.GroupCompanyCompanyType,
        )}
      >
        {userInfo?.roleScope === RoleScope.SuperAdmin && (
          <Button
            onClick={() => {
              setViewMode(false);
              setModalFormCompanyType(true);
            }}
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
        )}
      </HeaderPage>

      <AGGridModule
        loading={loading}
        params={params}
        colDefProp={
          window.innerWidth < 1400 ? DEFAULT_COL_DEF : DEFAULT_COL_DEF_TYPE_FLEX
        }
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.companyType}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.GroupCompanyCompanyType,
        )}
        dataTable={dataTable}
        height="calc(100vh - 188px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={handleGetList}
        classNameHeader={styles.header}
        extensions={{
          saveTemplate: false,
          saveAsTemplate: false,
          deleteTemplate: false,
          globalTemplate: false,
        }}
        dynamicLabels={dynamicLabels}
      />
      <ModalFormCompanyType
        isOpen={modalFormCompanyType}
        viewMode={viewMode}
        dataSelected={dataSelected}
        handleGetList={handleGetList}
        clearData={() => {
          setDataSelected(null);
        }}
        onClose={() => {
          setModalFormCompanyType(false);
          setDataSelected(null);
        }}
      />
    </div>
  );
};
const CompanyList = () => {
  const { userInfo } = useSelector((state) => state.authenticate);

  return (
    <PermissionCheck
      options={{
        feature: Features.GROUP_COMPANY,
        subFeature: SubFeatures.COMPANY_TYPE,
      }}
    >
      {({ hasPermission }) =>
        userInfo?.roleScope === RoleScope.SuperAdmin || hasPermission ? (
          <CompanyTypeList />
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};
export default CompanyList;
