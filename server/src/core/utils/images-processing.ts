import { isaToolsApi } from 'core/external-api/isa-tools-api';

export const processAndPutProfilePhoto = async (processingBucketKey: string, isaId: string) => {
  const s3Key = `public/${isaId}/profilePicture_${new Date().toISOString()}.${'jpeg'}`;
  const result = await isaToolsApi.processImage({
    input: {
      s3: {
        key: processingBucketKey,
      },
    },
    output: {
      s3: {
        bucket: process.env.ISA_USERS_IMAGES_S3_BUCKET,
        key: s3Key,
      },
    },
    outputFormat: 'jpeg',
    resize: {
      width: 256,
      height: 256,
      fit: 'inside',
    },
    quality: 80,
    cacheControl: 'public, max-age=864000',
  });
  return { result, s3Key };
};
