import { FC, useState, useMemo, useCallback } from 'react';
import { Modal, ModalProps } from 'reactstrap';
import debounce from 'lodash/debounce';
import cx from 'classnames';
import DetectEsc from 'components/common/modal/DetectEsc';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import Input from 'components/ui/input/Input';
import { MaxLength } from 'constants/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './modal-remark.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  classesName?: string;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  title?: string;
  content?: string;
  onConfirm: (remark: string) => void;
  dynamicLabels?: IDynamicLabel;
}

const ModalRemark: FC<ModalComponentProps> = ({
  isOpen,
  classesName,
  modalClassName,
  contentClassName,
  title,
  onClose,
  content,
  onConfirm,
  dynamicLabels,
  ...other
}) => {
  const [remark, setRemark] = useState('');
  const [messageRequired, setMessageRequire] = useState('');

  const isRequiredRemark = useMemo(() => {
    const titleRemark = String(title).toLocaleLowerCase();
    if (
      titleRemark === 'reassign' ||
      titleRemark === 'reject' ||
      titleRemark === 'rejected' ||
      titleRemark === 'reassigned' ||
      titleRemark === 'cancel' ||
      titleRemark === 'cancelled'
    ) {
      return true;
    }
    return false;
  }, [title]);

  const clearData = useCallback(() => {
    setTimeout(() => {
      setRemark('');
      setMessageRequire('');
    }, 300);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!remark && isRequiredRemark) {
      setMessageRequire('Remark is required.');
      return;
    }
    if (remark?.length < 2 && isRequiredRemark) {
      setMessageRequire('Remark must be longer than or equal to 2 characters.');
      return;
    }
    await onConfirm(remark);
    clearData();
  }, [remark, onConfirm, clearData, isRequiredRemark]);

  const handleSubmitDebounce = () =>
    debounce(() => {
      onSubmit();
    }, 300);

  const closeAndClearData = async () => {
    await onClose();
    clearData();
  };
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmitDebounce()();
    }
  };

  const replaceGrammar = (text) =>
    text
      ?.replace('reassigned', 're-assign')
      ?.replace('Reassigned', 'Re-assign')
      ?.replace('Reviewed', 'Review')
      ?.replace('reviewed', 'review')
      ?.replace('Rejected', 'Re-assign')
      ?.replace('rejected', 're-assign')
      ?.replace('Reject', 'Re-assign')
      ?.replace('reject', 're-assign')
      ?.replace('Approved', 'Approve')
      ?.replace('approved', 'approve')
      ?.replace('Closeout', 'Close out')
      ?.replace('closeout', 'close out')
      ?.replace('Accepted', 'Accept')
      ?.replace('Auditor_accept', 'Accept')
      ?.replace('accepted', 'accept');
  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>{replaceGrammar(title)}</div>
      <DetectEsc close={closeAndClearData} />
      <div className={styles.wrapContent}>
        <div className={styles.wrapInput}>
          <Input
            isRequired={isRequiredRemark}
            label={`${replaceGrammar(content)}`}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            onKeyDown={onEnter}
            className={styles.inputClassName}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Enter confirmation'],
            )}
            messageRequired={messageRequired}
            autoFocus
            maxLength={MaxLength.MAX_LENGTH_COMMENTS}
          />
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <Button
            buttonType={ButtonType.OutlineGray}
            buttonSize={ButtonSize.Medium}
            className={cx(styles.buttonCancel)}
            onClick={closeAndClearData}
            disabled={false}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonType={ButtonType.Primary}
            buttonSize={ButtonSize.Medium}
            className={cx(styles.buttonConfirm, 'mr-3')}
            onClick={handleSubmitDebounce()}
            disabled={false}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Confirm)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalRemark;
