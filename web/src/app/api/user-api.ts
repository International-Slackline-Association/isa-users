import {
  getOrganizationMembershipDocument,
  getOrganizationsOfUser,
  getUserDetails,
  joinOrganization,
  leaveOrganization,
  updateUser,
  updateUserProfilePicture,
} from '@server/functions/api/endpoints/user-api';
import { baseApi } from 'store/rtk-query';
import { AsyncReturnType } from 'type-fest';
import { showSuccessNotification } from 'utils';

import { UpdateProfilePictureBody } from './types';

export type GetUserAPIResponse = AsyncReturnType<typeof getUserDetails>;

export const userApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['userDetails', 'userOrganizations', 'userDocuments'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserDetails: builder.query<AsyncReturnType<typeof getUserDetails>, void>({
        query: () => ({ url: `user/details` }),
        providesTags: ['userDetails'],
      }),

      updateUserDetails: builder.mutation<
        AsyncReturnType<typeof updateUser>,
        {
          name: string;
          surname: string;
          gender?: 'm' | 'f' | 'o';
          birthDate?: string;
          phoneNumber?: string;
          city?: string;
          country?: string;
          emergencyContact?: string;
        }
      >({
        query: (body) => ({
          url: `user/details`,
          method: 'PUT',
          body: body,
        }),
        invalidatesTags: ['userDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Saved Changes'));
        },
      }),
      updateUserProfilePicture: builder.mutation<
        AsyncReturnType<typeof updateUserProfilePicture>,
        UpdateProfilePictureBody
      >({
        query: (body) => ({
          url: `user/profilePicture`,
          method: 'PUT',
          body: body,
        }),
        invalidatesTags: ['userDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Saved Changes'));
        },
      }),
      getOrganizationsOfUser: builder.query<
        AsyncReturnType<typeof getOrganizationsOfUser>['items'],
        void
      >({
        query: () => ({ url: `user/organizations` }),
        providesTags: ['userOrganizations'],
        transformResponse(response: AsyncReturnType<typeof getOrganizationsOfUser>) {
          return response.items;
        },
      }),
      leaveOrganization: builder.mutation<AsyncReturnType<typeof leaveOrganization>, string>({
        query: (id) => ({
          url: `user/organization/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['userOrganizations'],
      }),
      joinOrganization: builder.mutation<AsyncReturnType<typeof joinOrganization>, string>({
        query: (id) => ({
          url: `user/organization/${id}/join`,
          method: 'POST',
        }),
        invalidatesTags: ['userOrganizations'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(
            showSuccessNotification('Email has been sent to the organization for confirmation'),
          );
        },
      }),

      getOrganizationMembershipDocument: builder.query<
        AsyncReturnType<typeof getOrganizationMembershipDocument>,
        string
      >({
        query: (id) => ({ url: `user/organization/${id}/membershipDocument` }),
        providesTags: ['userDocuments'],
      }),
    }),
  });
