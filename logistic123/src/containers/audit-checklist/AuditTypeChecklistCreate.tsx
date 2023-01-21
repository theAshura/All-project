import AuditCheckListCreateContainer from 'components/audit-checklist/create';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const AuditCheckListCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.AUDIT_CHECKLIST,
      action: ActionTypeEnum.EXECUTE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <AuditCheckListCreateContainer />
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default AuditCheckListCreate;
