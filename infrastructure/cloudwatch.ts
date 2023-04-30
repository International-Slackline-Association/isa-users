import type { AWS } from '@serverless/typescript';

export const cloudwatchResources: NonNullable<AWS['resources']>['Resources'] = {
  CloudWatchApplicationLogs: {
    Type: 'AWS::Logs::LogGroup',
    Properties: {
      LogGroupName: 'isa-users/applicationLogs',
      RetentionInDays: 90,
    },
  },
};
