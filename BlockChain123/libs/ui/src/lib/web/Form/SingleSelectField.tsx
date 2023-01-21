import {
  Colors,
  ElementHeightFromSize,
  FontHeight,
  FontSize,
} from '@namo-workspace/themes';
import { useField } from 'formik';
import Select, { GroupBase, Props as SelectProps } from 'react-select';
import styled, { css } from 'styled-components';
import { ReactComponent as IcError } from '../../../assets/images/ic_error.svg';
import { InputSize, InputStyle } from '../../shared/style/input.style';
import Label from '../Label';
import Warning from '../Warning';
export interface SelectOption {
  label: string;
  value: string;
}
interface SelectHelperProps {
  hideOptionOnDisable?: boolean;
}
export interface SingleSelectProps
  extends Omit<
      SelectProps<SelectOption, false, GroupBase<SelectOption>>,
      'classNamePrefix' | 'onChange' | 'value' | 'isMulti'
    >,
    SelectHelperProps {
  name: string;
  options: SelectOption[];
  label?: string;
  size?: InputSize;
  require?: boolean;
}

export default function SingleSelectField({
  name,
  label,
  size = 'large',
  require,
  options,
  className,
  hideOptionOnDisable = false,
  ...rest
}: SingleSelectProps) {
  const [field, meta, helpers] = useField<string | undefined>(name);

  return (
    <Label label={label} require={require} className={className}>
      <SelectS
        size={size}
        {...rest}
        classNamePrefix="namo-select"
        options={options}
        value={options.find((option) => option.value === field.value) || null}
        onChange={(option) => helpers.setValue(option?.value || '')}
        onBlur={field.onBlur}
        isMulti={false}
        hideOptionOnDisable={hideOptionOnDisable}
        name={field.name}
      />
      {!!meta.error && !!meta.touched && (
        <Warning message={meta.error} icon={<IcError className="me-2" />} />
      )}
    </Label>
  );
}
export const SelectS = styled(Select<SelectOption>)<
  InputStyle & SelectHelperProps
>`
  .namo-select__control {
    border: 1px solid ${Colors.strokeLevel3};
    border-radius: 8px;
    box-shadow: none !important;
    padding: 0 8px;
    caret-color: ${Colors.primaryOrange};
    cursor: pointer;

    &:hover {
      border-color: ${Colors.strokeLevel3} !important;
    }
    ${(props) => {
      switch (props.size) {
        case 'small':
          return css`
            height: ${ElementHeightFromSize.small}px;
          `;
        case 'large':
          return css`
            height: ${ElementHeightFromSize.large}px;
          `;
        case 'medium':
        default:
          return css`
            height: ${ElementHeightFromSize.medium}px;
          `;
      }
    }}
    min-height:32px !important;

    @media (max-width: 575.98px) {
      height: 32px !important;
      font-size: ${FontSize.body4}px;
      line-height: ${FontHeight.body4}px;
    }
  }
  .namo-select__indicator {
    @media (max-width: 575.98px) {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }
  }
  .namo-select__menu {
    background: ${Colors.white};
    box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.11),
      0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    border-radius: 16px;
    overflow: hidden;
    padding: 8px 0;
  }
  .namo-select__indicator-separator {
    display: none;
  }

  .namo-select__option {
    font-weight: 400;
    font-size: 16px;
    color: ${Colors.textLevel3};
    cursor: pointer;

    &:active {
      background-color: ${Colors.background2};
    }

    @media (max-width: 575.98px) {
      font-size: ${FontSize.body4}px;
      line-height: ${FontHeight.body4}px;
    }
  }
  .namo-select__option--is-focused {
    background-color: ${Colors.background2};
  }
  .namo-select__option--is-selected {
    background-color: ${Colors.background2};
  }
  .namo-select__option--is-disabled {
    ${(props) =>
      props.hideOptionOnDisable &&
      css`
        display: none;
      `}
  }
  .namo-select__menu-list {
    max-height: 250px;
  }
`;
