import { FC } from 'react';
import { Controller, Control } from 'react-hook-form';
import Input, { Props } from 'components/ui/input/Input';
import styles from './input-form.module.scss';

interface CProps {
  control: Control;
  name: string;
  maxValue?: number;
  patternValidate: RegExp;
}

const InputForm: FC<CProps & Props> = (props) => {
  const { name, control, patternValidate, onChange, type, maxValue, ...other } =
    props;
  const renderInput = (value, onChangeFn) => {
    const regex = new RegExp(patternValidate);
    return (
      <Input
        onChange={(e) => {
          const valueTarget = e?.target?.value || '';

          if (regex.test(valueTarget) || valueTarget === '') {
            if (type === 'number' && Number(valueTarget) < maxValue) {
              onChangeFn(valueTarget);
              onChange?.(e);
            }
            if (type !== 'number') {
              onChangeFn(valueTarget);
              onChange?.(e);
            }
          }
        }}
        className={styles.inputCustom}
        name={name}
        value={regex.test(value) ? value : ''}
        {...other}
      />
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => renderInput(field.value, field.onChange)}
    />
  );
};
export default InputForm;
