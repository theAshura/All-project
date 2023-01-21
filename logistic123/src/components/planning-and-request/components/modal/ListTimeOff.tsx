import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import ModalComponent from 'components/ui/modal/Modal';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  deleteInspectorTimeOffActions,
  getListInspectorTimeOffActions,
  updateInspectorTimeOffActions,
} from 'store/inspector-time-off/inspector-time-off.action';
import { useSelector, useDispatch } from 'react-redux';
import Button, { ButtonType } from 'components/ui/button/Button';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoDataImg from 'components/common/no-data/NoData';
import images from 'assets/images/images';
import { getListUserActions } from 'store/user/user.action';
import PaginationCustomer from 'components/ui/pagination-customer/PaginationCustomer';
import moment from 'moment';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { InspectorTimeOff } from 'models/api/inspector-time-off/inspector-time-off.model';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { dateStringComparator } from 'helpers/utils.helper';
import ContentTimeOff from './ContentTimeOff';
import styles from './modal-time-off.module.scss';

interface ModalProps {
  disabledAction?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ListTimeOff: FC<ModalProps> = ({ disabledAction, dynamicLabels }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<InspectorTimeOff>(null);

  const { loading, listInspectorTimeOffs, params } = useSelector(
    (state) => state.inspectorTimeOff,
  );

  const [page, setPage] = useState(params?.page || 1);
  const [pageSize, setPageSize] = useState(params?.pageSize || 20);
  const [content, setContent] = useState(params?.content || '');
  const [startDate] = useState<string>(params?.startDate);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dispatch = useDispatch();

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListInspectorTimeOffActions.request(newParams));
    },
    [dispatch],
  );

  const onChangePage = useCallback(
    (pageNumber: number, pageSizeNumber?: number) => {
      setPage(pageNumber);
      setPageSize(pageSizeNumber);
      handleGetList({
        page: pageNumber,
        pageSize: pageSizeNumber,
        isRefreshLoading: false,
        content: content.trim(),

        startDate,
      });
    },
    [content, handleGetList, startDate],
  );

  const sanitizeData = (data: InspectorTimeOff) => {
    const finalData = {
      key: data?.id,
      id: data?.id,
      username: data?.offUser.username,
      createdUserId: data?.createdUserId,
      type: data?.type,
      description: data?.description,
      startDate: moment(data?.startDate)?.format('DD/MM/YYYY'),
      endDate: moment(data?.endDate)?.format('DD/MM/YYYY'),
      duration: `${data?.duration} day${data?.duration > 1 ? 's' : ''}`,
    };
    return finalData;
  };

  const resetParams = () => {
    setPage(1);
    setPageSize(20);
    setContent('');
    setSelectedData(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsEdit(false);
    resetParams();
  };

  const onSubmitForm = (formData) => {
    const { resetForm, ...other } = formData;
    dispatch(
      updateInspectorTimeOffActions.request({
        id: selectedData?.id,
        data: other,
        afterUpdate: () => {
          handleGetList({
            page,
            pageSize,
            isRefreshLoading: false,
            content: content.trim(),
          });

          setIsEdit(false);
        },
      }),
    );
  };

  const dataSource = useMemo(
    () => listInspectorTimeOffs?.data?.map((data) => sanitizeData(data)),
    [listInspectorTimeOffs?.data],
  );

  const handleDeleteFn = useCallback(
    (id: string) => {
      dispatch(
        deleteInspectorTimeOffActions.request({
          id,
          getListInspectorTimeOff: () => {
            if (page > 1 && listInspectorTimeOffs?.data?.length === 1) {
              setPage(page - 1);
              handleGetList({
                isRefreshLoading: false,
                page: page - 1,
                pageSize,
                content: content.trim(),
              });
            } else {
              handleGetList({
                isRefreshLoading: false,
                page,
                pageSize,
                content: content.trim(),
              });
            }
          },
        }),
      );
    },
    [content, dispatch, handleGetList, listInspectorTimeOffs, page, pageSize],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
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
        onPressButtonRight: () => handleDeleteFn(id),
      });
    },
    [dynamicLabels, handleDeleteFn],
  );

  const columns = useMemo(
    () =>
      [
        !disabledAction && {
          field: 'action',
          headerName: renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Action,
          ),
          filter: false,
          sortable: false,
          enableRowGroup: false,
          lockPosition: true,
          maxWidth: 125,
          pinned: 'left',
          cellRendererFramework: ({ data }) => {
            let actions: Action[] =
              data?.createdUserId === userInfo.id
                ? [
                    {
                      img: images.icons.icEdit,
                      function: () => {
                        setIsEdit(true);
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
                  ]
                : [];
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
          field: 'username',
          headerName: renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Username,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'type',
          headerName: renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['Time off type'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'description',
          headerName: renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Description,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'startDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['Start date'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
        {
          field: 'endDate',
          headerName: renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['End date'],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
        {
          field: 'duration',
          headerName: renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Duration,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ].filter((i) => typeof i === 'object'),
    [
      disabledAction,
      dynamicLabels,
      handleDelete,
      isMultiColumnFilter,
      userInfo.id,
    ],
  );

  const renderTableTimeOff = useMemo(() => {
    if (loading) {
      return (
        <div className={cx(styles.loadingWrapper)}>
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        </div>
      );
    }
    if (dataSource?.length && !loading) {
      return (
        <>
          <AGGridModule
            loading={false}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker={false}
            columnDefs={columns}
            dataFilter={null}
            moduleTemplate={MODULE_TEMPLATE.timeOffInformation}
            fileName={MODULE_TEMPLATE.timeOffInformation}
            dataTable={dataSource}
            height="400px"
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
            getList={handleGetList}
            classNameHeader={styles.header}
            dynamicLabels={dynamicLabels}
          />
          <PaginationCustomer
            className={cx('ms-0', styles.pagination)}
            total={listInspectorTimeOffs?.totalItem}
            onChange={onChangePage}
            pageSize={pageSize}
            dynamicLabels={dynamicLabels}
            current={page}
          />
        </>
      );
    }
    return <NoDataImg />;
  }, [
    columns,
    dataSource,
    dynamicLabels,
    handleGetList,
    listInspectorTimeOffs?.totalItem,
    loading,
    onChangePage,
    page,
    pageSize,
  ]);

  const renderContent = () =>
    isEdit ? (
      <ContentTimeOff
        isOpen={isEdit}
        toggle={() => {
          setIsEdit(false);
          setSelectedData(null);
        }}
        data={selectedData}
        dynamicLabels={dynamicLabels}
        handleSubmitForm={onSubmitForm}
      />
    ) : (
      <>
        <div className={cx(styles.contentWrapper)}>
          <div className={styles.table}>{renderTableTimeOff}</div>
        </div>
      </>
    );

  // effect

  useEffect(() => {
    if (!isOpen) {
      dispatch(
        getListInspectorTimeOffActions.request({ pageSize: 20, page: 1 }),
      );
      resetParams();
    }
    dispatch(getListUserActions.request({ pageSize: -1 }));
  }, [dispatch, isOpen]);

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Inspector time off'],
        )}
      </Button>

      <ModalComponent
        w={isEdit ? 800 : 1200}
        isOpen={isOpen}
        toggle={handleCancel}
        headerDouble={
          isEdit ? (
            <>
              <div
                className={styles.icBack}
                onClick={() => {
                  setIsEdit(false);
                  setSelectedData(null);
                }}
              >
                <img
                  src={images.icons.icArrowChevronBack}
                  alt="ic-back-modal"
                />
              </div>
              <div className={styles.titleModalDetail}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Time off information'],
                )}
              </div>
            </>
          ) : null
        }
        dynamicLabels={dynamicLabels}
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Time off information'],
        )}
        content={renderContent()}
      />
    </>
  );
};

export default ListTimeOff;
