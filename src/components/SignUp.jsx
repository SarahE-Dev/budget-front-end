import React, {useState, useContext, useEffect} from 'react';
import { InputGroup, Container, Form, FormControl, FormGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import checkAuthCookie from './hooks/checkAuthCookie';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';





export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const [emailAdd, setEmailAdd] = useState('')
    const {dispatch} = useContext(AuthContext)
    const {checkIfCookieExists} = checkAuthCookie()
    
    if(checkIfCookieExists()){
        return <Navigate to='/' />
    }
    
   
    const handleOnSubmit=async(e)=>{
        e.preventDefault()
        try {
            const createdUser = await axios('http://localhost:3001/api/user/create-user', {
                method: 'post', 
                data: {
                username, password,
                email: emailAdd
                }, 
                withCredentials: true, credentials: true});
            dispatch({type: 'LOGIN',
                user: {
                username: createdUser.data.user.username,
                email: createdUser.data.user.username,
                id: createdUser.data.user._id
                
            }})
            setUsername('');
            setPassword('');
            setEmailAdd('');
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div style={{backgroundColor: 'black', color: 'white', width: '100vw', height: '100vh', paddingTop: 100}}>
        <Container>
            <Form onSubmit={handleOnSubmit}>
            <InputGroup className='mb-3'>
            <InputGroup.Text>Username</InputGroup.Text><FormControl autoComplete='username'  onChange={(e)=>setUsername(e.target.value)} value={username}></FormControl></InputGroup>
            <InputGroup className='mb-3'>
            <InputGroup.Text>Email</InputGroup.Text><FormControl autoComplete='email' onChange={(e)=>setEmailAdd(e.target.value)} value={emailAdd}></FormControl></InputGroup>
            <InputGroup className='mb-3'>
            <InputGroup.Text>Password</InputGroup.Text><FormControl autoComplete='password' onChange={(e)=>setPassword(e.target.value)} value={password}></FormControl></InputGroup>
            <Button type='submit'>Submit</Button>
            </Form>
        </Container>
    </div>
  )
}
