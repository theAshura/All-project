import images from 'assets/images/images';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import useEffectOnce from 'hoc/useEffectOnce';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { SortType, PARAMS_DEFAULT } from 'constants/filter.const';
import HeaderPage from 'components/common/header-page/HeaderPage';

import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { ShoreRank } from 'models/api/shore-rank/shore-rank.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteShoreRankActions,
  getListShoreRankActions,
} from 'store/shore-rank/shore-rank.action';
import ShoreRankFilter from './Filters';
import styles from './list.module.scss';

export default function ShoreRankContainer() {
  const dispatch = useDispatch();
  const { loading, listShoreRank, params } = useSelector(
    (state) => state.shoreRank,
  );

  const { t } = useTranslation([
    I18nNamespace.SHORE_RANK,
    I18nNamespace.COMMON,
  ]);

  const rowLabels = [
    {
      id: t('action'),
      label: 'Action',
      sort: true,
      width: '100',
    },
    {
      id: 'code',
      label: t('txShoreRankCode'),
      sort: true,
      width: '120',
    },
    {
      id: 'name',
      label: t('txShoreRankName'),
      sort: true,
      width: '120',
    },
    {
      id: 'description',
      label: t('txDescription'),
      sort: true,
      width: '220',
    },
    {
      id: 'createdAt',
      label: t('txCreatedDate'),
      sort: true,
      width: '120',
    },
    {
      id: 'createdUser.username',
      label: t('txCreatedUser'),
      sort: true,
      width: '120',
    },
    {
      id: 'updatedAt',
      label: t('txUpdatedDate'),
      sort: true,
      width: '120',
    },
    {
      id: 'updatedUser.username',
      label: t('txUpdatedUser'),
      sort: true,
      width: '120',
    },
    {
      id: 'status',
      label: t('txStatus'),
      sort: true,
      width: '120',
    },
  ];

  const [page, setPage] = useState(params?.page || 1);
  const [pageSize, setPageSize] = useState(params?.pageSize || 20);
  const [content, setContent] = useState(params?.content || '');
  const [status, setStatus] = useState<string>(params?.status || 'all');
  const [sort, setSort] = useState<string>(params?.sort || null);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListShoreRankActions.request(newParams));
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

  const handleDeleteShoreRank = useCallback(
    (id: string) => {
      dispatch(
        deleteShoreRankActions.request({
          id,
          getListShoreRank: () => {
            if (page > 1 && listShoreRank.data.length === 1) {
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
      listShoreRank?.data?.length,
      page,
      pageSize,
      sort,
      status,
    ],
  );

  const handleDelete = useCallback(
    (id?: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteShoreRank(id),
      });
    },
    [handleDeleteShoreRank, t],
  );

  const sanitizeData = (data: ShoreRank) => {
    const finalData = {
      code: data?.code,
      name: data?.name,
      description: data?.description,
      createdAt: formatDateTime(data?.createdAt),
      'createdUser.username': data?.createdUser?.username,
      updatedAt: data?.updatedUser?.username && formatDateTime(data?.updatedAt),
      'updatedUser.username': data?.updatedUser?.username,
      status: data?.status,
    };
    return finalData;
  };

  const viewDetail = (id?: string) => {
    history.push(AppRouteConst.getShoreRankById(id));
  };

  const editDetail = (id?: string) => {
    history.push(`${AppRouteConst.getShoreRankById(id)}?edit`);
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && listShoreRank?.data.length > 0) {
        return (
          <tbody>
            {listShoreRank?.data.map((item) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_RANK,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  cssClass: 'me-1',
                },
                {
                  img: images.icons.icEdit,
                  function: () => editDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_RANK,
                  action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_RANK,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];
              return (
                <RowComponent
                  isScrollable={isScrollable}
                  key={JSON.stringify(item)}
                  data={finalData}
                  onClickRow={() => viewDetail(item?.id)}
                  actionList={actions}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [handleDelete, listShoreRank?.data, loading],
  );

  // render
  return (
    <div className={styles.shoreRank}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.SHORE_RANK}
        titlePage={t('txShoreRank')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.SHORE_RANK,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => history.push(AppRouteConst.SHORE_RANK_CREATE)}
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

      <ShoreRankFilter
        disable={loading}
        content={content}
        status={status}
        handleChangeSearchValue={handleChangeSearchValue}
        handleClearSearchValue={handleClearSearchValue}
        handleGetList={handleGetListSearch}
      />

      <TableCp
        rowLabels={rowLabels}
        renderRow={renderRow}
        loading={loading}
        defaultSort={sort}
        isRefreshLoading={params?.isRefreshLoading}
        page={listShoreRank?.page}
        pageSize={listShoreRank?.pageSize}
        totalItem={listShoreRank?.totalItem}
        totalPage={listShoreRank?.totalPage}
        handleChangePage={onChangePage}
        sortFunction={(filed: string, sortType: SortType) =>
          handleGetListSort(filed, sortType)
        }
        isEmpty={
          !loading && (listShoreRank?.data.length === 0 || !listShoreRank?.data)
        }
      />
    </div>
  );
}
