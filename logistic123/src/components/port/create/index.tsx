import { useCallback } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useDispatch, useSelector } from 'react-redux';
import { VesselType } from 'models/api/vessel-type/vessel-type.model';

import { createPortActions } from 'store/port/port.action';

import HeaderPage from 'components/common/header-page/HeaderPage';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import PortManagementForm from '../forms/PortForm';
import styles from './create.module.scss';

export default function PortManagementCreate() {
  const dispatch = useDispatch();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const handleSubmit = useCallback(
    (formData: VesselType) => {
      dispatch(createPortActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.vesselTypeCreate}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PORT_CREATE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonPortmaster,
        )}
      />
      <PortManagementForm isEdit data={null} isCreate onSubmit={handleSubmit} />
    </div>
  );
}
