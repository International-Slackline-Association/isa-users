import { Middleware, MiddlewareAPI, isRejectedWithValue } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { showErrorNotification } from 'utils';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://account-api.slacklineinternational.org/',
  prepareHeaders: async (headers) => {
    const token = await fetchAuthSession().then((s) => s.tokens?.idToken?.toString());
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  endpoints: () => ({}),
});

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    let e = (action?.payload as any)?.data?.message || action?.error?.message;
    if (e && e === 'Rejected') {
      e = 'Unknown';
    }
    const message = `Error: ${e}`;
    api.dispatch(showErrorNotification(message));
  }

  return next(action);
};
