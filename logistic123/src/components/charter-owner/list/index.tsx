import { useMemo, useState } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';

import images from 'assets/images/images';
import { useDispatch, useSelector } from 'react-redux';

import { CharterOwner } from 'models/api/charter-owner/charter-owner.model';
import {
  createCharterOwnerActions,
  deleteCharterOwnerActions,
  getListCharterOwnerActions,
  updateCharterOwnerActions,
} from 'store/charter-owner/charter-owner.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
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
  CHARTER_OWNER_DYNAMIC_DETAIL_FIELDS,
  CHARTER_OWNER_DYNAMIC_LIST_FIELDS,
} from 'constants/dynamic/charterOwner.const';
import ModalCharterOwner from '../common/ModalCharterOwner';
import styles from '../../list-common.module.scss';

const CharterOwnerContainer = () => {
  const dispatch = useDispatch();

  const { loading, listCharterOwners, params } = useSelector(
    (state) => state.charterOwner,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<CharterOwner>(undefined);
  const [isView, setIsView] = useState<boolean>(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionCharterOwner,
    modulePage: ModulePage.List,
  });

  const dynamicFieldsModal = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionCharterOwner,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);

    dispatch(
      getListCharterOwnerActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteCharterOwnerActions.request({
        id,
        getListCharterOwner: () => {
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
        CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFields,
        CHARTER_OWNER_DYNAMIC_LIST_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicFields,
        CHARTER_OWNER_DYNAMIC_LIST_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFields,
        CHARTER_OWNER_DYNAMIC_LIST_FIELDS.Delete,
      ),
      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listCharterOwners?.data) {
      return [];
    }
    return listCharterOwners?.data?.map((data) => ({
      id: data?.id,
      code: data.code,
      name: data.name,
      description: data?.description,
      createdAt: formatDateTime(data?.createdAt),
      createdUser: data.createdUser?.username,
      updatedAt: data.updatedUser?.username && formatDateTime(data?.updatedAt),
      updatedUser: data.updatedUser?.username,
      status: data.status,
      company: data?.company?.name,
      companyId: data?.company?.id,
    }));
  }, [listCharterOwners?.data]);

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createCharterOwnerActions.request({
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
        updateCharterOwnerActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
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

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const dataSelected = listCharterOwners?.data?.find(
            (i) => data?.id === i.id,
          );

          let actions: Action[] = [
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
              subFeature: SubFeatures.CHARTER_OWNER,
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
              subFeature: SubFeatures.CHARTER_OWNER,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(dataSelected?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CHARTER_OWNER,
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
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicFields,
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Charter/Owner code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicFields,
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Charter/Owner name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicFields,
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Created date'],
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
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Updated date'],
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
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS.Status,
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
          CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicFields, isMultiColumnFilter, listCharterOwners?.data, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.CHARTER_OWNER}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionCharterOwner,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CHARTER_OWNER,
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
                  CHARTER_OWNER_DYNAMIC_LIST_FIELDS['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.CharterOwner}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionCharterOwner,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicFields}
      />
      <ModalCharterOwner
        title={renderDynamicLabel(
          dynamicFieldsModal,
          CHARTER_OWNER_DYNAMIC_DETAIL_FIELDS['Charter/Owner information'],
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

export default CharterOwnerContainer;
