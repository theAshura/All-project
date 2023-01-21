import { yupResolver } from '@hookform/resolvers/yup';
import { getDetailCarParApiRequest, verifyCarApiRequest } from 'api/car.api';
import cx from 'classnames';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { formatDateIso } from 'helpers/date.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import moment from 'moment';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CarVerificationStatusEnum } from 'constants/car.const';
import { FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import * as yup from 'yup';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { CarFormContext, Step4Form } from '../CarFormContext';
import StepsProgress from '../steps-progress/StepsProgress';
import InspectionPlanTable from '../table-info/InspectionPlanTable';
import CarAttachmentTable from './CarAttachmentTable';
import FooterBtns from './FooterBtns';
import styles from './step.module.scss';

interface Props {
  onClose: () => void;
  featurePage: Features;
  subFeaturePage: SubFeatures;
  dynamicLabels?: IDynamicLabel;
}

const TYPE_VERIFY = {
  NextInspection: 'NextInspection',
  AdditionalInspection: 'AdditionalInspection',
  Manually: 'Manually',
};

const defaultValues: Step4Form = {
  isNeeded: true,
  types: [],
  status: CarVerificationStatusEnum.PENDING,
  verifiedDate: '',
  verifiedById: null,
  reason: '',
};

const Step4: FC<Props> = (props) => {
  const { featurePage, subFeaturePage, dynamicLabels } = props;
  const {
    step4Values,
    setStep4Values,
    isDisableStep4,
    detailCar,
    closeAndResetData,
    handleChangeActiveStep,
  } = useContext(CarFormContext);

  const { userInfo } = useSelector((state) => state.authenticate);
  const { listUser } = useSelector((state) => state.user);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [listParInfo, setListParInfo] = useState([]);
  const schema = yup.object().shape({
    status: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    types: yup
      .array()
      .nullable()
      .when('isNeeded', {
        is: (value) => value === true,
        then: yup
          .array()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    verifiedDate: yup
      .string()
      .nullable()
      .when(['types', 'isNeeded'], {
        is: (types, isNeeded) => {
          if (!isNeeded) {
            return false;
          }
          return types?.some((i) => i === TYPE_VERIFY.Manually);
        },
        then: yup
          .string()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    verifiedById: yup
      .string()
      .nullable()
      .when(['types', 'isNeeded'], {
        is: (types, isNeeded) => {
          if (!isNeeded) {
            return false;
          }
          return types?.some((i) => i === TYPE_VERIFY.Manually);
        },
        then: yup
          .string()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    reason: yup
      .string()
      .nullable()
      .when(['status', 'isNeeded'], {
        is: (status, isNeeded) => {
          if (!isNeeded) {
            return false;
          }
          if (
            status === CarVerificationStatusEnum.HOLDING ||
            status === CarVerificationStatusEnum.OVERRIDING_CLOSURE
          ) {
            return true;
          }
          return false;
        },
        then: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
  });
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchType = watch('types');
  const watchIsNeeded = watch('isNeeded');
  const watchStatus = watch('status');

  const onSubmitForm = useCallback(
    (data: Step4Form) => {
      if (
        watchType?.find((i) => i === TYPE_VERIFY.Manually) &&
        !step4Values?.attachments?.length &&
        data?.isNeeded
      ) {
        toastError('Attachments must contain at least 1 elements');
        return;
      }
      const bodyParams = {
        carId: detailCar?.id,
        isNeeded: data?.isNeeded || false,
        types: data?.types || null,
        status: data.status,
        verifiedDate: data.verifiedDate
          ? formatDateIso(data.verifiedDate)
          : null,
        verifiedById: data.verifiedById || null,
        reason: data?.reason || null,
        attachments: step4Values?.attachments?.length
          ? step4Values?.attachments?.map((i) => i?.id)
          : null,
      };
      setLoadingSubmit(true);
      verifyCarApiRequest(bodyParams)
        .then((res) => {
          toastSuccess('Verify CAR successfully');
          closeAndResetData();
        })
        .catch((err) => toastError(err?.message))
        .finally(() => {
          setLoadingSubmit(false);
        });
    },
    [watchType, step4Values?.attachments, detailCar?.id, closeAndResetData],
  );

  useEffect(() => {
    if (detailCar?.id) {
      getDetailCarParApiRequest(detailCar?.id)
        .then((res) => {
          setListParInfo(res.data);
        })
        .catch((err) => toastError(err));
    }
  }, [detailCar?.id]);

  useEffect(() => {
    if (step4Values) {
      setValue('isNeeded', step4Values?.isNeeded);
      setValue('types', step4Values?.types);
      setValue('status', step4Values?.status);
      setValue(
        'verifiedDate',
        step4Values?.verifiedDate ? moment(step4Values?.verifiedDate) : '',
      );
      setValue('verifiedById', step4Values?.verifiedById);
      setValue('reason', step4Values?.reason);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step4Values?.isNeeded,
    step4Values?.types,
    step4Values?.status,
    step4Values?.verifiedDate,
    step4Values?.verifiedById,
    step4Values?.reason,
  ]);

  const listUserOption = useMemo(() => {
    const listOption =
      listUser?.data?.map((item) => ({
        label: `${item.firstName} ${item.lastName}`,
        value: item.id,
      })) || [];
    if (listUser?.data?.some((item) => item?.id === userInfo?.id)) {
      return listOption;
    }
    listOption?.push({
      label: `${userInfo?.firstName} ${userInfo?.lastName}`,
      value: userInfo?.id,
    });
    return listOption;
  }, [listUser?.data, userInfo]);

  useEffect(() => {
    if (!watchIsNeeded) {
      setValue('status', CarVerificationStatusEnum.VERIFIED_AND_CLOSE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchIsNeeded]);

  const onSaveDraft = useCallback(() => {
    setStep4Values((prev) => ({
      ...prev,
      ...getValues(),
    }));
  }, [getValues, setStep4Values]);

  const onChangeVerify = useCallback(
    (value: string) => {
      if (watchType?.some((i) => i === value)) {
        setValue(
          'types',
          watchType?.filter((i) => i !== value),
        );
      } else {
        setValue('types', watchType?.concat(value));
      }
    },
    [setValue, watchType],
  );

  return (
    <>
      <StepsProgress dynamicLabels={dynamicLabels} onSaveDraft={onSaveDraft} />
      <div className={styles.wrap}>
        <Row>
          <Col xs={12} className="mb-3">
            <div className={styles.wrapWorkingType}>
              <div className="d-flex align-items-center">
                <ToggleSwitch
                  isRequired
                  control={control}
                  name="isNeeded"
                  disabled={isDisableStep4}
                />
                <div className={styles.value}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    CAR_CAP_DYNAMIC_FIELDS['Verification needed'],
                  )}
                </div>
              </div>
            </div>
          </Col>

          {watchIsNeeded && (
            <>
              <Col xs={12} className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  CAR_CAP_DYNAMIC_FIELDS['Verification type'],
                )}
                <span className={styles.dotRequired}>*</span>
              </Col>
              <Col xs={4} xl={3} className="mb-3">
                <div className={styles.wrapCheckbox}>
                  <CustomCheckbox
                    checked={watchType?.some(
                      (i) => i === TYPE_VERIFY.NextInspection,
                    )}
                    onChange={(e) => {
                      onChangeVerify(TYPE_VERIFY.NextInspection);
                      setError('types', null);
                    }}
                    disabled={isDisableStep4}
                  />
                  <div className={styles.name}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      CAR_CAP_DYNAMIC_FIELDS['Next inspection'],
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={4} xl={3} className="mb-3">
                <div className={styles.wrapCheckbox}>
                  <CustomCheckbox
                    checked={watchType?.some(
                      (i) => i === TYPE_VERIFY.AdditionalInspection,
                    )}
                    onChange={(e) => {
                      onChangeVerify(TYPE_VERIFY.AdditionalInspection);
                      setError('types', null);
                    }}
                    disabled={isDisableStep4}
                  />
                  <div className={styles.name}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      CAR_CAP_DYNAMIC_FIELDS['Additional inspection'],
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={4} xl={3} className="mb-3">
                <div className={styles.wrapCheckbox}>
                  <CustomCheckbox
                    checked={watchType?.some((i) => i === TYPE_VERIFY.Manually)}
                    onChange={(e) => {
                      onChangeVerify(TYPE_VERIFY.Manually);
                      setError('types', null);
                    }}
                    disabled={isDisableStep4}
                  />
                  <div className={styles.name}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      CAR_CAP_DYNAMIC_FIELDS.Manually,
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                {' '}
                <div className={cx(styles.messageError, 'mt-0')}>
                  {errors?.types?.message || ''}
                </div>
              </Col>
            </>
          )}
        </Row>
        {(watchType?.find((i) => i === TYPE_VERIFY.NextInspection) ||
          watchType?.find((i) => i === TYPE_VERIFY.AdditionalInspection)) &&
          watchIsNeeded && (
            <div className="mb-3">
              <InspectionPlanTable
                dynamicLabels={dynamicLabels}
                data={listParInfo}
              />
            </div>
          )}

        {watchType?.some((i) => i === TYPE_VERIFY.Manually) && watchIsNeeded && (
          <Row>
            <Col xs={6} className="mb-3">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  CAR_CAP_DYNAMIC_FIELDS['Verified date'],
                )}
                <span className={styles.dotRequired}>*</span>
              </div>
              <DateTimePicker
                wrapperClassName="w-100"
                className="w-100"
                control={control}
                name="verifiedDate"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  CAR_CAP_DYNAMIC_FIELDS['Please select'],
                )}
                maxDate={undefined}
                disabled={isDisableStep4}
                messageRequired={errors?.verifiedDate?.message || ''}
                minDate={moment()}
                inputReadOnly
              />
            </Col>

            <Col xs={6} className="mb-3">
              <SelectUI
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  CAR_CAP_DYNAMIC_FIELDS['Verified by'],
                )}
                data={listUserOption || []}
                name="verifiedById"
                messageRequired={errors?.verifiedById?.message || ''}
                className={cx(styles.inputSelect, 'w-100')}
                control={control}
                isRequired
                disabled={isDisableStep4}
              />
            </Col>
          </Row>
        )}

        {watchType?.some((i) => i === TYPE_VERIFY.Manually) &&
          watchIsNeeded && (
            <CarAttachmentTable
              featurePage={featurePage}
              subFeaturePage={subFeaturePage}
              disabled={isDisableStep4}
              dynamicLabels={dynamicLabels}
              isStep4
              title={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Verification attachment'],
              )}
            />
          )}

        <Row>
          <Col xs={12} className={styles.label}>
            {renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['Verification status'],
            )}
            <span className={styles.dotRequired}>*</span>
          </Col>
          <Col xs={12} className="mb-3">
            <RadioForm
              name="status"
              control={control}
              disabled={isDisableStep4}
              radioOptions={[
                {
                  value: CarVerificationStatusEnum.PENDING,
                  label: renderDynamicLabel(
                    dynamicLabels,
                    CAR_CAP_DYNAMIC_FIELDS.Pending,
                  ),
                  disabled: !watchIsNeeded,
                },
                {
                  value: CarVerificationStatusEnum.HOLDING,
                  label: renderDynamicLabel(
                    dynamicLabels,
                    CAR_CAP_DYNAMIC_FIELDS.Holding,
                  ),
                  disabled: !watchIsNeeded,
                },
                {
                  value: CarVerificationStatusEnum.VERIFIED_AND_CLOSE,
                  label: renderDynamicLabel(
                    dynamicLabels,
                    CAR_CAP_DYNAMIC_FIELDS['Verified and closed'],
                  ),
                },
                {
                  value: CarVerificationStatusEnum.OVERRIDING_CLOSURE,
                  label: renderDynamicLabel(
                    dynamicLabels,
                    CAR_CAP_DYNAMIC_FIELDS['Overriding closure'],
                  ),
                  disabled: !watchIsNeeded,
                },
              ]}
            />
            <div className={styles.messageError}>
              {errors?.status?.message || ''}
            </div>
          </Col>
        </Row>

        {watchIsNeeded &&
          (watchStatus === CarVerificationStatusEnum.HOLDING ||
            watchStatus === CarVerificationStatusEnum.OVERRIDING_CLOSURE) && (
            <Row>
              <Col xs={12} className="mb-3">
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    CAR_CAP_DYNAMIC_FIELDS.Reason,
                  )}
                  <span className={styles.dotRequired}>*</span>
                </div>
                <TextAreaForm
                  control={control}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    CAR_CAP_DYNAMIC_FIELDS['Enter reason'],
                  )}
                  autoSize={{ minRows: 1 }}
                  name="reason"
                  maxLength={500}
                  disabled={isDisableStep4}
                />
              </Col>
            </Row>
          )}

        <FooterBtns
          prevStep={() => {
            handleChangeActiveStep(-1);
            onSaveDraft();
          }}
          // nextStep={() => handleChangeActiveStep(1)}
          handleCancel={closeAndResetData}
          onSubmit={handleSubmit(onSubmitForm)}
          disableSubmit={isDisableStep4}
          loading={loadingSubmit}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );
};

export default Step4;
