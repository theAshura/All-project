import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';

import tokenManager from 'helpers/request/tokenManager';
import rootReducer from './reducer';
import rootSaga from './saga';
import { setTokenAction } from './authenticate/authenticate.action';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

tokenManager.setLoginMethod((token: string) => {
  store.dispatch(setTokenAction({ token }));
});

const persistor = persistStore(store);

let currentToken: string;

function handleChange() {
  const previousToken = currentToken;
  currentToken = store.getState().authenticate.token;
  if (previousToken !== currentToken) {
    tokenManager.setToken(currentToken);
  }
}

store.subscribe(handleChange);

export default { store, persistor };
