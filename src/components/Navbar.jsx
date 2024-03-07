import React, {Suspense, useContext, useEffect, useState} from 'react'
import { Button, Container, Nav, NavItem, Navbar as NavigationBar } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'
import checkAuthCookie from './hooks/checkAuthCookie'
import axios from 'axios'
import Cookies from 'js-cookie'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'



function Navbar() {
    const {logUserIn, checkIfCookieExists} = checkAuthCookie()
    const {state, dispatch} = useContext(AuthContext)
    console.log(state);
    async function logout(){
        try {
            dispatch({type: 'LOGOUT'})
            Cookies.remove('jwt-cookie')
            const remove = await axios('http://localhost:3001/api/user/logout', {
              method: 'get', 
              withCredentials: true, credentials: true})
            console.log(remove);
        } catch (error) {
            console.log(error);
        }
    }

    
    const renderWithoutUser = () => {
      return (
        <Nav>
          <Nav.Link as={NavLink} to='/login'>Login</Nav.Link>
          <Nav.Link as={NavLink} to='/signup'>Signup</Nav.Link>
        </Nav>
      )
    }

    const renderWithUser = () => {
      return (
        <Nav variant=''>
          <Nav.Link as={NavLink} className='' to='/profile'>{state.user.username}</Nav.Link>
          <Nav.Link onClick={logout}>Logout</Nav.Link>
        </Nav>
      )
    }
    
    
    
  return (
    <NavigationBar data-bs-theme='dark' bg='dark' style={{width: '100vw', height: '8vh'}} className=''>
      <Container>
    <NavigationBar.Brand as={NavLink} style={{color: 'white', textShadow: '1px -1px 2px gold'}} to='/'> <FontAwesomeIcon icon={faDollarSign} style={{color: 'blue', marginRight: '5px'}} />Budget App</NavigationBar.Brand>
       {state && state.user ? renderWithUser() : renderWithoutUser()} 
       </Container> 
    </NavigationBar>
  )
}

export default Navbar