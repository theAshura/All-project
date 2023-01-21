import images from 'assets/images/images';
import cx from 'classnames';
import { toastError } from 'helpers/notification.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import moment from 'moment';
import { useCallback, useState, useEffect, useMemo } from 'react';
// import SwitchAccount from 'components/switch-account/SwitchAccount';
import { redirectByRolePermissions } from 'helpers/permissionCheck.helper';
import { RoleScope } from 'constants/roleAndPermission.const';
import { getUrlImageApi } from 'api/user.api';
import { TOOLTIP_COLOR } from 'constants/common.const';
// import InvisibleBackdrop from 'components/common/backdrop/InvisibleBackdrop';
import { resetPasswordAdminActions } from 'store/user/user.action';
import { useDispatch, useSelector } from 'react-redux';
import { CONFIG } from 'config';
import Tooltip from 'antd/lib/tooltip';
import history from 'helpers/history.helper';
import { getTimeZone } from 'helpers/date.helper';
import capitalize from 'lodash/capitalize';
import { Button, Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import {
  getUserProfileMe,
  logOutActions,
} from 'store/authenticate/authenticate.action';
import Notification from 'pages/notification/Notification';
import { useSocketNotification } from 'pages/notification/utils/hooks';
import ModalPasswordForm from 'components/user-profile/components/password/ModalPasswordForm';
import { AppRouteConst } from 'constants/route.const';
import { Popover } from 'antd/lib';
import { getWatchListActions } from 'store/watch-list/watch-list.actions';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import styles from './app-header.module.scss';

const AppHeader = () => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoCompany, setLogoCompany] = useState('');
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [messageError, setMessageError] = useState<{
    new?: string;
    confirm?: string;
  }>(null);
  // const [switchViewVisible, setSwitchViewVisible] = useState(false);
  const { userInfo, imageAvatar, userProfile } = useSelector(
    (state) => state.authenticate,
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserProfile,
    modulePage: getCurrentModulePageByStatus(true),
  });

  const { watchingList } = useSelector((state) => state.watchList);

  useSocketNotification();

  useEffectOnce(() => {
    if (userInfo) {
      dispatch(getUserProfileMe.request());
    }
  });

  useEffect(() => {
    if (userInfo?.company?.logo) {
      getUrlImageApi(userInfo?.company?.logo)
        .then((r) => {
          setLogoCompany(r?.data?.link);
        })
        .catch((err) => {
          toastError(err);
        });
    }
  }, [userInfo?.company?.logo]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const renderRole = useCallback(() => {
    let list = userProfile?.roles;
    if (userInfo?.roleScope === RoleScope.Admin && !userInfo?.switchedUser) {
      list = userProfile?.roles?.filter((item) => !item.companyId);
      return list?.map((i) => (
        <div className={styles.roleItem} key={i.id}>
          {i.name}
        </div>
      ));
    }
    const companyId = userInfo?.parentCompanyId || userInfo?.companyId;
    list = userProfile?.roles?.filter((item) => item?.companyId === companyId);
    return list?.map((i) => (
      <div className={styles.roleItem} key={i.id}>
        {i.name}
      </div>
    ));
  }, [
    userInfo?.companyId,
    userInfo?.parentCompanyId,
    userInfo?.roleScope,
    userInfo?.switchedUser,
    userProfile?.roles,
  ]);

  const redirectToProfile = useCallback(() => {
    if (history.location.pathname?.includes('/user-profile/detail/')) {
      toggle();
      return;
    }
    toggle();
    history.push(`/user-profile/detail/${userInfo?.id}?edit`);
  }, [userInfo?.id]);

  const handleResetPassword = (isShow: boolean) => {
    setOpenResetPassword(isShow);
    if (!isShow) {
      setMessageError(null);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo?.roleScope !== RoleScope.SuperAdmin) {
      dispatch(getWatchListActions.request());
    }
  }, [dispatch, userInfo, userInfo?.roleScope]);

  const onSaveChangePassword = useCallback(
    (data) => {
      if (data.new.text !== data.confirm.text) {
        setMessageError((prev) => ({
          ...prev,
          confirm: 'The password confirmation does not match',
        }));
        setOpenResetPassword(true);
        return;
      }

      dispatch(
        resetPasswordAdminActions.request({
          id: userInfo?.id,
          oldPassword: data?.oldPassword?.text || null,
          newPassword: data.new.text,
          confirmPassword: data.confirm.text,
          isProfile: true,
          handleSuccess: () => {
            setOpenResetPassword(false);
            setMessageError(null);
          },
        }),
      );
    },
    [dispatch, userInfo?.id],
  );

  const renderIconHeader = useMemo(
    () => (
      <div className="d-flex align-items-center justify-content-between">
        <div
          className={styles.iconWatchList}
          onClick={() => history.push(AppRouteConst.WATCH_LIST)}
        >
          <Popover
            trigger="click"
            visible={false}
            className={cx(styles.dropdown)}
            overlayClassName={styles.overlay}
            overlayInnerStyle={{
              background: 'none',
              boxShadow: 'none',
            }}
          >
            <div className={styles.notification}>
              <images.icons.IWatchList />
              {watchingList?.data?.length ? (
                <span className={styles.notificationCounter}>
                  {watchingList?.data?.length || 0}
                </span>
              ) : null}
            </div>
          </Popover>
        </div>
        <Notification />
      </div>
    ),
    [watchingList?.data?.length],
  );

  return (
    <header
      className={cx(
        'd-flex align-items-center justify-content-between',
        styles.header,
      )}
    >
      <div className="d-flex align-items-center position-relative">
        {userInfo?.roleScope !== RoleScope.SuperAdmin && (
          <Tooltip
            placement="topLeft"
            title={userInfo?.switchedUser || userInfo?.company?.name || ''}
            color={TOOLTIP_COLOR}
          >
            <div
              className={cx(styles.wrapCompany, 'd-flex align-items-center')}
            >
              <img
                className={cx(styles.logoCompany, 'ms-2')}
                src={logoCompany}
                onError={({ currentTarget }) => {
                  if (currentTarget && currentTarget?.src) {
                    // eslint-disable-next-line no-param-reassign
                    currentTarget.src = images.default.icCompanyDefault;
                  }
                }}
                alt="logo company"
              />

              <div className={cx('fw-bold', styles.title)}>
                {userInfo?.switchedUser || userInfo?.company?.name || ''}
              </div>
            </div>
          </Tooltip>
        )}

        {/* {!userInfo?.parentCompanyId &&
          userInfo?.roleScope !== RoleScope.SuperAdmin && (
            <Tooltip placement="right" title="Switch company" color="#333333">
              <div
                onClick={() => {
                  setSwitchViewVisible(true);
                }}
              >
                <img
                  src={images.icons.nextIcon}
                  alt="nextIcon"
                  className={styles.iconWitchView}
                />
              </div>
            </Tooltip>
          )}

        {!userInfo?.parentCompanyId &&
          userInfo?.roleScope !== RoleScope.SuperAdmin && (
            <div className={styles.wrapSwitchView}>
              <InvisibleBackdrop onClick={() => setSwitchViewVisible(false)}>
                <SwitchAccount
                  isShowMenu={isShowMenu}
                  isShow={switchViewVisible}
                  onClose={() => setSwitchViewVisible(false)}
                />
              </InvisibleBackdrop>
            </div>
          )} */}
      </div>
      <button
        className={cx(styles.btnLogo, 'd-flex')}
        onClick={() => redirectByRolePermissions(userInfo?.rolePermissions)}
      >
        <img
          className={styles.logo}
          src={images.logo.logoHeader}
          onError={({ currentTarget }) => {
            if (currentTarget && currentTarget?.src) {
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = images.common.avatarDefault;
            }
          }}
          alt="logo"
        />{' '}
        {CONFIG.NAME !== 'production' && (
          <div className={styles.env}>- {capitalize(CONFIG.NAME)}</div>
        )}
      </button>

      <div className="d-flex align-items-center">
        {userInfo?.roleScope !== RoleScope.SuperAdmin ? renderIconHeader : null}
        <Dropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          className={styles.dropdown}
          size="lg"
        >
          <DropdownToggle>
            <div className={cx('d-flex align-items-center', styles.infoHeader)}>
              <img
                className={styles.avatar}
                src={imageAvatar || images.common.avatarDefault}
                alt="logo"
                onError={({ currentTarget }) => {
                  if (currentTarget && currentTarget?.src) {
                    // eslint-disable-next-line no-param-reassign
                    currentTarget.src = images.common.avatarDefault;
                  }
                }}
              />
              <div className="text-start">
                <p className={cx('fw-bold mb-0', styles.userName)}>
                  {`${userInfo?.firstName || ' '} ${userInfo?.lastName || ' '}`}
                </p>
                <p className={cx('mb-0', styles.role)}>{userInfo?.jobTitle}</p>
              </div>
            </div>
          </DropdownToggle>
          <DropdownMenu
            left="true"
            className={cx('w-100', styles.dropdownMenu)}
          >
            <div>
              <div className={styles.headerTitle}>
                <span>
                  {renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Profile,
                  )}
                </span>
                <div className={styles.icClose} onClick={toggle}>
                  <img src={images.icons.icClose} alt="ic-close-modal" />
                </div>
              </div>
              <img
                className={styles.avatarCard}
                src={imageAvatar || images.common.avatarDefault}
                onError={({ currentTarget }) => {
                  if (currentTarget && currentTarget?.src) {
                    // eslint-disable-next-line no-param-reassign
                    currentTarget.src = images.common.avatarDefault;
                  }
                }}
                alt="logo"
              />
              <p className={cx('fw-bold mb-0 mt-2')}>
                {`${userProfile?.firstName || ' '} ${
                  userInfo?.lastName || ' '
                }`}
              </p>
              <p className={cx(styles.txtJob, 'mb-0 mt-2')}>
                {userProfile?.jobTitle}
              </p>
              <p className={cx(styles.txtEmail, 'mb-0 mt-2')}>
                {userInfo?.email}
              </p>
              <div className="d-flex flex-wrap justify-content-center mt-2 mx-3">
                {renderRole()}
              </div>
              <p className={cx(styles.lastLogin, 'mb-0 mt-2')}>
                {`${renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Last login'],
                )} ${moment(
                  new Date(userProfile?.lastLogin) || new Date(),
                ).format('Do MMMM YYYY | HH:mm')} (${getTimeZone()})`}
              </p>
              {userInfo?.roleScope === RoleScope.SuperAdmin && (
                <Button
                  className="w-100 text-start"
                  onClick={() => handleResetPassword(true)}
                >
                  <img
                    className={styles.icLogOut}
                    src={images.icons.icBxLockAlt}
                    alt="icon icBxLockAlt"
                  />
                  Change Password
                </Button>
              )}
              {userInfo?.roleScope !== RoleScope.SuperAdmin && (
                <Button
                  className="w-100 text-start"
                  disabled={!!userInfo?.switchUserId}
                  onClick={redirectToProfile}
                >
                  <img
                    className={styles.icLogOut}
                    src={images.icons.master.icSelfAssessmentGray}
                    alt="icon menu"
                  />
                  {renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Profile,
                  )}
                </Button>
              )}
              <Button
                className="w-100 text-start"
                onClick={() => {
                  dispatch(logOutActions.request());
                }}
              >
                <img
                  className={styles.icLogOut}
                  src={images.icons.icLogOutCircle}
                  alt="icon menu"
                />
                {renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Sign out'],
                )}
              </Button>
            </div>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ModalPasswordForm
        isShow={openResetPassword}
        setOpenResetPassword={handleResetPassword}
        onSave={onSaveChangePassword}
        messageError={messageError}
        setMessageError={setMessageError}
      />
    </header>
  );
};

export default AppHeader;
