import {
  createRef,
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import Button, { ButtonType } from 'components/ui/button/Button';
import { Modal } from 'reactstrap';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import styles from './confirm-base.module.scss';

type DataShowModalConfirm = {
  txTitle?: string;
  txMsg?: string;
  txButtonLeft?: string;
  txButtonRight?: string;
  onPressButtonLeft?: () => void;
  onPressButtonRight?: (value?: any) => void;
  isDelete?: boolean;
  disable?: boolean;
  content?: string | ReactNode;
  isCustom?: boolean;
};

const ConfirmBaseComponent = forwardRef((_, ref) => {
  // state
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [titleTx, setTitleTx] = useState<string>('');
  const [msgTx, setMsgTx] = useState<string>('');
  const [txButtonLeft, setTxButtonLeft] = useState<string>('');
  const [txButtonRight, setTxButtonRight] = useState<string>('');
  const [isDelete, setIsDelete] = useState(true);
  const [disable, setDisable] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const refFunctionLeft = useRef<() => void | null>(null);
  const refFunctionRight = useRef<() => void | null>(null);
  const [content, setContent] = useState<string | ReactNode>(null);
  const { t } = useTranslation(I18nNamespace.COMMON);

  // function
  const onPressLeft = useCallback(() => {
    setIsVisible(false);

    if (refFunctionLeft.current) {
      refFunctionLeft.current();
      refFunctionLeft.current = null;
    }
  }, []);

  const onPressRight = useCallback(() => {
    if (!isCustom) {
      setIsVisible(false);
    }
    if (refFunctionRight.current) {
      refFunctionRight.current();
      refFunctionRight.current = null;
    }
  }, [isCustom]);

  const debounce_fun = useMemo(
    () =>
      debounce(() => {
        onPressRight();
      }, 300),
    [onPressRight],
  );

  const onModalHide = useCallback(() => {
    setTitleTx('');
    setMsgTx('');
    setTxButtonLeft('');
    setTxButtonRight('');
  }, []);

  const onRequestClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // effect
  useImperativeHandle(
    ref,
    () => ({
      showConfirmBase: ({
        txMsg = '',
        txTitle = '',
        txButtonLeft,
        txButtonRight,
        onPressButtonLeft,
        onPressButtonRight,
        isDelete,
        disable,
        content,
        isCustom = false,
      }: DataShowModalConfirm) => {
        setIsVisible(true);
        setTitleTx(txTitle);
        setMsgTx(txMsg);
        setTxButtonLeft(txButtonLeft);
        setTxButtonRight(txButtonRight);
        refFunctionRight.current = onPressButtonRight;
        refFunctionLeft.current = onPressButtonLeft;
        setIsDelete(isDelete);
        setDisable(disable);
        setContent(content);
        setIsCustom(isCustom);
      },
      hideConfirmBase: () => {
        setIsVisible(false);
        onModalHide();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // render
  return (
    <Modal
      isOpen={isVisible}
      toggle={onRequestClose}
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      fade={false}
    >
      <div className={cx(styles.container)}>
        <div className={cx(styles.title)}>{titleTx}</div>
        <div className={cx(styles.question)}>{msgTx}</div>
        <div className={styles.body}>{content}</div>
        <div className="d-flex pt-1 justify-content-end">
          <Button
            className={cx('w-100', styles.btnCancel)}
            buttonType={ButtonType.CancelOutline}
            onClick={onPressLeft}
            disabled={disable}
          >
            {txButtonLeft || t('buttons.cancel')}
          </Button>
          <Button
            onClick={() => debounce_fun()}
            buttonType={isDelete ? ButtonType.Orange : ButtonType.Primary}
            className={cx('w-100', styles.btnDelete)}
            disabled={disable}
          >
            {txButtonRight ||
              (isDelete ? t('buttons.delete') : t('buttons.confirm'))}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

const ConfirmBase = memo(ConfirmBaseComponent, isEqual);
type ConfirmBaseRef = {
  showConfirmBase: (data: DataShowModalConfirm) => void;
  hideConfirmBase: () => void;
};
const ModalConfirmBaseHolder = createRef<ConfirmBaseRef>();

export const showConfirmBase = (data: DataShowModalConfirm) => {
  ModalConfirmBaseHolder.current?.showConfirmBase(data);
};
export const hideConfirmBase = () => {
  ModalConfirmBaseHolder.current?.hideConfirmBase();
};

export const ModalConfirmBase = () => (
  <ConfirmBase ref={ModalConfirmBaseHolder} />
);
