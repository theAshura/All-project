/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, ReactElement } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import images from 'assets/images/images';
import styles from './modal.module.scss';

interface ModalGenericLayoutProps {
  isOpen: boolean;
  toggle: () => void;
  children: ReactElement | ReactElement[];
  bodyClassName?: string;
  header?: string;
  footer?: string;
}

const ModalComponent: FC<ModalGenericLayoutProps> = (props) => {
  const { isOpen, toggle, header, children, bodyClassName } = props;

  const closeBtn = (
    <button className={styles.icCloseCustom} onClick={toggle}>
      <img src={images.icons.icClose} alt="ic-close-modal" />
    </button>
  );

  return (
    <Modal
      className={styles.modalWrap}
      modalClassName={styles.wrapper}
      contentClassName={styles.content}
      isOpen={isOpen}
      toggle={toggle}
    >
      <ModalHeader className={styles.header} toggle={toggle} close={closeBtn}>
        {header}
      </ModalHeader>
      <ModalBody className={bodyClassName}>{children}</ModalBody>
    </Modal>
  );
};

export default ModalComponent;
