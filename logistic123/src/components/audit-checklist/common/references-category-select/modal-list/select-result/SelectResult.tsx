import cx from 'classnames';
import sortBy from 'lodash/sortBy';
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

  const displayList = useMemo(
    () => sortBy(listItem, 'required')?.reverse(),
    [listItem],
  );

  return Position.VERTICAL === position ? (
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
          <div className={style.listItemSelectedVertical}>
            {displayList?.map((item) => (
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
  ) : (
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
            {displayList?.map((item) => (
              <ItemSelect
                key={item?.value}
                {...item}
                disabled={disabled}
                removeItem={handelClearItem}
              />
            ))}
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
