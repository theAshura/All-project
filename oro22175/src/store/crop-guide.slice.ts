/* SLICE: POST_DETAIL
   ========================================================================== */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  deleteCropGuide,
  getCropGuide,
  getCropGuideDetail,
  postCropGuide,
  putCropGuide,
} from "api/crop-guide/crop-guide.api";
import {
  CropGuideDetailResponse,
  ParamSearchCropGuide,
  CropGuidePostParams,
  CropGuideResponse,
} from "api/crop-guide/crop-guide.interface";

import { AxiosResponse } from "axios";
import { mapErrorMessage } from "helpers/utilities.helper";

const initialState = {
  data: {} as { data: CropGuideResponse },
  isLoading: false,
  error: "",
  params: {} as ParamSearchCropGuide,
  dataDetail: undefined as unknown as CropGuideDetailResponse,
  isReload: false,
};

/**
 * Async actions for product-technologies-detail
 */
const cropGuideAction = {
  fetchCropGuide: createAsyncThunk(
    "GET/FETCH_PRODUCT",
    async (params: ParamSearchCropGuide, { rejectWithValue }) => {
      const response = await getCropGuide(params);
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data);
      }
      return response.data as unknown as CropGuideResponse;
    }
  ),
  postCropGuide: createAsyncThunk(
    "POST/CREATE_CROP_GUIDE",
    async (params: { body: CropGuidePostParams; getData?: () => void }) => {
      try {
        const response: AxiosResponse = await postCropGuide(params?.body);
        if (params.getData) {
          params.getData();
        }
        message.success("Created Successfully!");
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  putCropGuide: createAsyncThunk(
    "PUT/UPDATE_CROP_GUIDE",
    async (params: {
      id: string;
      body: CropGuidePostParams;
      getData?: () => void;
    }) => {
      try {
        const response: AxiosResponse = await putCropGuide(
          params.id,
          params.body
        );
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
  detailCropGuide: createAsyncThunk(
    "GET/DETAIL_CROP_GUIDE",
    async (params: { id: string }) => {
      try {
        const response: AxiosResponse = await getCropGuideDetail(params.id);
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  deleteCropGuide: createAsyncThunk(
    "DELETE/PRODUCT",
    async (params: { id: string; getData: () => void }) => {
      try {
        const response: AxiosResponse = await deleteCropGuide(params?.id);
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
};

/**
 * Slice for product technologies
 */
const cropGuidesSlice = createSlice({
  name: "getProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getlist
    builder.addCase(cropGuideAction.fetchCropGuide.pending, (state, action) => {
      state.params = action.meta.arg;
      state.isLoading = true;
    });
    builder.addCase(
      cropGuideAction.fetchCropGuide.fulfilled,
      (state, action) => {
        state.params = action.meta.arg;
        state.isLoading = false;
        state.data.data = action.payload;
      }
    );
    builder.addCase(
      cropGuideAction.fetchCropGuide.rejected,
      (state, action) => {
        state.params = action.meta.arg;
        state.isLoading = false;
      }
    );

    // create
    builder.addCase(cropGuideAction.postCropGuide.pending, (state) => {
      state.isReload = false;
      state.isLoading = true;
    });
    builder.addCase(cropGuideAction.postCropGuide.fulfilled, (state) => {
      state.isReload = true;
      state.isLoading = false;
    });
    builder.addCase(cropGuideAction.postCropGuide.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });

    // update
    builder.addCase(cropGuideAction.putCropGuide.pending, (state) => {
      state.isLoading = true;
      state.isReload = false;
    });
    builder.addCase(cropGuideAction.putCropGuide.fulfilled, (state) => {
      state.isLoading = false;
      state.isReload = true;
    });
    builder.addCase(cropGuideAction.putCropGuide.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });

    // detail
    builder.addCase(cropGuideAction.detailCropGuide.pending, (state) => {
      state.isLoading = true;
      state.dataDetail = undefined as unknown as CropGuideDetailResponse;
    });
    builder.addCase(
      cropGuideAction.detailCropGuide.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.dataDetail = action.payload;
      }
    );
    builder.addCase(cropGuideAction.detailCropGuide.rejected, (state) => {
      state.isLoading = false;
    });

    // delete
    builder.addCase(cropGuideAction.deleteCropGuide.pending, (state) => {
      state.isReload = false;
      state.isLoading = true;
    });
    builder.addCase(cropGuideAction.deleteCropGuide.fulfilled, (state) => {
      state.isReload = true;
      state.isLoading = false;
    });
    builder.addCase(cropGuideAction.deleteCropGuide.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });
  },
});

/**
 * Export all actions, reducer for product technologies
 */
export const cropGuideActions = {
  ...cropGuidesSlice.actions,
  ...cropGuideAction,
};

export default cropGuidesSlice.reducer;
