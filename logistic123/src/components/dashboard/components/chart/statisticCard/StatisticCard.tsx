import { ReactNode, FC } from 'react';
import cx from 'classnames';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from './statistic-card.module.scss';

interface StatisticCardProps {
  text: string;
  textValueColor: string;
  iconSrc: string;
  backgroundIconColor: string;
  body?: string | ReactNode;
  handleViewMore?: () => void;
  minHeight?: number | string;
  name?: string;
  marginBottom?: boolean;
  hiddenViewMore?: boolean;
  subTitle?: string;
}
const StatisticCard: FC<StatisticCardProps> = ({
  textValueColor,
  iconSrc,
  body,
  handleViewMore,
  backgroundIconColor,
  text,
  minHeight,
  marginBottom,
  hiddenViewMore,
  subTitle,
}) => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });
  return (
    <div
      className={
        marginBottom
          ? styles.statisticContainerBottom
          : styles.statisticContainer
      }
      style={
        minHeight && {
          height: minHeight,
        }
      }
    >
      <div className={styles.statisticIconContainer}>
        <div
          className={styles.iconBubble}
          style={{ backgroundColor: backgroundIconColor }}
        >
          <img src={iconSrc} alt="icon" />
        </div>
      </div>
      <div className={styles.statisticContentContainer}>
        <p className={styles.title} style={{ color: textValueColor }}>
          {parseInt(text, 10) < 10 ? `0${text.toString()}` : text}
        </p>
        {body && (
          <p className={cx(styles.body, { [styles.titleBody]: subTitle })}>
            {body}
          </p>
        )}
        {text !== '0' && !hiddenViewMore && (
          <div onClick={() => handleViewMore()}>
            <p className={styles.viewMore}>
              {renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['View more'],
              )}
            </p>
          </div>
        )}
        {subTitle && <p className={styles.subTitle}>{subTitle}</p>}
      </div>
    </div>
  );
};

export default StatisticCard;
