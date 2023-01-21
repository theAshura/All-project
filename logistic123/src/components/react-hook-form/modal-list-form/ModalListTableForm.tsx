import { FC, ReactElement, useCallback } from 'react';
import { Controller, Control } from 'react-hook-form';

import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import ModalListTableRadio, {
  ModalPropsRadio,
} from '../../common/modal-list-table/ModalListTableRadio';

import ModalListTable, {
  ModalProps,
} from '../../common/modal-list-table/ModalListTable';

interface ModalListFormProps {
  control: Control;
  name: string;
  multiple?: boolean;
  buttonName?: (() => ReactElement) | ReactElement | string;
  isTypeUpdate?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalListForm: FC<ModalListFormProps & ModalProps & ModalPropsRadio> = (
  props,
) => {
  const {
    name,
    control,
    multiple,
    buttonName,
    textBtn,
    dynamicLabels,
    ...other
  } = props;

  const renderSelect = useCallback(
    (value?, onChange?, isSubmitted?) => (
      <ModalListTable
        isSubmit={isSubmitted}
        onChangeValues={onChange}
        values={value}
        textBtn={textBtn}
        dynamicLabels={dynamicLabels}
        {...other}
      />
    ),
    [dynamicLabels, other, textBtn],
  );

  const renderSelectRadio = useCallback(
    (value?, onChange?, isSubmitted?) => (
      <ModalListTableRadio
        isSubmit={isSubmitted}
        onChangeValues={onChange}
        buttonName={buttonName}
        values={value}
        dynamicLabels={dynamicLabels}
        {...other}
      />
    ),
    [buttonName, dynamicLabels, other],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) =>
        multiple
          ? renderSelect(field.value, field.onChange, formState.isSubmitted)
          : renderSelectRadio(
              field.value,
              field.onChange,
              formState.isSubmitted,
            )
      }
    />
  );
};
export default ModalListForm;
