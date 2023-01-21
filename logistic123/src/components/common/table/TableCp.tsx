import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import images from 'assets/images/images';
import PaginationCustomer from 'components/ui/pagination-customer/PaginationCustomer';
import cx from 'classnames';
import { useResizeEffect } from 'hoc/useResizeEffect';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { TableProps } from 'models/common.model';
import { Table } from 'reactstrap';
import { SortType } from 'constants/filter.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './table.module.scss';

interface Props extends TableProps {
  optionPageSizes?: string[];
  isEmpty: boolean;
  isHiddenAction?: boolean;
  isRefreshLoading?: boolean;
  defaultSort?: string;
  sortFunction?: (id?: string, sortType?: SortType) => void;
  addRowFunction?: () => void;
  classNameNodataWrapper?: string;
  fullHeight?: boolean;
  scrollVertical?: boolean;
  scrollVerticalAttachment?: boolean;
  classNameHeader?: string;
  disableLoadingDefaultContainer?: boolean;
  dynamicLabels?: IDynamicLabel;
}

export default function TableCp(props: Props) {
  const {
    optionPageSizes,
    page,
    pageSize,
    fullHeight,
    totalItem,
    handleChangePage,
    isHiddenAction = false,
    addRowFunction,
    renderRow,
    loading,
    isEmpty,
    isRefreshLoading,
    sortFunction,
    classNameNodataWrapper,
    defaultSort,
    rowLabels,
    isHiddenPagination,
    scrollVertical,
    scrollVerticalAttachment,
    classNameHeader,
    disableLoadingDefaultContainer = false,
    dynamicLabels,
  } = props;
  const [isScrollable, setIsScrollable] = useState(false);
  const [container, setContainer] = useState(null);
  const [currentRowSort, setCurrentRowSort] = useState<string>(
    defaultSort?.substr(0, defaultSort.indexOf(':')) || undefined,
  );
  const [currentSortType, setCurrentSortType] = useState<number>(
    Number(
      defaultSort?.substr(defaultSort.indexOf(':') + 1, defaultSort.length),
    ) || undefined,
  );
  const containerRef = useRef(container);
  containerRef.current = container;
  const setScrollableOnResize = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, scrollWidth } = containerRef.current;

    setIsScrollable(scrollWidth > clientWidth);
  }, [containerRef]);
  useResizeEffect(setScrollableOnResize, [containerRef]);

  useEffect(() => {
    if (isRefreshLoading) {
      setCurrentSortType(undefined);
      setCurrentRowSort(undefined);
    }
  }, [isRefreshLoading, loading]);

  const handleSortField = (item) => {
    if (item.id !== 'action') {
      if (item.id !== currentRowSort) {
        setCurrentRowSort(item.id);
        setCurrentSortType(SortType.DESC);
        sortFunction(item.id, SortType.DESC);
      } else if (currentSortType === SortType.DESC) {
        setCurrentSortType(SortType.ASC);
        sortFunction(item.id, SortType.ASC);
      } else {
        setCurrentSortType(undefined);
        setCurrentRowSort(undefined);
        sortFunction();
      }
    }
  };

  const tableWrapperStyle = useMemo(() => {
    if (isHiddenAction) {
      return { marginLeft: 0 };
    }
    if (!rowLabels[0].width) {
      return { marginLeft: 140 };
    }
    if (!Number.isNaN(Number(rowLabels[0].width))) {
      return { marginLeft: Number(rowLabels[0].width) };
    }
    return { marginLeft: `${rowLabels[0].width}` };
  }, [isHiddenAction, rowLabels]);

  const getTHStyleMinWidth = useCallback((item) => {
    if (!item?.width) {
      return undefined;
    }
    if (Number.isNaN(Number(item?.width))) {
      return `${item?.width}`;
    }
    return Number(item?.width);
  }, []);

  const getTHStyleWidth = useCallback((item) => {
    if (!item?.fixedWidth) {
      return undefined;
    }
    if (Number.isNaN(Number(item?.fixedWidth))) {
      return `${item?.fixedWidth}`;
    }
    return Number(item?.fixedWidth);
  }, []);

  const getTHStyleMaxWidth = useCallback((item) => {
    if (!item?.maxWidth) {
      return undefined;
    }
    if (Number.isNaN(Number(item?.maxWidth))) {
      return `${item?.maxWidth}`;
    }
    return Number(item?.maxWidth);
  }, []);

  if (loading) {
    return (
      <div className="position-relative">
        <div
          className={cx(
            !disableLoadingDefaultContainer && styles.dataWapper,
            classNameNodataWrapper,
          )}
        >
          <img
            src={images.common.loading}
            className={cx(styles.loading)}
            alt="loading"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cx(styles.wrapContainer, {
          [styles.fullHeight]: fullHeight,
          [styles.scrollVertical]: scrollVertical,
          [styles.scrollVerticalAttachment]: scrollVerticalAttachment,
        })}
      >
        <div
          className={cx(styles.wrapTable, {
            [styles.fullHeight]: fullHeight,
          })}
          style={tableWrapperStyle}
          ref={(element) => {
            if (!element) return;
            setContainer(element);
            const { clientWidth, scrollWidth } = element;
            setIsScrollable(scrollWidth > clientWidth);
          }}
        >
          {!isEmpty && (
            <Table hover className={styles.table}>
              <thead className={cx(styles.thread, classNameHeader)}>
                <tr className={styles.title}>
                  {rowLabels.map((item, index) => (
                    <th
                      key={item.id}
                      className={cx(styles.subTitle, {
                        [styles.titleSort]: item.sort,
                        [styles.headColLabel]: item.id === 'action',
                        [styles.boxShadowAction]:
                          isScrollable && item.id === 'action',
                        [styles.isAction]: item.id === 'action',
                      })}
                      style={{
                        minWidth: getTHStyleMinWidth(item),
                        width: getTHStyleWidth(item),
                        maxWidth: getTHStyleMaxWidth(item),
                        ...(index === 0 &&
                          isHiddenAction && { paddingLeft: 16 }),
                      }}
                      onClick={
                        item.sort && sortFunction
                          ? () => handleSortField(item)
                          : undefined
                      }
                    >
                      <div className="d-flex">
                        {item.label}
                        {item?.addAction && (
                          <Button
                            className="ms-1"
                            buttonSize={ButtonSize.IconSmall2Action}
                            onClick={(e) => {
                              addRowFunction();
                              e.stopPropagation();
                            }}
                          >
                            <img
                              src={images.icons.icAddCircle}
                              alt="sort"
                              className={styles.icImg}
                            />
                          </Button>
                        )}
                        {item.sort &&
                          sortFunction &&
                          (item.id === currentRowSort && !!defaultSort ? (
                            <div>
                              <img
                                src={
                                  currentSortType === SortType.DESC
                                    ? images.icons.icSortDesc
                                    : images.icons.icSortAsc
                                }
                                alt="sort"
                                className={styles.icSortTable}
                              />
                            </div>
                          ) : (
                            item.id !== 'action' && (
                              <img
                                src={images.icons.icSortTable}
                                alt="sort"
                                className={styles.icSortTable}
                              />
                            )
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {renderRow(isScrollable)}
            </Table>
          )}
        </div>

        {isEmpty && (
          <div className={cx(styles.dataWapper, classNameNodataWrapper)}>
            <img
              src={images.icons.icNoData}
              className={styles.noData}
              alt="no data"
            />
          </div>
        )}
        {!isHiddenPagination && !loading && totalItem >= 1 && (
          <div className={styles.pagination}>
            <PaginationCustomer
              total={totalItem}
              pageSize={pageSize}
              current={page}
              onChange={handleChangePage}
              optionPageSizes={optionPageSizes}
              dynamicLabels={dynamicLabels}
            />
          </div>
        )}
      </div>
    </>
  );
}

TableCp.defaultProps = {
  sortFunction: undefined,
  defaultSort: undefined,
};
