import { ICellRendererParams } from 'ag-grid-community';
import cx from 'classnames';

const RiskTimelossCellRender = ({ value, data }: ICellRendererParams) => (
  <div className="w-100 d-flex justify-content-between align-items-center">
    <span>{value ?? ''}</span>
    <span
      className={cx({
        'ag-icon': data?.isEdit,
        'ag-icon-small-down': data?.isEdit,
      })}
    />
  </div>
);

export default RiskTimelossCellRender;
