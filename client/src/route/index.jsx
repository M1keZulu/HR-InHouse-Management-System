import React from 'react';

import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { firebase_app } from '../data/config';
import axios from 'axios';
import { configureFakeBackend, authHeader, handleResponse } from '../services/fack.backend';
import Callback from '../auth/callback';
import Loader from '../layout/loader';
import { authRoutes } from './AuthRoutes';
import LayoutRoutes from './LayoutRoutes';
import Signin from '../auth/signin';
import PrivateRoute from './PrivateRoute';
import { classes } from '../data/layouts';

const Routers = () => {

        const abortController = new AbortController();
        const [currentUser, setCurrentUser] = useState(false);
        const jwt_token = localStorage.getItem('token');
        const defaultLayoutObj = classes.find(item => Object.values(item).pop(1) === 'compact-wrapper');
        const layout = {home: "compact-wrapper modern-type"} || Object.keys(defaultLayoutObj).pop();
        const [isAuth, setIsAuth] = useState(false);

        useEffect(() => {
                const requestOptions = { method: 'GET', headers: authHeader() };
                fetch('/users', requestOptions).then(handleResponse)
                firebase_app.auth().onAuthStateChanged(setCurrentUser);
                console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
                console.disableYellowBox = true;
                axios.get('http://127.0.0.1:8000/user/getAuth', { headers: { 'x-access-token': jwt_token } })
                        .then((response) => {
                                if(response.data.status===true){
                                        setIsAuth(true);
                                }
                        })
                        .catch((error) => {
                                console.log(error);
                        });
                        
                return function cleanup() {
                        abortController.abort();
                }

        }, [abortController]);

        return (
                <BrowserRouter basename={'/'}>
                        <>
                                <Suspense fallback={<Loader />}>
                                        <Routes>
                                                <Route path={'/'} element={<PrivateRoute />}>
                                                        {isAuth ?
                                                                <>
                                                                        <Route exact
                                                                                path={`${process.env.PUBLIC_URL}` }
                                                                                element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard/home`} />}
                                                                        />
                                                                </> : ''}
                                                        <Route path={`/*`} element={<LayoutRoutes />} />
                                                </Route>
                                               
                                                {authRoutes.map(({ path, Component }, i) => (
                                                        <Route path={path} element={Component} key={i} />
                                                ))}
                                        </Routes>
                                </Suspense>
                        </>
                </BrowserRouter>
        );
};

export default Routers;