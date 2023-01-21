import { FC, ReactNode } from 'react';
import { Modal, ModalProps } from 'reactstrap';
import cx from 'classnames';
import images from 'assets/images/images';
import styles from './modal.module.scss';

export enum ModalType {
  CENTER = 'center',
  NORMAL = 'normal',
  LARGE = 'large',
  X_LARGE = 'x-large',
  SMALL = 'small',
}

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  title?: string;
  hiddenHeader?: boolean;
  bodyClassName?: string;
  content: string | ReactNode;
  footer?: string | ReactNode;
  hiddenFooter?: boolean;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
  modalType?: typeof ModalType[keyof typeof ModalType];
}

const ModalComponent: FC<ModalComponentProps> = ({
  isOpen,
  toggle,
  title,
  hiddenHeader,
  bodyClassName,
  hiddenFooter,
  content,
  footer,
  w,
  h,
  modalType = ModalType.NORMAL,
  ...other
}) => (
  <Modal
    className={cx({
      [styles.modalWrapCenter]: modalType === ModalType.CENTER,
      [styles.modalWrap]: modalType === ModalType.NORMAL,
      [styles.modalWrapLarge]: modalType === ModalType.LARGE,
      [styles.modalWrapXLarge]: modalType === ModalType.X_LARGE,
      [styles.modalWrapSmall]: modalType === ModalType.SMALL,
    })}
    modalClassName={cx(styles.wrapper)}
    contentClassName={cx({
      [styles.typeCenter]: modalType === ModalType.CENTER,
      [styles.content]: modalType === ModalType.NORMAL,
      [styles.contentLarge]: modalType === ModalType.LARGE,
      [styles.contentXLarge]: modalType === ModalType.X_LARGE,
      [styles.contentSmall]: modalType === ModalType.SMALL,
    })}
    isOpen={isOpen}
    style={{
      width: w || 560,
      height: h || modalType === ModalType.NORMAL ? 'auto' : '100%',
    }}
    {...other}
  >
    {!hiddenHeader && (
      <div className={styles.header}>
        <span>{title}</span>
        <div className={styles.icClose} onClick={toggle}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
    )}

    <div className={cx(styles.body, bodyClassName)}>{content}</div>
    {hiddenFooter ? null : <div className={styles.footer}>{footer}</div>}
  </Modal>
);

export default ModalComponent;
