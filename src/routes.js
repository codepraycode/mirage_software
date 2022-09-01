import React,{Suspense} from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { authUrl, homeUrl, loginUrl } from './constants/app_urls';


import Preloader from './widgets/Preloader';

import Authentication from './screens/Authentication';

// Authentication
const Home = React.lazy(() => import('./screens/Home'));
const CreateAccount = React.lazy(() => import('./pages/CreateAccount'));


const AppRoutes = ()=>{
    return (
        <HashRouter>
            <Routes>

                <Route path={authUrl} element={<Authentication/>}/>
                <Route path={`${authUrl}/:side`} element={<Authentication />} />


                <Route 
                    path={homeUrl} 
                    element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home/>
                        </Suspense>
                    } 
                />
                
            </Routes>
        </HashRouter>
    )
}

export default AppRoutes;