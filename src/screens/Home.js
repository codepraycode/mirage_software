import React from 'react'
import { loginUrl } from '../constants/app_urls';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser, logOut } from '../app/userSlice';

const Home = () => {
  const navigate = useNavigate();

  const auth_user = useSelector(getAuthUser);
  const storeDispatch = useDispatch();


  return (
    <div>
        <h1>Home</h1>
        <p>Logged in as: {auth_user?.username} {(new Date(auth_user?.last_logged_in).toDateString())}</p>


        <div>
            <Link 
              to={loginUrl} 
              onClick={(e)=>{
                e.preventDefault();
                storeDispatch(logOut())
                navigate(loginUrl);
              }}
            >
                Logout
            </Link>
        </div>
    </div>
  )
}

export default Home