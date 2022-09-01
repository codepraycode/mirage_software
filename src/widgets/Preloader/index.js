import React from 'react';
import Loading from './loading';
import ModuleLoader from './module_loader';
import Spinner from './spinner';
import ThreeDots from './three_dots';

import './preloader.scss';

/* 
    Preloader Module 
    required props
    - type -- supports 'module_loader', 'spinner', 'dots'. defaults to Loading
    - text [optional] -- Text to show on loading(for preloaders that supports it)
*/
const Preloader = ({type,...rest}) => {
    // Determine the type of preloader to use
    const renderLoader = () =>{
        let content = null;

        switch(type){
            case 'module_loader': // Preloader to render Modules
                content = <ModuleLoader {...rest}/>
                break;
            case 'spinner': // Preloader for proccessing
                content = <Spinner {...rest}/>
                break;
            case 'dots': // Preloader for awaiting response
                content = <ThreeDots {...rest}/>
                break;
            default:// Default Loading Preloader
                content = <Loading {...rest}/>;
                break;
        }


        return content;
    }

    return (
        <>
            {renderLoader()}
        </>
    );
};

export default Preloader;