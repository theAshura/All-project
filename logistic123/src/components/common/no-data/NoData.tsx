import { FC } from 'react';
import images from 'assets/images/images';
import cx from 'classnames';
import classes from './no-data.module.scss';

interface Props {
  className?: string;
}
const NoDataImg: FC<Props> = ({ className }) => (
  <div className={cx('text-center', className)}>
    <img src={images.icons.icNoData} className={classes.noData} alt="no data" />
  </div>
);
export default NoDataImg;
