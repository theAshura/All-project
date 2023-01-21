import { FC, HtmlHTMLAttributes } from 'react';
import cx from 'classnames';

const StickyHeaderWrapper: FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...other
}) => (
  <div className={cx('sticky__header__wrapper', className)} {...other}>
    {children}
  </div>
);

export default StickyHeaderWrapper;
