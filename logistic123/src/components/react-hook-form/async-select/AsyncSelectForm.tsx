import { FC, useCallback } from 'react';
import { Controller, Control } from 'react-hook-form';
import NewAsyncSelect, {
  NewAsyncOptions,
  NewAsyncSelectProps,
} from 'components/ui/async-select/NewAsyncSelect';
import useSortSelectOption from 'hoc/useSortSelectOption';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

interface AsyncSelectFormProps {
  control?: Control;
  name?: string;
  onChange?: (value: NewAsyncOptions[]) => void;
  notAllowSortData?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const AsyncSelectForm: FC<AsyncSelectFormProps & NewAsyncSelectProps> = (
  props,
) => {
  const {
    name,
    control,
    onChange,
    options,
    notAllowSortData,
    dynamicLabels,
    ...other
  } = props;

  const { optionProps } = useSortSelectOption(notAllowSortData, options);

  const renderSelect = useCallback(
    (value?, onChangeFn?) => {
      const handleChange = (e) => {
        onChangeFn(e);
        onChange?.(e);
      };
      return (
        <NewAsyncSelect
          handleConfirm={handleChange}
          value={value}
          options={optionProps}
          dynamicLabels={dynamicLabels}
          {...other}
        />
      );
    },
    [optionProps, dynamicLabels, other, onChange],
  );

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => renderSelect(field.value, field.onChange)}
      />
    );
  }

  return renderSelect();
};

export default AsyncSelectForm;
