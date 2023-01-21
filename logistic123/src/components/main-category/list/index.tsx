import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { MainCategory } from 'models/api/main-category/main-category.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createMainCategoryActions,
  deleteMainCategoryActions,
  getListMainCategoryActions,
  updateMainCategoryActions,
} from 'store/main-category/main-category.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { MAIN_CATEGORY_FIELDS_LIST } from 'constants/dynamic/main-category.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';
import ModalMainCategory from '../common/ModalMainCategory';

const MainCategoryListContainer = () => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonMaincategory,
    modulePage: ModulePage.List,
  });
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dispatch = useDispatch();

  const { loading, listMainCategories, params } = useSelector(
    (state) => state.mainCategory,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<MainCategory>(undefined);
  const [isView, setIsView] = useState<boolean>(false);

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);

    dispatch(
      getListMainCategoryActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const handleDeleteMainCategory = (id: string) => {
    dispatch(
      deleteMainCategoryActions.request({
        id,
        getListMainCategory: () => {
          handleGetList();
        },
      }),
    );
  };

  const onSubmitForm = (formData: MainCategory) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createMainCategoryActions.request({
          ...other,
          afterCreate: () => {
            resetForm();

            if (!isNew) {
              setVisibleModal((e) => !e);
              setIsCreate(false);
            }
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateMainCategoryActions.request({
          id: selectedData?.id,
          data: other,
          afterCreate: () => {
            if (isNew) {
              resetForm();
              setIsCreate(true);
              handleGetList();
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
            handleGetList();
          },
        }),
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        MAIN_CATEGORY_FIELDS_LIST['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        MAIN_CATEGORY_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),

      onPressButtonRight: () => handleDeleteMainCategory(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listMainCategories?.data) {
      return [];
    }
    return listMainCategories?.data?.map((data) => ({
      id: data.id,
      code: data.code || '',
      name: data.name || '',
      acronym: data?.acronym || '',
      description: data?.description || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUser: data.createdUser?.username || '',
      updatedAt:
        (data.updatedUser?.username && formatDateTime(data?.updatedAt)) || '',
      updatedUser: data.updatedUser?.username || '',
      status: data.status || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listMainCategories?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
                setIsView(true);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.MAIN_CATEGORY,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.MAIN_CATEGORY,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.MAIN_CATEGORY,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
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
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST['Main category code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST['Main category name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'acronym',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST.MainAcronym,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_CATEGORY_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, handleDelete],
  );

  return (
    <>
      <ModalMainCategory
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
          setIsView(false);
        }}
        isView={isView}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
      <div className={styles.wrapper}>
        <HeaderPage
          breadCrumb={BREAD_CRUMB.MAIN_CATEGORY}
          titlePage={renderDynamicModuleLabel(
            listModuleDynamicLabels,
            DynamicLabelModuleName.ConfigurationCommonMaincategory,
          )}
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
                  {renderDynamicLabel(
                    dynamicLabels,
                    MAIN_CATEGORY_FIELDS_LIST['Create New'],
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
          moduleTemplate={MODULE_TEMPLATE.mainCategory}
          fileName="Main Category"
          dataTable={dataTable}
          height="calc(100vh - 137px)"
          getList={handleGetList}
        />
      </div>
    </>
  );
};

export default MainCategoryListContainer;
