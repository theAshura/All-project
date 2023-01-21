import { FC, Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import NoDataImg from 'components/common/no-data/NoData';
import { toastError } from 'helpers/notification.helper';
import { getRoleAndPermissionApi } from 'api/role.api';
import { AppRouteConst } from 'constants/route.const';
import { login } from 'store/authenticate/authenticate.action';
import styles from './switch-account.module.scss';

import {
  getListCompanyAxiosApi,
  switchCompanyApi,
} from '../../api/company.api';

interface Props {
  isShow: boolean;
  isShowMenu: boolean;
  onClose: () => void;
}

const SwitchAccount: FC<Props> = ({ isShow, isShowMenu, onClose }) => {
  const dispatch = useDispatch();
  const { token, userInfo } = useSelector((state) => state.authenticate);
  const [listCompany, setListCompany] = useState<any>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isShow) {
      setSearch('');
    }
  }, [isShow]);

  useEffect(() => {
    getRoleAndPermissionApi({})
      .then((res) => {
        dispatch(
          login.success({
            ...userInfo,
            rolePermissions: res?.data?.rolePermissions,
          }),
        );
      })
      .catch((err) => toastError(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getListCompanyAxiosApi(
      {
        companyId: userInfo?.mainCompanyId,
        status: 'active',
      },
      userInfo?.mainToken || userInfo?.token,
    )
      .then((res) => {
        setListCompany(res?.data || []);
      })
      .catch((err) => {
        toastError(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.companyId, userInfo?.mainToken, userInfo?.token]);

  const listSubCompany = useMemo(
    () =>
      userInfo?.switchableCompanies?.map((i) => {
        const info = listCompany?.find((item) => item.id === i);
        return info || null;
      }),
    [listCompany, userInfo?.switchableCompanies],
  );

  const handleData = useCallback(
    (data) => {
      if (search) {
        const listFiltered = data?.filter((i) => i?.name?.includes(search));
        return listFiltered;
      }
      return data;
    },
    [search],
  );

  const resetToken = useCallback(async () => {
    if (
      userInfo?.switchUserId !== userInfo?.parentCompany?.id &&
      !!userInfo?.switchUserId
    ) {
      await dispatch(
        login.success({
          ...userInfo,
          mainToken: userInfo?.mainToken || token,
          token: userInfo?.mainToken,
          switchUserId: null,
          switchedUser: '',
          parentCompany: null,
          company: {
            id: userInfo?.mainCompany?.id,
            name: userInfo?.mainCompany?.name,
            logo: userInfo?.mainCompany?.logo,
          },
          companyId: userInfo?.mainCompany?.id,
        }),
      );
      await history.push(AppRouteConst.HOME_PAGE);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [dispatch, token, userInfo]);

  const handleSwitchCompany = useCallback(
    (item) => {
      const { id, name, logo } = item;
      switchCompanyApi({ childCompany: id })
        .then(async (res: any) => {
          await dispatch(
            login.success({
              ...userInfo,
              mainToken: userInfo?.mainToken || token,
              token: res?.data?.switchToken,
              switchUserId: id,
              switchedUser: name,
              parentCompany: userInfo?.parentCompany || userInfo?.company,
              company: {
                id,
                name,
                logo,
              },
              companyId: id,
            }),
          );
          await history.push(AppRouteConst.HOME_PAGE);
          setTimeout(() => {
            window.location.reload();
          }, 100);
        })
        .catch((err) => {
          toastError(err);
        });
    },
    [dispatch, token, userInfo],
  );

  const parentCompany = useMemo(() => {
    if (userInfo?.parentCompany) {
      return userInfo?.parentCompany;
    }
    return userInfo?.company;
  }, [userInfo?.company, userInfo?.parentCompany]);

  return (
    <div
      className={cx(styles.wrap, {
        [styles.isCollapsed]: !isShowMenu,
        [styles.isHidden]: !isShow,
      })}
    >
      <div className={styles.header}>
        <div onClick={onClose}>
          <img
            src={images.icons.nextIcon}
            alt="closeSwitch"
            className={styles.closeSwitch}
          />
        </div>
        <div className={styles.title}>Switch to</div>
      </div>
      <div className={styles.subTitle}>Parent company name</div>

      <div className={styles.wrapCompany} onClick={resetToken}>
        <div
          className={cx(styles.name, {
            [styles.activeCompany]:
              (userInfo?.switchUserId &&
                userInfo?.switchUserId === parentCompany?.id) ||
              !userInfo?.switchUserId,
          })}
        >
          {parentCompany?.name}
        </div>
        {userInfo?.switchUserId !== parentCompany?.id &&
          !!userInfo?.switchUserId && (
            <div className={styles.iconSwitch}>
              <img src={images.icons.switchIcon} alt="switchIcon" />
            </div>
          )}
      </div>

      <div className={cx(styles.subTitle, styles.childCompany)}>
        Child company
      </div>
      <Input
        renderPrefix={
          <img
            src={images.icons.menu.icSearchInActive}
            alt="buttonReset"
            className={styles.iconSearch}
          />
        }
        className={styles.inputSearch}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        maxLength={128}
        placeholder="Search"
      />

      {handleData(listSubCompany)?.length ? (
        handleData(listSubCompany)?.map((i, index) => (
          <Fragment key={String(i?.id + String(index))}>
            <div
              className={styles.wrapCompany}
              onClick={() => {
                if (userInfo?.switchUserId !== i?.id) {
                  handleSwitchCompany(i);
                }
              }}
            >
              <div
                className={cx(styles.name, {
                  [styles.activeCompany]:
                    userInfo?.switchUserId && userInfo?.switchUserId === i?.id,
                })}
              >
                {i?.name}
              </div>
              {userInfo?.switchUserId !== i?.id && (
                <div className={styles.iconSwitch}>
                  <img src={images.icons.switchIcon} alt="switchIcon" />
                </div>
              )}
            </div>
            <div className={styles.separate} />
          </Fragment>
        ))
      ) : (
        <NoDataImg />
      )}
    </div>
  );
};

export default SwitchAccount;
