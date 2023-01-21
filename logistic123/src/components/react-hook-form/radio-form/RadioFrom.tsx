import RadioCustomer, {
  RadioCustomerProps,
} from 'components/common/radio/Radio';
import { FC, useCallback } from 'react';
import { Controller, Control } from 'react-hook-form';

interface RadioFormProps extends RadioCustomerProps {
  control?: Control;
  name?: string;
}

const RadioForm: FC<RadioFormProps> = (props) => {
  const { name, control, onChange, ...other } = props;

  const renderRadio = useCallback(
    (value?, onChangeFn?) => (
      <RadioCustomer
        onChange={(value) => {
          onChange?.(value);
          onChangeFn?.(value);
        }}
        value={value}
        {...other}
      />
    ),
    [onChange, other],
  );

  return control && name ? (
    <Controller
      control={control}
      name={name}
      render={({ field }) => renderRadio(field.value, field.onChange)}
    />
  ) : (
    renderRadio()
  );
};
export default RadioForm;
