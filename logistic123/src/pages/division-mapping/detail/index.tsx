import DivisionMappingForm from 'components/division-mapping/form';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

const DivisonMappingCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.DIVISION_MAPPING,
      action: ActionTypeEnum.UPDATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? <DivisionMappingForm /> : <NoPermissionComponent />
    }
  </PermissionCheck>
);

export default DivisonMappingCreate;
