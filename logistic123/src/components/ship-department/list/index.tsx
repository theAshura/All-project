import { useCallback, useEffect, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import useEffectOnce from 'hoc/useEffectOnce';
import { SortType, PARAMS_DEFAULT } from 'constants/filter.const';
import HeaderPage from 'components/common/header-page/HeaderPage';

import images from 'assets/images/images';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { CommonQuery } from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import { ShipDepartment } from 'models/api/ship-department/ship-department.model';
import {
  deleteShipDepartmentActions,
  getListShipDepartmentActions,
} from 'store/ship-department/ship-department.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { RowComponent } from 'components/common/table/row/rowCp';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import TableCp from 'components/common/table/TableCp';
import { formatDateTime } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ShipDepartmentManagementFilter from './Filters';
import styles from './list.module.scss';

const ShipDepartmentContainer = () => {
  const { t } = useTranslation(I18nNamespace.SHIP_DEPARTMENT);

  const rowLabels = [
    {
      id: 'action',
      label: t('action'),
      sort: false,
      width: '100',
    },
    {
      id: 'code',
      label: t('code'),
      sort: true,
      width: '200',
    },
    {
      id: 'name',
      label: t('name'),
      sort: true,
      width: '200',
    },
    {
      id: 'description',
      label: t('description'),
      sort: true,
      width: '200',
    },
    {
      id: 'createdAt',
      label: t('createdDate'),
      sort: true,
      width: '160',
    },
    {
      id: 'createdUser.username',
      label: t('createdUser'),
      sort: true,
      width: '160',
    },
    {
      id: 'updatedAt',
      label: t('updatedDate'),
      sort: true,
      width: '160',
    },
    {
      id: 'updatedUser.username',
      label: t('updatedUser'),
      sort: true,
      width: '160',
    },

    {
      id: 'status',
      label: t('status'),
      sort: true,
      width: '120',
    },
  ];

  const dispatch = useDispatch();

  const { loading, listShipDepartments, params } = useSelector(
    (state) => state.shipDepartment,
  );

  const [page, setPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 20);
  const [content, setContent] = useState(params.content || '');
  const [status, setStatus] = useState<string>(params.status || 'all');
  const [sort, setSort] = useState<string>(params.sort || '');

  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getShipDepartmentById(id));
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(
      `${AppRouteConst.getShipDepartmentById(id)}${CommonQuery.EDIT}`,
    );
  }, []);

  const handleGetList = (params?: CommonApiParam) => {
    const newParams = handleFilterParams(params);
    dispatch(getListShipDepartmentActions.request(newParams));
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

  const handleDeleteShipDepartment = (id: string) => {
    dispatch(
      deleteShipDepartmentActions.request({
        id,
        getListShipDepartment: () => {
          if (page > 1 && listShipDepartments.data.length === 1) {
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

  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: () => handleDeleteShipDepartment(id),
    });
  };

  const sanitizeData = (data: ShipDepartment) => {
    const finalData = {
      id: data.id,
      code: data?.code,
      name: data?.name,
      description: data?.description,
      createdAt: formatDateTime(data?.createdAt),
      'createdUser.username': data?.createdUser?.username,
      updatedAt: data?.updatedUser?.username
        ? formatDateTime(data?.updatedAt)
        : '',
      'updatedUser.username': data?.updatedUser?.username,
      status: data?.status,
    };
    return finalData;
  };

  const renderRow = useCallback(
    // eslint-disable-next-line consistent-return
    (isScrollable?: boolean) => {
      if (!loading && listShipDepartments?.data.length > 0) {
        return (
          <tbody>
            {listShipDepartments?.data.map((item, index) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHIP_DEPARTMENT,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  cssClass: 'me-1',
                },
                {
                  img: images.icons.icEdit,
                  function: () => editDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHIP_DEPARTMENT,
                  action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHIP_DEPARTMENT,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];
              return (
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.SHIP_DEPARTMENT,
                    action: ActionTypeEnum.UPDATE,
                  }}
                  key={JSON.stringify(item)}
                >
                  {({ hasPermission }) => (
                    <RowComponent
                      isScrollable={isScrollable}
                      data={finalData}
                      actionList={actions}
                      onClickRow={
                        hasPermission ? () => viewDetail(item?.id) : undefined
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, listShipDepartments],
  );

  return (
    <div className={styles.shipDepartment}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.SHIP_DEPARTMENT}
        titlePage={t('headPageTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.SHIP_DEPARTMENT,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() =>
                  history.push(AppRouteConst.SHIP_DEPARTMENT_CREATE)
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
                {t('createNew')}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <ShipDepartmentManagementFilter
        disable={loading}
        content={content}
        status={status}
        handleChangeSearchValue={handleChangeSearchValue}
        handleClearSearchValue={handleClearSearchValue}
        handleGetList={handleGetListSearch}
      />

      <TableCp
        rowLabels={rowLabels}
        isEmpty={
          !loading &&
          (listShipDepartments?.data.length === 0 || !listShipDepartments?.data)
        }
        defaultSort={sort}
        renderRow={renderRow}
        loading={loading}
        page={page}
        isRefreshLoading={params?.isRefreshLoading}
        pageSize={pageSize}
        totalItem={listShipDepartments?.totalItem}
        totalPage={listShipDepartments?.totalPage}
        handleChangePage={onChangePage}
        sortFunction={(filed: string, sortType: SortType) =>
          handleGetListSort(filed, sortType)
        }
      />
    </div>
  );
};

export default ShipDepartmentContainer;
