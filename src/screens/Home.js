import React, { useEffect } from 'react'
import { initializeUrl, loginUrl, newUserUrl } from '../constants/app_urls';
import {Link, useNavigate} from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();


  const navToInitializeScreen = ()=>{
    navigate(initializeUrl);
  }

  useEffect(()=>{
    navToInitializeScreen();
  });


  return (
    <div>
        <h1>Home</h1>


        <div>
            <Link to={loginUrl}>
                Login
            </Link>

              <Link to={newUserUrl}>
                  Create Account
              </Link>
        </div>
    </div>
  )
}

export default Home