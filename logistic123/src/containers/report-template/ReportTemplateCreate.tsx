import ReportTemplateNew from 'components/report-template/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const NewReportTemplate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.REPORT_TEMPLATE,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <div>
          <BreadCrumb current={AppRouteConst.REPORT_TEMPLATE_CREATE} />
          <ReportTemplateNew />
        </div>
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default NewReportTemplate;
