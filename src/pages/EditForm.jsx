import React,{ useState, useEffect } from 'react';
import '../css/EditForm.css';
import supabase from '../Config/supabaseClient';

export default function EditForm({ onSave, id }) {

  const [editingData, setEditingData] = useState([
    {
      name:"",
      number:"",
      place:"",
      email:""
    }
  ])

  useEffect(() => {
    const fetchValue = async () => {
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .eq('id', id)

      if(error) {
        console.log("fetchValue is not Fetched", error)
      } else {
        setEditingData(data && data.length > 0 ? data[0] : {name:"", number:"", place:"", email:""})
      }
    }
    fetchValue();
  },[id])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prevEditingData => ({
      ...prevEditingData,
      [name]: value
    }))
  }

  const postEditedData = async () => {

    const { data, error } = await supabase
      .from('dealers')
      .update(editingData)
      .eq('id', id)

    if(error) {
      console.log("Posting data is error..",error)
    } else {
      setEditingData({name:"", number:"", place:"", email:""});
      onSave();
    }
      
  }

  return (
    <div className='edit-form'>
      <form onSubmit={postEditedData}>
        <div className="form-row">
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id='name'
            name='name'
            placeholder={"Enter Name"}
            value={editingData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="number">Mobile No:</label>
          <input 
            type="tel" 
            placeholder={ "Enter Number"}
            id="number" 
            name='number'
            value={editingData.number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="place">Place:</label>
          <input 
            type="text"
            id='place'
            name='place'
            placeholder={'Place (Optional)'}
            value={editingData.place}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id='email'   
            name='email' 
            placeholder='Email (Optional)'
            value={editingData.email}
            onChange={handleInputChange}
          />
        </div>
         
        <div className="form-button">
          <button type="submit">Save</button>
        </div>
        
      </form>
    </div>
  )
}
