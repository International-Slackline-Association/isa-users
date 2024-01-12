import { useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
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
  Typography,
  colors,
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

import { userApi } from 'app/api/user-api';
import { ButtonWithConfirmation } from 'app/components/ButtonWithConfirmation';
import { QRCodeDialog } from 'app/components/QRCodeDialog';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';

import { imageUrlFromS3Key } from '../../../../utils';

export function MyOrganizations() {
  const { isDesktop } = useMediaQuery();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('');

  const { data: organizations, isLoading: isOrganizationsLoading } =
    userApi.useGetOrganizationsOfUserQuery();
  const [leaveOrganization, { isLoading: isLeavingOrganization }] =
    userApi.useLeaveOrganizationMutation();

  const { data: membershipDocument, isLoading: isLoadingMembershipDocument } =
    userApi.useGetOrganizationMembershipDocumentQuery(selectedOrganizationId, {
      skip: selectedOrganizationId === '',
    });

  const leaveOrganizationClicked = (organizationId: string) => {
    leaveOrganization(organizationId);
  };

  const onShowQRCodeClicked = (organizationId: string) => {
    return () => {
      setSelectedOrganizationId(organizationId);
    };
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
      <CardHeader title="My Organizations" />
      <CardContent>
        {isOrganizationsLoading || isLeavingOrganization ? (
          <CircularProgress />
        ) : organizations?.length === 0 ? (
          <Typography>You are not a member of any organization</Typography>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: colors.grey[100] }}>
              <TableRow>
                <TableCell style={{ width: isDesktop ? '60%' : '50%' }}>Organization</TableCell>
                <TableCell
                  style={{
                    width: isDesktop ? '20%' : '25%',
                    textAlign: 'center',
                  }}
                >
                  Status
                </TableCell>
                <TableCell style={{ width: isDesktop ? '20%' : '25%' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizations?.map((organization) => (
                <TableRow key={organization.organizationId}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt="Organization Picture"
                        src={imageUrlFromS3Key(organization?.profilePictureS3Key)}
                        sx={{ mr: 1 }}
                      >
                        {organization.name?.substring(0, 1)}
                      </Avatar>
                      {organization.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {!organization.isPendingApproval ? (
                      <QRCodeDialog
                        color={colors.grey[800]}
                        title="Membership QR Code"
                        isLoading={isLoadingMembershipDocument}
                        content={membershipDocument?.verificationUrl ?? ''}
                        expiresAt={membershipDocument?.expiresAt ?? ''}
                        onClicked={onShowQRCodeClicked(organization.organizationId)}
                        onClose={() => {
                          setSelectedOrganizationId('');
                        }}
                      />
                    ) : (
                      <StatusCell isPendingApproval={organization.isPendingApproval}></StatusCell>
                    )}
                  </TableCell>

                  <TableCell>
                    <ButtonWithConfirmation
                      icon={<DeleteIcon />}
                      title={'Do you really want to leave this organization?'}
                      confirmationText={'Leave'}
                      rejectionText={'Cancel'}
                      onConfirmation={() => {
                        leaveOrganizationClicked(organization.organizationId);
                      }}
                      color={colors.red[500]}
                      // size="small"
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
