import images from 'assets/images/images';
import {
  useState,
  FC,
  ReactElement,
  useEffect,
  forwardRef,
  useMemo,
  Fragment,
  useCallback,
} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import NoDataImg from 'components/common/no-data/NoData';
import useSortSelectOption from 'hoc/useSortSelectOption';
import ResultsButton from './results-button/ResultsButton';
import Button, { ButtonSize, ButtonType } from '../button/Button';
import { InputSearch } from '../inputSearch/InputSearch';
import { ICInformation } from '../../common/icon';

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

export interface NewAsyncOptions {
  value: string | number;
  label: string | ReactElement;
  image?: string;
  isChild?: boolean;
  isParent?: boolean;
  isHidden?: boolean;
  parentId?: string;
  upIcon?: boolean;
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
  handleConfirm?: (value: NewAsyncOptions[]) => void;
  handleClearValue?: () => void;
  options?: NewAsyncOptions[];
  hiddenSearch?: boolean;
  value?: NewAsyncOptions[] | NewAsyncOptions;
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
  hasPatentSelect?: boolean;
  isShowClearValue?: boolean;
  id?: string;
  dynamicLabels?: IDynamicLabel;
  flagImage?: boolean;
}

export type SelectAsyncProps = Omit<
  NewAsyncSelectProps,
  'value' | 'handleConfirm'
> & {
  value?: (number | string)[];
  handleConfirm?: (value: (string | number)[]) => void;
  onClose?: () => void;
};

const SelectItem: FC<{
  option: NewAsyncOptions;
  onClick: (option: NewAsyncOptions) => void;
  selectedOptions: NewAsyncOptions[];
  hasPatentSelect?: boolean;
  handleHiddenOption: (option: NewAsyncOptions) => void;
  flagImage?: boolean;
}> = ({
  option,
  onClick,
  selectedOptions,
  hasPatentSelect,
  handleHiddenOption,
  flagImage,
}) => {
  const isSelected = useMemo(
    () =>
      selectedOptions?.find(
        (o) => o?.value?.toString() === option.value?.toString(),
      ),
    [option.value, selectedOptions],
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
          onError={({ currentTarget }) => {
            if (currentTarget && currentTarget?.src) {
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = images.common.imageDefault;
            }
          }}
          className={cx('img-label', { 'flag-image': flagImage })}
          alt="select"
        />
      )}
      <div className="flex-grow-1 d-flex">
        <span
          className={cx(
            'text-start limit-line-text limit-height__text',

            {
              'ps-4': hasPatentSelect && option.parentId,
              // todo
              // 'w-50': hasPatentSelect && option.isParent,
            },
            'select__item',
          )}
        >
          {option.label}
        </span>
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
      className,
      isShowClearValue,
      handleClearValue,
      id,
      dynamicLabels,
      flagImage,
    } = props;

    const value = useMemo(() => {
      if (!primitiveValue) {
        return [];
      }
      return Array.isArray(primitiveValue) ? primitiveValue : [primitiveValue];
    }, [primitiveValue]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selected, setSelected] = useState<NewAsyncOptions[]>(value);
    const [optionSelects, setOptionSelects] = useState<NewAsyncOptions[]>([]);
    const { optionProps } = useSortSelectOption(false, options);
    useEffect(() => {
      if (!isEqual(optionProps, optionSelects)) {
        setOptionSelects([...optionProps]);
      }
    }, [optionSelects, optionProps]);

    const toggle = useCallback(() => {
      if (!disabled) {
        if (dropdownOpen && !multiple) {
          handleConfirm(selected);
        }
        setDropdownOpen((prevState) => !prevState);
      }
    }, [disabled, dropdownOpen, handleConfirm, multiple, selected]);

    useEffect(() => {
      if (dropdownOpen) {
        setSelected(value);
      }
    }, [dropdownOpen, value]);

    const handleChangeOption = useCallback(
      (item: NewAsyncOptions) => {
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
      },
      [optionSelects],
    );

    const handleSelectItem = useCallback(
      (item: NewAsyncOptions) => {
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
          if (
            prev.find((i) => i.value?.toString() === item.value?.toString())
          ) {
            return prev.filter(
              (i) => i.value?.toString() !== item.value?.toString(),
            );
          }
          return [...prev, item];
        });
      },
      [handleConfirm, multiple, selected],
    );

    const removeItem = useCallback((value: string) => {
      setSelected((p) => p.filter((item) => item.value !== value));
    }, []);

    const handleSelectAll = useCallback(() => {
      setSelected([...optionSelects]);
    }, [optionSelects]);

    const renderResult = useCallback(() => {
      let valueResult = [...selected];
      const lengthResult = selected.length;
      if (lengthResult <= 4) {
        return valueResult.map((i, index) => (
          <ResultsButton
            className="mt-2"
            key={index.toString() + i.value?.toString()}
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
              key={index.toString() + i.value?.toString()}
              value={i.value}
              label={i.label}
              removeItem={removeItem}
            />
          ))}
          <div className="btn-results__plus mt-2">{`+${lengthResult - 4}`}</div>
        </>
      );
    }, [disabled, removeItem, selected]);

    const debounce_fun = useMemo(
      () =>
        debounce((nextValue: string) => {
          onChangeSearch(nextValue);
        }, 300),
      [onChangeSearch],
    );

    const handleInputOnchange = useCallback(
      (e) => {
        const { value } = e.target;
        debounce_fun(value);
      },
      [debounce_fun],
    );

    const renderImage = useCallback(() => {
      if (multiple || !value[0] || !value[0].image) {
        return null;
      }
      return (
        <img
          src={value?.[0]?.image || images.icons.icTickFull}
          className={cx('img-result', { 'flag-image': flagImage })}
          onError={({ currentTarget }) => {
            if (currentTarget && currentTarget?.src) {
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = images.common.imageDefault;
            }
          }}
          alt="select"
        />
      );
    }, [flagImage, multiple, value]);

    const renderPlaceholder = useCallback(
      () => (
        <span className="placeholder-select">
          {disabled ? <span>&nbsp;</span> : placeholder}
        </span>
      ),
      [placeholder, disabled],
    );

    const renderValue = useCallback(() => {
      if (!multiple) {
        return value[0]?.label;
      }
      return renderPlaceholder();
    }, [multiple, renderPlaceholder, value]);

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
                className="w-100"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Search,
                )}
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
              {!disabled && optionSelects.length === 0 && <NoDataImg />}
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
                        handleHiddenOption={handleChangeOption}
                        flagImage={flagImage}
                      />
                    </Fragment>
                  ),
                )}
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

