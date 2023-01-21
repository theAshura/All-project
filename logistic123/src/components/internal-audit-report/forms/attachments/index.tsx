import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../form.module.scss';

interface Props {
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const Attachments: FC<Props> = (props) => {
  const { disabled, dynamicLabels } = props;

  const { internalAuditReportDetail, loading } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { handleSetListAttachment, listAttachments } = useContext(
    InternalAuditReportFormContext,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    handleSetListAttachment(internalAuditReportDetail?.attachments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalAuditReportDetail]);

  return (
    <CollapseUI
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS.Attachments,
      )}
      collapseClassName={styles.collapseAttachments}
      isOpen={isOpen}
      content={
        <div className="pt-3">
          <TableAttachment
            classWrapper="pt-0"
            featurePage={Features.AUDIT_INSPECTION}
            subFeaturePage={SubFeatures.INTERNAL_AUDIT_REPORT}
            loading={loading}
            disableTitle
            dynamicLabels={dynamicLabels}
            disable={disabled}
            isEdit={!disabled}
            value={listAttachments}
            buttonName={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS.Attach,
            )}
            onchange={handleSetListAttachment}
          />
        </div>
      }
      toggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export default Attachments;
