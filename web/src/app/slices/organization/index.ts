import { organizationApi } from 'app/api/organization-api';
import { useInjectReducer } from 'store/injectors';
import { createSlice } from 'utils/redux/toolkit';

import { OrganizationState } from './types';

export const initialState: OrganizationState = {};

const slice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      organizationApi.endpoints.getOrganizationDetails.matchFulfilled,
      (state, { payload }) => {
        state.organizationInfo = payload;
      },
    );
  },
});

export const { actions: organizationActions } = slice;

export const useOrganizationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
