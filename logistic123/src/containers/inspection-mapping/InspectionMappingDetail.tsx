import InspectionMappingDetailContainer from 'components/inspection-mapping/details';
import { CommonQuery } from 'constants/common.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useLocation } from 'react-router-dom';

import './inspection-mapping.scss';

const InspectionMappingDetail = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.INSPECTION_MAPPING,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className="inspection-mapping wrap__Form">
            <InspectionMappingDetailContainer />
          </div>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default InspectionMappingDetail;
