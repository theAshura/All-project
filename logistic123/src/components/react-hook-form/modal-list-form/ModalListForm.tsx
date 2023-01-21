import { FC, useCallback } from 'react';
import { Controller, Control } from 'react-hook-form';

import ModalList, { ModalProps } from 'components/common/modal-list/ModalList';
import useSortSelectOption from 'hoc/useSortSelectOption';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

interface ModalListFormProps {
  control?: Control;
  name?: string;
  notAllowSortData?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalListForm: FC<ModalListFormProps & ModalProps> = (props) => {
  const { name, control, data, notAllowSortData, dynamicLabels, ...other } =
    props;

  const { optionProps } = useSortSelectOption(notAllowSortData, data);

  const renderSelect = useCallback(
    (value?, onChange?, isSubmitted?) => (
      <ModalList
        isSubmit={isSubmitted}
        onChangeValues={onChange}
        values={value}
        data={optionProps}
        dynamicLabels={dynamicLabels}
        {...other}
      />
    ),
    [dynamicLabels, optionProps, other],
  );

  const controllerRender = useCallback(
    ({ field, formState }) =>
      renderSelect(field.value, field.onChange, formState.isSubmitted),
    [renderSelect],
  );

  if (control && name) {
    return (
      <Controller control={control} name={name} render={controllerRender} />
    );
  }

  return renderSelect();
};
export default ModalListForm;
