import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { logger } from 'core/logger';

import { getAllCognitoUsers } from './utils';

export const exportCognitoUsers = async () => {
  try {
    const users = await getAllCognitoUsers();
    
    const header = 'useremail,isVerified,createdDate\n';
    const rows = users.map(user => {
      const email = user.email || '';
      const isVerified = user.email_verified === 'true' ? 'true' : 'false';
      const createdDate = user.createdDate ? user.createdDate.toISOString().split('T')[0] : '';
      return `${email},${isVerified},${createdDate}`;
    }).join('\n');
    
    const content = header + rows;
    const filePath = join(tmpdir(), 'cognito-users-export.csv');
    
    writeFileSync(filePath, content, 'utf8');
    
    logger.info(`Successfully exported ${users.length} Cognito users to ${filePath}`);
  } catch (error) {
    logger.error('Failed to export Cognito users:', error);
    throw error;
  }
};