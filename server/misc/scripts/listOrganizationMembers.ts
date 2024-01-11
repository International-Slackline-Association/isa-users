import * as db from 'core/db';
import dotenv from 'dotenv';

dotenv.config();

const listOrganizationMembers = async () => {
  const organizations = await db.getAllOrganizations();
  for (const organization of organizations) {
    const members = await db.getUsersOfOrganization(organization.organizationId);
    for (const member of members) {
      const user = await db.getUser(member.userId);
      console.log(
        `${organization.name}: ${user.name} ${user.surname} ${
          member.isPendingApproval ? member.userId : ''
        }`,
      );
    }
  }
};

listOrganizationMembers();
