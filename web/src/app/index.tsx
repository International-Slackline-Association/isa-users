import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';

import { amplifyConfig } from 'amplifyConfig';
import { organizationApi } from 'app/api/organization-api';
import { userApi } from 'app/api/user-api';
import { MainLayout } from 'app/components/MainLayout';
import NotificationSnackbar from 'app/components/NotificationSnackbar';
import { OrganizationMembersPage } from 'app/pages/Organization/Members/Loadable';
import { OrganizationCertificates } from 'app/pages/Organization/OrganizationCertificates/Loadable';
import { OrganizationProfilePage } from 'app/pages/Organization/Profile/Loadable';
import { SignIn } from 'app/pages/SignIn';
import { UserCertificates } from 'app/pages/User/UserCertificates/Loadable';
import { appActions, useAppSlice } from 'app/slices/app';
import {
  selectAuthState,
  selectCurrentUserInfo,
  selectSnackbarNotification,
} from 'app/slices/app/selectors';
import { AuthState } from 'app/slices/app/types';
import { useOrganizationSlice } from 'app/slices/organization';
import { useUserSlice } from 'app/slices/user';
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes, getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

import { withErrorHandler } from './components/error-handling';
import AppErrorBoundaryFallback from './components/error-handling/fallbacks/App';
import { UserProfilePage } from './pages/User/Profile/Loadable';
import { UserOrganizationsPage } from './pages/User/UserOrganizations/Loadable';

export function App() {
  useAppSlice();
  useUserSlice();
  useOrganizationSlice();

  const dispatch = useDispatch();

  const authState = useSelector(selectAuthState);
  const currentUserInfo = useSelector(selectCurrentUserInfo);
  const snackbarNotification = useSelector(selectSnackbarNotification);

  const isIndividual = currentUserInfo?.identityType === 'individual';
  const isOrganization = currentUserInfo?.identityType === 'organization';

  userApi.useGetUserDetailsQuery(undefined, { skip: !isIndividual });
  organizationApi.useGetOrganizationDetailsQuery(undefined, {
    skip: !isOrganization,
  });

  useEffect(() => {
    Amplify.configure(amplifyConfig);
    Hub.listen('auth', async ({ payload: { event } }) => {
      console.log('event', event);
      switch (event) {
        case 'signedIn':
          dispatch(appActions.updateAuthState(AuthState.SignedIn));
          break;
        case 'signedOut':
          dispatch(appActions.updateAuthState(AuthState.SignedOut));
          break;
        default:
          break;
      }
    });
    getCurrentUser()
      .then(async () => {
        dispatch(appActions.updateAuthState(AuthState.SignedIn));
      })
      .catch(() => dispatch(appActions.updateAuthState(AuthState.SigningOut)));
  }, [dispatch]);

  useEffect(() => {
    console.log('authState', authState);
    if (authState === AuthState.SignedIn) {
      getCurrentUser().then(async () => {
        const attributes = await fetchUserAttributes();
        const identityType = (attributes['custom:identityType'] as IdentityType) || 'individual';
        dispatch(appActions.updateIdentityType(identityType));
        dispatch(appActions.updateCognitoAttributes(attributes));
      });
      // .catch(() => {
      //   dispatch(appActions.updateAuthState(AuthState.SigningOut));
      // });
    } else if (authState === AuthState.SigningOut) {
      signOut();
    }
  }, [authState, dispatch]);

  const signInClicked = () => {
    dispatch(appActions.updateAuthState(AuthState.SigningIn));
    signInWithRedirect();
  };

  const onSnackbarClose = () => {
    dispatch(appActions.updateSnackbarNotification(null));
  };

  const MainApp = () => {
    return (
      <Routes>
        {isIndividual && <Route path="/user/profile" element={<UserProfilePage />} />}
        {isIndividual && <Route path="/user/organizations" element={<UserOrganizationsPage />} />}

        {isIndividual && <Route path="/user/certificates" element={<UserCertificates />} />}

        {isOrganization && (
          <Route path="/organization/profile" element={<OrganizationProfilePage />} />
        )}

        {isOrganization && (
          <Route path="/organization/members" element={<OrganizationMembersPage />} />
        )}

        {isOrganization && (
          <Route path="/organization/certificates" element={<OrganizationCertificates />} />
        )}

        {isIndividual && <Route path="*" element={<Navigate to="/user/profile" />} />}
        {isOrganization && <Route path="*" element={<Navigate to="/organization/profile" />} />}
      </Routes>
    );
  };

  const isLoading =
    authState === AuthState.Loading ||
    authState === AuthState.SigningIn ||
    authState === AuthState.SigningOut ||
    (authState === AuthState.SignedIn && !currentUserInfo?.email);

  return (
    <BrowserRouter>
      <Helmet>
        <meta name="description" content="ISA Account" />
      </Helmet>
      <GlobalStyles styles={{ body: { fontFamily: 'Lato' } }} />
      <MainLayout>
        {isLoading ? (
          <CircularProgress size="4rem" style={{ position: 'fixed', top: '45%', left: '45%' }} />
        ) : authState !== AuthState.SignedIn ? (
          <SignIn signInClicked={signInClicked} />
        ) : (
          <MainApp />
        )}
      </MainLayout>
      <NotificationSnackbar snackbarNotification={snackbarNotification} onClose={onSnackbarClose} />
    </BrowserRouter>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
