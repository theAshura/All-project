import IssueNoteCreateContainer from 'components/issue-note/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const IssueNoteCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.ISSUE_NOTE_CREATE} />
    <IssueNoteCreateContainer />
  </div>
);

export default IssueNoteCreate;
