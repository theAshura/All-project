import { map, size } from 'lodash';
import { useMemo, memo, ReactNode } from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { Doughnut } from 'react-chartjs-2';
import cx from 'classnames';

import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import images from 'assets/images/images';
import SelectUI from 'components/ui/select/Select';
import { Tooltip } from 'antd/lib';
import NoDataImg from 'components/common/no-data/NoData';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './dashboard-master-card.module.scss';
import ListProgress, {
  ListProgressSortType,
} from '../../list-progress/ListProgress';
import StatisticCard from '../statisticCard/StatisticCard';

export interface ProgressCardData {
  title: string;
  value?: number;
  color: string;
  index?: number;
}

interface DashBoardMasterCardProps {
  title: string;
  sortable?: boolean;
  data?: ProgressCardData[];
  infoCardIcon?: string;
  infoCardTitle?: string;
  infoCardTitleColor?: string;
  infoCardIconBGColor?: string;
  infoCardBody?: string | ReactNode;
  handleOnSort?: (value) => void;
  handleOnClickViewMore?: () => void;
  minHeight?: number | string;
  progressHeight?: number | string;
  shrinkChart?: boolean;
  displayFooterStatistic?: boolean;
  listProgressType?: ListProgressSortType;
  totalValue: number;
  containerClassName?: string;
  isRisks?: boolean;
  tooltipTitle?: string;
  averageScore?: number;
  showAverageScore?: boolean;
  useMinHeight?: boolean;
  titleClassName?: string;
  filterValue?: TrendOfTime;
  scrollAbleProgress?: boolean;
  eachProgressClassName?: string;
  dynamicLabels?: IDynamicLabel;
}

const DashBoardMasterCard = ({
  data,
  infoCardBody,
  infoCardIcon,
  infoCardIconBGColor,
  infoCardTitle,
  infoCardTitleColor,
  title,
  sortable,
  handleOnSort,
  handleOnClickViewMore,
  minHeight,
  progressHeight,
  shrinkChart,
  displayFooterStatistic,
  listProgressType,
  totalValue,
  containerClassName,
  isRisks,
  tooltipTitle,
  averageScore,
  showAverageScore,
  useMinHeight = true,
  titleClassName,
  filterValue,
  scrollAbleProgress = false,
  eachProgressClassName,
}: DashBoardMasterCardProps) => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });
  const mappedData = useMemo(
    () => map(data, (each: ProgressCardData) => each.value),
    [data],
  );

  const mappedBackground = useMemo(
    () => map(data, (each: ProgressCardData) => each.color),
    [data],
  );

  const mappedName = useMemo(
    () => map(data, (each: ProgressCardData) => each.title),
    [data],
  );

  const renderDoughtNutChart = useMemo(() => {
    if (showAverageScore && !averageScore) {
      return <NoDataImg />;
    }

    return (
      <>
        <Doughnut
          data={{
            labels: mappedName,
            datasets: [
              {
                data: mappedData,
                backgroundColor: mappedBackground,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
        <h3
          className={cx(styles.totalText, {
            [styles.totalTextNoFooterStatistic]: !displayFooterStatistic,
            [styles.totalTextNoFooterStatisticIsRisks]: isRisks,
          })}
        >
          {showAverageScore && (
            <span className={styles.averageScore}>
              {renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Average score'],
              )}
            </span>
          )}
          <span>{showAverageScore ? averageScore : totalValue}</span>
        </h3>
      </>
    );
  }, [
    averageScore,
    displayFooterStatistic,
    dynamicLabels,
    isRisks,
    mappedBackground,
    mappedData,
    mappedName,
    showAverageScore,
    totalValue,
  ]);

  return (
    <div
      className={cx(
        styles.cardContainer,
        {
          [styles.cardContainerHeight]: displayFooterStatistic,
          [styles.cardContainerNoFooterStatistic]:
            !displayFooterStatistic && !isRisks,
          [styles.minHeight626]: useMinHeight,
        },
        containerClassName,
      )}
      key={`${title}distinctKey${totalValue}`}
    >
      <Row gutter={[16, 0]}>
        <Col
          span={24}
          className={cx(
            styles.textContainer,
            {
              [styles.textContainerNoFooterStatistic]: !displayFooterStatistic,
              [styles.textContainerNoFooterStatisticIsRisks]: isRisks,
            },
            titleClassName,
          )}
        >
          <strong className={styles.textTitle}>{title}</strong>
          {tooltipTitle && (
            <Tooltip
              placement="topLeft"
              title={tooltipTitle}
              overlayStyle={{ maxWidth: '245px', fontSize: '11px' }}
            >
              <img src={images.icons.icTooltip} alt={tooltipTitle} />
            </Tooltip>
          )}

          {sortable && (
            <div>
              <SelectUI
                data={[
                  {
                    label: `1 ${renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.week,
                    )}`,
                    value: TrendOfTime.W,
                  },
                  {
                    label: `1 ${renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.month,
                    )}`,
                    value: TrendOfTime.M,
                  },
                  {
                    label: `3 ${renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.months,
                    )}`,
                    value: TrendOfTime.M3,
                  },
                  {
                    label: `1 ${renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.year,
                    )}`,
                    value: TrendOfTime.Y,
                  },
                ]}
                value={filterValue}
                onChange={handleOnSort}
              />
            </div>
          )}
        </Col>
      </Row>

      {!totalValue ? (
        <div className={styles.noDataContainer}>
          <NoDataImg />
        </div>
      ) : (
        <>
          <Row
            className={cx(
              styles.donutContainer,
              {
                [styles.width14rem]: size(data) <= 4 && shrinkChart,
                [styles.donutContainerNoFooterStatistic]:
                  !displayFooterStatistic && !isRisks,
              },
              'my-4',
            )}
          >
            {renderDoughtNutChart}
          </Row>

          <ListProgress
            data={data}
            progressHeight={progressHeight}
            sort={listProgressType || ListProgressSortType.ALPHABET_INCREASE}
            totalValue={totalValue}
            isRisks={isRisks}
            scrollAble={scrollAbleProgress}
            eachProgressClassName={eachProgressClassName}
          />

          {infoCardIcon &&
            infoCardBody &&
            infoCardIconBGColor &&
            infoCardTitleColor &&
            infoCardTitle && (
              <div
                className={cx(
                  styles.staticContainer,
                  minHeight && styles.mtAuto,
                )}
              >
                <StatisticCard
                  text={infoCardTitle}
                  backgroundIconColor={infoCardIconBGColor}
                  body={infoCardBody}
                  iconSrc={infoCardIcon}
                  handleViewMore={handleOnClickViewMore}
                  textValueColor={infoCardTitleColor}
                  key={infoCardTitle}
                  minHeight={145}
                />
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default memo(DashBoardMasterCard);
