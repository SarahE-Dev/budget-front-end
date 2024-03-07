import React, {useContext, useState, useEffect} from 'react'
import { IncomeContext } from '../context/AuthContext'
import { Button, Modal, Dropdown, DropdownButton, Form } from 'react-bootstrap'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashAlt, faEdit} from '@fortawesome/free-solid-svg-icons'

export default function IncomeRow() {
    const {inco, num, income, setIncome} = useContext(IncomeContext);
    const [show, setShow] = useState(false);
    const [source, setSource] = useState(inco.source);
    const [amount, setAmount] = useState(inco.amount);
    useEffect(() => {
        if(!show){
          setAmount(inco.amount)
          setSource(inco.source)
        }
      }, [show])
    async function deleteIncome(id){
        
        try {
            const deleted = await axios.put(`http://localhost:3001/api/income/delete-income`, {
                user: inco.user,
                id: inco._id
            })
            let updatedArray = income.filter(e=>e._id !== id)
            setIncome(updatedArray)
        } catch (error) {
            console.log(error);
        }
    
    }

    async function handleIncomeUpdate(){
        if(source.length > 0 && amount > 0){
        try {
            const updatedIncome = await axios.put(`http://localhost:3001/api/income/update-income/${inco._id}`, {
                source,
                amount
            })
            console.log(updatedIncome);
            let updatedArr = income.map((e)=>{
                if(e._id === inco._id){
                    e.source = source;
                    e.amount = amount
                }
                return e
            })
            setIncome(updatedArr)
            setShow(false)
        } catch (error) {
            console.log(error);
        }
    }
    }
  return (
    <>
    <tr>
        <td>{num+1}</td>
        <td colSpan={2}>{inco.source}</td>
        <td>{inco.amount}</td>
        <td style={{width: 30}}>
            <div className='d-flex'>
            <Button variant='outline-warning' size='sm' onClick={()=>setShow(true)}><FontAwesomeIcon icon={faEdit} /></Button>
            <Button onClick={()=>deleteIncome(inco._id)} style={{marginLeft: '5px'}} variant='outline-info' size='sm'><FontAwesomeIcon icon={faTrashAlt} /></Button>
            </div>
        </td>
    </tr>
    <Modal className='my-modal' centered show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Income</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Control onChange={(e)=>setSource(e.target.value)} value={source} />
                    </Form>
                    <Form.Control onChange={(e)=>setAmount(e.target.value)} type='number' min='0' value={amount} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setShow(false)} variant='secondary'>Close</Button>
                    <Button onClick={handleIncomeUpdate} variant='success'>Save Changes</Button>
                </Modal.Footer>
            </Modal>
    </>
  )
}
