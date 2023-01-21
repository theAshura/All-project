import AuthorityMasterCreateContainer from 'components/authority-master/details';
import { CommonQuery } from 'constants/common.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';
import { useLocation } from 'react-router-dom';
import './authority-master.scss';

const AuthorityMasterCreate = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.AUTHORITY_MASTER,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
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
};

export default AuthorityMasterCreate;
