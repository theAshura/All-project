import cx from 'classnames';
import { FC, useMemo } from 'react';
import { financial } from 'helpers/utils.helper';
import { Doughnut } from 'react-chartjs-2';
import NoDataImg from 'components/common/no-data/NoData';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Progress from 'antd/lib/progress';
import styles from './doughnut-chart.module.scss';

interface ChartInfo {
  name: string;
  color?: string;
  value: number | string;
}

interface Props {
  title?: string;
  className?: string;
  styleChartInfo?: string;
  data: ChartInfo[];
  noDataClassName?: string;
  doughNutClassName?: string;
}

const colorChart = ['#964FFF', '#0842FF', '#0091E2', '#31CDDB', '#ACB7C9'];

export const DoughnutChart: FC<Props> = ({
  className,
  data,
  styleChartInfo,
  title,
  noDataClassName,
  doughNutClassName,
}) => {
  const totalNumber = useMemo(() => {
    let total = 0;
    data?.forEach((item) => {
      total += Number(item.value);
    });
    return total;
  }, [data]);
  const dataChart = useMemo(() => {
    const newData =
      data?.sort((a, b) => Number(b.value) - Number(a.value)) || [];
    let newDataChart: ChartInfo[] = [];
    const lengthData = newData.length || 0;
    let otherValue = 0;

    if (lengthData > 5) {
      for (let i = 0; i < 4; i += 1) {
        newDataChart.push(newData[i]);
      }
      for (let i = 4; i < lengthData; i += 1) {
        otherValue += Number(newData[i].value);
      }
      newDataChart.push({
        name: 'Other',
        color: colorChart[4],
        value: otherValue,
      });
    } else {
      newDataChart = [...newData];
    }
    return newDataChart.map((item, index) => ({
      ...item,
      color: colorChart[index],
    }));
  }, [data]);

  const dataChartConvert = useMemo(() => {
    const colorArr = dataChart.map((item) => item.color);
    const valueArr = dataChart.map((item) => item.value);
    const nameArr = dataChart.map((item) => item.name);

    return {
      labels: nameArr,
      datasets: [
        {
          data: valueArr,
          backgroundColor: colorArr,
          borderColor: data?.map(() => '#fff'),
          borderWidth: data?.length > 1 ? 2 : 0,
        },
      ],
    };
  }, [data, dataChart]);

  const formatToNumber = (item: ChartInfo) =>
    Number(financial((Number(item.value) / totalNumber) * 100));

  return (
    <div className={cx(styles.block, styles.blockDoughnut, className)}>
      <Row>
        <Col span={10}>
          <div className={cx(styles.chartDoughnut, doughNutClassName)}>
            <Doughnut
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
              }}
              data={dataChartConvert}
            />
            <div className={cx(styles.totalNumber)}>
              {dataChart.length > 0 && totalNumber}
            </div>
          </div>
        </Col>
        {dataChart?.length ? (
          <Col span={14} className={cx(styles.chartInfo, styleChartInfo)}>
            {dataChart?.map((item) => (
              <div key={item.name}>
                <Row>
                  <Col
                    span={16}
                    className={cx(styles.content, styles.pointerWrapper)}
                  >
                    <div
                      className={styles.pointer}
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </Col>
                  <Col span={8} className={cx(styles.percent)}>
                    {item.value}
                    <span>{`(${formatToNumber(item)}%)`}</span>
                  </Col>
                </Row>
                <Progress
                  percent={formatToNumber(item)}
                  strokeColor={item.color}
                  trailColor="#E8E8EA"
                  showInfo={false}
                />
              </div>
            ))}
          </Col>
        ) : (
          <NoDataImg className={noDataClassName} />
        )}
      </Row>
    </div>
  );
};
