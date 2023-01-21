import cx from 'classnames';
import { DataObj, Action } from 'models/common.model';
import { memo } from 'react';
import isEqual from 'react-fast-compare';
import styles from 'components/common/table/table.module.scss';
import upperFirst from 'lodash/upperFirst';
import ActionBuilder from '../action-builder/ActionBuilder';

export interface RowTableProps {
  data: DataObj;
  editDetail: () => void;
  noEdit?: boolean;
  actionList?: Action[];
  isScrollable?: boolean;
  feature?: string;
  subFeature?: string;
  action?: string;
}

const RowCp = ({
  data,
  editDetail,
  isScrollable,
  actionList,
  noEdit,
}: RowTableProps) => (
  <>
    <tr className={styles.rowTitle} onClick={!noEdit ? editDetail : undefined}>
      {actionList && (
        <td
          className={cx(styles.subAction, styles.headCol, {
            [styles.boxShadowAction]: isScrollable,
          })}
        >
          <div className={cx('d-flex justify-content-start', styles.icAction)}>
            <ActionBuilder actionList={actionList} />
          </div>
        </td>
      )}

      {Object.entries(data)
        .filter(([key, value]) => key !== 'id')
        .map(([key, value]) => (
          <td key={key}>
            <span
              className={cx({
                [styles.active]: key === 'status' && value === 'active',
                [styles.inActive]: key === 'status' && value === 'inactive',
              })}
            >
              {key === 'status' || key === 'inactive'
                ? upperFirst(value)
                : value}
            </span>
          </td>
        ))}
    </tr>
  </>
);

RowCp.defaultProps = {
  isScrollable: undefined,
  actionList: undefined,
  noEdit: false,
};

export const RowComponent = memo(RowCp, isEqual);
