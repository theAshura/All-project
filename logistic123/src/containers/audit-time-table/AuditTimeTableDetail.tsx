import AuditTimeTableDetailContainer from 'components/audit-time-table/details';
import CalendarTimeTableProvider from 'contexts/audit-time-table/CalendarTimeTable';
import { CommonQuery } from 'constants/common.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useLocation } from 'react-router-dom';

const AuditTimeTableDetail = () => {
  const { search } = useLocation();

  return (
    <PermissionCheck
      options={{
        feature: Features.AUDIT_INSPECTION,
        subFeature: SubFeatures.AUDIT_TIME_TABLE,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <CalendarTimeTableProvider>
            <div>
              <AuditTimeTableDetailContainer />
            </div>
          </CalendarTimeTableProvider>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default AuditTimeTableDetail;
