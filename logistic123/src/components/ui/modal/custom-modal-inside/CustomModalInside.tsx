import { FC, ReactElement } from 'react';
import cx from 'classnames';
import images from 'assets/images/images';
import styles from './custom-modal-inside.module.scss';

interface ModalGenericLayoutProps {
  isOpen?: boolean;
  title?: string;
  toggle?: () => void;
  content?: ReactElement;
  footer?: ReactElement;
  modalClassName?: string;
  contentClassName?: string;
  w?: string;
}

const CustomModalInside: FC<ModalGenericLayoutProps> = ({
  title,
  isOpen,
  toggle,
  content,
  footer,
  modalClassName,
  contentClassName,
  w,
}) => (
  <div>
    <div
      className={cx(styles.customModal, styles.fade, {
        [styles.isOpen]: isOpen,
      })}
    >
      <div
        className={cx(styles.wrapModal, modalClassName)}
        style={w && { width: w }}
      >
        <div className={styles.customHeader}>
          <span>{title}</span>
          <div className={styles.icClose} onClick={toggle}>
            <img src={images.icons.icClose} alt="ic-close-modal" />
          </div>
        </div>
        <div className={styles.modalContent}>{content}</div>
        <div className={styles.modalFooter}>{footer}</div>
      </div>
    </div>
    {isOpen && <div className={styles.modalBackdrop} />}
  </div>
);

export default CustomModalInside;
