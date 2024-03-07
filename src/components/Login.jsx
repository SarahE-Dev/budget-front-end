import React, {useState, useContext, useEffect} from 'react';
import { InputGroup, Container, Form, FormControl, FormGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import checkAuthCookie from './hooks/checkAuthCookie';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';





export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const {dispatch} = useContext(AuthContext)
    const {checkIfCookieExists} = checkAuthCookie()
    
    if(checkIfCookieExists()){
        return <Navigate to='/' />
    }
    
   
    const handleOnSubmit=async(e)=>{
        e.preventDefault()
        try {
            const foundUser = await axios('http://localhost:3001/api/user/login', {
                method: 'post', 
                data: {
                username, password
                }, 
                withCredentials: true, credentials: true});
            dispatch({type: 'LOGIN',
                user: {
                username: foundUser.data.user.username,
                email: foundUser.data.user.username,
                id: foundUser.data.user.id
                
            }})
            setUsername('');
            setPassword('');
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div style={{backgroundColor: 'black', color: 'white', width: '100vw', height: '100vh', paddingTop: 100}}>
        <Container>
            <Form onSubmit={handleOnSubmit}>
            <InputGroup className='mb-3'>
            <InputGroup.Text>@</InputGroup.Text><FormControl placeholder='Username' autoComplete='username' onChange={(e)=>setUsername(e.target.value)} value={username}></FormControl></InputGroup>
            <InputGroup className='mb-3'>
            <InputGroup.Text>Password</InputGroup.Text><FormControl autoComplete='password' onChange={(e)=>setPassword(e.target.value)} value={password}></FormControl></InputGroup>
            <Button type='submit'>Submit</Button>
            </Form>
        </Container>
    </div>
  )
}
