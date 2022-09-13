import React,{useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CreateAccount from '../pages/CreateAccount';
import CreateUser from '../pages/CreateUser';

import '../scss/auth_style.scss';

import { getSettingsSchool } from '../app/settingsSlice';
import { getUsers } from '../app/userSlice';
import { useNavigate } from 'react-router-dom';
import { loginUrl } from '../constants/app_urls';

const Initialization = ()=>{
    let stageIndex = 1;

    const navigate = useNavigate();

    const school = useSelector(getSettingsSchool);
    const any_user = useSelector(getUsers);


    let headerText = "Setup App";


    if (!Boolean(school)) {
        headerText = "Setup school";
        stageIndex = 1;
    }
    else {
        headerText = "Add account";
        stageIndex = 2;
    }

    const renderFormSection = () => {
        if (!Boolean(school)) {
            headerText = "Setup school";
            stageIndex = 1;
            return <CreateAccount />
        }
        else {
            headerText = "Add account";
            stageIndex = 2;
            return <CreateUser/>
        }

    }

    useEffect(()=>{
        if (Boolean(any_user) && any_user?.length >= 1) {
            navigate(loginUrl, { replace: true });
            return;
        }
    })

    return (
        <div className="auth_screen">
            <div className="container register">

                <div className="row">
                    <div className="col-md-3 register-left">
                        <img src="./assets/logo.png" alt="Mirage School Software" />
                        <h3>Welcome</h3>
                        <p>Take a few steps to quickly setup</p>
                    </div>

                    <div className="col-md-9 register-right">
                        <div className="headings">
                            <h3 className="register-heading">
                                {headerText}
                            </h3>

                            <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <span
                                        className={`nav-link ${stageIndex === 1 ? 'active' : ''}`}
                                    >
                                        School
                                    </span>
                                </li>

                                <li className="nav-item">
                                    <span
                                        className={`nav-link ${stageIndex === 2 ? 'active' : ''}`}
                                    >
                                        User
                                    </span>
                                </li>

                            </ul>
                        </div>
                        <div className="tab-content" id="myTabContent">
                            {
                                renderFormSection()
                            }


                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
};


export default Initialization;