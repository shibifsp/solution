import React, {useState} from 'react';
import css from '../css/Home';
import { supabase } from '../supabaseClient';

export default function Home() {

  const [name, setName] = useState("");
  const [number, setNumber] =useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {data, error} = await supabase
      .from('dealers')
      .insert([{ name, number }]);
    
    if (error) {
      console.error("Error adding student:", error.message)
    }else{
      console.log("Adding successfully")
    }

    setName('');
    setNumber('');

  }

  return (
    <div className='home'>
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
          <button type='submit'>Add</button>
        </form>
      </div>
      
    </div>
  )
}
 