import cx from 'classnames';
import { DataObj, Action, RowLabel } from 'models/common.model';
import { memo } from 'react';
import isEqual from 'react-fast-compare';
import styles from 'components/common/table/table.module.scss';
import upperFirst from 'lodash/upperFirst';

export interface RowTableProps {
  data: DataObj;
  onClickRow?: () => void;
  noEdit?: boolean;
  rowLabels?: RowLabel[];
  actionList?: Action[];
  isScrollable?: boolean;
  feature?: string;
  subFeature?: string;
  action?: string;
}

const RowWithoutAction = ({
  data,
  onClickRow,
  isScrollable,
  actionList,
  noEdit,
  rowLabels,
  feature,
  subFeature,
  action,
}: RowTableProps) => (
  <>
    <tr className={styles.rowTitle} onClick={!noEdit ? onClickRow : undefined}>
      {actionList && (
        <td
          className={cx(styles.subAction, styles.headCol, {
            [styles.boxShadowAction]: isScrollable,
          })}
          style={{
            minWidth: rowLabels ? Number(rowLabels[0].width) : 140,
          }}
        >
          {/* <div className={cx('d-flex justify-content-start', styles.icAction)}>
            <ActionBuilder actionList={actionList} />
          </div> */}
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
                [styles.draft]: key === 'status' && value === 'Draft',
                [styles.submitted]: key === 'status' && value === 'Submitted',
                [styles.reviewed]: key === 'status' && value === 'Reviewed',
                [styles.approved]: key === 'status' && value === 'Approved',
                [styles.rejected]: key === 'status' && value === 'Rejected',
                [styles.cancelled]: key === 'status' && value === 'Cancelled',
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

RowWithoutAction.defaultProps = {
  isScrollable: undefined,
  actionList: undefined,
  noEdit: false,
};

export const RowComponentWithoutAction = memo(RowWithoutAction, isEqual);
