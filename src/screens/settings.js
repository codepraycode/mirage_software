import React from 'react';
import { Link } from 'react-router-dom';
import { appSettingsUrl, levelsSettingsUrl, profileSettingsUrl, schoolSettingsUrl, sessionsSettingsUrl, staffsSettingsUrl } from '../constants/app_urls';


const Settings = () => {

    let body = document.getElementsByTagName('body')[0];
    // console.log(body.classList.contains('layout-4'));
    if (body.classList.contains('layout-4')) {
        body.classList.replace('layout-4', 'layout-3');
    }

    return (
        <div className="main-wrapper container-fluid">

            {/* Main Left Sidebar Menu */}
            <div className="main-content settings-content">
                <div className='mx-3'>
                    <h2 className="section-title">Settings</h2>
                    {/* <p className="section-lead">Organize and adjust all hsettings.</p> */}

                    <div className="row">

                        <div className="col-md-6">
                            <Link
                                to={schoolSettingsUrl}

                                className="card card-large-icons"
                            >
                                <div className="card-icon bg-primary text-white">
                                    <i className="fas fa-school    "></i>
                                </div>
                                <div className="card-body">
                                    <h4>School</h4>
                                    <p>School profile and users settings</p>
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-6">
                            <Link
                                to={staffsSettingsUrl}
                                className="card card-large-icons">
                                <div className="card-icon bg-primary text-white">
                                    <i className="fas fa-user    "></i>
                                </div>
                                <div className="card-body">
                                    <h4>Staffs and Roles</h4>
                                    <p>School staffs and role settings</p>
                                    {/* <a href="/settings/details" className="card-cta">Change Setting <i className="fas fa-chevron-right"></i></a> */}
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-6">
                            <Link
                                to={sessionsSettingsUrl}
                                className="card card-large-icons">
                                <div className="card-icon bg-primary text-white">
                                    <i className="fas fa-server    "></i>
                                </div>
                                <div className="card-body">
                                    <h4>Sessions and Reports</h4>
                                    <p>School sessions,Terms, report settings, performance grades and behavioural scalings </p>
                                    {/* <a href="/settings/details" className="card-cta">Change Setting <i className="fas fa-chevron-right"></i></a> */}
                                </div>
                            </Link>
                        </div>


                        <div className="col-md-6">
                            <Link
                                to={levelsSettingsUrl}
                                className="card card-large-icons"
                            >
                                <div className="card-icon bg-primary text-white">
                                    <i className="fas fa-users-class"></i>
                                </div>
                                <div className="card-body">
                                    <h4>Levels and Subjects</h4>
                                    <p>School levels, levels classrooms, and subjects settings</p>
                                    {/* <a href="/settings/details" className="card-cta">Change Setting <i className="fas fa-chevron-right"></i></a> */}
                                </div>
                            </Link>
                        </div>


                        <div className="col-md-6">
                            <Link
                                to={profileSettingsUrl}
                                className="card card-large-icons">
                                <div className="card-icon bg-primary text-white">
                                    <i className="fas fa-file-invoice"></i>
                                </div>
                                <div className="card-body">
                                    <h4>Profile and Activities</h4>
                                    <p>Logged in user Profile, activity logs</p>
                                    {/* <a href="/settings/details" className="card-cta">Change Setting <i className="fas fa-chevron-right"></i></a> */}
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-6">
                            <Link
                                to={appSettingsUrl}
                                className="card card-large-icons">
                                <div className="card-icon bg-primary text-white">
                                    <i className="fas fa-cog"></i>
                                </div>
                                <div className="card-body">
                                    <h4>App</h4>
                                    <p>Prefenrences, about the app, developer's contact</p>

                                </div>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}


export default Settings;