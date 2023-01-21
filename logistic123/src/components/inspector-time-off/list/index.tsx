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
import PermissionCheck from 'hoc/withPermissionCheck';

import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { InspectorTimeOff } from 'models/api/inspector-time-off/inspector-time-off.model';
import { Action, CommonApiParam } from 'models/common.model';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createInspectorTimeOffActions,
  deleteInspectorTimeOffActions,
  getListInspectorTimeOffActions,
  updateInspectorTimeOffActions,
} from 'store/inspector-time-off/inspector-time-off.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { TIME_OFF_MANAGEMENT_FIELDS_LIST } from 'constants/dynamic/time-off-management.const';
import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const InspectorTimeOffContainer = () => {
  const dispatch = useDispatch();
  const { loading, listInspectorTimeOffs, params } = useSelector(
    (state) => state.inspectorTimeOff,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<InspectorTimeOff>(undefined);
  const [isView, setIsView] = useState<boolean>(false);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListInspectorTimeOffActions.request({
          ...newParams,
          page: 1,
          pageSize: -1,
        }),
      );
    },
    [dispatch],
  );

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createInspectorTimeOffActions.request({
          ...other,
          afterCreate: () => {
            if (isNew) {
              resetForm();
            } else {
              resetForm();
              setVisibleModal((e) => !e);
              setIsCreate(false);
            }

            handleGetList({
              isRefreshLoading: false,
            });
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateInspectorTimeOffActions.request({
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

  const handleDeleteFn = (id: string) => {
    dispatch(
      deleteInspectorTimeOffActions.request({
        id,
        getListInspectorTimeOff: () => {
          handleGetList({
            isRefreshLoading: false,
          });
        },
      }),
    );
  };

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionInspectorTimeOff,
    modulePage: ModulePage.List,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        TIME_OFF_MANAGEMENT_FIELDS_LIST['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        TIME_OFF_MANAGEMENT_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        TIME_OFF_MANAGEMENT_FIELDS_LIST.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        TIME_OFF_MANAGEMENT_FIELDS_LIST.Delete,
      ),
      onPressButtonRight: () => handleDeleteFn(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listInspectorTimeOffs?.data) {
      return [];
    }
    return listInspectorTimeOffs?.data?.map((data) => ({
      id: data.id,
      offUserUsername: data?.offUser?.username || '',
      offUserId: data?.offUserId || null,
      type: data.type || '',
      description: data?.description || '',
      startDate: moment(data?.startDate)?.format('DD/MM/YYYY') || '',
      endDate: moment(data?.endDate)?.format('DD/MM/YYYY') || '',
      duration: `${data.duration} day${data.duration > 1 ? 's' : ''}` || '',
      companyName: data?.company?.name || '',
    }));
  }, [listInspectorTimeOffs?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST.Action,
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
              subFeature: SubFeatures.INSPECTOR_TIME_OFF,
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
              subFeature: SubFeatures.INSPECTOR_TIME_OFF,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.INSPECTOR_TIME_OFF,
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
        field: 'offUserUsername',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST.Username,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST['Time off type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'startDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST['Start date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'endDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST['End date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'duration',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST.Duration,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_LIST['Created by company'],
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
        breadCrumb={BREAD_CRUMB.INSPECTOR_TIME_OFF}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionInspectorTimeOff,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.INSPECTOR_TIME_OFF,
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
                  TIME_OFF_MANAGEMENT_FIELDS_LIST['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.timeOffManagement}
        fileName="Time Off Management"
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

export default InspectorTimeOffContainer;
