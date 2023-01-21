import cx from 'classnames';
import { FC, ReactElement, useCallback, useMemo } from 'react';
import Table, { ColumnsType } from 'antd/lib/table';
import Checkbox from 'components/ui/checkbox/Checkbox';

import images from 'assets/images/images';

import { statusColor } from 'components/common/table/row/rowCp';
import upperFirst from 'lodash/upperFirst';
import lowerCase from 'lodash/lowerCase';

import styles from './table-antd.module.scss';

export interface ColumnTableType {
  title?: string | ReactElement | (() => ReactElement);
  dataIndex: string;
  width: number | string;
}

export interface TableProps {
  dataSource: any[];
  columns: ColumnTableType[];
  scroll?: { x?: string | number | true; y?: string | number };
  value: string[];
  onChangeValues: (data: string[]) => void;
  messageError: string;
  canChecked?: boolean;
}

const TableCheckbox: FC<TableProps> = ({
  dataSource,
  scroll,
  columns,
  value = [],
  onChangeValues,
  messageError,
  canChecked = true,
}) => {
  const checkedAll: boolean = useMemo(() => {
    let result = false;
    if (dataSource?.length === 0) return false;

    const lengthRow: number = dataSource?.length || 0;
    for (let i = 0; i < lengthRow; i += 1) {
      result = value?.includes(dataSource[i].id);
      if (!result) return false;
    }
    return true;
  }, [dataSource, value]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const rowId: string[] = dataSource.map((item) => item.id);
      let status: boolean = false;
      const idsSelected: string[] = [...value];
      if (!checked) {
        const newDataSelected = idsSelected.filter(
          (item) => !rowId?.includes(item),
        );
        onChangeValues([...newDataSelected]);
      } else {
        rowId.forEach((id) => {
          status = idsSelected?.includes(id);
          if (!status) {
            idsSelected.push(id);
          }
        });
        onChangeValues([...idsSelected]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSource, value],
  );

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      if (checked && !value?.includes(id)) {
        const newSelectedIds = [...value];
        newSelectedIds.push(id);
        onChangeValues(newSelectedIds);
      } else {
        const newState = value.filter((item) => item !== id);
        onChangeValues(newState);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  const checkboxColumn: ColumnTableType[] = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'id',
        width: 80,
      },
      ...columns,
    ],
    [columns],
  );

  const columnsTable: ColumnsType = useMemo(
    () =>
      checkboxColumn?.map((columnItem, columnIndex) => {
        const isStatus = lowerCase(columnItem.dataIndex)?.includes('status');
        return {
          title: () => (
            <div className={cx(styles.headerTitle)}>
              {columnItem.dataIndex === 'id' && canChecked ? (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <Checkbox
                  checked={checkedAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              ) : (
                columnItem.title
              )}
            </div>
          ),
          key: columnItem.dataIndex,

          dataIndex: columnItem.dataIndex,
          width: columnItem.width,
          render: (text, record, index) =>
            columnItem.dataIndex !== 'id' ? (
              <span
                className={cx(styles.textContent, 'limit-line-text', {
                  [styles.blue_3]:
                    isStatus && statusColor.blue_3?.includes(lowerCase(text)),
                  [styles.red_3]:
                    isStatus && statusColor.red_3?.includes(lowerCase(text)),
                  [styles.orange_3]:
                    isStatus && statusColor.orange_3?.includes(lowerCase(text)),
                  [styles.red_6]:
                    isStatus && statusColor.red_6?.includes(lowerCase(text)),
                  [styles.green_1]:
                    isStatus && statusColor.green_1?.includes(lowerCase(text)),
                  [styles.green_2]:
                    isStatus && statusColor.green_2?.includes(lowerCase(text)),
                })}
              >
                {lowerCase(columnItem.dataIndex)?.includes('status')
                  ? upperFirst(text)
                  : text}
              </span>
            ) : (
              canChecked && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <Checkbox
                  value={text}
                  checked={value?.includes(text)}
                  onChange={(e) => {
                    handleChange(e.target.checked, text);
                  }}
                />
              )
            ),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkboxColumn, value, dataSource, checkedAll],
  );

  return (
    <div className="px-0">
      {dataSource?.length ? (
        <div className="px-0">
          <Table
            columns={columnsTable}
            className={cx(styles.tableWrapper)}
            dataSource={dataSource}
            scroll={scroll}
            pagination={false}
            rowClassName={styles.rowWrapper}
          />
          {messageError && (
            <div className={styles.errorMessage}>{messageError}</div>
          )}
        </div>
      ) : (
        <div className={cx(styles.dataWrapperEmpty)}>
          <img
            src={images.icons.icNoData}
            className={styles.noData}
            alt="no data"
          />
        </div>
      )}
    </div>
  );
};

export default TableCheckbox;
