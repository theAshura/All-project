import { FC, useCallback } from 'react';
import cx from 'classnames';
import images from 'assets/images/images';
import moment from 'moment';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { NOTIFICATION_DYNAMIC_LABELS } from 'constants/dynamic/notification.const';
import styles from './notification-item.module.scss';
import { deleteNotificationApi, markNotificationAsReadApi } from './utils/api';
import { moduleDetailPathDictionary, Notification } from './utils/constants';
import { parseStatus } from './utils/helpers';
import { NotificationAction } from './Notification';

export interface Props {
  item?: Notification;
  getList: (currentAction: NotificationAction, id?: string) => void;
  myActivityHomePage?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const NotificationItem: FC<Props> = ({
  item,
  getList,
  myActivityHomePage,
  dynamicLabels,
}) => {
  const handleMarkAsRead = useCallback(
    async (e) => {
      try {
        e?.domEvent?.stopPropagation();
        await markNotificationAsReadApi(item?.id);
        getList(NotificationAction.READ, item?.id);
        toastSuccess(
          renderDynamicLabel(
            dynamicLabels,
            NOTIFICATION_DYNAMIC_LABELS['Marked notification as read'],
          ),
        );
      } catch (error) {
        toastError(error);
      }
    },
    [item?.id, getList, dynamicLabels],
  );

  const handleDelete = useCallback(
    async (e) => {
      try {
        e?.domEvent?.stopPropagation();
        await deleteNotificationApi(item?.id);
        getList(NotificationAction.DELETE, item?.id);
        toastSuccess(
          renderDynamicLabel(
            dynamicLabels,
            NOTIFICATION_DYNAMIC_LABELS['Delete notification successfully'],
          ),
        );
      } catch (error) {
        toastError(error);
      }
    },
    [item?.id, getList, dynamicLabels],
  );

  const menuOptions = useCallback(
    (item: Notification) => (
      <Menu className={styles.dropdown_wrapper}>
        {!item.isRead ? (
          <Menu.Item
            key="1"
            className={styles.dropdown_item_custom}
            onClick={!myActivityHomePage && handleMarkAsRead}
          >
            {renderDynamicLabel(
              dynamicLabels,
              NOTIFICATION_DYNAMIC_LABELS['Mark as read'],
            )}
          </Menu.Item>
        ) : null}
        <Menu.Item
          key="2"
          className={styles.dropdown_item_custom}
          onClick={!myActivityHomePage && handleDelete}
        >
          {renderDynamicLabel(
            dynamicLabels,
            NOTIFICATION_DYNAMIC_LABELS.Delete,
          )}
        </Menu.Item>
      </Menu>
    ),
    [dynamicLabels, handleDelete, handleMarkAsRead, myActivityHomePage],
  );

  const handleGoToDetail = useCallback(async () => {
    const moduleName =
      item.module === 'Self assessment' && item?.extendData?.selfAssessmentId
        ? 'Self declaration'
        : item.module;
    const path = moduleDetailPathDictionary[moduleName]?.(item.recordId, {
      selfAssessmentId: item?.extendData?.selfAssessmentId,
    });
    if (path) {
      try {
        await markNotificationAsReadApi(item?.id);
        getList(NotificationAction.READ, item?.id);
      } catch (error) {
        // Do nothing
      }
      const win = window.open(path, '_blank');
      win.focus();
    }
  }, [
    getList,
    item?.extendData?.selfAssessmentId,
    item?.id,
    item.module,
    item.recordId,
  ]);

  return (
    <div
      className={cx(styles.itemContainer, 'd-flex justify-content-between', {
        [styles.itemActive]: !item?.isRead && !myActivityHomePage,
      })}
      onClick={!myActivityHomePage && handleGoToDetail}
    >
      <div className={styles.leftContent}>
        <p className={styles.name}>{item?.module || '-'}</p>
        <div>
          <p className={styles.content}>
            <span>
              {renderDynamicLabel(
                dynamicLabels,
                NOTIFICATION_DYNAMIC_LABELS.Record,
              )}
            </span>
            &nbsp;
            <span className={styles.recordName}>{item?.recordRef || '-'}</span>
            &nbsp;
            <span>
              {renderDynamicLabel(
                dynamicLabels,
                NOTIFICATION_DYNAMIC_LABELS['updated information'],
              )}
            </span>
          </p>
        </div>
        {item?.currentStatus && item?.previousStatus && (
          <div>
            <p className={styles.content}>
              <span>
                {renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS['Status changed'],
                )}
              </span>
              &nbsp;
              <span className={styles.statusName}>
                {parseStatus(item?.previousStatus)}
              </span>
              <span className={styles.greaterThanSign}>&nbsp;&#62;&nbsp;</span>
              <span className={styles.statusName}>
                {parseStatus(item?.currentStatus)}
              </span>
            </p>
          </div>
        )}

        <div className={cx('d-flex justify-content-start', styles.extraInfo)}>
          <span className={styles.name}>{item?.performerName}</span>
          <span className={styles.dash}>-</span>
          <span className={styles.date}>{item?.performerJobTitle}</span>
          <span className={styles.icDotBlue}>&#x2022;</span>
          <span className={styles.date}>
            {moment(item?.executedAt).local().format('DD/MM/YYYY - hh:mm A')}
          </span>
        </div>
      </div>
      {!myActivityHomePage && (
        <div className={styles.rightContent}>
          <div className={styles.actions}>
            <Dropdown
              trigger={['click']}
              overlay={() => menuOptions(item)}
              className={styles.fixWidth}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <img
                  src={images.icons.ic3DotVertical}
                  alt="more"
                  className={styles.moreAction}
                />
              </div>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
