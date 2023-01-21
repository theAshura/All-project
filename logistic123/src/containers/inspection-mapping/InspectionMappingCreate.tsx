import InspectionMappingCreateContainer from 'components/inspection-mapping/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

import './inspection-mapping.scss';

const InspectionMappingCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.INSPECTION_MAPPING,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <div className="inspection-mapping  wrap__Form">
          <BreadCrumb current={AppRouteConst.INSPECTION_MAPPING_CREATE} />
          <InspectionMappingCreateContainer />
        </div>
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default InspectionMappingCreate;
