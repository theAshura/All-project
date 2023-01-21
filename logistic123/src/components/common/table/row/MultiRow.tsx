import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { DataObj, Action } from 'models/common.model';
import { memo } from 'react';
import isEqual from 'react-fast-compare';
import styles from 'components/common/table/table.module.scss';
import upperFirst from 'lodash/upperFirst';
import ActionBuilder from '../action-builder/ActionBuilder';

export interface MultiRowProps {
  data: DataObj;
  editDetail: () => void;
  noEdit?: boolean;
  actionList?: Action[];
  isScrollable?: boolean;
  feature?: string;
  subFeature?: string;
  action?: string;
  actionsCollapse?: () => void;
}

const MultiRow = ({
  data,
  editDetail,
  isScrollable,
  actionList,
  noEdit,
  feature,
  subFeature,
  action,
  actionsCollapse,
}: MultiRowProps) =>
  data?.actionsMultiRow?.isShow ? (
    <>
      <tr
        className={styles.rowTitle}
        onClick={!noEdit ? editDetail : undefined}
      >
        {actionList && (
          <td
            className={cx(styles.subAction, styles.headCol, {
              [styles.boxShadowAction]: isScrollable,
            })}
          >
            <div
              className={cx('d-flex justify-content-start', styles.icAction)}
            >
              <ActionBuilder actionList={actionList} />
            </div>
          </td>
        )}

        {Object.entries(data)
          .filter(([key, value]) => key !== 'id')
          .map(([key, value], index) =>
            key === 'actionsMultiRow' ? (
              <></>
            ) : (
              <td key={key}>
                <div className="d-flex">
                  <span
                    className={cx({
                      'w-50': index === 0 && !data?.actionsMultiRow?.isEnd,
                      'ps-2':
                        index === 0 &&
                        data?.actionsMultiRow.parents?.length === 1,
                      'ps-4':
                        index === 0 &&
                        data?.actionsMultiRow.parents?.length === 2,
                      [styles.active]: key === 'status' && value === 'active',
                      [styles.inActive]:
                        key === 'status' && value === 'inactive',
                    })}
                  >
                    {data?.actionsMultiRow.parents?.length > 0 &&
                      index === 0 &&
                      `+ `}
                    {key === 'status' || key === 'inactive'
                      ? upperFirst(value)
                      : value}
                  </span>

                  {index === 0 && !data?.actionsMultiRow?.isEnd && (
                    <Button
                      className="bg-white"
                      buttonSize={ButtonSize.IconSmallAction}
                      buttonType={ButtonType.Cancel}
                      onClick={(e) => {
                        actionsCollapse();
                        e.stopPropagation();
                      }}
                    >
                      <img
                        src={
                          data?.actionsMultiRow?.showIcon
                            ? images.icons.icArrowChevronUp
                            : images.icons.icArrowChevronDown
                        }
                        alt="edit"
                        className={styles.icImg}
                      />
                    </Button>
                  )}
                </div>
              </td>
            ),
          )}
      </tr>
    </>
  ) : (
    <></>
  );

MultiRow.defaultProps = {
  isScrollable: undefined,
  actionList: undefined,
  noEdit: false,
};

export const MultiRowComponent = memo(MultiRow, isEqual);
