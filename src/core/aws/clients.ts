import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const ddb: DocumentClient = new DocumentClient();
export const cwLogs = new AWS.CloudWatchLogs();
export const cisProvider = new AWS.CognitoIdentityServiceProvider();
