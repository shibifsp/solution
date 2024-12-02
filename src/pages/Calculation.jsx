import React, {useState, useEffect} from 'react';
import '../css/calculation.css'
import supabase from '../Config/supabaseClient';
import { useParams } from 'react-router-dom';
import CustomAlert from './CustomAlert';

export default function Calculation() {

  const {id} = useParams();

  const [error, setError] = useState();
  const [fetchDatas, setFetchDatas] = useState([]);
  const [total, setTotal] = useState (0)
  const [name, setName] = useState();
  const [datas, setDatas] = useState([
    {
      info: "",
      amount: "", 
      type: "",
      coustomer_id: id,
    }
  ]);
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    const fetchName = async () => {
      const { data: fetchName, error: nameError } = await supabase
        .from('dealers')
        .select('name')
        .eq('id',id)
        .single()
      
      if(nameError){
        console.error(error)
      } else {
        setName(fetchName.name)
      } 

    
      const { data: fetchSum, error: sumError } = await supabase
        .from('calculations')
        .select("*")
        .eq('coustomer_id', id)
      
      if(sumError) {
        console.log('fetch sum is error', sumError);
      } else {
        calculateSum(fetchSum);
        setFetchDatas(fetchSum);
      }
    };

    if(id){
      fetchName();
    }  
  },[id])

  const handleChange = (index,field,value) => {
    const updatedData = [...datas]
    updatedData[index][field] = value;
    setDatas(updatedData);
  };


  const postData = async (e) => {
    e.preventDefault()

    const validRows = datas.filter(row => row.info && row.amount && row.type)
    if(validRows.length === 0){
      setError("Please fill atleast one row..");
    }

    const { data, error}  = await supabase
      .from('calculations')
      .insert(validRows) 

    if(!error){
      setError(null);
      setDatas([{info: "", amount: "", type:"", coustomer_id: id}])
      fetchData()
    } else {
      setError("please fill all in correctly..")
    }
  };


  const fetchData = async () => {
    const { data, error } = await supabase
      .from('calculations')
      .select('*')
      .eq('coustomer_id', id)
      
    if(error){
      console.error('Fetch Error', error);
    } else {
      console.log('Fetch Data:', data);
      setFetchDatas(data )
      calculateSum(data)
    }
  } 

 

  const calculateSum = (data) => {  
    const totalAmount = data.reduce((total, item) => {
      const amount = parseFloat(item.amount)  || 0;
      if(item.type === 'C'){
        return total + amount;
      } else if (item.type === 'D'){
        return total - amount;  
      }
      return total
    },0)  
    setTotal(totalAmount);

    if(totalAmount === 0) {
      setShowAlert(true)
    }

   
  }

  const clearData = async () => {
    const {data, error} = await supabase
      .from('calculations')
      .delete()
      .eq('coustomer_id', id)
    
    if(!error){
      setFetchDatas([])
      setTotal(0)
      setShowAlert(false)
    } else {
      console.error("Error clearing data", error)
    }
  }

  const addRow = ( ) => {
    setDatas([...datas,{ info: "", amount: "", type: "", coustomer_id: id}])
  }

  const deleteRow = (index) => {
    setDatas((prevDatas) => prevDatas.filter((_,i) => i !== index))
  }
  return (
    <div className='calculation'>
      <div className="container">
        <div className="nav-bar">
          <h1>{name}</h1>
        </div>

        <div className="table-form">
          <form onSubmit={postData}>
            <div className="table-head">
              <label htmlFor='info' className="info">
                <h2>Info</h2>
              </label>  
              <label for='amount' className="info">
                <h2>Amount</h2>
              </label>
              <label for='type' className="type">
                  <h2>Type</h2>
              </label>
            </div>

            <div className="middle">
              {datas.map((row, index) => (
                <div className="row" key={index}>
                  <div className="input">
                    <input 
                      type="text" 
                      id='info'
                      value={row.info}
                      onChange={(e) => handleChange(index, 'info', e.target.value)}
                    />
                  </div>
                  <div className="input">
                    <input 
                      type="numeric"
                      id='amount'
                      value={row.amount}
                      onChange={(e) => handleChange(index, 'amount', e.target.value)} 
                    />
                    {row.amount && !/^\d*$/.test(row.amount) && (
                      <div className="error">Please enter a valid number</div>
                    )}
                  </div>
                  <div className="type-select">
                    <input 
                      type="text" 
                      id='type'
                      placeholder='D/C'
                      value={row.type}
                      onChange={(e) => handleChange(index, 'type', e.target.value)}
                    />
                  </div>
                  <div className="btn-out">
                    <button className='add' onClick={addRow}>Add</button>
                    <button className='delete' onClick={() => deleteRow(index)}>Delete</button>
                  </div>
                </div>
              ))}      
            </div>
            <div className="button">
              <button type='submit'>Submit</button>
              <button onClick={clearData}>clear</button>
            </div>
          </form>
          <div className="footer">
            <h2>Total balance</h2>
            <h2>{total}</h2>
          </div> 
        </div>
        
        {showAlert && (
          <CustomAlert 
            message="Your total balance is 0. Would you like clear the history?"
            onSure={clearData}
            onCancel={() => setShowAlert(false)}
          />
        )}


        <div className="history">
          <table>
            <thead>
              <tr>
                <th>Info</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {fetchDatas.map((fData, index) => (
                <tr key={index}>
                  <td>{fData.info}</td>
                  <td>{fData.amount}</td>
                  <td className='td_type'>{fData.type ==='D' ? 'DEBIT' : 'CREDIT'}</td>
                </tr>
              ))}
            </tbody> 
          </table>
        </div>
      </div>
    </div>
  )
}
