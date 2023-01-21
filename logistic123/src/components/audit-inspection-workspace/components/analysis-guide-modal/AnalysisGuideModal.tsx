import { FC, useState, useMemo, useCallback } from 'react';
import { Modal, ModalProps } from 'reactstrap';
import queryString from 'query-string';
import moment from 'moment';
import { websiteLinkByEnv } from 'helpers/utils.helper';
import images from 'assets/images/images';
import { v4 } from 'uuid';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import { AuditInspectionWorkspaceDetailResponse } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import styles from './analysis-guide-modal.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  data?: AuditInspectionWorkspaceDetailResponse;
}

const AnalysisGuideModal: FC<ModalComponentProps> = ({
  isOpen,
  classesName,
  modalClassName,
  contentClassName,
  data,
  onClose,

  ...other
}) => {
  const uniqueId = useMemo(() => v4(), []);
  const [activeStep, setActiveStep] = useState<number>(1);

  const reportLink = useMemo(() => {
    const dataParams = {
      vesselName: data?.vessel?.name,
      vesselType: data?.vessel?.vesselType?.name,
      inspectorName:
        data?.planningRequest?.auditors?.map((i) => i.username).join(', ') ||
        '',
      dateOfInspection: data?.planningRequest?.plannedFromDate
        ? moment(data?.planningRequest?.plannedFromDate)
            .local()
            .format('D MMM yy')
        : '',
      imoNumber: data?.vessel?.imoNumber,
      portOfInspection: data?.planningRequest?.fromPort?.name,
    };

    const params = queryString.stringify(dataParams);
    const link = `${websiteLinkByEnv()}/audit-inspection-workspace/analytic-report/?${params}`;
    return link;
  }, [data]);

  const renderImageByStep = useMemo(() => {
    switch (activeStep) {
      case 1:
        return images.analysisGuide.analysisGuideStep1;
      case 2:
        return images.analysisGuide.analysisGuideStep2;
      case 3:
        return images.analysisGuide.analysisGuideStep3;
      case 4:
        return images.analysisGuide.analysisGuideStep4;
      default:
        return images.analysisGuide.analysisGuideStep1;
    }
  }, [activeStep]);
  const renderDescriptionByStep = useMemo(() => {
    const firstStep = (
      <div className={styles.description}>
        Step 1: Click the export button to export the analysis report template
        file
      </div>
    );

    switch (activeStep) {
      case 1:
        return firstStep;
      case 2:
        return (
          <>
            <div className={styles.description}>
              Step 2: Fill all required fields
            </div>
            <div className={styles.subDescription}>
              Please click to the link as below to direct to the analysis report
              page and fill all required fields
            </div>
            <a
              href={reportLink}
              className="link"
              target="_blank"
              rel="noreferrer"
            >
              {websiteLinkByEnv()}/audit-inspection-workspace/analytic-report
            </a>
          </>
        );
      case 3:
        return (
          <>
            <div className={styles.description}>
              Step 3: Attach the analysis report file
            </div>
            <div className={styles.subDescription}>
              Please update the template file and attach it
            </div>
          </>
        );
      case 4:
        return (
          <div className={styles.description}>Step 4: Submit the form</div>
        );
      default:
        return firstStep;
    }
  }, [activeStep, reportLink]);
  const closeAndReset = useCallback(async () => {
    setActiveStep(1);
    onClose();
  }, [onClose]);
  const changeStep = useCallback(
    (step: number) => {
      if (step < 1) {
        return;
      }
      if (step >= 5) {
        closeAndReset();
        return;
      }
      setActiveStep(step);
    },
    [closeAndReset],
  );

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      toggle={closeAndReset}
      {...other}
    >
      <div className={styles.content}>
        {activeStep !== 1 && (
          <div
            className={styles.prevStepControl}
            onClick={() => changeStep(activeStep - 1)}
          >
            <img
              src={images.analysisGuide.chevronLeftCircle}
              alt="chevronLeftCircle"
            />
          </div>
        )}
        <div
          className={styles.nextStepControl}
          onClick={() => changeStep(activeStep + 1)}
        >
          <img
            src={images.analysisGuide.chevronRightCircle}
            alt="chevronRightCircle"
          />
        </div>
        <img
          src={renderImageByStep}
          alt={`analysisGuideStep${activeStep}`}
          className={styles.guideImg}
        />
        <div className={styles.stepWrap}>
          {renderDescriptionByStep}
          <div className={styles.steps}>
            {activeStep !== 4 ? (
              <div className={styles.skip} onClick={closeAndReset}>
                Skip
              </div>
            ) : (
              <Button buttonType={ButtonType.Outline} onClick={closeAndReset}>
                Close
              </Button>
            )}
            <div className="d-flex align-items-center">
              {new Array(4).fill(0).map((_item, index) => (
                <div
                  key={String(index) + uniqueId}
                  onClick={() => changeStep(index + 1)}
                  className={cx(styles.step, {
                    [styles.activeStep]: activeStep === index + 1,
                  })}
                />
              ))}
            </div>

            {activeStep !== 4 ? (
              <Button onClick={() => changeStep(activeStep + 1)}>Next</Button>
            ) : (
              <a
                href={reportLink}
                className="link"
                target="_blank"
                rel="noreferrer"
              >
                <Button onClick={closeAndReset}>Go to analysis report</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AnalysisGuideModal;
