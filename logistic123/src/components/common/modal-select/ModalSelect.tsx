import { FC, ReactElement } from 'react';
import cx from 'classnames';
import { DataObj } from 'models/common.model';
import { Modal } from 'reactstrap';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import ListOption, { ListSelectProps } from './select/ListOption';
import styles from './modal-select.module.scss';

interface ModalProps {
  isOpen: boolean;
  toggle: () => void;
  data?: DataObj;
  onSubmit?: (data) => void;
  disable?: boolean;
  title?: string;
  content?: string;
  maxWidth?: string;
  dynamicLabels?: IDynamicLabel;
}
export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}
const ModalSelect: FC<ModalProps & ListSelectProps> = (props) => {
  const {
    toggle,
    isOpen = true,
    onSubmit,
    data,
    disable,
    maxWidth,
    ...other
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      style={{
        maxWidth: maxWidth || '450px',
        width: '100%',
        minHeight: '100vh',
        margin: '0 auto',
        position: 'relative',
      }}
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      fade={false}
    >
      <div className={cx(styles.container)}>
        <ListOption {...other} />
      </div>
    </Modal>
  );
};

export default ModalSelect;
