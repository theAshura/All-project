import cx from 'classnames';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { ReactElement, useMemo } from 'react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import ItemSelect from './item/itemSelect';
import style from './selectResult.module.scss';

export enum Position {
  HORIZON = 'horizon',
  VERTICAL = 'vertical',
}

export interface SelectResultProps {
  listItem: (NewAsyncOptions & { required?: boolean })[];
  messageError?: string;
  position: Position;
  title: (() => ReactElement) | ReactElement | string;
  handelClearAll: () => void;
  handelClearItem: (id: string) => void;
  className?: string;
  horizonClassName?: string;
  verticalClassName?: string;
  hiddenClear?: boolean;
  disabled?: boolean;
  collapse?: boolean;
  selectResultTitle?: string;
  dynamicLabels?: IDynamicLabel;
}

export default function SelectResult(props: SelectResultProps) {
  const {
    listItem,
    position,
    handelClearAll,
    handelClearItem,
    title,
    hiddenClear = false,
    disabled,
    horizonClassName,
    verticalClassName,
    messageError,
    dynamicLabels,
  } = props;

  const totalResultFilter = useMemo(() => {
    const result = listItem?.filter((item) => item.label);
    return result;
  }, [listItem]);

  const listResult = useMemo(
    () =>
      Position.HORIZON === position && totalResultFilter?.length > 4
        ? totalResultFilter.slice(0, 4)
        : totalResultFilter,
    [position, totalResultFilter],
  );

  if (Position.VERTICAL === position) {
    return (
      <>
        <div
          className={cx(
            style.selectResult,
            {
              [style.error]: !!messageError,
            },
            verticalClassName,
          )}
        >
          <div className={cx(style.leftContent, 'flex-column')}>
            <div className={cx(style.topBar, 'd-flex justify-content-between')}>
              <div className={style.title}>{title}</div>
              {!hiddenClear && !disabled && (
                <div className={style.rightContent}>
                  <Button
                    className={cx(style.buttonClearAll, 'ms-0', {
                      [style.disable]: disabled,
                    })}
                    buttonType={ButtonType.UnderLineDangerous}
                    buttonSize={ButtonSize.Medium}
                    onClick={handelClearAll}
                    disabled={disabled}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Clear all'],
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className={style.listItemSelectedVertical}>
              {listResult?.map((item) => (
                <ItemSelect
                  key={item?.value}
                  {...item}
                  disabled={disabled}
                  removeItem={handelClearItem}
                />
              ))}
            </div>
          </div>
        </div>
        {messageError && <div className={style.message}>{messageError}</div>}
      </>
    );
  }

  return (
    <>
      <div
        className={cx(
          style.selectResult,
          {
            [style.error]: !!messageError,
          },
          horizonClassName,
        )}
      >
        <div className={cx(style.leftContent, 'flex-row')}>
          <div className={style.title}>{title}</div>
          <div className={style.listItemSelected}>
            {listResult?.map((item) => (
              <ItemSelect
                key={item?.value}
                {...item}
                disabled={disabled}
                removeItem={handelClearItem}
              />
            ))}
            {totalResultFilter?.length > 4 && (
              <div className={style.countItem}>
                <span>+</span>
                {totalResultFilter.length - 4}
              </div>
            )}
          </div>
        </div>
        {!hiddenClear && (
          <div className={style.rightContent}>
            <Button
              className={cx(style.buttonClearAll, 'ms-0', {
                [style.disable]: disabled,
              })}
              buttonType={ButtonType.UnderLineDangerous}
              buttonSize={ButtonSize.Medium}
              onClick={handelClearAll}
              disabled={disabled}
            >
              {renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Clear all'],
              )}
            </Button>
          </div>
        )}
      </div>
      {messageError && <div className={style.message}>{messageError}</div>}
    </>
  );
}
