import MailManagementDetailContainer from 'components/mail-management/details';
import { CommonQuery } from 'constants/common.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useLocation } from 'react-router-dom';

const AttachmentKitDetail = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.MAIL_MANAGEMENT,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <MailManagementDetailContainer />
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default AttachmentKitDetail;
