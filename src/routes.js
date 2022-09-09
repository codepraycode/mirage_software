import React,{Suspense} from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { authUrl, setupUrl, initializeUrl, dashboardUrl, settingsUrl } from './constants/app_urls';


import Preloader from './widgets/Preloader';

import SetupScreen from './screens/Setup';
import Authentication from './screens/Authentication';
import DashboardLayout from './layout/DashboardLayout';
import SettingsLayout from './layout/SettingsLayout';
import SetsLayout from './layout/SetLayout';


const Initialization = React.lazy(()=> import ('./screens/Initialization'));
const Home = React.lazy(() => import('./screens/Home'));
const Admission = React.lazy(() => import('./screens/Admission'));
const Settings = React.lazy(() => import('./screens/settings'));
const Sets = React.lazy(() => import('./screens/Sets'));


const OpenedSet = React.lazy(() => import('./pages/OpenedSet'));
const AdmissionForm = React.lazy(() => import('./pages/AdmissionForm'));
const Students = React.lazy(() => import('./pages/Students'));
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


                    <Route
                        path={"sets"}
                        element={<SetsLayout />}
                    >

                        <Route path={""} index element={
                            <Suspense fallback={<Preloader type={"module_loader"} />}>
                                <Sets />
                            </Suspense>
                        } />

                        <Route path={":setId"} index element={
                            <Suspense fallback={<Preloader type={"module_loader"} />}>
                                <Students />
                            </Suspense>
                        } />

                    </Route>

                    <Route path={"session"} exact element={
                        <Suspense fallback={<Preloader type={"module_loader"} />}>
                            <Home />
                        </Suspense>
                    } />
                </Route>

                <Route path={`${dashboardUrl}/admission/:setId/new`} exact element={
                    <Suspense fallback={<Preloader type={"module_loader"} />}>
                        <AdmissionForm />
                    </Suspense>
                } />


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