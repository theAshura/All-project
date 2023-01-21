import { FC, useMemo } from 'react';
import cx from 'classnames';
import { getRisk } from 'pages/vessel-screening/utils/functions';
import { RISK_LEVEL } from 'pages/vessel-screening/utils/constant';
import styles from './risk-badge.module.scss';

interface Props {
  range?: number | string;
  largestNumber?: number;
}

const BadgeRisk: FC<Props> = ({ range, largestNumber }) => {
  const minWidth = largestNumber ? String(largestNumber || 0)?.length * 12 : 0;

  const riskName = useMemo(() => {
    if (range === '-') {
      return range;
    }
    return getRisk(Number(range));
  }, [range]);

  if (range === '-') {
    return <div className={styles.textContent}>-</div>;
  }

  return (
    <div
      className={cx('d-flex align-items-center', styles.wrapBadge, {
        [styles.negligible]: riskName === RISK_LEVEL.NEGLIGIBLE,
        [styles.low]: riskName === RISK_LEVEL.LOW,
        [styles.medium]: riskName === RISK_LEVEL.MEDIUM,
        [styles.high]: riskName === RISK_LEVEL.HIGH,
      })}
    >
      <span className={styles.rangeNumber} style={minWidth ? { minWidth } : {}}>
        {range}{' '}
      </span>
      <span>-</span>
      <div className={styles.badge}>{riskName}</div>
    </div>
  );
};
export default BadgeRisk;
