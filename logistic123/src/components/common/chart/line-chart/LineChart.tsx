import { Line } from 'react-chartjs-2';
import { ICTypeLineChart } from 'components/common/icon';
import { useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import { randomColor } from 'helpers/utils.helper';
import cx from 'classnames';

interface ChartInfo {
  label: string;
  data: number[];
  color?: string;
}

export interface LineChartProps {
  data: ChartInfo[];
  width?: number;
  height?: number | string;
  labels: string[];
  hiddenItem?: boolean;
  stepInteger?: boolean;
  scrollLabelEnable?: boolean;
}

const colorChart = [
  '#31CDDB',
  '#964FFF',
  '#0842FF',
  '#0091E2',
  '#00E2E2',
  '#CDDAEE',
  '#DDE4EB',
  '#FF6E01',
  '#F42829',
];

export function LineChart(props: LineChartProps) {
  const {
    data = [],
    width,
    height,
    labels,
    hiddenItem,
    stepInteger = false,
    scrollLabelEnable = false,
  } = props;
  const dataChart = useMemo(
    () =>
      data.map((item, index) => ({
        label: item.label,
        borderColor: item?.color || colorChart[index] || randomColor(),
        data: item.data,
      })) || [],
    [data],
  );

  const yScale = useMemo(() => {
    if (!dataChart || dataChart.length === 0) {
      return {};
    }

    let countTotalZeroValue = 0;

    dataChart.forEach((chart) => {
      const doesAllDataValueEqualZero = chart.data.every((el) => el === 0);
      if (doesAllDataValueEqualZero) {
        countTotalZeroValue += 1;
      }
    });

    if (countTotalZeroValue === dataChart.length) {
      return {
        max: 10,
      };
    }

    return {};
  }, [dataChart]);

  return (
    <div className="line-chart">
      {!hiddenItem && (
        <Row className={cx('pb-2', scrollLabelEnable ? 'scrollWidth' : '')}>
          {dataChart.map((item) => (
            <Col key={item.label} className="d-flex align-items-center py-1">
              <div>
                <ICTypeLineChart fill={item.borderColor} />
              </div>
              <div className="ps-2 label-badge">{item.label}</div>
            </Col>
          ))}
        </Row>
      )}
      <div
        style={{
          position: 'relative',
          width: width || '100%',
          height: height || '220px',
        }}
      >
        <Line
          options={{
            maintainAspectRatio: false,
            // responsive: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                ticks: {
                  callback(value, _index) {
                    return value < 1000
                      ? value
                      : `${Math.round(Number(value) / 1000)}k-  `;
                  },
                  stepSize: stepInteger ? 1 : undefined,
                },
                min: 0,
                stackWeight: 1,
                ...yScale,
              },
              xAxes: {
                ticks: {
                  font: {
                    size: 10,
                  },
                },
              },
            },
          }}
          data={{
            labels,
            datasets: dataChart,
          }}
        />
      </div>
    </div>
  );
}
