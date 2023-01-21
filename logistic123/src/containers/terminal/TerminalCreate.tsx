import TerminalCreateContainer from 'components/terminal/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const TerminalCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.TERMINAL} />
    <TerminalCreateContainer />
  </div>
);

export default TerminalCreate;
