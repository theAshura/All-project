import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { useCallback, useMemo, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import cx from 'classnames';

import {
  Features,
  SubFeatures,
  RoleScope,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { useDispatch, useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import styles from 'components/list-common.module.scss';
import { getListCompanyManagementActions } from 'store/company/company.action';
import { ListCompanyDataTable } from 'models/store/module-configuration/module-configuration.model';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

export default function CompanyList() {
  const dispatch = useDispatch();
  const { loading, listCompanyManagementTypes, params } = useSelector(
    (state) => state.companyManagement,
  );

  const { userInfo } = useSelector((state) => state.authenticate);

  const { t } = useTranslation([I18nNamespace.COMPANY, I18nNamespace.COMMON]);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getListModuleConfigByCompanyID(id || ''));
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
        headerName: t('action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 100,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: ListCompanyDataTable }) => {
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              buttonType: ButtonType.Blue,
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
        headerName: t('companyCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('companyName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'phone',
        headerName: t('phoneNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: t('country'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'state',
        headerName: t('state'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'city',
        headerName: t('city'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'address',
        headerName: t('address'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fax',
        headerName: t('fax'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'email',
        headerName: t('email'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, viewDetail],
  );

  return (
    <AGGridModule
      loading={loading}
      params={params}
      setIsMultiColumnFilter={setIsMultiColumnFilter}
      hasRangePicker
      columnDefs={columnDefs}
      dataFilter={null}
      moduleTemplate={MODULE_TEMPLATE.company}
      fileName="Company"
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
    />
  );
}
