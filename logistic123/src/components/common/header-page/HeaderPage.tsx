import { FC, HtmlHTMLAttributes } from 'react';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';

interface HeaderPageProps {
  breadCrumb: string;
  titlePage: string;
}

const HeaderPage: FC<HeaderPageProps & HtmlHTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  breadCrumb,
  titlePage,
  ...other
}) => (
  <div className={cx('header-page', className)} {...other}>
    <div className={cx('d-flex justify-content-between headers')}>
      <div>
        <BreadCrumb current={breadCrumb} />
        <div className={cx('fw-bold title')}>{titlePage}</div>
      </div>
      {children}
    </div>
  </div>
);

export default HeaderPage;
