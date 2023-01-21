import PlanningAndRequestCreateContainer from 'components/planning-and-request/create';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const PlanningAndRequestCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.AUDIT_INSPECTION,
      subFeature: SubFeatures.PLANNING_AND_REQUEST,
      action: ActionTypeEnum.EXECUTE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <PlanningAndRequestCreateContainer />
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default PlanningAndRequestCreate;
