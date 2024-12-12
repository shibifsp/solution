import React, {useState} from 'react'
import supabase from '../Config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../css/LogIn.css'

export default function LogIn() {

  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [formError, setFormError] = useState(null)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
     .from('dealers')
     .insert([{name, number}])
   
    if (!error){
      setFormError(null);
      setName('');
      setNumber('');

      navigate('/');
    } else {
      setFormError("Please fil all in correctly..")
    }
  }

  return (
    <div className='container-login'>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Name:</label>
          <input 
            className='name'
            type="text" 
            placeholder='Enter the name'
            id='fullName'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="phNumber">Phone No:</label>
          <input 
            className='phNumber'
            type="text"
            id='phNumber'
            placeholder='Enter number'
            value={number}
            onChange={(e) => setNumber(e.target.value)} 
            required
          />
          <button type='submit'className='login'>
              Add
          </button>
        </form>
      </div>
    </div>
  )
}
