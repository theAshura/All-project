import { FC, ReactNode, ReactElement, CSSProperties } from 'react';
import debounce from 'lodash/debounce';
import cx from 'classnames';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Button, { ButtonSize, ButtonType } from './Button';
import styles from './group-button.module.scss';

interface propsGroupButton {
  handleCancel?: () => void;
  handleSubmit?: () => void;
  handleSubmitAndNew?: () => void;
  txButtonLeft?: string;
  txButtonRight?: string;
  txButtonBetween?: string;
  hideBtnSave?: boolean;
  disable?: boolean;
  visibleSaveBtn?: boolean;
  className?: string;
  buttonTypeLeft?: ButtonType;
  buttonTypeRight?: ButtonType;
  cancelStyle?: CSSProperties;
  saveStyle?: CSSProperties;
  submitAndNewStyle?: CSSProperties;
  buttonTypeBetween?: ButtonType;
  children?: ReactNode;
  renderSuffixRight?: (() => ReactElement) | ReactElement;
  dynamicLabels?: IDynamicLabel;
}

export const GroupButton: FC<propsGroupButton> = (props) => {
  const {
    handleCancel,
    handleSubmit,
    handleSubmitAndNew,
    txButtonLeft,
    txButtonRight,
    txButtonBetween,
    disable = false,
    className,
    buttonTypeLeft,
    buttonTypeRight,
    cancelStyle,
    saveStyle,
    submitAndNewStyle,
    buttonTypeBetween,
    visibleSaveBtn = true,
    renderSuffixRight,
    hideBtnSave,
    dynamicLabels,
    children,
  } = props;

  const handleSubmitDebounce = (handleSubmitForm: () => void) =>
    debounce(() => {
      handleSubmitForm();
    }, 300);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cx(className, styles.footer)}
    >
      {handleCancel && (
        <Button
          buttonType={buttonTypeLeft || ButtonType.CancelOutline}
          buttonSize={ButtonSize.Medium}
          className={cx(styles.buttonCancel)}
          onClick={handleCancel}
          // disabled={disable}
          style={cancelStyle}
        >
          {txButtonLeft ||
            renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
        </Button>
      )}
      {handleSubmit && visibleSaveBtn && !hideBtnSave && (
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={buttonTypeBetween}
          className={cx(styles.buttonSave)}
          disabled={disable}
          style={saveStyle}
          disabledCss={disable}
          onClick={handleSubmitDebounce(handleSubmit)}
        >
          {txButtonBetween ||
            renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
        </Button>
      )}
      {children}
      {handleSubmitAndNew && (
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={buttonTypeRight}
          className={cx(styles.buttonSave)}
          renderSuffix={renderSuffixRight && <span>{renderSuffixRight}</span>}
          disabled={disable}
          disabledCss={disable}
          style={submitAndNewStyle}
          onClick={handleSubmitDebounce(handleSubmitAndNew)}
        >
          {txButtonRight ||
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Save & New'],
            )}
        </Button>
      )}
    </div>
  );
};
