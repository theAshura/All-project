import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { CreateTopicParams } from 'models/api/topic/topic.model';
import { createTopicActions } from 'store/topic/topic.action';
import styles from './create.module.scss';
import TopicForm from '../forms/TopicForm';

export default function TopicCreate() {
  const { t } = useTranslation(I18nNamespace.TOPIC);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateTopicParams) => {
      dispatch(createTopicActions.request(formData));
    },
    [dispatch],
  );

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.TOPIC,
        action: ActionTypeEnum.CREATE,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.topicCreate}>
            <Container>
              <div className={cx(styles.headers)}>
                <BreadCrumb current={BREAD_CRUMB.TOPIC_CREATE} />
                <div className={cx('fw-bold', styles.title)}>
                  {t('headPageTitle')}
                </div>
              </div>
              <TopicForm isEdit data={null} isCreate onSubmit={handleSubmit} />
            </Container>
          </div>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
}
