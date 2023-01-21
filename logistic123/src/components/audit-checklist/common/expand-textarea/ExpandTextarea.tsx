import { FC, useState } from 'react';
import images from 'assets/images/images';
import TextAreaForm, {
  CProps,
} from 'components/react-hook-form/text-area/TextAreaForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import { useWatch, useFormContext } from 'react-hook-form';
import ModalBase, { ModalType } from 'components/ui/modal/Modal';
import styles from 'components/react-hook-form/text-area/text-area.module.scss';
import TextAreaUI from 'components/ui/text-area/TextArea';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

type Props = Omit<CProps, 'extraButton' | 'control'> & {
  isMulti?: boolean;
  modalMinRows?: number;
  modalMaxRows?: number;
  modalClassName?: string;
  modalContentClassName?: string;
  dynamicLabels?: IDynamicLabel;
};

const ExpandTextAreaForm: FC<Props> = (props) => {
  const {
    name,
    isMulti,
    maxLength,
    modalContentClassName,
    modalClassName,
    autoFocus,
    disabled,
    dynamicLabels,
    ...other
  } = props;
  const [expandModal, setExpandModal] = useState<boolean>(false);
  const { setValue, control } = useFormContext();
  const formValue = useWatch({ control, name });

  const [modalValue, setModalValue] = useState<
    string | number | readonly string[]
  >('');

  const toggle = () => {
    setExpandModal(false);
    setModalValue(formValue);
  };

  return (
    <>
      <TextAreaForm
        disabled={disabled}
        control={control}
        name={name}
        onChange={(e) => {
          setModalValue(e.target.value);
        }}
        style={{ paddingRight: 22 }}
        maxLength={maxLength}
        autoFocus={autoFocus}
        {...other}
        extraButton={
          <button
            type="button"
            className={styles.extraBtn}
            onClick={() => {
              setModalValue(formValue);
              setExpandModal(true);
            }}
          >
            <img src={images.icons.icExpand} alt="expand" />
          </button>
        }
      />
      <ModalBase
        isOpen={expandModal}
        modalType={ModalType.X_LARGE}
        modalClassName={modalClassName}
        contentClassName={modalContentClassName}
        title={
          isMulti
            ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Questions)
            : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Question)
        }
        content={
          <div className={styles.TextAreaWrapper}>
            <TextAreaUI
              maxLength={maxLength}
              value={modalValue}
              disabled={disabled}
              className={styles.textAreaForm}
              autoSize={{
                minRows: other.modalMinRows || 3,
                maxRows: other.modalMaxRows || null,
              }}
              onChange={(e) => setModalValue(e.target.value)}
            />
            {!disabled ? (
              <GroupButton
                className="mt-4"
                handleCancel={toggle}
                handleSubmit={() => {
                  if (setValue) {
                    setValue(name, modalValue);
                  }
                  setExpandModal(false);
                }}
                txButtonLeft={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Cancel,
                )}
                txButtonRight={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Save,
                )}
              />
            ) : null}
          </div>
        }
        toggle={toggle}
      />
    </>
  );
};
export default ExpandTextAreaForm;
