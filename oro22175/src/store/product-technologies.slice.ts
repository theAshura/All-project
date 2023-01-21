/* SLICE: POST_DETAIL
   ========================================================================== */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  ProductTectnologiesRequest,
  ProductTectnologiesResponse,
} from "api/product-technologies/product-technologies.interface";
import {
  getProductTechnologies,
  postProductTechnologies,
} from "api/product-technologies/product-technologies.api";
import { AxiosResponse } from "axios";
import { message } from "antd";
import { mapErrorMessage } from "helpers/utilities.helper";

const initialState = {
  data: {} as ProductTectnologiesResponse,
  isLoading: false,
  error: "",
};

/**
 * Async actions for product-technologies-detail
 */
const actions = {
  fetchDetailProductTechnologies: createAsyncThunk(
    "GET/FETCH_PRODUCT_TECHNOLOGIES",
    async (_, { rejectWithValue }) => {
      const response = await getProductTechnologies();
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data);
      }
      return response.data as unknown as ProductTectnologiesResponse;
    }
  ),
  postProductTechnologies: createAsyncThunk(
    "POST/PRODUCT_TECHNOLOGIES",
    async (params: ProductTectnologiesRequest, { rejectWithValue }) => {
      try {
        const response: AxiosResponse = await postProductTechnologies(params);
        message.success("Update Successfully!");
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
        return rejectWithValue(error);
      }
    }
  ),
};

/**
 * Slice for product technologies
 */
const productTechnologiesSlice = createSlice({
  name: "postProductTechnologies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchDetailProductTechnologies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      actions.fetchDetailProductTechnologies.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      }
    );
    builder.addCase(
      actions.fetchDetailProductTechnologies.rejected,
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addCase(actions.postProductTechnologies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.postProductTechnologies.fulfilled, (state) => {
      state.isLoading = false;
      state.data = {} as ProductTectnologiesResponse;
    });
    builder.addCase(actions.postProductTechnologies.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

/**
 * Export all actions, reducer for product technologies
 */
export const productTechnologiesActions = {
  ...productTechnologiesSlice.actions,
  ...actions,
};

export default productTechnologiesSlice.reducer;
