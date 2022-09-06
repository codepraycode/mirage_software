import React from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';

import SchoolSettings from '../components/SchoolSetting';
import AppUsers from '../components/AppUsers';
import StaffSettings from '../components/StaffSettings';
import RoleSettings from '../components/RoleSettings';
import SessionSettings from '../components/SessionSettings';
import GradesSettings from '../components/GradesSettings';
import AttrSettings from '../components/AttrSettings';
import ProfileSettings from '../components/ProfileSettings';
import LevelSettings from '../components/LevelSettings';


import { capitalize } from '../constants/utils';
import { appSettingsUrl, levelsSettingsUrl, profileSettingsUrl, schoolSettingsUrl, sessionsSettingsUrl, settingsUrl, staffsSettingsUrl } from '../constants/app_urls';


function Settings() {
    let { section } = useParams();
    const navigate = useNavigate();

    let body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('layout-4')) {
        body.classList.replace('layout-4', 'layout-3');
    }

    const phases = [
        { 
            tab: 'School', 
            tabId: 'school', 
            icon: 'fas fa-school', 
            link: schoolSettingsUrl
        },
        
        { 
            tab: 'Staffs and Roles', 
            tabId: 'staffs', 
            icon: 'fas fa-user', 
            link: staffsSettingsUrl,
        },

        { 
            tab: 'Sessions', 
            tabId: 'sessions', 
            icon: 'fas fa-server', 
            link: sessionsSettingsUrl,
        },

        { 
            tab: 'Levels and Subjects', 
            tabId: 'levels', 
            icon: 'fas fa-users-class', 
            link: levelsSettingsUrl,
        },

        { 
            tab: 'Profile and Activities', 
            tabId: 'profile', 
            icon: 'fas fa-file-invoice', 
            link: profileSettingsUrl,
        },

        { 
            tab: 'App', 
            tabId: 'app', 
            icon: 'fas fa-cog', 
            link: appSettingsUrl,
        }
    ]

    const renderContent = () => {
        if (section === 'school') {
            return (
                <>
                    <SchoolSettings />
                    <AppUsers/>
                </>
            )            
        }

        if (section === 'staffs') {
            return (
                <>
                    <StaffSettings />
                    <RoleSettings />
                </>
            )
        }
        if (section === 'sessions') {
            return (
                <>
                    <SessionSettings/>
                    <GradesSettings/>
                    <AttrSettings/>
                </>
            )
        }

        if (section === 'levels') {
            return <LevelSettings />
        }

        if (section === 'profile') {
            return <ProfileSettings />
        }

        return (
            <p className='text-muted text-center'>
                {capitalize(section)} Settings not available
            </p>
        )
    }

    const renderNav = () => {
        let template = phases.map((item, i) => {
            return (
                <li className="nav-item" key={i}>
                    <Link
                        to={item.link}
                        // onClick={(e)=>{e.preventDefault()}} 
                        replace={true}
                        className={`nav-link ${section === item.tabId ? 'active' : ''}`}
                    >
                        <i className={`${item.icon} text-center mr-3`}></i>
                        {capitalize(item.tab)}
                    </Link>
                </li>
            )
        });

        return (
            <div className="card-body">
                <ul className="nav nav-pills flex-column">
                    {template}
                </ul>
            </div>
        )
    }


    return (
        <div className="main-wrapper container-fluid">

            {/* Main Left Sidebar Menu */}
            <div className="main-content settings-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4">
                            <div className="card">
                                <div className="card-header text-center">
                                    <h4 
                                        className=""
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <i
                                            style={
                                                {
                                                    fontSize: '19px',
                                                    marginRight: '15px',
                                                    cursor: 'pointer'
                                                }
                                            }

                                            onClick={() => {
                                                navigate(settingsUrl,{replace:true});
                                            }}

                                            className="fa fa-arrow-left"
                                            aria-hidden="true"
                                        ></i>

                                        Mirage Software Settings
                                    </h4>
                                </div>
                                {renderNav()}
                            </div>
                        </div>


                        <div className="col-8">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Settings;
