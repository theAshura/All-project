import images from 'assets/images/images';
import cx from 'classnames';
import { RISK_LEVEL } from 'pages/vessel-screening/utils/constant';
import { getRisk } from 'pages/vessel-screening/utils/functions';
import { FC, ReactNode, useMemo } from 'react';
import styles from './risk-rating.module.scss';

interface Props {
  title: string | ReactNode;
  className?: string;
  hasBorder?: boolean;
  riskNumber?: number;
}

export const RiskRating: FC<Props> = ({ title, className, riskNumber }) => {
  const riskLevel = useMemo(() => {
    if (riskNumber === null) {
      return null;
    }
    return getRisk(riskNumber);
  }, [riskNumber]);
  const isWarning = useMemo(() => {
    if (riskNumber > 5 && riskNumber <= 10) {
      return true;
    }
    return false;
  }, [riskNumber]);
  return (
    <div
      className={cx(styles.container, styles.wrapRisk, {
        [styles.negligible]: riskLevel === RISK_LEVEL.NEGLIGIBLE,
        [styles.lowColor]: riskLevel === RISK_LEVEL.LOW,
        [styles.mediumColor]: riskLevel === RISK_LEVEL.MEDIUM,
        [styles.highColor]: riskLevel === RISK_LEVEL.HIGH,
      })}
    >
      <div
        className={cx(
          styles.title,
          'd-flex align-items-center justify-content-center',
        )}
      >
        <span>{title}:</span>
        {isWarning && <img src={images.icons.icWarning} alt="warning" />}
      </div>
      <div className={cx(styles.riskNumber)}>
        {riskNumber === 0 ? riskNumber : riskNumber || '-'}
      </div>
      <div className={styles.content}>{riskLevel || ''}</div>
    </div>
  );
};
