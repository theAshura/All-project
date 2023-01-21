import { FC, useMemo } from 'react';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import debounce from 'lodash/debounce';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Modal } from 'reactstrap';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './modal-confirm.module.scss';

interface ModalConfirmProps {
  modal: boolean;
  toggle: () => void;
  handleSubmit: () => void;
  disable?: boolean;
  title?: string;
  content?: string;
  isDelete?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalConfirm: FC<ModalConfirmProps> = (props) => {
  const {
    toggle,
    modal,
    handleSubmit,
    disable,
    title,
    content,
    isDelete = false,
    dynamicLabels,
  } = props;
  const debounce_fun = useMemo(
    () =>
      debounce(() => {
        handleSubmit();
      }, 300),
    [handleSubmit],
  );

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      fade={false}
    >
      <div className={cx(styles.container)}>
        <div className={cx(styles.title)}>{title}</div>
        <div className={cx(styles.question)}>{content}</div>
        <div className="d-flex">
          <Button
            className={cx('w-100', styles.btnCancel)}
            buttonType={ButtonType.Cancel}
            onClick={() => toggle()}
            disabled={disable}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            onClick={(e) => debounce_fun()}
            buttonType={isDelete ? ButtonType.Orange : ButtonType.Primary}
            className={cx('w-100', styles.btnDelete)}
            disabled={disable}
          >
            {isDelete
              ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Delete)
              : renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Confirm,
                )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
