import images from 'assets/images/images';
import cx from 'classnames';
import { IFilter } from 'components/dashboard/auditors/DashBoardAuditorsContainer';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { dashboardCompanyLayout } from 'components/dashboard/constants/company.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';

import { AppRouteConst } from 'constants/route.const';
import { formatDateIso, formatDateLocalNoTime } from 'helpers/date.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { openNewPage } from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import { GetUpcomingInspectionPlansResponse } from 'models/api/dashboard/dashboard.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useCallback, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getUpcomingRequestByVesselActions } from 'store/dashboard/dashboard.action';
import ModalDouble, { DataDetailModal } from '../modal-double/ModalDouble';
import styles from './upcoming-inspection-plan.module.scss';
import UpcommingCalendar from './upcomming-calendar/UpcommingCalendar';
import UpcommingTable from './upcomming-table/UpcommingTable';

interface UpcomingInspectionPlansProps {
  setLayout?: any;
  isDraggable?: boolean;
  globalFilter?: IFilter;
  dynamicLabels?: IDynamicLabel;
}

export enum IFilterType {
  VESSEL = 'Vessel',
  OFFICE = 'Office',
}

export enum ModalType {
  UPCOMING_REQUEST_BY_VESSEL = 'UPCOMING_REQUEST_BY_VESSEL',
  UPCOMING_INSPECTION_PLANS_LIST = 'UPCOMING_INSPECTION_PLANS_LIST',
  HIDDEN = 'HIDDEN',
}

