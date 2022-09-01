import React from 'react';
import {Outlet, useParams} from 'react-router-dom';
import CreateAccount from '../pages/CreateAccount';
import Login from '../pages/Login';



const Authentication = ()=>{
    const {side} = useParams();

    let template;

    if(side === 'new'){
        template = <CreateAccount/>
    }else{
        template = <Login />
    }    

    return(
        <div>
            Authentication

            <h1>{side}</h1>

            {template}
        </div>
    )
}

export default Authentication;