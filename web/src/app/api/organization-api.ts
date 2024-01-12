import {
  approveUserJoinRequest,
  getAllOrganizations,
  getOrganizationDetail,
  getUsersOfOrganization,
  removeUser,
  updateOrganization,
  updateOrganizationProfilePicture,
} from '@server/functions/api/endpoints/organization-api';
import { baseApi } from 'store/rtk-query';
import { AsyncReturnType } from 'type-fest';
import { showSuccessNotification } from 'utils';

import type { UpdateProfilePictureBody } from './types';

export type GetOrganizationAPIResponse = AsyncReturnType<typeof getOrganizationDetail>;

export const organizationApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['organizationDetails', 'organizationUsers'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllOrganizations: builder.query<
        AsyncReturnType<typeof getAllOrganizations>['items'],
        void
      >({
        query: () => ({ url: `organization/all` }),
        transformResponse(response: AsyncReturnType<typeof getAllOrganizations>) {
          return response.items;
        },
      }),
      getOrganizationDetails: builder.query<AsyncReturnType<typeof getOrganizationDetail>, void>({
        query: () => ({ url: `organization/details` }),
        providesTags: ['organizationDetails'],
      }),

      updateOrganizationDetails: builder.mutation<
        AsyncReturnType<typeof updateOrganization>,
        {
          name: string;
          city?: string;
          country?: string;
          contactPhone?: string;
        }
      >({
        query: (body) => ({
          url: `organization/details`,
          method: 'PUT',
          body: body,
        }),
        invalidatesTags: ['organizationDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Changes saved'));
        },
      }),

      updateOrganizationProfilePicture: builder.mutation<
        AsyncReturnType<typeof updateOrganizationProfilePicture>,
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
          dispatch(showSuccessNotification('Changes saved'));
        },
      }),

      getUsersOfOrganization: builder.query<
        AsyncReturnType<typeof getUsersOfOrganization>['items'],
        void
      >({
        query: () => ({ url: `organization/users` }),
        providesTags: ['organizationUsers'],
        transformResponse(response: AsyncReturnType<typeof getUsersOfOrganization>) {
          return response.items;
        },
      }),
      approveUser: builder.mutation<AsyncReturnType<typeof approveUserJoinRequest>, string>({
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
      removeUser: builder.mutation<AsyncReturnType<typeof removeUser>, string>({
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
