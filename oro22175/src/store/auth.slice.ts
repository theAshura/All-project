import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  FormLoginProps,
  LoginParams,
  LoginResponse,
  LoginUserInfo,
} from "api/auth/auth.interface";
import { loginRequest } from "api/auth/auth.api";
import { AxiosResponse } from "axios";
import { mapErrorMessage } from "helpers/utilities.helper";

interface InitialState {
  userInfo: LoginUserInfo | undefined;
  loading: boolean;
}

const initialState: InitialState = {
  userInfo: undefined,
  loading: false,
};

/**
 * Async actions for post-list
 */
const actions = {
  loginAction: createAsyncThunk(
    "AUTH/LOGIN",
    async (params: LoginParams, { rejectWithValue }) => {
      try {
        const response: AxiosResponse<LoginResponse> = await loginRequest(
          params.loginInfo
        );
        if (response.status < 200 || response.status >= 300) {
          return rejectWithValue("Invalid Email or Password!");
        }

        window.localStorage.setItem(
          "expireTime",
          JSON.stringify(response?.data?.exp)
        );
        window.localStorage.setItem(
          "userInfo",
          JSON.stringify(response?.data?.user)
        );
        message.success("Login Successfully!");
        params.setRefreshToken(response?.data?.token);
        return response?.data?.user;
      } catch (error) {
        mapErrorMessage(error);
        return rejectWithValue("Invalid Email or Password!");
      }
    }
  ),

  setUserInfoAction: createAsyncThunk(
    "AUTH/SET_USER_INFO",
    async (params: FormLoginProps | undefined) => {
      return params;
    }
  ),
  setUserProfile: createAsyncThunk(
    "AUTH/SET_USER_PROFILE",
    async (params: Partial<LoginUserInfo>) => {
      return params;
    }
  ),
  logoutAction: createAsyncThunk("AUTH/LOGOUT", async () => {
    window.localStorage.removeItem("__token");
    window.localStorage.removeItem("userInfo");
    window.localStorage.removeItem("expireTime");
    window.localStorage.removeItem("pathname");
    return true;
  }),
};

/**
 * Slice for post-list
 */
const authSlice = createSlice({
  name: "loginAction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.loginAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(actions.loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(actions.loginAction.rejected, (state) => {
      state.loading = false;
      state.userInfo = undefined;
    });

    builder.addCase(
      actions.setUserInfoAction.fulfilled,
      (state, action: any) => {
        state.loading = false;
        state.userInfo = action.payload;
      }
    );
    builder.addCase(actions.setUserProfile.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    });
    builder.addCase(actions.logoutAction.fulfilled, (state) => {
      state.userInfo = undefined;
    });
  },
});

/**
 * Export all actions, reducer for post-list
 */
export const authActions = { ...authSlice.actions, ...actions };

export default authSlice.reducer;
