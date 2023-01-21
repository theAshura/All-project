import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCalculatorShareEmail,
  getCalculatorShareEmailDetail,
} from "api/calculator/calculator.api";
import {
  CalculatorDetail,
  GetListCalculatorResponse,
  ParamGetListCalculator,
} from "api/calculator/calculator.interface";

const initialState = {
  data: {} as { data: GetListCalculatorResponse | undefined },
  isLoading: false,
  dataDetailCalculator: [] as CalculatorDetail[] | undefined,
};

const actionCalculator = {
  fetchCalculatorEmail: createAsyncThunk(
    "GET/FETCH_CALCULATOR",
    async (params: ParamGetListCalculator, { rejectWithValue }) => {
      const response = await getCalculatorShareEmail(params);
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data.data);
      }
      return response.data.data as unknown as GetListCalculatorResponse;
    }
  ),
  fetchCalculatorEmailDetail: createAsyncThunk(
    "GET/CALCULATOR_DETAIL",
    async (params: string, { rejectWithValue }) => {
      const response = await getCalculatorShareEmailDetail(params);
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data.data);
      }
      return response.data.data as unknown as CalculatorDetail;
    }
  ),
};
const calculatorSlice = createSlice({
  name: "getCalculator",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getlist
    builder.addCase(actionCalculator.fetchCalculatorEmail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      actionCalculator.fetchCalculatorEmail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.data.data = action.payload;
      }
    );
    builder.addCase(actionCalculator.fetchCalculatorEmail.rejected, (state) => {
      state.isLoading = false;
      state.data.data = undefined;
    });
    builder.addCase(
      actionCalculator.fetchCalculatorEmailDetail.pending,
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      actionCalculator.fetchCalculatorEmailDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.dataDetailCalculator = [action.payload];
      }
    );
    builder.addCase(
      actionCalculator.fetchCalculatorEmailDetail.rejected,
      (state) => {
        state.isLoading = false;
        state.dataDetailCalculator = undefined;
      }
    );
  },
});
export const CalculatorActions = {
  ...calculatorSlice.actions,
  ...actionCalculator,
};
export default calculatorSlice.reducer;
