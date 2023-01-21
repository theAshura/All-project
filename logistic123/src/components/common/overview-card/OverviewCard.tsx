import cx from 'classnames';
import { FC, ReactNode } from 'react';
import styles from './overview-card.module.scss';

interface Props {
  title: string | ReactNode;
  content: string | number | ReactNode;
  className?: string;
  titleClassName?: string;
  color: string;
  hasBorder?: boolean;
  size?: string | number;
}

export const OverviewCard: FC<Props> = ({
  title,
  content,
  className,
  color,
  hasBorder,
  size,
  titleClassName,
}) => (
  <div
    className={cx(styles.container, { [styles.border]: hasBorder }, className)}
  >
    <div className={cx(styles.title, titleClassName)}>{title}</div>
    <div className={styles.content} style={{ color, fontSize: size }}>
      {content}
    </div>
  </div>
);
