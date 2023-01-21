import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC } from 'react';
import styles from './step.module.scss';

interface Props {
  prevStep?: () => void;
  nextStep?: () => void;
  handleCancel?: () => void;
  onSubmit?: () => void;
  onSave?: () => void;
  onAccept?: () => void;
  onDeny?: () => void;
  disableSubmit?: boolean;
  disableAccepted?: boolean;
  disableDenied?: boolean;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const FooterBtns: FC<Props> = ({
  prevStep,
  nextStep,
  handleCancel,
  onSubmit,
  onSave,
  onDeny,
  onAccept,
  disableSubmit,
  disableAccepted,
  disableDenied,
  loading = false,
  dynamicLabels,
}) => (
  <div className="d-flex align-items-center justify-content-between">
    <div className="d-flex align-items-center">
      {prevStep && (
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.CancelOutline}
          onClick={prevStep}
          className={styles.btnPrev}
        >
          {'<'}
        </Button>
      )}
      {nextStep && (
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.CancelOutline}
          onClick={nextStep}
          className={styles.btnNext}
        >
          {'>'}
        </Button>
      )}
    </div>
    <div>
      {handleCancel && (
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.CancelOutline}
          onClick={handleCancel}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
        </Button>
      )}
      {onSave && (
        <Button
          className={styles.btnSubmit}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          onClick={onSave}
          disabledCss={disableSubmit}
          disabled={disableSubmit}
          loading={loading}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
        </Button>
      )}
      {onSubmit && (
        <Button
          className={styles.btnSubmit}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Green}
          onClick={onSubmit}
          disabledCss={disableSubmit}
          disabled={disableSubmit}
          loading={loading}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Submit)}
        </Button>
      )}
      {onAccept && (
        <Button
          className={styles.btnSave}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          onClick={onAccept}
          disabledCss={disableAccepted}
          disabled={disableAccepted}
          loading={loading}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Accept)}
        </Button>
      )}
      {onDeny && (
        <Button
          className={styles.btnSubmit}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Dangerous}
          onClick={onDeny}
          disabledCss={disableDenied}
          disabled={disableDenied}
          loading={loading}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Deny)}
        </Button>
      )}
    </div>
  </div>
);

export default FooterBtns;
