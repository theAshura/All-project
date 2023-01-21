import { FC, useState } from 'react';
import {
  Dropdown as BTDropdown,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { v4 } from 'uuid';
import images from 'assets/images/images';

export interface ExtensionOption {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface Props {
  extensionOptions: ExtensionOption[];
}

const BTDropdownSingle: FC<Props> = ({ extensionOptions }) => {
  const [open, setOpen] = useState(false);
  const renderAction = (data: ExtensionOption) => (
    <div
      className="action"
      onClick={() => {
        data.onClick();
        setOpen((p) => !p);
      }}
      key={v4()}
    >
      <img src={data.icon} alt="icon" />
      <div>{data.label}</div>
    </div>
  );
  return (
    <BTDropdown
      isOpen={open}
      toggle={(e) => {
        setOpen((p) => !p);
        e.stopPropagation();
      }}
    >
      <DropdownToggle className="dropdown-toggle-action">
        <img src={images.icons.table.icGrid3x3} alt="icon" />
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-action">
        <div className="actions d-flex flex-wrap">
          {extensionOptions.map((item) => renderAction(item))}
        </div>
      </DropdownMenu>
    </BTDropdown>
  );
};

export default BTDropdownSingle;
