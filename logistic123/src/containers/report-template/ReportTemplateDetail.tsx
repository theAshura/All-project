import ReportTemplateDetailContainer from 'components/report-template/details';
import { CommonQuery } from 'constants/common.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useLocation } from 'react-router-dom';

const ReportTemplateDetail = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.REPORT_TEMPLATE,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <ReportTemplateDetailContainer />
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default ReportTemplateDetail;
