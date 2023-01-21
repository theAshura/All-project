/* eslint-disable jsx-a11y/label-has-associated-control */
import cx from 'classnames';

import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { MAX_LENGTH_TEXT } from 'constants/common.const';
import {
  CreateExperienceUserParams,
  Experience,
} from 'models/api/user/user.model';
import moment, { Moment } from 'moment';
import { FC, useCallback, useEffect, useMemo } from 'react';
import Checkbox from 'antd/lib/checkbox';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { getCountryActions } from 'store/user/user.action';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './experience.module.scss';

interface ModalProps {
  isOpen?: boolean;
  onSubmit: (data, idExperience?: string) => void;
  onClose: () => void;
  data?: Experience;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  position: '',
  companyName: '',
  country: [],
  tillPresent: false,
  startDate: null,
  endDate: null,
};

const ModalExperience: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  dynamicLabels,
}) => {
  const { experience, listCountry } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const schema = useMemo(
    () =>
      yup.object().shape({
        position: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        companyName: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        country: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        startDate: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        endDate: yup
          .string()
          .nullable()
          .when('tillPresent', {
            is: (value) => value === false,
            then: yup
              .string()
              .nullable()
              .required(
                renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              ),
          }),
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
  const watchStillDate: boolean = watch('tillPresent');
  const watchStartDate: Moment = watch('startDate');
  const watchEndDate: Moment = watch('endDate');

  const onSubmitForm = (formData: CreateExperienceUserParams) => {
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

  const renderForm = useCallback(
    () => (
      <>
        <div className={styles.content}>
          <div>
            <Row gutter={[21, 14]} className="pt-2 mx-0">
              <Col className="" span={12}>
                <Input
                  disabled={experience?.loading}
                  autoFocus
                  label={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Position,
                  )}
                  isRequired
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter position'],
                  )}
                  messageRequired={errors?.position?.message || ''}
                  {...register('position')}
                  maxLength={MAX_LENGTH_TEXT}
                />
              </Col>
              <Col span={12}>
                <Input
                  disabled={experience?.loading}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Company name'],
                  )}
                  isRequired
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter company name'],
                  )}
                  messageRequired={errors?.companyName?.message || ''}
                  {...register('companyName')}
                  maxLength={MAX_LENGTH_TEXT}
                />
              </Col>
              <Col span={12}>
                <AsyncSelectForm
                  messageRequired={errors?.country?.message}
                  control={control}
                  name="country"
                  disabled={experience?.loading}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
                  )}
                  isRequired
                  titleResults={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected country'],
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
                    dispatch(
                      getCountryActions.request({
                        content: value,
                        pageSize: -1,
                      }),
                    )
                  }
                  options={countryOptionProps}
                  dynamicLabels={dynamicLabels}
                />
              </Col>
              <Col span={12}>
                <DateTimePicker
                  disabled={experience?.loading}
                  messageRequired={errors?.startDate?.message || ''}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Start date'],
                  )}
                  isRequired
                  maxDate={watchEndDate || moment()}
                  className="w-100"
                  control={control}
                  name="startDate"
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter start date'],
                  )}
                />
              </Col>
              <Col span={12}>
                <div className={cx(styles.label)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Till date'],
                  )}
                </div>
                <Controller
                  control={control}
                  name="tillPresent"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue('endDate', null);
                      }}
                    >
                      {renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Present,
                      )}
                    </Checkbox>
                  )}
                />
              </Col>
              <Col span={12}>
                {!watchStillDate && (
                  <DateTimePicker
                    messageRequired={errors?.endDate?.message || ''}
                    label={renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['End date'],
                    )}
                    isRequired
                    minDate={watchStartDate}
                    placeholder={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )}
                    maxDate={moment()}
                    className="w-100"
                    control={control}
                    name="endDate"
                  />
                )}
              </Col>
            </Row>
          </div>
        </div>
      </>
    ),
    [
      control,
      countryOptionProps,
      dispatch,
      dynamicLabels,
      errors?.companyName?.message,
      errors?.country?.message,
      errors?.endDate?.message,
      errors?.position?.message,
      errors?.startDate?.message,
      experience?.loading,
      register,
      setValue,
      watchEndDate,
      watchStartDate,
      watchStillDate,
    ],
  );

  useEffect(() => {
    if (data) {
      const countryDetail =
        countryOptionProps?.filter(
          (country) => country?.value === data?.country,
        ) || [];
      setValue('position', data?.position);
      setValue('companyName', data?.companyName);
      setValue('country', countryDetail);
      setValue('tillPresent', Boolean(data?.tillPresent));
      setValue('startDate', moment(data?.startDate));
      setValue(
        'endDate',
        data?.tillPresent || !data?.endDate ? null : moment(data?.endDate),
      );
    }
  }, [countryOptionProps, data, setValue]);

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
        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Experience,
      )}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalExperience;
