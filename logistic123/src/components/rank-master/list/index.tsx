import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
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
import PermissionCheck from 'hoc/withPermissionCheck';
import { RankMaster } from 'models/api/rank-master/rank-master.model';
import { Action, CommonApiParam } from 'models/common.model';
import {
  createRankMasterActions,
  deleteRankMasterActions,
  getListRankMasterActions,
  updateRankMasterActions,
} from 'store/rank-master/rank-master.action';
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
  RANK_DYNAMIC_DETAIL_FIELDS,
  RANK_DYNAMIC_LIST_FIELDS,
} from 'constants/dynamic/rank.const';
import styles from '../../list-common.module.scss';
import ModalRank from '../common/ModalMaster';

const RankMasterContainer = () => {
  const dispatch = useDispatch();

  const { loading, listRankMaster, params } = useSelector(
    (state) => state.rankMaster,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<RankMaster>(undefined);
  const [isView, setIsView] = useState<boolean>(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionRank,
    modulePage: ModulePage.List,
  });

  const dynamicFieldsModal = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionRank,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);

    dispatch(
      getListRankMasterActions.request({ ...newParams, page: 1, pageSize: -1 }),
    );
  };

  const handleDeleteRankMaster = (id: string) => {
    dispatch(
      deleteRankMasterActions.request({
        id,
        getListRankMaster: () => {
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
        dynamicFields,
        RANK_DYNAMIC_LIST_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFields,
        RANK_DYNAMIC_LIST_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      onPressButtonRight: () => handleDeleteRankMaster(id),
      txButtonLeft: renderDynamicLabel(
        dynamicFields,
        RANK_DYNAMIC_LIST_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFields,
        RANK_DYNAMIC_LIST_FIELDS.Delete,
      ),
    });
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createRankMasterActions.request({
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
        updateRankMasterActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
            if (isNew) {
              resetForm();
              setIsCreate(true);
              handleGetList({
                isRefreshLoading: false,
              });
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
            handleGetList({
              isRefreshLoading: false,
            });
          },
        }),
      );
    }
  };
  const dataTable = useMemo(() => {
    if (!listRankMaster?.data) {
      return [];
    }
    return listRankMaster?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
      type: data?.type === 'ship' ? 'Ship' : 'Shore',
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
  }, [listRankMaster?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS.Action,
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
              subFeature: SubFeatures.RANK_MASTER,
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
              subFeature: SubFeatures.RANK_MASTER,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.RANK_MASTER,
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
          RANK_DYNAMIC_LIST_FIELDS['Rank code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS['Rank name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS.Type,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUserUsername',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUserUsername',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicFields,
          RANK_DYNAMIC_LIST_FIELDS['Created by company'],
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
        breadCrumb={BREAD_CRUMB.RANK_MASTER}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionRank,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.RANK_MASTER,
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
                  RANK_DYNAMIC_LIST_FIELDS['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.rank}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionRank,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        dynamicLabels={dynamicFields}
      />

      <ModalRank
        title={renderDynamicLabel(
          dynamicFieldsModal,
          RANK_DYNAMIC_DETAIL_FIELDS['Rank information'],
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

export default RankMasterContainer;
