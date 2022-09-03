import React,{Suspense} from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { authUrl, setupUrl, initializeUrl, dashboardUrl } from './constants/app_urls';


import Preloader from './widgets/Preloader';

import SetupScreen from './screens/Setup';
import Authentication from './screens/Authentication';
import DashboardLayout from './layout/DashboardLayout';

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


                <Route
                    path={dashboardUrl}
                    element={<DashboardLayout/>}
                >

                    <Route path={""} index element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home />
                        </Suspense>
                    } />

                    <Route path={"home"} index element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home />
                        </Suspense>
                    } />

                    <Route path={"admission"} exact element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home />
                        </Suspense>
                    } />

                    <Route path={"sets"} exact element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home />
                        </Suspense>
                    } />

                    <Route path={"session"} exact element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home />
                        </Suspense>
                    } />
                </Route>
                
            </Routes>
        </HashRouter>
    )
}

export default AppRoutes;