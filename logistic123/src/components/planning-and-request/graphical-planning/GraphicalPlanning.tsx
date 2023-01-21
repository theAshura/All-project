import { compareStatus } from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import cloneDeep from 'lodash/cloneDeep';
import { GetPARByAuditorsParams } from 'models/api/planning-and-request/planning-and-request.model';
import moment from 'moment';
import images from 'assets/images/images';
import cx from 'classnames';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { LIST_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import Tooltip from 'antd/lib/tooltip';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { ENTITY_OPTIONS } from 'constants/filter.const';
import { getPlanningAndRequestGroupByAuditorsAction } from 'store/planning-and-request/planning-and-request.action';
import GanttChart, {
  LIST_STATUSES_DEFAULT,
} from '../../common/gantt-chart/index';

import FilterHeader from './filter-header/FilterHeader';
import styles from './graphical-planning.module.scss';
import ModalSchedule from './modal-schedule/ModalSchedule';
import GanttTreeView from '../../common/gantt-chart/GanttTreeView';

const { ICUser, ICVessel, ICBuilding } = images.icons;

export const TYPE_GANTT = {
  AUDITOR: 'auditor',
  VESSEL: 'vessel',
  OFFICE: 'office',
};

const GraphicalPlanningContainer = () => {
  const [currentTime, setCurrentTime] = useState<any>(moment());
  const [modalScheduleVisible, openModalSchedule] = useState<boolean>(false);
  const [parId, setParId] = useState<string>(null);
  const [visibleUnassigned, setVisibleUnassigned] = useState<boolean>(true);
  const [type, setType] = useState<string>(TYPE_GANTT.AUDITOR);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionPar,
    modulePage: ModulePage.List,
  });
  const [currentFilter, setCurrentFilter] = useState<any>({
    entityType: '',
    inspectionMonth: undefined,
    status: '',
    visibleUnassigned: true,
  });

  const { loading, listParByAuditors } = useSelector(
    (state) => state.planningAndRequest,
  );
  const dispatch = useDispatch();

  const handleGetList = useCallback(
    (params?: GetPARByAuditorsParams) => {
      dispatch(
        getPlanningAndRequestGroupByAuditorsAction.request({
          ...params,
        }),
      );
    },
    [dispatch],
  );

  useEffectOnce(() => {
    handleGetList({
      fromDate: moment()?.startOf('month')?.toISOString(),
      toDate: moment()?.endOf('month')?.toISOString(),
      groupBy: type,
    });
  });

  const findColorByStatus = useCallback((status: string) => {
    if (status === 'auditor_accepted') {
      return '#40C8E0';
    }
    const statusSelected = LIST_STATUSES_DEFAULT.find((i) =>
      compareStatus(i.id, status),
    );
    return statusSelected?.color || '#ccc';
  }, []);

  const handleOfficeChildren = useCallback(() => {
    const data = cloneDeep(listParByAuditors);
    const rowData = [];
    data.forEach((element, index) => {
      const { planningRequests, departments } = element;
      planningRequests?.forEach((e) => {
        if (e.status !== 'rejected') {
          const resourceId = e?.auditCompany?.id;
          rowData.push({
            id: e?.id + Math.random() + index,
            idSelect: e?.id,
            resourceId,
            name: e?.auditNo,
            // desc: '',
            startDate: moment(e?.plannedFromDate)
              .local()
              ?.startOf('day')
              .format('YYYY-MM-DD HH:mm'),
            endDate: moment(e?.plannedToDate)
              .local()
              ?.endOf('day')
              .format('YYYY-MM-DD HH:mm'),
            eventType: 'Meeting',
            eventColor: !resourceId ? '#FF9F0A' : findColorByStatus(e.status),
            // iconCls: 'b-fa b-fa-calendar',
            resizable: false,
          });
        }
      });
      if (departments?.length) {
        departments?.forEach((department) => {
          department?.planningRequests?.forEach((e, i) => {
            if (e.status !== 'rejected') {
              // with multiple department have same planning
              e?.departments?.forEach((childDeparment) => {
                const resourceId = childDeparment?.id;
                rowData.push({
                  id: e?.id + Math.random() + i,
                  idSelect: e?.id,
                  resourceId,
                  name: e?.auditNo,
                  // desc: '',
                  startDate: moment(e?.plannedFromDate)
                    .local()
                    ?.startOf('day')
                    .format('YYYY-MM-DD HH:mm'),
                  endDate: moment(e?.plannedToDate)
                    .local()
                    ?.endOf('day')
                    .format('YYYY-MM-DD HH:mm'),
                  eventType: 'Meeting',
                  eventColor: !resourceId
                    ? '#FF9F0A'
                    : findColorByStatus(e.status),
                  // iconCls: 'b-fa b-fa-calendar',
                  resizable: false,
                });
              });
            }
          });
        });
      }
    });

    return rowData;
  }, [findColorByStatus, listParByAuditors]);

  const customEvents = useMemo(() => {
    if (!listParByAuditors) {
      return [];
    }
    let data = cloneDeep(listParByAuditors);
    const rowData = [];
    if (!visibleUnassigned && type === TYPE_GANTT.AUDITOR) {
      data = data?.filter((i) => !!i?.auditor?.id);
    }
    if (type === TYPE_GANTT.OFFICE) {
      const listData = handleOfficeChildren();
      return listData;
    }
    data.forEach((element) => {
      element?.planningRequests?.forEach((e, index) => {
        if (e.status !== 'rejected') {
          let resourceId = element?.auditor?.id;
          if (type === TYPE_GANTT.VESSEL) {
            resourceId = element?.vessel?.id;
          }

          rowData.push({
            id: e?.id + Math.random() + index,
            idSelect: e?.id,
            resourceId,
            name: e?.auditNo,
            // desc: '',
            startDate: moment(e?.plannedFromDate)
              .local()
              ?.startOf('day')
              .format('YYYY-MM-DD HH:mm'),
            endDate: moment(e?.plannedToDate)
              .local()
              ?.endOf('day')
              .format('YYYY-MM-DD HH:mm'),
            eventType: 'Meeting',
            eventColor: !resourceId ? '#FF9F0A' : findColorByStatus(e.status),
            // iconCls: 'b-fa b-fa-calendar',
            resizable: false,
          });
        }
      });
    });

    if (rowData?.length === 0) {
      return null;
    }
    return rowData;
  }, [
    findColorByStatus,
    handleOfficeChildren,
    listParByAuditors,
    type,
    visibleUnassigned,
  ]);

  // const recursionChildCompany =

  const customResources = useMemo(() => {
    // setLoadingEvent(true);
    if (!listParByAuditors) {
      // setLoadingEvent(false);
      return [];
    }
    let data = listParByAuditors;

    if (!visibleUnassigned && type === TYPE_GANTT.AUDITOR) {
      data = data?.filter((i) => !!i?.auditor?.id);
    }
    const rowData = [];
    if (type === TYPE_GANTT.OFFICE) {
      data.forEach((element, index) => {
        rowData.push({
          id: element?.company?.id,
          index: index + 1,
          name: element?.company?.name,
          children: element?.departments?.map((e, i) => ({
            id: e?.department?.id,
            index: index + 1,
            name: e?.department?.name,
          })),
        });
      });
      return rowData;
    }

    data.forEach((element, index) => {
      if (element?.planningRequests?.length > 0) {
        if (type === TYPE_GANTT.AUDITOR) {
          rowData.push({
            id: element?.auditor?.id,
            index: index + 1,
            name: element?.auditor?.username,
          });
        }
        if (type === TYPE_GANTT.VESSEL) {
          rowData.push({
            id: element?.vessel?.id,
            index: index + 1,
            name: element?.vessel?.name,
          });
        }
      }
    });

    if (rowData?.length === 0) {
      // setLoadingEvent(false);
      return null;
    }
    if (!customEvents || customEvents?.length === 0) {
      // setLoadingEvent(false);
      return null;
    }
    return rowData;
  }, [customEvents, listParByAuditors, type, visibleUnassigned]);

  const customColumns = useMemo(() => {
    if (type === TYPE_GANTT.AUDITOR) {
      return [
        {
          text: '',
          field: 'index',
          width: 50,
          editor: false,
        },
        {
          text: renderDynamicLabel(
            dynamicLabels,
            LIST_PLANNING_DYNAMIC_FIELDS['INSPECTOR NAME'],
          ),
          field: 'name',
          width: 200,
          editor: false,
        },
      ];
    }
    if (type === TYPE_GANTT.VESSEL) {
      return [
        {
          text: '',
          field: 'index',
          width: 50,
          editor: false,
        },
        {
          text: renderDynamicLabel(
            dynamicLabels,
            LIST_PLANNING_DYNAMIC_FIELDS['VESSEL NAME'],
          ),
          field: 'name',
          width: 200,
          editor: false,
        },
      ];
    }
    return [
      {
        text: '',
        field: '',
        width: 50,
        editor: false,
      },
      {
        type: 'tree',
        text: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.OFFICE,
        ),
        field: 'name',
        width: 200,
        editor: false,
        collapseIconCls: 'collapsed-icon-custom',
        expandIconCls: 'collapse-icon-custom',
        leafIconCls: '',
      },
    ];
  }, [dynamicLabels, type]);

  const onSubmitForm = useCallback(
    (values?: any) => {
      setCurrentFilter((prev) => values);
      if (!values?.visibleUnassigned && values) {
        setVisibleUnassigned(false);
      } else {
        setVisibleUnassigned(true);
      }
      let groupByChecked = values?.groupBy;

      if (values?.entityType === 'Office' && type === TYPE_GANTT.VESSEL) {
        setType(TYPE_GANTT.OFFICE);
        groupByChecked = TYPE_GANTT.OFFICE;
      }
      if (values?.entityType === 'Vessel' && type === TYPE_GANTT.OFFICE) {
        setType(TYPE_GANTT.VESSEL);
        groupByChecked = TYPE_GANTT.VESSEL;
      }
      if (!values?.entityType) {
        setType(TYPE_GANTT.AUDITOR);
        groupByChecked = TYPE_GANTT.AUDITOR;
      }

      if (!values) {
        handleGetList({
          fromDate: moment()?.startOf('month')?.toISOString(),
          toDate: moment()?.endOf('month')?.toISOString(),
          groupBy: groupByChecked,
        });
        setCurrentTime(moment());
        return;
      }

      handleGetList({
        status: values?.status || undefined,
        fromDate: values?.inspectionMonth
          ? moment(values?.inspectionMonth)?.startOf('month')?.toISOString()
          : moment()?.startOf('month')?.toISOString(),
        toDate: values?.inspectionMonth
          ? moment(values?.inspectionMonth)?.endOf('month')?.toISOString()
          : moment()?.endOf('month')?.toISOString(),
        entityType: values?.entityType || undefined,
        groupBy: groupByChecked || type,
      });
      if (values?.inspectionMonth) {
        setCurrentTime(values?.inspectionMonth);
      }
    },
    [handleGetList, type],
  );

  const onChangeType = useCallback(
    (type) => {
      setType(type);
      let entity = currentFilter?.entityType;
      if (type === TYPE_GANTT.VESSEL) {
        entity = 'Vessel';
      }
      if (type === TYPE_GANTT.OFFICE) {
        entity = 'Office';
      }
      onSubmitForm({
        visibleUnassigned,
        ...currentFilter,
        groupBy: type,
        entityType: entity,
      });
    },
    [currentFilter, onSubmitForm, visibleUnassigned],
  );

  const renderBadges = useMemo(
    () => (
      <div className={styles.wrapBadges}>
        <div
          className={cx(styles.icon, {
            [styles.activeIcon]: type === TYPE_GANTT.AUDITOR,
          })}
          onClick={() => onChangeType(TYPE_GANTT.AUDITOR)}
        >
          <ICUser />
        </div>

        <div
          className={cx(styles.icon, styles.iconVessel, {
            [styles.activeIconVessel]: type === TYPE_GANTT.VESSEL,
          })}
          onClick={() => onChangeType(TYPE_GANTT.VESSEL)}
        >
          <ICVessel />
        </div>

        <div
          className={cx(styles.icon, {
            [styles.activeIcon]: type === TYPE_GANTT.OFFICE,
          })}
          onClick={() => onChangeType(TYPE_GANTT.OFFICE)}
        >
          <ICBuilding />
        </div>
      </div>
    ),
    [onChangeType, type],
  );

  const changeMonth = useCallback(
    (month: number = 1) => {
      setCurrentTime(moment(currentTime).add(month, 'M'));
      onSubmitForm({
        visibleUnassigned,
        ...currentFilter,
        inspectionMonth: moment(currentTime).add(month, 'M'),
      });
    },
    [currentFilter, currentTime, onSubmitForm, visibleUnassigned],
  );

  return (
    <div className={styles.wrap}>
      <FilterHeader
        type={type}
        onSubmitForm={onSubmitForm}
        currentTime={currentTime}
      />
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          {renderBadges}
          <div className="time-control-wrap">
            <Tooltip placement="top" title="Previous Month" color="#3B9FF3">
              <div className="time-control" onClick={() => changeMonth(-1)}>
                <img src={images.icons.previousIcon} alt="previousIcon" />
              </div>
            </Tooltip>
            <div className="time font-weight-bold">
              {currentTime
                ? moment(currentTime)?.local()?.format('MM-YYYY')
                : '-'}
            </div>
            <Tooltip placement="top" title="Next Month" color="#3B9FF3">
              <div className="time-control" onClick={() => changeMonth(1)}>
                <img src={images.icons.nextIcon} alt="nextIcon" />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="wrap-statuses-info">
          {LIST_STATUSES_DEFAULT.map((i) => (
            <div className="status-wrap d-flex align-items-center" key={i.name}>
              <div className="status-badge" style={{ background: i.color }} />
              <div className="status-">{i.name}</div>
            </div>
          ))}
        </div>
      </div>
      {type !== TYPE_GANTT.OFFICE ? (
        <GanttChart
          currentTime={currentTime}
          customEvents={cloneDeep(customEvents)}
          customResources={cloneDeep(customResources)}
          onSelectEvent={(id) => {
            setParId(id);
            openModalSchedule(true);
          }}
          customColumns={customColumns}
          loading={loading}
        />
      ) : (
        <GanttTreeView
          currentTime={currentTime}
          customEvents={cloneDeep(customEvents)}
          customResources={cloneDeep(customResources)}
          onSelectEvent={(id) => {
            setParId(id);
            openModalSchedule(true);
          }}
          customColumns={customColumns}
          loading={loading}
        />
      )}
      <ModalSchedule
        isOpen={modalScheduleVisible}
        parId={parId}
        onClose={() => openModalSchedule(false)}
      />
    </div>
  );
};

export default GraphicalPlanningContainer;
