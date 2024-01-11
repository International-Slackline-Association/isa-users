import type { AWS } from '@serverless/typescript';

export const s3Resources: NonNullable<AWS['resources']>['Resources'] = {
  IsaUsersImagesS3Bucket: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      BucketName: 'isa-users-images-${sls:stage}',
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET'],
            AllowedOrigins: ['*'],
            ExposedHeaders: [],
            MaxAge: 3600,
          },
        ],
      },
      VersioningConfiguration: {
        Status: 'Enabled',
      },
      LifecycleConfiguration: {
        Rules: [
          {
            Status: 'Enabled',
            NoncurrentVersionExpiration: {
              NoncurrentDays: 365,
            },
          },
        ],
      },
    },
  },
};
