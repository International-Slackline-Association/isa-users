import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/types';

import { initialState } from '.';

export const selectUserSlice = (state: RootState) => state.user || initialState;

export const selectUserInfo = createSelector([selectUserSlice], (state) => state.userInfo);
