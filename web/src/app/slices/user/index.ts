import { userApi } from 'app/api/user-api';
import { useInjectReducer } from 'store/injectors';
import { createSlice } from 'utils/redux/toolkit';

import { UserState } from './types';

export const initialState: UserState = {};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getUserDetails.matchFulfilled, (state, { payload }) => {
      state.userInfo = payload;
    });
  },
});

export const { actions: userActions } = slice;

export const useUserSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