export const AsyncSelect = forwardRef<CountdownHandle, SelectAsyncProps>(
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
      className,
      // hasPatentSelect,
      isShowClearValue,
      handleClearValue,
      id,
      onClose,
      dynamicLabels,
      flagImage,
    } = props;

    const value = useMemo(() => {
      if (!primitiveValue) {
        return [];
      }
      return Array.isArray(primitiveValue) ? primitiveValue : [primitiveValue];
    }, [primitiveValue]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selected, setSelected] = useState<(string | number)[]>(value);
    const [optionSelects, setOptionSelects] = useState<NewAsyncOptions[]>([]);

    useEffect(() => {
      if (!isEqual(options, optionSelects)) {
        setOptionSelects([...options]);
      }
    }, [optionSelects, options]);

    const handleClose = useCallback(() => {
      onClose?.();
      setDropdownOpen((prevState) => !prevState);
    }, [onClose]);

    const toggle = useCallback(() => {
      if (!disabled) {
        if (dropdownOpen && !multiple) {
          handleConfirm(selected);
        }
        handleClose();
      }
    }, [
      disabled,
      dropdownOpen,
      handleClose,
      handleConfirm,
      multiple,
      selected,
    ]);

    useEffect(() => {
      if (dropdownOpen) {
        setSelected(value);
      }
    }, [dropdownOpen, value]);

    const handleChangeOption = useCallback(
      (item: NewAsyncOptions) => {
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
      },
      [optionSelects],
    );

    const handleSelectItem = useCallback(
      (item: NewAsyncOptions) => {
        if (!multiple) {
          if (selected[0]?.toString() === item?.value?.toString()) {
            setSelected([]);
          } else {
            setSelected([item?.value]);
            handleConfirm([item?.value]);
            handleClose();
          }

          return;
        }
        setSelected((prev: (string | number)[]) => {
          if (prev.find((i) => i?.toString() === item?.value?.toString())) {
            return prev.filter(
              (i) => i?.toString() !== item?.value?.toString(),
            );
          }

          return [...prev, item?.value];
        });
      },
      [handleClose, handleConfirm, multiple, selected],
    );

    const removeItem = useCallback((value: string) => {
      setSelected((p) => p.filter((item) => item !== value));
    }, []);

    const handleSelectAll = useCallback(() => {
      const values = optionSelects?.map((item) => item?.value) || [];
      setSelected([...values]);
    }, [optionSelects]);

    const renderResult = useCallback(() => {
      let valueResult = selected
        ?.map((item) => {
          const finding = optionSelects?.find((i) => i.value === item);
          return finding || null;
        })
        .filter((item) => item);
      const lengthResult = selected.length;
      if (lengthResult <= 4) {
        return valueResult.map((i, index) => (
          <ResultsButton
            className="mt-2"
            key={index.toString() + i.value?.toString()}
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
              key={index.toString() + i.value?.toString()}
              value={i.value}
              label={i.label}
              removeItem={removeItem}
            />
          ))}
          <div className="btn-results__plus mt-2">{`+${lengthResult - 4}`}</div>
        </>
      );
    }, [disabled, optionSelects, removeItem, selected]);

    const debounce_fun = useMemo(
      () =>
        debounce((nextValue: string) => {
          onChangeSearch(nextValue);
        }, 300),
      [onChangeSearch],
    );

    const handleInputOnchange = useCallback(
      (e) => {
        const { value } = e.target;
        debounce_fun(value);
      },
      [debounce_fun],
    );

    const renderImage = useCallback(() => {
      const dataValue = optionSelects?.find((i) => i.value === value?.[0]);
      if (multiple || !dataValue || !dataValue?.image) {
        return null;
      }
      return (
        <img
          src={dataValue?.image || images.icons.icTickFull}
          className={cx('img-result', { 'flag-image': flagImage })}
          onError={({ currentTarget }) => {
            if (currentTarget && currentTarget?.src) {
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = images.common.imageDefault;
            }
          }}
          alt="select"
        />
      );
    }, [flagImage, multiple, optionSelects, value]);

    const placeholderDisplay = useMemo(() => {
      if (disabled) {
        return ' ';
      }
      return (
        placeholder ||
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )
      );
    }, [disabled, dynamicLabels, placeholder]);

    const renderPlaceholder = useCallback(
      () => <span className="placeholder-select"> {placeholderDisplay}</span>,
      [placeholderDisplay],
    );

    const renderValue = useCallback(() => {
      const dataValue = optionSelects?.find((i) => i.value === value?.[0]);

      if (!multiple && dataValue) {
        return dataValue?.label;
      }
      return renderPlaceholder();
    }, [multiple, optionSelects, renderPlaceholder, value]);

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

            {!disabled && <img src={images.icons.icSelect} alt="select" />}
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
                className="w-100"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Search,
                )}
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
                <div className="text-center">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['No data'],
                  )}
                </div>
              )}
              {!disabled &&
                optionSelects.length > 0 &&
                optionSelects.map((item, index) => {
                  const valueResult = selected
                    ?.map((item) => {
                      const finding = optionSelects?.find(
                        (i) => i.value === item,
                      );
                      return finding || null;
                    })
                    .filter((item) => item);
                  return item?.isHidden ? (
                    <></>
                  ) : (
                    <Fragment key={`${item.value}${index.toString()}`}>
                      <SelectItem
                        option={item}
                        onClick={handleSelectItem}
                        selectedOptions={valueResult}
                        hasPatentSelect
                        handleHiddenOption={handleChangeOption}
                        flagImage={flagImage}
                      />
                    </Fragment>
                  );
                })}
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
                    handleClose();
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
