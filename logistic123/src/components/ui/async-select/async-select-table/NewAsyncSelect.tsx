import images from 'assets/images/images';
import {
  useState,
  FC,
  ReactElement,
  useEffect,
  forwardRef,
  useMemo,
  Fragment,
} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Tooltip from 'antd/lib/tooltip';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { DataObj } from 'models/common.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import ResultsButton from '../results-button/ResultsButton';
import Button, { ButtonSize, ButtonType } from '../../button/Button';
import { InputSearch } from '../../inputSearch/InputSearch';
import { ICInformation } from '../../../common/icon';

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
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

export interface NewAsyncSelectProps {
  onChangeSearch?: (value: string) => void;
  onChangeLocal?: (value: string) => void;
  handleConfirm?: (value: DataObj[]) => void;
  handleClearValue?: () => void;
  options?: DataObj[];
  hiddenSearch?: boolean;
  value?: DataObj[] | DataObj;
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
  hasTooltip?: boolean;
  hasPatentSelect?: boolean;
  isShowClearValue?: boolean;
  rowLabels: RowLabelType[];
  id?: string;
  dynamicLabels?: IDynamicLabel;
  // data: DataObj[];
}

const SelectItem: FC<{
  option: DataObj;
  onClick: (option: DataObj) => void;
  selectedOptions: DataObj[];
  hasPatentSelect?: boolean;
  handleHiddenOption: (option: DataObj) => void;
  rowLabels: RowLabelType[];
  hasTooltip?: boolean;
  // data: DataObj;
  dynamicLabels?: IDynamicLabel;
}> = ({
  option,
  onClick,
  selectedOptions,
  hasPatentSelect,
  handleHiddenOption,
  rowLabels,
  hasTooltip,
}) => {
  const sanitizeData = useMemo(
    () =>
      Object.entries(option).filter(
        ([key, value]) =>
          key !== 'content' &&
          key !== 'value' &&
          key !== 'label' &&
          key !== 'id' &&
          key !== 'required',
      ),
    [option],
  );

  const isSelected = useMemo(
    () =>
      selectedOptions?.find(
        (o) => o?.value?.toString() === option?.value?.toString(),
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
      <div className="flex-grow-1 d-flex ">
        {sanitizeData?.map(([key, value], index) => (
          <div
            key={key}
            className={cx(
              'text-start limit-line-text limit-height__text float-start',

              {
                'ps-4': hasPatentSelect && option.parentId,
                // todo
                // 'w-50': hasPatentSelect && option.isParent,
              },
              'select__item',
            )}
            style={{
              width: rowLabels[index]?.width,
            }}
          >
            {hasTooltip ? (
              <Tooltip title={value} color="#3b9ff3">
                {value}
              </Tooltip>
            ) : (
              value
            )}
          </div>
        ))}

        {/* todo */}
        {/* {hasPatentSelect && option.isParent && (
          <Button
            className="bg-white"
            buttonSize={ButtonSize.IconSmallAction}
            buttonType={ButtonType.Cancel}
            onClick={(e) => {
              handleHiddenOption(option);
              e.stopPropagation();
            }}
          >
            <img
              src={
                option?.upIcon
                  ? images.icons.icArrowChevronDown
                  : images.icons.icArrowChevronUp
              }
              alt="edit"
            />
          </Button>
        )} */}
      </div>

      <img
        src={isSelected ? images.icons.icTickFull : images.icons.icCircle}
        alt="select"
      />
    </button>
  );
};

const NewAsyncSelect = forwardRef<CountdownHandle, NewAsyncSelectProps>(
  (props, ref) => {
    const {
      titleResults,
      placeholder,
      hiddenSearch,
      searchContent,
      textSelectAll,
      options = [],
      multiple,
      textBtnConfirm,
      value: primitiveValue,
      onChangeSearch,
      handleConfirm,
      disabled = false,
      labelSelect,
      isRequired,
      message,
      messageRequired,
      selectType,
      isError,
      // data,
      className,
      rowLabels,
      // hasPatentSelect,
      isShowClearValue,
      handleClearValue,
      id,
      dynamicLabels,
      hasTooltip,
    } = props;

    const value = useMemo(() => {
      if (!primitiveValue) {
        return [];
      }
      return Array.isArray(primitiveValue) ? primitiveValue : [primitiveValue];
    }, [primitiveValue]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selected, setSelected] = useState<DataObj[]>(value);
    const [optionSelects, setOptionSelects] = useState<DataObj[]>([]);

    useEffect(() => {
      if (!isEqual(options, optionSelects)) {
        setOptionSelects([...options]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    const toggle = () => {
      if (!disabled) {
        if (dropdownOpen && !multiple) {
          handleConfirm(selected);
        }
        setDropdownOpen((prevState) => !prevState);
      }
    };

    useEffect(() => {
      if (dropdownOpen) {
        setSelected(value);
      }
    }, [value, dropdownOpen]);

    const handleChangeOption = (item: DataObj) => {
      const newOptionSelects = optionSelects.map((i) => {
        if (i.value === item.value) {
          return { ...i, upIcon: !item.upIcon };
        }

        if (i.parentId === item.value) {
          return { ...i, isHidden: !item.upIcon };
        }
        return i;
      });
      setOptionSelects(newOptionSelects);
    };

    const handleSelectItem = (item: DataObj) => {
      if (!multiple) {
        if (selected[0]?.value?.toString() === item?.value?.toString()) {
          setSelected([]);
        } else {
          setSelected([item]);
          handleConfirm([item]);
          setDropdownOpen((prevState) => !prevState);
        }

        return;
      }
      setSelected((prev) => {
        if (prev.find((i) => i.value?.toString() === item.value?.toString())) {
          return prev.filter(
            (i) => i.value?.toString() !== item.value?.toString(),
          );
        }
        return [...prev, item];
      });
    };

    const removeItem = (value: string) => {
      setSelected((p) => p.filter((item) => item.value !== value));
    };

    const handleSelectAll = () => {
      setSelected([...optionSelects]);
    };

    const renderResult = () => {
      let valueResult = [...selected];
      const lengthResult = selected.length;
      if (lengthResult <= 4) {
        return valueResult.map((i, index) => (
          <ResultsButton
            className="mt-2"
            key={index.toString() + String(i.value)}
            value={i.value}
            disabled={disabled}
            label={i.content}
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
              key={index.toString() + String(i.value)}
              value={i.value}
              label={i.content}
              removeItem={removeItem}
            />
          ))}
          <div className="btn-results__plus mt-2">{`+${lengthResult - 4}`}</div>
        </>
      );
    };

    const debounce_fun = useMemo(
      () =>
        debounce((nextValue: string) => {
          onChangeSearch(nextValue);
        }, 300),
      [onChangeSearch],
    );

    const handleInputOnchange = (e) => {
      const { value } = e.target;
      debounce_fun(value);
    };

    const renderImage = () => {
      if (multiple || !value[0] || !value[0].image) {
        return null;
      }
      return (
        <img
          src={value[0]?.image || images.icons.icTickFull}
          className="img-result"
          alt="select"
        />
      );
    };

    const renderPlaceholder = () => (
      <span className="placeholder-select"> {placeholder}</span>
    );

    const renderValue = () => {
      if (!multiple) {
        return value[0]?.label;
      }
      return renderPlaceholder();
    };

    return (
      <div id={id} className="async-select">
        {labelSelect && (
          <div className="d-flex align-items-start mg__b-1">
            <div className="label__select">{labelSelect}</div>
            {isRequired && (
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            )}
          </div>
        )}
        <Dropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          className={cx('dropdown', className)}
          size="lg"
          onClick={() => {
            if (!disabled && !dropdownOpen && onChangeSearch) {
              onChangeSearch('');
            }
          }}
        >
          <DropdownToggle
            className={cx(
              'dropdown-toggle d-flex justify-content-between align-items-center',
              { 'disabled-select': disabled },
            )}
          >
            {renderImage()}
            <span className="flex-grow-1 text-start text-result limit-line-text">
              {value.length === 0 ? renderPlaceholder() : renderValue()}
            </span>
            {isShowClearValue && value.length > 0 && (
              <Button
                className="bg-white"
                buttonSize={ButtonSize.IconSmallAction}
                buttonType={ButtonType.Cancel}
                onClick={(e) => {
                  handleClearValue();
                  setSelected([]);
                  e.stopPropagation();
                }}
              >
                <img
                  className="ic-btn__clear"
                  src={images.icons.icGrayX}
                  alt="icX"
                />
              </Button>
            )}

            <img src={images.icons.icSelect} alt="select" />
          </DropdownToggle>
          <DropdownMenu
            modifiers={{
              setMaxHeight: {
                enabled: true,
                order: 890,
                fn: (data) => ({
                  ...data,
                  styles: {
                    ...data.styles,
                    overflow: 'auto',
                    maxHeight: '500px',
                  },
                }),
              },
            }}
            className="dropdown-menu w-100"
          >
            {multiple && (
              <>
                <div>
                  <p className="title-results">{titleResults}</p>
                  <div className="results d-flex flex-wrap">
                    {renderResult()}
                  </div>
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
            {!hiddenSearch && (
              <InputSearch
                onSearch={handleInputOnchange}
                autoFocus
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Search,
                )}
                className="w-100"
              />
            )}

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
              {!disabled && optionSelects.length === 0 && (
                <div className="text-center">No data</div>
              )}
              {/* {console.log('data', data)} */}
              {!disabled && optionSelects.length > 0 && (
                <div
                  className="px-2 d-flex align-items-center"
                  style={{
                    background: '#f3f4f6',
                    height: 34,
                  }}
                >
                  <div className="d-flex justify-content-between w-100">
                    {rowLabels?.map((i) => (
                      <div
                        key={i.id}
                        className="fw-bold"
                        style={{
                          width: i.width,
                        }}
                      >
                        {i.label}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      width: 20,
                    }}
                  />
                </div>
              )}

              {!disabled &&
                optionSelects.length > 0 &&
                optionSelects.map((item, index) =>
                  item?.isHidden ? (
                    <></>
                  ) : (
                    <Fragment key={`${item.value}${index.toString()}`}>
                      <SelectItem
                        option={item}
                        onClick={handleSelectItem}
                        selectedOptions={selected}
                        hasPatentSelect
                        rowLabels={rowLabels}
                        handleHiddenOption={handleChangeOption}
                        hasTooltip={hasTooltip}
                      />
                    </Fragment>
                  ),
                )}
              {/* {!disabled &&
                optionSelects.length > 0 &&
                optionSelects.map((item, index) =>
                  item?.isHidden ? (
                    <></>
                  ) : (
                    <Fragment key={`${item.value}${index.toString()}`}>
                      <SelectItem
                        option={item}
                        onClick={handleSelectItem}
                        selectedOptions={selected}
                        hasPatentSelect
                        handleHiddenOption={handleChangeOption}
                      />
                    </Fragment>
                  ),
                )} */}
            </div>

            {multiple && (
              <div className="d-flex justify-content-end">
                <Button
                  className={cx('me-2')}
                  buttonType={ButtonType.CancelOutline}
                  onClick={toggle}
                >
                  <span className="pe-2">
                    {renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Cancel,
                    )}
                  </span>
                </Button>
                <Button
                  disabled={disabled}
                  onClick={() => {
                    setDropdownOpen(false);
                    handleConfirm(selected);
                  }}
                >
                  {textBtnConfirm ||
                    renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Confirm,
                    )}
                </Button>
              </div>
            )}
          </DropdownMenu>
        </Dropdown>

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

export default NewAsyncSelect;
