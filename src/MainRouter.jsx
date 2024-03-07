import React, {useContext, useEffect} from 'react';
import {Route, Routes} from 'react-router-dom'
import Login from './components/Login';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import checkAuthCookie from './components/hooks/checkAuthCookie';
import { AuthContext} from './context/AuthContext';
import SignUp from './components/SignUp';
import Profile from './components/Profile';

function MainRouter() {
    const {logUserIn, checkIfCookieExists} = checkAuthCookie()
    const {state, dispatch} = useContext(AuthContext)
    useEffect(() => {
      if(checkIfCookieExists()){
        logUserIn()
      }
      
      
      
    }, [])
    

    
  return (
    <>
      
        <Navbar/>
        
        <Routes>
            <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>} />
            <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
            
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<SignUp/>} />
        </Routes>
    </>
  )
}


export default MainRouter