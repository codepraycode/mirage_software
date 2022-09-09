import React from 'react';
import { Outlet } from 'react-router-dom';
import '../scss/sets.scss';

const SetsLayout = () => {


    return <>
        <Outlet />
    </>

}

export default SetsLayout;