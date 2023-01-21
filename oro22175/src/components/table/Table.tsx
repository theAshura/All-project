import { Table } from "antd";

interface Props {
  columns: any[];
  total?: number;
  dataSource: any;
  page?: number;
  pageSize?: number;
  pageSizeOption?: string[];
  loading?: boolean;
  isHide?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

export default function TableCommon(props: Props) {
  const { columns, dataSource, page, loading, onChange, total, isHide } = props;
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: true }}
      loading={loading}
      key={"_id"}
      pagination={{
        defaultPageSize: 10,
        current: page,
        total: total,
        pageSizeOptions: [5, 10, 20, 50, 100],
        showSizeChanger: true,
        onChange: onChange,
        hideOnSinglePage: isHide,
      }}
    />
  );
}
