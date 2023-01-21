import ReportOfFindingCreateContainer from 'components/report-of-finding/create';
import ReportOfFindingProvider from 'contexts/report-of-finding/ReportOfFindingContext';

const ReportOfFindingCreate = () => (
  <ReportOfFindingProvider>
    <ReportOfFindingCreateContainer />
  </ReportOfFindingProvider>
);
export default ReportOfFindingCreate;
