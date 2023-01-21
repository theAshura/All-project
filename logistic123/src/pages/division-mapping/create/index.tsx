import DivisionMappingForm from 'components/division-mapping/form';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const DivisonMappingCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.ATTACHMENT_KIT,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? <DivisionMappingForm /> : <NoPermissionComponent />
    }
  </PermissionCheck>
);

export default DivisonMappingCreate;
