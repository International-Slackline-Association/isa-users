import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const ddb: DocumentClient = new DocumentClient();
