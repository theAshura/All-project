import { yupResolver } from '@hookform/resolvers/yup';
import { createCapApiRequest, updateCapApiRequest } from 'api/car.api';
// import cx from 'classnames';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
// import SelectUI from 'components/ui/select/Select';
import { formatDateIso } from 'helpers/date.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { CreateCapParams } from 'models/api/car/car.model';
import moment from 'moment';
import Input from 'components/ui/input/Input';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
// import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { CarFormContext } from '../CarFormContext';
import TableCapComment from '../modal-cap-comments/ModalCapComments';
import StepsProgress from '../steps-progress/StepsProgress';
import FooterBtns from './FooterBtns';
import styles from './step.module.scss';

interface Props {
  onClose: () => void;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  planAction: '',
  rootCause: '',
  ecdCap: '',
  acdCap: '',
  picCap: undefined,
  preventiveAction: '',
  ecdPrevent: '',
  acdPrevent: '',
  picPrevent: undefined,
  comments: [],
};

const Step2: FC<Props> = ({ onClose, dynamicLabels }) => {
  const {
    step2Values,
    setStep2Values,
    isDisableStep2,
    detailCar,
    setActiveStep,
    handleChangeActiveStep,
    closeAndResetData,
    handleGetCarDetail,
  } = useContext(CarFormContext);
  // const { listUser } = useSelector((state) => state.user);
  // const { userInfo } = useSelector((state) => state.authenticate);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const schema = yup.object().shape({
    planAction: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    ecdCap: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    acdCap: yup.string().nullable().trim(),
    picCap: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    preventiveAction: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    ecdPrevent: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    acdPrevent: yup.string().nullable().trim(),
    picPrevent: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,

    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (step2Values) {
      setValue('planAction', step2Values?.planAction);
      setValue('rootCause', step2Values?.rootCause);
      setValue(
        'ecdCap',
        step2Values?.ecdCap ? moment(step2Values?.ecdCap) : '',
      );
      setValue(
        'acdCap',
        step2Values?.acdCap ? moment(step2Values?.acdCap) : '',
      );
      setValue('picCap', step2Values?.picCap || undefined);
      setValue('preventiveAction', step2Values?.preventiveAction);
      setValue(
        'ecdPrevent',
        step2Values?.ecdPrevent ? moment(step2Values?.ecdPrevent) : '',
      );
      setValue(
        'acdPrevent',
        step2Values?.acdPrevent ? moment(step2Values?.acdPrevent) : '',
      );
      setValue('picPrevent', step2Values?.picPrevent || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step2Values?.planAction,
    step2Values?.rootCause,
    step2Values?.ecdCap,
    step2Values?.acdCap,
    step2Values?.picCap,
    step2Values?.preventiveAction,
    step2Values?.ecdPrevent,
    step2Values?.acdPrevent,
    step2Values?.picPrevent,
  ]);

  const onSubmitForm = useCallback(
    (data: CreateCapParams) => {
      const bodyParams: CreateCapParams = {
        carId: detailCar?.id,
        capId: detailCar?.cap?.id,
        planAction: data.planAction,
        rootCause: data?.rootCause,
        ecdCap: formatDateIso(data.ecdCap),
        acdCap: formatDateIso(data.acdCap),
        picCap: data.picCap,
        preventiveAction: data.preventiveAction,
        ecdPrevent: formatDateIso(data.ecdPrevent),
        acdPrevent: formatDateIso(data.acdPrevent),
        picPrevent: data.picPrevent,
        status: data?.status || 'Submitted',
        comments: step2Values?.comments?.map((i) => ({
          comment: i.comment,
          serialNumber: i.comment || '',
        })),
      };
      setLoadingSubmit(true);
      if (detailCar?.cap?.id) {
        updateCapApiRequest(bodyParams)
          .then((res) => {
            toastSuccess('Update CAP successfully');
            handleGetCarDetail();
          })
          .catch((err) => toastError(err?.message))
          .finally(() => {
            setLoadingSubmit(false);
          });
      } else {
        createCapApiRequest(bodyParams)
          .then((res) => {
            toastSuccess('Create CAP successfully');
            handleGetCarDetail();
            setActiveStep(3);
          })
          .catch((err) => toastError(err?.message))
          .finally(() => {
            setLoadingSubmit(false);
          });
      }
    },
    [
      detailCar?.id,
      detailCar?.cap?.id,
      step2Values?.comments,
      handleGetCarDetail,
      setActiveStep,
    ],
  );
  // const listUserOption = useMemo(() => {
  //   const listOption =
  //     listUser?.data?.map((item) => ({
  //       label: `${item.firstName} ${item.lastName}`,
  //       value: item.id,
  //     })) || [];

  //   listOption?.push({
  //     label: `${userInfo.firstName} ${userInfo.lastName}`,
  //     value: userInfo?.id,
  //   });
  //   return listOption;
  // }, [listUser?.data, userInfo]);

  const onSaveDraft = useCallback(() => {
    setStep2Values((prev) => ({
      ...prev,
      ...getValues(),
      comments: prev.comments || [],
    }));
  }, [getValues, setStep2Values]);

  return (
    <>
      <StepsProgress dynamicLabels={dynamicLabels} onSaveDraft={onSaveDraft} />
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div>
            2.{' '}
            {renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['Corrective action plan'],
            )}
          </div>
        </div>

        <Row>
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['CAP (Corrective action plan)'],
              )}{' '}
              <span className={styles.dotRequired}>*</span>
            </div>
            <TextAreaForm
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter CAP (Corrective action plan)'],
              )}
              autoSize={{ minRows: 3 }}
              disabled={isDisableStep2}
              name="planAction"
              maxLength={5000}
            />
          </Col>
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Root cause'],
              )}
            </div>
            <TextAreaForm
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter root cause'],
              )}
              autoSize={{ minRows: 3 }}
              disabled={isDisableStep2}
              name="rootCause"
              maxLength={5000}
            />
          </Col>
          <Col xs={4} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Estimated closure date'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>
            <DateTimePicker
              wrapperClassName="w-100"
              className="w-100"
              control={control}
              name="ecdCap"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Please select'],
              )}
              maxDate={undefined}
              messageRequired={errors?.ecdCap?.message || ''}
              disabled={isDisableStep2}
              minDate={moment()}
              isRequired
              inputReadOnly
            />
          </Col>
          <Col xs={4} className="mb-3">
            {/* <SelectUI
              labelSelect="PIC name"
              data={listUserOption}
              name="picCap"
              id="picCap"
              placeholder="Please select"
              messageRequired={errors?.picCap?.message || ''}
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              disabled={isDisableStep2}
              isRequired
            /> */}
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['PIC name'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter pic name'],
              )}
              disabled={isDisableStep2}
              {...register('picCap')}
              messageRequired={errors?.picCap?.message || ''}
              isRequired
              maxLength={128}
            />
          </Col>
          <Col xs={4} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Actual closure date'],
              )}
            </div>
            <DateTimePicker
              wrapperClassName="w-100"
              className="w-100"
              control={control}
              name="acdCap"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Please select'],
              )}
              maxDate={undefined}
              messageRequired={errors?.acdCap?.message || ''}
              disabled={isDisableStep2}
              minDate={moment()}
              inputReadOnly
            />
          </Col>{' '}
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Preventive action'],
              )}{' '}
              <span className={styles.dotRequired}>*</span>
            </div>
            <TextAreaForm
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter preventive action'],
              )}
              autoSize={{ minRows: 3 }}
              name="preventiveAction"
              disabled={isDisableStep2}
              maxLength={500}
            />
          </Col>
          <Col xs={4} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Estimated closure date'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>
            <DateTimePicker
              wrapperClassName="w-100"
              className="w-100"
              control={control}
              name="ecdPrevent"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Please select'],
              )}
              maxDate={undefined}
              messageRequired={errors?.ecdPrevent?.message || ''}
              disabled={isDisableStep2}
              minDate={moment()}
              isRequired
              inputReadOnly
            />
          </Col>
          <Col xs={4} className="mb-3">
            {/* <SelectUI
              labelSelect="PIC name"
              data={listUserOption}
              name="picPrevent"
              id="picPrevent"
              placeholder="Please select"
              messageRequired={errors?.picPrevent?.message || ''}
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              disabled={isDisableStep2}
              isRequired
            /> */}
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['PIC name'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter pic name'],
              )}
              disabled={isDisableStep2}
              {...register('picPrevent')}
              messageRequired={errors?.picPrevent?.message || ''}
              isRequired
              maxLength={128}
            />
          </Col>
          <Col xs={4} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Actual closure date'],
              )}
            </div>
            <DateTimePicker
              wrapperClassName="w-100"
              className="w-100"
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Please select'],
              )}
              name="acdPrevent"
              disabled={isDisableStep2}
              maxDate={undefined}
              messageRequired={errors?.acdPrevent?.message || ''}
              minDate={moment()}
              inputReadOnly
            />
          </Col>
        </Row>

        <TableCapComment
          dynamicLabels={dynamicLabels}
          disable={isDisableStep2}
        />
        <FooterBtns
          prevStep={() => {
            handleChangeActiveStep(-1);
            onSaveDraft();
          }}
          nextStep={() => {
            handleChangeActiveStep(1);
            onSaveDraft();
          }}
          handleCancel={closeAndResetData}
          onSave={handleSubmit((data) =>
            onSubmitForm({ ...data, status: 'Draft' }),
          )}
          onSubmit={handleSubmit(onSubmitForm)}
          disableSubmit={isDisableStep2}
          dynamicLabels={dynamicLabels}
          loading={loadingSubmit}
        />
      </div>
    </>
  );
};

export default Step2;
