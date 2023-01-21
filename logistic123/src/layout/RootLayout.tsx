import { FC, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { AuthRouteConst, MainRouteConst } from 'constants/route.const';
import { ModalConfirmBase } from 'components/ui/modal/confirmBase';
import AppRoute from '../routes/app.routes';
import AuthenLayout from '../containers/auth/AuthenLayout';
import {
  AsyncLogin,
  AsyncRecoverPassword,
  AsyncResetPassword,
  AsyncExpiredLink,
  AsyncResetPasswordRoutine,
} from '../routes/login.routes';
import AppLayout from './AppLayout';

const RootLayout: FC = () => (
  <Suspense fallback={<div />}>
    <Switch>
      <Route path={AuthRouteConst.SIGN_IN}>
        <AuthenLayout>
          <AsyncLogin />
        </AuthenLayout>
      </Route>
      <Route path={AuthRouteConst.RECOVER_PASSWORD}>
        <AuthenLayout>
          <AsyncRecoverPassword />
        </AuthenLayout>
      </Route>
      <Route path={AuthRouteConst.RESET_PASSWORD}>
        <AuthenLayout>
          <AsyncResetPassword />
        </AuthenLayout>
      </Route>
      <Route path={AuthRouteConst.RESET_PASSWORD_ROUTINE}>
        <AuthenLayout>
          <AsyncResetPasswordRoutine />
        </AuthenLayout>
      </Route>
      <Route path={AuthRouteConst.EXPIRED_LINK}>
        <AsyncExpiredLink />
      </Route>
      <Route path={MainRouteConst.APP} exact>
        <AppLayout>
          <AppRoute />
        </AppLayout>
      </Route>
    </Switch>
    <ModalConfirmBase />
  </Suspense>
);

export default RootLayout;
