import { FC, ReactNode, useMemo } from 'react';
import { Modal, ModalProps } from 'reactstrap';
import cx from 'classnames';
import images from 'assets/images/images';
import DetectEsc from 'components/common/modal/DetectEsc';
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
  title?: any;
  hiddenHeader?: boolean;
  bodyClassName?: string;
  content: string | ReactNode;
  footer?: string | ReactNode;
  headerDouble?: string | ReactNode;
  hiddenFooter?: boolean;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
  modalType?: typeof ModalType[keyof typeof ModalType];
  headerSubPart?: string | ReactNode;
  titleClasseName?: string;
  refId?: string;
  hideClose?: boolean;
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
  headerDouble,
  modalType = ModalType.NORMAL,
  modalClassName,
  className,
  contentClassName,
  headerSubPart,
  titleClasseName,
  refId,
  hideClose,
  ...other
}) => {
  const cachedClassName = useMemo(
    () => ({
      [styles.modalWrapCenter]: modalType === ModalType.CENTER,
      [styles.modalWrap]: modalType === ModalType.NORMAL,
      [styles.modalWrapLarge]: modalType === ModalType.LARGE,
      [styles.modalWrapXLarge]: modalType === ModalType.X_LARGE,
      [styles.modalWrapSmall]: modalType === ModalType.SMALL,
    }),
    [modalType],
  );

  const cachedContentClassName = useMemo(
    () => ({
      [styles.typeCenter]: modalType === ModalType.CENTER,
      [styles.content]: modalType === ModalType.NORMAL,
      [styles.contentLarge]: modalType === ModalType.LARGE,
      [styles.contentXLarge]: modalType === ModalType.X_LARGE,
      [styles.contentSmall]: modalType === ModalType.SMALL,
    }),
    [modalType],
  );

  const style = useMemo(
    () => ({
      width: w || 800,
      height: h || modalType === ModalType.NORMAL ? 'auto' : '100%',
    }),
    [h, modalType, w],
  );

  const modalHeader = useMemo(() => {
    if (hiddenHeader) {
      return null;
    }

    let rightPart = null;
    if (headerSubPart) {
      rightPart = (
        <div className="d-flex align-items-center">
          {headerSubPart}
          {!hideClose && (
            <div className={styles.icClose} onClick={toggle}>
              <img src={images.icons.icClose} alt="ic-close-modal" />
            </div>
          )}
        </div>
      );
    } else {
      rightPart = (
        <>
          {!hideClose && (
            <div className={styles.icClose} onClick={toggle}>
              {refId && <div className={styles.refId}>Ref.ID: {refId}</div>}
              <img src={images.icons.icClose} alt="ic-close-modal" />
            </div>
          )}
        </>
      );
    }

    return (
      <div className={styles.header}>
        {headerDouble || <span className={titleClasseName}>{title}</span>}
        {rightPart}
      </div>
    );
  }, [
    headerDouble,
    headerSubPart,
    hiddenHeader,
    hideClose,
    refId,
    title,
    titleClasseName,
    toggle,
  ]);

  const modalFooter = useMemo(() => {
    if (hiddenFooter) {
      return null;
    }
    return <div className={styles.footer}>{footer}</div>;
  }, [footer, hiddenFooter]);

  return (
    <Modal
      className={cx(cachedClassName, className, styles.customZIndex)}
      modalClassName={cx(styles.wrapper, modalClassName)}
      contentClassName={cx(cachedContentClassName, contentClassName)}
      isOpen={isOpen}
      style={style}
      {...other}
    >
      {modalHeader}
      {!hideClose && <DetectEsc close={toggle} />}
      <div className={cx(styles.body, bodyClassName)}>{content}</div>
      {modalFooter}
    </Modal>
  );
};

export default ModalComponent;
