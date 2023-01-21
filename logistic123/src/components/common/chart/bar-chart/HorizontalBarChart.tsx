import cx from 'classnames';
import { FC, useMemo } from 'react';
import images from 'assets/images/images';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { financial } from 'helpers/utils.helper';
import styles from './horizontal-bar-chart.module.scss';

interface ChartInfo {
  name: string;
  color?: string;
  value: number | string;
}

interface Props {
  className?: string;
  data: ChartInfo[];
}

export const HorizontalBarChart: FC<Props> = ({ className, data }) => {
  const maxNumber = useMemo(() => {
    let max = Number(data?.[0]?.value) || 0;
    data?.forEach((item) => {
      if (max < Number(item.value)) max = Number(item.value);
    });
    return max;
  }, [data]);

  const formatToPercent = (value) =>
    Number(financial((Number(value) / maxNumber) * 100));

  return (
    <div className={cx(styles.container, className)}>
      {data?.length && maxNumber ? (
        <>
          {data?.map((item) => (
            <Row
              key={item.name}
              className={cx('d-flex align-items-center', styles.wrapper)}
            >
              <Col span={8}>
                <span className={cx(styles.name)}>{item.name}</span>
              </Col>
              <Col span={16}>
                <div
                  className={styles.content}
                  style={{
                    backgroundColor: item.color,
                    width: Number(item.value)
                      ? `${formatToPercent(item.value)}%`
                      : 'fit-content',
                  }}
                >
                  {item.value}
                </div>
              </Col>
            </Row>
          ))}
        </>
      ) : (
        <div className="d-flex align-items-center justify-content-center">
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
