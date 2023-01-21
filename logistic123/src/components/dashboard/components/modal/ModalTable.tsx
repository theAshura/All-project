import cx from 'classnames';
import { FC, ReactElement, useCallback } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import TableAntd, {
  ColumnTableType,
} from 'components/common/table-antd/TableAntd';
import styles from './modal.module.scss';

export interface ModalTableProps {
  isOpen: boolean;
  title: string | ReactElement;
  dataSource: any[];
  columns: ColumnTableType[];
  handleClick?: (
    data,
    key?: string,
    keyInArray?: string,
    rowIndex?: number,
  ) => void;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
  onSort?: (value: string) => void;
  sort?: string;
  scroll?: { x?: string | number | true; y?: string | number };
  total?: number;
  titleClasseName?: string;
}

const ModalTable: FC<ModalTableProps> = ({
  isOpen,
  toggle,
  title,
  dataSource,
  handleClick,
  columns,
  w,
  h,
  onSort,
  scroll,
  sort,
  total,
  titleClasseName,
}) => {
  const renderTitle = useCallback(
    () => (
      <div className={styles.titleModalContainer}>
        <div>{title}</div>
        <div className={styles.modalTotal}>{`Total: ${total}`}</div>
      </div>
    ),
    [title, total],
  );
  return (
    <Modal
      isOpen={isOpen}
      title={total ? renderTitle() : title}
      titleClasseName={titleClasseName}
      toggle={toggle}
      w={w || 800}
      h={h}
      content={
        <div className={cx(styles.contentWrapper)}>
          <div className={styles.table}>
            <TableAntd
              columns={columns}
              dataSource={dataSource}
              handleClick={handleClick}
              sort={sort}
              onSort={onSort}
              scroll={scroll}
            />
          </div>
        </div>
      }
      modalType={ModalType.LARGE}
    />
  );
};

export default ModalTable;
