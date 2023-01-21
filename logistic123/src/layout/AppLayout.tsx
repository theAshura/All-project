import cx from 'classnames';
import useEffectOnce from 'hoc/useEffectOnce';
import { FC, Suspense, useCallback, useState } from 'react';
import { RoleScope } from 'constants/roleAndPermission.const';
import { useDispatch, useSelector } from 'react-redux';
import { getListDynamicLabelsActions } from 'store/dynamic/dynamic.action';
import history from 'helpers/history.helper';
import { AuthRouteConst } from 'constants/route.const';
import styles from './app-layout.module.scss';
import AppHeader from './header/AppHeader';
import AppMenu from './menu/AppMenu';

const AppLayout: FC = ({ children }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const { userInfo } = useSelector((state) => state.authenticate);
  const dispatch = useDispatch();
  const toggleCollapsed = useCallback(() => {
    setIsShow((e) => !e);

    /**
     * DO NOT REMOVE THIS CODE: This code is used to hack the resize window event when sidebar is toggled,
     * so that react-grid-layout will re-render to update the layout's width
     */
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
    /**
     * DO NOT REMOVE THIS CODE
     */
  }, []);

  useEffectOnce(() => {
    if (!userInfo) {
      history.push(AuthRouteConst.SIGN_IN);
      return;
    }
    if (userInfo?.roleScope !== RoleScope.SuperAdmin) {
      dispatch(getListDynamicLabelsActions.request({}));
    }
  });

  return (
    <div className={styles.appLayout}>
      <AppHeader />
      <div className={cx('d-flex', styles.appBody)}>
        <AppMenu isCollapsed={isShow} setIsCollapsed={toggleCollapsed} />
        <div
          className={styles.appContainer}
          style={{
            width: !isShow && `calc(100% - 60px)`,
            transition: 'width 0.2s linear',
          }}
        >
          <Suspense fallback={<div />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
