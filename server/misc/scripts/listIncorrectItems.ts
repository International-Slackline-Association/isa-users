import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from 'core/aws/clients';
import dotenv from 'dotenv';

import { getAllCognitoUsers } from './remindUnverifiedUsers';

dotenv.config();

const listIncorrectItems = async () => {
  const items = await getAllItems();
  const users = await getAllCognitoUsers();

  const userItems = items.filter((item) => item.SK_GSI.includes('Details'));

  const ghostItems = userItems.filter((item) => !users.find((user) => user.email === item.email));
  console.log('ghostItems', ghostItems);

  const duplicates = userItems.filter((item) => {
    const count = userItems.filter((i) => i.email === item.email).length;
    return count > 1;
  });
  console.log('duplicates', duplicates);
};

async function getAllItems() {
  let lastEvaluatedKey: any = undefined;
  const items = [];
  do {
    const result = await ddb.send(
      new ScanCommand({
        TableName: process.env.ISA_USERS_TABLE,
        FilterExpression: 'PK <> genericHashes',
        ExclusiveStartKey: lastEvaluatedKey,
      }),
    );

    lastEvaluatedKey = result.LastEvaluatedKey;
    items.push(...result.Items);
  } while (lastEvaluatedKey);
  return items.map((item) => ({
    PK: item.PK,
    SK_GSI: item.SK_GSI,
    isaId: item.PK.split(':')[1],
    email: item.GSI_SK?.split(':')[1],
  }));
}

listIncorrectItems();
