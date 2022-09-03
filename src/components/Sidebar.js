import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { parseFileUrl } from '../constants/utils';
import { getSettingsSchool } from '../app/settingsSlice';
import { school_logo_placeholder } from '../constants/assets';
import { admissionUrl, homeUrl, sessionUrl, setsUrl } from '../constants/app_urls';

const SideBar = () => {

    const school = useSelector(getSettingsSchool);

    const [version, setVersion] = useState('x.x.x');

    const getAppVersion = async () => {
        let data = await window.api.request('app:version');

        setVersion(() => data)
    }

    useEffect(() => {
        getAppVersion()
    }, [])


    return (
        <div className="main-sidebar sidebar-style-3">
            <aside id="sidebar-wrapper">
                <div className="sidebar-brand">

                    <img
                        src={parseFileUrl(school?.logo) || school_logo_placeholder}

                        onError={
                            ({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = school_logo_placeholder;
                            }
                        }
                        alt="logo"
                        className="rounded-circle mr-1"
                    />

                </div>

                {/* <div className="sidebar-brand sidebar-brand-sm">
                    <a href="index-2.html">CP</a>
                </div> */}
                <ul className="sidebar-menu">


                    <li>
                        <NavLink className="nav-link" to={homeUrl} >
                            <i className="fas fa-school"></i>
                            <span>Overview</span>
                        </NavLink>
                    </li>



                    <li>
                        <NavLink
                            className="nav-link"
                            to={admissionUrl}
                        >
                            <i className="fas fa-folder-plus"></i>
                            <span>Admission</span>
                        </NavLink>
                    </li>


                    <li>
                        <NavLink 
                            className="nav-link" 
                            to={setsUrl}
                        >
                            <i className="fas fa-users-class"></i>
                            <span>Students</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            className="nav-link" 
                            to={sessionUrl}
                        >
                            <i className="fad fa-cabinet-filing"></i>
                            <span>Session</span>
                        </NavLink>
                    </li>

                    {/* <li><a className="nav-link" href="credits.html"><i className="fas fa-pencil-ruler"></i> <span></span></a></li> */}
                </ul>


                {/* Copyright */}
                <div className="mt-1 mb-4 p-3 copyright">
                    <b>Mirage Software</b> <b>(version {version})</b>
                    <p>Copyright &copy; 2021 | All rights reserved.</p>
                </div>
            </aside>
        </div>
    );
};

export default SideBar;