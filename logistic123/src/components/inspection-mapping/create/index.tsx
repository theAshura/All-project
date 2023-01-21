import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import HeaderPage from 'components/common/header-page/HeaderPage';

import { CreateInspectionMappingParams } from 'models/api/inspection-mapping/inspection-mapping.model';
import { createInspectionMappingActions } from 'store/inspection-mapping/inspection-mapping.action';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import InspectionMappingForm from '../forms/InspectionMappingForm';
import styles from './create.module.scss';

export default function ChartOwnerCreate() {
  const { loading } = useSelector((state) => state.inspectionMapping);
  const dispatch = useDispatch();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const handleSubmit = useCallback(
    (formData: CreateInspectionMappingParams) => {
      dispatch(createInspectionMappingActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.inspectionMappingCreateWrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.INSPECTION_MAPPING_CREATE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
        )}
      />
      <InspectionMappingForm
        isEdit={!loading}
        data={undefined}
        isCreate={!loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
