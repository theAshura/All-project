import WorkFlowCreateContainer from 'components/work-flow/create';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const WorkFlowCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? <WorkFlowCreateContainer /> : <NoPermissionComponent />
    }
  </PermissionCheck>
);

export default WorkFlowCreate;
