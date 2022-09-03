import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import { getPhaseName } from '../constants/app_urls';



// import {ipcRenderer } from 'electron';
// const {ipcRenderer} = window.require('electron')

const DashboardLayout = (props) => {

    let body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('layout-3')) {
        body.classList.replace('layout-3', 'layout-4');
    }


    const {pathname} = useLocation();


    const headerName = getPhaseName(pathname);


    return (

        <div className="main-wrapper main-wrapper-1">
            <div className="navbar-bg"></div>
            {/* App top Navbar */}
            <Navbar />

            {/* Main Left Sidebar Menu */}

            <SideBar {...props} />


            {/* App Content */}

            <div className="main-content">
                <section className="section">

                    <div className="section-header">
                        <h1>{headerName}</h1>
                    </div>

                    <div className="section-body">
                        <Outlet/>
                    </div>

                </section>
            </div>

        </div>

    )

}



export default DashboardLayout;