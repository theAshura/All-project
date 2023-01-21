import images from 'assets/images/images';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState, lazy } from 'react';
import SelectUI from 'components/ui/select/Select';
import Button, { ButtonType, ButtonSize } from 'components/ui/button/Button';
import { LineChart } from 'components/common/chart/line-chart/LineChart';
import { DoughnutChart } from 'components/common/chart/doughnut-chart/DoughnutChart';
import Col from 'antd/lib/col';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Row from 'antd/lib/row';
import { useDispatch, useSelector } from 'react-redux';
import moment, { Moment } from 'moment';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import {
  getCompanyAvgActions,
  getCompanyUpcomingActions,
  getCompanyFindingActions,
  getCompanyOverviewTaskActions,
  getCompanyOutstandingIssuesActions,
  getCompanyTrendAuditInspectionActions,
  getCompanyTrendIssueActions,
  getCompanyUpcomingIARByVesselActions,
  getCompanyOpenNonConformityByVesselActions,
  getCompanyUpcomingPlanByVesselActions,
  getCompanyOpenFindingObservationByVesselActions,
  getTotalCkListRofIarCompanyActions,
} from 'store/dashboard/dashboard.action';
import { AppRouteConst } from 'constants/route.const';
import {
  OutstandingFindingIssues,
  OutstandingIssuesTimeTable,
} from 'models/api/dashboard/dashboard.model';
import {
  convertNumberInt,
  arrThreeMonthCurrent,
  arrDateInWeek,
  arrDateInMonth,
  arrMonthInYear,
  financial,
  arrMomentFullDateInMonth,
  arrMomentThreeMonth,
  arrMomentMonthInYear,
  arrMomentDateInWeek,
  openNewPage,
  formatDateChart,
  formatMonthChart,
  formatDateTime,
} from 'helpers/utils.helper';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import {
  FILTER_INSPECTION_REPORT,
  FILTER_REPORT_OF_FINDINGS,
  FILTER_INSPECTION_CHECKLIST,
} from 'constants/filter.const';
import { reFormatStatus } from 'helpers/status.helper';
import { DashBoard } from 'constants/widget.const';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { permissionCheck } from 'helpers/permissionCheck.helper';
import useLocalStorage from 'hoc/useLocalStorage';
import { ModalType } from 'components/ui/modal/Modal';
import CalendarTimeTableProvider from 'contexts/audit-time-table/CalendarTimeTable';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import {
  BlockImage,
  BlockImageSelect,
  BlockImageViewMore,
  Position,
} from '../components/block/BlockImage';
import styles from './company-dashboard.module.scss';
// import ListOfItemReview from '../components/tab/company/ListOfItemReview';
import ModalAuditor from '../components/modal/ModalAuditor';
import { DataDetailModal } from '../components/modal-double/ModalDouble';
import {
  ModalDashboardType,
  dashboardCompanyLayout,
} from '../constants/company.const';
import './company-admin.scss';
import ModalDoubleAGGrid from '../components/modal-double/ModalDoubleAGGrid';
import { columnsDefinition } from './company-columns-def';
import ModalTableAGGrid from '../components/modal/ModalTableAGGrid';
import HeaderFilter from '../components/header-filter/HeaderFilter';
import { IFilter } from '../auditors/DashBoardAuditorsContainer';
import CarCapNeedReviewing from './listWidget/CarCapNeedReviewing';
import TrendOfOutstandingCarCapIssue from './listWidget/TrendOfOutstandingCarCapIssue';
import OutstandingCarCapIssue from './listWidget/OutstandingCarCapIssue';
import OpenTask from '../master/components/OpenTask';

const ReactGridLayout = WidthProvider(RGL);

const UpcomingInspectionPlans = lazy(
  () =>
    import('../components/upcoming-inspection-plans/UpcomingInspectionPlan'),
);

