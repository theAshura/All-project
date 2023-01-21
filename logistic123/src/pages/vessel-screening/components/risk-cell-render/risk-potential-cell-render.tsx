import { ICellRendererParams } from 'ag-grid-community';
import { RISK_LEVEL } from 'pages/vessel-screening/utils/constant';
import cx from 'classnames';
import styles from './risk-cell-render.module.scss';

const RiskPotentialCellRender = ({ value }: ICellRendererParams) => (
  <div className="w-100 d-flex justify-content-between align-items-center">
    {RISK_LEVEL[value] ? (
      <span
        className={cx(styles.labelRisk, {
          [styles.negligible]: value === RISK_LEVEL.NEGLIGIBLE,
          [styles.low]: value === RISK_LEVEL.LOW,
          [styles.medium]: value === RISK_LEVEL.MEDIUM,
          [styles.high]: value === RISK_LEVEL.HIGH,
        })}
      >
        {RISK_LEVEL[value]}
      </span>
    ) : (
      <span />
    )}
  </div>
);

export default RiskPotentialCellRender;
