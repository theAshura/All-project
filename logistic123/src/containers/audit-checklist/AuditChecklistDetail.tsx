import AuditCheckListDetailContainer from 'components/audit-checklist/detail';
import { CommonQuery } from 'constants/common.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';
import { useLocation } from 'react-router-dom';

const AuditCheckListDetail = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.AUDIT_CHECKLIST,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.EXECUTE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <AuditCheckListDetailContainer />
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default AuditCheckListDetail;
