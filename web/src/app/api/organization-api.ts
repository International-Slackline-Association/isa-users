import { baseApi } from 'store/rtk-query';
import { showSuccessNotification } from 'utils';

import type {
  GetAllOrganizationsAPIResponse,
  GetOrganizationAPIResponse,
  GetUsersOfOrganizationResponse,
  UpdateProfilePictureBody,
} from './types';

export const organizationApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['organizationDetails', 'organizationUsers'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllOrganizations: builder.query<GetAllOrganizationsAPIResponse['items'], void>({
        query: () => ({ url: `organization/all` }),
        transformResponse(response: GetAllOrganizationsAPIResponse) {
          return response.items;
        },
      }),
      getOrganizationDetails: builder.query<GetOrganizationAPIResponse, void>({
        query: () => ({ url: `organization/details` }),
        providesTags: ['organizationDetails'],
      }),

      updateOrganizationDetails: builder.mutation<
        GetOrganizationAPIResponse,
        Partial<GetOrganizationAPIResponse>
      >({
        query: (body) => ({
          url: `organization/details`,
          method: 'PUT',
          body: body,
        }),
        invalidatesTags: ['organizationDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Saved Changes'));
        },
      }),

      updateOrganizationProfilePicture: builder.mutation<
        Record<string, never>,
        UpdateProfilePictureBody
      >({
        query: (body) => ({
          url: `organization/profilePicture`,
          method: 'PUT',
          body: body,
        }),
        invalidatesTags: ['organizationDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Saved Changes'));
        },
      }),

      getUsersOfOrganization: builder.query<GetUsersOfOrganizationResponse['items'], void>({
        query: () => ({ url: `organization/users` }),
        providesTags: ['organizationUsers'],
        transformResponse(response: GetUsersOfOrganizationResponse) {
          return response.items;
        },
      }),
      approveUser: builder.mutation<void, string>({
        query: (id) => ({
          url: `organization/user/${id}/approve`,
          method: 'POST',
        }),
        invalidatesTags: ['organizationUsers'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Approved member'));
        },
      }),
      removeUser: builder.mutation<void, string>({
        query: (id) => ({
          url: `organization/user/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['organizationUsers'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Removed member'));
        },
      }),
    }),
  });
