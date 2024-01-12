import { getAllCertificates } from '@server/functions/api/endpoints/certificate-api';
import { baseApi } from 'store/rtk-query';
import { AsyncReturnType } from 'type-fest';

export const certificateApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['certificates'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      listCertificates: builder.query<AsyncReturnType<typeof getAllCertificates>, void>({
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
