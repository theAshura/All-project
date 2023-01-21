import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { VALUE_MANAGEMENT_FIELDS_LIST } from 'constants/dynamic/value-management.const';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../components/list-common.module.scss';
import ModalMaster from './modals/ModalMaster';
import {
  createValueManagementActions,
  deleteValueManagementActions,
  getListValueManagementActions,
  updateValueManagementActions,
} from './store/action';
import { GetValueManagement } from './utils/model';

const ValueManagementContainerComponent = () => {
  const dispatch = useDispatch();
  const { loading, listValueManagements, params } = useSelector(
    (state) => state.valueManagement,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] =
    useState<GetValueManagement>(undefined);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(getListValueManagementActions.request(newParams));
    },
    [dispatch],
  );

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, handleSuccess, ...other } = formData;
      dispatch(
        createValueManagementActions.request({
          ...other,
          handleSuccess: () => {
            if (!isNew) {
              setVisibleModal((e) => !e);
              setIsCreate(false);
            }
            handleSuccess();
            handleGetList({
              isRefreshLoading: false,
            });
          },
        }),
      );
    } else {
      const { isNew, handleSuccess, ...other } = formData;
      dispatch(
        updateValueManagementActions.request({
          id: selectedData?.id,
          data: other,
          handleSuccess: () => {
            handleGetList({
              isRefreshLoading: false,
            });
            if (isNew) {
              handleSuccess();
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

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(
        deleteValueManagementActions.request({
          id,
          handleSuccess: () => {
            handleGetList({
              isRefreshLoading: false,
            });
          },
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAnswerValue,
    modulePage: ModulePage.List,
  });

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),

        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST.Delete,
        ),
        onPressButtonRight: () => handleDeleteItem(id),
      });
    },
    [dynamicLabels, handleDeleteItem],
  );

  const dataTable = useMemo(() => {
    if (!listValueManagements?.data) {
      return [];
    }
    return listValueManagements?.data?.map((data) => ({
      id: data.id,
      code: data.code || '',
      number: data.number,
      status: data.status || '',
      description: data?.description || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUserUsername: data.createdUser?.username || '',
      updatedAt:
        (data.updatedUser?.username && formatDateTime(data?.updatedAt)) || '',
      updatedUserUsername: data.updatedUser?.username || '',
      companyName: data.company?.name || '',
    }));
  }, [listValueManagements?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST.Action,
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
              subFeature: SubFeatures.ANSWER_VALUE,
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
              subFeature: SubFeatures.ANSWER_VALUE,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.ANSWER_VALUE,
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
          VALUE_MANAGEMENT_FIELDS_LIST['Value number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'number',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST['Value code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST['Created date'],
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
          VALUE_MANAGEMENT_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST['Updated date'],
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
          VALUE_MANAGEMENT_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VALUE_MANAGEMENT_FIELDS_LIST['Created by company'],
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
        breadCrumb={BREAD_CRUMB.VALUE_MANAGEMENT}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionAnswerValue,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.ANSWER_VALUE,
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
                  VALUE_MANAGEMENT_FIELDS_LIST['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.valueManagement}
        fileName="Value Management"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />
      <ModalMaster
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

const ValueManagementContainer = () => (
  <WrapComponentRole
    componentContainer={<ValueManagementContainerComponent />}
  />
);

export default ValueManagementContainer;
