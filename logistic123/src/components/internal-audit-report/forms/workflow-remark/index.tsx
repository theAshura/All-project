import { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import styles from '../form.module.scss';

interface Props {
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const WorkFlowRemark: FC<Props> = ({ disabled, dynamicLabels }) => {
  const { workflowRemarks, handleSetWorkFlowRemarks, setTouched } = useContext(
    InternalAuditReportFormContext,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { control } = useForm();

  return (
    <CollapseUI
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Workflow remarks'],
      )}
      collapseClassName={styles.collapse}
      isOpen={isOpen}
      content={
        <>
          <TextAreaForm
            placeholder={
              !disabled &&
              renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Enter workflow remarks'],
              )
            }
            control={control}
            disabled={disabled}
            minRows={2}
            name="workflowRemarks"
            onChange={(e) => {
              setTouched(true);
              handleSetWorkFlowRemarks(e.target.value);
            }}
            value={workflowRemarks}
            maxLength={500}
          />
        </>
      }
      toggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export default WorkFlowRemark;
