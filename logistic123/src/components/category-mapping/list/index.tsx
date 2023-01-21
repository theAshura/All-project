import { useEffect, useMemo, useState } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCategoryMappingActions,
  getCategoryMappingDetailActions,
  getListCategoryMappingActions,
  updateCategoryMappingActions,
} from 'store/category-mapping/category-mapping.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import HeaderPage from 'components/common/header-page/HeaderPage';
import {
  clearMainCategoryReducer,
  getListMainCategoryActions,
} from 'store/main-category/main-category.action';
import {
  clearSecondCategoryReducer,
  getListSecondCategoryActions,
} from 'store/second-category/second-category.action';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS,
  CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS,
} from 'constants/dynamic/categoryMapping';
import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const CategoryMappingContainerComponent = () => {
  const dispatch = useDispatch();
  const { loading, listCategoryMappings, params, categoryMappingDetail } =
    useSelector((state) => state.categoryMapping);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>(undefined);
  const [categoryMappingId, setCategoryMappingId] = useState<string>(undefined);
  const [isView, setIsView] = useState<boolean>(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
    modulePage: ModulePage.List,
  });

  const dynamicFieldsModal = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);

    dispatch(
      getListCategoryMappingActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  useEffectOnce(() => {
    dispatch(
      getListMainCategoryActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(getListSecondCategoryActions.request({ pageSize: -1 }));
    return () => {
      dispatch(clearMainCategoryReducer());
      dispatch(clearSecondCategoryReducer());
    };
  });

  useEffect(() => {
    if (selectedId && visibleModal) {
      dispatch(getCategoryMappingDetailActions.request(selectedId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, visibleModal]);

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createCategoryMappingActions.request({
          ...other,
          afterCreate: () => {
            handleGetList();
            if (isNew) {
              resetForm();
              setIsCreate(true);
              return;
            }
            setVisibleModal(false);
            setIsCreate(false);
          },
        }),
      );
    } else {
      const { isNew, resetForm, id, ...other } = formData;
      dispatch(
        updateCategoryMappingActions.request({
          id: categoryMappingId,
          data: other,
          afterUpdate: () => {
            handleGetList();
            if (isNew) {
              resetForm();
              setIsCreate(true);
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
          },
        }),
      );
    }
  };

  const dataTable = useMemo(() => {
    if (!listCategoryMappings?.data) {
      return [];
    }
    return listCategoryMappings?.data?.map((data) => ({
      id: data.id,
      mainCategory: data?.mainCategory?.name || '',
      secondCategory: data?.secondCategory?.name || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUser: data.createdUser?.username || '',
      updatedAt:
        (data.updatedUser?.username && formatDateTime(data?.updatedAt)) || '',
      updatedUser: data.updatedUser?.username || '',
      companyId: data?.company?.id || '',
      company: data?.company?.name || '',
    }));
  }, [listCategoryMappings?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const dataSelected = listCategoryMappings?.data?.find(
            (i) => data?.id === i.id,
          );
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedId(dataSelected?.mainCategoryId);
                setIsView(true);
              },
              buttonType: ButtonType.Blue,
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CATEGORY_MAPPING,
              action: ActionTypeEnum.VIEW,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setCategoryMappingId(dataSelected?.id);
                setSelectedId(dataSelected?.mainCategoryId);
                setIsView(false);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CATEGORY_MAPPING,
              action: ActionTypeEnum.UPDATE,
            },
          ];

          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'mainCategory',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Main category'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'secondCategory',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Second category'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicFields, isMultiColumnFilter, listCategoryMappings?.data],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.CATEGORY_MAPPING}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CATEGORY_MAPPING,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  setVisibleModal(true);
                  setIsCreate(true);
                  setSelectedId(undefined);
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
                {renderDynamicLabel(
                  dynamicFields,
                  CATEGORY_MAPPING_DYNAMIC_LIST_FIELDS['Create New'],
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
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.categoryMapping}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        dynamicLabels={dynamicFields}
      />
      <ModalMaster
        title={renderDynamicLabel(
          dynamicFieldsModal,
          CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS[
            'Category mapping information'
          ],
        )}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal(false);
          setSelectedId(undefined);
          setIsCreate(false);
          setIsView(false);
        }}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        dataDetail={!isCreate ? categoryMappingDetail : undefined}
        setIsCreate={(value) => setIsCreate(value)}
        isView={isView}
      />
    </div>
  );
};

const CategoryMappingContainer = () => (
  <WrapComponentRole
    componentContainer={<CategoryMappingContainerComponent />}
  />
);

export default CategoryMappingContainer;
