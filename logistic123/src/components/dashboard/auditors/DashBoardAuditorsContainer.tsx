import images from 'assets/images/images';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState, lazy } from 'react';
import TableAntd from 'components/common/table-antd/TableAntd';
import Button, { ButtonType, ButtonSize } from 'components/ui/button/Button';
import { LineChart } from 'components/common/chart/line-chart/LineChart';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import {
  arrDateInMonth,
  arrDateInWeek,
  arrMonthInYear,
  arrThreeMonthCurrent,
  arrMomentFullDateInMonth,
  arrMomentThreeMonth,
  arrMomentMonthInYear,
  arrMomentDateInWeek,
  convertNumberInt,
  openNewPage,
  formatDateChart,
  formatMonthChart,
  formatDateTime,
} from 'helpers/utils.helper';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import {
  getAuditorTrendIssueActions,
  getAuditorUpcomingIARByVesselActions,
  getAuditorOpenNonConformityByVesselActions,
  getAuditorUpcomingPlanByVesselActions,
  getAuditorOpenFindingObservationByVesselActions,
  getAuditorOutstandingIssuesActions,
  getTotalCkListRofIarAuditorActions,
} from 'store/dashboard/dashboard.action';
import moment, { Moment } from 'moment';
import {
  getAuditTimeTableNotCloseOutActionsApi,
  getPlanningNeedReviewActionsApi,
  getTotalDashboardActionsApi,
  getUpcomingActionsApi,
} from 'api/dashboard.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppRouteConst } from 'constants/route.const';
import {
  OutstandingFindingIssues,
  OutstandingIssuesTimeTable,
  UpcomingIAR,
  UpcomingPlan,
} from 'models/api/dashboard/dashboard.model';
import {
  FILTER_INSPECTION_REPORT,
  FILTER_REPORT_OF_FINDINGS,
  FILTER_INSPECTION_CHECKLIST,
} from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { DashBoard } from 'constants/widget.const';
import { reFormatStatus } from 'helpers/status.helper';
import { useTranslation } from 'react-i18next';
import { Features } from 'constants/roleAndPermission.const';
import { ModalType } from 'components/ui/modal/Modal';
import CalendarTimeTableProvider from 'contexts/audit-time-table/CalendarTimeTable';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  BlockImage,
  DisplayBlock,
  BlockImageViewMore,
  Position,
  BlockImageSelect,
} from '../components/block/BlockImage';
import { DataDetailModal } from '../components/modal-double/ModalDouble';
import ListOverview from '../components/tab/auditor/ListOverview';

import styles from './dashboard-auditor.module.scss';

import {
  columnAuditTimeTableNotClosedOut,
  columnAuditPlansNeedReviewing,
  ModalTabType,
} from '../constants/auditor.const';
import ModalDoubleAGGrid from '../components/modal-double/ModalDoubleAGGrid';
import { columnsDefinition } from './auditor-columns-def';
import ModalTableAGGrid from '../components/modal/ModalTableAGGrid';
import HeaderFilter from '../components/header-filter/HeaderFilter';
import CarCapNeedReviewing from '../company/listWidget/CarCapNeedReviewing';
import TrendOfOutstandingCarCapIssue from '../company/listWidget/TrendOfOutstandingCarCapIssue';
import OutstandingCarCapIssue from '../company/listWidget/OutstandingCarCapIssue';

const UpcomingInspectionPlans = lazy(
  () =>
    import('../components/upcoming-inspection-plans/UpcomingInspectionPlan'),
);

export interface IFilter {
  entity?: string;
}

