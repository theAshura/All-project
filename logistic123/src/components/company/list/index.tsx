import { useCallback, useMemo, useState } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import history from 'helpers/history.helper';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';

import images from 'assets/images/images';
import { CommonQuery } from 'constants/common.const';
import { AppRouteConst } from 'constants/route.const';
import cx from 'classnames';

import HeaderPage from 'components/common/header-page/HeaderPage';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
  RoleScope,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { useDispatch, useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { COMPANY_DYNAMIC_LIST_FIELDS } from 'constants/dynamic/company.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  deleteCompanyManagementActions,
  getListCompanyManagementActions,
} from '../../../store/company/company.action';
import styles from '../../list-common.module.scss';

export default function CompanyManagementContainer() {
  const dispatch = useDispatch();
  const { loading, listCompanyManagementTypes, params } = useSelector(
    (state) => state.companyManagement,
  );

  const { userInfo } = useSelector((state) => state.authenticate);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.GroupCompanyCompany,
    modulePage: ModulePage.List,
  });

  const viewDetail = useCallback((id?: string, isNewTab?: boolean) => {
    if (isNewTab) {
      const win = window.open(AppRouteConst.getCompanyById(id), '_blank');
      win.focus();
    } else {
      history.push(`${AppRouteConst.getCompanyById(id)}`);
    }
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getCompanyById(id)}${CommonQuery.EDIT}`);
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const param = handleFilterParams(params);

      dispatch(
        getListCompanyManagementActions.request({
          ...param,
          isLeftMenu: false,
          pageSize: -1,
        }),
      );
    },
    [dispatch],
  );

  const handleDeleteCompany = useCallback(
    (id: string) => {
      const currentStandard = listCompanyManagementTypes?.data?.find(
        (item) => item.id === id,
      );
      if (currentStandard) {
        dispatch(
          deleteCompanyManagementActions.request({
            id,
            handleSuccess: () => {
              handleGetList();
            },
          }),
        );
      }
    },
    [dispatch, handleGetList, listCompanyManagementTypes?.data],
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
        onPressButtonRight: () => handleDeleteCompany(id),
      });
    },
    [dynamicLabels, handleDeleteCompany],
  );

  const dataTable = useMemo(() => {
    if (!listCompanyManagementTypes?.data) {
      return [];
    }
    return listCompanyManagementTypes?.data?.map((item) => ({
      id: item?.id,
      code: item?.code,
      name: item?.name,
      group: item?.group?.name,
      phone: item?.phone,
      country: item?.country,
      state: item?.stateOrProvince,

      city: item?.townOrCity,
      address: item?.address,
      fax: item?.fax,
      email: item?.email,
      status: item?.status,
    }));
  }, [listCompanyManagementTypes?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const isCurrentCompany = userInfo?.companyId === data?.id;
          const isUser = userInfo?.roleScope === RoleScope.User;

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              buttonType: ButtonType.Blue,
            },
            !isUser && {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
            },
            !isUser && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
              disable: isCurrentCompany,
            },
            {
              img: images.icons.table.icNewTab,
              function: () => viewDetail(data?.id, true),
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              buttonType: ButtonType.Green,
              cssClass: 'ms-1',
            },
          ];

          if (!data) {
            actions = [];
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
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS['Company code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS['Company name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'phone',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS['Phone number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS.Country,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'state',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS['State/ Province'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'city',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS['Town/ City'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'address',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS.Address,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fax',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS.Fax,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'email',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS.Email,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_LIST_FIELDS.Status,
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
      userInfo?.companyId,
      userInfo?.roleScope,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.COMPANY}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.GroupCompanyCompany,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.GROUP_COMPANY,
            subFeature: SubFeatures.COMPANY,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission &&
            userInfo?.roleScope !== RoleScope.User && (
              <Button
                onClick={() => history.push(AppRouteConst.COMPANY_CREATE)}
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
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.company}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.GroupCompanyCompany,
        )}
        dataTable={dataTable}
        height="calc(100vh - 188px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        hiddenTemplate={userInfo?.roleScope === RoleScope.SuperAdmin}
        extensions={
          userInfo?.roleScope === RoleScope.SuperAdmin
            ? {
                saveTemplate: false,
                saveAsTemplate: false,
                deleteTemplate: false,
                globalTemplate: false,
              }
            : {}
        }
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
}
