import ReportOfFindingDetailContainer from 'components/report-of-finding/details';
import ReportOfFindingProvider from 'contexts/report-of-finding/ReportOfFindingContext';

const ReportOfFindingDetail = () => (
  <ReportOfFindingProvider>
    <ReportOfFindingDetailContainer />
  </ReportOfFindingProvider>
);

export default ReportOfFindingDetail;
