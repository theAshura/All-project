import { FC } from 'react';
import GaugeChart from 'react-gauge-chart';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import cx from 'classnames';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import styles from './potential-risk.module.scss';

interface Props {
  customWrapChart?: string;
  hideTitle?: boolean;
  hideBadges?: boolean;
  riskNumber?: number;
  hideRiskNumber?: boolean;
  percent?: number;
  isOffice?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const PotenitalRisk: FC<Props> = ({
  customWrapChart,
  hideTitle,
  hideBadges,
  hideRiskNumber,
  riskNumber,
  percent,
  isOffice,
  dynamicLabels,
}) => (
  <div className={styles.wrap}>
    {!hideTitle && (
      <div className={styles.title}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            `${!isOffice ? 'Vessel' : 'Office'} potential risk`
          ],
        )}
      </div>
    )}
    <div className={cx(styles.wrapGauge, customWrapChart)}>
      <GaugeChart
        id="gauge-chart5"
        nrOfLevels={10}
        arcsLength={[1, 1, 1, 1]}
        colors={['#52e93a', '#ffd80a', '#FF9F0A', '#E9453A']}
        percent={percent > 1 ? 1 : percent}
        arcPadding={0.0}
        arcWidth={0.15}
        needleColor="#3F3E40"
        needleBaseColor="#3F3E40"
        cornerRadius={0}
        hideText
      />
    </div>

    {!hideRiskNumber && (
      <div className={styles.riskNumber}>
        {Math.abs(riskNumber || 0) > 100 ? '>100' : Math.abs(riskNumber || 0)}
      </div>
    )}
    {!hideBadges && (
      <div className={styles.badges}>
        <div className={styles.badge}>
          <div className={styles.dotBlue} />
          <div className={styles.label}>Negligible</div>
        </div>
        <div className={styles.badge}>
          <div className={styles.dotGreen} />
          <div className={styles.label}>Low</div>
        </div>
        <div className={styles.badge}>
          <div className={styles.dotOrange} />
          <div className={styles.label}>Medium</div>
        </div>
        <div className={styles.badge}>
          <div className={styles.dotRed} />
          <div className={styles.label}>High</div>
        </div>
      </div>
    )}
  </div>
);
export default PotenitalRisk;
