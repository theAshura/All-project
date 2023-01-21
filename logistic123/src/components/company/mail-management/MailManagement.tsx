import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import ModalChooseUser from 'components/mail-creation/modal-choose-user/ModalChooseUser';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import InputWithTags from 'components/ui/input-with-tags/InputWithTags';
import Input from 'components/ui/input/Input';
import { COMPANY_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/company.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import cloneDeep from 'lodash/cloneDeep';
import { useCallback, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { v4 } from 'uuid';
import { ICInformation } from '../../common/icon/ICInformation';
import styles from './mail-management.module.scss';

const MailManagement = ({
  control,
  setValue,
  register,
  disabled,
  errors,
  watch,
  setError,
  clearErrors,
  dynamicLabels,
}) => {
  const recipientEmailWatch = watch('recipientEmails');
  const isUseSystemEmailWatch = watch('isUseSystemEmail');

  const [modalSelectUserVisible, openModalSelectUser] = useState(false);

  const closeSelectUser = useCallback(() => {
    openModalSelectUser(false);
  }, []);

  return (
    <Row>
      <Col xs={12}>
        <p className={cx('fw-bold mb-0', styles.titleForm)}>
          {' '}
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['Mail management'],
          )}
        </p>
        <div className={styles.subLabel}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['Mail address of sender'],
          )}
        </div>
      </Col>
      <Col xs={6} className="mb-3">
        <RadioForm
          name="isUseSystemEmail"
          control={control}
          disabled={disabled}
          radioOptions={[
            {
              value: true,
              label: renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS.iNautix,
              ),
            },
            {
              value: false,
              label: renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS.Company,
              ),
            },
          ]}
        />
      </Col>
      <Col xs={6} className="mb-3">
        {!isUseSystemEmailWatch && (
          <Input
            maxLength={128}
            messageRequired={errors?.senderEmail?.message || ''}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              COMPANY_DYNAMIC_DETAIL_FIELDS['Enter sender mail'],
            )}
            label={renderDynamicLabel(
              dynamicLabels,
              COMPANY_DYNAMIC_DETAIL_FIELDS['Sender mail'],
            )}
            {...register('senderEmail')}
            isRequired
            disabled={disabled}
          />
        )}
      </Col>
      {isUseSystemEmailWatch && (
        <Col xs={12} className="mb-3">
          <div className={styles.badgeMail}>
            <ICInformation fill="#3B9FF3" />
            <b>
              {renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS[
                  'The mail will be sent by default i-Nautix email address'
                ],
              )}
            </b>
          </div>
        </Col>
      )}
      <Col xs={12} className={styles.wrapInputTag}>
        <div className={styles.label}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS.Recipient,
          )}
          {/* <span className={styles.dotRequired}>*</span> */}
          <Tooltip
            placement="topLeft"
            title={renderDynamicLabel(
              dynamicLabels,
              COMPANY_DYNAMIC_DETAIL_FIELDS[
                'Please enter to add the mail address'
              ],
            )}
            color="#A5A3A9"
          >
            <img
              src={images.icons.icInfoCircle}
              alt="icInfoCircle"
              className={styles.infoIcon}
            />
          </Tooltip>
        </div>
        <div className="w-100">
          <div className={cx(styles.wrapInfo)}>
            <InputWithTags
              key="companyTagsInput"
              onChange={(e) => {
                setValue('recipientEmails', e);
                clearErrors('recipientEmails');
              }}
              disabled={disabled}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Enter recipient'],
              )}
              listTags={recipientEmailWatch}
            />
          </div>
          {errors?.recipientEmails?.message && (
            <div className={styles.messageError}>
              {errors?.recipientEmails?.message || ''}
            </div>
          )}
        </div>
        {/* <div>
          <Button
            className={styles.btnSelect}
            buttonType={ButtonType.Outline}
            onClick={handleSelectUser}
            disabled={disabled}
          >
            Select
          </Button>
        </div> */}
      </Col>
      <ModalChooseUser
        isOpen={modalSelectUserVisible}
        onClose={closeSelectUser}
        mailSelected={recipientEmailWatch}
        dynamicLabels={dynamicLabels}
        onSaveData={(e) => {
          const data = e.map((i) => ({
            id: i.id,
            value: i.email,
            isFocus: false,
            isTag: true,
          }));
          const list = cloneDeep(recipientEmailWatch);
          list.pop();
          setValue(
            'recipientEmails',
            list?.concat([
              ...data,
              { id: v4(), value: '', isFocus: false, isTag: false },
            ]),
          );
        }}
      />
    </Row>
  );
};

export default MailManagement;
