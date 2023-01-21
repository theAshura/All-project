import { useCallback } from 'react';

import { createEventTypeActions } from 'store/event-type/event-type.action';
import { useDispatch } from 'react-redux';
import { CreateEventTypeParams } from 'models/api/event-type/event-type.model';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import styles from './create.module.scss';
import EventTypeForm from '../forms/EventTypeForm';

export default function NewEventTypeManagement() {
  const { t } = useTranslation(I18nNamespace.EVENT_TYPE);

  const dispatch = useDispatch();
  const handleSubmit = useCallback(
    (formData: CreateEventTypeParams) => {
      dispatch(createEventTypeActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.auditType}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.FLEET_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('eventTypeManagementTitle')}
          </div>
        </div>
        <EventTypeForm isEdit data={null} onSubmit={handleSubmit} isCreate />
      </Container>
    </div>
  );
}
