import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogTitle, IconButton, Typography } from '@mui/material';

interface Props {
  buttonText?: string;
  icon?: React.ReactNode;
  confirmationText?: string;
  rejectionText?: string;
  onConfirmation: () => void;
  onRejection?: () => void;
  disabled?: boolean;
  confirmationDisabled?: boolean;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  variant?: 'contained' | 'outlined';
  color?: string;
}

export const ButtonWithConfirmation = (props: Props) => {
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);

  const reject = () => {
    setOpenConfirmation(false);
    props.onRejection?.();
  };
  const confirm = () => {
    setOpenConfirmation(false);
    props.onConfirmation();
  };

  return (
    <>
      {props.buttonText ? (
        <Button
          variant={props.variant}
          size={props.size}
          startIcon={props.icon}
          onClick={() => setOpenConfirmation(true)}
          disabled={Boolean(props.disabled)}
          sx={{
            color: props.color,
          }}
        >
          {props.buttonText}
        </Button>
      ) : (
        <IconButton
          color="primary"
          onClick={() => setOpenConfirmation(true)}
          disabled={Boolean(props.disabled)}
          sx={{
            color: props.color,
          }}
        >
          {props.icon}
        </IconButton>
      )}
      <Dialog open={openConfirmation}>
        <DialogTitle>
          {props.children ? (
            props.children
          ) : (
            <Typography>{props.title || 'Are you sure?'}</Typography>
          )}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={reject}>
            {props.rejectionText || 'No'}
          </Button>
          <Button disabled={Boolean(props.confirmationDisabled)} onClick={confirm}>
            {props.confirmationText || 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
