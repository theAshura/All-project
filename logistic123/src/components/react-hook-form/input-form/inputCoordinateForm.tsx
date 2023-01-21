import InputCoordinate, {
  InputCoordinateProps,
} from 'components/ui/input-coordinate';
import { Props } from 'components/ui/input/Input';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';

interface CProps extends InputCoordinateProps {
  control: Control;
  name: string;
  dynamicLabels?: IDynamicLabel;
}

const InputCoordinateForm: FC<CProps & Props> = (props) => {
  const { name, control, ...other } = props;

  const renderInput = (value, onChange) => (
    <InputCoordinate
      onChangeValue={onChange}
      valueCoordinate={value}
      {...other}
    />
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => renderInput(field.value, field.onChange)}
    />
  );
};
export default InputCoordinateForm;
