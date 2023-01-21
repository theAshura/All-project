import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { CreateViqParams } from 'models/api/viq/viq.model';
import { clearVIQErrorsReducer, createVIQActions } from 'store/viq/viq.action';

import HeaderPage from 'components/common/header-page/HeaderPage';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import styles from './create.module.scss';
import VIQForm from '../forms/VIQForm';

export default function VIQCreate() {
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateViqParams) => {
      dispatch(
        createVIQActions.request({
          ...formData,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearVIQErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.VIQCreate}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.VIQ_CREATE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
        )}
      />
      <VIQForm isEdit data={undefined} isCreate onSubmit={handleSubmit} />
    </div>
  );
}
