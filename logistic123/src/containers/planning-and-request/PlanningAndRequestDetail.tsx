import PlanningAndRequestDetailContainer from 'components/planning-and-request/details';
import { CommonQuery } from 'constants/common.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useLocation } from 'react-router-dom';

const PlanningAndRequestDetail = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.AUDIT_INSPECTION,
        subFeature: SubFeatures.PLANNING_AND_REQUEST,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.EXECUTE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <PlanningAndRequestDetailContainer />
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};
export default PlanningAndRequestDetail;
