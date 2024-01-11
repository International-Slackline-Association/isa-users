import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  colors,
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

import { organizationApi } from 'app/api/organization-api';
import { ButtonWithConfirmation } from 'app/components/ButtonWithConfirmation';

export function Members() {
  const { data: users, isLoading: isUsersLoading } =
    organizationApi.useGetUsersOfOrganizationQuery();

  const [approveUser, { isLoading: isApprovingUser }] = organizationApi.useApproveUserMutation();

  const [removeUser, { isLoading: isRemovingUser }] = organizationApi.useRemoveUserMutation();

  const removeUserClicked = (userId: string) => {
    removeUser(userId);
  };

  const approveUserClicked = (userId: string) => {
    approveUser(userId);
  };

  const StatusCell = (props: { isPendingApproval?: boolean }) => {
    return (
      <Box
        display={'flex'}
        alignItems="center"
        sx={{
          color: props.isPendingApproval ? colors.red[500] : colors.green[500],
        }}
      >
        {props.isPendingApproval ? <PauseCircleFilledIcon /> : <CheckCircleIcon />}
        <Typography
          sx={{
            ml: 0.5,
          }}
        >
          {props.isPendingApproval ? 'Pending' : 'Approved'}
        </Typography>
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader title="Members" />
      <CardContent>
        {isUsersLoading || isApprovingUser || isRemovingUser ? (
          <CircularProgress />
        ) : users?.length === 0 ? (
          <Typography>You have no members</Typography>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: colors.grey[100] }}>
              <TableRow>
                <TableCell style={{ width: '20%' }}>Email</TableCell>
                <TableCell style={{ width: '50%' }}>Name</TableCell>
                <TableCell style={{ width: '15%' }}>Status</TableCell>
                <TableCell style={{ width: '15%' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.name} {user.surname}
                  </TableCell>
                  <TableCell>
                    <StatusCell isPendingApproval={user.isPendingApproval}></StatusCell>
                  </TableCell>

                  <TableCell>
                    <ButtonWithConfirmation
                      icon={<DeleteIcon />}
                      title={'Do you want to remove this member?'}
                      confirmationText={'Remove'}
                      rejectionText={'Cancel'}
                      onConfirmation={() => {
                        removeUserClicked(user.userId);
                      }}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                    {user.isPendingApproval && (
                      <ButtonWithConfirmation
                        icon={<CheckCircleIcon />}
                        title={'Do you want to approve this member?'}
                        confirmationText={'Approve'}
                        rejectionText={'Cancel'}
                        onConfirmation={() => {
                          approveUserClicked(user.userId);
                        }}
                        size="small"
                        variant="outlined"
                        color={colors.green[500]}
                      />
                    )}
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
