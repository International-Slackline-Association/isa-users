import React, { ChangeEventHandler, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { organizationApi } from 'app/api/organization-api';
import { userApi } from 'app/api/user-api';
import { selectCurrentUserInfo } from 'app/slices/app/selectors';
import { uploadData } from 'aws-amplify/storage';
import copy from 'clipboard-copy';
import { imageUrlFromS3Key, showErrorNotification } from 'utils';

const allowedFileTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/heic', 'image/webp'];
export const Profile = () => {
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const userInfo = useSelector(selectCurrentUserInfo);

  const dispatch = useDispatch();

  const name: string = userInfo?.name ?? '';
  const surname: string = (userInfo || {})['surname'] || '';

  const [updateUserProfilePicture, { isLoading: isUpdatingUser }] =
    userApi.useUpdateUserProfilePictureMutation();

  const [updateOrganizationProfilePicture, { isLoading: isUpdatingOrganization }] =
    organizationApi.useUpdateOrganizationProfilePictureMutation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onImageChange: ChangeEventHandler<any> = async (e) => {
    if (e.target.files) {
      const file = e.target.files[0] as File;
      if (file) {
        if (!allowedFileTypes.includes(file.type)) {
          dispatch(
            showErrorNotification(`Allowed image types are: ${allowedFileTypes.join(', ')}`),
          );
          e.target.value = null;
          return;
        }

        setIsUpdatingImage(true);
        const { key } = generateS3Key(file.type);
        uploadData({
          key,
          data: file,
          options: {
            accessLevel: 'public' as any,
            contentType: file.type,
          },
        })
          .result.then(() => {
            setIsUpdatingImage(false);
            updateProfilePicture(`public/${key}`);
          })
          .catch((error) => {
            console.error(error);
            setIsUpdatingImage(false);
            dispatch(
              showErrorNotification(
                'Uploading failed for unknown reason: Try with a smaller image file please',
              ),
            );
          })
          .finally(() => {
            e.target.value = null;
          });
      }
    }
  };

  const generateS3Key = (imageType: string) => {
    const folder = userInfo?.isaId ?? `anynomous/${new Date().toISOString()}`;
    const ext = imageType.split('/')[1];
    const randomId = Math.random().toString(36).substring(2, 8);
    return {
      key: `isa-users/${folder}/${randomId}.${ext}`,
    };
  };

  const updateProfilePicture = (s3Key: string | null) => {
    if (userInfo?.identityType === 'individual') {
      updateUserProfilePicture({ processingBucketKey: s3Key });
    } else if (userInfo?.identityType === 'organization') {
      updateOrganizationProfilePicture({ processingBucketKey: s3Key });
    }
    setIsUpdatingImage(false);
  };

  const removeClicked = () => {
    updateProfilePicture(null);
  };

  return (
    <Stack spacing={1}>
      <Stack direction={'row'} spacing={0}>
        <input
          accept={allowedFileTypes.join(', ')}
          id="contained-button-file"
          multiple
          type="file"
          onChange={onImageChange}
          style={{ display: 'none' }}
        />
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'profile-picture-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {isUpdatingImage || isUpdatingUser || isUpdatingOrganization ? (
            <CircularProgress />
          ) : (
            <Avatar
              sx={{
                width: '60px',
                height: '60px',
                borderStyle: 'solid',
                borderColor: (theme) => theme.palette.primary.contrastText,
              }}
              alt="Profile Picture"
              src={imageUrlFromS3Key(userInfo?.profilePictureS3Key)}
            >
              {name.substring(0, 1)} {surname?.substring(0, 1)}
            </Avatar>
          )}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="profile-picture-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
          <MenuItem>
            <ListItemIcon>
              <AddPhotoAlternateIcon fontSize="small" />
            </ListItemIcon>
            <label htmlFor="contained-button-file">Upload Profile Picture</label>
          </MenuItem>
          <MenuItem onClick={removeClicked}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Remove Profile Picture
          </MenuItem>
        </Menu>
        <Stack spacing={0} justifyContent={'center'} alignItems={'baseline'}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="h6">{surname}</Typography>
        </Stack>
      </Stack>
      <Box
        sx={{
          // borderRadius: 1,
          // borderWidth: 1,
          // borderStyle: 'solid',
          // borderColor: theme => theme.palette.primary.contrastText,
          paddingLeft: 1,
        }}
      >
        <Typography variant="caption">ISA ID: </Typography>
        <Typography variant="caption" sx={{}}>
          <b>{userInfo?.isaId}</b>
        </Typography>
        <Tooltip title={'Copy to clipboard'}>
          <IconButton onClick={() => copy(userInfo?.isaId ?? '')} size="small" color="inherit">
            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
};
