import { yupResolver } from '@hookform/resolvers/yup';
import {
  createTravelDocumentApi,
  getDetailTravelDocumentApi,
  updateTravelDocumentApi,
} from 'api/user.api';
import images from 'assets/images/images';
import cx from 'classnames';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';

import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';

import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import SelectUI from 'components/ui/select/Select';
import { formatDateIso, formatDateLocalWithTime } from 'helpers/date.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, Modal, ModalProps, Row } from 'reactstrap';
import { getCountryActions } from 'store/user/user.action';
import * as yup from 'yup';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import styles from './travel-document.module.scss';

const DOCUMENT_TYPES_OPTIONS = [
  {
    label: 'Passport',
    value: 'Passport',
  },
  {
    label: 'VISA',
    value: 'VISA',
  },
];

const defaultValues = {
  userId: '',
  type: null,
  number: '',
  issuedDate: '',
  expiryDate: '',
  issueCountry: [],
  issuePlace: '',
  attachments: [],
  isVerified: false,
};

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  classesName?: string;
  onSuccess: () => void;
  isEdit?: boolean;
  recordId?: string;
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalEditTravelDocument: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  modalClassName,
  contentClassName,
  classesName,
  onSuccess,
  isEdit,
  recordId,
  disabled,
  dynamicLabels,
  ...other
}) => {
  const schema = yup.object().shape({
    type: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    number: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    issuedDate: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    expiryDate: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    issueCountry: yup
      .array()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    isVerified: yup
      .boolean()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { listCountry } = useSelector((state) => state.user);
  const { userDetailResponse } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditFile, setEditFile] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyUser, setVerifyUser] = useState<any>(null);
  const { id } = useParams<{ id: string }>();

  const typeWatch = watch('type');
  const numberWatch = watch('number');

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (recordId && !isEdit) {
      setEditFile(false);
      return;
    }
    setEditFile(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (recordId && isOpen) {
      getDetailTravelDocumentApi(recordId)
        .then((res) => {
          const { data } = res;
          if (data?.isVerified) {
            setViewOnly(true);
          }
          setValue('type', data?.type || null);
          setValue('number', data?.number || '');
          setValue(
            'issuedDate',
            data?.issuedDate ? moment(data?.issuedDate) : null,
          );
          setValue(
            'expiryDate',
            data?.expiryDate ? moment(data?.expiryDate) : null,
          );
          const countryValue = listCountry?.find(
            (i) => i?.name === data?.issueCountry,
          );
          const country = {
            image: countryValue?.flagImg,
            label: data?.issueCountry,
            value: data?.issueCountry,
          };
          setValue('issueCountry', country?.value ? [country] : null);
          setValue('issuePlace', data?.issuePlace || '');
          setValue(
            'attachments',
            data?.attachments?.length ? data?.attachments : [],
          );
          setValue('isVerified', data?.isVerified);
          setVerifyUser({
            username: data?.verifyUser?.username,
            verifiedAt: data?.verifiedAt,
          });
        })
        .catch((err) => toastError(err?.message || 'Something went wrong!'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, recordId]);

  const closeAndClearData = useCallback(() => {
    onClose();
    setEditFile(false);
    setViewOnly(false);
    setVerifyUser(null);
    reset(defaultValues);
  }, [onClose, reset]);

  const onSubmitForm = useCallback(
    (data: any) => {
      const bodyParams = {
        ...data,
        id: recordId,
        userId: id || userDetailResponse?.id,
        issuedDate: formatDateIso(data?.issuedDate),
        expiryDate: formatDateIso(data?.expiryDate),
        attachments: data?.attachments,
        issueCountry: data?.issueCountry?.[0]?.value,
        issuePlace: data?.issuePlace?.trim(),
      };
      setLoading(true);
      if (isEditFile && recordId) {
        updateTravelDocumentApi(bodyParams)
          .then((res) => {
            toastSuccess(
              renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                  'You have updated successfully'
                ],
              ),
            );
            onSuccess();
            closeAndClearData();
            setLoading(false);
          })
          .catch((err) => {
            toastError(
              err?.message ||
                renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                    'Something went wrong!'
                  ],
                ),
            );
            setLoading(false);
          });
        return;
      }
      createTravelDocumentApi(bodyParams)
        .then((res) => {
          toastSuccess(
            renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                'You have created successfully'
              ],
            ),
          );
          onSuccess();
          closeAndClearData();
          setLoading(false);
        })
        .catch((err) => {
          toastError(
            err?.message ||
              renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Something went wrong!'],
              ),
          );
          setLoading(false);
        });
    },
    [
      recordId,
      id,
      userDetailResponse?.id,
      isEditFile,
      dynamicLabels,
      onSuccess,
      closeAndClearData,
    ],
  );

  const countryOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item?.name || '',
        label: item?.name || '',
        image: item?.flagImg || '',
      })),
    [listCountry],
  );

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <div>
          {renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Travel document'],
          )}
        </div>
        <div className={styles.closeBtn} onClick={closeAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={styles.content}>
        <Row>
          <Col xs={4} className={styles.wrapForm}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Document type'],
              )}
              data={DOCUMENT_TYPES_OPTIONS}
              name="type"
              id="type"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              messageRequired={errors?.type?.message || ''}
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              disabled={disabled || viewOnly || !isEditFile}
              isRequired
              dynamicLabels={dynamicLabels}
            />
          </Col>
          <Col xs={4} className={styles.wrapForm}>
            <div className={styles.label}>
              {typeWatch
                ? `${typeWatch} ${renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.number,
                  )}`
                : renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                      'Passport/Visa number'
                    ],
                  )}
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({
                [styles.disabledInput]: disabled || viewOnly || !isEditFile,
              })}
              value={numberWatch}
              onChange={(e) => {
                // if (Number(e.target.value) >= 0) {
                setError('number', null);
                setValue('number', e.target.value);
                // }
              }}
              placeholder={
                typeWatch
                  ? `${renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Enter,
                    )} ${String(typeWatch).toLowerCase()} ${renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.number,
                    )}`
                  : renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'Enter passport/ VISA number'
                      ],
                    )
              }
              isRequired
              disabled={disabled || viewOnly || !isEditFile}
              messageRequired={errors?.number?.message || ''}
              maxLength={128}
            />
          </Col>
          <Col xs={4} className={styles.wrapForm}>
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Date of issue'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>
            <DateTimePicker
              wrapperClassName="w-100"
              className="w-100"
              control={control}
              disabled={disabled || viewOnly || !isEditFile}
              name="issuedDate"
              maxDate={undefined}
              messageRequired={errors?.issuedDate?.message || ''}
              isRequired
              inputReadOnly
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col xs={4}>
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Date of expiry'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>
            <DateTimePicker
              wrapperClassName="w-100"
              className="w-100"
              control={control}
              disabled={disabled || viewOnly || !isEditFile}
              name="expiryDate"
              maxDate={undefined}
              messageRequired={errors?.expiryDate?.message || ''}
              isRequired
              inputReadOnly
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col xs={4} style={{ paddingTop: 3 }}>
            <AsyncSelectForm
              messageRequired={errors?.issueCountry?.message}
              control={control}
              name="issueCountry"
              disabled={disabled || viewOnly || !isEditFile}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Country of issue'],
              )}
              isRequired
              titleResults={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected cities'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              hasImage
              onChangeSearch={(value: string) =>
                dispatch(getCountryActions.request({ content: value }))
              }
              options={countryOptionProps}
              dynamicLabels={dynamicLabels}
              flagImage
            />
          </Col>
          <Col xs={4}>
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Issue place'],
              )}
            </div>
            <Input
              className={cx({
                [styles.disabledInput]: disabled || viewOnly || !isEditFile,
              })}
              {...register('issuePlace')}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter issue place'],
              )}
              isRequired
              disabled={disabled || viewOnly || !isEditFile}
              messageRequired={errors?.issuePlace?.message || ''}
              maxLength={128}
            />
          </Col>
        </Row>
        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.AUDIT_INSPECTION}
              subFeaturePage={SubFeatures.AUDIT_INSPECTION_WORKSPACE}
              scrollVerticalAttachment
              loading={loading}
              isEdit={isEditFile}
              disable={disabled || viewOnly || !isEditFile}
              // isCreate={!isView}
              value={field.value}
              buttonName={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Attach,
              )}
              onchange={field.onChange}
              dynamicLabels={dynamicLabels}
            />
          )}
        />

        <Col xs={12} className={styles.label}>
          {renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Verified,
          )}
        </Col>
        <Col xs={12} className="mb-3">
          <RadioForm
            name="isVerified"
            control={control}
            disabled={disabled || viewOnly || !isEditFile}
            radioOptions={[
              {
                value: true,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Yes,
                ),
                disabled,
              },
              {
                value: false,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.No,
                ),
                disabled,
              },
            ]}
          />
          <div className={styles.messageError}>
            {errors?.isVerified?.message || ''}
          </div>
        </Col>
        {verifyUser?.username && (
          <div className={styles.verifiedBy}>
            {renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Verified by'],
            )}{' '}
            {verifyUser?.username}{' '}
            {renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.at,
            )}{' '}
            {formatDateLocalWithTime(verifyUser?.verifiedAt)}
          </div>
        )}
      </div>
      <div
        className={cx(
          styles.footer,
          'd-flex justify-content-end align-items-center',
        )}
      >
        <Button
          className={styles.btnCancel}
          buttonType={ButtonType.CancelOutline}
          onClick={closeAndClearData}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
        </Button>
        <Button
          buttonType={ButtonType.Primary}
          buttonSize={ButtonSize.Medium}
          disabled={disabled || viewOnly || loading}
          disabledCss={disabled || viewOnly || loading}
          onClick={
            !isEditFile ? () => setEditFile(true) : handleSubmit(onSubmitForm)
          }
        >
          {!isEditFile
            ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Edit)
            : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalEditTravelDocument;
