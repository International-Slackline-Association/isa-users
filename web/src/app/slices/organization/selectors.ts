import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.organization || initialState;

export const selectOrganizationInfo = createSelector(
  [selectSlice],
  (state) => state.organizationInfo,
);
