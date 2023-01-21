import { FC, useMemo } from 'react';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import debounce from 'lodash/debounce';
import { Modal } from 'reactstrap';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
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
  hideCancel?: boolean;
  cancelTxt?: string;
  rightTxt?: string;
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
    hideCancel,
    isDelete = false,
    dynamicLabels,
    cancelTxt,
    rightTxt,
  } = props;
  const debounce_fun = useMemo(
    () =>
      debounce(() => {
        handleSubmit();
      }, 300),
    [handleSubmit],
  );

  const renderRightText = useMemo(() => {
    if (rightTxt) {
      return rightTxt;
    }

    return isDelete
      ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Delete)
      : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Confirm);
  }, [dynamicLabels, isDelete, rightTxt]);

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
        <div className="d-flex justify-content-end">
          {!hideCancel && (
            <Button
              className={cx('w-100', styles.btnCancel)}
              buttonType={ButtonType.CancelOutline}
              onClick={() => toggle()}
              disabled={disable}
            >
              {cancelTxt ||
                renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
            </Button>
          )}
          <Button
            onClick={() => debounce_fun()}
            buttonType={isDelete ? ButtonType.Orange : ButtonType.Primary}
            className={cx('w-100', styles.btnDelete)}
            disabled={disable}
          >
            {renderRightText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
