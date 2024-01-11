import { useState } from 'react';
import QRCode from 'react-qr-code';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';

import { useMediaQuery } from 'utils/hooks/useMediaQuery';

interface Props {
  title?: string;
  isLoading?: boolean;
  onClicked: () => void;
  onClose: () => void;
  content?: string;
  expiresAt?: string;
  disabled?: boolean;
  color?: string;
}

export const QRCodeDialog = (props: Props) => {
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const { isDesktop } = useMediaQuery();

  const onClicked = () => {
    setOpenConfirmation(true);
    props.onClicked();
  };

  const close = () => {
    setOpenConfirmation(false);
    props.onClose();
  };

  return (
    <>
      <Button
        color="primary"
        onClick={onClicked}
        disabled={Boolean(props.disabled)}
        sx={{
          color: props.color,
          borderRadius: 0,
          padding: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            maxWidth: '2rem',
          }}
        >
          <QrCode2Icon sx={{ width: '100%', height: '100%' }} />
          <Typography variant="caption" fontSize={'0.4rem'}>
            Display Verification
          </Typography>
        </Box>
      </Button>

      <Dialog open={openConfirmation}>
        <DialogContent>
          {props.isLoading ? (
            <CircularProgress />
          ) : (
            props.content && (
              <Stack alignItems={'center'} spacing={1}>
                <Typography variant="body1">Verification QR Code</Typography>
                <QRCode
                  title={props.title}
                  size={256}
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: isDesktop ? '80%' : '100%',
                  }}
                  value={props.content}
                  viewBox={`0 0 256 256`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(props.content || '');
                  }}
                >
                  Copy to clipboard
                </Button>
                <Typography
                  sx={{
                    color: (theme) => theme.palette.grey[600],
                    textAlign: 'center',
                  }}
                  variant="caption"
                >
                  Scan this qr code to verify your membership.
                  {props.expiresAt ? `It will be valid until ${props.expiresAt}.` : ''}
                </Typography>
                {/* <Link
                  href={props.content}
                  color="inherit"
                  variant="caption"
                  sx={{
                    fontSize: '0.6rem',
                    maxWidth: '80%',
                  }}
                >
                  {props.content}
                </Link> */}
              </Stack>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={close}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
