import { memo, useMemo } from 'react';
import cx from 'classnames';
import { DataObj } from 'models/common.model';
import isEqual from 'lodash/isEqual';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import Tooltip from 'antd/lib/tooltip';

import styles from 'components/common/modal-list/row/row-modal-cp.module.scss';

export interface RowTableProps {
  data: DataObj;
  checked: boolean;
  handleChecked: (checked: boolean, id: string) => void;
  id: string;
  hideCheckBox?: boolean;
  styleRow?: Object;
}

const RowModalCp = ({
  data,
  handleChecked,
  checked,
  hideCheckBox = false,
  id,
  styleRow,
}: RowTableProps) => {
  const sanitizeData = useMemo(
    () =>
      Object.entries(data).filter(
        ([key, value]) => key !== 'label' && key !== 'id' && key !== 'required',
      ),
    [data],
  );

  return (
    <tr style={styleRow || {}}>
      <td className={cx(styles.checkBox)}>
        {hideCheckBox ? (
          <div style={{ width: 26.5 }} />
        ) : (
          <CustomCheckbox
            value={id}
            checked={checked}
            onChange={(e) => {
              handleChecked(e.target.checked, id);
            }}
          />
        )}
      </td>
      {sanitizeData.map(([key, value]) => (
        <td key={key}>
          <div className="limit-line-text">
            <Tooltip
              placement="topLeft"
              destroyTooltipOnHide
              title={value}
              // color="#3B9FF3"
            >
              {value}
            </Tooltip>
          </div>
        </td>
      ))}
    </tr>
  );
};

export const RowModalComponent = memo(RowModalCp, isEqual);
