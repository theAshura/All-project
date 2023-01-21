import { FC, useMemo } from 'react';
import Pagination from 'antd/lib/pagination';
import cx from 'classnames';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

interface PaginationCustomerProps {
  onChange: (page: number, pageSize?: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  total: number;
  current: number;
  pageSize: number;
  className?: string;
  optionPageSizes?: string[];
  dynamicLabels?: IDynamicLabel;
}

const PaginationCustomer: FC<PaginationCustomerProps> = (props) => {
  const {
    total,
    onChange,
    current,
    pageSize,
    onShowSizeChange,
    className,
    optionPageSizes,
  } = props;

  const totalPosition = useMemo(() => {
    switch (pageSize) {
      case 5:
        return 125;
      case 100:
        return 145;
      default:
        return 135;
    }
  }, [pageSize]);

  return (
    <div className={cx('pagination-customer position-relative', className)}>
      <Pagination
        pageSizeOptions={
          optionPageSizes || ['3', '5', '10', '20', '35', '50', '100']
        }
        defaultCurrent={1}
        total={total}
        pageSize={pageSize || 20}
        current={current}
        showTotal={(total, range) => (
          <div className="total-in-page" style={{ left: totalPosition }}>
            {`${range[0]}-${range[1]} of ${total}`}
          </div>
        )}
        onChange={onChange}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

export default PaginationCustomer;
