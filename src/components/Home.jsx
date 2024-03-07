import React, {useState, useEffect, useContext} from 'react'
import { Col, Container, FormControl, Row, Form, Dropdown, DropdownButton, Button, InputGroup, Table } from 'react-bootstrap'
import { AuthContext, ExpenseContext, IncomeContext } from '../context/AuthContext'
import axios from 'axios';
import checkAuthCookie from '../components/hooks/checkAuthCookie';
import ExpenseRow from './ExpenseRow';
import IncomeRow from './IncomeRow';
import { VictoryChart, VictoryBar, VictoryPie, VictoryGroup, VictoryTheme, VictoryAxis } from 'victory';
import Chart from 'react-google-charts';



function Home() {
  const {state} = useContext(AuthContext);
  const {checkIfCookieExists} = checkAuthCookie()
  
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0)
  const [balance, setBalance] = useState(0);
  const [showForm, setShowForm] = useState(false)
  const [formSelection, setFormSelection] = useState('expenseForm')
  const [incomeSource, setIncomeSource] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('')
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategorySelection, setExpenseCategorySelection] = useState('Select category');
  const [doneLoading, setDoneLoading] = useState(false)
  const [showExpenseChart, setShowExpenseChart] = useState(false)
  const [data, setData] = useState([]);
  const [google, setGoogle] = useState([])
  

  
  async function handleExpenseSubmit(e){
    e.preventDefault()
    if(expenseAmount > 0 && expenseDescription && expenseCategorySelection !== 'Select category'){
    try {
      const newExpense = await axios.post(`http://localhost:3001/api/expense/create-expense`, {
        user: state.user.id,
        amount: expenseAmount,
        description: expenseDescription,
        category: expenseCategorySelection
      })
      setExpenses([...expenses,newExpense.data.newExpense])
      setExpenseAmount(0)
      setExpenseDescription('')
      setExpenseCategorySelection('Select category')
      setShowForm(false)
    } catch (error) {
      console.log(error);
    }
  }else{
    alert('Please enter all information.')
  }
  }
  useEffect(() => {
    console.log(state);
    const id = state && state.user ? state.user.id : '';
      async function getUserData(){
        try {
          const userData = await axios.get(`http://localhost:3001/api/user/get-data/${id}`)
          console.log(userData);
          console.log(userData.data.income);
          setIncome(userData.data.income)
          setExpenses(userData.data.expenses)
          setDoneLoading(true)
          
          
          
          
        } catch (error) {
          console.log(error);
        }
        
      }
      if(id){
        getUserData()
        
      }
      
      
  }, [state])
  
  
  
  useEffect(() => {
    if(doneLoading && income.length > 0){
    let total = income.reduce((a, {amount})=>a + amount, 0)
    setIncomeTotal(total)
    }
    
    
  }, [income])
  
  useEffect(() => {
    if(doneLoading && expenses.length >0){
    let total = expenses.reduce((a, {amount})=>a + parseInt(amount), 0)
    setExpenseTotal(total)
    
    
    // let newArr = Array.from(expenses.reduce((m, {category, amount})=>m.set(category, (m.get(category) || 0)+ amount), new Map), ([category, amount])=>({category, amount}))
    const sumByKey = (arr, key, value) => {
      const grouped = Map.groupBy(arr, o => o[key]);
      return Array.from(
        grouped.values(),
        group => group.reduce((acc, obj) => ({...obj, [value]: (acc[value] ?? 0) + obj[value]}), {})
      );
    }

    let newArr = sumByKey(expenses, 'category', 'amount')
    
    let googArr = newArr.map(e=>{
      return [e.category, e.amount]
    })
    let arr = newArr.map((e, i)=>{
      return {x: i, y: e.amount, label: e.category}
  })
    googArr.unshift(['Category', 'Amount'])
    setData(arr)
    setGoogle(googArr)
    }
    
    
  }, [expenses])
  

  

  function handleCheckedChange(e){
    if(e.target.checked){
      setFormSelection(e.target.value)
    }
  }

  async function handleIncomeSubmit(e){
    e.preventDefault()
    if(incomeAmount > 0 && incomeSource){
      try {
        const newIncome = await axios.post('http://localhost:3001/api/income/add-income', {
          user: state.user.id,
          source: incomeSource,
          amount: incomeAmount
        })
        
        setIncome([...income, newIncome.data.newIncome])
        setShowForm(false)
        setIncomeAmount('')
        setIncomeSource('')
      } catch (error) {
        console.log(error);
      }
    }else{
      alert('Please enter all information.')
    }
  }

  function renderRadioButtons(){
    return (
      <Form className='d-flex justify-content-center'>
        
      <Form.Check onChange={handleCheckedChange} value='expenseForm' style={{margin: '10px'}} name='typeSelection' defaultChecked='true' type='radio' label='Expense' />
      <Form.Check onChange={handleCheckedChange} value='incomeForm' name='typeSelection' style={{margin: '10px'}}  type='radio' label='Income' />
      
    </Form>
    )
    
  }

  
  
  function renderExpenseForm(){
    return (
      
      
      <div className='d-flex justify-content-center'>
            <Form  style={{ width: '40vw'}}>
              <Form.Control className='m-2' required placeholder='Description' type='text' onChange={(e)=>setExpenseDescription(e.target.value)} value={expenseDescription} />
              <InputGroup className='m-2'>
              <InputGroup.Text className=''>Amount</InputGroup.Text>
              <Form.Control  required value={expenseAmount} onChange={(e)=>setExpenseAmount(e.target.value)} type='number' min='0' placeholder='' />
              </InputGroup>
              <InputGroup className='m-2'>
              <DropdownButton  variant='warning' as={FormControl} required title='Category' onSelect={(e)=>setExpenseCategorySelection(e)}>
                <Dropdown.Item eventKey='Housing'>Housing</Dropdown.Item>
                <Dropdown.Item eventKey='Utilities'>Utilities</Dropdown.Item>
                <Dropdown.Item eventKey='Transportation'>Transportation</Dropdown.Item>
                <Dropdown.Item eventKey='Groceries'>Groceries</Dropdown.Item>
                <Dropdown.Item eventKey='Shopping'>Shopping</Dropdown.Item>
                <Dropdown.Item eventKey='Eating Out'>Eating Out</Dropdown.Item>
                
                <Dropdown.Item eventKey='Other'>Other</Dropdown.Item>
              </DropdownButton>
              <FormControl disabled  placeholder={expenseCategorySelection}/>
              </InputGroup>
              <Button variant='outline-info' className='m-2' onClick={handleExpenseSubmit} type='submit'>Add Expense</Button>
            </Form>
              
            </div>
            
    )
  }

  function renderIncomeForm(){
    return (
      <div className='d-flex justify-content-center'>
    <Form className='d-flex flex-column align-items-center' style={{margin: '10px', width: '30vw'}}>
    <Form.Group>
      <Form.Control className='m-2' value={incomeSource} onChange={(e)=>setIncomeSource(e.target.value)} type='text' placeholder='Source of Income' />
      <InputGroup className='m-2'>
      <InputGroup.Text >Amount</InputGroup.Text>
      <Form.Control onChange={(e)=>setIncomeAmount(e.target.value)} type='number' value={incomeAmount} min='0' placeholder='' />
      </InputGroup>
    </Form.Group>
    <Button variant='outline-info' className='m-2' onClick={handleIncomeSubmit} type='submit'>Add Income</Button>
  </Form>
  
  </div>
    )
  }

  
  
  

  function initialRender(){
    return (
      
        <Container>
          
          
          <Container style={{marginTop: '5vh'}} >
            <Row  className='text-center d-flex align-items-center'>
              <Col>{<h1 style={{marginLeft: 50, color: 'gold'}}>Balance : <span style={{color: 'blue'}}>$</span><span style={{color: 'white'}}>{incomeTotal- expenseTotal}</span></h1>}</Col>
              <Col>
              {showForm ? <Button onClick={()=>setShowForm(false)} variant='outline-warning'>Cancel</Button> : <Button role='button' variant='outline-info' onClick={()=>setShowForm(true)}>Add</Button>}
              
              </Col>
            </Row>
            </Container>
          <Container>
            {showForm ? renderRadioButtons() : ''}
            {showForm && formSelection === 'expenseForm' ? renderExpenseForm() : ''}
            {showForm && formSelection === 'incomeForm' ? renderIncomeForm() : ''}
            
            
            
          </Container>
          <div className='d-flex justify-content-center'>
            <div style={{marginTop: 25}}>
          <Chart chartType='PieChart' data={google} options={{chartArea: {width: 520, height: 420}, is3D: true, backgroundColor: '#000000', colors: ['purple', 'cyan', 'blue', 'gold', 'blueviolet', 'deeppink', 'fuchsia'], legend: {textStyle: {color: 'white'}, position: 'right', alignment: 'center'}, titleTextStyle: {color: 'white'}}}  /></div>
          {/* <VictoryPie
          style={{
            labels: {
              fontSize: '16',
              fill: '#FFFFFF',
              stroke: 'transparent'
            }
          }}
          labels={({datum})=>datum.category}
          height={'300'}
          margin='10'
          colorScale={[ "cyan", "navy", "purple", "deeppink", "gold", "blueviolet" ]} data={data}/> */}
          <div style={{maxWidth: 300}}>
          <VictoryChart theme={VictoryTheme.material}  domainPadding={{x: 170}}>
          <VictoryAxis dependentAxis style={{tickLabels: {fill: '#FFFFFF'}, grid: {stroke: 'none'}}}/>
            <VictoryAxis style={{grid: {stroke: 'transparent'}, ticks: {stroke: 'transparent'}, tickLabels: {fill: 'none'}}}/>
            
            
          <VictoryGroup   animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
            }}>
              <VictoryBar  style={{data: {fill: '#A020F0'}, labels: {fill: '#FFFFFF'}}} data={[{x: 'Income', y: incomeTotal, label: 'Income'}]} />
              <VictoryBar   style={{data: {fill: '#00FFFF'}, labels: {fill: '#FFFFFF'}}} data={[{x: 'Expenses', y: expenseTotal, label: 'Expenses'}]}/>
              
            </VictoryGroup>
          </VictoryChart>
          </div>
          </div>
        </Container>
    
    )
  }
  
  return (
    <div className='text-center bg-black text-light' style={{width: '100vw', height: '92vh', overflow: 'scroll'}}>
    {doneLoading ? initialRender() : ''}
    <Container className='d-flex justify-content-center'>
    <div style={{marginTop: '2vh', width: '100vw'}} className='d-flex justify-content-evenly  '>
      
    <div>
    <Table  variant='dark' striped bordered hover size='sm'>
      <thead>
      <tr>
        <th colSpan={5}>Expenses</th>
      </tr>
      </thead>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>*</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp, i)=>{
          return (
            <ExpenseContext.Provider key={`${exp._id}pro`} value={{exp, num: i, expenses, setExpenses}}>
            <ExpenseRow key={exp._id}/>
            </ExpenseContext.Provider>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={3}>Total</th>
          <th >{expenseTotal}</th>
          <th></th>
        </tr>
      </tfoot>
    </Table>
    </div>
    
    <div >
    
    <Table  variant='dark' striped bordered hover size='sm'>
      <thead>
      <tr>
        <th colSpan={5}>Income</th>
      </tr>
      </thead>
      <thead>
        <tr>
          <th>#</th>
          <th colSpan={2}>Source</th>
          <th>Amount</th>
          <th>*</th>
        </tr>
      </thead>
      <tbody>
        {income.map((inco, i)=>{
          return (
            <IncomeContext.Provider key={`${inco._id}pro`} value={{inco, income, setIncome, num: i}}>
              <IncomeRow key={inco._id} />
            </IncomeContext.Provider>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={3}>Total</th>
          <th>{incomeTotal}</th>
          <th></th>
        </tr>
      </tfoot>
    </Table>
    
    </div>
    </div>
    </Container>
    </div>
  )
}

export default Home