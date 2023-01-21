import { FC } from 'react';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import { Modal } from 'reactstrap';
import styles from './modal.module.scss';

interface ModalErrorProps {
  modal: boolean;
  toggle: () => void;
  disable?: boolean;
  title?: string;
  content?: string;
  isDelete?: boolean;
}

const ModalError: FC<ModalErrorProps> = (props) => {
  const { toggle, modal, disable, title, content } = props;

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      modalClassName={cx(styles.modalErrorWrapper)}
      contentClassName={cx(styles.content)}
      fade={false}
    >
      <div className={cx(styles.container)}>
        <div className={cx(styles.title)}>{title}</div>
        <div className={cx(styles.question)}>{content}</div>
        <div className="d-flex">
          <Button
            className={cx('w-100', styles.btnCancel)}
            buttonType={ButtonType.Orange}
            onClick={() => toggle()}
            disabled={disable}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalError;
