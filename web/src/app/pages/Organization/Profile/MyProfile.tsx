import { useState } from 'react';
import { useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';

import { organizationApi } from 'app/api/organization-api';
import CountrySelect from 'app/components/InputField/CountrySelect';
import { InputText } from 'app/components/InputField/InputText';
import { useProfileForm } from 'app/pages/Organization/Profile/useProfileForm';
import { selectOrganizationInfo } from 'app/slices/organization/selectors';

export function MyProfile() {
  const [errorMarkedField, setErrorMarkedField] = useState<{ field: string; message: string }>();

  const userInfo = useSelector(selectOrganizationInfo);
  const form = useProfileForm();
  const [updateOrganization, { isLoading: isSaving }] =
    organizationApi.useUpdateOrganizationDetailsMutation();

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = form.validate();
    if (!result.success) {
      const error = result.errors![0];
      setErrorMarkedField({ field: error.field, message: error.message });
      // const message = `Invalid Field: "${error.field}". Reason: ${error.message}`;
      // dispatch(showErrorNotification(message));
    } else {
      setErrorMarkedField(undefined);
      updateOrganization(result.data!);
    }
  };

  return (
    <Card>
      <CardHeader title="Organization Profile" />
      {/* <Divider /> */}
      <CardContent>
        <Grid
          component={'form'}
          container
          spacing={2}
          columns={{ xs: 6, lg: 12 }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Grid item xs={6} lg={6}>
            <InputText
              label="Name"
              required
              error={errorMarkedField?.field === 'name'}
              helperText={errorMarkedField?.message}
              defaultValue={userInfo!.name}
              onChange={(v) => {
                form.setName(v);
              }}
            />
          </Grid>

          <Grid item xs={6} lg={6}>
            <InputText
              label="Contact Phone"
              error={errorMarkedField?.field === 'contactPhone'}
              helperText={errorMarkedField?.message}
              defaultValue={userInfo!.contactPhone}
              onChange={(v) => {
                form.setContactPhone(v);
              }}
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <InputText
              label="City"
              error={errorMarkedField?.field === 'city'}
              helperText={errorMarkedField?.message}
              defaultValue={userInfo!.city}
              onChange={(v) => {
                form.setCity(v);
              }}
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <CountrySelect
              defaultValue={userInfo!.country}
              onChange={(v) => {
                form.setCountry(v);
              }}
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              sx={{ margin: 1 }}
              loading={isSaving}
            >
              Save Changes
            </LoadingButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
