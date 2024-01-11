import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Button, Card, CardContent, CardHeader, Stack } from '@mui/material';

import { InputText } from 'app/components/InputField/InputText';
import { appActions } from 'app/slices/app';
import { selectCurrentUserInfo, selectIsVerifyingEmail } from 'app/slices/app/selectors';
import { confirmUserAttribute, sendUserAttributeVerificationCode } from 'aws-amplify/auth';
import { showErrorNotification, showInfoNotification } from 'utils';

export function WarningInfo() {
  const dispatch = useDispatch();

  const [verificationCode, setVerificationCode] = React.useState('');

  const currentUserInfo = useSelector(selectCurrentUserInfo);
  const isVerifyingEmail = useSelector(selectIsVerifyingEmail);

  const resendVerificationEmail = async () => {
    try {
      await sendUserAttributeVerificationCode({ userAttributeKey: 'email' });
      dispatch(appActions.updateEmailVerifying(true));
      dispatch(showInfoNotification('Verification email sent'));
    } catch (err) {
      console.log(err);
      dispatch(showErrorNotification('Cannot send verification email'));
    }
  };

  const submitVerificationCode = async () => {
    if (verificationCode) {
      try {
        await confirmUserAttribute({
          userAttributeKey: 'email',
          confirmationCode: verificationCode,
        });
        dispatch(showInfoNotification('Email verified'));
        dispatch(
          appActions.updateCognitoAttributes({
            email_verified: 'true',
            sub: currentUserInfo!.cognitoAttributes!.sub,
          }),
        );
      } catch (err) {
        console.log(err);
        dispatch(showErrorNotification('Cannot verify email'));
      }
    }
  };

  return (
    <Card>
      <CardHeader title="Actions Required" />
      <CardContent>
        <Stack spacing={1}>
          <Stack direction={'row'} spacing={1}>
            <Alert severity="warning">
              You MUST verify your email address before your account is suspended!
            </Alert>

            <Button
              variant="contained"
              size="small"
              onClick={resendVerificationEmail}
              disabled={isVerifyingEmail}
            >
              Send Verification Email
            </Button>
          </Stack>
          {isVerifyingEmail && (
            <Stack direction={'row'} spacing={1}>
              <InputText
                label="Verification Code"
                placeholderText="Verification code"
                fullWidth={false}
                onChange={(v) => {
                  setVerificationCode(v);
                }}
                size="small"
              />
              <Button variant="contained" size="small" onClick={submitVerificationCode}>
                Submit
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
