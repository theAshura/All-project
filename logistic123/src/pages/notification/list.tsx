import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import { Modal } from 'reactstrap';
import moment from 'moment';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Tabs from 'antd/lib/tabs';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import history from 'helpers/history.helper';
import images from 'assets/images/images';
import { parseQueries } from 'helpers/utils.helper';
import Input from 'components/ui/input/Input';
import { useLocation } from 'react-router';
import { KeyPress } from 'constants/common.const';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { useSelector } from 'react-redux';
import { AsyncNoPermissionComponent } from 'routes/app.routes';
import { RoleScope } from 'constants/roleAndPermission.const';
import { NOTIFICATION_DYNAMIC_LABELS } from 'constants/dynamic/notification.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import styles from './list.module.scss';
import {
  NotificationType,
  Notification,
  moduleDetailPathDictionary,
} from './utils/constants';
import {
  deleteNotificationApi,
  getListNotificationsApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from './utils/api';
import { parseStatus } from './utils/helpers';

const NotificationList = () => {
  const { TabPane } = Tabs;
  const { search } = useLocation();
  const [isModalOpen, setModalOPen] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItem: 0,
    totalPage: 0,
  });
  const [listNotifications, setListNotifications] = useState<Notification[]>(
    [],
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Notification,
    modulePage: ModulePage.List,
  });
  const {
    tab,
    page,
    pageSize,
    content = '',
  } = useMemo(() => {
    const queries = parseQueries(search);
    return {
      tab: queries.tab,
      page: Number(queries.page),
      pageSize: Number(queries.pageSize),
      content: queries.content,
    };
  }, [search]);

  const handleChangeTab = useCallback(
    (tabKey: string) => {
      let url = `${AppRouteConst.NOTIFICATION}?tab=${tabKey}&page=${page}&pageSize=${pageSize}`;
      if (content) {
        url = `${url}&content=${content}`;
      }
      history.push(url);
    },
    [content, page, pageSize],
  );

  const handleGetList = useCallback(async () => {
    const params: any = {
      page: page || 1,
      pageSize: pageSize || 1,
    };
    const searchText = content.trim();
    if (searchText) {
      params.content = searchText;
    }
    if (tab === NotificationType.UNREAD) {
      params.isRead = false;
    }
    try {
      setLoading(true);
      const response = await getListNotificationsApi(params);
      setListNotifications(response?.data?.data || []);
      setPagination({
        totalItem: response?.data?.totalItem,
        totalPage: response?.data?.totalPage,
      });
      setLoading(false);
    } catch (error) {
      toastError(error);
      setLoading(false);
    }
  }, [content, page, pageSize, tab]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsReadApi();
      handleGetList();
      renderDynamicLabel(
        dynamicLabels,
        NOTIFICATION_DYNAMIC_LABELS['Marked all notifications as read'],
      );
    } catch (error) {
      toastError(error);
    }
  }, [dynamicLabels, handleGetList]);

  const menuOptions = useCallback(
    () => (
      <Menu>
        <Menu.Item
          key="1"
          className={styles.dropdownButton}
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

  const handleMarkAsRead = useCallback(
    (id) => async (e) => {
      try {
        e.domEvent.stopPropagation();
        await markNotificationAsReadApi(id);
        handleGetList();
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
    [dynamicLabels, handleGetList],
  );

  const handleDelete = useCallback(
    (id) => async (e) => {
      try {
        e.domEvent.stopPropagation();
        await deleteNotificationApi(id);
        handleGetList();
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
    [dynamicLabels, handleGetList],
  );

  const rowMenuOptions = useCallback(
    (item: Notification) => (
      <Menu>
        {!item.isRead ? (
          <Menu.Item
            key="2"
            className={styles.dropdownButton}
            onClick={handleMarkAsRead(item?.id)}
          >
            {renderDynamicLabel(
              dynamicLabels,
              NOTIFICATION_DYNAMIC_LABELS['Mark as read'],
            )}
          </Menu.Item>
        ) : null}
        <Menu.Item
          key="3"
          className={styles.dropdownButton}
          onClick={handleDelete(item?.id)}
        >
          {renderDynamicLabel(
            dynamicLabels,
            NOTIFICATION_DYNAMIC_LABELS.Delete,
          )}
        </Menu.Item>
      </Menu>
    ),
    [dynamicLabels, handleDelete, handleMarkAsRead],
  );

  const onChangePage = useCallback(
    (page: number, pageSize?: number) => {
      let url = `${AppRouteConst.NOTIFICATION}?tab=${tab}&page=${page}&pageSize=${pageSize}`;
      if (content) {
        url = `${url}&content=${content}`;
      }
      history.push(url);
    },
    [content, tab],
  );

  const renderStatusChanged = useCallback((fromStatus, toStatus) => {
    if (!fromStatus || !toStatus) {
      return null;
    }

    return (
      <div className={styles.statusWrap}>
        <div className={cx(styles.box)}>{parseStatus(fromStatus)}</div>
        <div className={cx(styles.seperator)}>
          &nbsp;&nbsp;{'>'}&nbsp;&nbsp;
        </div>
        <div className={cx(styles.box)}>{parseStatus(toStatus)}</div>
      </div>
    );
  }, []);

  const rowLabels = useMemo(
    () => [
      {
        id: 'info',
        label: '',
        sort: false,
        width: '200',
        cellRender: (item: Notification) => {
          const {
            module,
            performerJobTitle,
            performerName,
            recordRef,
            executedAt,
          } = item;
          return (
            <>
              <div className={styles.info}>
                <div className={styles.moduleName}>{module || ''}</div>
                <div className={cx('d-flex', styles.description)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    NOTIFICATION_DYNAMIC_LABELS.Record,
                  )}
                  &nbsp;
                  <div className={styles.record}>{recordRef || ''}</div>
                  &nbsp;
                  {renderDynamicLabel(
                    dynamicLabels,
                    NOTIFICATION_DYNAMIC_LABELS['updated information'],
                  )}
                </div>
              </div>
              <div className={styles.authorWrap}>
                <div className={styles.author}>
                  {performerName || ''} - {performerJobTitle || ''}
                </div>
                <div className={styles.time}>
                  {moment(executedAt).local().format('DD/MM/YYYY - hh:mm A')}
                </div>
              </div>
            </>
          );
        },
      },
      {
        id: 'status',
        label: '',
        sort: false,
        width: '200',
        cellRender: (item: Notification) => {
          const { previousStatus, currentStatus } = item;
          return (
            <>
              <div className="d-flex justify-content-between">
                <div className={cx(styles.statusChanged)}>
                  <div>
                    {renderDynamicLabel(
                      dynamicLabels,
                      NOTIFICATION_DYNAMIC_LABELS['Status changed'],
                    )}
                    :&nbsp;&nbsp;
                  </div>
                  {renderStatusChanged(previousStatus, currentStatus)}
                </div>
                <div className={cx('me-3', styles.rowActions)}>
                  <Dropdown
                    overlay={() => rowMenuOptions(item)}
                    trigger={['click']}
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
              <div>&nbsp;</div>
            </>
          );
        },
      },
    ],
    [dynamicLabels, renderStatusChanged, rowMenuOptions],
  );

  const toggleModalOpen = useCallback(() => {
    setModalOPen((prev) => !prev);
  }, []);

  const handleOpenDetailNotification = useCallback(
    (item) => () => {
      setItem(item);
      setModalOPen(true);
    },
    [],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (listNotifications?.length <= 0) {
        return null;
      }

      return (
        <tbody>
          {listNotifications?.map((item: Notification, index: number) => {
            const data = {
              info: item.previousStatus,
              status: item.currentStatus,
            };

            return (
              <RowComponent
                key={item?.id ?? index}
                isScrollable={isScrollable}
                data={data}
                onClickRow={handleOpenDetailNotification(item)}
                classNameRow={cx(styles.row, {
                  [styles.itemActive]: !item?.isRead,
                })}
                customCellRender={(key) => {
                  const label = rowLabels.find((label) => label?.id === key);
                  return label?.cellRender(item);
                }}
              />
            );
          })}
        </tbody>
      );
    },
    [handleOpenDetailNotification, listNotifications, rowLabels],
  );

  const handleChangeSearchValue = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case 'search': {
          let url = `${AppRouteConst.NOTIFICATION}?tab=${tab}&page=${page}&pageSize=${pageSize}`;
          if (value) {
            url = `${url}&content=${value}`;
          }
          history.replace(url);
          break;
        }
        default:
          break;
      }
    },
    [page, pageSize, tab],
  );

  const onKeyUp = useCallback(
    (e) => {
      if (e.keyCode === KeyPress.ENTER) {
        handleGetList();
      }
    },
    [handleGetList],
  );

  const handleGoToDetail = useCallback(
    (item: Notification) => async () => {
      const moduleName =
        item.module === 'Self assessment' && item?.extendData?.selfAssessmentId
          ? 'Self declaration'
          : item.module;
      const path = moduleDetailPathDictionary[moduleName]?.(item.recordId, {
        selfAssessmentId: item?.extendData?.selfAssessmentId,
      });
      if (path) {
        const win = window.open(path, '_blank');
        win.focus();
        try {
          await markNotificationAsReadApi(item?.id);
          await handleGetList();
          setModalOPen(false);
        } catch (error) {
          // Do nothing
        }
      }
    },
    [handleGetList],
  );

  useEffect(() => {
    handleGetList();
  }, [handleGetList]);

  const renderTabPane = useCallback(
    (tabType: string) => (
      <TabPane
        tab={
          <div
            className={cx(styles.tableTabTitle, {
              [styles.activeTab]: tab === tabType,
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
        <TableCp
          rowLabels={rowLabels}
          loading={loading}
          renderRow={renderRow}
          page={page}
          pageSize={pageSize}
          totalItem={pagination.totalItem}
          totalPage={pagination.totalPage}
          handleChangePage={onChangePage}
          isEmpty={!listNotifications?.length}
          classNameHeader={styles.tableHeader}
          isHiddenAction
          dynamicLabels={dynamicLabels}
        />
      </TabPane>
    ),
    [
      TabPane,
      dynamicLabels,
      listNotifications?.length,
      loading,
      onChangePage,
      page,
      pageSize,
      pagination.totalItem,
      pagination.totalPage,
      renderRow,
      rowLabels,
      tab,
    ],
  );

  const mainContent = useMemo(
    () => (
      <div className={styles.container}>
        <div className={cx('d-flex justify-content-between', styles.header)}>
          {renderDynamicLabel(
            dynamicLabels,
            NOTIFICATION_DYNAMIC_LABELS.Notification,
          )}
          <div className={styles.actions}>
            <Dropdown overlay={menuOptions} trigger={['click']}>
              <img
                src={images.icons.ic3DotVertical}
                alt="more"
                className={styles.moreAllAction}
              />
            </Dropdown>
          </div>
        </div>

        <div className={styles.content}>
          <div className={cx('d-flex', styles.searchContainer)}>
            <Input
              renderPrefix={
                <img
                  src={images.icons.menu.icSearchInActive}
                  alt="buttonReset"
                />
              }
              onKeyUp={onKeyUp}
              className={cx(styles.search)}
              onChange={(e) =>
                handleChangeSearchValue('search', e.target.value)
              }
              value={content}
              maxLength={128}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                NOTIFICATION_DYNAMIC_LABELS.Search,
              )}
              wrapperInput={styles.wrapperInput}
            />

            <Button
              className={styles.searchBtn}
              onClick={handleGetList}
              buttonType={ButtonType.Outline}
              buttonSize={ButtonSize.Medium}
            >
              {renderDynamicLabel(
                dynamicLabels,
                NOTIFICATION_DYNAMIC_LABELS.Search,
              )}
            </Button>
          </div>

          <Tabs
            activeKey={tab}
            tabBarStyle={{
              margin: '0',
              padding: '0 20px',
              borderBottom: 'unset',
            }}
            onChange={handleChangeTab}
            destroyInactiveTabPane
          >
            {renderTabPane(NotificationType.ALL)}
            {renderTabPane(NotificationType.UNREAD)}
          </Tabs>
        </div>

        <Modal
          isOpen={isModalOpen}
          toggle={toggleModalOpen}
          modalClassName={cx(styles.wrapper)}
          contentClassName={cx(styles.wrapperInner)}
          fade={false}
        >
          <div className={cx(styles.modalContainer)}>
            <div className={cx(styles.logo)}>
              <img src={images.logo.iNautixLogo} alt="iNautixLogo" />
            </div>
            <div className={cx(styles.message)}>
              <div className="mb-4">
                {renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS['Dear customer'],
                )}
                ,
              </div>
              <div>
                {renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS[
                    'There is an update information of record in'
                  ],
                )}
                [{item?.module}]{' '}
                {renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS['in i-Nautix system'],
                )}
                .{' '}
                {item?.previousStatus && item?.currentStatus && (
                  <>
                    {renderDynamicLabel(
                      dynamicLabels,
                      NOTIFICATION_DYNAMIC_LABELS['The status changed from'],
                    )}{' '}
                    <span className={styles.capitalize}>
                      {item?.previousStatus?.toLowerCase()}
                    </span>{' '}
                    {renderDynamicLabel(
                      dynamicLabels,
                      NOTIFICATION_DYNAMIC_LABELS.to,
                    )}{' '}
                    <span className={styles.capitalize}>
                      {item?.currentStatus?.toLowerCase()}
                    </span>
                  </>
                )}
              </div>
              <div
                className={cx('mb-4', styles.detailLink)}
                onClick={handleGoToDetail(item)}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS['Click to view more detail'],
                )}
                .
              </div>
              <div>
                {renderDynamicLabel(
                  dynamicLabels,
                  NOTIFICATION_DYNAMIC_LABELS[
                    'Thank you for choosing our system'
                  ],
                )}{' '}
                !
              </div>
            </div>
          </div>
        </Modal>
      </div>
    ),
    [
      content,
      dynamicLabels,
      handleChangeSearchValue,
      handleChangeTab,
      handleGetList,
      handleGoToDetail,
      isModalOpen,
      item,
      menuOptions,
      onKeyUp,
      renderTabPane,
      tab,
      toggleModalOpen,
    ],
  );

  if (userInfo?.roleScope === RoleScope.SuperAdmin) {
    return <AsyncNoPermissionComponent />;
  }

  return mainContent;
};

export default NotificationList;
