import MailManagementCreate from 'components/mail-management/create';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const AttachmentKitCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.MAIL_MANAGEMENT,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? <MailManagementCreate /> : <NoPermissionComponent />
    }
  </PermissionCheck>
);

export default AttachmentKitCreate;
