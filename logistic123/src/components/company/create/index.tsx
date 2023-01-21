import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { createCompanyManagementActions } from 'store/company/company.action';
import HeaderPage from 'components/common/header-page/HeaderPage';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';
import { CreateManagementParams } from 'models/store/company/company.model';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import CompanyManagementForm from '../forms/CompanyForm';
import styles from './create.module.scss';

const NewCompanyManagementContainer = () => {
  const dispatch = useDispatch();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const handleCreateCompany = useCallback(
    (data: CreateManagementParams) => {
      const dataParams = { ...data };
      if (data.phone === '') {
        delete dataParams?.phone;
      }
      dispatch(createCompanyManagementActions.request(dataParams));
    },
    [dispatch],
  );

  return (
    <PermissionCheck
      options={{
        feature: Features.GROUP_COMPANY,
        subFeature: SubFeatures.COMPANY,
        action: ActionTypeEnum.CREATE,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.companyManagement}>
            <HeaderPage
              breadCrumb={BREAD_CRUMB.COMPANY_CREATE}
              titlePage={renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.GroupCompanyCompany,
              )}
            />
            <CompanyManagementForm
              isView={false}
              data={null}
              onSubmit={handleCreateCompany}
              isCreate
            />
          </div>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default NewCompanyManagementContainer;
