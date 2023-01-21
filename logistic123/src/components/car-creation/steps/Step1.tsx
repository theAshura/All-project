import { yupResolver } from '@hookform/resolvers/yup';
import Tooltip from 'antd/lib/tooltip';
import { createCarApiRequest, updateCarApiRequest } from 'api/car.api';
import cx from 'classnames';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import { TOOLTIP_COLOR } from 'constants/common.const';
import { formatDateIso } from 'helpers/date.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import moment from 'moment';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Col, Row } from 'reactstrap';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import * as yup from 'yup';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from '../../../constants/dynamic/car-cap.const';
import { CarFormContext, Step1Form } from '../CarFormContext';
import ModalSelectFindings from '../modal-select-findings/ModalSelectFindings';
import StepsProgress from '../steps-progress/StepsProgress';
import CarAttachmentTable from './CarAttachmentTable';
import FindingTable from './FindingTable';
import FooterBtns from './FooterBtns';
import styles from './step.module.scss';

interface Props {
  onSave?: (data: any) => void;
  sNo?: string;
  featurePage: Features;
  subFeaturePage: SubFeatures;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues: Step1Form = {
  actionRequest: '',
  capTargetPeriod: null,
  periodType: 'Day',
  capTargetEndDate: '',
};

const Step1: FC<Props> = ({
  sNo,
  featurePage,
  subFeaturePage,
  dynamicLabels,
}) => {
  const {
    detailCar,
    setActiveStep,
    step1Values,
    setStep1Values,
    planningAndRequestId,
    handleChangeActiveStep,
    isDisableStep1,
    closeAndResetData,
    handleGetCarDetail,
    workflow,
  } = useContext(CarFormContext);

  const creatorPermission = workflow?.find((i) => i === 'creator');

  const [modalFindingVisible, setModalFindingVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const schema = yup.object().shape({
    actionRequest: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    capTargetPeriod: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    // capTargetEndDate: yup
    //   .string()
    //   .nullable()
    //   .trim()
    //   .required(renderDynamicLabel(
    //   dynamicLabels,
    //   CAR_CAP_DYNAMIC_FIELDS['This field is required'],
    // )),
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

  const watchCapTargetDate = watch('capTargetPeriod');
  const watchPeriodType = watch('periodType');

  useEffect(() => {
    if (watchCapTargetDate) {
      if (watchPeriodType === 'Day') {
        setValue(
          'capTargetEndDate',
          moment().add(Number(watchCapTargetDate), 'days'),
        );
      }
      if (watchPeriodType === 'Week') {
        setValue(
          'capTargetEndDate',
          moment().add(Number(watchCapTargetDate), 'weeks'),
        );
      }
      if (watchPeriodType === 'Month') {
        setValue(
          'capTargetEndDate',
          moment().add(Number(watchCapTargetDate), 'months'),
        );
      }
    } else {
      setValue('capTargetEndDate', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCapTargetDate, watchPeriodType]);

  useEffect(() => {
    if (step1Values) {
      setValue('actionRequest', step1Values?.actionRequest);
      setValue('capTargetPeriod', step1Values?.capTargetPeriod);
      setValue('periodType', step1Values?.periodType);
      setValue(
        'capTargetEndDate',
        step1Values?.capTargetEndDate
          ? moment(step1Values?.capTargetEndDate)
          : null,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step1Values?.actionRequest,
    step1Values?.capTargetPeriod,
    step1Values?.periodType,
    step1Values?.capTargetEndDate,
  ]);

  const onSubmitForm = useCallback(
    (data: Step1Form) => {
      const listAttach =
        step1Values?.attachments?.concat(step1Values?.attachmentsFromFinding) ||
        [];
      const bodyParams = {
        actionRequest: data.actionRequest,
        capTargetPeriod: Number(data.capTargetPeriod),
        periodType: data.periodType,
        capTargetEndDate: formatDateIso(data.capTargetEndDate),
        reportFindingItemIds:
          step1Values.findingSelected?.map((i) => i.id) || [],
        planningRequestId: planningAndRequestId,
        id: step1Values.idCar,
        attachments: listAttach?.map((i) => i?.id) || [],
      };
      if (bodyParams?.reportFindingItemIds?.length <= 0) {
        toastError('Findings must contain at least 1 elements');
        return;
      }
      setLoadingSubmit(true);
      if (detailCar?.id) {
        updateCarApiRequest(bodyParams)
          .then((res) => {
            toastSuccess('Update CAR successfully');
            if (creatorPermission) {
              handleGetCarDetail();
              setActiveStep(2);
              return;
            }
            closeAndResetData(true);
          })
          .catch((err) => toastError(err?.message))
          .finally(() => {
            setLoadingSubmit(false);
          });
      } else {
        createCarApiRequest(bodyParams)
          .then((res) => {
            toastSuccess('Create CAR successfully');
            if (creatorPermission) {
              handleGetCarDetail(res?.data?.carId);
              setActiveStep(2);
              return;
            }
            closeAndResetData(true);
          })
          .catch((err) => toastError(err?.message))
          .finally(() => {
            setLoadingSubmit(false);
          });
      }
    },
    [
      closeAndResetData,
      creatorPermission,
      detailCar?.id,
      handleGetCarDetail,
      planningAndRequestId,
      setActiveStep,
      step1Values?.attachments,
      step1Values?.attachmentsFromFinding,
      step1Values.findingSelected,
      step1Values.idCar,
    ],
  );
  const onSaveDraft = useCallback(() => {
    setStep1Values((prev) => ({
      ...prev,
      ...getValues(),
    }));
  }, [getValues, setStep1Values]);
  return (
    <>
      <StepsProgress dynamicLabels={dynamicLabels} onSaveDraft={onSaveDraft} />
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div>
            1.{' '}
            {renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['Corrective action request'],
            )}
          </div>
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            onClick={() => {
              setModalFindingVisible(true);
            }}
            disabledCss={isDisableStep1}
            disabled={isDisableStep1}
          >
            {renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['Select findings'],
            )}
          </Button>
        </div>
        <Row className="d-flex align-items-center">
          <Col xs={4} className={styles.wrapInfo}>
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['CAR S.No'],
              )}
            </div>
            <div className={styles.value}>{sNo}</div>
          </Col>
          <Col xs={4} className={styles.wrapInfo}>
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['CAR Ref.ID'],
              )}
            </div>
            <Tooltip
              placement="top"
              title={step1Values?.findingSelected
                ?.map((i) => i?.reference || 'N/A')
                ?.join(';')}
              color={TOOLTIP_COLOR}
            >
              <div className={styles.value}>
                {step1Values?.findingSelected
                  ?.map((i) => i?.reference || 'N/A')
                  ?.join(';')}
              </div>
            </Tooltip>
          </Col>
        </Row>
        <FindingTable dynamicLabels={dynamicLabels} />
        <Row>
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['CAR (Corrective action request)'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>
            <TextAreaForm
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter CAR (Corrective action request)'],
              )}
              autoSize={{ minRows: 3 }}
              name="actionRequest"
              maxLength={5000}
              disabled={isDisableStep1}
              required
            />
          </Col>
          <Col xs={4} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['CAP target period'],
              )}{' '}
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({ [styles.disabledInput]: isDisableStep1 })}
              value={watchCapTargetDate || ''}
              onChange={(e) => {
                if (Number(e.target.value) <= 99999) {
                  setError('capTargetPeriod', null);
                  setValue('capTargetPeriod', e.target.value);
                }
              }}
              maxLength={5}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter target period'],
              )}
              isRequired
              disabled={isDisableStep1}
              messageRequired={errors?.capTargetPeriod?.message || ''}
            />
          </Col>
          <Col xs={4} className="mb-3">
            <div className={styles.label}> </div>
            <SelectUI
              data={[
                {
                  value: 'Day',
                  label: 'Day',
                },
                {
                  value: 'Week',
                  label: 'Week',
                },
                {
                  value: 'Month',
                  label: 'Month',
                },
              ]}
              notAllowSortData
              name="periodType"
              id="periodType"
              messageRequired={errors?.periodType?.message || ''}
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: isDisableStep1 },
                'w-100',
              )}
              control={control}
              disabled={isDisableStep1}
              isRequired
            />
          </Col>
          <Col xs={4} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['CAP target end date'],
              )}
            </div>
            <DateTimePicker
              wrapperClassName="w-100"
              className="w-100"
              control={control}
              disabled
              name="capTargetEndDate"
              maxDate={undefined}
              messageRequired={errors?.capTargetEndDate?.message || ''}
              isRequired
              inputReadOnly
            />
          </Col>
        </Row>

        <CarAttachmentTable
          featurePage={featurePage}
          subFeaturePage={subFeaturePage}
          hideTotalSize
          disabled={isDisableStep1}
          dynamicLabels={dynamicLabels}
        />
        <FooterBtns
          nextStep={() => {
            handleChangeActiveStep(1);
            onSaveDraft();
          }}
          handleCancel={closeAndResetData}
          onSubmit={handleSubmit(onSubmitForm)}
          disableSubmit={isDisableStep1}
          loading={loadingSubmit}
          dynamicLabels={dynamicLabels}
        />
        <ModalSelectFindings
          isOpen={modalFindingVisible}
          dynamicLabels={dynamicLabels}
          onClose={() => setModalFindingVisible(false)}
        />
      </div>
    </>
  );
};

export default Step1;
