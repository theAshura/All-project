import { FC, HtmlHTMLAttributes, ReactNode } from 'react';
import cx from 'classnames';

interface Props {
  label: string | ReactNode;
  value: string | ReactNode;
  labelClassName?: string;
  valueClassName?: string;
}

const InfoField: FC<HtmlHTMLAttributes<HTMLDivElement> & Props> = ({
  className,
  label,
  value,
  labelClassName,
  valueClassName,
  ...other
}) => (
  <div className={cx('info__container', className)} {...other}>
    <div className={cx('info__label m-0', labelClassName)}>{label}</div>
    <div className={cx('m-0', valueClassName)}>{value}</div>
  </div>
);

export default InfoField;
