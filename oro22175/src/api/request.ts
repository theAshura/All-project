/* BASE REQUEST INTERCEPTORS CONFIG
   ========================================================================== */

import axios, { AxiosError } from "axios";

import { IBaseErrorResponse } from "./interfaces";
import { getFromSessionStorage } from "utils/functions";
import { mapErrorMessage } from "helpers/utilities.helper";
import ROUTES from "routes/constant";

/**
 * Authenticated Request Interceptors config
 */
export const requestWithJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: false,
});

requestWithJwt.interceptors.request.use(async (config) => {
  const refreshToken = getFromSessionStorage<string | null>("__token");

  return {
    ...config,
    headers: {
      Authorization: `Bearer ${refreshToken || ""}`,
      ...config.headers,
    },
  };
});

requestWithJwt.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<IBaseErrorResponse>) => {
    if (!error.response || error?.response?.status === 401) {
      localStorage.removeItem("expireTime");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("__token");
      localStorage.removeItem("pathname");
      mapErrorMessage(error);
      setTimeout(() => {
        window.location.href = ROUTES.login;
      }, 1000);

      Promise.reject({
        code: "Unknown",
        status: 500,
        message: "Server error",
      });
      return;
    }
    return Promise.reject({
      ...error.response?.data,
    });
  }
);

/**
 * Non-authenticated Request Interceptors config
 */
export const requestWithoutJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: false,
});

requestWithoutJwt.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<IBaseErrorResponse>) => {
    return Promise.reject({
      ...error.response?.data,
    });
  }
);
