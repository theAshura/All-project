import InternalAuditReportDetailContainer from 'components/internal-audit-report/details/';
import InternalAuditReportProvider from 'contexts/internal-audit-report/IARFormContext';

const InternalAuditReportDetail = () => (
  <InternalAuditReportProvider>
    <InternalAuditReportDetailContainer />
  </InternalAuditReportProvider>
);

export default InternalAuditReportDetail;
