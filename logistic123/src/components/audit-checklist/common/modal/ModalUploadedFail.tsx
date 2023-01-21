import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import ModalComponent from 'components/ui/modal/Modal';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC } from 'react';
import { Col, Row } from 'reactstrap';

import styles from './modal-loading.module.scss';

export interface QuestionErr {
  fieldName: string;
  messages: string[];
}

interface ModalUploadedFailProps {
  isOpen: boolean;
  toggle: () => void;
  data: QuestionErr[];
  dynamicLabel: IDynamicLabel;
}

const ModalUploadedFail: FC<ModalUploadedFailProps> = (props) => {
  const { isOpen, toggle, data, dynamicLabel } = props;

  const renderForm = () => (
    <div>
      <Row className={cx(styles.titleRow, 'py-2')}>
        <Col md={2}>
          {renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Row No'
            ],
          )}
        </Col>
        <Col md={10}>
          {' '}
          {renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Error,
          )}
        </Col>
      </Row>
      <div className={styles.wrapRow}>
        {data?.map((item) => (
          <Row className={cx(styles.row, 'py-2')} key={item?.fieldName}>
            <Col md={2} className="d-flex align-items-center">
              <div> {item.fieldName}</div>
            </Col>
            <Col md={10}>
              {item?.messages?.map((i) => (
                <div key={i}>{`- ${i}`}</div>
              ))}
            </Col>
          </Row>
        ))}
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="mt-2 d-flex justify-content-end">
      <Button
        onClick={() => {
          toggle();
        }}
        buttonSize={ButtonSize.Medium}
        buttonType={ButtonType.Primary}
      >
        {renderDynamicLabel(
          dynamicLabel,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Close,
        )}
      </Button>
    </div>
  );

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={() => {
        toggle();
      }}
      title={renderDynamicLabel(
        dynamicLabel,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
          'Uploaded fail'
        ],
      )}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalUploadedFail;
