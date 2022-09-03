import React,{useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';

import CreateUser from '../pages/CreateUser';
import Login from '../pages/Login';


import '../scss/auth_style.scss';
import { getAuthUser } from '../app/userSlice';
import { homeUrl } from '../constants/app_urls';



const Authentication = ()=>{
    const {side} = useParams();
    const navigate = useNavigate();

    const authUser = useSelector(getAuthUser);


    const handleAfterAuth = ()=>{
        if(!Boolean(authUser)) return


        navigate(homeUrl, {replace:true});
    }


    useEffect(()=>{
        handleAfterAuth();
    })

    if(side === 'new'){
        return <CreateUser instant={true}/>
    }
    
    return <Login />
    
}

export default Authentication;