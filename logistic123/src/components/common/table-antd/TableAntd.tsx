import cx from 'classnames';
import { FC, useCallback, useMemo } from 'react';
import Table, { ColumnsType } from 'antd/lib/table';

import images from 'assets/images/images';
import { formatDateTime } from 'helpers/utils.helper';
import { SortType } from 'constants/filter.const';
import NoDataImg from 'components/common/no-data/NoData';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { statusColor } from 'components/common/table/row/rowCp';
import { isBoolean } from 'lodash';
import upperFirst from 'lodash/upperFirst';
import lowerCase from 'lodash/lowerCase';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './table-antd.module.scss';
import './table-antd.scss';

export interface ColumnTableType {
  title: string;
  dataIndex: any;
  width: number | string;
  isHightLight?: boolean;
  isDateTime?: boolean;
  isSort?: boolean;
  sortField?: string;
  minWidth?: string | number;
  onClickHightLight?: (dataItem) => void;
  fixed?: string | boolean;
}

export interface TableProps {
  dataSource: any[];
  columns: ColumnTableType[];
  handleClick?: (
    dataItem,
    clickedKey?: string | string[],
    specificKeyInArray?: string,
    rowIndex?: number,
  ) => void;
  scroll?: { x?: string | number | true; y?: string | number };
  sort?: string;
  onSort?: (value: string) => void;
  isViewMore?: boolean;
  onViewMore?: () => void;
  isUpcomingInspectionPlanList?: boolean;
  rowHeight?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const TableAntd: FC<TableProps> = ({
  dataSource,
  scroll,
  handleClick,
  columns,
  sort,
  onSort,
  isViewMore,
  onViewMore,
  isUpcomingInspectionPlanList,
  rowHeight,
  dynamicLabels,
}) => {
  const currentSortField = useMemo(() => {
    if (sort && onSort) {
      const sortSplit = sort.split(':');

      return {
        sortField: sortSplit[0],
        sortType: sortSplit[1],
      };
    }
    return undefined;
  }, [onSort, sort]);

  const data = useMemo(
    () =>
      isViewMore && dataSource?.length
        ? [...dataSource, { isViewMoreRow: true }]
        : dataSource,
    [dataSource, isViewMore],
  );
  const handleSort = useCallback(
    (item: ColumnTableType) => {
      if (item?.sortField && item?.isSort) {
        if (item.sortField !== currentSortField?.sortField) {
          if (onSort) onSort(`${item.sortField}:${SortType.DESC}`);
        } else if (currentSortField.sortType === String(SortType.DESC)) {
          if (onSort) onSort(`${item.sortField}:${SortType.ASC}`);
        } else if (onSort) onSort('');
      }
      return undefined;
    },
    [currentSortField?.sortField, currentSortField?.sortType, onSort],
  );

  const handleActionCell = useCallback(
    (columnItem, record, columns, columnIndex, phrase, rowNum) => {
      if (!columnItem.isHightLight) {
        return null;
      }
      if (columnItem?.onClickHightLight) {
        return columnItem.onClickHightLight(record);
      }
      return handleClick(
        record,
        columns[columnIndex].dataIndex,
        phrase,
        rowNum,
      );
    },
    [handleClick],
  );

  const renderText = useCallback(
    (isStatus, columnItem, text, record, columnIndex, rowNum) => {
      if (Array.isArray(text)) {
        return text.map((phrase) => (
          <span
            key={columnIndex}
            className={cx(styles.textContent, 'limit-line-text-extend', {
              [styles.underline]: columnItem.isHightLight,
              [styles.blue_3]:
                isStatus && statusColor.blue_3.includes(lowerCase(phrase)),
              [styles.red_3]:
                isStatus && statusColor.red_3.includes(lowerCase(phrase)),
              [styles.orange_3]:
                isStatus && statusColor.orange_3.includes(lowerCase(phrase)),
              [styles.red_6]:
                isStatus && statusColor.red_6.includes(lowerCase(phrase)),
              [styles.green_1]:
                isStatus && statusColor.green_1.includes(lowerCase(phrase)),
              [styles.green_2]:
                isStatus && statusColor.green_2.includes(lowerCase(phrase)),
            })}
            onClick={() =>
              handleActionCell(
                columnItem,
                record,
                columns,
                columnIndex,
                phrase,
                rowNum,
              )
            }
          >
            {
              // eslint-disable-next-line no-nested-ternary
              columnItem.isDateTime
                ? formatDateTime(phrase)
                : lowerCase(columnItem.dataIndex).includes('status')
                ? upperFirst(phrase)
                : phrase
            }
          </span>
        ));
      }

      return (
        <span
          className={cx(styles.textContent, 'limit-line-text-extend', {
            [styles.underline]: columnItem.isHightLight,
            [styles.blue_3]:
              isStatus && statusColor.blue_3.includes(lowerCase(text)),
            [styles.red_3]:
              isStatus && statusColor.red_3.includes(lowerCase(text)),
            [styles.orange_3]:
              isStatus && statusColor.orange_3.includes(lowerCase(text)),
            [styles.red_6]:
              isStatus && statusColor.red_6.includes(lowerCase(text)),
            [styles.green_1]:
              isStatus && statusColor.green_1.includes(lowerCase(text)),
            [styles.green_2]:
              isStatus && statusColor.green_2.includes(lowerCase(text)),
          })}
          onClick={
            columnItem.isHightLight
              ? () => {
                  if (columnItem?.onClickHightLight) {
                    columnItem.onClickHightLight(record);
                  } else {
                    handleClick(
                      record,
                      columns[columnIndex].dataIndex,
                      text,
                      rowNum,
                    );
                  }
                }
              : undefined
          }
        >
          {
            // eslint-disable-next-line no-nested-ternary
            columnItem.isDateTime
              ? formatDateTime(text)
              : lowerCase(columnItem.dataIndex).includes('status')
              ? upperFirst(text)
              : text
          }
        </span>
      );
    },
    [columns, handleActionCell, handleClick],
  );

  const columnsTable: ColumnsType = useMemo(
    () =>
      columns?.map((columnItem, columnIndex) => {
        const isStatus =
          lowerCase(String(columnItem?.dataIndex)).includes('status') ||
          columnItem.dataIndex?.includes('status');
        let convertFixed: 'left' | 'right' | boolean = false;
        const fixed = columnItem?.fixed;
        if (fixed || isBoolean(fixed)) {
          convertFixed = Boolean(fixed);
        }
        if (fixed || fixed === 'left') {
          convertFixed = 'left';
        }
        if (fixed || fixed === 'right') {
          convertFixed = 'right';
        }
        return {
          title: () => (
            <div
              className={cx(styles.headerTitle)}
              onClick={() => {
                handleSort(columnItem);
              }}
            >
              {columnItem.title}{' '}
              {columnItem?.isSort &&
                columnItem?.sortField &&
                (columnItem?.sortField === currentSortField?.sortField &&
                sort ? (
                  <>
                    <img
                      src={
                        currentSortField?.sortType === String(SortType.DESC)
                          ? images.icons.icSortDesc
                          : images.icons.icSortAsc
                      }
                      alt="sort"
                      className={styles.icSortTable}
                    />
                  </>
                ) : (
                  <img
                    src={images.icons.icSortTable}
                    alt="sort"
                    className={styles.icSortTable}
                  />
                ))}
            </div>
          ),
          key: columnItem.dataIndex,
          fixed: convertFixed,
          dataIndex: columnItem.dataIndex,
          width: columnItem.width,
          render: (text, record, index) =>
            isViewMore &&
            onViewMore &&
            dataSource?.length &&
            data[index]?.isViewMoreRow &&
            columnIndex === 0 ? (
              <span
                className={cx(
                  styles.textContent,
                  styles.underline,
                  styles.blue_3,
                )}
                onClick={onViewMore}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['View more'],
                )}
              </span>
            ) : (
              renderText(isStatus, columnItem, text, record, columnIndex, index)
            ),
        };
      }),
    [
      columns,
      currentSortField?.sortField,
      currentSortField?.sortType,
      sort,
      handleSort,
      isViewMore,
      onViewMore,
      dataSource?.length,
      data,
      dynamicLabels,
      renderText,
    ],
  );

  return dataSource?.length ? (
    <Table
      columns={columnsTable}
      className={cx(styles.tableWrapper)}
      dataSource={data}
      scroll={scroll}
      pagination={false}
      rowClassName={cx(styles.rowWrapper, {
        [styles.customRowHeight]: rowHeight,
      })}
    />
  ) : (
    <div
      className={cx(styles.noDataWrapper, {
        [styles.noDataWrapperList]: isUpcomingInspectionPlanList,
      })}
    >
      <NoDataImg />
    </div>
  );
};

export default TableAntd;
