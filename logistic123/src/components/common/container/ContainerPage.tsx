import { FC, HtmlHTMLAttributes } from 'react';
import cx from 'classnames';

const Container: FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...other
}) => (
  <div className={cx('container-web', className)} {...other}>
    {children}
  </div>
);

export default Container;
