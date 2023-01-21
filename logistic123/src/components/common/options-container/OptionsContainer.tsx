import { useCallback, useMemo } from 'react';
import cx from 'classnames';
import { v4 } from 'uuid';
import images from 'assets/images/images';
import { useWatch, Control } from 'react-hook-form';
import { AnswerOptionModel } from 'components/audit-checklist/forms/AuditCheckListQuestionListForm';
import Input, { InputType } from 'components/ui/input/Input';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

export enum OptionsType {
  YES_NO = 'Yes/No',
  YES_NO_NA = 'Yes/No/NA',
  RADIO = 'Radio list',
  COMBO = 'Combo list',
}

export interface OptionsProps {
  control?: Control;
  data?: (AnswerOptionModel & { hasRemark?: boolean })[];
  className?: string;
  handleSetOptions: (
    options: (AnswerOptionModel & { hasRemark?: boolean })[],
  ) => void;
  messageError?: string;
  disabled?: boolean;
  focus?: boolean;
  dynamicLabels?: IDynamicLabel;
}

export default function OptionsContainer(props: OptionsProps) {
  const {
    data,
    className,
    handleSetOptions,
    messageError,
    control,
    disabled,
    focus,
  } = props;
  const optionType = useWatch({ control, name: 'type' });

  const handleWriteQuestion = useCallback(
    (value: string, id: string) => {
      const list = [...data];
      const optionIndex = list.findIndex((i) => i.id === id);
      if (optionIndex > -1) {
        list[optionIndex].value = value;
        handleSetOptions(list);
      }
    },
    [data, handleSetOptions],
  );

  const handleAddOption = useCallback(() => {
    // list.push(`Option ${data.length + 1}`);
    handleSetOptions([...data, { id: v4(), value: '', hasRemark: false }]);
  }, [data, handleSetOptions]);

  const handleDelete = useCallback(
    (id) => {
      const list = [...data];
      const optionIndex = list.findIndex((i) => i.id === id);
      if (optionIndex > -1) {
        list.splice(optionIndex, 1);
        handleSetOptions(list);
      }
    },
    [data, handleSetOptions],
  );

  const focusIndex = useMemo(
    () => data?.findIndex((item) => !item?.value),
    [data],
  );

  const renderOption = useCallback(
    (option: AnswerOptionModel, index: number) => (
      <div key={option.id} className="option my-2 d-flex align-items-end">
        <img
          src={
            optionType === OptionsType.COMBO
              ? images.icons.icCheckBox
              : images.icons.icRadio
          }
          className="img-label"
          alt="select"
        />
        <Input
          readOnly={disabled}
          disabledCss={disabled}
          value={option.value}
          placeholder={`Option ${index + 1}`}
          inputType={InputType.LINE}
          autoFocus={focus && index === focusIndex}
          className="input"
          maxLength={128}
          onChange={(e) => handleWriteQuestion(e.target.value, option.id)}
        />
        {!disabled && (
          <Button
            buttonSize={ButtonSize.IconSmallAction}
            buttonType={ButtonType.CancelOutline}
            onClick={(e) => {
              handleDelete(option.id);
              e.stopPropagation();
            }}
          >
            <img src={images.icons.icGrayX} alt="edit" />
          </Button>
        )}
      </div>
    ),
    [
      optionType,
      disabled,
      focus,
      focusIndex,
      handleWriteQuestion,
      handleDelete,
    ],
  );

  return (
    <>
      {optionType === OptionsType.COMBO || optionType === OptionsType.RADIO ? (
        <>
          <div
            className={cx('options-container', className, {
              error: !!messageError,
            })}
          >
            {data?.map((option, index) => renderOption(option, index))}
            <Button
              className="add-option d-flex align-items-center add-button"
              onClick={handleAddOption}
              disabled={disabled}
            >
              <div className="add-icon">
                <img src={images.icons.icPlusCircle} alt="edit" />
              </div>
              <span>Add option</span>
            </Button>
          </div>
          {messageError ? (
            <p className="error-message">{messageError}</p>
          ) : null}
        </>
      ) : null}
    </>
  );
}
