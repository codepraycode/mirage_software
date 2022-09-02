import React,{Suspense} from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { authUrl, setupUrl, initializeUrl } from './constants/app_urls';


import Preloader from './widgets/Preloader';

import SetupScreen from './screens/Setup';
import Authentication from './screens/Authentication';

const Initialization = React.lazy(()=> import ('./screens/Initialization'));
const Home = React.lazy(() => import('./screens/Home'));


const AppRoutes = ()=>{
    return (
        <HashRouter>
            <Routes>

                <Route path={authUrl} element={<Authentication/>}/>
                <Route path={`${authUrl}/:side`} element={<Authentication />} />

                <Route path={`${initializeUrl}`} element={<Initialization />} />


                <Route 
                    path={setupUrl} 
                    element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <SetupScreen />
                        </Suspense>
                    } 
                />
                
            </Routes>
        </HashRouter>
    )
}

export default AppRoutes;