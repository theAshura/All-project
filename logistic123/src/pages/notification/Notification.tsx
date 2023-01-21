import { useCallback, useMemo, useState } from 'react';
import Dropdown from 'antd/lib/dropdown';
import cx from 'classnames';
import images from 'assets/images/images';
import { InputSearch } from 'components/ui/inputSearch/InputSearch';
import { debounce } from 'lodash';
import Popover from 'antd/lib/popover';
import { AppRouteConst } from 'constants/route.const';
import Tabs from 'antd/lib/tabs';
import Menu from 'antd/lib/menu';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { useSelector } from 'react-redux';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { NOTIFICATION_DYNAMIC_LABELS } from 'constants/dynamic/notification.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import styles from './notification.module.scss';
import { NotificationType, Notification } from './utils/constants';
import {
  getListNotificationsApi,
  markAllNotificationsAsReadApi,
} from './utils/api';
import NotificationItem from './NotificationItem';

interface Props {
  title?: string;
  className?: string;
  onChangeSearch?: (value: string) => void;
}

export enum NotificationAction {
  READ = 'read',
  DELETE = 'delete',
}

const NotificationWrap = ({ className, onChangeSearch }: Props) => {
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState<string>(NotificationType.ALL);
  const [listNotifications, setListNotifications] = useState<Notification[]>(
    [],
  );
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { totalUnreadNotification } = useSelector(
    (state) => state.notification,
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Notification,
    modulePage: ModulePage.List,
  });

  const handleMarkAllAsRead = useCallback(
    async (e) => {
      try {
        e.domEvent.stopPropagation();
        await markAllNotificationsAsReadApi();
        if (activeTab === NotificationType.UNREAD) {
          setListNotifications([]);
        } else {
          setListNotifications((prevList) =>
            prevList.map((item) => ({
              ...item,
              isRead: true,
            })),
          );
        }
        toastSuccess(
          renderDynamicLabel(
            dynamicLabels,
            NOTIFICATION_DYNAMIC_LABELS['Marked all notification as read'],
          ),
        );
      } catch (error) {
        toastError(error);
      }
    },
    [activeTab, dynamicLabels],
  );

  const menuOptions = useCallback(
    () => (
      <Menu className={styles.dropdownWrapper}>
        <Menu.Item
          key="1"
          className={styles.dropdown_item_custom}
          onClick={handleMarkAllAsRead}
        >
          {renderDynamicLabel(
            dynamicLabels,
            NOTIFICATION_DYNAMIC_LABELS['Mark all as read'],
          )}
        </Menu.Item>
      </Menu>
    ),
    [dynamicLabels, handleMarkAllAsRead],
  );

  const debounce_fun = useMemo(
    () =>
      debounce((nextValue: string) => {
        onChangeSearch?.(nextValue);
      }, 300),
    [onChangeSearch],
  );

  const handleInputOnchange = useCallback(
    (e) => {
      const { value } = e.target;
      debounce_fun(value);
    },
    [debounce_fun],
  );

  const handleGetList = useCallback(
    (tab?: string) => async () => {
      const params: any = {
        pageSize: -1,
      };
      if (tab === NotificationType.UNREAD) {
        params.isRead = false;
      }
      try {
        setLoading(true);
        const { data } = await getListNotificationsApi(params);
        setListNotifications(data?.data || []);
        setLoading(false);
      } catch (error) {
        toastError(error);
        setLoading(false);
      }
    },
    [],
  );

  const handleChangeTab = useCallback(
    (tabKey: string) => {
      setActiveTab(tabKey);
      handleGetList(tabKey)();
    },
    [handleGetList],
  );

  const handleVisibleChange = useCallback(
    (newVisible: boolean) => {
      setVisible(newVisible);

      if (newVisible) {
        handleGetList(activeTab)();
      }
    },
    [activeTab, handleGetList],
  );

  const handleUpdateList = useCallback(
    (currentAction: NotificationAction, id?: string) => {
      if (!id) {
        return null;
      }

      if (currentAction === NotificationAction.DELETE) {
        setListNotifications(
          listNotifications.filter((notification) => notification.id !== id),
        );

        return null;
      }

      let updatedNotifications: Notification[] = [];

      updatedNotifications =
        activeTab === NotificationType.ALL
          ? listNotifications.map((notification) => {
              if (notification.id === id) {
                return {
                  ...notification,
                  isRead: true,
                };
              }
              return notification;
            })
          : listNotifications.filter((notification) => notification.id !== id);

      setListNotifications(updatedNotifications);

      return updatedNotifications;
    },
    [listNotifications, activeTab],
  );

  const tabContent = useMemo(() => {
    if (loading) {
      return (
        <div className="position-relative">
          <div className={cx(styles.dataWapper)}>
            <img
              src={images.common.loading}
              className={cx(styles.loading)}
              alt="loading"
            />
          </div>
        </div>
      );
    }

    if (!listNotifications.length) {
      return (
        <div className={cx(styles.dataWapper)}>
          <img
            src={images.icons.icNoData}
            className={styles.noData}
            alt="no data"
          />
        </div>
      );
    }

    return (
      <div className={styles.contentWrapper}>
        {listNotifications?.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            getList={handleUpdateList}
            dynamicLabels={dynamicLabels}
          />
        ))}
      </div>
    );
  }, [dynamicLabels, handleUpdateList, listNotifications, loading]);

  const renderTabPane = useCallback(
    (tabType: string) => (
      <TabPane
        tab={
          <div
            className={cx(styles.tableTabTitle, {
              [styles.activeTab]: activeTab === tabType,
            })}
          >
            {tabType === NotificationType.ALL
              ? renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS.All,
                )
              : renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS.Unread,
                )}
          </div>
        }
        key={tabType}
      >
        {tabContent}
      </TabPane>
    ),
    [TabPane, activeTab, dynamicLabels, tabContent],
  );

  const menu = useMemo(
    () => (
      <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
        <div
          className={cx(
            styles.headerContainer,
            'd-flex justify-content-between align-items-center',
          )}
        >
          <span className={styles.headerTitle}>
            {renderDynamicLabel(
              dynamicLabels,
              NOTIFICATION_DYNAMIC_LABELS.Notification,
            )}
          </span>
          <div className={styles.rightContent}>
            <div className={styles.actions}>
              <Dropdown trigger={['click']} overlay={menuOptions}>
                <img
                  src={images.icons.ic3DotVertical}
                  alt="more"
                  className={styles.moreAction}
                />
              </Dropdown>
            </div>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <InputSearch
            onSearch={handleInputOnchange}
            className={cx('w-100', styles.searchInput)}
            autoFocus
            dynamicLabels={dynamicLabels}
          />
        </div>
        <div className="text-align-center pb-2">
          <a
            target="_blank"
            href={`${AppRouteConst.NOTIFICATION}?tab=${NotificationType.ALL}&page=1&pageSize=20`}
            rel="noreferrer"
          >
            {renderDynamicLabel(
              dynamicLabels,
              NOTIFICATION_DYNAMIC_LABELS['View all notifications'],
            )}
          </a>
        </div>
        <Tabs
          activeKey={activeTab}
          tabBarStyle={{
            borderBottom: 'unset',
            marginBottom: 0,
            // width: '100% ',
          }}
          onChange={handleChangeTab}
          destroyInactiveTabPane
          centered
          size="large"
          // style={{ width: '100%' }}
        >
          {renderTabPane(NotificationType.ALL)}
          {renderTabPane(NotificationType.UNREAD)}
        </Tabs>
      </div>
    ),
    [
      activeTab,
      dynamicLabels,
      handleChangeTab,
      handleInputOnchange,
      menuOptions,
      renderTabPane,
    ],
  );

  return (
    <Popover
      content={menu}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      className={cx(styles.dropdown, className)}
      overlayClassName={styles.overlay}
      overlayInnerStyle={{
        background: 'none',
        boxShadow: 'none',
      }}
    >
      <div className={styles.notification}>
        <img
          className={styles.icNotification}
          src={images.icons.icNotification}
          alt="logo"
        />
        {totalUnreadNotification ? (
          <span className={styles.notificationCounter}>
            {totalUnreadNotification || 0}
          </span>
        ) : null}
      </div>
    </Popover>
  );
};

export default NotificationWrap;
