import images from 'assets/images/images';
import cx from 'classnames';
import { KeyPress } from 'constants/common.const';
import { InputHTMLAttributes, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from 'reactstrap';
import { resetMessage } from 'store/authenticate/authenticate.action';

export enum MessageType {
  INFO = 'info',
  ERROR = 'error',
}

export interface InputSignProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  placeholder?: string;
  name?: string;
  type?: string;
  required?: boolean;
  error?: string;
  regis?: Function;
  isPassword?: boolean;
  disabled?: boolean;
  messageType?: typeof MessageType[keyof typeof MessageType];
  defaultValue?: string;
  wrapClass?: string;
}

function InputSign({
  title,
  placeholder,
  name,
  type,
  required,
  error,
  regis,
  isPassword,
  disabled,
  messageType = MessageType.ERROR,
  defaultValue,
  wrapClass,
  ...propsOther
}: InputSignProps) {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideE, setHideE] = useState(false);
  const [isKeyUp13, setIsKeyUp13] = useState(false);

  const dispatch = useDispatch();
  const message = useSelector((state) => state.authenticate.message);

  const hideError = () => {
    setHideE(false);
    if (message) {
      dispatch(resetMessage.request({ message: '' }));
    }
  };

  const onKeyUp = (e) => {
    if (e.keyCode === KeyPress.ENTER) {
      setIsKeyUp13(true);
    } else {
      setIsKeyUp13(false);
    }
  };

  return (
    <Row className={cx('rowInput', wrapClass)}>
      <FormGroup as={Row}>
        <Label className="labelInput mb-0">{title}</Label>
        <InputGroup>
          <Input
            onKeyUp={onKeyUp}
            placeholder={placeholder}
            name={name}
            type={hidePassword ? type : 'text'}
            className={`inputSign ${
              messageType === MessageType.ERROR && error
                ? 'inputSignError'
                : 'inputSignAllow'
            }`}
            required={required}
            {...regis(name)}
            defaultValue={defaultValue}
            disabled={disabled}
            onFocus={() => setHideE(true)}
            onBlur={() => hideError()}
            {...propsOther}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setHidePassword(!hidePassword)}
              className={`iconHide ${
                error ? 'iconHideError' : 'iconHideAllow'
              }`}
              disabled={disabled}
            >
              <img
                src={
                  hidePassword
                    ? images.icons.hidePassword
                    : images.icons.unHidePassword
                }
                alt="hidePassword"
              />
            </button>
          )}
        </InputGroup>

        {error && (
          <FormFeedback
            className={cx({
              hideError: isKeyUp13 ? false : hideE,
              errorInput: messageType === MessageType.ERROR,
              'input--info': messageType === MessageType.INFO,
            })}
          >
            {error && (
              <img
                className="imageValid"
                src={
                  messageType === MessageType.INFO
                    ? images.icons.icTickFull
                    : images.icons.icError
                }
                alt="error"
              />
            )}
            &nbsp; {error}
          </FormFeedback>
        )}
      </FormGroup>
    </Row>
  );
}
export default memo(InputSign);
