import { toastError } from 'helpers/notification.helper';
import { logOutActions } from 'store/authenticate/authenticate.action';
import store from 'store';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';

export function onFullFilled(response: any) {
  return Promise.resolve(response);
}

function isNetworkError(err: any) {
  return !!err.isAxiosError && !err.response;
}

export function onRejected(error: any) {
  if (error) {
    const { response } = error;
    if (!isNetworkError(error)) {
      return Promise.reject(response && response.data);
    }

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('NETWORK_ERROR');
  }
  return Promise.reject();
}

export function onRejectedWithToken(error: any) {
  if (error) {
    const { response } = error;
    if (response?.status === 401) {
      history.replace(AppRouteConst.LOGIN);
      store.store.dispatch(logOutActions.request());
      toastError(
        'Your session is expired. Please log in again to use the system',
        5000,
      );
      return Promise.resolve(response && response);
    }
    if (!isNetworkError(error)) {
      return Promise.reject(response && response.data);
    }

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('NETWORK_ERROR');
  }
  return Promise.reject();
}
