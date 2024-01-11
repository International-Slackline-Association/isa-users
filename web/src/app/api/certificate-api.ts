import { baseApi } from 'store/rtk-query';

import type { ListAllCertificatesAPIResponse } from './types';

export const certificateApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['certificates'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      listCertificates: builder.query<ListAllCertificatesAPIResponse, void>({
        query: () => ({ url: `certificate/all` }),
      }),
      generateCertificate: builder.mutation<
        { pdfUrl: string; certificateId: string },
        {
          certificateType: string;
          certificateId: string;
          language: string;
        }
      >({
        query: (body) => ({
          url: `certificate/generate`,
          method: 'PUT',
          body: body,
        }),
      }),
    }),
  });
