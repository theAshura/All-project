import InspectionHistoryTable from 'components/common/inspection-history/InspectionHistory';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { useState } from 'react';
import cx from 'classnames';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { useSelector } from 'react-redux';
import styles from '../form.module.scss';

const InspectionHistory = ({ dynamicLabels }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  return (
    <CollapseUI
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Inspection history'],
      )}
      collapseClassName={cx(
        styles.collapse,
        styles.inspectionHistoryTableWrapper,
      )}
      isOpen={isOpen}
      content={
        <div>
          <InspectionHistoryTable
            dynamicLabels={dynamicLabels}
            vesselId={internalAuditReportDetail?.vesselId}
            departmentId={internalAuditReportDetail?.departmentId}
            pageSizeDefault={5}
            moduleTemplate={
              MODULE_TEMPLATE.internalAuditReportInspectionHistoryTable
            }
          />
        </div>
      }
      toggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export default InspectionHistory;
