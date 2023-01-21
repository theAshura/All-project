import { useCallback } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useDispatch, useSelector } from 'react-redux';
import { NewMailManagement } from 'models/api/mail-management/mail-management.model';

import { createMailManagementActions } from 'store/mail-management/mail-management.action';

import HeaderPage from 'components/common/header-page/HeaderPage';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import MailManagementForm from '../forms/MailManagementForm';
import styles from './create.module.scss';

export default function MailManagementCreate() {
  const dispatch = useDispatch();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const handleSubmit = useCallback(
    (formData: NewMailManagement) => {
      dispatch(createMailManagementActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.content}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.MAIL_MANAGEMENT_CREATE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
        )}
      />
      <MailManagementForm isEdit data={null} isCreate onSubmit={handleSubmit} />
    </div>
  );
}
