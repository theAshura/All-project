/* SLICE: POST_DETAIL
   ========================================================================== */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  getProductPortfolio,
  postProductPortfolio,
} from "api/product-portfolio/product-portfolio.api";

import {
  ProductPortfolioRequest,
  ProductPortfolioResponse,
} from "api/product-portfolio/product-portfolio.interface";
import { AxiosResponse } from "axios";
import { mapErrorMessage } from "helpers/utilities.helper";

const initialState = {
  data: {} as ProductPortfolioResponse,
  isReload: false,
  isLoading: false,
  error: "",
};

/**
 * Async actions for product-technologies-detail
 */
const actions = {
  fetchDetailProductFolio: createAsyncThunk(
    "GET/FETCH_PRODUCT_FOLIO",
    async (_, { rejectWithValue }) => {
      const response = await getProductPortfolio();
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data);
      }
      return response.data as unknown as ProductPortfolioResponse;
    }
  ),
  postProductFolio: createAsyncThunk(
    "POST/PRODUCT_FOLIO",
    async (params: ProductPortfolioRequest, { rejectWithValue }) => {
      try {
        const response: AxiosResponse = await postProductPortfolio(params);
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
const productPortfolioSlice = createSlice({
  name: "postProductPortfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchDetailProductFolio.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      actions.fetchDetailProductFolio.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      }
    );
    builder.addCase(actions.fetchDetailProductFolio.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(actions.postProductFolio.pending, (state) => {
      state.isReload = false;
      state.isLoading = true;
    });
    builder.addCase(actions.postProductFolio.fulfilled, (state) => {
      state.isReload = true;
      state.isLoading = false;
    });
    builder.addCase(actions.postProductFolio.rejected, (state) => {
      state.isReload = true;
      state.isLoading = false;
    });
  },
});

/**
 * Export all actions, reducer for product technologies
 */
export const productPortfolioActions = {
  ...productPortfolioSlice.actions,
  ...actions,
};

export default productPortfolioSlice.reducer;
