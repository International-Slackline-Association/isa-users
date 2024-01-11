import React from 'react';

import { Button, Dialog, DialogContent, Typography } from '@mui/material';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const CustomPopup = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          textDecoration: 'underline',
          textDecorationColor: (theme) => theme.palette.text.secondary,
        }}
      >
        <Typography variant="subtitle2" color={(theme) => theme.palette.text.secondary}>
          {props.title}
        </Typography>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>{props.children}</DialogContent>
      </Dialog>
    </>
  );
};
