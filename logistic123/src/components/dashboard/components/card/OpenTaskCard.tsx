import images from 'assets/images/images';
import { FC, useMemo } from 'react';
import cx from 'classnames';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './open-task-card.module.scss';

export interface OpenTaskCardBodyData {
  status: string;
  value: number;
}

interface OpenTaskCardProps {
  title: string;
  canViewMore?: boolean;
  colorTextBody: string;
  bodyData: OpenTaskCardBodyData[];
  handleViewMore?: () => void;
  containerClassName?: string;
  dynamicLabels: IDynamicLabel;
}

const OpenTaskCard: FC<OpenTaskCardProps> = ({
  title,
  canViewMore = true,
  colorTextBody,
  bodyData,
  handleViewMore,
  containerClassName,
  dynamicLabels,
}) => {
  const renderGraffiti = useMemo(() => {
    let bgColor = '';
    let icon = '';

    switch (title) {
      case renderDynamicLabel(
        dynamicLabels,
        INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Planning,
      ):
        bgColor = '#EBFFE6';
        icon = images.icons.menu.icScrollGreen;
        break;
      case renderDynamicLabel(
        dynamicLabels,
        INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection checklist templates'],
      ):
        bgColor = '#E6F0FF';
        icon = images.icons.menu.icStackBlue;
        break;
      case renderDynamicLabel(
        dynamicLabels,
        INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Report of findings'],
      ):
        bgColor = '#E6FFFF';
        icon = images.icons.menu.icChatBubbleBlue;
        break;
      case renderDynamicLabel(
        dynamicLabels,
        INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Inspection reports'],
      ):
        bgColor = '#F3E6FF';
        icon = images.icons.menu.icWarnPurple;
        break;

      default:
        break;
    }

    return (
      <div className={styles.centerFlex}>
        <div
          className={styles.logoWrapper}
          style={{ backgroundColor: bgColor }}
        >
          <img src={icon} alt={icon} />
        </div>
      </div>
    );
  }, [dynamicLabels, title]);

  return (
    <div className={cx(styles.container, containerClassName)}>
      <div className={styles.titleContainer}>
        <span className={styles.content}>{title}</span>
        {canViewMore && (
          <span
            className={styles.viewMoreText}
            onClick={() => handleViewMore()}
          >
            {renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['View more'],
            )}
          </span>
        )}
      </div>
      <div className={styles.bodyContainer}>
        {renderGraffiti}
        <div className={styles.staticValueWrapper}>
          {bodyData.map((each) => (
            <div className={styles.contentContainer} key={each.status}>
              <p style={{ color: colorTextBody }}>
                {each.value < 10 ? `0${each.value.toString()}` : each.value}
              </p>
              <span>{each.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenTaskCard;
