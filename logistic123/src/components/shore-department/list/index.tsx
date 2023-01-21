import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  SortType,
  statusAllOptions,
  PARAMS_DEFAULT,
} from 'constants/filter.const';
import { AppRouteConst } from 'constants/route.const';
import {
  deleteShoreDepartmentActions,
  getListShoreDepartmentAction,
} from 'store/shore-department/shore-department.action';
import { ShoreDepartment } from 'models/api/shore-department/shore-department.model';
import { Action, CommonApiParam } from 'models/common.model';
import useEffectOnce from 'hoc/useEffectOnce';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { CommonQuery } from 'constants/common.const';
import { RowComponent } from 'components/common/table/row/rowCp';
import Select from 'components/ui/select/Select';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import history from 'helpers/history.helper';
import images from 'assets/images/images';
import PermissionCheck from 'hoc/withPermissionCheck';
import TableCp from 'components/common/table/TableCp';
import TableFilterCp from 'components/common/table/table-filter/TableFilterCp';
import { handleFilterParams } from 'helpers/filterParams.helper';
import filterStyles from 'components/common/table/table-filter/table-filter.module.scss';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { formatDateTime } from 'helpers/utils.helper';
import styles from './list.module.scss';

const ShoreDepartmentContainer = () => {
  const { t } = useTranslation([
    I18nNamespace.SHORE_DEPARTMENT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { params, listShore, loading } = useSelector(
    (store) => store.shoreDepartment,
  );
  const [page, setPage] = useState<number>(params?.page || 1);
  const [pageSize, setPageSize] = useState<number>(params?.pageSize || 20);
  const [content, setContent] = useState<string>(params?.content || '');
  const [status, setStatus] = useState<string>(params?.status || 'all');
  const [sort, setSort] = useState<string>(params?.sort || '');

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListShoreDepartmentAction.request(newParams));
    },
    [dispatch],
  );

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

  const handleDeleteShoreDepartment = useCallback(
    (id: string) => {
      dispatch(
        deleteShoreDepartmentActions.request({
          id,
          getList: () => {
            if (page > 1 && listShore.data.length === 1) {
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
    },
    [
      content,
      dispatch,
      handleGetList,
      listShore.data.length,
      page,
      pageSize,
      sort,
      status,
    ],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteShoreDepartment(id),
      });
    },
    [handleDeleteShoreDepartment, t],
  );

  const viewDetail = useCallback((id: string) => {
    history.push(AppRouteConst.shoreDepartmentDetail(id));
  }, []);

  const editDetail = useCallback((id: string) => {
    history.push(
      `${AppRouteConst.shoreDepartmentDetail(id)}${CommonQuery.EDIT}`,
    );
  }, []);
  const sanitizeData = (data: ShoreDepartment) => {
    const finalData = {
      id: data.id,
      code: data.code,
      name: data.name,
      description: data.description,
      createdAt: formatDateTime(data?.createdAt),
      'createdUser.username': data.createdUser?.username,
      updatedAt: data.updatedUser?.username && formatDateTime(data?.updatedAt),
      'updatedUser.username': data.updatedUser?.username,
      status: data.status,
    };
    return finalData;
  };

  const renderAdditionalFilter = useCallback(
    () => (
      <div className={filterStyles.wrapSelect}>
        <div className={filterStyles.labelFilter}>{t('status')}</div>
        <Select
          data={statusAllOptions}
          value={status}
          disabled={loading}
          className={filterStyles.inputSelect}
          onChange={(value) =>
            handleChangeSearchValue('status', value as string)
          }
        />
      </div>
    ),
    [status, loading, t],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && listShore?.data?.length > 0) {
        return (
          <tbody>
            {listShore?.data?.map((item, index) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_DEPARTMENT,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  cssClass: 'me-1',
                },
                {
                  img: images.icons.icEdit,
                  function: () => editDetail(item.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_DEPARTMENT,
                  action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_DEPARTMENT,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];

              return (
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.SHORE_DEPARTMENT,
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
      return null;
    },
    [loading, listShore?.data, viewDetail, editDetail, handleDelete],
  );

  const rowLabels = [
    {
      id: 'action',
      label: t('action'),
      sort: false,
      width: '100',
    },
    {
      id: 'code',
      label: t('shoreDepartmentCode'),
      sort: true,
      width: '240',
    },
    {
      id: 'name',
      label: t('shoreDepartmentName'),
      sort: true,
      width: '240',
    },
    {
      id: 'description',
      label: t('description'),
      sort: true,
      width: '190',
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

  return (
    <div className={styles.shoreDepartment}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.SHORE_DEPARTMENT}
        titlePage={t('shoreDepartment')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.SHORE_DEPARTMENT,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() =>
                  history.push(AppRouteConst.SHORE_DEPARTMENT_CREATE)
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
                {t('buttons.createNew')}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <TableFilterCp
        disable={loading}
        disableClearBtn={
          loading || (content?.trim()?.length === 0 && status === 'all')
        }
        handleChangeSearchValue={handleChangeSearchValue}
        handleClearSearchValue={handleClearSearchValue}
        handleGetList={handleGetListSearch}
        renderAdditionalFilter={renderAdditionalFilter}
        searchContent={content}
      />

      <TableCp
        rowLabels={rowLabels}
        isEmpty={
          !loading && (listShore?.data?.length === 0 || !listShore?.data)
        }
        defaultSort={sort}
        renderRow={renderRow}
        isRefreshLoading={params?.isRefreshLoading}
        loading={loading}
        page={listShore?.page}
        pageSize={listShore?.pageSize}
        totalItem={listShore?.totalItem}
        totalPage={listShore?.totalPage}
        handleChangePage={onChangePage}
        sortFunction={(filed: string, sortType: SortType) => {
          handleGetListSort(filed, sortType);
        }}
      />
    </div>
  );
};

export default ShoreDepartmentContainer;
