import images from 'assets/images/images';
import cx from 'classnames';
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
import { formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSecondCategoryActions,
  deleteSecondCategoryActions,
  getListSecondCategoryActions,
  updateSecondCategoryActions,
} from 'store/second-category/second-category.action';

import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { SecondCategory } from 'models/api/second-category/second-category.model';
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
  SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD,
  SECOND_CATEGORY_DYNAMIC_LIST_FIELD,
} from 'constants/dynamic/secondCategory.const';
import ModalMaster from '../common/ModalMaster';
import styles from '../../list-common.module.scss';

const SecondCategoryListContainer = () => {
  const dispatch = useDispatch();

  const { loading, listSecondCategories, params } = useSelector(
    (state) => state.secondCategory,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<SecondCategory>(undefined);
  const [isView, setIsView] = useState<boolean>(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
    modulePage: ModulePage.List,
  });

  const dynamicFieldsModal = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListSecondCategoryActions.request({
        ...newParams,
        page: 1,
        pageSize: -1,
      }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createSecondCategoryActions.request({
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
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateSecondCategoryActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
            handleGetList({
              isRefreshLoading: false,
            });
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

  const handleDeleteSecondCategory = (id: string) => {
    dispatch(
      deleteSecondCategoryActions.request({
        id,
        getListSecondCategory: () => {
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
        dynamicFieldsModal,
        SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFieldsModal,
        SECOND_CATEGORY_DYNAMIC_LIST_FIELD[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicFieldsModal,
        SECOND_CATEGORY_DYNAMIC_LIST_FIELD.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFieldsModal,
        SECOND_CATEGORY_DYNAMIC_LIST_FIELD.Delete,
      ),
      onPressButtonRight: () => handleDeleteSecondCategory(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listSecondCategories?.data) {
      return [];
    }
    return listSecondCategories?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
      acronym: data?.acronym || '',
      description: data?.description || '',
      createdDate: formatDateTime(data?.createdAt) || '',
      createdUser: data?.createdUser.username || '',
      updatedDate: data?.updatedUser ? formatDateTime(data?.updatedAt) : '',
      updatedUser: data?.updatedUser?.username || '',
      status: data?.status || '',
      company: data?.company.name || '',
    }));
  }, [listSecondCategories?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD.Action,
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
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.SECOND_CATEGORY,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.SECOND_CATEGORY,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.SECOND_CATEGORY,
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
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Second category code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Second category name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'acronym',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD.SecAcronym,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdDate',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdUser',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Created user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedUser',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Updated user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicFields,
          SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicFields, isMultiColumnFilter, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.SECOND_CATEGORY}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.SECOND_CATEGORY,
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
                  dynamicFieldsModal,
                  SECOND_CATEGORY_DYNAMIC_LIST_FIELD['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.secondCategory}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicFields}
      />
      <ModalMaster
        title={renderDynamicLabel(
          dynamicFieldsModal,
          SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD['Second category information'],
        )}
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
    </div>
  );
};

export default SecondCategoryListContainer;
