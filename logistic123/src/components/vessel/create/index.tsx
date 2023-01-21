import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import PermissionCheck from 'hoc/withPermissionCheck';
import { CreateVesselParams } from 'models/api/vessel/vessel.model';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVesselActions } from 'store/vessel/vessel.action';
import VesselManagementForm from '../forms/VesselForm';
import styles from './create.module.scss';

function VesselCreateComponent() {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonVessel,
    modulePage: ModulePage.Create,
  });
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateVesselParams) => {
      const finalData = {
        ...formData,
        image: formData.image ? formData.image : undefined,
      };
      dispatch(createVesselActions.request(finalData));
    },
    [dispatch],
  );

  return (
    <div className={styles.vesselCreate}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.VESSEL_CREATE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVessel,
        )}
      />
      <VesselManagementForm
        data={null}
        dynamicLabels={dynamicLabels}
        screen="create"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

const VesselTypeCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.CONFIGURATION,
      subFeature: SubFeatures.VESSEL,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? <VesselCreateComponent /> : <NoPermissionComponent />
    }
  </PermissionCheck>
);

export default VesselTypeCreate;
