import { FC, HtmlHTMLAttributes } from 'react';
import cx from 'classnames';
import styles from './card.module.scss';

const Card: FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...other
}) => (
  <div className={cx(styles.card, className)} {...other}>
    {children}
  </div>
);

export default Card;
