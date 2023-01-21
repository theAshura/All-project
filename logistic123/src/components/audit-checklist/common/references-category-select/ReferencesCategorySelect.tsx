import useSortSelectOption from 'hoc/useSortSelectOption';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC } from 'react';
import { Controller, Control } from 'react-hook-form';

import ModalList, { ModalProps } from './modal-list/ModalList';

interface Props {
  control?: Control;
  name?: string;
  disableCloseWhenClickOut?: boolean;
  notAllowSortData?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ReferencesCategorySelect: FC<Props & ModalProps> = (props) => {
  const { name, control, data, notAllowSortData, dynamicLabels, ...other } =
    props;
  const { optionProps } = useSortSelectOption(notAllowSortData, data);

  const renderSelect = (value?, onChange?, isSubmitted?) => (
    <ModalList
      isSubmit={isSubmitted}
      onChangeValues={onChange}
      values={value}
      data={optionProps}
      dynamicLabels={dynamicLabels}
      {...other}
    />
  );

  return control && name ? (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) =>
        renderSelect(field.value, field.onChange, formState.isSubmitted)
      }
    />
  ) : (
    renderSelect()
  );
};
export default ReferencesCategorySelect;
