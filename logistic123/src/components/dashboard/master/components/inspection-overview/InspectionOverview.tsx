import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import cx from 'classnames';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import TrendOfTimeFilter, {
  TrendOfTime,
} from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import ReviewStatus from 'pages/incidents/summary/review-status';
import { ChartDataType } from 'pages/incidents/summary/number-incidents';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { ListProgressSortType } from 'components/dashboard/components/list-progress/ListProgress';
import { useDispatch, useSelector } from 'react-redux';
import DashBoardMasterCard from 'components/dashboard/components/chart/dashboardCard/DashBoardMasterCard';
import {
  getInspectionPerPortPerStatusActions,
  getInspectionPerStatusActions,
} from 'store/dashboard/dashboard.action';
import NoDataImg from 'components/common/no-data/NoData';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from './style/inspectionOverview.module.scss';
import {
  inspectionCasesPerPortStatus,
  InspectionPerPortPerStatusLabel,
} from './InspectionOverview.constant';
import InspectionTypePerMonth from './components/InspectionTypePerMonth';
import InspectionPortPerMonth from './components/InspectionPortPerMonth';

const InspectionOverview: FC = () => {
  const uniqueID = useMemo(() => v4(), []);
  const dispatch = useDispatch();
  const { inspectionPerStatus, inspectionPerPortPerStatus } = useSelector(
    (globalState) => globalState.dashboard,
  );
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });
  const [inspectionCasePerStatusDate, setInspectionCasePerStatusDate] =
    useState(TrendOfTime.M);
  const [
    inspectionCasePerPortPerStatusDate,
    setInspectionCasePerPortPerStatusDate,
  ] = useState(TrendOfTime.M);

  const InspectionCasesPerStatus = useMemo(
    () =>
      inspectionPerStatus
        ? [
            {
              color: '#AE59C6',
              title: InspectionPerPortPerStatusLabel.numOpeningSchedule,
              value:
                Number(
                  Number(inspectionPerStatus?.numOpeningSchedule)?.toFixed(2),
                ) || 0,
              index: 0,
            },
            {
              color: '#1E62DC',
              title: InspectionPerPortPerStatusLabel.numDisapprovedReport,
              value:
                Number(
                  Number(inspectionPerStatus?.numDisapprovedReport)?.toFixed(2),
                ) || 0,
              index: 1,
            },
            {
              color: '#3B9FF3',
              title: InspectionPerPortPerStatusLabel.numSubmittedReport,
              value:
                Number(
                  Number(inspectionPerStatus?.numSubmittedReport)?.toFixed(2),
                ) || 0,
              index: 2,
            },
            {
              color: '#1E62DC',
              title: InspectionPerPortPerStatusLabel.numUnder2Approval,
              value:
                Number(
                  Number(inspectionPerStatus?.numUnder2Approval)?.toFixed(2),
                ) || 0,
              index: 3,
            },
            {
              color: '#3B9FF3',
              title: InspectionPerPortPerStatusLabel.numUnder3Approval,
              value:
                Number(
                  Number(inspectionPerStatus?.numUnder3Approval)?.toFixed(2),
                ) || 0,
              index: 4,
            },
            {
              color: '#5ACFF9',
              title: InspectionPerPortPerStatusLabel.numUnder4Approval,
              value:
                Number(
                  Number(inspectionPerStatus?.numUnder4Approval)?.toFixed(2),
                ) || 0,
              index: 5,
            },
            {
              color: '#3BF3F3',
              title: InspectionPerPortPerStatusLabel.numUnder5Approval,
              value:
                Number(
                  Number(inspectionPerStatus?.numUnder5Approval)?.toFixed(2),
                ) || 0,
              index: 6,
            },
            {
              color: '#3BF3F3',
              title: InspectionPerPortPerStatusLabel.numUnder6Approval,
              value:
                Number(
                  Number(inspectionPerStatus?.numUnder6Approval)?.toFixed(2),
                ) || 0,
              index: 7,
            },
            {
              color: '#5ACFF9',
              title: InspectionPerPortPerStatusLabel.numApprovedReport,
              value:
                Number(
                  Number(inspectionPerStatus?.numApprovedReport)?.toFixed(2),
                ) || 0,
              index: 8,
            },
            {
              color: '#18BA92',
              title: InspectionPerPortPerStatusLabel.numSentCarUnderCap,
              value:
                Number(
                  Number(inspectionPerStatus?.numSentCarUnderCap)?.toFixed(2),
                ) || 0,
              index: 9,
            },
            {
              color: '#6EEA91',
              title: InspectionPerPortPerStatusLabel.numSubmitCap,
              value:
                Number(Number(inspectionPerStatus?.numSubmitCap)?.toFixed(2)) ||
                0,
              index: 10,
            },
            {
              color: '#FFDE54',
              title: InspectionPerPortPerStatusLabel.numDisapprovedCap,
              value:
                Number(
                  Number(inspectionPerStatus?.numDisapprovedCap)?.toFixed(2),
                ) || 0,
              index: 11,
            },
            {
              color: '#FF6E01',
              title:
                InspectionPerPortPerStatusLabel.numApprovedCapNoVerification,
              value:
                Number(
                  Number(
                    inspectionPerStatus?.numApprovedCapNoVerification,
                  )?.toFixed(2),
                ) || 0,
              index: 12,
            },
            {
              color: '#F42829',
              title: InspectionPerPortPerStatusLabel.numWaitingVerification,
              value:
                Number(
                  Number(inspectionPerStatus?.numWaitingVerification)?.toFixed(
                    2,
                  ),
                ) || 0,
              index: 13,
            },
            {
              color: '#FB1A8F',
              title: InspectionPerPortPerStatusLabel.numApprovedVerification,
              value:
                Number(
                  Number(inspectionPerStatus?.numApprovedVerification)?.toFixed(
                    2,
                  ),
                ) || 0,
              index: 14,
            },
          ]
        : [],
    [inspectionPerStatus],
  );

  const handleOnSortDatePerStatus = useCallback((value) => {
    setInspectionCasePerStatusDate(value);
  }, []);

  const handleOnclickChangeDateFilter = useCallback(
    (
      dateType: TrendOfTime,
      chart: 'port-per-status' | 'type-per-month' | 'port-per-month',
    ) => {
      switch (chart) {
        case 'port-per-status':
          setInspectionCasePerPortPerStatusDate(dateType);
          break;
        default:
          break;
      }
    },
    [],
  );

  const totalInspectionCasesPerStatus = useMemo(
    () =>
      InspectionCasesPerStatus?.reduce(
        (prevValue, currentValue) => prevValue + currentValue.value,
        0,
      ),
    [InspectionCasesPerStatus],
  );

  const convertTimeSelectToDateObj = useCallback((time: TrendOfTime) => {
    let subtractDate = 0;
    switch (time) {
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

    return {
      fromDate: priorDate.toISOString(),
      toDate: moment().toISOString(),
    };
  }, []);

  const casesPerPortStatusBarChartData = useMemo(
    () => ({
      labels:
        inspectionPerPortPerStatus?.map((inspection) => inspection.name) || [],
      datasets: [
        {
          backgroundColor: '#AE59C6',
          label: InspectionPerPortPerStatusLabel.numOpeningSchedule,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numOpeningSchedule || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#1E62DC',
          label: InspectionPerPortPerStatusLabel.numDisapprovedReport,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numDisapprovedReport || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#3B9FF3',
          label: InspectionPerPortPerStatusLabel.numSubmittedReport,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numSubmittedReport || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#1E62DC',
          label: InspectionPerPortPerStatusLabel.numUnder2Approval,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numUnder2Approval || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#3B9FF3',
          label: InspectionPerPortPerStatusLabel.numUnder3Approval,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numUnder3Approval || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#5ACFF9',
          label: InspectionPerPortPerStatusLabel.numUnder4Approval,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numUnder4Approval || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#3BF3F3',
          label: InspectionPerPortPerStatusLabel.numUnder5Approval,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numUnder5Approval || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#3BF3F3',
          label: InspectionPerPortPerStatusLabel.numUnder6Approval,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numUnder6Approval || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#5ACFF9',
          label: InspectionPerPortPerStatusLabel.numApprovedReport,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numApprovedReport || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#18BA92',
          label: InspectionPerPortPerStatusLabel.numSentCarUnderCap,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numSentCarUnderCap || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#6EEA91',
          label: InspectionPerPortPerStatusLabel.numSubmitCap,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numSubmitCap || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#FFDE54',
          label: InspectionPerPortPerStatusLabel.numDisapprovedCap,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numDisapprovedCap || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#FF6E01',
          label: InspectionPerPortPerStatusLabel.numApprovedCapNoVerification,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numApprovedCapNoVerification || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#F42829',
          label: InspectionPerPortPerStatusLabel.numWaitingVerification,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numWaitingVerification || 0,
            ) || [],
          barThickness: 60,
        },
        {
          backgroundColor: '#FB1A8F',
          label: InspectionPerPortPerStatusLabel.numApprovedVerification,
          data:
            inspectionPerPortPerStatus?.map(
              (inspection) => inspection.numApprovedVerification || 0,
            ) || [],
          barThickness: 60,
        },
      ],
    }),
    [inspectionPerPortPerStatus],
  );

  useEffect(() => {
    const rangeDateForCasePerStatus = convertTimeSelectToDateObj(
      inspectionCasePerStatusDate,
    );
    dispatch(getInspectionPerStatusActions.request(rangeDateForCasePerStatus));
  }, [inspectionCasePerStatusDate, convertTimeSelectToDateObj, dispatch]);

  useEffect(() => {
    const rangeInspectionCasePerPortPerStatus = convertTimeSelectToDateObj(
      inspectionCasePerPortPerStatusDate,
    );
    dispatch(
      getInspectionPerPortPerStatusActions.request(
        rangeInspectionCasePerPortPerStatus,
      ),
    );
  }, [
    inspectionCasePerPortPerStatusDate,
    convertTimeSelectToDateObj,
    dispatch,
  ]);

  return (
    <div className={styles.contentContainer} key={uniqueID}>
      <strong className={styles.title}>
        {renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection overview'],
        )}
      </strong>

      <Row gutter={[12, 0]}>
        <Col span={16} className="d-flex flex-column">
          <DashBoardMasterCard
            title={renderDynamicLabel(
              dynamicLabels,
              MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection cases per status'],
            )}
            totalValue={totalInspectionCasesPerStatus}
            data={InspectionCasesPerStatus}
            listProgressType={ListProgressSortType.INDEX_INCREASE}
            titleClassName={styles.paddingTop0}
            displayFooterStatistic={false}
            progressHeight="auto"
            sortable
            handleOnSort={handleOnSortDatePerStatus}
            filterValue={inspectionCasePerStatusDate}
            scrollAbleProgress
            eachProgressClassName={styles.height36px}
            containerClassName={styles.borderOnBottom}
          />
        </Col>
        <Col span={8} className="d-flex flex-column">
          <div
            className={cx(
              styles.contentContainer,
              styles.paddingNone,
              styles.inspectionCasesPerType,
            )}
          >
            <ReviewStatus
              dropdown
              isVertical
              fullHeight
              height="100%"
              title={renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS[
                  'Inspection cases per inspection type'
                ],
              )}
              containerClassName={styles.fullHeight}
              key="inspectionCasesPerInspectionType"
              type={ChartDataType.INSPECTION_CASES_PER_TYPE}
              alignItemBetween
              scrollableClass={styles.maxHeight210}
              customClassTitle={styles.customClassTitle}
              dynamicLabels={dynamicLabels}
            />
          </div>
        </Col>
      </Row>

      <Row className="mt-4" gutter={[12, 0]}>
        <Col span={8}>
          <div
            className={cx(
              styles.contentContainer,
              styles.paddingNone,
              styles.height578px,
            )}
          >
            <ReviewStatus
              dropdown
              isVertical
              fullHeight
              height="100%"
              title={renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection cases per port'],
              )}
              containerClassName={styles.fullHeight}
              key="INSPECTION_CASES_PER_PORT"
              type={ChartDataType.INSPECTION_CASES_PER_PORT}
              scrollableClass={styles.maxHeight170}
              customClassTitle={styles.customClassTitle}
              dynamicLabels={dynamicLabels}
            />
          </div>
        </Col>
        <Col span={16}>
          <div
            className={cx(styles.contentContainer, styles.barChartContainer)}
          >
            <TrendOfTimeFilter
              title={renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS[
                  'Inspection cases per port per status'
                ],
              )}
              dateSelected={inspectionCasePerPortPerStatusDate}
              onChangeFilter={(date) =>
                handleOnclickChangeDateFilter(date, 'port-per-status')
              }
            />

            <div className={styles.barChartWrapper}>
              {casesPerPortStatusBarChartData?.datasets?.every(
                (item) => !item.data.length,
              ) ? (
                <div className={styles.noDataBarChart}>
                  <NoDataImg />
                </div>
              ) : (
                <>
                  <div className={styles.labelSection}>
                    {inspectionCasesPerPortStatus.map((each) => (
                      <div className={styles.contentWrapper} key={each.title}>
                        <div
                          className={styles.colorBox}
                          style={{ backgroundColor: each.color }}
                        />
                        {each.title}
                      </div>
                    ))}
                  </div>
                  <Bar
                    data={casesPerPortStatusBarChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true,
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        // tooltip: {
                        //   intersect: false,
                        // },
                      },
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4" gutter={[12, 0]}>
        <Col xs={24} xxl={12} className="mb-2">
          <InspectionTypePerMonth />
        </Col>
        <Col xs={24} xxl={12} className="mb-2">
          <InspectionPortPerMonth />
        </Col>
      </Row>
    </div>
  );
};

export default memo(InspectionOverview);
