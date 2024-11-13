import React, {useState} from 'react'
import supabase from '../Config/supabaseClient';
import '../css/LogIn.css'

export default function LogIn() {

  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
     .from('dealers')
     .insert([{name, number}])
   
    if (!error){
      setFormError(null);
      setName('');
      setNumber('');
    } else {
      setFormError("Please fil all in correctly..")
    }
  }

  return (
    <div className='login'>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input 
            className='name'
            type="text" 
            placeholder='Enter the name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            className='phNumber'
            type="text"
            placeholder='Enter number'
            value={number}
            onChange={(e) => setNumber(e.target.value)} 
            required
          />
          <button type='submit'>Open/Add</button>
        </form>
      </div>
    </div>
  )
}
