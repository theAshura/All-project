import { API_BASE_URL } from 'constants/common.const';
import axios from 'axios';

import * as RequestInterceptor from './interceptors/request';
import * as ResponseInterceptor from './interceptors/response';

const getInstance = (baseUrl: string | undefined) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 180000,
  });
  instance.interceptors.response.use(
    ResponseInterceptor.onFullFilled,
    ResponseInterceptor.onRejected,
  );

  return instance;
};

const getInstanceAuthorized = (baseUrl: string | undefined) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 180000,
  });
  instance.interceptors.request.use(
    RequestInterceptor.addAccessToken,
    RequestInterceptor.onRejected,
  );

  instance.interceptors.response.use(
    ResponseInterceptor.onFullFilled,
    ResponseInterceptor.onRejectedWithToken,
  );

  return instance;
};

export const request = getInstance(API_BASE_URL);
export const requestAuthorized = getInstanceAuthorized(API_BASE_URL);
