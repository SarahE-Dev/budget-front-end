import React, {useContext} from 'react';
import { Route, Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import checkAuthCookie from './hooks/checkAuthCookie';



const PrivateRoute = ({children}) => {
    const {checkIfCookieExists} = checkAuthCookie()
    if(checkIfCookieExists()){
        return children
    }else {
        return <Navigate to='/login' />
    }

}

export default PrivateRoute