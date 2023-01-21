import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useCallback, useMemo, useState } from 'react';

import images from 'assets/images/images';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Topic } from 'models/api/topic/topic.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTopicActions,
  deleteTopicActions,
  getListTopicActions,
  updateTopicActions,
} from 'store/topic/topic.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { TOPIC_MANAGEMENT_FIELDS_LIST } from 'constants/dynamic/topic-management.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import styles from '../../list-common.module.scss';
import ModalTopic from '../common/ModalTopic';

const TopicContainer = () => {
  const dispatch = useDispatch();
  const { loading, listTopics, params } = useSelector((state) => state.topic);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Topic>(undefined);
  const [isView, setIsView] = useState<boolean>(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionTopic,
    modulePage: ModulePage.List,
  });

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListTopicActions.request({
          ...newParams,
          page: 1,
          pageSize: -1,
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  const handleDeleteCharterOwner = useCallback(
    (id: string) => {
      dispatch(
        deleteTopicActions.request({
          id,
          getListTopic: () => {
            handleGetList({
              isRefreshLoading: false,
            });
          },
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST.Delete,
        ),
        onPressButtonRight: () => handleDeleteCharterOwner(id),
      });
    },
    [dynamicLabels, handleDeleteCharterOwner],
  );

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createTopicActions.request({
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
        updateTopicActions.request({
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
  const dataTable = useMemo(() => {
    if (!listTopics?.data) {
      return [];
    }
    return listTopics?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
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
  }, [listTopics?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST.Action,
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
              subFeature: SubFeatures.TOPIC,
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
              subFeature: SubFeatures.TOPIC,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.TOPIC,
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
          TOPIC_MANAGEMENT_FIELDS_LIST['Topic code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST['Topic name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST['Created date'],
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
          TOPIC_MANAGEMENT_FIELDS_LIST['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST['Updated date'],
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
          TOPIC_MANAGEMENT_FIELDS_LIST.Action,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          TOPIC_MANAGEMENT_FIELDS_LIST['Updated by user'],
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
          TOPIC_MANAGEMENT_FIELDS_LIST['Created by company'],
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
        breadCrumb={BREAD_CRUMB.TOPIC}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionTopic,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.TOPIC,
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
                  TOPIC_MANAGEMENT_FIELDS_LIST['Create New'],
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
        moduleTemplate={MODULE_TEMPLATE.topic}
        fileName="Topic"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />

      <ModalTopic
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

export default TopicContainer;
