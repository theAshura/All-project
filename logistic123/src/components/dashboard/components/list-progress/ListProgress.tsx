import { FC, useCallback, useMemo } from 'react';
import Col from 'antd/lib/col';
import { size } from 'lodash';
import cx from 'classnames';

import CustomProgress from 'components/common/progress-custom/CustomProgress';
import { ProgressCardData } from '../chart/dashboardCard/DashBoardMasterCard';
import styles from './list-progress.module.scss';

export enum ListProgressSortType {
  INDEX_INCREASE = 'II',
  ALPHABET_INCREASE = 'AI',
}

interface ListProgressProps {
  progressHeight?: number | string;
  data: ProgressCardData[];
  sort?: ListProgressSortType;
  totalValue: number;
  isRisks?: boolean;
  scrollAble?: boolean;
  eachProgressClassName?: string;
}

const ListProgress: FC<ListProgressProps> = ({
  progressHeight,
  data,
  sort = ListProgressSortType.ALPHABET_INCREASE,
  totalValue,
  isRisks,
  scrollAble = false,
  eachProgressClassName,
}) => {
  const divideArray = useMemo(() => {
    const markedIndex =
      size(data) % 2 === 0 ? size(data) / 2 : Math.floor(size(data) / 2) + 1;
    let sortedData: ProgressCardData[];

    switch (sort) {
      case ListProgressSortType.INDEX_INCREASE:
        sortedData = [...data].sort(
          (currentValue, nextValue) => currentValue.index - nextValue.index,
        );
        break;
      case ListProgressSortType.ALPHABET_INCREASE:
        sortedData = [...data].sort((currentValue, nextValue) =>
          currentValue.title.localeCompare(nextValue.title),
        );
        break;

      default:
        break;
    }

    const leftCol = sortedData.splice(0, markedIndex);
    const rightCol = [...sortedData];
    return {
      leftCol,
      rightCol,
    };
  }, [data, sort]);

  const sortedArray = useMemo(() => {
    const sortedData = data;
    if (size(data) <= 4) {
      return sortedData;
    }

    return divideArray;
  }, [data, divideArray]);

  const renderSortedArray = useCallback(
    ({
      leftCol,
      rightCol,
    }: {
      leftCol: ProgressCardData[];
      rightCol: ProgressCardData[];
    }) => (
      <div
        className={cx(styles.progressContainer, {
          [styles.isRiskContainer]: isRisks,
          [styles.scrollAbleContainer]: scrollAble,
        })}
      >
        <div
          className={cx(styles.progressCol, {
            [styles.isRisksProgressCol]: isRisks,
          })}
        >
          {leftCol.map((item) => (
            <div
              className={cx('mb-2 px-2', eachProgressClassName)}
              key={`${item?.title} ${item?.color}`}
            >
              <CustomProgress
                percent={((item.value / totalValue) * 100).toFixed(2) || '0'}
                progressStatusColor={item.color}
                value={item.value}
                title={item.title}
                displayStatistic
                key={item.color}
              />
            </div>
          ))}
        </div>

        <div
          className={cx(styles.progressCol, {
            [styles.isRisksProgressCol]: isRisks,
          })}
        >
          {rightCol.map((item) => (
            <div
              className={cx('mb-2 px-2', eachProgressClassName)}
              key={`${item?.title} ${item?.color}`}
            >
              <CustomProgress
                percent={((item.value / totalValue) * 100).toFixed(2) || '0'}
                progressStatusColor={item.color}
                value={item.value}
                title={item.title}
                displayStatistic
                key={item.color}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    [eachProgressClassName, isRisks, scrollAble, totalValue],
  );

  return (
    <div
      className={cx(styles.progressHeight, {
        [styles.progressHeightIsRisks]: isRisks,
      })}
      style={
        progressHeight && {
          height: progressHeight,
        }
      }
    >
      {/* <Row>
        {data.map((each) => (
          <Col
            xs={24}
            xl={size(data) >= 4 ? 12 : 24}
            className={
              size(data) >= 4 ? styles.lightSpaces : styles.denseSpaces
            }
            key={each.title}
          >
            <CustomProgress
              percent={((each.value / totalValue) * 100).toFixed(2) || '0'}
              progressStatusColor={each.color}
              value={each.value}
              title={each.title}
              displayStatistic
              key={each.color}
            />
          </Col>
        ))}
      </Row> */}

      {Array.isArray(sortedArray)
        ? sortedArray.map((sortedItem) => (
            <Col
              xs={24}
              className={
                size(sortedItem) === 4 ? styles.lightSpaces : styles.denseSpaces
              }
              key={sortedItem.title}
            >
              <CustomProgress
                percent={
                  ((sortedItem.value / totalValue) * 100).toFixed(2) || '0'
                }
                progressStatusColor={sortedItem.color}
                value={sortedItem.value}
                title={sortedItem.title}
                displayStatistic
                key={sortedItem.color}
              />
            </Col>
          ))
        : renderSortedArray(sortedArray)}
    </div>
  );
};

export default ListProgress;
