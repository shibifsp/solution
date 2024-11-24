import React, {useState, useEffect} from 'react';
import '../css/calculation.css'
import supabase from '../Config/supabaseClient';
import { useParams } from 'react-router-dom';

export default function Calculation() {

  const {name} = useParams();

  const [error, setError] = useState();
  const [fetchDatas, setFetchDatas] = useState([]);
  const [total, setTotal] = useState (0)
  const [datas, setDatas] = useState([
    {
      info: "",
      amount: "", 
      type: "",
    }
  ]);

  const handleChange = (index,field,value) => {
    const updatedData = [...datas]
    updatedData[index][field] = value;
    setDatas(updatedData);
  };


  const postData = async (e) => {
    e.preventDefault()

    const { data, error}  = await supabase
      .from('calculations')
      .insert(datas)

    if(!error){
      setError(null);
      setDatas([{info: "", amount: "", type:""}])
      fetchData()
    } else {
      setError("please fill all in correctly..")
    }
  };


  const fetchData = async () => {
    const { data, error } = await supabase
      .from('calculations')
      .select('*')
      setFetchDatas(data)
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
    setTotal(totalAmount)
  }

  const clearData = async () => {
    const {data, error} = await supabase
      .from('calculations')
      .delete()
      .neq('id', 0)
    
    if(!error){
      setFetchDatas([])
      setTotal(0)
    } else {
      console.error("Error clearing data", error)
    }
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
                    <button>Add</button>
                    <button>Delete</button>
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
                  <td>{fData.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
