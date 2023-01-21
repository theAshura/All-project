import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import ModalComponent, { ModalType } from 'components/ui/modal/Modal';
import { PlanningAndRequest } from 'models/api/planning-and-request/planning-and-request.model';
import { FC, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Input from 'components/ui/input/Input';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { formatDateTime } from 'helpers/utils.helper';
import styles from './form.module.scss';

interface ModalPRAuditorProps {
  data?: PlanningAndRequest;
  loading?: boolean;
  isShow?: boolean;
  setShow?: () => void;
  dynamicLabels?: IDynamicLabel;
}

export const ModalPRAuditor: FC<ModalPRAuditorProps> = (props) => {
  const { isShow, setShow, data, dynamicLabels } = props;
  const auditTypes = useMemo(
    () => data?.auditTypes?.map((e) => e?.name).join(', '),
    [data],
  );
  const auditorName = useMemo(
    () => data?.auditors?.map((e) => e?.username).join(', '),
    [data],
  );

  const handleCancel = () => {
    setShow();
  };

  const renderForm = () => (
    <>
      <div className={styles.wrapFormPlaning}>
        <Row>
          <Col xs="4">
            <div className={cx(styles.textTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Inspection type'],
              )}
            </div>
          </Col>
          <Col>
            <div className={cx(styles.text)}>{auditTypes}</div>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col xs="4">
            <div className={cx(styles.textTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Inspector name'],
              )}
            </div>
          </Col>
          <Col>
            <div className={cx(styles.text)}>{auditorName}</div>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col xs="4">
            <div className={cx(styles.textTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Lead inspector name'],
              )}
            </div>
          </Col>
          <Col>
            <div className={cx(styles.text)}>{data?.leadAuditor?.username}</div>
          </Col>
        </Row>
        <Row className="pt-3 mx-0">
          <Col className="ps-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Planned from date'],
              )}
              disabled
              value={formatDateTime(data?.plannedFromDate)}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Planned to date'],
              )}
              disabled
              value={formatDateTime(data?.plannedToDate)}
            />
          </Col>
        </Row>
        <Row className="pt-3 mx-0">
          <Col className="ps-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Planned from port'],
              )}
              disabled
              value={data?.fromPort?.name}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Planned to port'],
              )}
              disabled
              value={data?.toPort?.name}
            />
          </Col>
        </Row>
        <Row className="pt-3 mx-0">
          <Col className="ps-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Vessel code'],
              )}
              disabled
              value={data?.vessel?.code}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Vessel name'],
              )}
              disabled
              value={data?.vessel?.name}
            />
          </Col>
        </Row>
        <Row className="pt-3 mx-0">
          <Col className="ps-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Vessel type'],
              )}
              disabled
              value={data?.vessel?.vesselType?.name}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS.Fleet,
              )}
              disabled
              value={data?.vessel?.fleetName}
            />
          </Col>
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div className="d-flex justify-content-end mt-3">
        <Button
          buttonType={ButtonType.Outline}
          buttonSize={ButtonSize.Medium}
          className={styles.buttonCancel}
          onClick={handleCancel}
        >
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Close,
          )}
        </Button>
      </div>
    </>
  );

  return (
    <ModalComponent
      isOpen={isShow}
      toggle={() => {
        setShow();
      }}
      modalType={ModalType.CENTER}
      title={renderDynamicLabel(
        dynamicLabels,
        DETAIL_PLANNING_DYNAMIC_FIELDS['Inspection time table'],
      )}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};
