import { useCallback, useEffect, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { SortType, PARAMS_DEFAULT } from 'constants/filter.const';
import HeaderPage from 'components/common/header-page/HeaderPage';

import images from 'assets/images/images';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { CommonQuery } from 'constants/common.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import { ShipRank } from 'models/api/ship-rank/ship-rank.model';
import {
  deleteShipRankActions,
  getListShipRankActions,
} from 'store/ship-rank/ship-rank.action';
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
import ShipRankManagementFilter from './Filters';
import styles from './list.module.scss';

const ShipRankContainer = () => {
  const { t } = useTranslation(I18nNamespace.SHIP_RANK);

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

  const { loading, listShipRanks, params } = useSelector(
    (state) => state.shipRank,
  );

  const [page, setPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 20);
  const [content, setContent] = useState(params.content || '');
  const [status, setStatus] = useState<string>(params.status || 'all');
  const [sort, setSort] = useState<string>(params.sort || '');

  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getShipRankById(id));
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getShipRankById(id)}${CommonQuery.EDIT}`);
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListShipRankActions.request(newParams));
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

  const handleDeleteShipRank = useCallback(
    (id: string) => {
      dispatch(
        deleteShipRankActions.request({
          id,
          getList: () => {
            if (page > 1 && listShipRanks.data.length === 1) {
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
      listShipRanks.data.length,
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
        onPressButtonRight: () => handleDeleteShipRank(id),
      });
    },
    [handleDeleteShipRank, t],
  );

  const sanitizeData = (data: ShipRank) => {
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
      if (!loading && listShipRanks?.data.length > 0) {
        return (
          <tbody>
            {listShipRanks?.data.map((item, index) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.CHARTER_OWNER,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  cssClass: 'me-1',
                },
                {
                  img: images.icons.icEdit,
                  function: () => editDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.CHARTER_OWNER,
                  action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.CHARTER_OWNER,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];
              return (
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.CHARTER_OWNER,
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
    [loading, listShipRanks?.data, viewDetail, editDetail, handleDelete],
  );

  return (
    <div className={styles.ShipRank}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.SHIP_RANK}
        titlePage={t('headPageTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CHARTER_OWNER,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => history.push(AppRouteConst.SHIP_RANK_CREATE)}
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

      <ShipRankManagementFilter
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
          !loading && (listShipRanks?.data.length === 0 || !listShipRanks?.data)
        }
        defaultSort={sort}
        renderRow={renderRow}
        loading={loading}
        page={page}
        isRefreshLoading={params?.isRefreshLoading}
        pageSize={pageSize}
        totalItem={listShipRanks?.totalItem}
        totalPage={listShipRanks?.totalPage}
        handleChangePage={onChangePage}
        sortFunction={(filed: string, sortType: SortType) =>
          handleGetListSort(filed, sortType)
        }
      />
    </div>
  );
};

export default ShipRankContainer;
