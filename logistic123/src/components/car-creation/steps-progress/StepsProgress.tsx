import { FC, useContext, useMemo, useCallback } from 'react';
import cx from 'classnames';
import images from 'assets/images/images';
import { CAR_STATUS } from 'constants/car.const';
import { populateStatus } from 'helpers/utils.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './steps-progress.module.scss';

import { CarFormContext } from '../CarFormContext';

interface StepInfo {
  name: string;
  description?: string;
}

interface Props {
  stepsInfo?: StepInfo[];
  onSaveDraft?: () => void;
  dynamicLabels: IDynamicLabel;
}

const StepsProgress: FC<Props> = ({
  stepsInfo,
  onSaveDraft,
  dynamicLabels,
}) => {
  const { activeStep, stepComplete, detailCar, setActiveStep, workflow } =
    useContext(CarFormContext);

  const hasReviewPermission = workflow?.find((i) => i === 'verification');

  const stepInfoDefault: StepInfo[] = useMemo(
    () =>
      [
        {
          name: 'CAR',
        },
        {
          name: 'CAP',
        },
        {
          name: 'CAP review',
        },
        hasReviewPermission && {
          name: 'Verification',
        },
      ]?.filter((i) => !!i),
    [hasReviewPermission],
  );

  const renderStatus = useCallback(
    (step: number) => {
      if (step === 1) {
        return detailCar?.status;
      }
      if (step === 2) {
        if (detailCar?.cap?.status === CAR_STATUS.Accepted) {
          return CAR_STATUS.Submitted;
        }
        if (
          stepComplete === 2 &&
          detailCar?.cap?.status === CAR_STATUS.Denied
        ) {
          return CAR_STATUS.Submitted;
        }
        if (detailCar?.cap?.status) {
          return detailCar?.cap?.status;
        }
        if (detailCar?.status === CAR_STATUS.Open) {
          return CAR_STATUS.Waiting;
        }
        return null;
      }
      if (step === 3) {
        if (detailCar?.cap?.status === CAR_STATUS.Accepted) {
          return CAR_STATUS.Accepted;
        }
        if (detailCar?.cap?.status === CAR_STATUS.Denied) {
          return CAR_STATUS.Denied;
        }
        if (
          !detailCar?.cap?.status ||
          detailCar?.cap?.status === CAR_STATUS.Draft
        ) {
          return null;
        }
        return CAR_STATUS.Waiting;
      }
      if (step === 4) {
        if (detailCar?.cARVerification?.status) {
          return populateStatus(detailCar?.cARVerification?.status);
        }
        if (detailCar?.cap?.status === CAR_STATUS.Accepted) {
          return CAR_STATUS.Waiting;
        }
        if (detailCar?.cap?.status === CAR_STATUS.Denied) {
          return null;
        }
        if (!detailCar?.cARVerification) {
          return null;
        }
        return CAR_STATUS.Waiting;
      }

      return '';
    },
    [
      detailCar?.cARVerification,
      detailCar?.cap?.status,
      detailCar?.status,
      stepComplete,
    ],
  );

  const onChangeSteps = useCallback(
    (step: number) => {
      setActiveStep(step);
      if (onSaveDraft) {
        onSaveDraft();
      }
    },
    [onSaveDraft, setActiveStep],
  );
  return (
    <div className={styles.wrap}>
      {stepInfoDefault?.map((item, index) => (
        <div
          key={String(index + item.name)}
          className={cx(styles.stepWrap, {
            [styles.activeStep]: activeStep > index,
            [styles.completedStep]: stepComplete > index,
            [styles.activeLineStep]: activeStep === index + 1,
          })}
        >
          <div
            className={styles.stepNumber}
            onClick={() => onChangeSteps(index + 1)}
          >
            {stepComplete >= index + 1 ? (
              <img src={images.icons.icCheck} alt="icCheck" />
            ) : (
              index + 1
            )}
          </div>
          <div className="w-100">
            <div className={styles.name}>
              {renderDynamicLabel(
                dynamicLabels,
                CAR_CAP_DYNAMIC_FIELDS[item.name],
              )}
            </div>
            <div className={styles.status}>{renderStatus(index + 1)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsProgress;
