/* eslint-disable jsx-a11y/label-has-associated-control */
import cx from 'classnames';

import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { MAX_LENGTH_TEXT } from 'constants/common.const';
import {
  CreateLicensesCertificationUserParams,
  LicensesCertification,
} from 'models/api/user/user.model';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';

import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { useDispatch, useSelector } from 'react-redux';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { Col, Row } from 'antd/lib/grid';
import {
  // Features,
  RoleScope,
  // SubFeatures,
} from 'constants/roleAndPermission.const';
import Input from 'components/ui/input/Input';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import LabelUI from 'components/ui/label/LabelUI';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import SelectUI from 'components/ui/select/Select';
import { getCountryActions } from 'store/user/user.action';
import { GroupButton } from 'components/ui/button/GroupButton';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import ModalComponent from 'components/ui/modal/Modal';
import styles from './licenses-certification.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isView?: boolean;
  onSubmit: (data, idLicensesCertification?: string) => void;
  onClose: () => void;
  data?: LicensesCertification;
  dynamicLabels?: IDynamicLabel;
}

enum TYPE {
  LICENSE = 'License',
  CERTIFICATION = 'Certification',
}

const defaultValues = {
  type: null,
  name: '',
  issuedBy: '',
  issueCountry: [],
  issuedDate: null,
  expiryDate: null,
  isVerified: false,
  attachments: [],
};

