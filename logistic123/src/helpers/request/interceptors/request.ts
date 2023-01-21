import { AxiosRequestConfig } from 'axios';
import tokenManage from 'helpers/request/tokenManager';

export function addAccessToken(initialConfig: AxiosRequestConfig) {
  const config = initialConfig;
  const { token } = tokenManage;
  const account = {
    token,
  };

  let authorizationHeader = {};
  if (account && account.token) {
    authorizationHeader = {
      ...authorizationHeader,
      Authorization:
        (config.data && config.data.bearerToken ? '' : 'Bearer ') +
        account.token,
    };
    if (config.data && config.data.bearerToken) {
      delete config.data.bearerToken;
    }
  }
  config.headers = { ...config.headers, ...authorizationHeader };
  return config;
}

export function onRejected(error: Error) {
  return Promise.reject(error);
}
