import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import TableFilter from 'components/common/table-filter/TableFilter';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  fieldTypeAllOptions,
  PARAMS_DEFAULT,
  SortType,
} from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { FeatureConfig } from 'models/api/feature-config/feature-config.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearFeatureConfigErrorsReducer,
  createFeatureConfigActions,
  deleteFeatureConfigActions,
  updateFeatureConfigActions,
} from 'store/feature-config/feature-config.action';
import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const mockData: FeatureConfig[] = [
  {
    id: 'string-1',
    moduleName: '1LaThu',
    companyCode: 'string111',
    fieldType: 'requiredField',
    fieldId: 'string',
    fieldLabel: 'string',
    description: 'string',
    dataType: 'radioButton',
    maxLength: '112',
    minLength: '23',
    enumValues: '222',
    status: 'active',
    fieldRequired: 'yes',
    invisible: false,
    createdAt: '2022-02-28T08:18:54.245Z',
    updatedAt: '2022-02-28T09:18:54.245Z',
    createdUser: { username: 'quan mac tieu' },
    updatedUser: { username: 'quan mac tieu' },
  },
  {
    id: 'string-2',
    moduleName: '2LaThu',
    companyCode: 'string2',
    fieldType: 'requiredField',
    fieldId: 'string',
    fieldLabel: 'string',
    description: 'string',
    dataType: 'radioButton',
    maxLength: '22',
    minLength: '23',
    enumValues: '222',
    status: 'active',
    fieldRequired: 'no',
    invisible: true,
    createdAt: '2022-02-28T08:18:54.245Z',
    updatedAt: '2022-02-28T09:18:54.245Z',
    createdUser: { username: 'quan mac tieu' },
    updatedUser: { username: 'quan mac tieu' },
  },
];

