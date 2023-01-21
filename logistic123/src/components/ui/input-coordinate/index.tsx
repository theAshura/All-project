/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
import Radio from 'antd/lib/radio';
import images from 'assets/images/images';
import cx from 'classnames';
import { CoordinateType } from 'constants/common.const';
import { PORT_FIELDS_DETAILS } from 'constants/dynamic/port.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { convertLatDMS, convertLongDMS } from 'helpers/utils.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import Input from '../input/Input';
import './input-coordinate.scss';

export interface InputCoordinateProps {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  coordinateType?: CoordinateType;
  isRequired?: boolean;
  messageRequired?: string;
  onChangeValue?: (value?) => void;
  valueCoordinate?: string;
  dynamicLabels?: IDynamicLabel;
}

const InputCoordinate: FC<InputCoordinateProps> = (props) => {
  const {
    disabled,
    readOnly,
    coordinateType = CoordinateType.LATITUDE,
    isRequired,
    messageRequired,
    valueCoordinate,
    onChangeValue,
    dynamicLabels,
  } = props;
  const isLatitude = useMemo(
    () => coordinateType === CoordinateType.LATITUDE,
    [coordinateType],
  );
  const [radio, setRadio] = useState();
  const [degree, setDegree] = useState();
  const [minute, setMinute] = useState<any>();
  const [isChange, setIsChange] = useState(false);

  let start = 0;

  const onChange = (key?: string, value?) => {
    setIsChange(true);
    switch (key) {
      case 'radio':
        setRadio(value);
        break;
      case 'degree':
        let valDegree = value.target.value;
        valDegree = valDegree.replace(/(-[^0-9.]+)/, '');
        setDegree(valDegree);
        break;
      case 'minute':
        start = value.target.selectionStart;
        let val = value.target.value;
        val = val.replace(/([^0-9.]+)/, '');
        val = val.replace(/^(\.)/, '');
        const match = /(\d{0,2})[^.]*((?:\.\d{0,2})?)/g.exec(val);
        const newValue = match[1] + match[2];
        value.target.value = newValue;
        setMinute(newValue);
        if (val.length > 0) {
          value.target.value = Number(newValue).toFixed(2);
          if (match[0].length === 5 && match[2] === '.00') {
            value.target.setSelectionRange(start + 1, start + 1);
          } else value.target.setSelectionRange(start, start);
          setMinute(Number(newValue).toFixed(2));
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (!(!radio && !minute && !degree)) {
      const mm = minute?.split('.')[0] || '00';
      const ss = minute?.split('.')[1] || '00';
      const changeValue = `${degree || 0}°${mm}'${ss}.00''${radio}`;
      onChangeValue(changeValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radio, minute, degree]);

  useEffect(() => {
    if (!isChange) {
      let convert;
      if (isLatitude) {
        convert = convertLatDMS(valueCoordinate);
      } else {
        convert = convertLongDMS(valueCoordinate);
      }

      if (convert) {
        setDegree(convert.degree);
        setMinute(`${convert.minute}.${convert?.second?.split('.')[0]}`);
        setRadio(convert.direct);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueCoordinate]);

  return (
    <div className={cx('input-coordinate-wrapper')}>
      <Row>
        <Col className="group-radio">
          <div className="d-flex align-items-start">
            <div className={cx('input-coordinate-label')}>
              {isLatitude
                ? renderDynamicLabel(
                    dynamicLabels,
                    PORT_FIELDS_DETAILS.Latitude,
                  )
                : renderDynamicLabel(
                    dynamicLabels,
                    PORT_FIELDS_DETAILS.Longitude,
                  )}
            </div>
            {isRequired && (
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            )}
          </div>
          <div className={cx('radio d-flex align-items-center')}>
            <Radio.Group
              disabled={disabled}
              onChange={(value) => onChange('radio', value.target.value)}
              value={radio}
            >
              <Radio
                value={
                  isLatitude
                    ? renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.N)
                    : renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.E)
                }
                className={cx('input-coordinate-label radio-button')}
              >
                {isLatitude
                  ? renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.N)
                  : renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.E)}
              </Radio>
              <Radio
                value={
                  isLatitude
                    ? renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.S)
                    : renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.W)
                }
                className={cx('input-coordinate-label radio-button')}
              >
                {isLatitude
                  ? renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.S)
                  : renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.W)}
              </Radio>
            </Radio.Group>
          </div>
        </Col>
        <Col>
          <Input
            value={degree}
            className="custom-input"
            onChange={(value) => onChange('degree', value)}
            label={
              isLatitude
                ? renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.DD)
                : renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.DDD)
            }
            disabled={disabled}
            readOnly={readOnly}
            placeholder={isLatitude ? '00' : '000'}
            type="text"
            pattern="^-?[0-9]*"
            maxLength={isLatitude && Number(degree || 0) >= 0 ? 2 : 3}
          />
        </Col>
        <Col>
          <Input
            onChange={(value) => onChange('minute', value)}
            value={minute}
            label={renderDynamicLabel(
              dynamicLabels,
              PORT_FIELDS_DETAILS['MM.SS'],
            )}
            disabled={disabled}
            className="custom-input"
            readOnly={readOnly}
            placeholder="00.00"
          />
        </Col>
        <Col />
      </Row>
      {messageRequired && (
        <div className="message-required mt-2">{messageRequired}</div>
      )}
    </div>
  );
};

export default InputCoordinate;
