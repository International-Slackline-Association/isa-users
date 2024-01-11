import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  colors,
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

import { organizationApi } from 'app/api/organization-api';
import { userApi } from 'app/api/user-api';
import { ButtonWithConfirmation } from 'app/components/ButtonWithConfirmation';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';

import { imageUrlFromS3Key } from '../../../../utils';

export function AllOrganizations() {
  const { isDesktop } = useMediaQuery();

  // const userInfo = useSelector(selectUserInfo);
  const { data: allOrganizations, isLoading: isOrganizationsLoading } =
    organizationApi.useGetAllOrganizationsQuery(undefined, {});

  const { data: myOrganizations } = userApi.useGetOrganizationsOfUserQuery();

  const [joinOrganization] = userApi.useJoinOrganizationMutation();

  const requestClicked = (organizationId: string) => {
    joinOrganization(organizationId);
  };

  return (
    <Card>
      <CardHeader title="Organizations List (Members of ISA)" />
      <CardContent>
        {isOrganizationsLoading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: colors.grey[100] }}>
              <TableRow>
                <TableCell style={{ width: isDesktop ? '80%' : '50%' }}>Organization</TableCell>
                <TableCell
                  style={{
                    width: isDesktop ? '30%' : '50%',
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allOrganizations?.map((organization) => (
                <TableRow key={organization.organizationId}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt="Organization Picture"
                        src={imageUrlFromS3Key(organization?.profilePictureS3Key)}
                        sx={{ mr: 1 }}
                      >
                        {organization.name.substring(0, 1)}
                      </Avatar>
                      {organization.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <ButtonWithConfirmation
                      buttonText="Request to join"
                      title={'We will notify the organization via email'}
                      confirmationText={'Send Request'}
                      rejectionText={'Cancel'}
                      size="small"
                      onConfirmation={() => {
                        requestClicked(organization.organizationId);
                      }}
                      disabled={myOrganizations?.some(
                        (myOrganization) =>
                          myOrganization.organizationId === organization.organizationId,
                      )}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
