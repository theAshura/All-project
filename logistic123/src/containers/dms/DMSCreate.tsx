import DMSCreateContainer from 'components/dms/create';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const DMSCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.DMS,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <div>
          <DMSCreateContainer />
        </div>
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default DMSCreate;
