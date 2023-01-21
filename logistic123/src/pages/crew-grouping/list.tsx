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
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { CREW_GROUPING_FIELDS_LIST } from 'constants/dynamic/crew-grouping.const';
import ModalMaster from './modals/ModalMaster';
import styles from '../../components/list-common.module.scss';
import { CrewGrouping } from './utils/model';
import {
  createCrewGroupingActions,
  deleteCrewGroupingActions,
  getListCrewGroupingActions,
  updateCrewGroupingActions,
} from './store/action';

const CrewGroupingContainer = () => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dispatch = useDispatch();
  const { loading, listCrewGroupings, params } = useSelector(
    (state) => state.crewGrouping,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<CrewGrouping>(undefined);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonCrewGrouping,
    modulePage: ModulePage.List,
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListCrewGroupingActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, reset, ...other } = formData;
      dispatch(
        createCrewGroupingActions.request({
          ...other,
          afterCreate: () => {
            reset();

            if (!isNew) {
              setVisibleModal((e) => !e);
              setIsCreate(false);
            }

            handleGetList();
          },
        }),
      );
    } else {
      const { isNew, reset, ...other } = formData;
      dispatch(
        updateCrewGroupingActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
            handleGetList();
            if (isNew) {
              reset();
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
      deleteCrewGroupingActions.request({
        id,
        getListCrewGrouping: () => {
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
        dynamicLabels,
        CREW_GROUPING_FIELDS_LIST['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        CREW_GROUPING_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        CREW_GROUPING_FIELDS_LIST.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        CREW_GROUPING_FIELDS_LIST.Delete,
      ),
      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listCrewGroupings?.data) {
      return [];
    }
    return listCrewGroupings?.data?.map((data) => ({
      id: data.id,
      code: data.code || '',
      name: data.name || '',
      officers: data?.officers?.join(', ') || '',
      rating: data?.rating?.join(', ') || '',
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
  }, [listCrewGroupings?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const dataSelected = listCrewGroupings?.data?.find(
            (i) => data?.id === i.id,
          );

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(dataSelected);
                setIsView(true);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CREW_GROUPING,
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
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CREW_GROUPING,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(dataSelected?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CREW_GROUPING,
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
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST['Crew grouping code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST['Crew grouping name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'officers',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST.Officers,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'rating',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST.Rating,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST['Created date'],
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
          CREW_GROUPING_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST['Updated date'],
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
          CREW_GROUPING_FIELDS_LIST['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_LIST.Status,
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
          CREW_GROUPING_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, listCrewGroupings?.data, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.CREW_GROUPING}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonCrewGrouping,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CREW_GROUPING,
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
                  CREW_GROUPING_FIELDS_LIST['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.crewGrouping}
        fileName="Crew Grouping"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
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

export default CrewGroupingContainer;
