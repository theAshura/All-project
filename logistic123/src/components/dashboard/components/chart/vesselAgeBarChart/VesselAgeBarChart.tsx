import { Bar } from 'react-chartjs-2';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import { getVesselGroupByAgeActions } from 'store/dashboard/dashboard.action';
import { useEffect, useState, useMemo, useCallback, memo, useRef } from 'react';
import NoDataImg from 'components/common/no-data/NoData';
import { openNewPage } from 'helpers/utils.helper';
import { AppRouteConst } from 'constants/route.const';
import { ModalType } from 'components/ui/modal/Modal';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from './VesselAgeBarChar.module.scss';
import { ColType } from './vesselBarAge.const';
import ModalTableAGGrid from '../../modal/ModalTableAGGrid';

const VesselAgeBarChart = () => {
  const dispatch = useDispatch();
  const { vesselGroupByAge } = useSelector((state) => state.dashboard);
  const [vesselAge, setVesselAge] = useState<any>([]);
  const [clickedCol, setClickedCol] = useState<ColType>(ColType.NULL);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const chartRef = useRef(null);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const handleClickViewMore = useCallback(
    (data) => {
      if (typeof data === 'string') {
        switch (data) {
          case renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['0-13 years old'],
          ):
            setClickedCol(ColType.BELOW_13);
            break;
          case renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['14-20 years old'],
          ):
            setClickedCol(ColType.BELOW_20);
            break;
          case renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['21-50 years old'],
          ):
            setClickedCol(ColType.BELOW_50);
            break;
          case renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['51-100 years old'],
          ):
            setClickedCol(ColType.BELOW_100);
            break;
          default:
            break;
        }
      }
    },
    [dynamicLabels],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'imo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS.IMO,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => (
          <div
            className="cell-high-light"
            onClick={() => openNewPage(AppRouteConst.getVesselById(data?.id))}
          >
            {data?.imo}
          </div>
        ),
      },

      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'businessDivision',
        headerName: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Business division'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter],
  );

  const renderModalTable = useMemo(() => {
    if (clickedCol === ColType.NULL) {
      return null;
    }

    const getTitle = (content: string): string =>
      `${renderDynamicLabel(
        dynamicLabels,
        MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel with age of'],
      )} ${content} ${renderDynamicLabel(
        dynamicLabels,
        MAIN_DASHBOARD_DYNAMIC_FIELDS['years old'],
      )}`;

    let title: string;
    let data;
    let total: number;
    let moduleTemplate: string;
    let fileName: string;

    switch (clickedCol) {
      case ColType.BELOW_13:
        title = getTitle('0-13');
        data = vesselGroupByAge?.vessel0To13Year?.data
          ?.sort(
            (currentVessel, nextVessel) =>
              currentVessel?.vesselAge - nextVessel?.vesselAge,
          )
          ?.map((vessel) => ({
            ...vessel,
            vesselAge: vessel?.vesselAge?.toFixed(2) as any,
          }));
        total = vesselGroupByAge?.vessel0To13Year?.count;
        moduleTemplate = MODULE_TEMPLATE.vesselAgeBelow14;
        fileName = MODULE_TEMPLATE.vesselAgeBelow14;
        break;
      case ColType.BELOW_20:
        title = getTitle('14-20');
        data = vesselGroupByAge?.vessel14To20Year?.data
          ?.sort(
            (currentVessel, nextVessel) =>
              currentVessel?.vesselAge - nextVessel?.vesselAge,
          )
          ?.map((vessel) => ({
            ...vessel,
            vesselAge: vessel?.vesselAge?.toFixed(2) as any,
          }));
        total = vesselGroupByAge?.vessel14To20Year?.count;
        moduleTemplate = MODULE_TEMPLATE.vesselAge15to29;
        fileName = MODULE_TEMPLATE.vesselAge15to29;
        break;
      case ColType.BELOW_50:
        title = getTitle('21-50');
        data = vesselGroupByAge?.vessel21To50Year?.data
          ?.sort(
            (currentVessel, nextVessel) =>
              currentVessel?.vesselAge - nextVessel?.vesselAge,
          )
          ?.map((vessel) => ({
            ...vessel,
            vesselAge: vessel?.vesselAge?.toFixed(2) as any,
          }));
        total = vesselGroupByAge?.vessel21To50Year?.count;
        moduleTemplate = MODULE_TEMPLATE.vesselAge30to44;
        fileName = MODULE_TEMPLATE.vesselAge30to44;
        break;
      case ColType.BELOW_100:
        title = getTitle('51-100');
        data = vesselGroupByAge?.vessel51To100Year?.data
          ?.sort(
            (currentVessel, nextVessel) =>
              currentVessel?.vesselAge - nextVessel?.vesselAge,
          )
          ?.map((vessel) => ({
            ...vessel,
            vesselAge: vessel?.vesselAge?.toFixed(2) as any,
          }));
        total = vesselGroupByAge?.vessel51To100Year?.count;
        moduleTemplate = MODULE_TEMPLATE.vesselAge45to99;
        fileName = MODULE_TEMPLATE.vesselAge45to99;
        break;
      default:
        break;
    }

    return (
      <ModalTableAGGrid
        scroll={{ x: 'max-content', y: 265 }}
        columns={columnDefs}
        // columns={VESSEL_BAR_AGE_COLUMNS}
        dataSource={data}
        isOpen
        title={title}
        total={total}
        toggle={() => setClickedCol(ColType.NULL)}
        titleClasseName={styles.customTableModalTitle}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        modalType={ModalType.LARGE}
        moduleTemplate={moduleTemplate}
        fileName={fileName}
      />
    );
  }, [
    clickedCol,
    columnDefs,
    dynamicLabels,
    vesselGroupByAge?.vessel0To13Year?.count,
    vesselGroupByAge?.vessel0To13Year?.data,
    vesselGroupByAge?.vessel14To20Year?.count,
    vesselGroupByAge?.vessel14To20Year?.data,
    vesselGroupByAge?.vessel21To50Year?.count,
    vesselGroupByAge?.vessel21To50Year?.data,
    vesselGroupByAge?.vessel51To100Year?.count,
    vesselGroupByAge?.vessel51To100Year?.data,
  ]);

  useEffectOnce(() => {
    dispatch(getVesselGroupByAgeActions.request());
  });

  useEffect(() => {
    if (vesselGroupByAge) {
      setVesselAge([
        {
          data: [
            vesselGroupByAge?.vessel0To13Year?.count || 0,
            vesselGroupByAge?.vessel14To20Year?.count || 0,
            vesselGroupByAge?.vessel21To50Year?.count || 0,
            vesselGroupByAge?.vessel51To100Year?.count || 0,
          ],
          backgroundColor: '#3B9FF3',
          barThickness: 20,
        },
      ]);
    }
  }, [vesselGroupByAge]);

  const yAxis = useMemo(
    () =>
      vesselAge?.length
        ? {
            min: 0,
            stackWeight: 1,
          }
        : {
            min: 0,
            max: 10,
            stackWeight: 1,
          },
    [vesselAge],
  );

  const handleMouseLeaveChart = useCallback(() => {
    if (chartRef.current) {
      const tooltipEl = chartRef.current.canvas.parentNode.querySelector('div');
      if (tooltipEl?.className) {
        tooltipEl.className = styles.displayNone;
      }
    }
  }, []);

  return (
    <>
      {renderModalTable}
      <div className={styles.contentContainer}>
        <strong className={styles.textTitle}>
          {renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel age'],
          )}
        </strong>
        <div className={styles.subTitle}>
          {renderDynamicLabel(
            dynamicLabels,
            MAIN_DASHBOARD_DYNAMIC_FIELDS['Number of vessels'],
          )}
        </div>
        <div
          className={styles.barChartContainer}
          onMouseLeave={handleMouseLeaveChart}
          key="Vessel Age Bar Chart"
        >
          {vesselAge?.every((i) => i === 0) ? (
            <NoDataImg className={styles.noData} />
          ) : (
            <Bar
              ref={chartRef}
              data={{
                labels: [
                  renderDynamicLabel(
                    dynamicLabels,
                    MAIN_DASHBOARD_DYNAMIC_FIELDS['0-13 years old'],
                  ),
                  renderDynamicLabel(
                    dynamicLabels,
                    MAIN_DASHBOARD_DYNAMIC_FIELDS['14-20 years old'],
                  ),
                  renderDynamicLabel(
                    dynamicLabels,
                    MAIN_DASHBOARD_DYNAMIC_FIELDS['21-50 years old'],
                  ),
                  renderDynamicLabel(
                    dynamicLabels,
                    MAIN_DASHBOARD_DYNAMIC_FIELDS['51-100 years old'],
                  ),
                ],
                datasets: vesselAge,
              }}
              options={{
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                    position: 'nearest',
                    external: ({ chart, tooltip }) => {
                      let tooltipEl =
                        chart.canvas.parentNode.querySelector('div');

                      if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        chart.canvas.parentNode.appendChild(tooltipEl);
                      }

                      tooltipEl.style.opacity = '0';
                      tooltipEl.innerHTML = '';
                      tooltipEl.className = styles.toolTipEl;

                      if (tooltip?.body[0]?.lines[0] !== '0') {
                        const { offsetLeft: positionX, offsetTop: positionY } =
                          chart.canvas;
                        // wrapper for tooltip
                        const tooltipWrapper = document.createElement('div');
                        tooltipWrapper.style.display = 'flex';
                        tooltipWrapper.style.flexDirection = 'column';

                        // title Node of tool tip
                        const titleNode = document.createElement('div');
                        titleNode.className = styles.titleNode;
                        titleNode.innerHTML = tooltip?.title[0] || '';

                        // Dot Node of Tooltip
                        const dotNode = document.createElement('div');
                        dotNode.className = styles.dotNode;

                        // content Node of Tooltip
                        const dataWrapperNode = document.createElement('div');
                        dataWrapperNode.className = styles.dataNode;

                        const dataSpanNode = document.createElement('span');
                        dataSpanNode.style.marginBottom = '0';
                        dataSpanNode.innerHTML =
                          tooltip?.body[0]?.lines[0] || '';

                        dataWrapperNode.appendChild(dotNode);
                        dataWrapperNode.appendChild(dataSpanNode);

                        // View More Node of Tooltip
                        const viewMoreNode = document.createElement('span');
                        viewMoreNode.className = styles.textViewMore;
                        viewMoreNode.innerHTML = renderDynamicLabel(
                          dynamicLabels,
                          MAIN_DASHBOARD_DYNAMIC_FIELDS['View more'],
                        );
                        viewMoreNode.addEventListener('click', () => {
                          handleClickViewMore(tooltip.title[0]);
                        });

                        tooltipWrapper.appendChild(titleNode);
                        tooltipWrapper.appendChild(dataWrapperNode);
                        tooltipWrapper.appendChild(viewMoreNode);

                        tooltipEl.appendChild(tooltipWrapper);

                        // Display, position for display tooltip
                        tooltipEl.style.opacity = '1';
                        tooltipEl.style.padding = '8px';
                        tooltipEl.style.left = `${
                          positionX + tooltip.caretX
                        }px`;
                        tooltipEl.style.top = `${
                          positionY + tooltip.caretY - 50
                        }px`;
                      }
                    },
                  },
                },
                scales: {
                  y: {
                    ...yAxis,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(VesselAgeBarChart);
