import Tabs from 'antd/lib/tabs';
import cx from 'classnames';
import TableAntd, {
  ColumnTableType,
} from 'components/common/table-antd/TableAntd';
import { FC, useCallback, useState } from 'react';
import ModalTable from '../../modal/ModalTable';
import styles from './list-overview.module.scss';

interface Props {
  title: string;
  className?: string;
}

enum ModalTabType {
  NUMBER_SUBSCRIPTION = 'NUMBER_SUBSCRIPTION',
  NUMBER_OF_USER = 'NUMBER_OF_USER',
  NUMBER_OF_ERROR = 'NUMBER_OF_ERROR',

  HIDDEN = 'HIDDEN',
}
const columnAuditChecklistTemplates: ColumnTableType[] = [
  {
    title: ' Member ID',
    dataIndex: 'memberId',
    width: 75,
  },
  {
    title: `Account's Name`,
    dataIndex: 'accountName',
    width: 110,
  },
  {
    title: 'Access Time',
    dataIndex: 'accessTime',
    width: 80,
  },
  {
    title: 'Platfrom Channel',
    dataIndex: 'platFromChannel',
    width: 125,
  },
  {
    title: 'Type',
    dataIndex: 'status',
    width: 30,
  },
];

const columnPlanningAndRequest: ColumnTableType[] = [
  {
    title: 'Issues Name',
    dataIndex: 'issuesName',
    width: 80,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    width: 30,
  },
  {
    title: 'Error Type',
    dataIndex: 'errorType',
    width: 75,
  },
];
const mockAuditChecklist = [
  {
    memberId: 'ID001',
    accountName: 'Account001',
    accessTime: '1:30:23',
    platFromChannel: 'Web',
    status: 'Sign in',
  },
  {
    memberId: 'ID002',
    accountName: 'Account002',
    accessTime: '1:30:23',
    platFromChannel: 'Tablet',
    status: 'Sign out',
  },
  {
    memberId: 'ID002',
    accountName: 'Account002',
    accessTime: '1:30:23',
    platFromChannel: 'Tablet',
    status: 'Sign in',
  },
  {
    memberId: 'ID003',
    accountName: 'Account003',
    accessTime: '1:30:23',
    platFromChannel: 'Web',
    status: 'Sign out',
  },
];

const mockPlanning = [
  {
    issuesName: 'Issues001',
    time: '1:30:23',
    errorType: '01',
  },
  {
    issuesName: 'Issues002',
    time: '1:30:23',
    errorType: '02',
  },
  {
    issuesName: 'Issues003',
    time: '1:30:23',
    errorType: '03',
  },
  {
    issuesName: 'Issues004',
    time: '1:30:23',
    errorType: '04',
  },
];

const ListOverview: FC<Props> = ({ title, className }) => {
  const [activeTab, setActiveTab] = useState<string>(
    'NumberOfUserAccessHistory',
  );
  const [modal, setModal] = useState<ModalTabType>(ModalTabType.HIDDEN);

  const renderModalTable = useCallback(() => {
    let title = '';
    let columns = [];
    let data = [];
    if (modal === ModalTabType.HIDDEN) {
      return null;
    }
    switch (modal) {
      case ModalTabType.NUMBER_OF_USER:
        title = 'Number of user access history';
        columns = columnAuditChecklistTemplates;
        data = mockAuditChecklist;
        break;
      case ModalTabType.NUMBER_OF_ERROR:
        title = 'Number of error log (Issues report)';
        columns = columnPlanningAndRequest;
        data = mockPlanning;
        break;
      default:
        break;
    }

    return (
      <ModalTable
        scroll={{ x: 'max-content', y: 360 }}
        isOpen
        dataSource={data}
        toggle={() => setModal(ModalTabType.HIDDEN)}
        columns={columns}
        title={title}
      />
    );
  }, [modal]);

  return (
    <div className={cx(styles.block, className)}>
      <div className={styles.title}>{title}</div>
      <Tabs
        activeKey={activeTab}
        tabBarStyle={{ borderBottom: '1px solid #D2D1D4' }}
        onChange={setActiveTab}
      >
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'NumberOfUserAccessHistory',
              })}
            >
              Number of user access history
            </div>
          }
          key="NumberOfUserAccessHistory"
        >
          <TableAntd
            columns={columnAuditChecklistTemplates}
            dataSource={mockAuditChecklist.slice(0, 4)}
            onViewMore={() => {
              setModal(ModalTabType.NUMBER_OF_USER);
            }}
            isViewMore={mockAuditChecklist?.length > 3}
          />
          {/* <div
            className={styles.viewMore}
            onClick={() => setModal(ModalTabType.NUMBER_OF_USER)}
          >
            View More
          </div>
          <div className={styles.divider} /> */}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'NumberOfErrorLog',
              })}
            >
              Number of error log (Issues report)
            </div>
          }
          key="NumberOfErrorLog"
        >
          <TableAntd
            columns={columnPlanningAndRequest}
            dataSource={mockPlanning.slice(0, 4)}
            onViewMore={() => {
              setModal(ModalTabType.NUMBER_OF_USER);
            }}
            isViewMore={mockPlanning?.length > 3}
          />
          {/* <div
            className={styles.viewMore}
            onClick={() => setModal(ModalTabType.NUMBER_OF_ERROR)}
          >
            View More
          </div>
          <div className={styles.divider} /> */}
        </Tabs.TabPane>
      </Tabs>
      {renderModalTable()}
    </div>
  );
};

export default ListOverview;
