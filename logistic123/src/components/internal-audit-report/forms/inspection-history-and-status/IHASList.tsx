import { FC } from 'react';
import Table from 'antd/lib/table';
import styles from '../form.module.scss';
import '../form.scss';

interface Props {
  dataSource: any[];
  columns: any[];
}

const IHASList: FC<Props> = (props) => {
  const { dataSource, columns } = props;
  return (
    <div className={styles.IHASListWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: 427, x: 'max-content' }}
        className={styles.tableWrapper}
        rowClassName={styles.rowWrapper}
        pagination={false}
      />
    </div>
  );
};

export default IHASList;
