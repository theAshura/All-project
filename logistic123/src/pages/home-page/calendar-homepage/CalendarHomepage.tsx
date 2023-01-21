import { Badge, Calendar } from 'antd/lib';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ModalRemark from 'pages/incidents/common/ModalRemark';
import { ModalType } from 'components/ui/modal/Modal';
import ModalTableAGGrid from 'components/dashboard/components/modal/ModalTableAGGrid';
import { dateStringComparator } from 'helpers/utils.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { Action } from 'models/common.model';
import images from 'assets/images/images';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { ButtonType } from 'components/ui/button/Button';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import {
  formatDateIso,
  formatDateNoTime,
  formatDateYearToDay,
} from 'helpers/date.helper';
import { useDispatch, useSelector } from 'react-redux';
import {
  createRemarkActions,
  deleteRemarksByDateActions,
  getRemarksByDateActions,
  updateRemarksByDateActions,
} from 'store/home-page/home-page.action';
import useEffectOnce from 'hoc/useEffectOnce';

import { RemarkParam } from 'models/api/home-page/home-page.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { HOME_PAGE_DYNAMIC_LABEL } from 'constants/dynamic/home-page.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './calendar-homepage.module.scss';
import './calendar-homepage.scss';

const CalendarHomePage = ({ dynamicLabels }) => {
  const [openRemarkModalAdd, setOpenRemarkModalAdd] = useState<boolean>(false);
  const [openRemarkModalList, setOpenRemarkModalList] =
    useState<boolean>(false);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(true);
  const [isView, setIsView] = useState<boolean>(true);
  const [modalTitle, setModalTitle] = useState<string>(
    renderDynamicLabel(dynamicLabels, HOME_PAGE_DYNAMIC_LABEL['Add remark']),
  );
  const dispatch = useDispatch();
  const { remarksByDate } = useSelector((state) => state.homepage);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itemSelected, setItemSelected] = useState<RemarkParam>(null);
  const [indexSelected, setIndexSelected] = useState<number>(null);

  useEffect(() => {
    if (!openRemarkModalList && !isCreate && !isEdit && !isView) {
      dispatch(getRemarksByDateActions.request({}));
    }
  }, [dispatch, isCreate, isEdit, isView, openRemarkModalList]);

  useEffectOnce(() => {
    dispatch(getRemarksByDateActions.request({}));
  });

  const getListData = useCallback(
    (value) => {
      let remarkGroupByDate = [];
      remarksByDate?.data?.forEach((remark) => {
        const existingDate = remarkGroupByDate?.some(
          (item) =>
            formatDateNoTime(remark?.createdDate) ===
            formatDateNoTime(item?.createdDate),
        );
        if (!existingDate) {
          remarkGroupByDate.push({
            ...remark,
          });
        } else {
          remarkGroupByDate = remarkGroupByDate.map((item) => {
            if (
              formatDateNoTime(remark?.createdDate) ===
              formatDateNoTime(item?.createdDate)
            ) {
              return {
                ...item,
                otherItems: item?.otherItems?.length
                  ? [...item?.otherItems, remark]
                  : [{ ...remark }],
              };
            }
            return { ...item };
          });
        }
      });
      const dataNew = [];
      remarkGroupByDate.forEach((element, index) => {
        const fromDate = formatDateYearToDay(element?.createdDate);
        const toDate = formatDateYearToDay(element?.createdDate);

        if (
          fromDate <= formatDateYearToDay(value) &&
          formatDateYearToDay(value) <= toDate
        ) {
          dataNew.push({
            ...element,
            status: 'blue',
          });
        }
      });
      return dataNew;
    },
    [remarksByDate?.data],
  );

  const dateCellRender = useCallback(
    (value) => {
      const listData = getListData(value);

      return (
        <ul className={cx('events', listData?.length > 0 && 'have-data')}>
          {listData?.length > 0 &&
            listData?.map((i) => (
              <Badge status={i?.status} key={i?.fromDate} />
            ))}
        </ul>
      );
    },
    [getListData],
  );

  const handleSelectDate = useCallback(
    (e) => {
      setStartDate(
        formatDateIso(formatDateYearToDay(e), {
          startDay: true,
        }),
      );
      setEndDate(
        formatDateIso(formatDateYearToDay(e), {
          endDay: true,
        }),
      );
      dispatch(
        getRemarksByDateActions.request({
          createdDateFrom: formatDateIso(formatDateYearToDay(e), {
            startDay: true,
          }),
          createdDateTo: formatDateIso(formatDateYearToDay(e), {
            endDay: true,
          }),
        }),
      );
      setOpenRemarkModalList(true);
    },
    [dispatch],
  );

  const handleSubmit = useCallback(
    (data, index?: number) => {
      if (data?.id) {
        dispatch(
          updateRemarksByDateActions.request({
            id: data?.id,
            remark: data?.remark,
            createdAtFrom: startDate,
            createdAtTo: endDate,
          }),
        );
      } else {
        dispatch(
          createRemarkActions.request({
            remark: data?.remark,
            createdAtFrom: startDate,
            createdAtTo: endDate,
          }),
        );
      }

      setOpenRemarkModalList(true);
    },
    [dispatch, endDate, startDate],
  );

  const viewDetail = useCallback(
    (rowIndex, data) => {
      setOpenRemarkModalAdd(true);
      setOpenRemarkModalList(false);

      setModalTitle(
        renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL['View remark'],
        ),
      );
      setIsView(true);
      setIsCreate(false);
      setIsEdit(false);
      setIndexSelected(rowIndex);
      setItemSelected(data);
    },
    [dynamicLabels],
  );

  const editDetail = useCallback(
    (rowIndex, data) => {
      setOpenRemarkModalAdd(true);
      setOpenRemarkModalList(false);
      setModalTitle(
        renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL['Edit remark'],
        ),
      );
      setIsView(false);
      setIsCreate(false);
      setIsEdit(true);
      setIndexSelected(rowIndex);
      setItemSelected(data);
    },
    [dynamicLabels],
  );

  const handleDelete = useCallback(
    (rowIndex, data) => {
      setIndexSelected(null);
      setItemSelected(null);
      setIsView(false);
      setIsCreate(false);
      setIsEdit(false);
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
        onPressButtonRight: () => {
          dispatch(
            deleteRemarksByDateActions.request({
              id: data?.id,
              createdAtFrom: startDate,
              createdAtTo: endDate,
            }),
          );
        },
      });
    },
    [dispatch, dynamicLabels, endDate, startDate],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL.Action,
        ),
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data, rowIndex } = params;

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                viewDetail(rowIndex, data);
              },
              feature: Features.HOME_PAGE,
              subFeature: SubFeatures.HOME_PAGE,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                editDetail(rowIndex, data);
              },
              feature: Features.HOME_PAGE,
              subFeature: SubFeatures.HOME_PAGE,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icRemove,
              function: () => {
                handleDelete(rowIndex, data);
              },
              feature: Features.HOME_PAGE,
              subFeature: SubFeatures.HOME_PAGE,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'me-1',
            },
          ]?.filter((item) => item);

          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'sNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'remark',
        headerName: renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL.Remark,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdByUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedByUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          HOME_PAGE_DYNAMIC_LABEL['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, viewDetail, editDetail, handleDelete],
  );

  const handleOpenAddRemarkModal = useCallback(() => {
    setOpenRemarkModalAdd(true);
    setOpenRemarkModalList(false);
    setIsCreate(true);
    setIsEdit(false);
    setIsView(false);
    setItemSelected(null);
    setIndexSelected(null);
    setModalTitle(
      renderDynamicLabel(dynamicLabels, HOME_PAGE_DYNAMIC_LABEL['Add remark']),
    );
  }, [dynamicLabels]);

  return (
    <div className="calendar-homepage">
      <div className={cx(styles.calendarTitle, 'mt-2')}>
        {renderDynamicLabel(dynamicLabels, HOME_PAGE_DYNAMIC_LABEL.Calendar)}
      </div>
      <Calendar
        onSelect={(e) => handleSelectDate(e)}
        dateCellRender={dateCellRender}
      />
      {openRemarkModalAdd && (
        <ModalRemark
          isOpen={openRemarkModalAdd}
          index={indexSelected}
          data={itemSelected}
          handleSubmitForm={handleSubmit}
          toggle={() => {
            setOpenRemarkModalAdd(false);
            setIsEdit(false);
            setIsCreate(false);
            setIsView(false);
            setIndexSelected(null);
            setItemSelected(null);
          }}
          disabled={isView && !isEdit && !isCreate}
          title={modalTitle}
          dynamicLabels={dynamicLabels}
        />
      )}
      {openRemarkModalList && (
        <ModalTableAGGrid
          scroll={{ x: 'max-content', y: 265 }}
          isOpen
          dataSource={remarksByDate?.data?.map((remark, index) => ({
            ...remark,
            sNo: index + 1,
            createdByUser: remark?.createdUser?.username,
            updatedByUser: remark?.updatedUser?.username,
            createdAt: formatDateNoTime(remark?.createdDate),
            updatedAt: formatDateNoTime(remark?.updatedAt),
          }))}
          toggle={() => {
            setOpenRemarkModalList(false);
            setIsCreate(false);
            setIsEdit(false);
            setIsView(false);
          }}
          columns={columnDefs}
          moduleTemplate={MODULE_TEMPLATE.calendarHomepage}
          fileName={MODULE_TEMPLATE.calendarHomepage}
          title={renderDynamicLabel(
            dynamicLabels,
            HOME_PAGE_DYNAMIC_LABEL.Remarks,
          )}
          titleClasseName={styles.customTableModalTitle}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          modalType={ModalType.LARGE}
          hasAddButton
          w="1200px"
          handleOpenAddRemarkModal={handleOpenAddRemarkModal}
          dynamicLabels={dynamicLabels}
        />
      )}
    </div>
  );
};

export default CalendarHomePage;
