import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import { OptionsType } from 'components/common/options-container/OptionsContainer';
import CheckBox from 'components/ui/checkbox/Checkbox';
import Input from 'components/ui/input/Input';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import Radio from 'components/ui/radio/Radio';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { formatDateNoTime } from 'helpers/date.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  GetAuditCheckListCode,
  GetAuditCheckListDetailResponse,
} from 'models/api/audit-checklist/audit-checklist.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, Fragment, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import styles from './preview-modal.module.scss';

interface Props {
  modal: boolean;
  toggle: () => void;
  header?: string;
  chkCode?: GetAuditCheckListCode;
  data?: GetAuditCheckListDetailResponse;
  bodyClassName?: string;
  dynamicLabels?: IDynamicLabel;
}

const PreviewModal: FC<Props> = (props) => {
  const { modal, toggle, data, chkCode, dynamicLabels } = props;

  const renderContent = useCallback(
    () => (
      <div className={styles.wrapContent}>
        <h4 className={cx(styles.title, styles.titleBold)}>{data?.name}</h4>
        <Row className="pt-1 mx-0">
          {chkCode?.code || data?.code ? (
            <Col className={styles.noInput}>
              <p className={cx(styles.text, styles.title)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Checklist code'],
                )}
              </p>
              <p className={cx(styles.text, styles.content)}>
                {chkCode?.code || data?.code}
              </p>
            </Col>
          ) : null}
          {data?.revisionNumber ? (
            <Col className={styles.noInput}>
              <p className={cx(styles.text, styles.title)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Revision number'],
                )}
              </p>
              <p className={cx(styles.text, styles.content)}>
                {data?.revisionNumber}
              </p>
            </Col>
          ) : null}
        </Row>
        <Row className="pt-3 mx-0">
          {formatDateNoTime(data?.revisionDate) ? (
            <Col className={styles.noInput}>
              <p className={cx(styles.text, styles.title)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Revision date'],
                )}
              </p>
              <p className={cx(styles.text, styles.content)}>
                {formatDateNoTime(data?.revisionDate)}
              </p>
            </Col>
          ) : null}
          {formatDateNoTime(data?.publishedDate) ? (
            <Col className={styles.noInput}>
              <p className={cx(styles.text, styles.title)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Published date'],
                )}
              </p>
              <p className={cx(styles.text, styles.content)}>
                {formatDateNoTime(data?.publishedDate)}
              </p>
            </Col>
          ) : null}
        </Row>
        <div className={styles.divider} />
        {data?.questions?.length > 0
          ? data?.questions?.map((i, index) => (
              <Fragment key={i.id}>
                <div className="d-flex align-items-start pb-2">
                  <div
                    className={cx(styles.text, styles.title, 'limit-line-text')}
                  >
                    {i.order}.
                    {i.isMandatory && (
                      <img
                        src={images.icons.icRequiredAsterisk}
                        alt="required"
                        className={styles.imgTop}
                      />
                    )}{' '}
                    <Tooltip
                      placement="topLeft"
                      title={i.question}
                      color="#3B9FF3"
                    >
                      {i.question}
                    </Tooltip>
                  </div>
                </div>

                <div className={styles.answerBox}>
                  {i.answerOptions?.map((option) => {
                    if (i.type.includes(OptionsType.COMBO)) {
                      return (
                        <CheckBox
                          key={option.content}
                          label={option.content}
                          disabled
                          labelClassName={styles.label}
                          name={i.question}
                          value={option.content}
                        />
                      );
                    }
                    return (
                      <Radio
                        label={option.content}
                        key={option.content}
                        disabled
                        labelClassName={styles.label}
                        className={styles.radio}
                        name={i.question}
                        value={option.content}
                      />
                    );
                  })}
                  {i.hint ? (
                    <p className={styles.hint}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Hint,
                      )}
                      : {i.hint}
                    </p>
                  ) : null}
                  {i.hasRemark ? (
                    <Input
                      type="input "
                      disabled
                      name="remarks"
                      placeholder=""
                    />
                  ) : null}
                </div>
                {/* {index < data?.questions?.length - 1 ? (
                  <div className={styles.divider} />
                ) : null} */}
              </Fragment>
            ))
          : null}
      </div>
    ),
    [
      data?.name,
      data?.code,
      data?.revisionNumber,
      data?.revisionDate,
      data?.publishedDate,
      data?.questions,
      chkCode?.code,
      dynamicLabels,
    ],
  );

  return (
    <Modal
      content={renderContent()}
      isOpen={modal}
      toggle={toggle}
      title={renderDynamicLabel(
        dynamicLabels,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Checklist preview'],
      )}
      modalType={ModalType.CENTER}
    />
  );
};

export default PreviewModal;
