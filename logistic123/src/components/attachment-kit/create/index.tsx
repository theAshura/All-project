import { useCallback } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { useDispatch } from 'react-redux';
import { AttachmentKitData } from 'models/api/attachment-kit/attachment-kit.model';
import { createAttachmentKitActions } from 'store/attachment-kit/attachment-kit.action';

import HeaderPage from 'components/common/header-page/HeaderPage';
import AttachmentKitForm from '../forms/AttachmentKitForm';
import styles from './create.module.scss';

export default function AttachmentKitCreate() {
  const { t } = useTranslation(I18nNamespace.ATTACHMENT_KIT);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: AttachmentKitData) => {
      dispatch(createAttachmentKitActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.vesselTypeCreate}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.ATTACHMENT_KIT_CREATE}
        titlePage={t('attachmentKit')}
      />
      <AttachmentKitForm isEdit data={null} isCreate onSubmit={handleSubmit} />
    </div>
  );
}
