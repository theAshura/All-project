import ReportOfFindingListContainer from 'components/report-of-finding/list';
import ReportOfFindingProvider from 'contexts/report-of-finding/ReportOfFindingContext';

const ReportOfFindingList = () => (
  <ReportOfFindingProvider>
    <ReportOfFindingListContainer />
  </ReportOfFindingProvider>
);
export default ReportOfFindingList;
