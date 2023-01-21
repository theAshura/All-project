import { FC } from 'react';
import { Controller, Control } from 'react-hook-form';
import InputMention, {
  InputMentionProps,
} from 'components/ui/input-mention/InputMention';

interface InputMentionFormProps {
  control?: Control;
  name?: string;
}

const InputMentionForm: FC<InputMentionFormProps & InputMentionProps> = (
  props,
) => {
  const { name, control, ...other } = props;

  const renderSelect = (value?, onChange?) => (
    <InputMention onChange={onChange} value={value} {...other} />
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
export default InputMentionForm;
