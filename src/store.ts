/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import FetcherFactory from 'utils/FetcherFactory';
import { initAuth } from 'modules/auth/actions';

import rootSaga from './rootSaga';
import reducers, { RootState } from './rootReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <T>(t?: T) => T;
  }
}

export default async (): Promise<Store<RootState>> => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = createStore(
    reducers,
    {},
    compose(
      applyMiddleware(...middleware),
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
        compose,
    ),
  );

  FetcherFactory.bindStore(store);
  sagaMiddleware.run(rootSaga);
  store.dispatch(initAuth.do());

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(reducers);
    });
  }
  return store;
};
