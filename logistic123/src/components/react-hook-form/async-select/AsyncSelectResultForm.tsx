import { FC } from 'react';
import { Controller, Control } from 'react-hook-form';
import AsyncSelectResult, {
  AsyncSelectResultProps,
} from 'components/ui/async-select/AsyncSelectResult';
import useSortSelectOption from 'hoc/useSortSelectOption';

interface AsyncSelectResultFormProps {
  control?: Control;
  name?: string;
  notAllowSortData?: boolean;
}

const AsyncSelectResultForm: FC<
  AsyncSelectResultFormProps & AsyncSelectResultProps
> = (props) => {
  const { name, control, notAllowSortData, options, dynamicLabels, ...other } =
    props;
  const { optionProps } = useSortSelectOption(notAllowSortData, options);
  const renderSelect = (value?, onChange?) => (
    <AsyncSelectResult
      handleChangeResult={onChange}
      result={value}
      options={optionProps}
      dynamicLabels={dynamicLabels}
      {...other}
    />
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
export default AsyncSelectResultForm;
