import { FC, ReactElement, useState } from 'react';
import {
  Dropdown as BTDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import cx from 'classnames';
import './dropdown.scss';

export interface MenuOption {
  label: string;
  icon?: ReactElement;
  onClick: () => void;
  type?: 'normal' | 'danger';
}

interface Props {
  menuOptions: MenuOption[];
}

const Dropdown: FC<Props> = ({ menuOptions, children }) => {
  const [open, setOpen] = useState(false);
  const renderButtons = () =>
    menuOptions.map(({ onClick, type = 'normal', icon, label }) => (
      <DropdownItem
        key={label}
        onClick={(e) => {
          onClick();
          e.stopPropagation();
        }}
        className={cx('dropdown-item-custom', {
          'dropdown-normal': type === 'normal',
          'dropdown-danger': type === 'danger',
        })}
      >
        {icon && <div>{icon}</div>}
        <span>{label}</span>
      </DropdownItem>
    ));
  return (
    <BTDropdown
      isOpen={open}
      toggle={(e) => {
        setOpen((p) => !p);
        e.stopPropagation();
      }}
    >
      <DropdownToggle className="dropdown-toggle-custom">
        {children}
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-custom">
        {renderButtons()}
      </DropdownMenu>
    </BTDropdown>
  );
};

export default Dropdown;
