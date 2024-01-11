import { Button } from '@mui/material';

export const CannotAccessInfo = () => {
  return (
    <div>
      <strong>Having problems accesing your account?</strong>
      <p>There might be several reasons why you cannot access your account. For example:</p>
      <ul>
        <li>You have not yet verified your email and therefore you cannot reset your password.</li>
        <li>Your account is disabled.</li>
      </ul>
      <p>
        In such cases, please contact us via email (click below). You <b>need</b> to attach your
        email address that you are registered with to the email!
      </p>
      <Button
        variant="contained"
        href={`mailto:${'account@slacklineinternational.org'}?subject=${encodeURIComponent(
          'Cannot Access My ISA Account',
        )}&body=${encodeURIComponent('My email address is: ... \n')}`}
      >
        Contact Us
      </Button>
    </div>
  );
};
