import cx from 'classnames';
import { FC } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Table, { ColumnsType } from 'antd/lib/table';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import NoDataImg from 'components/common/no-data/NoData';
import styles from './modal.module.scss';

interface ModalOnboardProps {
  isOpen: boolean;
  title: string;
  dataSource: any[];
  columns: ColumnsType;
  isAdd?: boolean;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
  dynamicLabels?: IDynamicLabel;
}

const ModalOnboard: FC<ModalOnboardProps> = ({
  isOpen,
  toggle,
  title,
  columns,
  dataSource,
  w,
  h,
  dynamicLabels,
}) => {
  const columnsModal: ColumnsType = [
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'App instance ID'
        ],
      ),
      key: 'appInstance',
      dataIndex: 'appInstance',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Web instance ID'
        ],
      ),
      key: 'webInstance',
      dataIndex: 'webInstance',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Template code'
        ],
      ),
      key: 'templateCode',
      dataIndex: 'templateCode',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Question name'
        ],
      ),
      key: 'questionName',
      dataIndex: 'questionName',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'].Reference,
      ),
      key: 'reference',
      dataIndex: 'reference',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Inspection type'
        ],
      ),
      key: 'auditType',
      dataIndex: 'auditType',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Finding type'
        ],
      ),
      dataIndex: 'findingType',
      key: 'findingType',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Is significant'
        ],
      ),
      dataIndex: 'isSignificant',
      key: 'isSignificant',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Main category'
        ],
      ),
      dataIndex: 'mainCategory',
      key: 'mainCategory',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Second category'
        ],
      ),
      dataIndex: 'sub1stCategory',
      key: 'sub1stCategory',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Third category'
        ],
      ),
      dataIndex: 'sub2ndCategory',
      key: 'sub2ndCategory',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'].Finding,
      ),
      dataIndex: 'finding',
      key: 'finding',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Rectification/ verified'
        ],
      ),
      dataIndex: 'rectificationVerified',
      key: 'rectificationVerified',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
          'Question ID'
        ],
      ),
      key: 'questionId',
      dataIndex: 'questionId',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      toggle={toggle}
      content={
        <div className={cx(styles.contentWrapper)}>
          <div className={styles.table}>
            {dataSource?.length ? (
              <Table
                columns={columnsModal}
                className={cx(styles.tableWrapper)}
                dataSource={dataSource}
                scroll={{ x: 800, y: 290 }}
                pagination={false}
                rowClassName={styles.rowWrapper}
              />
            ) : (
              <div className={cx(styles.dataWrapperEmpty)}>
                <NoDataImg />
              </div>
            )}
          </div>
        </div>
      }
      w={800}
      modalType={ModalType.CENTER}
    />
  );
};

export default ModalOnboard;
