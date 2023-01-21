import { useMemo, useState } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';

import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { useDispatch, useSelector } from 'react-redux';
import { CDI } from 'models/api/cdi/cdi.model';
import {
  createCDIActions,
  deleteCDIActions,
  getListCDIActions,
  updateCDIActions,
} from 'store/cdi/cdi.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  CDI_DYNAMIC_DETAIL_FIELDS,
  CDI_DYNAMIC_LIST_FIELDS,
} from 'constants/dynamic/cdi.const';
import styles from '../../list-common.module.scss';
import ModalCDI from '../common/ModalCDI';

const CDIContainer = () => {
  const dispatch = useDispatch();
  const { loading, listCDIs, params } = useSelector((state) => state.cdi);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<CDI>(undefined);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isView, setIsView] = useState<boolean>(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
    modulePage: ModulePage.List,
  });

  const dynamicFieldsModal = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);

    dispatch(
      getListCDIActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const handleDeleteCDI = (id: string) => {
    dispatch(
      deleteCDIActions.request({
        id,
        getListCDI: () => {
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
        CDI_DYNAMIC_LIST_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFields,
        CDI_DYNAMIC_LIST_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicFields,
        CDI_DYNAMIC_LIST_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFields,
        CDI_DYNAMIC_LIST_FIELDS.Delete,
      ),
      onPressButtonRight: () => handleDeleteCDI(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listCDIs?.data) {
      return [];
    }
    return listCDIs?.data?.map((data) => ({
      id: data?.id,
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
  }, [listCDIs?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          CDI_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const dataSelected = listCDIs?.data?.find((i) => data?.id === i.id);

          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setIsView(true);
                setSelectedData(dataSelected);
              },
              buttonType: ButtonType.Blue,
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CDI,
              action: ActionTypeEnum.VIEW,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setIsView(false);
                setSelectedData(dataSelected);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CDI,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(dataSelected?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CDI,
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
          CDI_DYNAMIC_LIST_FIELDS['CDI code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicFields,
          CDI_DYNAMIC_LIST_FIELDS['CDI name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicFields,
          CDI_DYNAMIC_LIST_FIELDS.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          CDI_DYNAMIC_LIST_FIELDS['Created date'],
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
          CDI_DYNAMIC_LIST_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          CDI_DYNAMIC_LIST_FIELDS['Updated date'],
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
          CDI_DYNAMIC_LIST_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          CDI_DYNAMIC_LIST_FIELDS.Status,
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
          CDI_DYNAMIC_LIST_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicFields, isMultiColumnFilter, listCDIs?.data, handleDelete],
  );

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createCDIActions.request({
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
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateCDIActions.request({
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

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.CDI}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CDI,
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
                  CDI_DYNAMIC_LIST_FIELDS['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.cdi}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicFields}
      />

      <ModalCDI
        title={renderDynamicLabel(
          dynamicFieldsModal,
          CDI_DYNAMIC_DETAIL_FIELDS[
            'Chemical distribution institute information'
          ],
        )}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal(false);
          setSelectedData(undefined);
          setIsCreate(false);
          setIsView(false);
        }}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
        isView={isView}
      />
    </div>
  );
};

export default CDIContainer;
