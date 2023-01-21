import AuthorityMasterCreateContainer from 'components/authority-master/create';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

import './authority-master.scss';

const AuthorityMasterCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.AUTHORITY_MASTER,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <div className="authority-master  wrap__Form">
          <AuthorityMasterCreateContainer />
        </div>
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default AuthorityMasterCreate;
