import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { getDate, parseFileUrl, EllipsizeText } from '../constants/utils';

// import Notification from './notification';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthUser, logOut } from '../app/userSlice';
import { getSettingsSchool } from '../app/settingsSlice';
import { image_placeholder } from '../constants/assets';
import { loginUrl, profileSettingsUrl, settingsUrl } from '../constants/app_urls';


const Navbar = () => {

    let navigate = useNavigate();

    const auth_details = useSelector(getAuthUser);
    const school = useSelector(getSettingsSchool);

    const storeDispatch = useDispatch();
    

    const handleBackNav = (e = null) => {
        if (e) {
            e.preventDefault();
        }
        navigate(-1)
    }

    const handleLogout = (e)=>{
        e.preventDefault();

        storeDispatch(logOut());
        navigate(loginUrl, {replace:true});

    }

    let there_is_previous = true;//false
    // console.log(props);
    // const { profile, auth_details, auth_logout } = props;

    return (
        <nav className="navbar navbar-expand-lg main-navbar">

            <Link
                className="navbar-brand mr-auto"
                to="/"
                onClick={(e) => { e.preventDefault(); }}>
                {
                    school?.short_name ?
                        EllipsizeText(school?.short_name, 18) :
                        EllipsizeText(school?.name, 18)
                }
            </Link>


            <ul className="navbar-nav navbar-right">


                <li className="help"
                >
                    <a
                        href="/"
                        onClick={handleBackNav}
                        className={`nav-link nav-link-lg ${!there_is_previous ? 'disabled' : ''}`}
                        style={{ cursor: `${!there_is_previous ? 'default' : 'pointer'}` }}

                    >

                        <i className="fa fa-arrow-circle-left" aria-hidden="true"></i>
                    </a>
                </li>


                <li className="dropdown">
                    <a
                        href="/"
                        data-toggle="dropdown"
                        className="nav-link dropdown-toggle nav-link-lg nav-link-user"
                    >
                        <img
                            alt={`${auth_details.first_name}'s passport`}
                            src={parseFileUrl(auth_details.avatar)}
                            onError={
                                ({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = image_placeholder;
                                }
                            }
                            className="rounded-circle mr-1"
                        />

                        <span className="d-sm-none d-lg-inline-block">
                            {EllipsizeText(auth_details.first_name)}
                        </span>
                    </a>

                    <div className="dropdown-menu dropdown-menu-right">
                        <div className="dropdown-title text-muted">
                            <small>Logged in {getDate(auth_details.last_logged_in)}</small>
                        </div>

                        <Link
                            // onClick={(e)=>{e.preventDefault();}}  
                            to={profileSettingsUrl}
                            className="dropdown-item has-icon"
                            target="_blank"
                        >
                            <i className="far fa-user"></i>
                            Profile
                        </Link>

                        <Link
                            to={settingsUrl}
                            // onClick={(e)=>{e.preventDefault();}} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dropdown-item has-icon"
                        >
                            <i className="fas fa-cog"></i>
                            Settings
                        </Link>

                        <div className="dropdown-divider"></div>

                        <Link
                            onClick={handleLogout}
                            to="/"
                            className="dropdown-item has-icon text-danger"
                        >
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </Link>
                    </div>

                </li>

            </ul>
        </nav>
    );
};

export default Navbar;