const ModalLicensesCertification: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isView,
  data,
  dynamicLabels,
}) => {
  const { licensesCertification, listCountry, userDetailResponse } =
    useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.authenticate);

  const dispatch = useDispatch();
  const schema = useMemo(
    () =>
      yup.object().shape({
        type: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        name: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        issuedDate: yup
          .string()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    [dynamicLabels],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmitForm = (formData: CreateLicensesCertificationUserParams) => {
    onSubmit(formData, data ? data?.id : null);
  };

  const closeAndClearData = useCallback(() => {
    onClose();
    reset(defaultValues);
  }, [onClose, reset]);

  const countryOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item?.name || '',
        label: item?.name || '',
        image: item?.flagImg || '',
      })),
    [listCountry],
  );

  const renderFooter = () => (
    <>
      <div className="pt-4">
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={closeAndClearData}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );

  const disableVerified = useMemo(() => {
    if (data?.isVerified) {
      return true;
    }
    if (userInfo?.roleScope === RoleScope.User) {
      return true;
    }
    if (userInfo?.roleScope === RoleScope.SuperAdmin) {
      return false;
    }
    // is company of account login === company of user edit
    const company = userInfo?.parentCompanyId || userInfo?.companyId;
    if (
      userInfo?.roleScope === RoleScope.Admin &&
      company === userDetailResponse?.parentCompanyId
    ) {
      return false;
    }
    return false;
  }, [
    data?.isVerified,
    userDetailResponse?.parentCompanyId,
    userInfo?.companyId,
    userInfo?.parentCompanyId,
    userInfo?.roleScope,
  ]);
  const renderForm = () => (
    <>
      <div className={styles.content}>
        <div>
          <Row gutter={[21, 14]} className="pt-2 mx-0">
            <Col className="" span={12}>
              <SelectUI
                data={[
                  {
                    value: TYPE.LICENSE,
                    label: TYPE.LICENSE,
                  },
                  {
                    value: TYPE.CERTIFICATION,
                    label: TYPE.CERTIFICATION,
                  },
                ]}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Type,
                )}
                isRequired
                disabled={licensesCertification?.loading || isView}
                name="type"
                messageRequired={errors?.type?.message || ''}
                control={control}
                className={cx('w-100')}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                dynamicLabels={dynamicLabels}
              />
            </Col>
            <Col span={12}>
              <Input
                disabled={licensesCertification?.loading || isView}
                label={
                  watch('type') === TYPE.LICENSE
                    ? renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['License name'],
                      )
                    : renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                          'Certification name'
                        ],
                      )
                }
                isRequired
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                    'Enter license/certification name'
                  ],
                )}
                messageRequired={errors?.name?.message || ''}
                {...register('name')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col span={12}>
              <Input
                disabled={licensesCertification?.loading || isView}
                label={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Issued by'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter issued by'],
                )}
                messageRequired={errors?.issuedBy?.message || ''}
                {...register('issuedBy')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col span={12}>
              <AsyncSelectForm
                messageRequired={errors?.accountInformation?.country?.message}
                control={control}
                name="issueCountry"
                disabled={licensesCertification?.loading || isView}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Issue country'],
                )}
                titleResults={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected country'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                dynamicLabels={dynamicLabels}
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
                  dispatch(
                    getCountryActions.request({ content: value, pageSize: -1 }),
                  )
                }
                options={countryOptionProps}
              />
            </Col>
            <Col span={12}>
              <DateTimePicker
                disabled={licensesCertification?.loading || isView}
                messageRequired={errors?.issuedDate?.message || ''}
                label={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Issued date'],
                )}
                isRequired
                maxDate={moment(watch('expiryDate'))}
                className="w-100"
                id="issuedDate"
                control={control}
                name="issuedDate"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
            </Col>
            <Col span={12}>
              <DateTimePicker
                disabled={licensesCertification?.loading || isView}
                messageRequired={errors?.expiryDate?.message || ''}
                label={renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Expiry date'],
                )}
                className="w-100"
                id="expiryDate"
                minDate={moment(watch('issuedDate'))}
                control={control}
                name="expiryDate"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                control={control}
                name="attachments"
                render={({ field }) => (
                  <TableAttachment
                    scrollVerticalAttachment
                    classWrapper="p-0 mt-0"
                    loading={licensesCertification?.loading}
                    disable={licensesCertification?.loading || isView}
                    isEdit={!licensesCertification?.loading}
                    value={field.value}
                    buttonName={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Attach,
                    )}
                    onchange={field.onChange}
                    disableFeatureChecking
                    dynamicLabels={dynamicLabels}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <LabelUI
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Attach,
                )}
              />
              <RadioForm
                name="isVerified"
                control={control}
                disabled={disableVerified}
                radioOptions={[
                  {
                    value: true,
                    label: renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Yes,
                    ),
                  },
                  {
                    value: false,
                    label: renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.No,
                    ),
                  },
                ]}
              />
              {data?.verifyUser?.username && (
                <div className={styles.verifiedBy}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Verified by'],
                  )}{' '}
                  {data?.verifyUser?.username}{' '}
                  {renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.at,
                  )}{' '}
                  {formatDateLocalWithTime(data?.verifiedAt)}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    if (data) {
      const countryDetail =
        countryOptionProps?.filter(
          (country) => country?.value === data?.issueCountry,
        ) || [];
      setValue('type', data?.type);
      setValue('name', data?.name);
      setValue('issuedBy', data?.issuedBy);
      setValue('issueCountry', countryDetail);
      setValue(
        'issuedDate',
        data?.issuedDate ? moment(data?.issuedDate) : null,
      );
      setValue(
        'expiryDate',
        data?.expiryDate ? moment(data?.expiryDate) : null,
      );
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );
      setValue('isVerified', Boolean(data?.isVerified));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!isOpen) {
      closeAndClearData();
    }
  }, [closeAndClearData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getCountryActions.request({ pageSize: -1, content: '' }));
    }
  }, [isOpen, dispatch]);

  return (
    <ModalComponent
      w={800}
      bodyClassName="p-2"
      isOpen={isOpen}
      toggle={closeAndClearData}
      title={renderDynamicLabel(
        dynamicLabels,
        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Licenses certification'],
      )}
      content={renderForm()}
      footer={isView || !isOpen ? null : renderFooter()}
    />
  );
};

export default ModalLicensesCertification;
