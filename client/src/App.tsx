import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ServerHealthStatus from './Pages/ServerHealthStatus/ServerHealthStatus';
import Welcome from './Pages/Welcome';
import SignUp from './Pages/auth/SignUp/SignUp';
import SignIn from './Pages/auth/SignIn/SignIn';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import ForgotPassword from './Pages/auth/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/auth/ResetPassword/ResetPassword';
import Error from './Pages/Error/Error';
import EmailConfirmation from './Pages/auth/EmailConfirmation/EmailConfirmation';

const App: React.FC = () => {
  return (
    <>
      <Toaster reverseOrder={false} />

      <Routes>
        <Route path="/health" element={<ServerHealthStatus />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/app" element={<Outlet />}>
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="confirmation" element={<EmailConfirmation />} />
          <Route path="confirmation/:token" element={<EmailConfirmation />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route path="account" element={<Outlet />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default App;
