import React,{Suspense} from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { authUrl, setupUrl, initializeUrl, dashboardUrl, settingsUrl } from './constants/app_urls';


import Preloader from './widgets/Preloader';

import SetupScreen from './screens/Setup';
import Authentication from './screens/Authentication';
import DashboardLayout from './layout/DashboardLayout';
import SettingsLayout from './layout/SettingsLayout';


const Initialization = React.lazy(()=> import ('./screens/Initialization'));
const Home = React.lazy(() => import('./screens/Home'));
const Admission = React.lazy(() => import('./screens/Admission'));
const OpenedSet = React.lazy(() => import('./pages/OpenedSet'));


const Settings = React.lazy(() => import('./screens/settings'));
const SettingPage = React.lazy(() => import('./pages/SettingsPage'));


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

                    <Route path={"home"} exact element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home />
                        </Suspense>
                    } />

                    <Route path={"admission"} exact element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Admission />
                        </Suspense>
                    } />
                    <Route path={"admission/:setId"} exact element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <OpenedSet />
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


                <Route
                    path={settingsUrl}
                    element={<SettingsLayout />}
                >

                    <Route path={""} index element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Settings />
                        </Suspense>
                    } />

                    <Route path={":section"} index element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <SettingPage />
                        </Suspense>
                    } />

                </Route>
                
            </Routes>
        </HashRouter>
    )
}

export default AppRoutes;