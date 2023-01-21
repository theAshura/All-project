import cx from 'classnames';
import { FC, useMemo } from 'react';
import { financial } from 'helpers/utils.helper';
import { Doughnut } from 'react-chartjs-2';
import images from 'assets/images/images';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Progress from 'antd/lib/progress';
import styles from './doughnut-chart.module.scss';

export interface ChartInfoType {
  name: string;
  color?: string;
  value: number | string;
}

interface Props {
  title?: string;
  isHorizon?: boolean;
  className?: string;
  styleChartInfo?: string;
  data: ChartInfoType[];
  isChartCenter?: boolean;
  styleChartDoughnut?: string;
  hasValue?: boolean;
  hasProgress?: boolean;
  width?: number;
  height?: number | string;
  legendTop?: number;
  doughNutClassName?: string;
  alignItemBetween?: boolean;
  marginOnChart?: boolean;
}

export const DoughnutChartNoSort: FC<Props> = ({
  className,
  data,
  styleChartInfo,
  title,
  isHorizon,
  styleChartDoughnut,
  isChartCenter,
  hasValue = true,
  hasProgress = true,
  width,
  height,
  legendTop,
  doughNutClassName,
  alignItemBetween = false,
  marginOnChart = true,
}) => {
  const totalNumber = useMemo(() => {
    let total = 0;
    data?.forEach((item) => {
      total += Number(item.value);
    });
    return total;
  }, [data]);

  const dataChartConvert = useMemo(() => {
    const colorArr = data?.map((item) => item.color);
    const valueArr = data?.map((item) => item.value);
    const nameArr = data?.map((item) => item.name);
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
      options: {
        tooltips: {
          enabled: false,
        },
      },
    };
  }, [data]);

  const formatToNumber = (item: ChartInfoType) => {
    if (item?.value) {
      return Number(financial((Number(item.value) / totalNumber) * 100));
    }
    return 0;
  };

  return (
    <div className={cx(styles.block, styles.blockDoughnut, className)}>
      {totalNumber > 0 ? (
        <Row style={{ height: alignItemBetween ? '100%' : 'auto' }}>
          <Col span={!isHorizon ? 24 : 14} className={marginOnChart && 'my-5'}>
            <div
              className={cx(styles.chartDoughnut, styleChartDoughnut, {
                'mx-auto': !isHorizon || isChartCenter,
              })}
              style={{ width, height }}
            >
              <div className={alignItemBetween && styles.translateCanvas}>
                <Doughnut
                  className={cx(styles.donut, doughNutClassName)}
                  data={dataChartConvert}
                  options={{ plugins: { legend: { display: false } } }}
                />
                <div className={cx(styles.totalNumber)}>{totalNumber}</div>
              </div>
            </div>
          </Col>
          {data?.length ? (
            <Col
              span={!isHorizon ? 24 : 10}
              className={cx(styles.chartInfo, styleChartInfo, {
                [styles.marginTopAuto]: alignItemBetween,
              })}
            >
              {data?.map((item) => (
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
                    {hasValue && (
                      <Col span={8} className={cx(styles.percent)}>
                        {item.value}
                        <span>{`(${formatToNumber(item)}%)`}</span>
                      </Col>
                    )}
                  </Row>
                  {hasProgress && (
                    <Progress
                      percent={formatToNumber(item)}
                      strokeColor={item.color}
                      trailColor="#E8E8EA"
                      showInfo={false}
                    />
                  )}
                </div>
              ))}
            </Col>
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
        </Row>
      ) : (
        <div
          className={cx(
            'd-flex justify-content-center align-items-center',
            styles.noDataContainer,
          )}
        >
          <img
            src={images.icons.icNoData}
            className={styles.noData}
            alt="no data"
          />
        </div>
      )}
    </div>
  );
};
