import cx from 'classnames';
import {
  ReactElement,
  forwardRef,
  ForwardRefRenderFunction,
  MutableRefObject,
  ButtonHTMLAttributes,
} from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export enum ButtonType {
  Primary = 'primary',
  PrimaryLight = 'PrimaryLight',
  Outline = 'outline',
  OutlineDangerous = 'outline-dangerous',
  OutlineGray = 'OutlineGray',
  Orange = 'orange',
  Green = 'green',
  Blue = 'blue',
  BlueChart = 'BlueChart',
  UnderLineDangerous = 'UnderLineDangerous',
  Dangerous = 'dangerous',
  Select = 'select',
  Cancel = 'cancel',
  CancelOutline = 'CancelOutline',
  Yellow = 'yellow',
}

export enum ButtonSize {
  Large = 'l',
  Medium = 'm',
  Small = 's',
  XSmall = 'xs',
  IconLarge = 'icl',
  IconMedium = 'icm',
  IconSmall = 'ics',
  IconSmallAction = 'icsA',
  IconSmall2Action = 'icsA2',
}

interface Props extends ButtonHTMLAttributes<any> {
  buttonType?: typeof ButtonType[keyof typeof ButtonType];
  buttonSize?: typeof ButtonSize[keyof typeof ButtonSize];
  size?: typeof ButtonSize[keyof typeof ButtonSize];
  innerRef?: MutableRefObject<HTMLButtonElement>;
  renderPrefix?: (() => ReactElement) | ReactElement;
  renderSuffix?: (() => ReactElement) | ReactElement;
  classPrefix?: string;
  classSuffix?: string;
  disabledCss?: boolean;
  loading?: boolean;
}

const Button: ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  props,
  ref,
) => {
  const {
    buttonType = ButtonType.Primary,
    size,
    buttonSize = size || ButtonSize.Medium,
    children,
    className,
    innerRef,
    renderPrefix,
    renderSuffix,
    classPrefix,
    classSuffix,
    disabledCss,
    disabled,
    loading,
    ...other
  } = props;

  return (
    <button
      type="button"
      ref={innerRef || ref}
      className={cx(
        'button',
        {
          cancel: buttonType === ButtonType.Cancel,
          select: buttonType === ButtonType.Select,
          primary: buttonType === ButtonType.Primary,
          'cancel-outline': buttonType === ButtonType.CancelOutline,
          orange: buttonType === ButtonType.Orange,
          green: buttonType === ButtonType.Green,
          blueChart: buttonType === ButtonType.BlueChart,
          blue: buttonType === ButtonType.Blue,
          yellow: buttonType === ButtonType.Yellow,
          dangerous: buttonType === ButtonType.Dangerous,
          outline: buttonType === ButtonType.Outline,
          'outline-gray': buttonType === ButtonType.OutlineGray,
          'underline-dangerous': buttonType === ButtonType.UnderLineDangerous,
          'outline-dangerous': buttonType === ButtonType.OutlineDangerous,
          'primary-light': buttonType === ButtonType.PrimaryLight,
          disabled: disabledCss,
          medium: buttonSize === ButtonSize.Medium,
          large: buttonSize === ButtonSize.Large,
          small: buttonSize === ButtonSize.Small,
          'x-small': buttonSize === ButtonSize.XSmall,
          iconMedium: buttonSize === ButtonSize.IconMedium,
          iconLarge: buttonSize === ButtonSize.IconLarge,
          iconSmall: buttonSize === ButtonSize.IconSmall,
          iconSmallAction: buttonSize === ButtonSize.IconSmallAction,
          iconSmall2Action: buttonSize === ButtonSize.IconSmall2Action,
        },
        className,
      )}
      disabled={disabled || loading}
      {...other}
    >
      {renderPrefix && <span className={classPrefix}>{renderPrefix}</span>}
      {loading ? <LoadingOutlined /> : children}
      {renderSuffix && <span className={classSuffix}>{renderSuffix}</span>}
    </button>
  );
};
export default forwardRef<HTMLButtonElement, Props>(Button);
