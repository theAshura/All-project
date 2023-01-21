import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  deleteSeller,
  getListSeller,
  getListStates,
  getSellerDetail,
  postSeller,
  putSeller,
} from "api/saler/saler.api";
import {
  DataSaler,
  GetListSalerResponse,
  ParamSearchSaler,
  PostSalerParams,
  State,
  StateParams,
} from "api/saler/saler.interface";
import { AxiosResponse } from "axios";
import { mapErrorMessage } from "helpers/utilities.helper";

const initialState = {
  data: {} as {
    data: GetListSalerResponse;
  },
  isLoading: false,
  error: "",
  params: {} as ParamSearchSaler,
  dataDetail: {} as { data: DataSaler },
  isReload: false,
  state: {} as { data: State | undefined },
};
const actionSaler = {
  fetchSaler: createAsyncThunk(
    "GET/FETCH_SALER",
    async (params: ParamSearchSaler, { rejectWithValue }) => {
      const response = await getListSeller(params);
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data.data);
      }
      return response.data.data as unknown as GetListSalerResponse;
    }
  ),
  postSaler: createAsyncThunk(
    "POST/CREATE_SALER",
    async (params: { body: PostSalerParams; getData?: () => void }) => {
      try {
        const response: AxiosResponse = await postSeller(params?.body);
        if (params.getData) {
          params.getData();
        }
        message.success("Created Successfully");
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  putSaler: createAsyncThunk(
    "PUT/UPDATE_SALER",
    async (params: {
      id: string;
      body: PostSalerParams;
      getData?: () => void;
    }) => {
      try {
        const response: AxiosResponse = await putSeller(params.id, params.body);
        if (params.getData) {
          params.getData();
        }
        message.success("Update Successfully!");
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  detailSaler: createAsyncThunk(
    "PUT/DETAIL_PRODUCT",
    async (params: { id: string }) => {
      try {
        const response: AxiosResponse = await getSellerDetail(params.id);
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  deleteSaler: createAsyncThunk(
    "DELETE/PRODUCT",
    async (params: { id: string; getData: () => void }) => {
      try {
        const response: AxiosResponse = await deleteSeller(params?.id);
        if (params.getData) {
          params.getData();
        }
        message.success("Delete Successfully");
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  GetListStatesAction: createAsyncThunk(
    "STATE/GETLIST",
    async (params: StateParams) => {
      try {
        const response: AxiosResponse = await getListStates(params);

        return response?.data?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
};
const salerSlice = createSlice({
  name: "getProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getlist
    builder.addCase(actionSaler.fetchSaler.pending, (state, action) => {
      state.params = action.meta.arg;
      state.isLoading = true;
    });
    builder.addCase(actionSaler.fetchSaler.fulfilled, (state, action) => {
      state.params = action.meta.arg;
      state.isLoading = false;
      state.data.data = action.payload;
    });
    builder.addCase(actionSaler.fetchSaler.rejected, (state, action: any) => {
      state.params = action.meta.arg;
      state.isLoading = false;
    });

    // create
    builder.addCase(actionSaler.postSaler.pending, (state) => {
      state.isReload = false;
      state.isLoading = true;
    });
    builder.addCase(actionSaler.postSaler.fulfilled, (state) => {
      state.isReload = true;
      state.isLoading = false;
    });
    builder.addCase(actionSaler.postSaler.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });

    // update
    builder.addCase(actionSaler.putSaler.pending, (state) => {
      state.isLoading = true;
      state.isReload = false;
    });
    builder.addCase(actionSaler.putSaler.fulfilled, (state) => {
      state.isLoading = false;
      state.isReload = true;
    });
    builder.addCase(actionSaler.putSaler.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });

    // detail
    builder.addCase(actionSaler.detailSaler.pending, (state) => {
      state.isLoading = true;
      state.dataDetail = {} as { data: DataSaler };
    });
    builder.addCase(actionSaler.detailSaler.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dataDetail = action.payload;
    });
    builder.addCase(actionSaler.detailSaler.rejected, (state) => {
      state.isLoading = false;
    });

    // delete
    builder.addCase(actionSaler.deleteSaler.pending, (state) => {
      state.isReload = false;
      state.isLoading = true;
    });
    builder.addCase(actionSaler.deleteSaler.fulfilled, (state) => {
      state.isReload = true;
      state.isLoading = false;
    });
    builder.addCase(actionSaler.deleteSaler.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });
    builder.addCase(actionSaler.GetListStatesAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      actionSaler.GetListStatesAction.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.state.data = action.payload;
      }
    );
    builder.addCase(actionSaler.GetListStatesAction.rejected, (state) => {
      state.isLoading = false;
      state.state.data = undefined;
    });
  },
});
export const SalerActions = { ...salerSlice.actions, ...actionSaler };
export default salerSlice.reducer;
