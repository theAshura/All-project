import cx from 'classnames';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import {
  OutstandingCarCapIssueModalType,
  DashBoard,
} from 'constants/widget.const';
import { CAR_STATUS } from 'constants/car.const';
import Button, { ButtonType } from 'components/ui/button/Button';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from 'hoc/useEffectOnce';
import moment from 'moment';
import {
  getOutStandingCarCapIssueActions,
  getTrendOfOutstandingCarCapDetailActions,
} from 'store/dashboard/dashboard.action';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { dateStringComparator } from 'helpers/utils.helper';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import styles from './style/out-standing-car-cap-issue.module.scss';

interface OutstandingCarCapIssueProps {
  dashboard: DashBoard;
  entity?: string;
}

const OutstandingCarCapIssue: FC<OutstandingCarCapIssueProps> = ({
  entity,
  dashboard,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(OutstandingCarCapIssueModalType.NULL);
  const [filterOn, setFilterOn] = useState('');
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { trendOfOutstandingCarCapDetail, outStandingCarCapIssue, loading } =
    useSelector((state) => state.dashboard);
  const [timeTrendOfOutstandingCarCap, setTimeTrendOfOutstandingCarCap] =
    useState(TrendOfTime.M);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionDashboard,
    modulePage: ModulePage.List,
  });

  const mappedValue = useMemo(() => {
    const requiredData = [
      {
        modalType: OutstandingCarCapIssueModalType.OPEN_CAR,
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of open CAR'],
        ),
        number: outStandingCarCapIssue?.totalNumberOfOpenCar || 0,
      },
      {
        modalType: OutstandingCarCapIssueModalType.HOLD_CAR,
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of hold CAP'],
        ),
        number: outStandingCarCapIssue?.totalNumberOfHoldCar || 0,
      },
      {
        modalType: OutstandingCarCapIssueModalType.PENDING_CAR,
        name: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of pending CAP'],
        ),
        number: outStandingCarCapIssue?.totalNumberOfPendingCar || 0,
      },
    ];

    return dashboard === DashBoard.COMPANY
      ? [
          ...requiredData,
          {
            modalType: OutstandingCarCapIssueModalType.DENIED_CAR,
            name: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of denied CAP'],
            ),
            number: outStandingCarCapIssue?.totalNumberOfDeniedCar || 0,
          },
        ]
      : requiredData;
  }, [
    dashboard,
    dynamicLabels,
    outStandingCarCapIssue?.totalNumberOfDeniedCar,
    outStandingCarCapIssue?.totalNumberOfHoldCar,
    outStandingCarCapIssue?.totalNumberOfOpenCar,
    outStandingCarCapIssue?.totalNumberOfPendingCar,
  ]);

  const modifyDateObject = useCallback(
    (status: string) => {
      let subtractDate = 0;
      switch (timeTrendOfOutstandingCarCap) {
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
        createdAtFrom: priorDate.toISOString(),
        createdAtTo: moment().toISOString(),
        entityType: entity !== 'All' ? entity : undefined,
        statusFilter: status,
      };
    },
    [timeTrendOfOutstandingCarCap, entity],
  );

  const renderBtnFilterModal = useMemo(
    () => (
      <div className={styles.marginLeftAuto}>
        <Button
          className={styles.btnChartCarCap}
          buttonType={
            timeTrendOfOutstandingCarCap === TrendOfTime.W
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setTimeTrendOfOutstandingCarCap(TrendOfTime.W)}
        >
          1W
        </Button>
        <Button
          className={styles.btnChartCarCap}
          buttonType={
            timeTrendOfOutstandingCarCap === TrendOfTime.M
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setTimeTrendOfOutstandingCarCap(TrendOfTime.M)}
        >
          1M
        </Button>
        <Button
          className={styles.btnChartCarCap}
          buttonType={
            timeTrendOfOutstandingCarCap === TrendOfTime.M3
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setTimeTrendOfOutstandingCarCap(TrendOfTime.M3)}
        >
          3M
        </Button>
        <Button
          className={styles.btnChartCarCap}
          buttonType={
            timeTrendOfOutstandingCarCap === TrendOfTime.Y
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setTimeTrendOfOutstandingCarCap(TrendOfTime.Y)}
        >
          1Y
        </Button>
      </div>
    ),
    [setTimeTrendOfOutstandingCarCap, timeTrendOfOutstandingCarCap],
  );

  const mappedModalValue = useMemo(
    () =>
      trendOfOutstandingCarCapDetail?.map((each) => ({
        ...each,
        entity: each?.entity || '',
      })) || [],
    [trendOfOutstandingCarCapDetail],
  );

  const ColumnDefs = useMemo(
    () => [
      {
        field: 'refId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => (
          <div
            className="cell-high-light"
            onClick={() => {
              if (data?.id) {
                history.push(AppRouteConst.getInspectionFollowUpById(data.id));
              }
            }}
          >
            {data.refId}
          </div>
        ),
      },
      {
        field: 'car',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.CAR,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'cap',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.CAP,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'numberOfFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of findings'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'actualClosureDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Actual closure date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'pic',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.PIC,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter],
  );

  const handleGetListModal = useCallback(() => {
    dispatch(
      getTrendOfOutstandingCarCapDetailActions.request(
        modifyDateObject(filterOn),
      ),
    );
  }, [dispatch, filterOn, modifyDateObject]);

  const renderDetailModal = useMemo(() => {
    if (modal === OutstandingCarCapIssueModalType.NULL) {
      return null;
    }
    let title = '';
    let moduleTemplate = '';

    switch (modal) {
      case OutstandingCarCapIssueModalType.OPEN_CAR:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of open CAR'],
        );
        moduleTemplate = MODULE_TEMPLATE.modalOpenCar;
        setFilterOn(CAR_STATUS.Open);
        break;
      case OutstandingCarCapIssueModalType.PENDING_CAR:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of pending CAP'],
        );
        moduleTemplate = MODULE_TEMPLATE.modalPendingCap;
        setFilterOn('Pending');
        break;
      case OutstandingCarCapIssueModalType.HOLD_CAR:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of hold CAP'],
        );
        moduleTemplate = MODULE_TEMPLATE.modalHoldCap;
        setFilterOn('Holding');
        break;
      case OutstandingCarCapIssueModalType.DENIED_CAR:
        title = renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of denied CAP'],
        );
        moduleTemplate = MODULE_TEMPLATE.modalDeniedCap;
        setFilterOn(CAR_STATUS.Denied);
        break;
      default:
        break;
    }

    return (
      <Modal
        isOpen
        content={
          <>
            <div className={cx(styles.flexBetween, 'mb-3')}>
              {renderBtnFilterModal}
            </div>
            <AGGridModule
              loading={loading}
              params={null}
              setIsMultiColumnFilter={setIsMultiColumnFilter}
              hasRangePicker={false}
              columnDefs={ColumnDefs}
              dataFilter={null}
              moduleTemplate={moduleTemplate}
              fileName={title}
              dataTable={mappedModalValue}
              height="400px"
              getList={handleGetListModal}
              pageSizeDefault={10}
            />
          </>
        }
        toggle={() => {
          setModal(OutstandingCarCapIssueModalType.NULL);
          setTimeTrendOfOutstandingCarCap(TrendOfTime.M);
          setFilterOn('');
        }}
        title={<span className={styles.fontWeight600}>{title}</span>}
        modalType={ModalType.LARGE}
        contentClassName={styles.height550}
      />
    );
  }, [
    ColumnDefs,
    dynamicLabels,
    handleGetListModal,
    loading,
    mappedModalValue,
    modal,
    renderBtnFilterModal,
  ]);

  useEffect(() => {
    if (filterOn) {
      handleGetListModal();
    }
  }, [filterOn, handleGetListModal]);

  useEffectOnce(() => {
    dispatch(
      getOutStandingCarCapIssueActions.request({
        entityType: entity !== 'All' ? entity : undefined,
      }),
    );

    return () => {
      getOutStandingCarCapIssueActions.success(undefined);
    };
  });

  return (
    <>
      <div className={cx(styles.issueWrapper)}>
        <div className={cx(styles.title, 'mt-2')}>
          {renderDynamicLabel(
            dynamicLabels,
            INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Outstanding CAR/CAP issue'],
          )}
        </div>
        <div className="mt-2">
          {mappedValue?.map((item) => (
            <Row className={cx(styles.wrapper)} key={item.modalType}>
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
      </div>
      {renderDetailModal}
    </>
  );
};

export default memo(OutstandingCarCapIssue);
