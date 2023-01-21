import { FC, useState, ReactElement } from 'react';
import { Dropdown, DropdownToggle, Button, DropdownMenu } from 'reactstrap';
import images from 'assets/images/images';
import cx from 'classnames';

interface DataItem {
  label: (() => ReactElement) | ReactElement | string | number;
  value: string | number;
}

interface DropDownProp {
  data: DataItem[];
  title: (() => ReactElement) | ReactElement | string | number;
  size?: string;
  className?: string;
  classNameItem?: string;
  isClose?: boolean;
  onChange: (data: string | number) => void;
  disable?: boolean;
}

const DropDownExport: FC<DropDownProp> = (props) => {
  const {
    size,
    isClose = false,
    title,
    className,
    data,
    classNameItem,
    onChange,
    disable = false,
  } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        className={cx('dropdown-button', className)}
        size={size}
        disabled={disable}
      >
        <DropdownToggle>
          <div className={cx('d-flex align-items-center')}>
            <div className="title-export">{title || 'Export'}</div>
            <img src={images.icons.icDownload} alt="export" />
          </div>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu">
          {data.map((item) => (
            <Button
              key={item.value}
              disabled={item.value === 'pdf'}
              className={cx('w-200 text-start', classNameItem)}
              onClick={() => {
                onChange(item.value);
                if (isClose) {
                  setDropdownOpen(false);
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default DropDownExport;
