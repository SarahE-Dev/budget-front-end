import React, {useState} from 'react'
import Login from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import AuthContextWrapper from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from './MainRouter';
import './App.css'

export default function App() {
  return (

    <>
      <Router>
        <AuthContextWrapper>
        <MainRouter/>
        </AuthContextWrapper>
          
        
      </Router>
      </>
  )
}

