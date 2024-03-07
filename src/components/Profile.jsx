import React, {useContext, useState, useEffect} from 'react'
import { AuthContext } from '../context/AuthContext'
import { Form , Button, FormControl, Container} from 'react-bootstrap'
import axios from 'axios'

export default function Profile() {
    const {state, dispatch} = useContext(AuthContext)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [isEditable, setIsEditable] = useState(false)
    useEffect(() => {
      if(state && state.user){
        setEmail(state.user.email)
        setUsername(state.user.username)
      }
    }, [state])

    async function updateUserProfile(){
      if(username && email){
        try {
          const foundUser = await axios(`http://localhost:3001/api/user/update-user/${state.user.id}`, {
            method: 'put', 
            data: {
            username, email
            }, 
            withCredentials: true, credentials: true});
        dispatch({type: 'LOGIN',
            user: {
            username: foundUser.data.user.username,
            email: foundUser.data.user.email,
            id: foundUser.data.user.id
            
        }})
        setUsername('');
        setEmail('');
        setIsEditable(false)
        } catch (error) {
          console.log(error);
        }
      }
      
    }
    
  return (
    <div className='d-flex align-items-center' style={{backgroundColor: 'black', height: '92vh', color: 'white'}}>
        <Container>
          <h1 style={{color: 'blueviolet', textShadow: '1px -2px 2px deeppink'}} className='text-center m-4'>Profile</h1>
          <div className='d-flex justify-content-center m-4'>
          <Form style={{width: '50vw'}}>
            <FormControl className='m-3' {...(isEditable ? '' : {disabled: true})} onChange={(e)=>setUsername(e.target.value)} value={username} />
            <FormControl className='m-3' {...(isEditable ? '' : {disabled: true})} onChange={(e)=>setEmail(e.target.value)} value={email} />
          </Form>
          </div>
          <div className='d-flex justify-content-center m-4'>
          {isEditable ? <Button variant='warning' onClick={updateUserProfile}>Done</Button> : <Button variant='info' onClick={()=>setIsEditable(true)}>Edit</Button>}
          </div>
        </Container>
    </div>
  )
}
