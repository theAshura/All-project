import { yupResolver } from '@hookform/resolvers/yup';
import { getDetailCarCapHistory, reviewCarAndCapApiRequest } from 'api/car.api';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { CAR_STATUS } from 'constants/car.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { CarFormContext, Step3Form } from '../CarFormContext';
import StepsProgress from '../steps-progress/StepsProgress';
import CarHistory from '../table-info/CarHistoryTable';
import FooterBtns from './FooterBtns';
import styles from './step.module.scss';

interface Props {
  onClose: () => void;
  dynamicLabels?: IDynamicLabel;
}

const schema = yup.object().shape({
  // vesselId: yup.array().nullable().min(1, 'This field is required'),
});

const defaultValues = {
  comment: '',
};

const Step3: FC<Props> = ({ onClose, dynamicLabels }) => {
  const {
    isDisableStep3,
    step3Values,
    setStep3Values,
    setActiveStep,
    detailCar,
    handleChangeActiveStep,
    handleGetCarDetail,
    closeAndResetData,
    workflow,
  } = useContext(CarFormContext);

  const hasReviewPermissionVerification = workflow?.find(
    (i) => i === 'verification',
  );
  const hasReviewPermissionCreator = workflow?.find((i) => i === 'creator');

  const [listCapHistory, setListCapHistory] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { control, handleSubmit, setValue, getValues } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (step3Values) {
      setValue('comment', step3Values?.comment || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step3Values?.comment]);

  const handleGetListHistory = useCallback(() => {
    getDetailCarCapHistory({
      capId: detailCar?.cap?.id,
      carId: detailCar?.id,
    })
      .then((res) => {
        setListCapHistory(res.data);
      })
      .catch((err) => toastError(err));
  }, [detailCar?.cap?.id, detailCar?.id]);

  const handleReview = useCallback(
    (data: Step3Form, status: string) => {
      const bodyParams = {
        capId: detailCar?.cap?.id,
        carId: detailCar?.id,
        status,
        comment: data?.comment || '',
      };
      setLoadingSubmit(true);
      reviewCarAndCapApiRequest(bodyParams)
        .then((res) => {
          handleGetCarDetail();
          handleGetListHistory();
          toastSuccess(
            status === CAR_STATUS.Denied
              ? 'Deny CAR and CAP successfully'
              : 'Accept CAR and CAP successfully',
          );
          if (status === CAR_STATUS.Denied) {
            if (!hasReviewPermissionCreator) {
              closeAndResetData();
            }
            setActiveStep(2);
            return;
          }
          if (!hasReviewPermissionVerification) {
            closeAndResetData();
            return;
          }

          setActiveStep(4);
        })
        .catch((err) => toastError(err?.message))
        .finally(() => {
          setLoadingSubmit(false);
        });
    },
    [
      closeAndResetData,
      detailCar?.cap?.id,
      detailCar?.id,
      handleGetCarDetail,
      handleGetListHistory,
      hasReviewPermissionCreator,
      hasReviewPermissionVerification,
      setActiveStep,
    ],
  );

  const onSubmitForm = useCallback(
    (data: Step3Form) => {
      handleReview(data, CAR_STATUS.Accepted);
    },
    [handleReview],
  );

  const onDenyForm = useCallback(() => {
    if (!getValues('comment')) {
      toastError('Please fill comment.');
      return;
    }
    handleReview(
      {
        comment: getValues('comment'),
      },
      CAR_STATUS.Denied,
    );
  }, [getValues, handleReview]);

  useEffect(() => {
    if (detailCar?.cap?.id && detailCar?.id) {
      handleGetListHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailCar?.cap?.id, detailCar?.id]);

  const onSaveDraft = useCallback(() => {
    setStep3Values((prev) => ({
      ...prev,
      comment: getValues('comment') || '',
    }));
  }, [getValues, setStep3Values]);

  return (
    <>
      <StepsProgress dynamicLabels={dynamicLabels} onSaveDraft={onSaveDraft} />
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div>
            3.{' '}
            {renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['CAP review'],
            )}
          </div>
        </div>

        <Row className="pb-3">
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS.Comment,
              )}
            </div>
            <TextAreaForm
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS['Enter comment'],
              )}
              autoSize={{ minRows: 1 }}
              name="comment"
              maxLength={500}
              disabled={isDisableStep3}
            />
          </Col>
        </Row>

        <CarHistory dynamicLabels={dynamicLabels} data={listCapHistory} />
        <FooterBtns
          prevStep={() => {
            handleChangeActiveStep(-1);
            onSaveDraft();
          }}
          nextStep={() => {
            if (!hasReviewPermissionVerification) {
              return;
            }
            onSaveDraft();
            handleChangeActiveStep(1);
          }}
          handleCancel={closeAndResetData}
          onAccept={handleSubmit(onSubmitForm)}
          onDeny={onDenyForm}
          disableAccepted={isDisableStep3}
          disableDenied={isDisableStep3}
          loading={loadingSubmit}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );
};

export default Step3;
