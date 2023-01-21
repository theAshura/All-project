import { useCallback, useEffect, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { SortType, PARAMS_DEFAULT } from 'constants/filter.const';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { useTranslation } from 'react-i18next';
import { CommonQuery } from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import {
  CategoryExtend1,
  CategoryExtend,
} from 'models/api/category/category.model';
import {
  deleteCategoryActions,
  getListCategoryActions,
} from 'store/category/category.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { Action, CommonApiParam } from 'models/common.model';
import { MultiRowComponent } from 'components/common/table/row/MultiRow';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import TableCp from 'components/common/table/TableCp';
import { formatDateTime } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import CategoryManagementFilter from './Filters';
import styles from './list.module.scss';

const CategoryContainer = () => {
  const { t } = useTranslation(I18nNamespace.CATEGORY);

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

  const [optionTable, setOptionTable] = useState<{
    parentId: string;
    isShow: boolean;
    showIcon: boolean;
  }>({
    parentId: null,
    isShow: false,
    showIcon: false,
  });
  const [listDataTable, setListDataTable] = useState<CategoryExtend[]>([]);

  const dispatch = useDispatch();

  const { loading, listCategorys, params } = useSelector(
    (state) => state.category,
  );

  const addItem = useCallback(
    (data: CategoryExtend1[], result: CategoryExtend1) => {
      const dataFilter =
        data.filter((item) => item.parentId === result.id) || [];
      // eslint-disable-next-line no-param-reassign
      result.children = dataFilter;

      if (dataFilter.length > 0) {
        result.children.forEach((item) => addItem(data, item));
      }

      return result;
    },
    [],
  );

  const treeToList = useCallback(
    (
      rootId: string,
      list1: CategoryExtend[],
      dataTree: CategoryExtend1[],
      x: string[],
    ) => {
      const y: string[] = rootId === null ? [] : [...x, rootId];
      dataTree.forEach((item) => {
        list1.push({
          ...item,
          parents: y,
          isShow: rootId === null,
          showIcon: false,
        });

        treeToList(item.id, list1, item.children, y);
      });
    },
    [],
  );

  useEffect(() => {
    const data2: CategoryExtend1[] =
      listCategorys?.map((item) => ({
        ...item,
        children: [],
      })) || [];
    const result: CategoryExtend1 = { id: null, children: [] };
    addItem(data2, result);

    const list1: CategoryExtend[] = [];
    treeToList(null, list1, result.children, []);
    setListDataTable(list1);
  }, [addItem, listCategorys, treeToList]);

  useEffect(() => {
    if (listCategorys && listDataTable) {
      const optionSelected = listDataTable.find(
        (item) => item.id === optionTable.parentId,
      );
      const newListDataTable = listDataTable.map((item) => {
        if (item.id === optionTable.parentId) {
          return { ...item, showIcon: !optionTable.showIcon };
        }

        if (item.parents.includes(optionTable.parentId)) {
          if (!optionSelected?.parentId && item.parents?.length === 1) {
            return {
              ...item,
              isShow: !optionTable.showIcon,
              showIcon: false,
            };
          }

          if (!optionSelected?.parentId && item.parents?.length === 2) {
            return {
              ...item,
              isShow: false,
              showIcon: false,
            };
          }

          if (optionSelected?.parentId) {
            return {
              ...item,
              isShow: !optionTable.showIcon,
              showIcon: !optionTable.showIcon,
            };
          }
        }

        return item;
      });
      setListDataTable(newListDataTable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionTable]);

  const [content, setContent] = useState(params.content || '');
  const [status, setStatus] = useState<string>(params.status || 'all');
  const [sort, setSort] = useState<string>(params.sort || '');

  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getCategoryById(id));
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getCategoryById(id)}${CommonQuery.EDIT}`);
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListCategoryActions.request({ ...newParams, page: 1, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (params && params?.isRefreshLoading) {
      setContent('');
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
      status: status.toString(),
      content: content.trim(),
    });
  };

  const handleGetListSearch = () => {
    handleGetList({
      isRefreshLoading: undefined,
      status: status.toString(),
      content,
      sort,
    });
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

  const handleClearSearchValue = () => {
    setContent('');
    setStatus('all');
    setSort('');
    handleGetList({});
  };

  const handleDeleteCategory = (id: string) => {
    dispatch(
      deleteCategoryActions.request({
        id,
        getListCategory: () => {
          handleGetList({
            isRefreshLoading: false,
            content,
            sort,
            status: status?.toString(),
          });
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
      onPressButtonRight: () => handleDeleteCategory(id),
    });
  };

  const sanitizeData = (data: CategoryExtend) => {
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
      actionsMultiRow: {
        parents: data.parents || [],
        isEnd: data.numChildren === 0,
        isShow: data.isShow,
        showIcon: data.showIcon,
      },
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && listDataTable?.length > 0) {
        return (
          <tbody>
            {listDataTable
              ?.filter((i) => i.isShow)
              ?.map((item, index) => {
                const finalData = sanitizeData(item);
                let actions: Action[] = [
                  {
                    img: images.icons.icViewDetail,
                    function: () => viewDetail(item?.id),
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.MAIN_CATEGORY,
                    action: ActionTypeEnum.VIEW,
                    cssClass: 'me-1',
                  },
                  {
                    img: images.icons.icEdit,
                    function: () => editDetail(item?.id),
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.MAIN_CATEGORY,
                    action: ActionTypeEnum.UPDATE,
                  },
                ];

                if (item?.numDependents === 0) {
                  actions = [
                    ...actions,
                    {
                      img: images.icons.icRemove,
                      function: () => handleDelete(item?.id),
                      feature: Features.CONFIGURATION,
                      subFeature: SubFeatures.MAIN_CATEGORY,
                      action: ActionTypeEnum.DELETE,
                      buttonType: ButtonType.Orange,
                      cssClass: 'ms-1',
                    },
                  ];
                }

                return (
                  <MultiRowComponent
                    key={finalData?.id}
                    isScrollable={isScrollable}
                    data={finalData}
                    actionList={actions}
                    editDetail={() => viewDetail(item?.id)}
                    actionsCollapse={() => {
                      setOptionTable({
                        parentId: finalData?.id,
                        isShow: finalData?.actionsMultiRow?.isShow,
                        showIcon: finalData?.actionsMultiRow?.showIcon,
                      });
                    }}
                  />
                );
              })}
          </tbody>
        );
      }
      return null;
    },
    [loading, listDataTable, viewDetail, editDetail, handleDelete],
  );

  return (
    <div className={styles.category}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.CATEGORY}
        titlePage={t('headPageTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.MAIN_CATEGORY,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => history.push(AppRouteConst.CATEGORY_CREATE)}
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

      <CategoryManagementFilter
        disable={loading}
        content={content}
        status={status}
        handleChangeSearchValue={handleChangeSearchValue}
        handleClearSearchValue={handleClearSearchValue}
        handleGetList={handleGetListSearch}
      />

      <TableCp
        rowLabels={rowLabels}
        isEmpty={!loading && (listCategorys?.length === 0 || !listCategorys)}
        defaultSort={sort}
        renderRow={renderRow}
        loading={loading}
        isHiddenPagination
        isRefreshLoading={params?.isRefreshLoading}
        sortFunction={(filed: string, sortType: SortType) =>
          handleGetListSort(filed, sortType)
        }
      />
    </div>
  );
};

export default CategoryContainer;
