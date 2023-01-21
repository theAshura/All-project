import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import ModalChooseUser from 'components/mail-creation/modal-choose-user/ModalChooseUser';
import Button, { ButtonType } from 'components/ui/button/Button';
import InputWithTags from 'components/ui/input-with-tags/InputWithTags';
import { MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/mailTemplate.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import cloneDeep from 'lodash/cloneDeep';
import { useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { v4 } from 'uuid';
import styles from './form.module.scss';

const InputMails = {
  TO: 'To',
  CC: 'Cc',
  BCC: 'Bcc',
};

const MailManagement = ({
  messageRequired,
  setValue,
  setError,
  getValues,
  watch,
  disabled = false,
  dynamicFields,
}) => {
  const toWatch = watch('To');
  const ccWatch = watch('Cc');
  const bccWatch = watch('Bcc');

  const [inputMailSelected, setInputMailSelected] = useState(null);

  const removeDuplicateData = useCallback((data) => {
    const listDataNotDuplicate = [];
    data.forEach((item) => {
      if (!listDataNotDuplicate.find((i) => i.value === item.value)) {
        listDataNotDuplicate.push(item);
      }
    });
    return listDataNotDuplicate;
  }, []);
  const [modalSelectUserVisible, openModalSelectUser] = useState(false);

  const handleSelectUser = useCallback((inputName: string) => {
    setInputMailSelected(inputName);
    openModalSelectUser(true);
  }, []);

  const closeSelectUser = useCallback(() => {
    openModalSelectUser(false);
  }, []);

  const handleDataSelected = useCallback(
    (e) => {
      if (inputMailSelected) {
        const data = e.map((i) => ({
          id: i.id,
          value: i.email,
          isFocus: false,
          isTag: true,
        }));
        const list = cloneDeep(getValues(inputMailSelected));
        list.pop();
        const listNewEmails = list?.concat([
          ...data,
          { id: v4(), value: '', isFocus: false, isTag: false },
        ]);
        setValue(inputMailSelected, removeDuplicateData(listNewEmails));
      }
    },
    [getValues, inputMailSelected, removeDuplicateData, setValue],
  );

  const mailSelected = useMemo(() => {
    switch (inputMailSelected) {
      case InputMails.TO:
        return toWatch;
      case InputMails.CC:
        return ccWatch;
      case InputMails.BCC:
        return bccWatch;
      default:
        return toWatch;
    }
  }, [bccWatch, ccWatch, inputMailSelected, toWatch]);

  return (
    <div className={cx('mt-2', styles.wrapEmail)}>
      <Row className={styles.rowWrap}>
        <Col xs={1}>
          <div className={styles.label}>
            {renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.To,
            )}
            <span className={styles.dotRequired}>*</span>
            {!disabled && (
              <Tooltip
                placement="topLeft"
                title={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Please enter to add the mail address'
                  ],
                )}
                color="#a9a4a3"
              >
                <img
                  src={images.icons.icInfoCircleGray}
                  alt="icInfoCircle"
                  className={styles.infoIcon}
                />
              </Tooltip>
            )}
          </div>
        </Col>
        <Col xs={9} md={10}>
          <div className={cx({ [styles.wrapInfo]: disabled }, 'me-2')}>
            <InputWithTags
              disabled={disabled}
              placeholder={
                !disabled &&
                renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Enter to'],
                )
              }
              key="toEmail"
              onChange={(e) => {
                setValue('To', e);
                setError('To', null);
              }}
              listTags={toWatch}
            />
          </div>
          <div className={styles.messageError}>{messageRequired}</div>
        </Col>
        <Col xs={2} md={1} className="d-flex justify-content-end">
          {!disabled && (
            <Button
              className={styles.btnSelect}
              disabled={disabled}
              buttonType={ButtonType.Outline}
              onClick={() => handleSelectUser(InputMails.TO)}
            >
              {renderDynamicLabel(
                dynamicFields,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Select,
              )}
            </Button>
          )}
        </Col>
      </Row>
      <Row className={styles.rowWrap}>
        <Col xs={1}>
          <div className={styles.label}>
            {renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Cc,
            )}
            {!disabled && (
              <Tooltip
                placement="topLeft"
                title={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Please enter cc add the mail address'
                  ],
                )}
                color="#A5A3A9"
              >
                <img
                  src={images.icons.icInfoCircleGray}
                  alt="icInfoCircle"
                  className={styles.infoIcon}
                />
              </Tooltip>
            )}
          </div>
        </Col>
        <Col xs={9} md={10}>
          <div className={cx({ [styles.wrapInfo]: disabled }, 'me-2')}>
            <InputWithTags
              disabled={disabled}
              placeholder={
                !disabled &&
                renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Enter cc'],
                )
              }
              key="ccEmail"
              onChange={(e) => {
                setValue('Cc', e);
              }}
              listTags={ccWatch}
            />
          </div>
        </Col>
        <Col xs={2} md={1} className="d-flex justify-content-end">
          {!disabled && (
            <Button
              className={styles.btnSelect}
              disabled={disabled}
              buttonType={ButtonType.Outline}
              onClick={() => handleSelectUser(InputMails.CC)}
            >
              {renderDynamicLabel(
                dynamicFields,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Select,
              )}
            </Button>
          )}
        </Col>
      </Row>
      <Row className={styles.rowWrap}>
        <Col xs={1}>
          <div className={styles.label}>
            {renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Bcc,
            )}
            {!disabled && (
              <Tooltip
                placement="topLeft"
                title={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Please enter bcc add the mail address'
                  ],
                )}
                color="#A5A3A9"
              >
                <img
                  src={images.icons.icInfoCircleGray}
                  alt="icInfoCircle"
                  className={styles.infoIcon}
                />
              </Tooltip>
            )}
          </div>
        </Col>
        <Col xs={9} md={10}>
          <div className={cx({ [styles.wrapInfo]: disabled }, 'me-2')}>
            <InputWithTags
              key="bccEmail"
              disabled={disabled}
              placeholder={
                !disabled &&
                renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Enter bcc'],
                )
              }
              onChange={(e) => {
                setValue('Bcc', e);
              }}
              listTags={bccWatch}
            />
          </div>
        </Col>
        <Col xs={2} md={1} className="d-flex justify-content-end">
          {!disabled && (
            <Button
              className={styles.btnSelect}
              disabled={disabled}
              buttonType={ButtonType.Outline}
              onClick={() => handleSelectUser(InputMails.BCC)}
            >
              {renderDynamicLabel(
                dynamicFields,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Select,
              )}
            </Button>
          )}
        </Col>
      </Row>
      <ModalChooseUser
        isOpen={modalSelectUserVisible}
        onClose={closeSelectUser}
        mailSelected={mailSelected}
        autoResetData
        onSaveData={handleDataSelected}
        dynamicLabels={dynamicFields}
      />
    </div>
  );
};

export default MailManagement;
