import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import TableFilter from 'components/common/table-filter/TableFilter';
import { RowComponent } from 'components/common/table/row/rowCp';
import useEffectOnce from 'hoc/useEffectOnce';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  PARAMS_DEFAULT,
  SortType,
  statusAllOptions,
} from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  FIXED_ROLE_NAME,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import upperFirst from 'lodash/upperFirst';
import { Role } from 'models/api/role/role.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRoleActions, getListRolesActions } from 'store/role/role.action';
import { LIST_ROLE_AND_PERMISSION_DYNAMIC_FIELDS } from 'constants/dynamic/role-and-permission.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import styles from '../../list-common.module.scss';

export default function RoleAndPermissionContainer() {
  const dispatch = useDispatch();
  const { loading, listRoles, params } = useSelector(
    (state) => state.roleAndPermission,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const { t } = useTranslation([I18nNamespace.GROUP, I18nNamespace.COMMON]);
  const [page, setPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 20);
  const [content, setContent] = useState<string>(params?.content || '');
  const [status, setStatus] = useState(params.status || 'all');
  const [sort, setSort] = useState<string>(params?.sort || '');

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserRolesRoleAndPermission,
    modulePage: ModulePage.List,
  });

  const rowLabels = [
    {
      id: 'action',
      label: renderDynamicLabel(
        dynamicLabels,
        LIST_ROLE_AND_PERMISSION_DYNAMIC_FIELDS.Action,
      ),
      sort: false,
      width: '100',
    },
    {
      id: 'name',
      label: renderDynamicLabel(
        dynamicLabels,
        LIST_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['Role name'],
      ),
      sort: true,
      width: '200',
    },
    {
      id: 'description',
      label: renderDynamicLabel(
        dynamicLabels,
        LIST_ROLE_AND_PERMISSION_DYNAMIC_FIELDS.Description,
      ),
      sort: true,
      width: '200',
    },
    {
      id: 'status',
      label: renderDynamicLabel(
        dynamicLabels,
        LIST_ROLE_AND_PERMISSION_DYNAMIC_FIELDS.Status,
      ),
      sort: true,
      width: '200',
    },
  ];

  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getRoleAndPermissionById(id));
  }, []);
  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getRoleAndPermissionById(id)}?edit`);
  }, []);

  const handleGetList = (params?: CommonApiParam) => {
    const newParams = handleFilterParams(params);
    dispatch(getListRolesActions.request(newParams));
  };

  useEffect(() => {
    if (params && params?.isRefreshLoading) {
      // params?.isRefreshLoading = true  set state ve default
      setContent('');
      setPage(1);
      setPageSize(20);
      setStatus('all');
      setSort('');
    }
  }, [params]);

  useEffect(() => {
    if (params?.isLeftMenu) {
      handleGetList(PARAMS_DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.isLeftMenu]);

  useEffectOnce(() => {
    if (!params?.isLeftMenu) {
      handleGetList({ ...params });
    }
  });

  const handleGetListSort = (filed?: string, sortType?: SortType) => {
    let newSort: string = sort;
    newSort = filed ? `${filed}:${sortType}` : '';
    setSort(newSort);
    handleGetList({
      isRefreshLoading: false,
      sort: newSort,
      pageSize,
      page,
      status: status.toString(),
      content: content.trim(),
    });
  };

  const handleGetListSearch = () => {
    setPage(1);
    setSort('');
    if (!content && status === 'all') {
      setPageSize(20);
      handleGetList({
        isRefreshLoading: undefined,
        status: status.toString(),
        pageSize: 20,
        content,
      });
    } else {
      handleGetList({
        isRefreshLoading: undefined,
        status: status.toString(),
        pageSize,
        content,
      });
    }
  };

  const handleChangeSearchValue = (field: string, value: string) => {
    switch (field) {
      case 'search':
        setContent(value);
        break;
      case 'status':
        setStatus(value);
        break;
      default:
        setContent(value);
    }
  };

  const onChangePage = (pageNumber: number, pageSizeNumber?: number) => {
    setPage(pageNumber);
    setPageSize(pageSizeNumber);
    handleGetList({
      page: pageNumber,
      pageSize: pageSizeNumber,
      isRefreshLoading: false,
      status: status.toString(),
      content: content.trim(),
      sort,
    });
  };

  const handleClearSearchValue = () => {
    setContent('');
    setStatus('all');
    setPage(1);
    setPageSize(20);
    setSort('');
    handleGetList({});
  };

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteRoleActions.request({
        id,
        getListRole: () => {
          if (page > 1 && listRoles.data.length === 1) {
            setPage(page - 1);
            handleGetList({
              isRefreshLoading: false,
              page: page - 1,
              pageSize,
              content,
              sort,
              status: status?.toString(),
            });
          } else {
            handleGetList({
              isRefreshLoading: false,
              page,
              pageSize,
              content,
              sort,
              status: status?.toString(),
            });
          }
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const sanitizeData = (data: Role) => {
    const finalData = {
      id: data.id,
      name: data.name,
      description: upperFirst(data.description),
      status: data.status,
      isDefault: data?.isDefault,
    };
    return finalData;
  };

  const renderRow = useCallback(
    // eslint-disable-next-line consistent-return
    (isScrollable?: boolean) => {
      if (!loading && listRoles?.data?.length > 0) {
        return (
          <tbody>
            {listRoles?.data?.map((item, index) => {
              const finalData = sanitizeData(item);
              const allowEdit = !item?.isDefault;
              const allowDelete =
                (userInfo?.roleScope === RoleScope.SuperAdmin ||
                  (item?.name !== FIXED_ROLE_NAME.AUDITEE &&
                    item?.name !== FIXED_ROLE_NAME.INSPECTOR &&
                    item?.name !== FIXED_ROLE_NAME.PILOT)) &&
                !item?.isDefault;
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item.id),
                  feature: Features.USER_ROLE,
                  subFeature: SubFeatures.ROLE_AND_PERMISSION,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  cssClass: 'me-1',
                },
                allowEdit && {
                  img: images.icons.icEdit,
                  function: () => editDetail(item.id),
                  feature: Features.USER_ROLE,
                  subFeature: SubFeatures.ROLE_AND_PERMISSION,
                  action: ActionTypeEnum.UPDATE,
                },
                allowDelete && {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item.id),
                  feature: Features.USER_ROLE,
                  subFeature: SubFeatures.ROLE_AND_PERMISSION,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];

              return (
                <PermissionCheck
                  options={{
                    feature: Features.USER_ROLE,
                    subFeature: SubFeatures.ROLE_AND_PERMISSION,
                    action: ActionTypeEnum.UPDATE,
                  }}
                  key={index.toString() + item?.id?.toString()}
                >
                  {({ hasPermission }) => (
                    <RowComponent
                      isScrollable={isScrollable}
                      data={finalData}
                      actionList={actions}
                      onClickRow={
                        hasPermission ? () => viewDetail(item.id) : undefined
                      }
                    />
                  )}
                </PermissionCheck>
              );
            })}
          </tbody>
        );
      }
    },
    [
      loading,
      listRoles?.data,
      userInfo?.roleScope,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.ROLE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.UserRolesRoleAndPermission,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.USER_ROLE,
            subFeature: SubFeatures.ROLE_AND_PERMISSION,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission &&
            userInfo?.roleScope !== RoleScope.SuperAdmin && (
              <Button
                onClick={() => history.push(AppRouteConst.ROLE_CREATE)}
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

      <TableFilter
        disable={loading}
        content={content}
        handleChangeSearchValue={handleChangeSearchValue}
        status={status}
        dynamicLabels={dynamicLabels}
        statusFilterOptions={statusAllOptions}
        handleClearSearchValue={handleClearSearchValue}
        handleGetList={handleGetListSearch}
      />
      <TableCp
        rowLabels={rowLabels}
        dynamicLabels={dynamicLabels}
        isEmpty={!loading && (listRoles?.data.length === 0 || !listRoles?.data)}
        renderRow={renderRow}
        defaultSort={sort}
        loading={loading}
        isRefreshLoading={params?.isRefreshLoading}
        page={page}
        pageSize={pageSize}
        totalItem={listRoles?.totalItem}
        totalPage={listRoles?.totalPage}
        handleChangePage={onChangePage}
        sortFunction={(filed: string, sortType: SortType) =>
          handleGetListSort(filed, sortType)
        }
      />
    </div>
  );
}
