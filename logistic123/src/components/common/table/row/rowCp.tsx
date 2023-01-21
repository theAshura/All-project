import Tooltip from 'antd/lib/tooltip';
import cx from 'classnames';
import styles from 'components/common/table/table.module.scss';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';

import { Action, DataObj, RowLabel } from 'models/common.model';
import { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import ActionBuilder from '../action-builder/ActionBuilder';

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
  stopPropagationKey?: string;
  validWordFlow?: boolean;
  tooltip?: boolean;
  classNameRow?: string;
  customCellRender?: (key?: any, value?: any, data?: any) => void;
}

const CUSTOM_CELLS = ['revokeRecall', 'carStatus', 'capStatus'];

export const statusColor = {
  blue_3: [
    'active',
    'open',
    'opened',
    'submitted',
    'new',
    'in-progress',
    'reviewed',
    'reviewed_1',
    'reviewed_2',
    'reviewed_3',
    'reviewed_4',
    'reviewed_5',
    'review',
    'review 1',
    'review 2',
    'review 3',
    'review 4',
    'review 5',
    'auditor accepted',
    'accepted',
    'activate',
    'vessel',
    'planned',
    'in progress',
  ],
  red_6: ['closeout', 'rejected', 'reassigned', 'closed', 'office'],
  orange_3: ['draft', 'yet to start', 'sign out', 'purge'],
  red_3: ['cancelled', 'inactive', 'de activate', 'close'],
  green_1: ['approved', 'close out', 'closeout', 'sign in'],
  green_2: ['planned successfully', 'completed', 'final'],
  yellow_2: ['pending'],
};

const RowCp = ({
  data,
  onClickRow,
  isScrollable,
  actionList,
  noEdit,
  rowLabels,
  stopPropagationKey,
  feature,
  subFeature,
  action,
  validWordFlow,
  tooltip,
  classNameRow,
  customCellRender,
}: RowTableProps) => {
  const renderContent = useCallback(
    (key, value, data) => {
      if (CUSTOM_CELLS?.some((i) => i === key)) {
        return value;
      }

      if (customCellRender) {
        return customCellRender(key, value, data);
      }

      return (
        <span
          className={cx({
            [styles.blue_3]:
              (key.includes('status') ||
                key.includes('auditEntity') ||
                key.includes('workflowStatus')) &&
              statusColor.blue_3.includes(lowerCase(value)),
            [styles.red_3]:
              key.includes('status') &&
              statusColor.red_3.includes(lowerCase(value)),
            [styles.orange_3]:
              key.includes('status') &&
              statusColor.orange_3.includes(lowerCase(value)),
            [styles.red_6]:
              (key.includes('status') ||
                key.includes('auditEntity') ||
                key.includes('workflowStatus')) &&
              statusColor.red_6.includes(lowerCase(value)),
            [styles.green_1]:
              (key.includes('status') || key.includes('workflowStatus')) &&
              statusColor.green_1.includes(lowerCase(value)),
            [styles.green_2]:
              key.includes('status') &&
              statusColor.green_2.includes(lowerCase(value)),
          })}
        >
          {key.includes('status') ? upperFirst(value) : value}
        </span>
      );
    },
    [customCellRender],
  );

  return (
    <>
      <tr className={cx(styles.rowTitle, classNameRow)}>
        {actionList && (
          <td
            className={cx(styles.subAction, styles.headCol, {
              [styles.boxShadowAction]: isScrollable,
            })}
            style={{
              minWidth:
                rowLabels && rowLabels.length
                  ? Number(rowLabels[0].width)
                  : 100,
              maxWidth:
                rowLabels && rowLabels.length
                  ? Number(rowLabels[0]?.maxWidth)
                  : undefined,
            }}
          >
            <div
              className={cx('d-flex justify-content-start', styles.subAction)}
            >
              <ActionBuilder
                actionList={actionList}
                validWordFlow={validWordFlow}
              />
            </div>
          </td>
        )}

        {Object.entries(data)
          .filter(([key]) => key !== 'id')
          .map(([key, value], index) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <td
              key={key}
              onClick={(e) => {
                if (key !== stopPropagationKey && !noEdit && onClickRow) {
                  onClickRow();
                }
              }}
              style={{
                minWidth:
                  // eslint-disable-next-line no-nested-ternary
                  rowLabels &&
                  rowLabels[index + 1] &&
                  rowLabels[index + 1].width
                    ? !Number.isNaN(Number(rowLabels[index + 1].width))
                      ? Number(rowLabels[index + 1].width)
                      : `${rowLabels[index + 1].width}`
                    : undefined,

                maxWidth:
                  // eslint-disable-next-line no-nested-ternary
                  rowLabels &&
                  rowLabels[index + 1] &&
                  rowLabels[index + 1].maxWidth
                    ? !Number.isNaN(Number(rowLabels[index + 1].maxWidth))
                      ? Number(rowLabels[index + 1].maxWidth)
                      : `${rowLabels[index + 1].maxWidth}`
                    : undefined,
              }}
            >
              {tooltip ? (
                <Tooltip placement="topLeft" title={value} color="#3B9FF3">
                  {renderContent(key, value, data)}
                </Tooltip>
              ) : (
                renderContent(key, value, data)
              )}
            </td>
          ))}
      </tr>
    </>
  );
};

RowCp.defaultProps = {
  isScrollable: undefined,
  actionList: undefined,
  noEdit: false,
};

export const RowComponent = memo(RowCp, isEqual);
