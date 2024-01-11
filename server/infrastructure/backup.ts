import type { AWS } from '@serverless/typescript';

export const backupResources: NonNullable<AWS['resources']>['Resources'] = {
  BackupPlan: {
    Type: 'AWS::Backup::BackupPlan',
    Properties: {
      BackupPlan: {
        BackupPlanName: 'isa_users_default_backup-${sls:stage}',
        BackupPlanRule: [
          {
            RuleName: 'MonthlyBackups',
            TargetBackupVault: 'Default',
            ScheduleExpression: 'cron(0 5 1 * ? *)',
            StartWindowMinutes: 480,
            CompletionWindowMinutes: 10080,
            Lifecycle: {
              DeleteAfterDays: 720,
            },
          },
        ],
      },
      BackupPlanTags: { aws_backup: 'isa_users_default_backup' },
    },
  },
  BackupSelection: {
    Type: 'AWS::Backup::BackupSelection',
    Properties: {
      BackupPlanId: { Ref: 'BackupPlan' },
      BackupSelection: {
        SelectionName: 'isa_users_default_backup_selection',
        IamRoleArn: 'arn:aws:iam::${aws:accountId}:role/service-role/AWSBackupDefaultServiceRole',
        ListOfTags: [
          {
            ConditionKey: 'aws_backup',
            ConditionType: 'STRINGEQUALS',
            ConditionValue: 'isa_users_default_backup-${sls:stage}',
          },
        ],
      },
    },
  },
};
