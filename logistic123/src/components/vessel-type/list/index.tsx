import images from 'assets/images/images';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useCallback, useMemo, useState } from 'react';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { useDispatch, useSelector } from 'react-redux';
import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import {
  createVesselTypeActions,
  deleteVesselTypeActions,
  getListVesselTypeActions,
  updateVesselTypeActions,
} from 'store/vessel-type/vessel-type.action';
import { Action, CommonApiParam } from 'models/common.model';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import cx from 'classnames';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { VESSEL_TYPE_FIELDS_LIST } from 'constants/dynamic/vessel-type.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';
import ModalVesselType from '../common/ModalVesselType';

export default function VesselTypeContainer() {
  const dispatch = useDispatch();
  const { loading, listVesselTypes, params } = useSelector(
    (state) => state.vesselType,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const { userInfo } = useSelector((state) => state.authenticate);

  const [page, setPage] = useState(params?.page || 1);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonVesseltype,
    modulePage: ModulePage.List,
  });
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<VesselType>(undefined);
  const [, setDivisionSelected] = useState(null);
  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListVesselTypeActions.request({
          ...newParams,
          page: 1,
          pageSize: -1,
        }),
      );
    },
    [dispatch],
  );

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteVesselTypeActions.request({
        id,
        getListVesselType: () => {
          if (page > 1 && listVesselTypes.data.length === 1) {
            setPage(page - 1);
            handleGetList({
              isRefreshLoading: false,
            });
          } else {
            handleGetList({
              isRefreshLoading: false,
            });
          }
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
        VESSEL_TYPE_FIELDS_LIST['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        VESSEL_TYPE_FIELDS_LIST[
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
      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createVesselTypeActions.request({
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
        updateVesselTypeActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
            if (isNew) {
              resetForm();
              // setIsEdit(true);
              setIsCreate(true);
              handleGetList({
                isRefreshLoading: false,
              });
              return;
            }
            setVisibleModal((e) => !e);
            // setIsEdit(false);
            setIsCreate(false);
            handleGetList({
              isRefreshLoading: false,
            });
          },
        }),
      );
    }
  };
  const viewDetail = useCallback((id) => {
    setDivisionSelected(id);
  }, []);

  const editDetail = useCallback((id?: string) => {
    setDivisionSelected(id);
  }, []);
  const dataTable = useMemo(() => {
    if (!listVesselTypes?.data) {
      return [];
    }
    return listVesselTypes?.data?.map((data) => ({
      id: data?.id,
      code: data?.code || '',
      name: data?.name || '',
      vettingRiskScore: data?.vettingRiskScore,
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUserUsername: data?.createdUser?.username || '',
      updatedAt: data?.updatedUser?.username
        ? formatDateTime(data?.updatedAt)
        : '',
      updatedUserUsername: data?.updatedUser?.username || '',
      status: data?.status || '',
      companyName: data?.company?.name || '',
      icon: data?.icon || null,
      description: data?.description || '',
    }));
  }, [listVesselTypes?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_TYPE_FIELDS_LIST.Action,
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
              subFeature: SubFeatures.VESSEL_TYPE,
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
              subFeature: SubFeatures.VESSEL_TYPE,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VESSEL_TYPE,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];
          if (userInfo?.mainCompanyId === data?.companyId) {
            actions.push({
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VESSEL_TYPE,
              action: ActionTypeEnum.UPDATE,
            });
          }

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
          VESSEL_TYPE_FIELDS_LIST['Vessel type code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_TYPE_FIELDS_LIST['Vessel type name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vettingRiskScore',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_TYPE_FIELDS_LIST['Vetting management risk'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_TYPE_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_TYPE_FIELDS_LIST['Created date'],
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
          VESSEL_TYPE_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_TYPE_FIELDS_LIST['Updated date'],
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
          VESSEL_TYPE_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          VESSEL_TYPE_FIELDS_LIST.Status,
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
          VESSEL_TYPE_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo?.mainCompanyId,
      handleDelete,
      editDetail,
    ],
  );
  // render
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.VESSEL_TYPE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVesseltype,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.VESSEL_TYPE,
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
                  VESSEL_TYPE_FIELDS_LIST['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.vesselType}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVesseltype,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicLabels}
      />

      <ModalVesselType
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
}
