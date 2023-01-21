/* SLICE: POST_DETAIL
   ========================================================================== */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

import {
  deleteProduct,
  getProduct,
  getProducts,
  postProduct,
  putProduct,
} from "api/product/product.api";
import {
  ParamSearchProducts,
  ProductDetailResponse,
  ProductRequest,
  ProductResponse,
} from "api/product/product.interface";
import { AxiosResponse } from "axios";
import { mapErrorMessage } from "helpers/utilities.helper";

const initialState = {
  data: {} as {
    data: ProductResponse;
  },
  isLoading: false,
  error: "",
  params: {} as ParamSearchProducts,
  dataDetail: {} as { data: ProductDetailResponse },
  isReload: false,
};

/**
 * Async actions for product-technologies-detail
 */
const actionProducts = {
  fetchProducts: createAsyncThunk(
    "GET/FETCH_PRODUCT",
    async (params: ParamSearchProducts, { rejectWithValue }) => {
      const response = await getProducts(params);
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data.data);
      }
      return response.data.data as unknown as ProductResponse;
    }
  ),
  postProduct: createAsyncThunk(
    "POST/CREATE_PRODUCT",
    async (params: { body: ProductRequest; getData?: () => void }) => {
      try {
        const response: AxiosResponse = await postProduct(params?.body);
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
  putProduct: createAsyncThunk(
    "PUT/UPDATE_PRODUCT",
    async (params: {
      id: string;
      body: ProductRequest;
      getData?: () => void;
    }) => {
      try {
        const response: AxiosResponse = await putProduct(
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
  detailProduct: createAsyncThunk(
    "PUT/DETAIL_PRODUCT",
    async (params: { id: string }) => {
      try {
        const response: AxiosResponse = await getProduct(params.id);
        return response?.data;
      } catch (error) {
        mapErrorMessage(error);
      }
    }
  ),
  deleteProduct: createAsyncThunk(
    "DELETE/PRODUCT",
    async (params: { id: string; getData: () => void }) => {
      try {
        const response: AxiosResponse = await deleteProduct(params?.id);
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
const productsSlice = createSlice({
  name: "getProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getlist
    builder.addCase(actionProducts.fetchProducts.pending, (state, action) => {
      state.params = action.meta.arg;
      state.isLoading = true;
    });
    builder.addCase(actionProducts.fetchProducts.fulfilled, (state, action) => {
      state.params = action.meta.arg;
      state.isLoading = false;
      state.data.data = action.payload;
    });
    builder.addCase(
      actionProducts.fetchProducts.rejected,
      (state, action: any) => {
        state.params = action.meta.arg;
        state.isLoading = false;
      }
    );

    // create
    builder.addCase(actionProducts.postProduct.pending, (state) => {
      state.isReload = true;
      state.isLoading = true;
    });
    builder.addCase(actionProducts.postProduct.fulfilled, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });
    builder.addCase(actionProducts.postProduct.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });

    // update
    builder.addCase(actionProducts.putProduct.pending, (state) => {
      state.isLoading = true;
      state.isReload = true;
    });
    builder.addCase(actionProducts.putProduct.fulfilled, (state) => {
      state.isLoading = false;
      state.isReload = false;
    });
    builder.addCase(actionProducts.putProduct.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });

    // detail
    builder.addCase(actionProducts.detailProduct.pending, (state) => {
      state.isLoading = true;
      state.dataDetail = {} as { data: ProductDetailResponse };
    });
    builder.addCase(actionProducts.detailProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dataDetail = action.payload;
    });
    builder.addCase(actionProducts.detailProduct.rejected, (state) => {
      state.isLoading = false;
    });

    // delete
    builder.addCase(actionProducts.deleteProduct.pending, (state) => {
      state.isReload = true;
      state.isLoading = true;
    });
    builder.addCase(actionProducts.deleteProduct.fulfilled, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });
    builder.addCase(actionProducts.deleteProduct.rejected, (state) => {
      state.isReload = false;
      state.isLoading = false;
    });
  },
});

/**
 * Export all actions, reducer for product technologies
 */
export const productsActions = {
  ...productsSlice.actions,
  ...actionProducts,
};

export default productsSlice.reducer;
