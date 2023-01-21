import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  createApplicationRequest,
  deletetApplicationRequest,
  editApplicationRequest,
  getListApplicationParams,
  getListApplicationRequest,
} from "api/product-selector/application-selector.api";
import {
  ApplicationEditParams,
  ApplicationParams,
} from "api/product-selector/application-selector.interface";

import { AxiosResponse } from "axios";
import { mapErrorMessage } from "helpers/utilities.helper";
export interface ApplicationData {
  _id: string;
  name: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationResponse {
  count?: number;
  currentPage?: number;
  data: ApplicationData[];
  totalPage?: number;
}

interface InitialState {
  application: ApplicationResponse | undefined;
  loading: boolean;
}

const initialState: InitialState = {
  application: undefined,
  loading: false,
};

const actions = {
  getListApplicationAction: createAsyncThunk(
    "USER/GETLIST",
    async (params: getListApplicationParams) => {
      try {
        const response: AxiosResponse = await getListApplicationRequest(params);

        return response?.data?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  createApplicationAction: createAsyncThunk(
    "APPLICATION/CREATE",
    async (params: ApplicationParams) => {
      try {
        const response: AxiosResponse = await createApplicationRequest(
          params.dataForm
        );

        if (params?.getData) {
          params.getData();
        }
        message.success("Created Successfully");

        return response?.data?.user;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  editApplicationAction: createAsyncThunk(
    "APPLICATION/EDIT",
    async (params: ApplicationEditParams) => {
      try {
        const response: AxiosResponse = await editApplicationRequest(params);

        if (params?.getData) {
          params.getData();
        }
        message.success("Update Successfully!");

        return response?.data?.user;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  deleteApplicationAction: createAsyncThunk(
    "USER/DELETE",
    async (params: { id: string; getData: () => void }) => {
      try {
        const response: AxiosResponse = await deletetApplicationRequest(
          params?.id
        );

        if (params?.getData) {
          params.getData();
        }
        message.success("Delete Successfully");

        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
};
const applicationSlice = createSlice({
  name: "UserAction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.getListApplicationAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      actions.getListApplicationAction.fulfilled,
      (state, action) => {
        state.loading = false;
        state.application = action.payload;
      }
    );
    builder.addCase(actions.getListApplicationAction.rejected, (state) => {
      state.loading = false;
      state.application = undefined;
    });
    builder.addCase(actions.deleteApplicationAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(actions.deleteApplicationAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(actions.deleteApplicationAction.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(actions.createApplicationAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(actions.createApplicationAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(actions.createApplicationAction.rejected, (state) => {
      state.loading = false;
      state.application = undefined;
    });
    builder.addCase(actions.editApplicationAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(actions.editApplicationAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(actions.editApplicationAction.rejected, (state) => {
      state.loading = false;
      state.application = undefined;
    });
  },
});
export const ApplicationActions = { ...applicationSlice.actions, ...actions };
export default applicationSlice.reducer;
