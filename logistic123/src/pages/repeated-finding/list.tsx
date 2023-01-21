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
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';

import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';
import { useDispatch, useSelector } from 'react-redux';
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
  REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS,
  REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS,
} from 'constants/dynamic/repeatedFindingCal.const';
import { RepeateFindingCalculation } from './utils/model';
import {
  createRepeateFindingCalculationActions,
  getListRepeateFindingCalculationActions,
  deleteRepeateFindingCalculationActions,
  updateRepeateFindingCalculationActions,
} from './store/action';
import ModalMaster from './modals/ModalMaster';
import styles from '../../components/list-common.module.scss';

const RepeateFindingCalculationContainerComponent = () => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dispatch = useDispatch();
  const { loading, listRepeateFindingCalculation, params } = useSelector(
    (state) => state.repeatedFindingCal,
  );
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedData, setSelectedData] =
    useState<RepeateFindingCalculation>(undefined);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
    modulePage: ModulePage.List,
  });

  const dynamicFieldsModal = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListRepeateFindingCalculationActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createRepeateFindingCalculationActions.request({
          ...other,
          afterCreate: () => {
            resetForm();

            if (!isNew) {
              setVisibleModal((e) => !e);
              setIsCreate(false);
            }

            handleGetList();
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateRepeateFindingCalculationActions.request({
          id: selectedData?.id,
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

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteRepeateFindingCalculationActions.request({
        id,
        getListRepeateFindingCalculation: () => {
          handleGetList();
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicFields,
        REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFields,
        REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      onPressButtonRight: () => handleDeleteCharterOwner(id),
      txButtonLeft: renderDynamicLabel(
        dynamicFields,
        REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFields,
        REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS.Delete,
      ),
    });
  };
  const dataTable = useMemo(() => {
    if (!listRepeateFindingCalculation?.data) {
      return [];
    }
    return listRepeateFindingCalculation?.data?.map((data) => ({
      id: data.id,
      description: data?.description || '',
      status: data?.status || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      updatedAt: formatDateTime(data?.updatedAt) || '',
      timesOfRepeating: data?.timesOfRepeating || '',
      coEfficient: data?.coEfficient || '',
      company: data?.company?.name || '',
      createdUser: data?.createdUser?.username || '',
      updatedUser: data?.updatedUser?.username || '',
    }));
  }, [listRepeateFindingCalculation?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const dataSelected = listRepeateFindingCalculation?.data?.find(
            (i) => data?.id === i.id,
          );

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setSelectedData(dataSelected);
                setIsCreate(false);
                setIsView(true);
                setIsEdit(false);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.REPEATED_FINDING,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(dataSelected);
                setIsEdit(true);
                setIsView(false);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.REPEATED_FINDING,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(dataSelected?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.REPEATED_FINDING,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];
          if (!data) {
            actions = [];
          }
          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'timesOfRepeating',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS['Time of repeating'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'coEfficient',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS['Co-efficient'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS['Create date'],
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
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS['Create by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS['Update date'],
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
          REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS['Update by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicFields,
      isMultiColumnFilter,
      listRepeateFindingCalculation?.data,
      handleDelete,
    ],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.REPEATED_FINDING}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.REPEATED_FINDING,
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
                  dynamicFields,
                  REPEATED_FINDING_CALCULATION_DYNAMIC_LIST_FIELDS[
                    'Create New'
                  ],
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
        moduleTemplate={MODULE_TEMPLATE.repeatedFindingCalculation}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
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
          REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
            'Repeated finding calculation'
          ],
        )}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
          setIsView(false);
        }}
        toggleEdit={() => {
          setIsEdit(false);
        }}
        isView={isView}
        isEdit={isEdit}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};
const RepeateFindingCalculationContainer = () => (
  <WrapComponentRole
    componentContainer={<RepeateFindingCalculationContainerComponent />}
  />
);

export default RepeateFindingCalculationContainer;
