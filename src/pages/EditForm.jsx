import React from 'react'

export default function EditForm( onSave ) {
  return (
    <div className='edit-form'>
      <form action="">
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          id='name'
          placeholder='Enter Name'
          required
        />
        <label htmlFor="number">Mobile No:</label>
        <input 
          type="number" 
          placeholder="Enter Mobile number" id="number" 
          required
        />
        <label htmlFor="place">Place:</label>
        <input 
          type="text"
          id='place'
          placeholder='Place (Optional)'
        />
        <label htmlFor="email">Email:</label>
        <input type="email" id='email' placeholder='Email (Optional)' />
        <button onClick={onSave}>Save</button>
      </form>
    </div>
  )
}
