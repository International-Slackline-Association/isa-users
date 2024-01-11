import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.user || initialState;

export const selectUserInfo = createSelector([selectSlice], (state) => state.userInfo);