const DashBoardAuditorsContainer = () => {
  const [globalFilter, setGlobalFilter] = useState<IFilter>(null);
  const [timeTrendOfOutstanding, setTimeTrendOfOutstanding] =
    useState<TrendOfTime>(TrendOfTime.M);
  const [filterStatus, setFilterStatus] = useState({
    ckListStatus: 'Yet To Start',
    rofStatus: 'Draft',
    iarStatus: 'draft',
  });
  const { t } = useTranslation([I18nNamespace.DASHBOARD, I18nNamespace.COMMON]);
  const [modal, setModal] = useState<ModalTabType>(ModalTabType.HIDDEN);
  const dispatch = useDispatch();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionDashboard,
    modulePage: ModulePage.List,
  });
  const [sort, setSort] = useState('');
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const {
    auditorOutstandingIssues,
    auditorTrendIssues,
    dataUpcomingIARByVessel,
    dataOpenNonConformityByVessel,
    dataOpenFindingObservationByVessel,
    dataUpcomingPlanByVessel,
    totalCkListRofIar,
    openTaskDashboard,
  } = useSelector((state) => state.dashboard);
  const [convertDataPlanning, setConvertDataPlanning] = useState([]);
  const [convertDataAuditTimeNotCloseOut, setConvertDataAuditTimeNotCloseOut] =
    useState([]);
  const [totalPlanAudit, setTotalPlanAudit] = useState(undefined);
  const [totalInprogress, setTotalInprogress] = useState(undefined);
  const [totalComplete, setTotalComplete] = useState(undefined);
  const [upCommingIars, setUpCommingIars] = useState<UpcomingIAR[]>([]);
  const [upCommingPlans, setUpCommingPlans] = useState<UpcomingPlan[]>([]);

  const [isDetailModal, setIsDetailModal] = useState(false);
  const [dataDetailModal, setDataDetailModal] = useState<DataDetailModal>(null);

  const [timeTrendOfOutstandingCarCap, setTimeTrendOfOutstandingCarCap] =
    useState(TrendOfTime.M);

  const finalEntityTypeMemo = useMemo(
    () => (globalFilter?.entity !== 'All' ? globalFilter?.entity : undefined),
    [globalFilter?.entity],
  );

  useEffect(() => {
    if (filterStatus.ckListStatus) {
      dispatch(
        getTotalCkListRofIarAuditorActions.request({
          ...filterStatus,
          entityType: finalEntityTypeMemo,
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, finalEntityTypeMemo]);

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
      getAuditorTrendIssueActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
        entityType: finalEntityTypeMemo,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeTrendOfOutstanding, finalEntityTypeMemo]);

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

  const outstandingIssue = useMemo(() => {
    let totalNonConformity = 0;
    auditorOutstandingIssues?.outstandingIssuesNonConformity?.forEach(
      (item) => {
        totalNonConformity += Number(item.total);
      },
    );
    let totalObservation = 0;
    auditorOutstandingIssues?.outstandingIssuesObservation?.forEach((item) => {
      totalObservation += Number(item.total);
    });

    const totalIAR = auditorOutstandingIssues?.outstandingIssuesIar?.length;

    const totalAuditTimeTable =
      auditorOutstandingIssues?.outstandingIssuesTimeTable?.length;

    const totalROF =
      auditorOutstandingIssues?.outstandingIssuesFindingForm?.length;

    return [
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of open non-conformity (last 30 days)'
          ],
        ),
        number: convertNumberInt(totalNonConformity || 0),
        modalType: ModalTabType.NON_CONFORMITY,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of open observations (last 30 days)'
          ],
        ),
        number: convertNumberInt(totalObservation),
        modalType: ModalTabType.OBSERVATIONS,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection time tables not closed out'
          ],
        ),
        number: convertNumberInt(totalAuditTimeTable),
        modalType: ModalTabType.NUMBER_AUDIT_TIME_TABLE,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of report of findings not closed out'
          ],
        ),
        number: convertNumberInt(totalROF),
        modalType: ModalTabType.NUMBER_REPORT_OF_FINDING,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection reports not closed out'
          ],
        ),
        number: convertNumberInt(totalIAR),
        modalType: ModalTabType.NUMBER_INTERNAL_AUDIT_REPORT,
      },
    ];
  }, [
    auditorOutstandingIssues?.outstandingIssuesFindingForm?.length,
    auditorOutstandingIssues?.outstandingIssuesIar?.length,
    auditorOutstandingIssues?.outstandingIssuesNonConformity,
    auditorOutstandingIssues?.outstandingIssuesObservation,
    auditorOutstandingIssues?.outstandingIssuesTimeTable?.length,
    dynamicLabels,
  ]);

  const handleGetDataModalDetail = useCallback(
    (modalType: string, id: string, data: DataDetailModal) => {
      switch (modalType) {
        case ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL: {
          dispatch(
            getAuditorUpcomingPlanByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }
        case ModalTabType.UPCOMING_REPORTS_VESSEL: {
          dispatch(
            getAuditorUpcomingIARByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }

        case ModalTabType.NON_CONFORMITY: {
          dispatch(
            getAuditorOpenNonConformityByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }
        case ModalTabType.OBSERVATIONS: {
          dispatch(
            getAuditorOpenFindingObservationByVesselActions.request({
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
      auditorTrendIssues?.numberOpenFindingsEachTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.total,
      })),
    );

    const numberAuditTimetableNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      auditorTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.attNotClosedOut,
      })),
    );

    const numberROFNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      auditorTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
        timeRange: formatMoment(
          moment(new Date(item?.timeRange)),
          timeTrendOfOutstanding,
        ),
        value: item.rffNotClosedOut,
      })),
    );

    const numberIARNotCloseoutTimeRange = fillTrendData(
      getFillArr,
      auditorTrendIssues?.numberIssueNotCloseoutTimeRange?.map((item) => ({
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
    auditorTrendIssues,
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
          detailDataIssue?.numberOpenFindingsEachTimeRange?.map(
            (item) => Number(Number(item.value)?.toFixed(2)) || 0,
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
            (item) => Number(Number(item.value)?.toFixed(2)) || 0,
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
          detailDataIssue?.numberROFNotCloseoutTimeRange?.map(
            (item) => Number(Number(item.value)?.toFixed(2)) || 0,
          ) || [],
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection audit reports not closed out'
          ],
        ),
        data:
          detailDataIssue?.numberIARNotCloseoutTimeRange?.map(
            (item) => Number(Number(item.value)?.toFixed(2)) || 0,
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

  const renderFirstContent = () => (
    <>
      <Row gutter={[0, 10]}>
        <Col span={8} className={cx(styles.pr10)}>
          <BlockImage
            color="#0842FF"
            bgImageColor="#E6ECFF"
            image={<img src={images.icons.icWorkBlue} alt="img" />}
            title={totalPlanAudit}
            display={DisplayBlock.HORIZON}
            content={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                'Total number of planned inspection'
              ],
            )}
          />
        </Col>
        <Col span={8} className={cx(styles.pr10)}>
          <BlockImage
            color="#964FFF"
            bgImageColor="#ECE5FB"
            display={DisplayBlock.HORIZON}
            image={<img src={images.icons.icNotepad} alt="img" />}
            title={totalInprogress}
            content={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['In-progress plan'],
            )}
          />
        </Col>
        <Col span={8}>
          <BlockImage
            color="#0091E2"
            display={DisplayBlock.HORIZON}
            bgImageColor="#DDECF8"
            image={<img src={images.icons.icSelectMultiple} alt="img" />}
            title={totalComplete}
            content={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                'Completed plan (last 30 days)'
              ],
            )}
          />
        </Col>
        <Col span={8} className={cx(styles.pr10)}>
          <BlockImageSelect
            color="#1ED39D"
            bgImageColor="#E6FFF0"
            image={<img src={images.icons.icCheckGreen} alt="img" />}
            title={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                'Inspection checklist status'
              ],
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
        </Col>
        <Col span={8} className={cx(styles.pr10)}>
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
        </Col>
        <Col span={8}>
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
        </Col>
      </Row>
    </>
  );

  useEffect(() => {
    dispatch(
      getAuditorOutstandingIssuesActions.request({
        entityType: finalEntityTypeMemo,
      }),
    );

    getPlanningNeedReviewActionsApi({
      pageSize: -1,
      entityType: finalEntityTypeMemo,
    }).then((value) => {
      const listPlanning = value?.data?.data.map((item) => ({
        refId: item.refId,
        id: item.id,
        sno: item.auditNo,
        vesselName: item?.vessel?.name,
        auditCompanyName: item?.auditCompany?.name,
        leadAuditor: item.leadAuditor?.username,
        actualFromDate: new Date(item.plannedFromDate),
        actualToDate: new Date(item.plannedToDate),
      }));

      setConvertDataPlanning(listPlanning);
    });

    getAuditTimeTableNotCloseOutActionsApi({
      pageSize: -1,
      entityType: finalEntityTypeMemo,
    }).then((value) => {
      const listAuditTimeCloseOut = value?.data.data.map((item) => ({
        refId: item.refNo,
        sno: item.sNo,
        id: item.id,
        vesselName: item?.vessel?.name,
        auditCompanyName: item?.planningRequest?.auditCompany?.name,
        auditRefId: item.planningRequest.refId || undefined,
        actualFromDate: new Date(item.actualFrom),
        planningRequestId: item?.planningRequest?.id || undefined,
      }));
      setConvertDataAuditTimeNotCloseOut(listAuditTimeCloseOut);
    });

    getTotalDashboardActionsApi({
      entityType: finalEntityTypeMemo,
    }).then((value) => {
      const totalDashboard = value.data;
      setTotalPlanAudit(totalDashboard.totalPlan);
      setTotalInprogress(totalDashboard.totalInProgressPlan);
      setTotalComplete(totalDashboard.totalCompletedPlan);
    });

    getUpcomingActionsApi({
      entityType: finalEntityTypeMemo,
    }).then((value) => {
      const upComingResponse = value.data;

      setUpCommingIars(upComingResponse.upcomingIAR);
      setUpCommingPlans(upComingResponse.upcomingPlan);
    });
  }, [dispatch, globalFilter?.entity, finalEntityTypeMemo]);

  const renderOverview = () => (
    <Row className={cx(styles.mt10)}>
      <Col span={16} className={cx(styles.pr10)}>
        <div className="h-100">
          <ListOverview
            data={openTaskDashboard}
            entityType={finalEntityTypeMemo}
            title={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Rejected/ Reassigned'],
            )}
            dynamicLabels={dynamicLabels}
          />
        </div>
      </Col>
      <Col span={8} className="d-flex justify-content-between flex-column">
        <Col flex={1}>
          <BlockImageViewMore
            bgImage={
              <div className={cx('pt-2')}>
                <img
                  src={images.chart.chartBlue}
                  className={cx(styles.imgChart)}
                  alt="img"
                />
              </div>
            }
            position={Position.LEFT}
            title={upCommingPlans.reduce(
              (sum, item, index) => sum + Number(item.upComingPr),
              0,
            )}
            color="#0842FF"
            onViewMore={() => {
              setModal(ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL);
            }}
            className={cx(styles.blockNumber)}
            dynamicLabels={dynamicLabels}
            content={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                'Number of upcoming audit plan'
              ],
            )}
          />
        </Col>
        <Col flex={1}>
          <BlockImageViewMore
            bgImage={
              <div className={cx('pt-2')}>
                <img
                  src={images.chart.chartViolet}
                  className={cx(styles.imgChart)}
                  alt="img"
                />
              </div>
            }
            position={Position.RIGHT}
            title={upCommingIars.reduce(
              (sum, item, index) => sum + Number(item.upComingIAR),
              0,
            )}
            color="#964FFF"
            onViewMore={() => {
              setModal(ModalTabType.UPCOMING_REPORTS_VESSEL);
            }}
            className={cx(styles.mt10, styles.blockNumber)}
            dynamicLabels={dynamicLabels}
            content={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of upcoming reports'],
            )}
          />
        </Col>
      </Col>
    </Row>
  );

  const choseWith = (modal) => {
    switch (modal) {
      case ModalTabType.AUDIT_TIME_TABLE_NOT_CLOSE_OUT:
      case ModalTabType.NUMBER_AUDIT_TIME_TABLE:
      case ModalTabType.NUMBER_REPORT_OF_FINDING:
      case ModalTabType.NUMBER_INTERNAL_AUDIT_REPORT:
      case ModalTabType.AUDIT_PLAN_NEED_REVIEW:
        return 1400;
      default:
        return 970;
    }
  };

  const getSubTitleModalDouble = useCallback(
    (modal: string) => {
      const totalPlan =
        upCommingPlans.reduce(
          (sum, item) => sum + Number(item.upComingPr),
          0,
        ) || 0;
      const totalUpcomingReports = upCommingIars?.reduce(
        (a, b) => a + Number(b.upComingIAR),
        0,
      );
      switch (modal) {
        case ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL:
          return `${renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Number of upcoming audit plans'
            ],
          )}: ${convertNumberInt(totalPlan) || 0}`;
        case ModalTabType.UPCOMING_REPORTS_VESSEL:
          return `${renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of upcoming reports'],
          )}: ${totalUpcomingReports || 0}`;
        default:
          return '';
      }
    },
    [dynamicLabels, upCommingIars, upCommingPlans],
  );

  const renderModalTable = useCallback(() => {
    let title = '';
    let columns = [];
    let data = [];
    let newData = [];
    let dataOriginal = [];
    let moduleTemplate = '';
    let fileName = '';
    let aggridId = '';
    let hasVesselName = false;
    const sortName = sort?.split(':')[0] || '';
    const sortType = sort?.split(':')[1] || '';
    const isSortFieldNumber = ['upComingPr', 'total', 'upComingIAR'].includes(
      sortName,
    );
    const isSortFieldDate = ['plannedFromDate'].includes(sortName);

    if (modal === ModalTabType.HIDDEN) {
      return null;
    }
    switch (modal) {
      case ModalTabType.AUDIT_TIME_TABLE_NOT_CLOSE_OUT:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Inspection time table not close out'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnInspectionTimeTableNotClosedOutSection',
          isMultiColumnFilter,
          t,
        });
        fileName = MODULE_TEMPLATE.inspectionPlansNeedReviewingModal;
        moduleTemplate = MODULE_TEMPLATE.inspectionPlansNeedReviewingModal;
        data = convertDataAuditTimeNotCloseOut?.map((each) => ({
          ...each,
          actualFromDate: formatDateTime(each?.actualFromDate),
        }));
        dataOriginal =
          convertDataAuditTimeNotCloseOut?.map((each) => ({
            ...each,
            actualFromDate: formatDateTime(each?.actualFromDate),
          })) || [];

        break;
      case ModalTabType.AUDIT_PLAN_NEED_REVIEW:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Inspection plans need reviewing'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnInspectionPlansNeedReviewing',
          isMultiColumnFilter,
          t,
        });
        data = convertDataPlanning?.map((each) => ({
          ...each,
          actualFromDate: formatDateTime(each?.actualFromDate),
          actualToDate: formatDateTime(each?.actualToDate),
        }));
        fileName = MODULE_TEMPLATE.inspectionPlansNeedReviewingModal;
        moduleTemplate = MODULE_TEMPLATE.inspectionPlansNeedReviewingModal;
        dataOriginal =
          convertDataPlanning?.map((each) => ({
            ...each,
            actualFromDate: formatDateTime(each?.actualFromDate),
            actualToDate: formatDateTime(each?.actualToDate),
          })) || [];
        break;
      case ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            `Upcoming audit plans${isDetailModal ? ' details' : ''}`
          ],
        );
        newData =
          upCommingPlans?.map((item) => ({
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
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            })
          : columnsDefinition({
              colType: 'columnUpcomingAuditPlanVessel',
              isMultiColumnFilter,
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            });
        data = isDetailModal ? [...dataUpcomingPlanByVesselList] : newData;
        dataOriginal = isDetailModal
          ? [...dataUpcomingPlanByVesselList]
          : newData || [];
        hasVesselName = true;
        break;
      case ModalTabType.UPCOMING_REPORTS_VESSEL:
        newData =
          upCommingIars?.map((item) => ({
            ...item,
            action: (
              <div className="d-flex align-items-center">
                {renderButtonView(false, () =>
                  handleGetDataModalDetail(modal, item?.vesselId, {
                    vesselCode: item?.vesselCode,
                    vesselName: item?.vesselName,
                    labelTotal: renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                        'Total upcoming reports'
                      ],
                    ),
                    auditCompanyName: item?.auditCompanyName || '',
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
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            })
          : columnsDefinition({
              colType: 'columnUpcomingReportVessel',
              isMultiColumnFilter,
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            });
        data = isDetailModal ? [...dataUpcomingIARByVesselList] : newData;
        dataOriginal = isDetailModal
          ? [...dataUpcomingIARByVesselList]
          : newData || [];
        hasVesselName = true;
        break;
      case ModalTabType.NON_CONFORMITY:
        newData =
          auditorOutstandingIssues?.outstandingIssuesNonConformity?.map(
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
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            })
          : columnsDefinition({
              colType: 'columnNonConformity',
              isMultiColumnFilter,
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            });
        data = isDetailModal
          ? [...dataOpenNonConformityByVesselList]
          : [...newData];
        dataOriginal = isDetailModal
          ? [...dataOpenNonConformityByVesselList]
          : newData || [];
        fileName = MODULE_TEMPLATE.openNonConformityAuditor;
        aggridId = 'ag-grid-table-1';
        moduleTemplate = MODULE_TEMPLATE.openNonConformityAuditor;
        hasVesselName = true;
        break;
      case ModalTabType.OBSERVATIONS:
        newData =
          auditorOutstandingIssues?.outstandingIssuesObservation?.map(
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
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            })
          : columnsDefinition({
              colType: 'columnObservations',
              isMultiColumnFilter,
              t,
              handleGetDataModalDetail,
              modalTabType: Features.AUDIT_INSPECTION,
            });
        data = isDetailModal
          ? [...dataOpenFindingObservationByVesselList]
          : [...newData];
        dataOriginal = isDetailModal
          ? [...dataOpenFindingObservationByVesselList]
          : newData || [];
        fileName = MODULE_TEMPLATE.openObservationsAuditor;
        aggridId = 'ag-grid-table-2';
        moduleTemplate = MODULE_TEMPLATE.openObservationsAuditor;
        hasVesselName = true;
        break;
      case ModalTabType.NUMBER_AUDIT_TIME_TABLE:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Inspection time tables not closed out'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnAuditTimeTable',
          isMultiColumnFilter,
          t,
          handleGetDataModalDetail,
          modalTabType: Features.AUDIT_INSPECTION,
        });
        data = auditorOutstandingIssues?.outstandingIssuesTimeTable?.map(
          (item: OutstandingIssuesTimeTable) => ({
            ...item,
            plannedFromDate: formatDateTime(item?.plannedFromDate),
          }),
        );
        fileName = MODULE_TEMPLATE.inspectionTimeTablesNotClosedOutAuditor;
        aggridId = 'ag-grid-table-3';
        moduleTemplate =
          MODULE_TEMPLATE.inspectionTimeTablesNotClosedOutAuditor;
        dataOriginal =
          auditorOutstandingIssues?.outstandingIssuesTimeTable?.map(
            (item: OutstandingIssuesTimeTable) => ({
              ...item,
              plannedFromDate: formatDateTime(item?.plannedFromDate),
            }),
          ) || [];
        break;
      case ModalTabType.NUMBER_REPORT_OF_FINDING:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Report of findings not closed out'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnReportOfFinding',
          isMultiColumnFilter,
          t,
          handleGetDataModalDetail,
          modalTabType: Features.AUDIT_INSPECTION,
        });
        fileName = MODULE_TEMPLATE.reportOfFindingsNotClosedOutAuditor;
        aggridId = 'ag-grid-table-4';
        moduleTemplate = MODULE_TEMPLATE.reportOfFindingsNotClosedOutAuditor;
        data = auditorOutstandingIssues?.outstandingIssuesFindingForm?.map(
          (item: OutstandingFindingIssues) => ({
            ...item,
            auditRefID: item?.['auditRef.ID'],
            plannedFromDate: formatDateTime(item?.plannedFromDate),
          }),
        );
        dataOriginal =
          auditorOutstandingIssues?.outstandingIssuesFindingForm?.map(
            (item: OutstandingFindingIssues) => ({
              ...item,
              auditRefID: item?.['auditRef.ID'],
              plannedFromDate: formatDateTime(item?.plannedFromDate),
            }),
          ) || [];
        break;
      case ModalTabType.NUMBER_INTERNAL_AUDIT_REPORT:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
            'Inspection reports not closed out'
          ],
        );
        columns = columnsDefinition({
          colType: 'columnInternalAuditReport',
          isMultiColumnFilter,
          t,
          handleGetDataModalDetail,
          modalTabType: Features.AUDIT_INSPECTION,
        });
        data = auditorOutstandingIssues?.outstandingIssuesIar?.map((item) => ({
          ...item,
          auditRefID: item?.['auditRef.ID'],
          planningID: item?.auditRefId || '',
          status: reFormatStatus(item?.status),
        }));
        fileName = MODULE_TEMPLATE.inspectionReportsNotClosedOutAuditor;
        aggridId = 'ag-grid-table-5';
        moduleTemplate = MODULE_TEMPLATE.inspectionReportsNotClosedOutAuditor;
        dataOriginal =
          auditorOutstandingIssues?.outstandingIssuesIar?.map((item) => ({
            ...item,
            auditRefID: item?.['auditRef.ID'],
            planningID: item?.auditRefId || '',
            status: reFormatStatus(item?.status),
          })) || [];
        hasVesselName = true;
        break;
      default:
        break;
    }

    // short on data, when not short get dataOriginal
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
      data = [...dataOriginal];
    }
    const isModalDouble = [
      ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL,
      ModalTabType.UPCOMING_REPORTS_VESSEL,
      ModalTabType.NON_CONFORMITY,
      ModalTabType.OBSERVATIONS,
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
            setModal(ModalTabType.HIDDEN);
          }}
          dataDetailModal={dataDetailModal}
          columns={columns}
          handleBack={() => setIsDetailModal(false)}
          isDetail={isDetailModal}
          subTitle={getSubTitleModalDouble(modal)}
          modalType={ModalType.LARGE}
          hasVesselName={hasVesselName}
          handleClick={(data) => {
            if (!isDetailModal) {
              switch (modal) {
                case ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL: {
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
                          'Total upcoming audit plans'
                        ],
                      ),
                    },
                  );
                  break;
                }
                case ModalTabType.UPCOMING_REPORTS_VESSEL: {
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
                case ModalTabType.NON_CONFORMITY: {
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
                case ModalTabType.OBSERVATIONS: {
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
                case ModalTabType.UPCOMING_AUDIT_PLAN_VESSEL: {
                  openNewPage(
                    AppRouteConst.getPlanningAndRequestById(data?.planId),
                  );
                  break;
                }
                case ModalTabType.UPCOMING_REPORTS_VESSEL:
                case ModalTabType.NON_CONFORMITY:
                case ModalTabType.OBSERVATIONS: {
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
          w={choseWith(modal)}
          title={title}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          aggridId={aggridId}
          moduleTemplate={moduleTemplate}
          fileName={fileName}
        />
      );
    }
    return (
      <ModalTableAGGrid
        isOpen
        dataSource={[...data]}
        toggle={() => {
          setSort('');
          setModal(ModalTabType.HIDDEN);
        }}
        columns={columns}
        sort={sort}
        onSort={(value: string) => {
          setSort(value);
        }}
        scroll={
          ModalTabType.AUDIT_TIME_TABLE_NOT_CLOSE_OUT
            ? { x: 'max-content', y: 360 }
            : null
        }
        handleClick={(data) => {
          switch (modal) {
            case ModalTabType.NUMBER_INTERNAL_AUDIT_REPORT:
              return openNewPage(
                AppRouteConst.getInternalAuditReportById(data?.vesselId),
              );
            case ModalTabType.AUDIT_TIME_TABLE_NOT_CLOSE_OUT:
              openNewPage(AppRouteConst.getAuditTimeTableById(data?.id));
              break;
            case ModalTabType.AUDIT_PLAN_NEED_REVIEW:
              openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id));
              break;
            default:
              break;
          }
          return null;
        }}
        title={title}
        w={choseWith(modal)}
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
    dynamicLabels,
    isMultiColumnFilter,
    t,
    convertDataAuditTimeNotCloseOut,
    convertDataPlanning,
    isDetailModal,
    upCommingPlans,
    handleGetDataModalDetail,
    dataUpcomingPlanByVesselList,
    upCommingIars,
    dataUpcomingIARByVesselList,
    auditorOutstandingIssues?.outstandingIssuesNonConformity,
    auditorOutstandingIssues?.outstandingIssuesObservation,
    auditorOutstandingIssues?.outstandingIssuesTimeTable,
    auditorOutstandingIssues?.outstandingIssuesFindingForm,
    auditorOutstandingIssues?.outstandingIssuesIar,
    dataOpenNonConformityByVesselList,
    dataOpenFindingObservationByVesselList,
    dataDetailModal,
    getSubTitleModalDouble,
  ]);

  const renderAuditTimeNotCloseout = useCallback(
    () => (
      <div className={cx(styles.wrapperOverviewStatistic, styles.pt10)}>
        <p className={styles.titleBox}>
          {renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Inspection time tables not closed out'
            ],
          )}
        </p>
        <TableAntd
          columns={columnAuditTimeTableNotClosedOut}
          dataSource={convertDataAuditTimeNotCloseOut?.slice(0, 3)}
          handleClick={(data) => {
            openNewPage(AppRouteConst.getAuditTimeTableById(data?.id));
          }}
          isViewMore={convertDataAuditTimeNotCloseOut?.length > 3}
          onViewMore={() => {
            setModal(ModalTabType.AUDIT_TIME_TABLE_NOT_CLOSE_OUT);
          }}
        />
      </div>
    ),

    [convertDataAuditTimeNotCloseOut, dynamicLabels],
  );

  const renderAuditPlanNeedReviewing = useCallback(
    () => (
      <div className={cx(styles.wrapperOverviewStatistic, 'styles.pt10')}>
        <p className={styles.titleBox}>
          {renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
              'Inspection plans need reviewing'
            ],
          )}
        </p>
        <TableAntd
          columns={columnAuditPlansNeedReviewing}
          dataSource={convertDataPlanning?.slice(0, 3)}
          handleClick={(data) => {
            openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id));
          }}
          isViewMore={convertDataPlanning?.length > 3}
          onViewMore={() => {
            setModal(ModalTabType.AUDIT_PLAN_NEED_REVIEW);
          }}
        />
      </div>
    ),
    [convertDataPlanning, dynamicLabels],
  );

  const renderTrendOutstanding = useCallback(
    () => (
      <Row>
        <Col span={16} className={cx(styles.pt10, styles.pr10)}>
          <div className={cx(styles.TOAAndIA)}>
            <TrendOfTimeFilter
              title={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_DASHBOARD_DYNAMIC_FIELDS[
                  'Trends of outstanding issues'
                ],
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
        </Col>
        <Col span={8} className={cx(styles.issueWrapper, styles.mt10)}>
          <div className={styles.title}>
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Outstanding issue'],
            )}
          </div>
          {outstandingIssue?.map((item) => (
            <Row className={styles.wrapper} key={item?.modalType}>
              <Col span={16} className={cx(styles.label)}>
                {item.name}
              </Col>
              <Col span={8}>
                <div className={cx(styles.number)}>{item.number}</div>
                {Number(item?.number) > 0 && (
                  <div
                    className={cx(styles.viewMore)}
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
        </Col>
      </Row>
    ),
    [
      timeTrendOfOutstanding,
      dataChartAxis,
      dataChartTrendIssues,
      dynamicLabels,
      outstandingIssue,
    ],
  );

  const renderCarCapNeedReviewing = useMemo(
    () => (
      <div className={styles.pt10}>
        <CarCapNeedReviewing />
      </div>
    ),
    [],
  );

  const renderTrendsOfOutStandingCarCap = useMemo(
    () => (
      <Row>
        <Col span={16} className={cx(styles.pt10, styles.pr10)}>
          <TrendOfOutstandingCarCapIssue
            dashboard={DashBoard.AUDITOR}
            timeTrendOfOutstandingCarCap={timeTrendOfOutstandingCarCap}
            setTimeTrendOfOutstandingCarCap={setTimeTrendOfOutstandingCarCap}
            entity={globalFilter?.entity}
            dynamicLabels={dynamicLabels}
          />
        </Col>
        <Col span={8} className={styles.mt10}>
          <OutstandingCarCapIssue
            dashboard={DashBoard.AUDITOR}
            entity={globalFilter?.entity}
          />
        </Col>
      </Row>
    ),
    [timeTrendOfOutstandingCarCap, globalFilter?.entity, dynamicLabels],
  );

  return (
    <div className={styles.dashboard}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.INSPECTION_DASHBOARD}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionDashboard,
        )}
      />
      <HeaderFilter
        onChangeFilter={setGlobalFilter}
        className={styles.customSelect}
        filter={globalFilter}
        dynamicLabels={dynamicLabels}
      />
      <div className={styles.container}>
        {renderFirstContent()}
        {renderOverview()}
        <CalendarTimeTableProvider>
          <UpcomingInspectionPlans dynamicLabels={dynamicLabels} />
        </CalendarTimeTableProvider>
        {renderAuditPlanNeedReviewing()}
        {renderAuditTimeNotCloseout()}
        {renderTrendOutstanding()}
        {renderCarCapNeedReviewing}
        {renderTrendsOfOutStandingCarCap}
        {renderModalTable()}
      </div>
    </div>
  );
};

export default DashBoardAuditorsContainer;
