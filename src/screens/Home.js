import React from 'react'
import { loginUrl, newUserUrl } from '../constants/app_urls';
import {Link} from 'react-router-dom';

const Home = () => {
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