import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CompaniesList from './pages/companies/CompaniesList';
import RegisterCompany from './pages/companies/RegisterCompany';
import EditCompany from './pages/companies/EditCompany';
import ShowCompany from './pages/companies/ShowCompany';
import LoginUser from './pages/users/LoginUser';
import RegisterUser from './pages/users/RegisterUser';
import LogoutUser from './pages/users/LogoutUser';
import UserProfile from './pages/users/UserProfile';
import InvitesList from './pages/invites/InvitesList';
import UploadImage from './pages/UploadImage';
import Home from './pages/Home';
import Cookies from 'js-cookie';
import verifyToken from './utils/auth/verifyToken.jsx';
import { useSelector } from 'react-redux';

const App = () => {
  const token = Cookies.get('jwt');
  verifyToken(token);

  // @ts-ignore Get userId state from Redux store
  const userId = useSelector((state) => state.userId);

  // TODO: [MERNSTACK-163] Redirect user from routes other then /, /login and /register if user is not logged in
  if (userId) {
    // Get the pending invites for the user

    return (
      // Routes when the user is logged in
      <Routes>
        {/* / route, render homepage*/}
        <Route path='/' element={<Home />} />
        {/* TESTROUTE: test image uploading */}
        <Route path='/upload-image' element={<UploadImage />} />
        {/* User profile page route, render user profile page */}
        <Route path='/profile' element={<UserProfile />} />
        {/* /logout route, render user logout page */}
        <Route path='/logout' element={<LogoutUser />} />
        {/* /companies/* routes */}
        <Route path='/companies' element={<CompaniesList />} />
        <Route path='/companies/register' element={<RegisterCompany />} />
        <Route path='/companies/edit/:id' element={<EditCompany />} />
        <Route path='/companies/details/:id' element={<ShowCompany />} />
        {/* /invites/* routes */}
        <Route path='/invites' element={<InvitesList />} />
      </Routes>
    );
  } else {
    return (
      // Routes when no user is logged in
      <Routes>
        {/* / route, render homepage*/}
        <Route path='/' element={<Home />} />
        {/* /login route, render user login page */}
        <Route path='/login' element={<LoginUser />} />
        {/* /register route, render user register page */}
        <Route path='/register' element={<RegisterUser />} />
      </Routes>
    );
  }
};

export default App;
