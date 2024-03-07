import React, { useContext, useState, useEffect } from 'react'
import { Button, Modal, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import { ExpenseContext } from '../context/AuthContext'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashAlt, faEdit} from '@fortawesome/free-solid-svg-icons'


export default function ExpenseRow() {
    const {exp, num, expenses, setExpenses} = useContext(ExpenseContext)
    const [editable, setEditable] = useState(false);
    const [show, setShow] = useState(false)
    const [description, setDescription] = useState(exp.description)
    const [category,setCategory] = useState(exp.category)
    const [amount, setAmount] = useState(exp.amount)
    useEffect(() => {
      if(!show){
        setAmount(exp.amount)
        setCategory(exp.category)
        setDescription(exp.description)
      }
    }, [show])

    async function handleDeleteExpense(id){
        try {
            const deletedExpense = await axios.put(`http://localhost:3001/api/expense/delete-expense`, {
                user: exp.user,
                id: exp._id
            })
            let updatedExpenses = expenses.filter(e=>e._id !== id);
            console.log(deletedExpense);
            console.log(updatedExpenses);
            setExpenses(updatedExpenses)
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUpdateExpense(){
        if(amount > 0 && description.length > 0){
            try {
                const updatedExpense = await axios.put(`http://localhost:3001/api/expense/update-expense/${exp._id}`, {
                    description,
                    category,
                    amount
                })
                const updatedArray = expenses.map(e=>{
                    if(e._id === exp._id){
                        e.description = description,
                        e.amount = amount,
                        e.category = category
                    }
                    return e
                })
                console.log(updatedArray);
                setExpenses(updatedArray)
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
              <td>{exp.description}</td>
              <td>{exp.category}</td>
              <td>{exp.amount}</td>
              <td>
                <div className='d-flex'>
                <Button variant='outline-warning' size='sm' value={exp._id} onClick={(e)=>setShow(true)}><FontAwesomeIcon icon={faEdit} /></Button>
                <Button  onClick={()=>handleDeleteExpense(exp._id)} variant='outline-info' style={{marginLeft: 5}} size='sm'>
                <FontAwesomeIcon icon={faTrashAlt} /></Button>
                </div></td>
            </tr>
            <Modal className='my-modal' centered show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Control onChange={(e)=>setDescription(e.target.value)} value={description} />
                    </Form>
                    <InputGroup>
                        <DropdownButton title='Category'
                        variant='warning'
                        onSelect={(e)=>setCategory(e)}>
                            <Dropdown.Item eventKey='Housing'>Housing</Dropdown.Item>
                            <Dropdown.Item eventKey='Utilities'>Utilities</Dropdown.Item>
                            <Dropdown.Item eventKey='Transportation'>Transportation</Dropdown.Item>
                            <Dropdown.Item eventKey='Groceries'>Groceries</Dropdown.Item>
                            <Dropdown.Item eventKey='Shopping'>Shopping</Dropdown.Item>
                            <Dropdown.Item eventKey='Eating Out'>Eating Out</Dropdown.Item>
                            <Dropdown.Item eventKey='Other'>Other</Dropdown.Item>
                        </DropdownButton>
                        <Form.Control disabled value={category} />
                    </InputGroup>
                    <Form.Control onChange={(e)=>setAmount(e.target.value)} type='number' min='0' value={amount} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setShow(false)} variant='outline-light'>Close</Button>
                    <Button onClick={handleUpdateExpense} variant='outline-info'>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            </>
  )
}
