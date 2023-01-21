import { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Col, Row } from 'antd/lib/grid';
import images from 'assets/images/images';
import { v4 } from 'uuid';

import styles from './chart-widget.module.scss';
import ChartWidget from './ChartWidget';

highcharts3d(Highcharts);

const TYPE_CHART = {
  WORK_TIME_SUMMARY: 'Work Time Summary',
  WORK_TIME_ANALYSIS: 'Work Time Analysis',
};

const chartOptions = {
  chart: {
    renderTo: 'container',
    type: 'column',
    options3d: {
      enabled: true,
      alpha: 15,
      beta: 15,
      depth: 50,
      viewDistance: 25,
    },
  },
  title: {
    text: '',
  },

  plotOptions: {
    column: {
      depth: 25,
    },
  },
  series: [
    {
      data: [
        29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
        95.6, 54.4,
      ],
    },
  ],
};

const chartBaseLine = {
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
      pointStart: 2010,
    },
  },

  series: [
    {
      name: 'Installation',
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
    },
    {
      name: 'Manufacturing',
      data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
    },
    {
      name: 'Sales & Distribution',
      data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
    },
    {
      name: 'Project Development',
      data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
    },
    {
      name: 'Other',
      data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
    },
  ],
};

const listChartOptions = [
  {
    type: TYPE_CHART.WORK_TIME_SUMMARY,
    value: chartOptions,
  },
  {
    type: TYPE_CHART.WORK_TIME_ANALYSIS,
    value: chartBaseLine,
  },
];

const DashboardWidget = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [listChart, setListChart] = useState<{ id: string; key: string }[]>([]);

  const onAddWidget = (key: string) => {
    setListChart([{ id: v4(), key }, ...listChart]);
    setDropdownOpen(false);
  };

  const onRemoveWidget = (index: number) => {
    const listChartFilter = listChart.filter((i, _index) => _index !== index);
    setListChart(listChartFilter);
  };

  const renderListChart = useMemo(() => {
    if (listChart?.length) {
      return listChart.map((item, index) => {
        const chartOptions = listChartOptions.find(
          (chartOption) => chartOption.type === item.key,
        );

        if (chartOptions) {
          return (
            <Col span={12} key={item.id}>
              <div className={styles.chartWidgetItem}>
                <button onClick={() => onRemoveWidget(index)}>
                  <img src={images.icons.icBlueClose} alt="" />
                </button>
                <ChartWidget
                  options={chartOptions.value}
                  highcharts={Highcharts}
                />
              </div>
            </Col>
          );
        }
        return null;
      });
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listChart, chartOptions]);

  return (
    <div className={styles.chartWidget}>
      <h2>Widget Demo</h2>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        className={styles.dropdown}
        size="lg"
      >
        <DropdownToggle>
          <div>Add New Widget</div>
        </DropdownToggle>
        <DropdownMenu left className={styles.dropdownMenu}>
          <ul>
            <li>
              <button onClick={() => onAddWidget(TYPE_CHART.WORK_TIME_SUMMARY)}>
                <img
                  src="https://portal2.prohance.io:80/prohance/icons/TopCategory.png"
                  alt=""
                />
                <span>Work Time Summary</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onAddWidget(TYPE_CHART.WORK_TIME_ANALYSIS)}
              >
                <img
                  className={styles.analysis}
                  src="https://portal2.prohance.io:80/prohance/icons/EfficiencySummary.png"
                  alt=""
                />
                <span>Work Time Analysis</span>
              </button>
            </li>
          </ul>
        </DropdownMenu>
      </Dropdown>
      <div className={styles.chartWidgetContainer}>
        <Row gutter={[20, 20]}>{renderListChart}</Row>
      </div>
    </div>
  );
};

export default DashboardWidget;
