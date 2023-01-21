import {
  ChangeEventHandler,
  InputHTMLAttributes,
  KeyboardEventHandler,
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Tooltip from 'antd/lib/tooltip';
import cx from 'classnames';
import './InputSearch.scss';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';

export interface InputSearchProps
  extends InputHTMLAttributes<HTMLInputElement> {
  isButton?: Boolean;
  onSearch?: ChangeEventHandler<HTMLInputElement>;
  onEnter?: KeyboardEventHandler<HTMLInputElement>;
  className?: string;
  name?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  pattern?: string;
  dynamicLabels?: IDynamicLabel;
}

export const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
  (
    {
      isButton,
      onSearch,
      onEnter,
      className,
      name,
      disabled,
      pattern,
      autoFocus,
      placeholder,
      dynamicLabels,
      ...other
    },
    ref,
  ) => {
    const inputRef = useRef<any>();
    useImperativeHandle(ref, () => inputRef.current);

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus, inputRef]);

    return (
      <div aria-autocomplete="none">
        <div className={cx('wrapperSearch', className)}>
          <Input
            {...other}
            autoComplete="nope"
            name={name}
            ref={inputRef}
            placeholder={
              placeholder ||
              renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Search)
            }
            autoFocus
            onChange={onSearch}
            onKeyDown={onEnter}
            disabled={disabled}
            size="large"
            className={isButton ? 'searchButton' : 'searchIcon'}
            allowClear
            prefix={
              <Tooltip title="">
                <SearchOutlined />
              </Tooltip>
            }
            pattern={pattern}
          />
          {isButton && (
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              className="buttonSearch"
            />
          )}
        </div>
      </div>
    );
  },
);
