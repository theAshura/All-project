import cx from 'classnames';
import SelectUI from 'components/ui/select/Select';

interface IProps {
  options: any[];
  className?: string;
}

const InlineDropdown = ({ options, className }: IProps) => (
  <SelectUI
    labelSelect="&nbsp;"
    data={options}
    className={cx('w-100', className)}
  />
);

export default InlineDropdown;
