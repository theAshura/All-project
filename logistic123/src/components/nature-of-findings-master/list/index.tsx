import { useMemo, useState } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';

import images from 'assets/images/images';
import { useDispatch, useSelector } from 'react-redux';
import HeaderPage from 'components/common/header-page/HeaderPage';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  createNatureOfFindingsMasterActions,
  deleteNatureOfFindingsMasterActions,
  getListNatureOfFindingsMasterActions,
  updateNatureOfFindingsMasterActions,
} from 'store/nature-of-findings-master/nature-of-findings-master.action';
import { NatureOfFindingsMaster } from 'models/api/nature-of-findings-master/nature-of-findings-master.model';

import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
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
  NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS,
  NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS,
} from 'constants/dynamic/natureOfFindings.const';

import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const NatureOfFindingsMasterContainer = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const [selectedData, setSelectedData] =
    useState<NatureOfFindingsMaster>(undefined);

  const dispatch = useDispatch();

  const { loading, listNatureOfFindingsMaster, params } = useSelector(
    (state) => state.natureOfFindingsMaster,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
    modulePage: ModulePage.List,
  });

  const dynamicFieldsModal = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);

    dispatch(
      getListNatureOfFindingsMasterActions.request({
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
        createNatureOfFindingsMasterActions.request({
          ...other,
          afterCreate: () => {
            handleGetList();
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
        updateNatureOfFindingsMasterActions.request({
          id: selectedData?.id,
          body: other,
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

  const handleDeleteNatureOfFindingsMaster = (id: string) => {
    dispatch(
      deleteNatureOfFindingsMasterActions.request({
        id,
        getListNatureOfFindingsMaster: () => {
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
        NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFields,
        NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicFields,
        NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFields,
        NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS.Delete,
      ),
      onPressButtonRight: () => handleDeleteNatureOfFindingsMaster(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listNatureOfFindingsMaster?.data) {
      return [];
    }
    return listNatureOfFindingsMaster?.data?.map((data) => ({
      id: data.id,
      code: data.code || '',
      name: data.name || '',
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
  }, [listNatureOfFindingsMaster?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS.Action,
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
              subFeature: SubFeatures.NATURE_OF_FINDINGS_MASTER,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
            },
            data?.companyId && {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.NATURE_OF_FINDINGS_MASTER,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
            },
            data?.companyId && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.NATURE_OF_FINDINGS_MASTER,
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
          dynamicFields,
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Nature of findings code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicFields,
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Nature of findings name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicFields,
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Created date'],
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
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Updated date'],
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
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS.Status,
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
          NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Created by company'],
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
        breadCrumb={BREAD_CRUMB.NATURE_OF_FINDINGS_MASTER}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.NATURE_OF_FINDINGS_MASTER,
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
                  NATURE_OF_FINDINGS_DYNAMIC_LIST_FIELDS['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.natureOfFindingsMaster}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
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
          NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
            'Nature of findings information'
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
        isView={isView}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

export default NatureOfFindingsMasterContainer;
