import { FC, useCallback } from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  AsyncSelect,
  SelectAsyncProps,
} from 'components/ui/async-select/NewAsyncSelect';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import SelectResult, {
  Position,
} from 'components/common/select-result/SelectResult';
import useSortSelectOption from 'hoc/useSortSelectOption';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';

interface SelectAsyncFormProps {
  control?: Control;
  name?: string;
  onChange?: (value: (string | number)[]) => void;
  showResult?: boolean;
  notAllowSortData?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const SelectAsyncForm: FC<SelectAsyncFormProps & SelectAsyncProps> = (
  props,
) => {
  const {
    name,
    control,
    onChange,
    disabled,
    showResult,
    options,
    notAllowSortData,
    dynamicLabels,
    ...other
  } = props;

  const { optionProps } = useSortSelectOption(notAllowSortData, options);

  const renderSelect = useCallback(
    (value?: (number | string)[], onChangeFn?) => {
      const handleChange = (e) => {
        onChangeFn(e);
        if (onChange) {
          onChange(e);
        }
      };
      const handleClearAll = () => {
        handleChange([]);
      };

      const removeItem = (itemRemove: string | number) => {
        const newValue = value.filter((item) => item !== itemRemove);
        handleChange(newValue);
      };

      const listResult = optionProps?.filter((item) =>
        value?.includes(item?.value),
      );

      return (
        <div>
          <AsyncSelect
            handleConfirm={handleChange}
            options={optionProps}
            value={value}
            dynamicLabels={dynamicLabels}
            {...other}
            disabled={disabled}
          />
          {value?.length > 0 && showResult && (
            <div style={{ paddingTop: '10px' }}>
              <SelectResult
                position={Position.VERTICAL}
                title={
                  <div className="d-flex">
                    <span>
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Selected,
                      )}
                      :
                    </span>
                  </div>
                }
                disabled={disabled}
                listItem={listResult}
                handelClearItem={(value: string) => {
                  if (!disabled) {
                    removeItem(value);
                  }
                }}
                handelClearAll={() => {
                  if (!disabled) {
                    handleClearAll();
                  }
                }}
              />
            </div>
          )}
        </div>
      );
    },
    [optionProps, dynamicLabels, other, disabled, showResult, onChange],
  );
  return control && name ? (
    <Controller
      control={control}
      name={name}
      render={({ field }) => renderSelect(field.value, field.onChange)}
    />
  ) : (
    renderSelect()
  );
};
export default SelectAsyncForm;
