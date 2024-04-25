import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';

import { amplifyConfig } from 'amplifyConfig';
import { userApi } from 'app/api/user-api';
import { MainLayout } from 'app/components/MainLayout';
import NotificationSnackbar from 'app/components/NotificationSnackbar';
import { SignIn } from 'app/pages/SignIn';
import { UserCertificates } from 'app/pages/User/UserCertificates/Loadable';
import { appActions, useAppSlice } from 'app/slices/app';
import { selectAuthState, selectSnackbarNotification } from 'app/slices/app/selectors';
import { AuthState } from 'app/slices/app/types';
import { useUserSlice } from 'app/slices/user';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

import { withErrorHandler } from './components/error-handling';
import AppErrorBoundaryFallback from './components/error-handling/fallbacks/App';
import { UserProfilePage } from './pages/User/Profile/Loadable';
import { selectUserInfo } from './slices/user/selectors';

export function App() {
  useAppSlice();
  useUserSlice();

  const dispatch = useDispatch();

  const authState = useSelector(selectAuthState);
  const currentUserInfo = useSelector(selectUserInfo);
  const snackbarNotification = useSelector(selectSnackbarNotification);

  userApi.useGetUserDetailsQuery(undefined, { skip: authState !== AuthState.SignedIn });

  useEffect(() => {
    Amplify.configure(amplifyConfig);
    Hub.listen('auth', async ({ payload: { event } }) => {
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
    if (authState === AuthState.SigningOut) {
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
        <Route path="/user/profile" element={<UserProfilePage />} />
        <Route path="/user/certificates" element={<UserCertificates />} />
        <Route path="*" element={<Navigate to="/user/profile" />} />
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