const DashBoardCompanyContainer = () => {
  const [modal, setModal] = useState<ModalDashboardType>(
    ModalDashboardType.HIDDEN,
  );

  const [filterStatus, setFilterStatus] = useState({
    ckListStatus: 'Yet To Start',
    rofStatus: 'Draft',
    iarStatus: 'draft',
  });
  const [totalFinding, setTotalFinding] = useState<string>('main');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [dataDetailModal, setDataDetailModal] = useState<DataDetailModal>(null);
  const dispatch = useDispatch();
  const [sort, setSort] = useState('');
  const [layout, setLayout] = useState(dashboardCompanyLayout);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<IFilter>(null);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionDashboard,
    modulePage: ModulePage.List,
  });

  const {
    companyAvgResponse,
    companyUpcomingResponse,
    companyOutstandingIssues,
    // companyOverviewTask,
    companyFindings,
    companyTrendAuditInspection,
    companyTrendIssues,
    dataUpcomingIARByVessel,
    dataOpenNonConformityByVessel,
    dataOpenFindingObservationByVessel,
    dataUpcomingPlanByVessel,
    totalCkListRofIar,
  } = useSelector((state) => state.dashboard);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [timeTrendOfAudit, setTimeTrendOfAudit] = useState<TrendOfTime>(
    TrendOfTime.M,
  );
  const [timeTrendOfOutstandingCarCap, setTimeTrendOfOutstandingCarCap] =
    useState(TrendOfTime.M);

  const [localLayout, setLocalLayout] = useLocalStorage(
    `dashboard-grid-layout-${userInfo?.id}`,
    null,
  );

  const dataUpcomingIARByVesselList = useMemo(
    () =>
      dataUpcomingIARByVessel?.map((item) => ({
        ...item,
        plannedFromDate: moment(new Date(item?.plannedFromDate))
          .format('DD/MM/YYYY')
          .toString(),
      })) || [],
    [dataUpcomingIARByVessel],
  );

  const dataOpenNonConformityByVesselList = useMemo(
    () =>
      dataOpenNonConformityByVessel?.map((item) => ({
        ...item,
        isSignificant: item?.isSignificant ? 'Yes' : 'No',
      })) || [],
    [dataOpenNonConformityByVessel],
  );

  const dataOpenFindingObservationByVesselList = useMemo(
    () =>
      dataOpenFindingObservationByVessel?.map((item) => ({
        ...item,
        isSignificant: item?.isSignificant ? 'Yes' : 'No',
      })) || [],
    [dataOpenFindingObservationByVessel],
  );

  const dataUpcomingPlanByVesselList = useMemo(
    () =>
      dataUpcomingPlanByVessel?.map((item) => ({
        ...item,
        plannedFromDate: moment(new Date(item?.plannedFromDate))
          .format('DD/MM/YYYY')
          .toString(),
      })) || [],
    [dataUpcomingPlanByVessel],
  );

  const [timeTrendOfOutstanding, setTimeTrendOfOutstanding] =
    useState<TrendOfTime>(TrendOfTime.M);

  useEffect(() => {
    if (filterStatus.ckListStatus) {
      dispatch(
        getTotalCkListRofIarCompanyActions.request({
          ...filterStatus,
          entityType: globalFilter?.entity,
        }),
      );
    }
  }, [dispatch, filterStatus, globalFilter?.entity]);

  useEffect(() => {
    const priorDate = moment().add(-30, 'days');

    dispatch(
      getCompanyAvgActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
        entityType: globalFilter?.entity,
      }),
    );

    dispatch(
      getCompanyFindingActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
        entityType: globalFilter?.entity,
      }),
    );
    dispatch(
      getCompanyUpcomingActions.request({ entityType: globalFilter?.entity }),
    );
    dispatch(
      getCompanyOutstandingIssuesActions.request({
        entityType: globalFilter?.entity,
      }),
    );
    dispatch(
      getCompanyOverviewTaskActions.request({
        entityType: globalFilter?.entity,
      }),
    );
  }, [dispatch, globalFilter?.entity]);

  useEffect(() => {
    let subtractDate = 0;
    switch (timeTrendOfAudit) {
      case TrendOfTime.M3:
        subtractDate = -90;
        break;
      case TrendOfTime.Y:
        subtractDate = -365;
        break;

      case TrendOfTime.M:
        subtractDate = -30;
        break;
      default:
        subtractDate = -7;
        break;
    }
    const priorDate = moment().add(subtractDate, 'days');

    dispatch(
      getCompanyTrendAuditInspectionActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
        entityType: globalFilter?.entity,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeTrendOfAudit, globalFilter?.entity]);

  useEffect(() => {
    let subtractDate = 0;
    switch (timeTrendOfOutstanding) {
      case TrendOfTime.M3:
        subtractDate = -90;
        break;
      case TrendOfTime.Y:
        subtractDate = -365;
        break;

      case TrendOfTime.M:
        subtractDate = -30;
        break;
      default:
        subtractDate = -7;
        break;
    }
    const priorDate = moment().add(subtractDate, 'days');

    dispatch(
      getCompanyTrendIssueActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
        entityType: globalFilter?.entity,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeTrendOfOutstanding, globalFilter?.entity]);

  const outstandingIssue = useMemo(() => {
    let totalNonConformity = 0;
    companyOutstandingIssues?.outstandingIssuesNonConformity?.forEach(
      (item) => {
        totalNonConformity += Number(item.total);
      },
    );
    let totalObservation = 0;
    companyOutstandingIssues?.outstandingIssuesObservation?.forEach((item) => {
      totalObservation += Number(item.total);
    });

    const totalIAR = companyOutstandingIssues?.outstandingIssuesIar?.length;

    const totalAuditTimeTable =
      companyOutstandingIssues?.outstandingIssuesTimeTable?.length;

    const totalROF =
      companyOutstandingIssues?.outstandingIssuesFindingForm?.length;

    return [
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of open non-conformity (last 30 days)'
          ],
        ),
        number: convertNumberInt(totalNonConformity),
        modalType: ModalDashboardType.NON_CONFORMITY,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of open observations (last 30 days)'
          ],
        ),
        number: convertNumberInt(totalObservation),
        modalType: ModalDashboardType.OBSERVATIONS,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection time tables not closed out'
          ],
        ),
        number: convertNumberInt(totalAuditTimeTable),
        modalType: ModalDashboardType.NUMBER_AUDIT_TIME_TABLE,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of report of findings not closed out'
          ],
        ),
        number: convertNumberInt(totalROF),
        modalType: ModalDashboardType.NUMBER_REPORT_OF_FINDING,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection reports not closed out'
          ],
        ),
        number: convertNumberInt(totalIAR),
        modalType: ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT,
      },
    ];
  }, [
    companyOutstandingIssues?.outstandingIssuesFindingForm?.length,
    companyOutstandingIssues?.outstandingIssuesIar?.length,
    companyOutstandingIssues?.outstandingIssuesNonConformity,
    companyOutstandingIssues?.outstandingIssuesObservation,
    companyOutstandingIssues?.outstandingIssuesTimeTable?.length,
    dynamicLabels,
  ]);

  const dataDoughnut = useMemo(() => {
    if (totalFinding === 'main') {
      return companyFindings?.totalFindingByMainCategory?.map((item) => ({
        name: item.name,
        value: Number(item.totalNum),
      }));
    }
    return companyFindings?.totalFindingByLocation?.map((item) => ({
      name: item.name,
      value: Number(item.totalNum),
    }));
  }, [companyFindings, totalFinding]);

  const dataChartAxis = useCallback(
    (value: TrendOfTime, isGetMoment?: boolean) => {
      switch (value) {
        case TrendOfTime.M:
          return isGetMoment ? arrMomentFullDateInMonth() : arrDateInMonth();
        case TrendOfTime.M3:
          return isGetMoment ? arrMomentThreeMonth() : arrThreeMonthCurrent();
        case TrendOfTime.Y:
          return isGetMoment ? arrMomentMonthInYear() : arrMonthInYear();
        default:
          return isGetMoment ? arrMomentDateInWeek() : arrDateInWeek();
      }
    },
    [],
  );

  const formatMoment = useCallback((value: Moment, trendType: TrendOfTime) => {
    switch (trendType) {
      case TrendOfTime.Y:
        return value.format(formatMonthChart);
      default:
        return value.format(formatDateChart);
    }
  }, []);

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
  const dataChartAxisMoment = useCallback(
    (trendType: TrendOfTime) => {
      const result = dataChartAxis(trendType, true);
      return result;
    },
    [dataChartAxis],
  );

  const fillTrendData = useCallback(
    (
      dataMoment: string[],
      dataFill: { timeRange: string; value: string | number }[],
    ) =>
      dataMoment?.map((item) => {
        const findItem = dataFill?.find(
          (itemTrend) => itemTrend?.timeRange === item,
        );
        if (findItem) {
          return {
            timeRange: item,
            value: Number(findItem?.value),
          };
        }
        return {
          timeRange: item,
          value: 0,
        };
      }),
    [],
  );

  const detailDataIssue = useMemo(() => {
    const getFillArr = dataChartAxisMoment(timeTrendOfOutstanding)?.map(
      (item) => formatMoment(moment(new Date(item)), timeTrendOfOutstanding),
    );

    const numberOpenFindingsEachTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberOpenFindingsEachTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.total,
      })),
    );

    const numberAuditTimetableNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.attNotClosedOut,
      })),
    );

    const numberROFNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.rffNotClosedOut,
      })),
    );

    const numberIARNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      companyTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.iarNotClosedOut,
      })),
    );

    return {
      numberOpenFindingsEachTimeRange,
      numberAuditTimetableNotCloseoutTimeRange,
      numberROFNotCloseoutTimeRange,
      numberIARNotCloseoutTimeRange,
    };
  }, [
    dataChartAxisMoment,
    formatMoment,
    fillTrendData,
    timeTrendOfOutstanding,
    companyTrendIssues,
  ]);

  const dataChartTrendIssues = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of non-conformity /observations'
          ],
        ),
        data:
          detailDataIssue?.numberOpenFindingsEachTimeRange?.map((item) =>
            Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection time tables not closed out'
          ],
        ),
        data:
          detailDataIssue?.numberAuditTimetableNotCloseoutTimeRange?.map(
            (item) => Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of report of findings not closed out'
          ],
        ),
        data:
          detailDataIssue?.numberROFNotCloseoutTimeRange?.map((item) =>
            Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection reports not closed out'
          ],
        ),
        data:
          detailDataIssue?.numberIARNotCloseoutTimeRange?.map((item) =>
            Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
    ],
    [
      detailDataIssue?.numberAuditTimetableNotCloseoutTimeRange,
      detailDataIssue?.numberIARNotCloseoutTimeRange,
      detailDataIssue?.numberOpenFindingsEachTimeRange,
      detailDataIssue?.numberROFNotCloseoutTimeRange,
      dynamicLabels,
    ],
  );

  const detailDataAuditInspection = useMemo(() => {
    const getFillArr = dataChartAxisMoment(timeTrendOfAudit)?.map((item) =>
      formatMoment(moment(item), timeTrendOfAudit),
    );

    const totalFindingInEachRange = fillTrendData(
      getFillArr,
      companyTrendAuditInspection?.totalFindingInEachRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfAudit,
        ),
        value: item.total,
      })),
    );

    const averageFindingPerPlanInEachRange = fillTrendData(
      getFillArr,
      companyTrendAuditInspection?.averageFindingPerPlanInEachRange?.map(
        (item) => ({
          timeRange: formatMoment(
            moment(new Date(item?.timeRange)),
            timeTrendOfAudit,
          ),
          value: item.averageFindingsPerPlan,
        }),
      ),
    );

    const rateOverdueReportEachTimeRange = fillTrendData(
      getFillArr,
      companyTrendAuditInspection?.rateOverdueReportEachTimeRange?.map(
        (item) => ({
          timeRange: formatMoment(
            moment(new Date(item?.timeRange)),
            timeTrendOfAudit,
          ),
          value: item.rateOverdueReport,
        }),
      ),
    );

    const workloadOfAllAuditorsEachTimeRange = fillTrendData(
      getFillArr,
      companyTrendAuditInspection?.workloadOfAllAuditorsEachTimeRange?.map(
        (item) => ({
          timeRange: formatMoment(
            moment(new Date(item?.timeRange)),
            timeTrendOfAudit,
          ),
          value: item.workload,
        }),
      ),
    );

    return {
      totalFindingInEachRange,
      averageFindingPerPlanInEachRange,
      rateOverdueReportEachTimeRange,
      workloadOfAllAuditorsEachTimeRange,
    };
  }, [
    dataChartAxisMoment,
    formatMoment,
    fillTrendData,
    timeTrendOfAudit,
    companyTrendAuditInspection,
  ]);

  const dataChartTrendAudit = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Total findings by main category'
          ],
        ),
        data:
          detailDataAuditInspection?.totalFindingInEachRange?.map((item) =>
            Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Average findings per inspection plan'
          ],
        ),
        data:
          detailDataAuditInspection?.averageFindingPerPlanInEachRange?.map(
            (item) => Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Rate of overdue reports'],
        ),
        data:
          detailDataAuditInspection?.rateOverdueReportEachTimeRange?.map(
            (item) => Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Average workload of auditor'],
        ),
        data:
          detailDataAuditInspection?.workloadOfAllAuditorsEachTimeRange?.map(
            (item) => Number(Number(item.value)?.toFixed(2)),
          ) || [],
      },
    ],
    [
      detailDataAuditInspection?.averageFindingPerPlanInEachRange,
      detailDataAuditInspection?.rateOverdueReportEachTimeRange,
      detailDataAuditInspection?.totalFindingInEachRange,
      detailDataAuditInspection?.workloadOfAllAuditorsEachTimeRange,
      dynamicLabels,
    ],
  );

  const renderModalWidth = (modalType: ModalDashboardType) => {
    switch (modalType) {
      case ModalDashboardType.NUMBER_AUDIT_TIME_TABLE:
      case ModalDashboardType.NUMBER_REPORT_OF_FINDING:
      case ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT:
        return 1400;
      default:
        return 970;
    }
  };

  const getSubTitleModalDouble = useCallback(
    (modal: string) => {
      let totalPlan = 0;
      companyUpcomingResponse?.upcomingPlan?.forEach((item) => {
        totalPlan += Number(item.upComingPr);
      });

      const totalUpcomingReports = companyUpcomingResponse?.upcomingIAR?.reduce(
        (a, b) => a + Number(b.upComingIAR),
        0,
      );

      switch (modal) {
        case ModalDashboardType.UPCOMING_AUDIT_PLAN_VESSEL:
          return `${renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Number of upcoming audit plans'
            ],
          )}: ${convertNumberInt(totalPlan) || 0}`;
        case ModalDashboardType.UPCOMING_REPORTS_VESSEL:
          return `${renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of upcoming reports'],
          )}: ${totalUpcomingReports || 0}`;
        default:
          return '';
      }
    },
    [
      companyUpcomingResponse?.upcomingIAR,
      companyUpcomingResponse?.upcomingPlan,
      dynamicLabels,
    ],
  );

  const handleGetDataModalDetail = useCallback(
    (modalType: string, id: string, data: DataDetailModal) => {
      switch (modalType) {
        case ModalDashboardType.UPCOMING_AUDIT_PLAN_VESSEL: {
          dispatch(
            getCompanyUpcomingPlanByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }
        case ModalDashboardType.UPCOMING_REPORTS_VESSEL: {
          dispatch(
            getCompanyUpcomingIARByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }

        case ModalDashboardType.NON_CONFORMITY: {
          dispatch(
            getCompanyOpenNonConformityByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }
        case ModalDashboardType.OBSERVATIONS: {
          dispatch(
            getCompanyOpenFindingObservationByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }

        default:
          break;
      }
      setDataDetailModal(data);
    },
    [dispatch],
  );

  const renderModalTable = useCallback(() => {
    let title = '';
    let columns = [];
    let data = [];
    let newData = [];
    let moduleTemplate = '';
    let fileName = '';
    let aggridId = '';
    let hasVesselName = false;

    let dataDefault = [];
    const sortName = sort?.split(':')[0] || '';
    const sortType = sort?.split(':')[1] || '';
    const isSortFieldNumber = ['upComingPr', 'total', 'upComingIAR'].includes(
      sortName,
    );

    const isSortFieldDate = ['plannedFromDate'].includes(sortName);

    if (modal === ModalDashboardType.HIDDEN) {
      return null;
    }

    switch (modal) {
      case ModalDashboardType.UPCOMING_AUDIT_PLAN_VESSEL:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            `Upcoming audit plans${isDetailModal ? ' details' : ''}`
          ],
        );

        newData =
          companyUpcomingResponse?.upcomingPlan?.map((item) => ({
            ...item,
            action: (
              <div className="d-flex align-items-center">
                {renderButtonView(false, () =>
                  handleGetDataModalDetail(
                    modal,
                    item?.vesselId || item?.auditCompanyId,
                    {
                      vesselCode: item?.vesselCode || '',
                      vesselName: item?.vesselName || '',
                      auditCompanyName: item?.auditCompanyName || '',
                      labelTotal: renderDynamicLabel(
                        dynamicLabels,
                        INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                          'Total upcoming audit plans'
                        ],
                      ),
                    },
                  ),
                )}
              </div>
            ),
          })) || [];
        columns = isDetailModal
          ? columnsDefinition({
              colType: 'columnUpcomingAuditPlanVesselDetail',
              isMultiColumnFilter,
              handleGetDataModalDetail,
              dynamicLabels,
            })
          : columnsDefinition({
              colType: 'columnUpcomingAuditPlanVessel',
              isMultiColumnFilter,
              handleGetDataModalDetail,
              dynamicLabels,
            });
        data = isDetailModal ? [...dataUpcomingPlanByVesselList] : [...newData];
        dataDefault = isDetailModal
          ? [...dataUpcomingPlanByVesselList]
          : newData;
        fileName = MODULE_TEMPLATE.upcomingAuditPlanVessel;
        aggridId = 'ag-grid-table-6';
        moduleTemplate = MODULE_TEMPLATE.upcomingAuditPlanVessel;
        hasVesselName = true;
        break;
      case ModalDashboardType.UPCOMING_REPORTS_VESSEL:
        newData =
          companyUpcomingResponse?.upcomingIAR?.map((item) => ({
            ...item,
            action: (
              <div className="d-flex align-items-center">
                {renderButtonView(false, () =>
                  handleGetDataModalDetail(modal, item?.vesselId, {
                    vesselCode: item?.vesselCode || '',
                    vesselName: item?.vesselName || '',
                    auditCompanyName: item?.auditCompanyName || '',
                    labelTotal: renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                        'Total upcoming reports'
                      ],
                    ),
                  }),
                )}
              </div>
            ),
          })) || [];
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            `Upcoming reports${isDetailModal ? ' details' : ''}`
          ],
        );
        columns = isDetailModal
          ? columnsDefinition({
              colType: 'columnUpcomingReportVesselDetail',
              isMultiColumnFilter,
              handleGetDataModalDetail,
              dynamicLabels,
            })
          : columnsDefinition({
              colType: 'columnUpcomingReportVessel',
              isMultiColumnFilter,

              handleGetDataModalDetail,
              dynamicLabels,
            });
        data = isDetailModal ? [...dataUpcomingIARByVesselList] : [...newData];
        dataDefault = isDetailModal
          ? [...dataUpcomingIARByVesselList]
          : newData || [];
        fileName = MODULE_TEMPLATE.upcomingReportVessel;
        aggridId = 'ag-grid-table-7';
        moduleTemplate = MODULE_TEMPLATE.upcomingReportVessel;
        hasVesselName = true;
        break;
      case ModalDashboardType.NON_CONFORMITY:
        newData =
          companyOutstandingIssues?.outstandingIssuesNonConformity?.map(
            (item) => ({
              ...item,
              action: (
                <div className="d-flex align-items-center">
                  {renderButtonView(false, () =>
                    handleGetDataModalDetail(
                      modal,
                      item?.vesselId || item?.auditCompanyId,
                      {
                        vesselCode: item?.vesselCode || '',
                        vesselName: item?.vesselName || '',
                        auditCompanyName: item?.auditCompanyName || '',
                        labelTotal: renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                            'Total non-conformity findings'
                          ],
                        ),
                      },
                    ),
                  )}
                </div>
              ),
            }),
          ) || [];
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            `Open non-conformity${isDetailModal ? ' details' : ''}`
          ],
        );
        columns = isDetailModal
          ? columnsDefinition({
              colType: 'columnNonConformityDetail',
              isMultiColumnFilter,

              handleGetDataModalDetail,
              dynamicLabels,
            })
          : columnsDefinition({
              colType: 'columnNonConformity',
              isMultiColumnFilter,

              handleGetDataModalDetail,
              dynamicLabels,
            });
        data = isDetailModal
          ? [...dataOpenNonConformityByVesselList]
          : [...newData];
        dataDefault = isDetailModal
          ? [...dataOpenNonConformityByVesselList]
          : newData || [];
        fileName = MODULE_TEMPLATE.openNonConformityCompany;
        aggridId = 'ag-grid-table-1';
        moduleTemplate = MODULE_TEMPLATE.openNonConformityCompany;
        hasVesselName = true;
        break;
      case ModalDashboardType.OBSERVATIONS:
        newData =
          companyOutstandingIssues?.outstandingIssuesObservation?.map(
            (item) => ({
              ...item,
              action: (
                <div className="d-flex align-items-center">
                  {renderButtonView(false, () =>
                    handleGetDataModalDetail(
                      modal,
                      item?.vesselId || item?.auditCompanyId,
                      {
                        vesselCode: item?.vesselCode,
                        vesselName: item?.vesselName,
                        auditCompanyName: item?.auditCompanyName || '',
                        labelTotal: renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                            'Total open observations'
                          ],
                        ),
                      },
                    ),
                  )}
                </div>
              ),
            }),
          ) || [];
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            `Open observations${isDetailModal ? ' details' : ''}`
          ],
        );
        columns = isDetailModal
          ? columnsDefinition({
              colType: 'columnObservationsDetail',
              isMultiColumnFilter,
              handleGetDataModalDetail,
              dynamicLabels,
            })
          : columnsDefinition({
              colType: 'columnObservations',
              isMultiColumnFilter,
              handleGetDataModalDetail,
              dynamicLabels,
            });
        data = isDetailModal
          ? [...dataOpenFindingObservationByVesselList]
          : [...newData];
        dataDefault = isDetailModal
          ? [...dataOpenFindingObservationByVesselList]
          : newData || [];
        fileName = MODULE_TEMPLATE.openObservationsCompany;
        aggridId = 'ag-grid-table-2';
        moduleTemplate = MODULE_TEMPLATE.openObservationsCompany;
        hasVesselName = true;
        break;
      case ModalDashboardType.NUMBER_AUDIT_TIME_TABLE:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Inspection time tables not closed out'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnAuditTimeTable',
          isMultiColumnFilter,

          handleGetDataModalDetail,
          dynamicLabels,
        });
        data = companyOutstandingIssues?.outstandingIssuesTimeTable?.map(
          (item: OutstandingIssuesTimeTable) => ({
            ...item,
            plannedFromDate: formatDateTime(item?.plannedFromDate),
          }),
        );
        fileName = MODULE_TEMPLATE.inspectionTimeTablesNotClosedOutCompany;
        aggridId = 'ag-grid-table-3';
        moduleTemplate =
          MODULE_TEMPLATE.inspectionTimeTablesNotClosedOutCompany;
        dataDefault =
          companyOutstandingIssues?.outstandingIssuesTimeTable?.map(
            (item: OutstandingIssuesTimeTable) => ({
              ...item,
              plannedFromDate: formatDateTime(item?.plannedFromDate),
            }),
          ) || [];
        break;
      case ModalDashboardType.NUMBER_REPORT_OF_FINDING:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Report of findings not closed out'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnReportOfFinding',
          isMultiColumnFilter,
          handleGetDataModalDetail,
          feature: Features.AUDIT_INSPECTION,
          dynamicLabels,
        });
        data = companyOutstandingIssues?.outstandingIssuesFindingForm?.map(
          (item: OutstandingFindingIssues) => ({
            ...item,
            auditRefID: item?.['auditRef.ID'],
            plannedFromDate: formatDateTime(item?.plannedFromDate),
          }),
        );
        fileName = MODULE_TEMPLATE.reportOfFindingsNotClosedOutCompany;
        aggridId = 'ag-grid-table-4';
        moduleTemplate = MODULE_TEMPLATE.reportOfFindingsNotClosedOutCompany;
        dataDefault =
          companyOutstandingIssues?.outstandingIssuesFindingForm?.map(
            (item: OutstandingFindingIssues) => ({
              ...item,
              auditRefID: item?.['auditRef.ID'],
              plannedFromDate: formatDateTime(item?.plannedFromDate),
            }),
          ) || [];
        break;
      case ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Inspection reports not closed out'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnInternalAuditReport',
          isMultiColumnFilter,
          handleGetDataModalDetail,
          feature: Features.AUDIT_INSPECTION,
          dynamicLabels,
        });
        data = companyOutstandingIssues?.outstandingIssuesIar.map((item) => ({
          ...item,
          auditRefID: item?.['auditRef.ID'],
          planningID: item?.auditRefId || '',
          status: reFormatStatus(item?.status),
        }));

        dataDefault =
          companyOutstandingIssues?.outstandingIssuesIar.map((item) => ({
            ...item,
            auditRefID: item?.['auditRef.ID'],
            planningID: item?.auditRefId || '',
            status: reFormatStatus(item?.status),
          })) || [];
        fileName = MODULE_TEMPLATE.inspectionReportsNotClosedOutAuditor;
        aggridId = 'ag-grid-table-5';
        moduleTemplate = MODULE_TEMPLATE.inspectionReportsNotClosedOutAuditor;
        break;
      default:
        break;
    }

    if (sort) {
      data.sort((current, next) => {
        const currentValue = isSortFieldNumber
          ? Number(current[sortName])
          : current[sortName];

        const nextValue = isSortFieldNumber
          ? Number(next[sortName])
          : next[sortName];

        if (sortType === '1') {
          if (isSortFieldDate) {
            return new Date(currentValue) > new Date(nextValue) ? 1 : -1;
          }
          return currentValue > nextValue ? 1 : -1;
        }
        if (sortType === '-1') {
          if (isSortFieldDate) {
            return new Date(currentValue) < new Date(nextValue) ? 1 : -1;
          }
          return currentValue < nextValue ? 1 : -1;
        }
        return 1;
      });
    } else {
      data = [...dataDefault];
    }

    if (modal === ModalDashboardType.WORKLOAD) {
      return (
        <ModalAuditor
          isOpen
          toggle={() => {
            setSort('');
            setModal(ModalDashboardType.HIDDEN);
          }}
          title={renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Average auditor workload (last 30 days)'
            ],
          )}
          dynamicLabels={dynamicLabels}
          data={companyAvgResponse?.workloadsOfAuditors?.map((item) => ({
            id: item.id,
            username: item.username,
            periodOfTime: item.workload,
            imageId: item.avatar,
            link: permissionCheck(userInfo, {
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
            })
              ? `/user-management/detail/${item.id}`
              : null,
          }))}
        />
      );
    }

    const isModalDouble = [
      ModalDashboardType.UPCOMING_AUDIT_PLAN_VESSEL,
      ModalDashboardType.UPCOMING_REPORTS_VESSEL,
      ModalDashboardType.NON_CONFORMITY,
      ModalDashboardType.OBSERVATIONS,
    ].includes(modal);

    if (isModalDouble) {
      return (
        <ModalDoubleAGGrid
          isOpen
          dataSource={[...data]}
          toggle={() => {
            setSort('');
            setDataDetailModal(null);
            setIsDetailModal(false);
            setModal(ModalDashboardType.HIDDEN);
          }}
          dataDetailModal={dataDetailModal}
          columns={columns}
          hasVesselName={hasVesselName}
          handleBack={() => setIsDetailModal(false)}
          isDetail={isDetailModal}
          subTitle={getSubTitleModalDouble(modal)}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          modalType={ModalType.LARGE}
          handleClick={(data) => {
            if (!isDetailModal) {
              switch (modal) {
                case ModalDashboardType.UPCOMING_AUDIT_PLAN_VESSEL: {
                  handleGetDataModalDetail(
                    modal,
                    data?.vesselId || data?.auditCompanyId,
                    {
                      vesselCode: data?.vesselCode || '',
                      vesselName: data?.vesselName || '',
                      auditCompanyName: data?.auditCompanyName || '',
                      labelTotal: renderDynamicLabel(
                        dynamicLabels,
                        INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                          'Total upcoming audit plans'
                        ],
                      ),
                    },
                  );

                  break;
                }
                case ModalDashboardType.UPCOMING_REPORTS_VESSEL: {
                  handleGetDataModalDetail(modal, data?.vesselId, {
                    vesselCode: data?.vesselCode,
                    vesselName: data?.vesselName,
                    auditCompanyName: data?.auditCompanyName || '',
                    labelTotal: renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                        'Total upcoming reports'
                      ],
                    ),
                  });
                  break;
                }

                case ModalDashboardType.NON_CONFORMITY: {
                  handleGetDataModalDetail(
                    modal,
                    data?.vesselId || data?.auditCompanyId,
                    {
                      vesselCode: data?.vesselCode,
                      vesselName: data?.vesselName,
                      auditCompanyName: data?.auditCompanyName || '',
                      labelTotal: renderDynamicLabel(
                        dynamicLabels,
                        INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                          'Total non-conformity findings'
                        ],
                      ),
                    },
                  );
                  break;
                }
                case ModalDashboardType.OBSERVATIONS: {
                  handleGetDataModalDetail(
                    modal,
                    data?.vesselId || data?.auditCompanyId,
                    {
                      vesselCode: data?.vesselCode,
                      vesselName: data?.vesselName,
                      auditCompanyName: data?.auditCompanyName || '',
                      labelTotal: renderDynamicLabel(
                        dynamicLabels,
                        INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                          'Total open observations'
                        ],
                      ),
                    },
                  );
                  break;
                }

                default:
                  break;
              }
            } else {
              switch (modal) {
                case ModalDashboardType.UPCOMING_AUDIT_PLAN_VESSEL: {
                  openNewPage(
                    AppRouteConst.getPlanningAndRequestById(data?.planId),
                  );
                  break;
                }
                case ModalDashboardType.UPCOMING_REPORTS_VESSEL:
                case ModalDashboardType.NON_CONFORMITY:
                case ModalDashboardType.OBSERVATIONS: {
                  openNewPage(
                    AppRouteConst.getInternalAuditReportById(data?.iarId),
                  );
                  break;
                }
                default:
                  break;
              }
            }
          }}
          w={renderModalWidth(modal)}
          title={title}
          aggridId={aggridId}
          moduleTemplate={moduleTemplate}
          fileName={fileName}
        />
      );
    }

    return (
      <ModalTableAGGrid
        scroll={{ x: 'max-content', y: 360 }}
        isOpen
        dataSource={[...data]}
        toggle={() => {
          setSort('');
          setModal(ModalDashboardType.HIDDEN);
        }}
        columns={columns}
        sort={sort}
        onSort={(value: string) => {
          setSort(value);
        }}
        handleClick={(data) => {
          switch (modal) {
            case ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT:
              return (
                data?.id &&
                openNewPage(AppRouteConst.getInternalAuditReportById(data?.id))
              );
            case ModalDashboardType.NUMBER_AUDIT_TIME_TABLE:
              return (
                data?.auditTimeTableId &&
                openNewPage(
                  AppRouteConst.getAuditTimeTableById(data?.auditTimeTableId),
                )
              );
            default:
              break;
          }
          return null;
        }}
        w={renderModalWidth(modal)}
        title={title}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        aggridId={aggridId}
        moduleTemplate={moduleTemplate}
        fileName={fileName}
        modalType={ModalType.LARGE}
      />
    );
  }, [
    sort,
    modal,
    isDetailModal,
    companyUpcomingResponse?.upcomingPlan,
    companyUpcomingResponse?.upcomingIAR,
    isMultiColumnFilter,
    handleGetDataModalDetail,
    dataUpcomingPlanByVesselList,
    dataUpcomingIARByVesselList,
    companyOutstandingIssues?.outstandingIssuesNonConformity,
    companyOutstandingIssues?.outstandingIssuesObservation,
    companyOutstandingIssues?.outstandingIssuesTimeTable,
    companyOutstandingIssues?.outstandingIssuesFindingForm,
    companyOutstandingIssues?.outstandingIssuesIar,
    dataOpenNonConformityByVesselList,
    dynamicLabels,
    dataOpenFindingObservationByVesselList,
    companyAvgResponse?.workloadsOfAuditors,
    userInfo,
    dataDetailModal,
    getSubTitleModalDouble,
  ]);

  const totalWorkload = useMemo(() => {
    let totalWorkload = 0;
    companyAvgResponse?.workloadsOfAuditors?.forEach((item) => {
      totalWorkload += item.workload;
    });
    return totalWorkload;
  }, [companyAvgResponse?.workloadsOfAuditors]);

  const avgWorkload = useMemo(
    () =>
      financial(
        totalWorkload / (Number(companyAvgResponse?.totalAuditors) || 1),
      ),
    [companyAvgResponse?.totalAuditors, totalWorkload],
  );

  // const totalPlan = useMemo(() => {
  //   let totalPlan = 0;
  //   companyUpcomingResponse?.upcomingPlan?.forEach((item) => {
  //     totalPlan += Number(item.upComingPr);
  //   });
  //   return totalPlan;
  // }, [companyUpcomingResponse?.upcomingPlan]);

  const totalIAR = useMemo(() => {
    let totalIAR = 0;
    companyUpcomingResponse?.upcomingIAR?.forEach((item) => {
      totalIAR += Number(item.upComingIAR);
    });
    return totalIAR;
  }, [companyUpcomingResponse?.upcomingIAR]);

  const onLayoutChange = useCallback(
    (currentLayouts) => {
      setLayout(currentLayouts);
      setLocalLayout(currentLayouts);
    },
    [setLocalLayout],
  );

  const onRemoveWidget = useCallback(
    (widgetId: string) => () => {
      const newLayout = layout.filter((l) => l?.i !== widgetId);
      setLayout(newLayout);
    },
    [layout],
  );

  const widgetAvgFindingsPerAuditPlan = useMemo(
    () => (
      <>
        <BlockImage
          color="#0842FF"
          bgImageColor="#E6ECFF"
          image={<img src={images.icons.icWorkBlue} alt="img" />}
          title={financial(companyAvgResponse?.averageFindingPerPlan || 0)}
          content={renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Avg. findings per inspection plan'
            ],
          )}
        />
        <span
          className={styles.widgetRemoveIcon}
          onClick={onRemoveWidget('avgFindingsPerAuditPlan')}
        >
          <img src={images.icons.icGrayX} alt="remove" />
        </span>
      </>
    ),
    [companyAvgResponse?.averageFindingPerPlan, dynamicLabels, onRemoveWidget],
  );

  const widgetRateOfOverdueReports = useMemo(
    () => (
      <BlockImage
        color="#FF6E01"
        bgImageColor="#FFF1E6"
        image={<img src={images.icons.icPaperOrange} alt="img" />}
        title={financial(companyAvgResponse?.rateOverdueReport || 0)}
        content={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Rate of overdue reports'],
        )}
      />
    ),
    [companyAvgResponse?.rateOverdueReport, dynamicLabels],
  );

  const widgetAverageWorkloadOfAuditorByMonth = useMemo(
    () => (
      <BlockImageViewMore
        bgImage={
          <div className={cx(styles.bgChart)}>
            <img
              src={images.chart.imgChartSquare}
              className={cx(styles.imgChart)}
              alt="img"
            />
          </div>
        }
        className="h-100"
        position={Position.LEFT}
        onViewMore={() => setModal(ModalDashboardType.WORKLOAD)}
        title={avgWorkload}
        color="#964FFF"
        content={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Average workload of auditor by month'
          ],
        )}
        dynamicLabels={dynamicLabels}
      />
    ),
    [avgWorkload, dynamicLabels],
  );

  const widgetTotalFindings = useMemo(
    () => (
      <div className={cx(styles.totalFinding, styles.flexColumn)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={styles.titleDoughnut}>
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                'Total findings (last 30 days)'
              ],
            )}
          </div>
          <SelectUI
            data={[
              {
                value: 'main',
                label: renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_DASHBOARD_DYNAMIC_FIELDS['By main category'],
                ),
              },
              {
                value: 'location',
                label: renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_DASHBOARD_DYNAMIC_FIELDS['By location'],
                ),
              },
            ]}
            className={cx('input-select', styles.selectInput)}
            onChange={(e: string) => setTotalFinding(e)}
            value={totalFinding}
            notAllowSortData
          />
        </div>
        <DoughnutChart
          title={renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Total findings'],
          )}
          data={dataDoughnut}
          doughNutClassName={styles.customDoughNut}
          className={styles.wrapDoughnutChart}
          styleChartInfo={styles.styleChartInfo}
          noDataClassName={styles.noDataCenter}
        />
      </div>
    ),
    [dataDoughnut, dynamicLabels, totalFinding],
  );

  const widgetInspectionChecklistStatus = useMemo(
    () => (
      <BlockImageSelect
        color="#1ED39D"
        bgImageColor="#E6FFF0"
        image={<img src={images.icons.icCheckGreen} alt="img" />}
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection checklist status'],
        )}
        content={(value) =>
          renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              `Total number of ${value} inspection checklist`
            ],
          )
        }
        setStatus={(value) => {
          setFilterStatus((p) => ({
            ...p,
            ckListStatus: value?.toString(),
          }));
        }}
        option={FILTER_INSPECTION_CHECKLIST}
        defaultLabel={filterStatus.ckListStatus}
        value={totalCkListRofIar?.totalCkList || 0}
      />
    ),
    [dynamicLabels, filterStatus.ckListStatus, totalCkListRofIar?.totalCkList],
  );

  const widgetReportOfFindingsStatus = useMemo(
    () => (
      <BlockImageSelect
        color="#FC9700"
        bgImageColor="#FFF2E6"
        image={<img src={images.icons.icMessageErrorYellow} alt="img" />}
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of findings status'],
        )}
        content={(value) =>
          renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              `Total number of ${value} report of findings`
            ],
          )
        }
        setStatus={(value) => {
          setFilterStatus((p) => ({
            ...p,
            rofStatus: value?.toString(),
          }));
        }}
        option={FILTER_REPORT_OF_FINDINGS}
        defaultLabel={filterStatus.rofStatus}
        value={totalCkListRofIar?.totalRof || 0}
      />
    ),
    [dynamicLabels, filterStatus.rofStatus, totalCkListRofIar?.totalRof],
  );

  const widgetInspectionReportStatus = useMemo(
    () => (
      <BlockImageSelect
        color="#E042FA"
        bgImageColor="#FFE6FF"
        image={<img src={images.icons.icPasteBlue} alt="img" />}
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection report status'],
        )}
        content={(value) =>
          renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              `Total number of ${value} inspection report`
            ],
          )
        }
        setStatus={(value) => {
          setFilterStatus((p) => ({
            ...p,
            iarStatus: value?.toString(),
          }));
        }}
        option={FILTER_INSPECTION_REPORT}
        defaultLabel={filterStatus.iarStatus}
        value={totalCkListRofIar?.totalIar || 0}
      />
    ),
    [dynamicLabels, filterStatus.iarStatus, totalCkListRofIar?.totalIar],
  );

  const widgetTrendsOfAuditAndInspectionActivities = useMemo(
    () => (
      <div className={cx(styles.TOAAndIA)}>
        <TrendOfTimeFilter
          title={renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Trends of audit & inspection activities'
            ],
          )}
          dateSelected={timeTrendOfAudit}
          onChangeFilter={(date) => setTimeTrendOfAudit(date)}
        />
        <LineChart
          labels={dataChartAxis(timeTrendOfAudit)}
          data={dataChartTrendAudit}
          height={240}
          stepInteger
        />
      </div>
    ),
    [dataChartAxis, dataChartTrendAudit, dynamicLabels, timeTrendOfAudit],
  );

  // const widgetOpenTasks = useMemo(
  //   () => <ListOfItemReview data={companyOverviewTask} title="Open tasks" />,
  //   [companyOverviewTask],
  // );
  const widgetOpenTasks = useMemo(
    () => (
      <div className={styles.OpenTaskContainer}>
        <OpenTask dynamicLabels={dynamicLabels} entity={globalFilter?.entity} />
      </div>
    ),
    [dynamicLabels, globalFilter?.entity],
  );

  // const widgetNumberOfUpcomingAuditPlanByVessel = useMemo(
  //   () => (
  //     <BlockImageViewMore
  //       bgImage={
  //         <div className={cx('pt-2')}>
  //           <img
  //             src={images.chart.chartBlue}
  //             className={cx(styles.imgChart)}
  //             alt="img"
  //           />
  //         </div>
  //       }
  //       position={Position.LEFT}
  //       title={convertNumberInt(totalPlan)}
  //       color="#0842FF"
  //       onViewMore={() =>
  //         setModal(ModalDashboardType.UPCOMING_AUDIT_PLAN_VESSEL)
  //       }
  //       className={cx(styles.blockNumber)}
  //       content={renderDynamicLabel(
  //         dynamicLabels,
  //         INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
  //           'Number of upcoming inspection plans'
  //         ],
  //       )}
  //       dynamicLabels={dynamicLabels}
  //     />
  //   ),
  //   [dynamicLabels, totalPlan],
  // );

  const widgetNumberOfUpcomingReportsByVessel = useMemo(
    () => (
      <BlockImageViewMore
        bgImage={
          <div className={cx('pt-2')}>
            <img
              src={images.chart.imgChartSquare}
              className={cx(styles.imgChart)}
              alt="img"
            />
          </div>
        }
        position={Position.RIGHT}
        title={convertNumberInt(totalIAR)}
        color="#964FFF"
        onViewMore={() => setModal(ModalDashboardType.UPCOMING_REPORTS_VESSEL)}
        className={cx(styles.blockNumber, styles.upComingContainer)}
        bgClassName={styles.upComingBG}
        contentClassName={styles.upComingContents}
        content={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of upcoming reports'],
        )}
        dynamicLabels={dynamicLabels}
      />
    ),
    [dynamicLabels, totalIAR],
  );

  const widgetTrendsOfOutstandingIssues = useMemo(
    () => (
      <div className={cx(styles.TOAAndIA, styles.trendIssuesMonth)}>
        <TrendOfTimeFilter
          title={renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Trends of outstanding issues'],
          )}
          dateSelected={timeTrendOfOutstanding}
          onChangeFilter={(date) => setTimeTrendOfOutstanding(date)}
        />

        <LineChart
          labels={dataChartAxis(timeTrendOfOutstanding)}
          data={dataChartTrendIssues}
          height={260}
          stepInteger
        />
      </div>
    ),
    [
      dataChartAxis,
      dataChartTrendIssues,
      dynamicLabels,
      timeTrendOfOutstanding,
    ],
  );

  const widgetOutstandingIssue = useMemo(
    () => (
      <div className={cx(styles.issueWrapper)}>
        <div className={styles.title}>
          {renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Outstanding issue'],
          )}
        </div>
        {outstandingIssue?.map((item) => (
          <Row className={styles.wrapper} key={item.modalType}>
            <Col span={16} className={cx(styles.label, styles.title)}>
              {item.name}
            </Col>
            <Col span={8}>
              <div className={cx(styles.number, styles.title)}>
                {item.number}
              </div>
              {Number(item?.number) > 0 && (
                <div
                  className={cx(styles.viewMore, styles.title)}
                  onClick={() => setModal(item?.modalType)}
                >
                  {renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_DASHBOARD_DYNAMIC_FIELDS['View more'],
                  )}
                </div>
              )}
            </Col>
          </Row>
        ))}
      </div>
    ),
    [dynamicLabels, outstandingIssue],
  );

  const widgetCarCapNeedReviewing = useMemo(() => <CarCapNeedReviewing />, []);

  const widgetTrendOfOutstandingCarCapIssue = useMemo(
    () => (
      <TrendOfOutstandingCarCapIssue
        dashboard={DashBoard.COMPANY}
        timeTrendOfOutstandingCarCap={timeTrendOfOutstandingCarCap}
        setTimeTrendOfOutstandingCarCap={setTimeTrendOfOutstandingCarCap}
        entity={globalFilter?.entity}
        dynamicLabels={dynamicLabels}
      />
    ),
    [timeTrendOfOutstandingCarCap, globalFilter?.entity, dynamicLabels],
  );

  const widgetOutstandingCarCapIssue = useMemo(
    () => (
      <OutstandingCarCapIssue
        dashboard={DashBoard.COMPANY}
        entity={globalFilter?.entity}
      />
    ),
    [globalFilter?.entity],
  );

  const widgetDictionary = useMemo(
    () => ({
      avgFindingsPerAuditPlan: widgetAvgFindingsPerAuditPlan,
      rateOfOverdueReports: widgetRateOfOverdueReports,
      averageWorkloadOfAuditorByMonth: widgetAverageWorkloadOfAuditorByMonth,
      totalFindings: widgetTotalFindings,
      inspectionChecklistStatus: widgetInspectionChecklistStatus,
      reportOfFindingsStatus: widgetReportOfFindingsStatus,
      inspectionReportStatus: widgetInspectionReportStatus,
      trendsOfAuditAndInspectionActivities:
        widgetTrendsOfAuditAndInspectionActivities,
      openTasks: widgetOpenTasks,
      // numberOfUpcomingAuditPlanByVessel:
      //   widgetNumberOfUpcomingAuditPlanByVessel,
      numberOfUpcomingReportsByVessel: widgetNumberOfUpcomingReportsByVessel,
      upcomingInspectionPlans: (
        <CalendarTimeTableProvider>
          <UpcomingInspectionPlans
            setLayout={setLayout}
            isDraggable
            dynamicLabels={dynamicLabels}
            globalFilter={globalFilter}
          />
        </CalendarTimeTableProvider>
      ),
      trendsOfOutstandingIssues: widgetTrendsOfOutstandingIssues,
      outstandingIssue: widgetOutstandingIssue,
      carCapNeedReviewing: widgetCarCapNeedReviewing,
      trendOfOutStandingCarCapIssue: widgetTrendOfOutstandingCarCapIssue,
      outStandingCarCapIssue: widgetOutstandingCarCapIssue,
    }),
    [
      widgetAvgFindingsPerAuditPlan,
      widgetRateOfOverdueReports,
      widgetAverageWorkloadOfAuditorByMonth,
      widgetTotalFindings,
      widgetInspectionChecklistStatus,
      widgetReportOfFindingsStatus,
      widgetInspectionReportStatus,
      widgetTrendsOfAuditAndInspectionActivities,
      widgetOpenTasks,
      widgetNumberOfUpcomingReportsByVessel,
      dynamicLabels,
      globalFilter,
      widgetTrendsOfOutstandingIssues,
      widgetOutstandingIssue,
      widgetCarCapNeedReviewing,
      widgetTrendOfOutstandingCarCapIssue,
      widgetOutstandingCarCapIssue,
    ],
  );

  const renderListWidget = useMemo(
    () =>
      layout.map((widgetInfo) => {
        const widgetId = widgetInfo.i;
        return (
          <div key={widgetId} data-grid={widgetInfo}>
            {widgetDictionary[widgetId] ?? null}
            <span
              className={styles.widgetRemoveIcon}
              onClick={onRemoveWidget(widgetId)}
            >
              <img src={images.icons.icGrayX} alt="remove" />
            </span>
          </div>
        );
      }),
    [layout, onRemoveWidget, widgetDictionary],
  );

  useEffect(() => {
    if (localLayout) {
      setLayout(localLayout);
    }
  }, [localLayout]);

  return (
    <div className={styles.dashboard}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.INSPECTION_DASHBOARD}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionDashboard,
        )}
      />
      <div className={styles.container}>
        <div className={cx('d-flex justify-content-end', styles.wrapFilter)}>
          <HeaderFilter
            onChangeFilter={setGlobalFilter}
            className={styles.customSelect}
            filter={globalFilter}
            dynamicLabels={dynamicLabels}
          />
        </div>
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          onLayoutChange={onLayoutChange}
          useCSSTransforms
          measureBeforeMount
        >
          {renderListWidget}
        </ReactGridLayout>

        {renderModalTable()}
      </div>
    </div>
  );
};

export default DashBoardCompanyContainer;
