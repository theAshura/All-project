import { memo, useMemo } from 'react';
import cx from 'classnames';
import { DataObj } from 'models/common.model';
import isEqual from 'lodash/isEqual';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import styles from 'components/common/modal-list/row/row-modal-cp.module.scss';

export interface RowTableProps {
  data: DataObj;
  checked: boolean;
  handleChecked: (checked: boolean, id: string) => void;
  id: string;
}

const RowModalCp = ({ data, handleChecked, checked, id }: RowTableProps) => {
  const sanitizeData = useMemo(
    () =>
      Object.entries(data).filter(
        ([key, value]) => key !== 'label' && key !== 'id' && key !== 'required',
      ),
    [data],
  );
  return (
    <tr>
      <td className={cx(styles.checkBox)}>
        <CustomCheckbox
          value={id}
          checked={checked}
          onChange={(e) => {
            handleChecked(e.target.checked, id);
          }}
        />
      </td>
      {sanitizeData.map(([key, value]) => (
        <td key={key}>
          <span>{value}</span>
        </td>
      ))}
    </tr>
  );
};

export const RowModalComponent = memo(RowModalCp, isEqual);
