import { FC, useState } from 'react';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import { Modal } from 'reactstrap';
import Input from 'components/ui/input/Input';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import styles from './modal-export.module.scss';

interface ModalExportProps {
  modal: boolean;
  toggle: () => void;
  handleSubmit: (fromPage?: string, toPage?: string) => void;
  disable?: boolean;
  title?: string;
  totalPage?: number;
}

const ModalExport: FC<ModalExportProps> = (props) => {
  const { toggle, modal, handleSubmit, disable, title, totalPage } = props;
  const [fromPage, setFromPage] = useState<string>('');
  const [toPage, setToPage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation(I18nNamespace.USER);

  // function
  const handleChange = (key: string, value: string) => {
    switch (key) {
      case 'fromPage':
        setFromPage(value);
        break;
      case 'toPage':
        setToPage(value);
        break;
      default:
        break;
    }
  };

  const handleModalSubmit = () => {
    if (fromPage > totalPage?.toString() || toPage > totalPage?.toString()) {
      setError(t('errorOverPage'));
    } else if (toPage < fromPage) {
      if (toPage) {
        setError(t('errorToPage'));
      } else {
        handleSubmit(fromPage, totalPage?.toString());
        setFromPage('');
        setToPage('');
        setError('');
      }
    } else {
      handleSubmit(fromPage, toPage);
      setFromPage('');
      setToPage('');
      setError('');
    }
  };

  // render
  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggle();
        setFromPage('');
        setToPage('');
        setError('');
      }}
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      fade={false}
    >
      <div className={cx(styles.container)}>
        <div className={cx('d-flex', styles.headerModalExport)}>
          <div className={cx(styles.title)}>{title}</div>
          <button
            onClick={() => {
              handleSubmit('', '');
              setFromPage('');
              setToPage('');
            }}
          >
            <div className={cx(styles.titleRightExport)}>Export All</div>
          </button>
        </div>
        <div className={cx(styles.form)}>
          <Input
            label="From Page"
            styleLabel={cx(styles.label)}
            className={styles.inputFromPage}
            onChange={(e) => handleChange('fromPage', e.target.value)}
            value={fromPage}
            disabled={disable}
            maxLength={128}
            placeholder="Enter Page"
            pattern="[0-9]*"
          />
          <Input
            label="To Page"
            styleLabel={cx(styles.label, styles.mt1)}
            className={styles.inputToPage}
            onChange={(e) => handleChange('toPage', e.target.value)}
            value={toPage}
            disabled={disable}
            maxLength={128}
            placeholder="Enter Page"
            pattern="[0-9]*"
          />
          <div className={cx(styles.textError)}>{error}</div>
        </div>
        <div className={cx('d-flex', styles.btnGroup)}>
          <Button
            className={cx('w-100', styles.btnCancel)}
            buttonType={ButtonType.PrimaryLight}
            onClick={() => {
              toggle();
              setFromPage('');
              setToPage('');
              setError('');
            }}
            disabled={disable}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleModalSubmit();
            }}
            buttonType={ButtonType.Primary}
            className={cx('w-100', styles.btnDelete)}
            disabled={disable}
          >
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalExport;
