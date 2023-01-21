import cx from 'classnames';
import isNaN from 'lodash/isNaN';
import { FC, useMemo } from 'react';
import images from 'assets/images/images';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { VESSEL_ICONS } from 'constants/components/vessel.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import styles from './inspection-performance.module.scss';

const listShipeByType = [
  {
    name: VESSEL_ICONS[0]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.BoatIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[1]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.BulkerIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[2]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.ContainerShipIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[3]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.DingeyIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[4]?.path,
    width: 70,
    icon: (level?: string) => (
      <images.vesselType.DryCargoIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[5]?.path,
    width: 100,
    icon: (level?: string) => (
      <images.vesselType.FerryBoatIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[6]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.FerryBoatIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[7]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.KayakIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[8]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.MarineLinerIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[9]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.PowerBoatIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[10]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.RoroIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[11]?.path,
    width: 65,
    icon: (level?: string) => (
      <images.vesselType.SailBoatIc className={level && styles[level]} />
    ),
  },
  {
    name: VESSEL_ICONS[12]?.path,
    width: 80,
    icon: (level?: string) => (
      <images.vesselType.YachtIc className={level && styles[level]} />
    ),
  },
];

interface IOffice {
  className?: string;
  isFlex?: boolean;
  color?: string;
}

const Office = ({ className, color }: IOffice) => (
  <svg
    className={styles.office}
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.5234 43.6719H30.5703V52H27.5234V43.6719Z"
      fill={color || '#E2E0DF'}
    />
    <path
      d="M21.4297 43.6719H24.4766V52H21.4297V43.6719Z"
      fill={color || '#E2E0DF'}
    />
    <path
      d="M36.2578 0H15.7422C14.9008 0 14.2188 0.682094 14.2188 1.52344V52H18.3828V42.1484C18.3828 41.3071 19.0649 40.625 19.9062 40.625H26H32.0938C32.9351 40.625 33.6172 41.3071 33.6172 42.1484V52H37.7812V1.52344C37.7812 0.682094 37.0992 0 36.2578 0ZM21.4297 36.0547C21.4297 36.896 20.7476 37.5781 19.9062 37.5781C19.0649 37.5781 18.3828 36.896 18.3828 36.0547V33.0078C18.3828 32.1665 19.0649 31.4844 19.9062 31.4844C20.7476 31.4844 21.4297 32.1665 21.4297 33.0078V36.0547ZM21.4297 26.9141C21.4297 27.7554 20.7476 28.4375 19.9062 28.4375C19.0649 28.4375 18.3828 27.7554 18.3828 26.9141V23.8672C18.3828 23.0258 19.0649 22.3438 19.9062 22.3438C20.7476 22.3438 21.4297 23.0258 21.4297 23.8672V26.9141ZM27.5234 36.0547C27.5234 36.896 26.8413 37.5781 26 37.5781C25.1587 37.5781 24.4766 36.896 24.4766 36.0547V33.0078C24.4766 32.1665 25.1587 31.4844 26 31.4844C26.8413 31.4844 27.5234 32.1665 27.5234 33.0078V36.0547ZM27.5234 26.9141C27.5234 27.7554 26.8413 28.4375 26 28.4375C25.1587 28.4375 24.4766 27.7554 24.4766 26.9141V23.8672C24.4766 23.0258 25.1587 22.3438 26 22.3438C26.8413 22.3438 27.5234 23.0258 27.5234 23.8672V26.9141ZM33.6172 36.0547C33.6172 36.896 32.9351 37.5781 32.0938 37.5781C31.2524 37.5781 30.5703 36.896 30.5703 36.0547V33.0078C30.5703 32.1665 31.2524 31.4844 32.0938 31.4844C32.9351 31.4844 33.6172 32.1665 33.6172 33.0078V36.0547ZM33.6172 26.9141C33.6172 27.7554 32.9351 28.4375 32.0938 28.4375C31.2524 28.4375 30.5703 27.7554 30.5703 26.9141V23.8672C30.5703 23.0258 31.2524 22.3438 32.0938 22.3438C32.9351 22.3438 33.6172 23.0258 33.6172 23.8672V26.9141ZM21.4297 17.7734C21.4297 18.6148 20.7476 19.2969 19.9062 19.2969C19.0649 19.2969 18.3828 18.6148 18.3828 17.7734V14.7266C18.3828 13.8852 19.0649 13.2031 19.9062 13.2031C20.7476 13.2031 21.4297 13.8852 21.4297 14.7266V17.7734ZM27.5234 17.7734C27.5234 18.6148 26.8413 19.2969 26 19.2969C25.1587 19.2969 24.4766 18.6148 24.4766 17.7734V14.7266C24.4766 13.8852 25.1587 13.2031 26 13.2031C26.8413 13.2031 27.5234 13.8852 27.5234 14.7266V17.7734ZM33.6172 17.7734C33.6172 18.6148 32.9351 19.2969 32.0938 19.2969C31.2524 19.2969 30.5703 18.6148 30.5703 17.7734V14.7266C30.5703 13.8852 31.2524 13.2031 32.0938 13.2031C32.9351 13.2031 33.6172 13.8852 33.6172 14.7266V17.7734ZM21.4297 8.63281C21.4297 9.47416 20.7476 10.1562 19.9062 10.1562C19.0649 10.1562 18.3828 9.47416 18.3828 8.63281V5.58594C18.3828 4.74459 19.0649 4.0625 19.9062 4.0625C20.7476 4.0625 21.4297 4.74459 21.4297 5.58594V8.63281ZM27.5234 8.63281C27.5234 9.47416 26.8413 10.1562 26 10.1562C25.1587 10.1562 24.4766 9.47416 24.4766 8.63281V5.58594C24.4766 4.74459 25.1587 4.0625 26 4.0625C26.8413 4.0625 27.5234 4.74459 27.5234 5.58594V8.63281ZM33.6172 8.63281C33.6172 9.47416 32.9351 10.1562 32.0938 10.1562C31.2524 10.1562 30.5703 9.47416 30.5703 8.63281V5.58594C30.5703 4.74459 31.2524 4.0625 32.0938 4.0625C32.9351 4.0625 33.6172 4.74459 33.6172 5.58594V8.63281Z"
      fill={color || '#E2E0DF'}
    />
    <path
      d="M50.4766 20.3125H40.8281V52H50.4766C51.3179 52 52 51.3179 52 50.4766V21.8359C52 20.9946 51.3179 20.3125 50.4766 20.3125ZM47.9375 40.1172C47.9375 40.9585 47.2554 41.6406 46.4141 41.6406C45.5727 41.6406 44.8906 40.9585 44.8906 40.1172V37.0703C44.8906 36.229 45.5727 35.5469 46.4141 35.5469C47.2554 35.5469 47.9375 36.229 47.9375 37.0703V40.1172ZM47.9375 30.9766C47.9375 31.8179 47.2554 32.5 46.4141 32.5C45.5727 32.5 44.8906 31.8179 44.8906 30.9766V27.9297C44.8906 27.0883 45.5727 26.4062 46.4141 26.4062C47.2554 26.4062 47.9375 27.0883 47.9375 27.9297V30.9766Z"
      fill={color || '#E2E0DF'}
    />
    <path
      d="M1.52344 20.3125C0.682094 20.3125 0 20.9946 0 21.8359V50.4766C0 51.3179 0.682094 52 1.52344 52H11.1719V20.3125H1.52344ZM7.10938 40.1172C7.10938 40.9585 6.42728 41.6406 5.58594 41.6406C4.74459 41.6406 4.0625 40.9585 4.0625 40.1172V37.0703C4.0625 36.229 4.74459 35.5469 5.58594 35.5469C6.42728 35.5469 7.10938 36.229 7.10938 37.0703V40.1172ZM7.10938 30.9766C7.10938 31.8179 6.42728 32.5 5.58594 32.5C4.74459 32.5 4.0625 31.8179 4.0625 30.9766V27.9297C4.0625 27.0883 4.74459 26.4062 5.58594 26.4062C6.42728 26.4062 7.10938 27.0883 7.10938 27.9297V30.9766Z"
      fill={color || '#E2E0DF'}
    />
  </svg>
);

const ONE_HUNDRED = 100;
const SHIP_WIDTH = 226;
const OFFICE_WIDTH = 65;
const PROGRESS_COLOR_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 70,
  HIGH: 85,
};
interface Props {
  isFlex?: boolean;
  inspectionScore?: any;
  percentPerformance?: any;
  hideInspectionScore?: any;
  customContainer?: string;
  entity?: string;
  vesselType?: string;
  dynamicLabels?: IDynamicLabel;
}

const InspectionPerformance: FC<Props> = ({
  isFlex,
  inspectionScore,
  percentPerformance = 0,
  hideInspectionScore,
  customContainer,
  entity,
  vesselType,
  dynamicLabels,
}) => {
  const vesselTypeChecked = useMemo(
    () =>
      listShipeByType?.find((item) => item.name === vesselType) ||
      listShipeByType?.[0],
    [vesselType],
  );
  const shipWidth = useMemo(
    () => vesselTypeChecked?.width || SHIP_WIDTH,
    [vesselTypeChecked],
  );

  const imgWidth = useMemo(() => {
    if (entity === 'Office') {
      return OFFICE_WIDTH;
    }
    return shipWidth;
  }, [entity, shipWidth]);

  const performanceInfo = useMemo(() => {
    const p = Math.round(percentPerformance * ONE_HUNDRED);

    const info = {
      width: Math.round(percentPerformance * imgWidth),
      percent: p,
    };

    if (p <= PROGRESS_COLOR_THRESHOLDS.LOW) {
      return {
        ...info,
        level: 'progressLow',
      };
    }

    if (p <= PROGRESS_COLOR_THRESHOLDS.MEDIUM) {
      return {
        ...info,
        level: 'progressMedium',
      };
    }

    if (p <= PROGRESS_COLOR_THRESHOLDS.HIGH) {
      return {
        ...info,
        level: 'progressHigh',
      };
    }

    return {
      ...info,
      level: 'progressMax',
    };
  }, [imgWidth, percentPerformance]);

  const renderProgress = useMemo(() => {
    if (entity === 'Office') {
      return (
        <div className="d-flex justify-content-center">
          <div className={styles.wrapOffice}>
            <div className={styles.officeImg}>
              <Office className={styles.default} />
            </div>
            <div
              className={cx(styles.officeImg, styles.progress)}
              style={{
                width:
                  performanceInfo.width > OFFICE_WIDTH
                    ? OFFICE_WIDTH
                    : performanceInfo.width,
              }}
            >
              <Office
                color="#FF9F1C"
                className={styles[performanceInfo.level]}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.wrap} style={shipWidth && { width: shipWidth }}>
        <div
          className={styles.shipWrap}
          style={shipWidth && { width: shipWidth }}
        >
          {vesselTypeChecked?.icon()}
        </div>
        <div
          className={cx(styles.shipWrap, styles.progress)}
          style={{
            width:
              performanceInfo.width > imgWidth
                ? imgWidth
                : performanceInfo.width,
          }}
        >
          {vesselTypeChecked?.icon(performanceInfo.level)}
        </div>
      </div>
    );
  }, [
    entity,
    imgWidth,
    performanceInfo.level,
    performanceInfo.width,
    shipWidth,
    vesselTypeChecked,
  ]);

  const inspectionPercent = useMemo(() => {
    const ipNumber = Number(
      (!isNaN(percentPerformance) ? percentPerformance : 0) * 100,
    )?.toFixed(0);
    if (Number(ipNumber || 0) > 100) {
      return '>100%';
    }
    if (Number(ipNumber || 0) < 0) {
      return '<0%';
    }
    return `${ipNumber}%` || 0;
  }, [percentPerformance]);

  return (
    <div className={cx(styles.container, customContainer)}>
      <div className={styles.percent}>{inspectionPercent}</div>
      <div className={styles.label}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Inspection performance'
          ],
        )}
      </div>
      {renderProgress}
      {!hideInspectionScore && (
        <div className={styles.score}>
          (
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Inspection score'
            ],
          )}
          : <span className="fw-bold">{Number(inspectionScore || 0)}</span>)
        </div>
      )}
    </div>
  );
};
export default InspectionPerformance;
