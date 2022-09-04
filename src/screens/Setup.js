import React, { useEffect } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { getSettingsError, getSettingsSchool, getSettingsStatus, loadSettings } from '../app/settingsSlice';
import { initializeUrl, loginUrl } from '../constants/app_urls';
import { statuses } from '../constants/statuses';
import { useNavigate } from 'react-router-dom';
import { loadUsers } from '../app/userSlice';

const SetupScreen = () => {
    // This screen decides login, initialization or just directly to the home screen

    const status = useSelector(getSettingsStatus);
    const error = useSelector(getSettingsError);
    const school = useSelector(getSettingsSchool);

    const storeDispatch = useDispatch();

    const navigate = useNavigate();


    const checkSetup = ()=>{
        if (status === statuses.loading) {
            return
        }

        if (status === statuses.idle) {
            // Loading for the first time
            storeDispatch(loadSettings());
            storeDispatch(loadUsers());
        }
        
        
        if (status === statuses.loaded) {
            if (!Boolean(school)) {
                navigate(initializeUrl, { replace: true });
                return
            }

            navigate(loginUrl, { replace: true });
        }
    }

    useEffect(()=>{
        checkSetup();
    });


    return (
        <div className="setup_screen">
            <div className="content">
                <h1 className='text-center'>Mirage Software</h1>
                <p className="text-center">
                    <span className='mr-3'>Loading</span>
                    <b className="spinner">
                        <i className="fad fa-spinner"></i>
                    </b>
                </p>
            </div>

        </div>
    )
};


export default SetupScreen;