const FeatureConfigContainer = () => {
  const { t } = useTranslation(I18nNamespace.FEATURE_CONFIG);

  const rowLabels = [
    {
      id: 'action',
      label: t('action'),
      sort: false,
      width: '100',
    },
    {
      id: 'fieldId',
      label: t('fieldId'),
      sort: true,
      width: '160',
    },
    {
      id: 'fieldLabel',
      label: t('fieldLabel'),
      sort: true,
      width: '160',
    },

    {
      id: 'moduleName',
      label: t('moduleName'),
      sort: true,
      width: '160',
    },
    {
      id: 'companyCode',
      label: t('companyCode'),
      sort: true,
      width: '160',
    },
    {
      id: 'description',
      label: t('description'),
      sort: true,
      width: '200',
    },
    {
      id: 'createdUser.username',
      label: t('createdUser'),
      sort: true,
      width: '160',
    },
    {
      id: 'createdDate',
      label: t('createdDate'),
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
      id: 'updatedDate',
      label: t('updatedDate'),
      sort: true,
      width: '160',
    },

    {
      id: 'status',
      label: t('status'),
      sort: true,
      width: '160',
    },
    {
      id: 'invisible',
      label: t('invisible'),
      sort: true,
      width: '160',
    },
    {
      id: 'dataType',
      label: t('dataType'),
      sort: true,
      width: '160',
    },
  ];

  const dispatch = useDispatch();
  const { listFeatureConfigs, params } = useSelector(
    (state) => state.featureConfig,
  );

  const [page, setPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 20);
  const [content, setContent] = useState(params.content || '');
  const [fieldType, setFieldType] = useState<string>(params.fieldType || 'all');
  const [sort, setSort] = useState<string>(params.sort || '');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<FeatureConfig>(undefined);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      // const newParams = handleFilterParams(params);
      // dispatch(getListFeatureConfigActions.request(newParams));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  useEffect(() => {
    if (params && params?.isRefreshLoading) {
      // params?.isRefreshLoading = true  set state ve default
      setContent('');
      setPage(1);
      setPageSize(20);
      setFieldType('all');
      setSort('');
    }
  }, [params]);

  useEffect(() => {
    if (params?.isLeftMenu) {
      handleGetList(PARAMS_DEFAULT);
    }
  }, [handleGetList, params?.isLeftMenu]);

  useEffect(() => {
    if (!params?.isLeftMenu) {
      handleGetList({ ...params });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetList]);

  const handleGetListSort = (filed?: string, sortType?: SortType) => {
    let newSort: string = sort;
    newSort = filed ? `${filed}:${sortType}` : '';
    setSort(newSort);
    handleGetList({
      isRefreshLoading: false,
      sort: newSort,
      pageSize,
      page,
      fieldType: fieldType.toString(),
      content: content.trim(),
    });
  };

  const handleGetListSearch = () => {
    setPage(1);
    setSort('');
    if (!content && fieldType === 'all') {
      setPageSize(20);
      handleGetList({
        isRefreshLoading: undefined,
        fieldType: fieldType.toString(),
        pageSize: 20,
        content,
      });
    }
    handleGetList({
      isRefreshLoading: undefined,
      fieldType: fieldType.toString(),
      pageSize,
      content,
    });
  };

  const handleChangeSearchValue = (field: string, value: string) => {
    switch (field) {
      case 'search':
        setContent(value);
        break;
      case 'fieldType':
        setFieldType(value);
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
      fieldType: fieldType.toString(),
      content: content.trim(),
      sort,
    });
  };

  const handleClearSearchValue = () => {
    setContent('');
    setFieldType('all');
    setPage(1);
    setSort('');
    handleGetList({});
    setPageSize(20);
  };

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteFeatureConfigActions.request({
        id,
        getListFeatureConfig: () => {
          if (page > 1 && listFeatureConfigs.data.length === 1) {
            setPage(page - 1);
            handleGetList({
              isRefreshLoading: false,
              page: page - 1,
              pageSize,
              content,
              sort,
              fieldType: fieldType?.toString(),
            });
          } else {
            handleGetList({
              isRefreshLoading: false,
              page,
              pageSize,
              content,
              sort,
              fieldType: fieldType?.toString(),
            });
          }
        },
      }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createFeatureConfigActions.request({
          ...other,
          afterCreate: () => {
            if (isNew) {
              resetForm();
              setContent('');
              setPage(1);
              setPageSize(20);
              setFieldType('all');
              setSort('');
              return;
            }
            resetForm();
            setVisibleModal((e) => !e);
            setIsCreate(false);
            setContent('');
            setPage(1);
            setPageSize(20);
            setFieldType('all');
            setSort('');
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateFeatureConfigActions.request({
          id: selectedData?.id,
          data: other,
          afterCreate: () => {
            if (isNew) {
              resetForm();
              setIsCreate(true);
              handleGetList({
                page,
                pageSize,
                isRefreshLoading: false,
                content: content.trim(),
                sort,
              });
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
            handleGetList({
              page,
              pageSize,
              isRefreshLoading: false,
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
      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const sanitizeData = (data: FeatureConfig) => {
    const finalData = {
      id: data.id,
      fieldId: data.fieldId,
      fieldLabel: data.fieldLabel,
      moduleName: data.moduleName,
      companyCode: data.companyCode,
      description: data.description,
      createdAt: formatDateTime(data?.createdAt),
      'createdUser.username': data.createdUser?.username,
      updatedAt: data.updatedUser?.username && formatDateTime(data?.updatedAt),
      'updatedUser.username': data.updatedUser?.username,
      status: data.status,
      invisible: data.invisible ? 'Yes' : 'No',
      dataType: data.dataType,
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      // TODO: open after
      // if (!loading && mockData.length > 0) {
      if (mockData.length > 0) {
        return (
          <tbody>
            {mockData.map((item, index) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icEdit,
                  function: () => {
                    setVisibleModal(true);
                    setIsCreate(false);
                    setSelectedData(item);
                  },
                  feature: Features.CONFIGURATION,
                  // TODO : open after
                  subFeature: SubFeatures.FEATURE_CONFIG,
                  // action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item?.id),
                  feature: Features.CONFIGURATION,
                  // TODO : open after
                  subFeature: SubFeatures.FEATURE_CONFIG,
                  // action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];
              return (
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    // TODO : open after
                    subFeature: SubFeatures.FEATURE_CONFIG,
                    // action: ActionTypeEnum.UPDATE,
                  }}
                  key={JSON.stringify(item)}
                >
                  {({ hasPermission }) => (
                    <RowComponent
                      isScrollable={isScrollable}
                      data={finalData}
                      actionList={actions}
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
    [handleDelete],
  );

  useEffect(() => {
    if (!visibleModal) {
      dispatch(clearFeatureConfigErrorsReducer());
    }
  }, [dispatch, visibleModal]);

  return (
    <>
      <ModalMaster
        title={t('featureInformation')}
        isOpen={visibleModal}
        // TODO: Open after
        // loading={loading}
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
      <div className={styles.wrapper}>
        <HeaderPage
          breadCrumb={BREAD_CRUMB.FEATURE_CONFIG}
          titlePage={t('featureConfig')}
        >
          <PermissionCheck
            options={{
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.FEATURE_CONFIG,
              // action: ActionTypeEnum.CREATE,
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
                  {t('createNew')}
                </Button>
              )
            }
          </PermissionCheck>
        </HeaderPage>

        <TableFilter
          // TODO: Open after
          // disable={loading}
          content={content}
          fieldType={fieldType}
          fieldTypeOptions={fieldTypeAllOptions}
          handleChangeSearchValue={handleChangeSearchValue}
          handleClearSearchValue={handleClearSearchValue}
          handleGetList={handleGetListSearch}
        />

        <TableCp
          rowLabels={rowLabels}
          // TODO: Open after
          // isEmpty={!loading && (mockData.length === 0 || !mockData)}
          isEmpty={false}
          defaultSort={sort}
          renderRow={renderRow}
          // TODO: Open after
          // loading={loading}
          loading={false}
          isRefreshLoading={params?.isRefreshLoading}
          page={page}
          pageSize={pageSize}
          // TODO: Open after
          // totalItem={listFeatureConfigs?.totalItem}
          // totalPage={listFeatureConfigs?.totalPage}
          totalItem={2}
          totalPage={1}
          handleChangePage={onChangePage}
          sortFunction={(filed: string, sortType: SortType) =>
            handleGetListSort(filed, sortType)
          }
        />
      </div>
    </>
  );
};

export default FeatureConfigContainer;
