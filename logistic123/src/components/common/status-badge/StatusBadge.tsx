import { FC } from 'react';
import cx from 'classnames';
import { compareStatus } from 'helpers/utils.helper';
import { colors } from './status.const';
import styles from './status-badge.module.scss';

interface Props {
  name: string;
  clearBadge?: boolean;
}

const StatusBadge: FC<Props> = ({ name, clearBadge }) => (
  <div
    className={cx(styles.wrap, {
      [styles.green]: colors.green?.some((i) => compareStatus(i, name)),
      [styles.blue]: colors.blue?.some((i) => compareStatus(i, name)),
      [styles.red]: colors.red?.some((i) => compareStatus(i, name)),
      [styles.orange]: colors.orange?.some((i) => compareStatus(i, name)),
      [styles.yellow]: colors.yellow?.some((i) => compareStatus(i, name)),
      [styles.clearBadge]: clearBadge,
    })}
  >
    {name}
  </div>
);

export default StatusBadge;
