import VIQDetailContainer from 'components/viq/details';
import { CommonQuery } from 'constants/common.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useLocation } from 'react-router-dom';

const VIQDetail = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.VIQ,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? <VIQDetailContainer /> : <NoPermissionComponent />
      }
    </PermissionCheck>
  );
};

export default VIQDetail;
