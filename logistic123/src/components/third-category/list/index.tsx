import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { ThirdCategory } from 'models/api/third-category/third-category.model';
import { Action, CommonApiParam } from 'models/common.model';
import {
  createThirdCategoryActions,
  deleteThirdCategoryActions,
  getListThirdCategoryActions,
  updateThirdCategoryActions,
} from 'store/third-category/third-category.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { THIRD_CATEGORY_DYNAMIC_FIELDS_LIST } from 'constants/dynamic/third-category.const';
import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const ThirdCategoryListContainer = () => {
  const dispatch = useDispatch();

  const { loading, listThirdCategories, params } = useSelector(
    (state) => state.thirdCategory,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isView, setIsView] = useState<boolean>(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ThirdCategory>(undefined);
  const [, setDivisionSelected] = useState(null);
  const [, setModalFormDivisionVisible] = useState(false);
  const [, setViewMode] = useState(false);
  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListThirdCategoryActions.request({
        ...newParams,
        page: 1,
        pageSize: -1,
      }),
    );
  };

  const dynamicLabels = useDynamicLabels({
    // moduleKey: DynamicLabelModuleName.ConfigurationInspectionThirdCategory,
    moduleKey: DynamicLabelModuleName.ConfigurationCommonVessel,
    modulePage: ModulePage.List,
  });

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createThirdCategoryActions.request({
          ...other,
          afterCreate: () => {
            handleGetList({
              isRefreshLoading: false,
            });
            if (isNew) {
              resetForm();
              return;
            }
            setVisibleModal(false);
            setIsCreate(false);
            setIsEdit(false);
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateThirdCategoryActions.request({
          id: selectedData?.id,
          data: other,
          handleSuccess: () => {
            handleGetList({
              isRefreshLoading: false,
            });
            if (isNew) {
              resetForm();
              setIsCreate(true);
              setIsEdit(true);
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
            setIsEdit(false);
          },
        }),
      );
    }
  };

  const editDetail = useCallback((id?: string) => {
    setDivisionSelected(id);
    setModalFormDivisionVisible(true);
    setViewMode(false);
  }, []);

  const handleDeleteThirdCategory = (id: string) => {
    dispatch(
      deleteThirdCategoryActions.request({
        id,
        handleSuccess: () => {
          handleGetList({
            isRefreshLoading: false,
          });
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        THIRD_CATEGORY_DYNAMIC_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        THIRD_CATEGORY_DYNAMIC_FIELDS_LIST.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        THIRD_CATEGORY_DYNAMIC_FIELDS_LIST.Delete,
      ),
      onPressButtonRight: () => handleDeleteThirdCategory(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listThirdCategories?.data) {
      return [];
    }
    return listThirdCategories?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
      description: data?.description || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUserUsername: data?.createdUser?.username || '',
      updatedAt: data?.updatedUser?.username
        ? formatDateTime(data?.updatedAt)
        : '',
      updatedUserUsername: data?.updatedUser?.username || '',
      status: data?.status || '',
      companyName: data?.company?.name || '',
    }));
  }, [listThirdCategories?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST.Action,
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
                setIsView(true);
                setIsCreate(false);
                setIsEdit(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.THIRD_CATEGORY,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setIsEdit(true);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.THIRD_CATEGORY,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.THIRD_CATEGORY,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];

          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Third category code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Third category name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUserUsername',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUserUsername',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, handleDelete],
  );
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.THIRD_CATEGORY}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionThirdCategory,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.THIRD_CATEGORY,
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
                  THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.thirdCategory}
        fileName="Third Category"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        view={(id) => {
          editDetail(id);
          return true;
        }}
        getList={handleGetList}
        classNameHeader={styles.header}
      />

      <ModalMaster
        title={renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_LIST['Third category information'],
        )}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
          setIsEdit(undefined);
          setIsView(false);
        }}
        isView={isView}
        isCreate={isCreate}
        isEdit={isEdit}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

export default ThirdCategoryListContainer;
