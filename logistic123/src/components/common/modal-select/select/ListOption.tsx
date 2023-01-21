import images from 'assets/images/images';
import {
  useState,
  FC,
  ReactElement,
  useCallback,
  forwardRef,
  useMemo,
  useEffect,
} from 'react';
import cx from 'classnames';
import ResultsButton from 'components/ui/async-select/results-button/ResultsButton';
import { InputSearch } from 'components/ui/inputSearch/InputSearch';
import { ICInformation } from 'components/common/icon';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

export interface OptionsProps {
  value: string | number;
  label: string | ReactElement;
  image?: string;
}

export enum SelectType {
  WARNING = 'warning',
  INFO = 'info',
  ERROR = 'error',
  NORMAL = 'normal',
}

export type CountdownHandle = {
  clearData: () => void;
};

export interface ListSelectProps {
  onChangeSearch?: (value: string) => void;
  onChangeLocal?: (value: string) => void;
  handleConfirm?: (value: OptionsProps[]) => void;
  options?: OptionsProps[];
  value?: OptionsProps[] | OptionsProps;
  hasImage?: boolean;
  multiple?: boolean;
  textBtnConfirm?: string;
  searchContent?: string;
  textSelectAll?: string;
  placeholder?: string;
  titleResults?: string;
  disabled?: boolean;
  isRequired?: boolean;
  labelSelect?: string;
  message?: string;
  messageRequired?: string;
  selectType?: typeof SelectType[keyof typeof SelectType];
  isError?: boolean;
  className?: string;
  selectedTemplate?: OptionsProps[];
  dynamicLabels?: IDynamicLabel;
}

const SelectItem: FC<{
  option: OptionsProps;
  onClick: (option: OptionsProps) => void;
  selectedOptions: OptionsProps[];
}> = ({ option, onClick, selectedOptions }) => {
  const isSelected = useMemo(
    () =>
      selectedOptions?.find(
        (o) => o.value?.toString() === option.value?.toString(),
      ),
    [selectedOptions, option],
  );
  return (
    <button
      className={cx(
        'd-flex justify-content-between align-items-center options w-100',
      )}
      onClick={() => onClick(option)}
    >
      {option.image && (
        <img
          src={option.image || images.icons.icTickFull}
          className="img-label"
          alt="select"
        />
      )}

      <span className="flex-grow-1 text-start"> {option.label}</span>
      <img
        src={isSelected ? images.icons.icTickFull : images.icons.icCircle}
        alt="select"
      />
    </button>
  );
};

const ListOption = forwardRef<CountdownHandle, ListSelectProps>(
  (props, ref) => {
    const {
      titleResults,
      searchContent,
      textSelectAll,
      options = [],
      multiple,
      value: primitiveValue,
      handleConfirm,
      disabled = false,
      labelSelect,
      isRequired,
      message,
      messageRequired,
      selectType,
      isError,
      selectedTemplate,
      dynamicLabels,
    } = props;
    const value = useMemo(() => {
      if (!primitiveValue) {
        return [];
      }
      return Array.isArray(primitiveValue) ? primitiveValue : [primitiveValue];
    }, [primitiveValue]);

    const [selected, setSelected] = useState<OptionsProps[]>(value);
    const [optionsSelect, setOptionsSelect] = useState<OptionsProps[]>(options);

    const handleSelectItem = useCallback(
      (item: OptionsProps) => {
        if (!multiple) {
          handleConfirm([item]);
          setSelected([item]);

          return;
        }
        setSelected((prev) => {
          if (
            prev?.find((i) => i.value?.toString() === item.value?.toString())
          ) {
            return prev.filter(
              (i) => i.value?.toString() !== item.value?.toString(),
            );
          }
          return [...prev, item];
        });
      },
      [handleConfirm, multiple],
    );

    const removeItem = (value: string) => {
      setSelected((p) => p.filter((item) => item.value !== value));
    };

    const handleSelectAll = () => {
      setSelected([...optionsSelect]);
    };

    const renderResult = () => {
      let valueResult = [...selected];
      const lengthResult = selected.length;
      if (lengthResult <= 4) {
        return valueResult.map((i, index) => (
          <ResultsButton
            className="mt-2"
            key={index.toString() + i.value.toString()}
            value={i.value}
            disabled={disabled}
            label={i.label}
            removeItem={removeItem}
          />
        ));
      }
      valueResult = valueResult.slice(0, 4);
      return (
        <>
          {valueResult.map((i, index) => (
            <ResultsButton
              className="mt-2"
              key={index.toString() + i.value.toString()}
              value={i.value}
              label={i.label}
              removeItem={removeItem}
            />
          ))}
          <div className="btn-results__plus mt-2">{`+${lengthResult - 4}`}</div>
        </>
      );
    };

    const handleInputOnchange = (e) => {
      const { value } = e.target;
      const newOptions: OptionsProps[] =
        options?.filter(
          (i) =>
            i.label
              ?.toString()
              ?.toUpperCase()
              ?.indexOf(value?.toUpperCase()?.trim()) !== -1,
        ) || [];
      setOptionsSelect(newOptions);
    };

    useEffect(() => {
      setSelected(selectedTemplate);
    }, [selectedTemplate]);

    return (
      <div className="list-option-modal">
        {labelSelect && (
          <div className="d-flex align-items-start pb-2">
            <div className="label__select">{labelSelect}</div>
            {isRequired && (
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            )}
          </div>
        )}

        {multiple && (
          <>
            <div>
              <p className="title-results">{titleResults}</p>
              <div className="results d-flex flex-wrap">{renderResult()}</div>
            </div>
            <div className="line" />
          </>
        )}

        <div className="d-flex justify-content-between align-items-center wrap-title__label">
          <span>{searchContent}</span>
          {multiple && (
            <button
              className="btn--select__all"
              onClick={handleSelectAll}
              disabled={disabled}
            >
              {textSelectAll}
            </button>
          )}
        </div>
        <InputSearch
          onSearch={handleInputOnchange}
          className="w-100"
          dynamicLabels={dynamicLabels}
          autoFocus
        />
        <div className="list-options">
          {disabled && (
            <div className="text-center">
              <img
                src={images.common.loading}
                className="loading"
                alt="loading"
              />
            </div>
          )}
          {!disabled && optionsSelect.length === 0 && (
            <div className="text-center">No data</div>
          )}
          {!disabled &&
            optionsSelect.length > 0 &&
            optionsSelect.map((item) => (
              <SelectItem
                key={item.value}
                option={item}
                onClick={handleSelectItem}
                selectedOptions={selected}
                // handleHiddenOption={handleChangeOption}
              />
            ))}
        </div>
        {/* <Button
          className="w-100"
          disabled={disabled}
          onClick={() => handleConfirm(selected)}
        >
          {textBtnConfirm}
        </Button> */}

        {message && (
          <div
            className={cx('message mt-2', {
              normal: selectType === SelectType.NORMAL,
              warning: selectType === SelectType.WARNING,
              info: selectType === SelectType.INFO,
              // 'd-none': props.type === 'hidden',
              error: isError,
              disabled,
            })}
          >
            <ICInformation />
            <span>{message}</span>
          </div>
        )}
        {messageRequired && (
          <div className="message-required mt-2">{messageRequired} </div>
        )}
      </div>
    );
  },
);

export default ListOption;
