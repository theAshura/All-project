import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import TableFilter from 'components/common/table-filter/TableFilter';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { PARAMS_DEFAULT, SortType } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Group } from 'models/api/group/group.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createGroupAction,
  deleteGroupActions,
  editGroupAction,
  getAllGroupAction,
} from 'store/group/group.action';
import ModalGroup from '../common/ModalGroup';
import styles from './list.module.scss';

export default function GroupManagementContainer() {
  const dispatch = useDispatch();
  const { loading, listGroup, params } = useSelector((state) => state.group);

  const { t } = useTranslation([I18nNamespace.GROUP, I18nNamespace.COMMON]);
  const [sort, setSort] = useState<string>(params.sort || '');
  const [page, setPage] = useState(params?.page || 1);
  const [pageSize, setPageSize] = useState(params?.pageSize || 20);
  const [content, setContent] = useState(params.content || '');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Group>(undefined);

  useEffect(() => {
    if (params && params?.isRefreshLoading) {
      setContent(params.content || '');
      setPage(params.page || 1);
      setPageSize(params.pageSize || 20);
      setSort(params.sort || '');
    }
  }, [params]);

  const rowLabels = [
    {
      id: 'action',
      label: t('action'),
      sort: false,
      width: '100',
    },
    {
      id: 'code',
      label: t('groupCode'),
      sort: true,
      width: '200',
    },
    {
      id: 'name',
      label: t('groupName'),
      sort: true,
      width: '200',
    },
    {
      id: 'description',
      label: t('description'),
      sort: true,
      width: '460',
    },
  ];

  const handleGetList = (params?: CommonApiParam) => {
    const newParams = handleFilterParams(params);
    dispatch(getAllGroupAction.request(newParams));
  };

  useEffect(() => {
    if (params && params?.isRefreshLoading) {
      // params?.isRefreshLoading = true  set state ve default
      setContent('');
      setPage(1);
      setPageSize(20);

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
      content: content.trim(),
    });
  };

  const handleGetListSearch = () => {
    setPage(1);
    setSort('');
    handleGetList({
      isRefreshLoading: undefined,
      content,
    });
  };

  const handleChangeSearchValue = (field: string, value: string) => {
    switch (field) {
      case 'search':
        setContent(value);
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
      content: content.trim(),
      sort,
    });
  };

  const handleClearSearchValue = () => {
    setContent('');
    setPage(1);
    setPageSize(20);
    setSort('');
    handleGetList({});
  };

  const handleDeleteGroup = (id: string) => {
    dispatch(
      deleteGroupActions.request({
        id,
        getList: () => {
          if (page > 1 && listGroup.data.length === 1) {
            setPage(page - 1);
            handleGetList({
              isRefreshLoading: false,
              page: page - 1,
              pageSize,
              content,
              sort,
            });
          } else {
            handleGetList({
              isRefreshLoading: false,
              page,
              pageSize,
              content,
              sort,
            });
          }
        },
      }),
    );
  };

  const onSubmitForm = (formData: Group) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createGroupAction.request({
          ...other,
          afterCreate: () => {
            if (isNew) {
              resetForm();
              setContent('');
              setPage(1);
              setPageSize(20);
              setSort('');
              return;
            }
            resetForm();
            setVisibleModal((e) => !e);
            setIsCreate(false);
            setContent('');
            setPage(1);
            setPageSize(20);
            setSort('');
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        editGroupAction.request({
          id: selectedData?.id,
          body: other,
          afterCreate: () => {
            if (isNew) {
              resetForm();
              // setIsEdit(true);
              setIsCreate(true);
              handleGetList({
                page,
                pageSize,
                isRefreshLoading: false,
                // status: status.toString(),
                content: content.trim(),
                sort,
              });
              return;
            }
            setVisibleModal((e) => !e);
            // setIsEdit(false);
            setIsCreate(false);
            handleGetList({
              page,
              pageSize,
              isRefreshLoading: false,
              // status: status.toString(),
              content: content.trim(),
              sort,
            });
          },
        }),
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: () => handleDeleteGroup(id),
    });
  };

  const sanitizeData = (data: Group) => {
    const finalData = {
      id: data.id,
      code: data.code,
      name: data.name,
      description: data.description,
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && listGroup?.data.length > 0) {
        return (
          <tbody>
            {listGroup?.data.map((item, index) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icEdit,
                  function: () => {
                    setVisibleModal(true);
                    setIsCreate(false);
                    setSelectedData(item);
                  },
                  feature: Features.GROUP_COMPANY,
                  subFeature: SubFeatures.GROUP_MASTER,
                  action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item?.id),
                  feature: Features.GROUP_COMPANY,
                  subFeature: SubFeatures.GROUP_MASTER,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];
              return (
                <PermissionCheck
                  options={{
                    feature: Features.GROUP_COMPANY,
                    subFeature: SubFeatures.GROUP_MASTER,
                    action: ActionTypeEnum.UPDATE,
                  }}
                  key={JSON.stringify(item)}
                >
                  {({ hasPermission }) => (
                    <RowComponent
                      isScrollable={isScrollable}
                      data={finalData}
                      actionList={actions}
                      noEdit={item.numCompanies !== 0}
                      onClickRow={
                        hasPermission
                          ? () => {
                              setVisibleModal(true);
                              setIsCreate(false);
                              setSelectedData(item);
                            }
                          : undefined
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
    [loading, listGroup?.data, handleDelete],
  );

  return (
    <>
      <ModalGroup
        title="Group information"
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
        }}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
      <div className={styles.roleAndPermission}>
        <HeaderPage breadCrumb={BREAD_CRUMB.GROUP} titlePage={t('group')}>
          <PermissionCheck
            options={{
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.GROUP_MASTER,
              action: ActionTypeEnum.CREATE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <Button
                  onClick={() => {
                    setVisibleModal(true);
                    setIsCreate(true);
                    setSelectedData(undefined);
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
                  {t('buttons.createNew')}
                </Button>
              )
            }
          </PermissionCheck>
        </HeaderPage>

        <TableFilter
          disable={loading}
          handleChangeSearchValue={handleChangeSearchValue}
          handleClearSearchValue={handleClearSearchValue}
          handleGetList={handleGetListSearch}
          content={content}
        />
        <TableCp
          rowLabels={rowLabels}
          isEmpty={
            !loading && (listGroup?.data.length === 0 || !listGroup?.data)
          }
          renderRow={renderRow}
          loading={loading}
          page={listGroup?.page}
          pageSize={listGroup?.pageSize}
          totalItem={listGroup?.totalItem}
          totalPage={listGroup?.totalPage}
          handleChangePage={onChangePage}
          isRefreshLoading={params?.isRefreshLoading}
          defaultSort={sort}
          sortFunction={(filed: string, sortType: SortType) =>
            handleGetListSort(filed, sortType)
          }
        />
      </div>
    </>
  );
}
