import { FC, ReactElement } from 'react';
import Button, { ButtonType } from 'components/ui/button/Button';
import styles from './trend-of-time.module.scss';

export enum TrendOfTime {
  W = 'W',
  M = 'M',
  M3 = 'M3',
  Y = 'Y',
}

interface Props {
  title: string | ReactElement;
  dateSelected?: TrendOfTime;
  onChangeFilter?: (date: TrendOfTime) => void;
}

const TrendOfTimeFilter: FC<Props> = ({
  dateSelected,
  title,
  onChangeFilter,
}) => (
  <div className={styles.wrap}>
    <strong className={styles.title}>{title}</strong>
    <div className={styles.wrapBtns}>
      <Button
        className={styles.btnChart}
        buttonType={
          dateSelected === TrendOfTime.W
            ? ButtonType.BlueChart
            : ButtonType.CancelOutline
        }
        onClick={() => onChangeFilter(TrendOfTime.W)}
      >
        1W
      </Button>
      <Button
        className={styles.btnChart}
        buttonType={
          dateSelected === TrendOfTime.M
            ? ButtonType.BlueChart
            : ButtonType.CancelOutline
        }
        onClick={() => onChangeFilter(TrendOfTime.M)}
      >
        1M
      </Button>
      <Button
        className={styles.btnChart}
        buttonType={
          dateSelected === TrendOfTime.M3
            ? ButtonType.BlueChart
            : ButtonType.CancelOutline
        }
        onClick={() => onChangeFilter(TrendOfTime.M3)}
      >
        3M
      </Button>
      <Button
        className={styles.btnChart}
        buttonType={
          dateSelected === TrendOfTime.Y
            ? ButtonType.BlueChart
            : ButtonType.CancelOutline
        }
        onClick={() => onChangeFilter(TrendOfTime.Y)}
      >
        1Y
      </Button>
    </div>
  </div>
);

export default TrendOfTimeFilter;
