import AttachmentKitCreateContainer from 'components/attachment-kit/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';
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
      subFeature: SubFeatures.ATTACHMENT_KIT,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <div>
          <BreadCrumb current={AppRouteConst.MAIN_CATEGORY_CREATE} />
          <AttachmentKitCreateContainer />
        </div>
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default AttachmentKitCreate;
