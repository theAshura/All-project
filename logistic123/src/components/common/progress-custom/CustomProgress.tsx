import styles from './custom-progress.module.scss';

interface CustomProgressProps {
  displayStatistic?: boolean;
  progressStatusColor: string;
  progressBackgroundColor?: string;
  percent: string;
  title?: string;
  value: number;
}

const CustomProgress = ({
  displayStatistic,
  progressStatusColor,
  progressBackgroundColor = '#e8e8ea',
  percent,
  title,
  value,
}: CustomProgressProps) => (
  <div>
    {displayStatistic && (
      <div className={styles.progressTitleContainer}>
        <div className={styles.progressTitleLeft}>
          <span
            className={styles.progressTitleDot}
            style={{ backgroundColor: progressStatusColor }}
          />
          <p>{title}</p>
        </div>
        <div className={styles.progressTitleRight}>
          <p>{value}</p>
          <span>{`(${percent}%)`}</span>
        </div>
      </div>
    )}
    <div
      className={styles.progressContainer}
      style={{ backgroundColor: progressBackgroundColor }}
    >
      <div
        className={styles.progressBar}
        style={{ width: `${percent}%`, backgroundColor: progressStatusColor }}
      />
    </div>
  </div>
);

export default CustomProgress;