const UpcomingInspectionPlans: FC<UpcomingInspectionPlansProps> = ({
  setLayout,
  isDraggable,
  globalFilter,
  dynamicLabels,
}) => {
  const [timeUpcomingInspectionPlan, setTimeUpcomingInspectionPlan] =
    useState<TrendOfTime>(TrendOfTime.M);
  const [calendarMode, setCalendarMode] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [calendarSelected, setCalendarSelected] =
    useState<GetUpcomingInspectionPlansResponse>(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeFilter, setTimeFilter] = useState(null);

  const [dataDetailModal, setDataDetailModal] = useState<DataDetailModal>(null);
  const { upcomingInspectionPlans, upcomingRequestByVessel } = useSelector(
    (state) => state.dashboard,
  );
  const [modal, setModal] = useState<ModalType>(ModalType.HIDDEN);

  const columnUpcomingInspectionPlans = useCallback(
    () => [
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Action,
        ),
        dataIndex: 'action',
        sortField: 'action',
        width: 20,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
        ),
        dataIndex: 'vesselName',
        sortField: 'vesselName',
        width: 120,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Company,
        ),
        dataIndex: 'auditCompanyName',
        sortField: 'auditCompanyName',
        width: 120,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Entity,
        ),
        dataIndex: 'entityType',
        sortField: 'entityType',
        width: 20,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Upcoming inspection plans'],
        ),
        dataIndex: 'numberOfPlanning',
        sortField: 'numberOfPlanning',
        width: 100,
      },
    ],
    [dynamicLabels],
  );

  const columnUpcomingRequestByVessel = useCallback(
    () => [
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection plan ID'],
        ),
        dataIndex: 'inspectionPlanID',
        sortField: 'inspectionPlanID',
        width: 80,
        isHightLight: true,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Planned inspection date'],
        ),
        dataIndex: 'plannedInspectionDate',
        sortField: 'plannedInspectionDate',
        width: 80,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Lead inspector name'],
        ),
        dataIndex: 'leadInspectorName',
        sortField: 'leadInspectorName',
        width: 80,
      },
    ],
    [dynamicLabels],
  );

  const handleGetDataModalDetail = useCallback(
    (modalType: string, id, data) => {
      const timeFilterSelected = calendarMode
        ? {
            fromDate: formatDateIso(selectedDate, { startDay: true }),
            toDate: formatDateIso(selectedDate, { endDay: true }),
          }
        : timeFilter;
      const params =
        data?.entity === IFilterType.OFFICE
          ? {
              params: {
                auditCompanyId: data?.auditCompanyId,
                entityType: data?.entity,
                ...timeFilterSelected,
              },
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }
          : {
              params: {
                vesselId: data?.vesselId,
                entityType: data?.entity,
                ...timeFilterSelected,
              },
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            };

      dispatch(getUpcomingRequestByVesselActions.request(params));

      setModal(ModalType.UPCOMING_REQUEST_BY_VESSEL);
      setDataDetailModal(data);
    },
    [calendarMode, dispatch, selectedDate, timeFilter],
  );

  const renderButtonView = (
    disable: boolean = false,
    handleClick: () => void,
  ) => (
    <Button
      disabledCss={disable}
      disabled={disable}
      buttonSize={ButtonSize.IconSmallAction}
      buttonType={ButtonType.Blue}
      onClick={(e) => {
        if (handleClick) {
          handleClick();
        }
        e.stopPropagation();
      }}
    >
      <img
        src={images.icons.icViewDetail}
        alt="view"
        className={styles.icImg}
      />
    </Button>
  );

  const dataSourceCalendar = useMemo(() => {
    const result = [];

    calendarSelected?.data?.forEach((item) => {
      const relatedItems = calendarSelected?.data?.filter(
        (i) =>
          (item?.vesselId && i?.vesselId === item?.vesselId) ||
          (item?.auditCompanyId && i?.auditCompanyId === item?.auditCompanyId),
      );

      const existItem = result?.some(
        (i) =>
          (item?.vesselId && i?.vesselId === item?.vesselId) ||
          (item?.auditCompanyId && i?.auditCompanyId === item?.auditCompanyId),
      );
      if (existItem) {
        return;
      }
      result.push({
        ...item,
        numberOfPlanning: relatedItems?.length || 1,
      });
    });
    return result?.map((item) => ({
      ...item,
      action: (
        <div className="d-flex align-items-center">
          {renderButtonView(false, () =>
            handleGetDataModalDetail(
              ModalType.UPCOMING_REQUEST_BY_VESSEL,
              item?.vesselId,
              {
                labelTotal: renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                    'Upcoming inspection plan details'
                  ],
                ),
                entity: item?.entityType,
                vesselId: item?.vesselId,
                auditCompanyId: item?.auditCompanyId,
                auditCompanyName: item?.auditCompanyName,
                vesselName: item?.vesselName,
                vesselCode: item?.vesselCode,
                plannedFromDate: formatDateLocalNoTime(item?.plannedFromDate),
              },
            ),
          )}
        </div>
      ),
    }));
  }, [calendarSelected?.data, dynamicLabels, handleGetDataModalDetail]);

  const dataSource = useMemo(() => {
    let dataGroupByField = [];
    upcomingInspectionPlans?.forEach((upCommingItem) => {
      const existDuplicateTime = dataGroupByField?.some(
        (item) =>
          (upCommingItem?.vesselId &&
            upCommingItem?.vesselId === item?.vesselId) ||
          (upCommingItem?.auditCompanyId &&
            upCommingItem?.auditCompanyId === item?.auditCompanyId),
      );
      if (!existDuplicateTime) {
        dataGroupByField.push({
          ...upCommingItem,
          numberOfPlanning: 1,
        });
      } else {
        dataGroupByField = dataGroupByField.map((item) => {
          if (
            (upCommingItem?.vesselId &&
              upCommingItem?.vesselId === item?.vesselId) ||
            (upCommingItem?.auditCompanyId &&
              upCommingItem?.auditCompanyId === item?.auditCompanyId)
          ) {
            const otherItems = item?.otherItems?.length
              ? [...item?.otherItems, upCommingItem]
              : [
                  {
                    ...upCommingItem,
                    numberOfPlanning:
                      Number(item?.otherItems?.length || 0) + 1 || 1,
                  },
                ];
            return {
              ...item,
              otherItems: item?.otherItems?.length
                ? [...item?.otherItems, upCommingItem]
                : [
                    {
                      ...upCommingItem,
                      numberOfPlanning:
                        Number(item?.otherItems?.length || 0) + 1 || 1,
                    },
                  ],
              numberOfPlanning: Number(otherItems?.length || 0) + 1,
            };
          }
          return {
            ...item,
            numberOfPlanning: item?.otherItems?.length + 1 || 1,
          };
        });
      }
    });

    const filtedData =
      calendarMode && calendarSelected
        ? calendarSelected?.data?.filter((i) => i !== undefined)
        : dataGroupByField;

    return filtedData?.map((item) => ({
      ...item,
      action: (
        <div className="d-flex align-items-center">
          {renderButtonView(false, () =>
            handleGetDataModalDetail(
              ModalType.UPCOMING_REQUEST_BY_VESSEL,
              item?.vesselId,
              {
                labelTotal: renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                    'Upcoming inspection plan details'
                  ],
                ),
                entity: item?.entityType,
                vesselId: item?.vesselId,
                auditCompanyId: item?.auditCompanyId,
                auditCompanyName: item?.auditCompanyName,
                vesselName: item?.vesselName,
                vesselCode: item?.vesselCode,
                plannedFromDate: formatDateLocalNoTime(item?.plannedFromDate),
              },
            ),
          )}
        </div>
      ),
    }));
  }, [
    calendarMode,
    calendarSelected,
    dynamicLabels,
    handleGetDataModalDetail,
    upcomingInspectionPlans,
  ]);

  const renderModalTable = useCallback(() => {
    let columns;
    let dataTable;
    let title;
    let numberOfRecordTitle;

    if (modal === ModalType.HIDDEN) {
      return null;
    }
    switch (modal) {
      case ModalType.UPCOMING_INSPECTION_PLANS_LIST:
        columns = columnUpcomingInspectionPlans();
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Upcoming inspection plans'],
        );
        numberOfRecordTitle = `${renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of upcoming inspection plans'
          ],
        )}${dataSourceCalendar.reduce((a, b) => a + b.numberOfPlanning, 0)}`;
        dataTable = calendarMode ? dataSourceCalendar : dataSource;
        break;
      case ModalType.UPCOMING_REQUEST_BY_VESSEL:
        columns = columnUpcomingRequestByVessel();
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Upcoming inspection plan details'
          ],
        );
        numberOfRecordTitle = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of upcoming inspection plans'
          ],
        );
        dataTable = upcomingRequestByVessel?.map((item) => ({
          ...item,
          inspectionPlanID: item?.refId,
          plannedInspectionDate: formatDateLocalNoTime(item?.plannedFromDate),
          leadInspectorName: item?.leadAuditor?.username,
          id: item?.id,
          vesselCode: item?.vessel?.code,
          vesselName: item?.vessel?.name,
          auditCompanyName: item?.auditCompany?.name,
          labelTotal: renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Total upcoming inspection plans'
            ],
          ),
        }));
        break;
      default:
        break;
    }

    return (
      <ModalDouble
        isOpen
        scroll={{ x: 'max-content', y: 360 }}
        dataDetailModal={dataDetailModal}
        dataSource={dataTable}
        columns={columns}
        toggle={() => {
          setDataDetailModal(null);
          setIsDetailModal(false);
          setModal(ModalType.HIDDEN);
        }}
        hasVesselName
        title={title}
        isDetail={isDetailModal}
        handleBack={() => {
          setIsDetailModal(false);
          setModal(ModalType.UPCOMING_INSPECTION_PLANS_LIST);
        }}
        subTitle={numberOfRecordTitle}
        calendarMode={calendarMode}
        setTimeUpcomingInspectionPlan={setTimeUpcomingInspectionPlan}
        timeUpcomingInspectionPlan={timeUpcomingInspectionPlan}
        handleClick={(data) => {
          switch (modal) {
            case ModalType.UPCOMING_REQUEST_BY_VESSEL:
              openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id));
              break;
            default:
              break;
          }
        }}
      />
    );
  }, [
    modal,
    dataDetailModal,
    isDetailModal,
    calendarMode,
    timeUpcomingInspectionPlan,
    columnUpcomingInspectionPlans,
    dynamicLabels,
    dataSourceCalendar,
    dataSource,
    columnUpcomingRequestByVessel,
    upcomingRequestByVessel,
  ]);

  useEffectOnce(() => {
    if (isDraggable) {
      setLayout(dashboardCompanyLayout);
    }
  });

  const toggleCalendarMode = useCallback(() => {
    setCalendarMode(true);
    if (isDraggable) {
      setLayout(dashboardCompanyLayout);
    }
  }, [isDraggable, setLayout]);

  const toggleListMode = useCallback(() => {
    setCalendarMode(false);
    if (isDraggable) {
      setLayout([
        ...dashboardCompanyLayout.slice(0, 11),
        { i: 'upcomingInspectionPlans', x: 0, y: 29, w: 12, h: 8 },
        ...dashboardCompanyLayout.slice(12, dashboardCompanyLayout.length),
      ]);
    }
  }, [isDraggable, setLayout]);

  const handleOpenModalUpcomingPlans = useCallback(() => {
    if (calendarMode) {
      setModal(ModalType.UPCOMING_INSPECTION_PLANS_LIST);
    }
  }, [calendarMode]);

  const renderContentByMode = useMemo(() => {
    if (calendarMode) {
      return (
        <UpcommingCalendar
          handleOpenModalUpcomingPlans={handleOpenModalUpcomingPlans}
          setCalendarSelected={setCalendarSelected}
          setSelectedDate={setSelectedDate}
          renderModalTable={renderModalTable}
          globalFilter={globalFilter}
          dynamicLabels={dynamicLabels}
        />
      );
    }
    return (
      <UpcommingTable
        calendarMode={calendarMode}
        setTimeUpcomingInspectionPlan={setTimeUpcomingInspectionPlan}
        timeUpcomingInspectionPlan={timeUpcomingInspectionPlan}
        globalFilter={globalFilter}
        setTimeFilter={setTimeFilter}
        columnUpcomingInspectionPlans={columnUpcomingInspectionPlans}
        dataSource={dataSource}
        openNewPage={openNewPage}
        setModal={setModal}
        dynamicLabels={dynamicLabels}
        renderModalTable={renderModalTable}
      />
    );
  }, [
    calendarMode,
    columnUpcomingInspectionPlans,
    dataSource,
    dynamicLabels,
    globalFilter,
    handleOpenModalUpcomingPlans,
    renderModalTable,
    timeUpcomingInspectionPlan,
  ]);

  return (
    <div
      className={cx(
        styles.wrapperOverviewStatistic,
        'styles.pt10',
        'upcomingInspectionPlan',
        {
          [styles.wrapperOverviewStatisticDraggable]: isDraggable,
          [styles.wrapperOverviewStatisticDraggableList]:
            isDraggable && !calendarMode,
        },
      )}
    >
      <div className={styles.headerWrapper}>
        <p className={styles.titleBox}>
          {renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Upcoming inspection plans'],
          )}
        </p>
        <div className={styles.iconContainer}>
          <div onClick={() => toggleCalendarMode()}>
            {calendarMode ? (
              <div
                className={cx(
                  styles.iconWrapper,
                  styles.iconCalendarWrapper,
                  styles.iconWrapperActive,
                )}
              >
                <images.icons.ICalendar className={styles.iconCalendarActive} />
              </div>
            ) : (
              <div
                className={cx(styles.iconWrapper, styles.iconCalendarWrapper)}
              >
                <images.icons.ICalendar />
              </div>
            )}
          </div>
          <div onClick={() => toggleListMode()}>
            {calendarMode ? (
              <div className={cx(styles.iconWrapper, styles.iconListWrapper)}>
                <images.icons.IUnorderedList />
              </div>
            ) : (
              <div
                className={cx(
                  styles.iconWrapper,
                  styles.iconListWrapper,
                  styles.iconWrapperActive,
                )}
              >
                <images.icons.IUnorderedList
                  className={styles.iconListActive}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {renderContentByMode}
    </div>
  );
};

export default UpcomingInspectionPlans;
