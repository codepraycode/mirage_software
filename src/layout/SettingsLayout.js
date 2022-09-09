import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { getSetUpdateStatus } from '../app/setSlice';


const SettingsLayout = () => {

    return <>
        <Outlet/>
    </>

}

export default SettingsLayout;