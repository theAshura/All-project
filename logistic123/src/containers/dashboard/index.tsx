import { useSelector } from 'react-redux';
import DashBoardCompanyContainer from 'components/dashboard/company/DashBoardCompanyContainer';
import DashBoardSVMAdminContainer from 'components/dashboard/svm-admin/DashBoardSVMAdminContainer';
import DashBoardAuditorsContainer from 'components/dashboard/auditors/DashBoardAuditorsContainer';
import {
  RoleScope,
  SubFeatures,
  Features,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { useCallback } from 'react';
import PermissionCheck from 'hoc/withPermissionCheck';
// import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
// import { WorkFlowType } from 'constants/common.const';
import NoPermission from 'containers/no-permission';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.authenticate);
  // const { workFlowActiveUserPermission } = useSelector(
  //   (state) => state.workFlow,
  // );

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (userInfo.roleScope === RoleScope.User) {
  //     dispatch(
  //       getWorkFlowActiveUserPermissionActions.request({
  //         workflowType: WorkFlowType.PLANNING_REQUEST,
  //         isRefreshLoading: true,
  //       }),
  //     );
  //   }
  // }, []);

  const checkPermission = useCallback(() => {
    switch (userInfo.roleScope) {
      case RoleScope.SuperAdmin:
        return <DashBoardSVMAdminContainer />;
      case RoleScope.Admin:
        return (
          <PermissionCheck
            options={{
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.VIEW_DASHBOARD,
              action: ActionTypeEnum.VIEW,
            }}
          >
            {({ hasPermission }) =>
              hasPermission ? <DashBoardCompanyContainer /> : <NoPermission />
            }
          </PermissionCheck>
        );
      case RoleScope.User:
        return (
          <PermissionCheck
            options={{
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.VIEW_DASHBOARD,
              action: ActionTypeEnum.VIEW,
            }}
          >
            {({ hasPermission }) =>
              hasPermission ? <DashBoardAuditorsContainer /> : <NoPermission />
            }
          </PermissionCheck>
        );
      default:
        return <NoPermission />;
    }
  }, [userInfo]);
  return <>{checkPermission()} </>;
};

export default Dashboard;
