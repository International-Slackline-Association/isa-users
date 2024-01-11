/**
 * Create the store with dynamic reducers
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { baseApi, rtkQueryErrorLogger } from './rtk-query';
import { InjectedReducersType, StaticReducersType } from './types';

const staticReducers: StaticReducersType = {
  api: baseApi.reducer,
};

export function configureAppStore() {
  const middlewares = [baseApi.middleware, rtkQueryErrorLogger];

  const store = configureStore({
    reducer: createReducer(staticReducers),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
    devTools: process.env.NODE_ENV !== 'production',
  });

  store.injectedReducers = {};
  store.injectReducer = (key, reducer) => {
    // Check `store.injectedReducers[key] === reducer` for hot reloading when a key is the same but a reducer is different
    if (Reflect.has(store.injectedReducers, key) && store.injectedReducers[key] === reducer) {
      return;
    }

    store.injectedReducers[key] = reducer;
    store.replaceReducer(createReducer(staticReducers, store.injectedReducers));
  };
  setupListeners(store.dispatch);

  return store;
}

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */

const createReducer = (
  staticReducers: StaticReducersType,
  injectedReducers: InjectedReducersType = {},
) => {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0 && Object.keys(staticReducers).length === 0) {
    return (state) => state;
  } else {
    return combineReducers({
      ...staticReducers,
      ...injectedReducers,
    });
  }
};
