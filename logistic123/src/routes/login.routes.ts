import { lazy } from 'react';
import componentLoader from '../helpers/loader.helper';

export const AsyncLogin = lazy(() =>
  componentLoader(() => import('../containers/auth/sign-in/SignIn')),
);

export const AsyncRecoverPassword = lazy(() =>
  componentLoader(
    () => import('../containers/auth/recover-password/RecoverPassword'),
  ),
);

export const AsyncResetPassword = lazy(() =>
  componentLoader(
    () => import('../containers/auth/reset-password/ResetPassword'),
  ),
);

export const AsyncResetPasswordRoutine = lazy(() =>
  componentLoader(
    () => import('../containers/auth/reset-password/ChangePasswordRoutine'),
  ),
);

export const AsyncExpiredLink = lazy(() =>
  componentLoader(() => import('../containers/auth/expired-link/ExpiredLink')),
);
