/* STORE
   ========================================================================== */

import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import postDetailReducer, { postDetailActions } from "./post-detail.slice";
import postListReducer, { postListActions } from "./post-list.slice";
import productTechnologiesReducer, {
  productTechnologiesActions,
} from "./product-technologies.slice";
import productPortfolioReducer, {
  productPortfolioActions,
} from "./product-portfolio.slice";
import autheducer, { authActions } from "./auth.slice";

import { configureStore } from "@reduxjs/toolkit";
import { ApplicationActions } from "./application-selector.slice";
import applicationReducer from "./application-selector.slice";
import productsReducer, { productsActions } from "./product.slice";
import calculatorReducer from "./calculator.slice";
import cropGuideReducer, { cropGuideActions } from "./crop-guide.slice";
import salerReducer, { SalerActions } from "./saler.slice";

/**
 * Map actions
 */
const actions = {
  productTechnologies: productTechnologiesActions,
  postList: postListActions,
  postDetail: postDetailActions,
  auth: authActions,
  productPortfolio: productPortfolioActions,
  application: ApplicationActions,
  products: productsActions,
  cropGuide: cropGuideActions,
  saler: SalerActions,
};

/**
 * Map reducers
 */
const reducers = {
  postList: postListReducer,
  postDetail: postDetailReducer,
  auth: autheducer,
  application: applicationReducer,
  productTechnologies: productTechnologiesReducer,
  productPortfolio: productPortfolioReducer,
  products: productsReducer,
  calculator: calculatorReducer,
  cropGuide: cropGuideReducer,
  saler: salerReducer,
};

const store = configureStore({
  reducer: reducers,
});

export type TStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<TStore> = useSelector;

/**
 * Export all neccessary features here to modulize,
 * so that all store features can be imported from 'store',
 * instead of importing from 'react-redux' and 'redux-toolkit' and so on
 */
export { Provider, useDispatch, useSelector, actions, useAppDispatch };

export default store;
